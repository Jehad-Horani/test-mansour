-- Enhanced Complete Fix for Supabase Profile Issues
-- This addresses the specific problems mentioned in the issue

-- 1. First, let's check current state and clean up
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Service role can do everything" ON profiles;
DROP POLICY IF EXISTS "users_can_view_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "service_role_full_access" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- 3. Fix table structure to match what the app expects
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN university TYPE TEXT USING university::TEXT;

-- 4. Update existing profiles with email from auth.users
UPDATE profiles 
SET email = (SELECT email FROM auth.users WHERE auth.users.id = profiles.id) 
WHERE email IS NULL OR email = '';

-- 5. Drop and recreate the trigger function with better logic
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    email,
    phone,
    university,
    major,
    year,
    role,
    subscription_tier,
    preferences,
    stats
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'مستخدم جديد'),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'university',
    NEW.raw_user_meta_data->>'major',
    NEW.raw_user_meta_data->>'year',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    'free',
    jsonb_build_object(
      'theme', 'retro',
      'language', 'ar',
      'emailNotifications', true,
      'pushNotifications', true,
      'profileVisibility', 'university'
    ),
    jsonb_build_object(
      'uploadsCount', 0,
      'viewsCount', 0,
      'helpfulVotes', 0,
      'coursesEnrolled', 0,
      'booksOwned', 0,
      'consultations', 0,
      'communityPoints', 0
    )
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    university = COALESCE(EXCLUDED.university, profiles.university),
    major = COALESCE(EXCLUDED.major, profiles.major),
    year = COALESCE(EXCLUDED.year, profiles.year),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create/update profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Create profiles for any existing auth users who don't have profiles
INSERT INTO public.profiles (
  id,
  name,
  email,
  phone,
  university,
  major,
  year,
  role,
  subscription_tier,
  preferences,
  stats
)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1), 'مستخدم جديد'),
  u.email,
  u.raw_user_meta_data->>'phone',
  u.raw_user_meta_data->>'university',
  u.raw_user_meta_data->>'major',
  u.raw_user_meta_data->>'year',
  COALESCE(u.raw_user_meta_data->>'role', 'student'),
  'free',
  jsonb_build_object(
    'theme', 'retro',
    'language', 'ar',
    'emailNotifications', true,
    'pushNotifications', true,
    'profileVisibility', 'university'
  ),
  jsonb_build_object(
    'uploadsCount', 0,
    'viewsCount', 0,
    'helpfulVotes', 0,
    'coursesEnrolled', 0,
    'booksOwned', 0,
    'consultations', 0,
    'communityPoints', 0
  )
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = COALESCE(EXCLUDED.name, profiles.name),
  updated_at = NOW();

-- 8. Enable RLS and create simple, working policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own profile
CREATE POLICY "users_can_view_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile  
CREATE POLICY "users_can_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile (important for manual creation)
CREATE POLICY "users_can_insert_own_profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Service role has full access (critical for admin operations)
CREATE POLICY "service_role_full_access" ON profiles
  FOR ALL USING (auth.role() = 'service_role');

-- 9. Create helpful indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_major ON profiles (major);
CREATE INDEX IF NOT EXISTS idx_profiles_university ON profiles (university);

-- 10. Verify the fix
SELECT 'Profile fix completed successfully!' as status,
       COUNT(*) as total_profiles,
       COUNT(email) as profiles_with_email
FROM profiles;