-- Complete fix for Supabase registration and profile issues
-- Run this SQL in the Supabase SQL editor

-- 1. First, disable RLS temporarily to debug
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to clean slate
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Service role can do everything" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- 3. Drop and recreate the trigger function with better error handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 4. Create the new trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
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
    COALESCE(NEW.raw_user_meta_data->>'name', 'مستخدم جديد'),
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
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Create simplified RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own profile
CREATE POLICY "users_can_view_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile  
CREATE POLICY "users_can_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile (for manual creation)
CREATE POLICY "users_can_insert_own_profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Service role can do everything (for admin operations)
CREATE POLICY "service_role_full_access" ON profiles
  FOR ALL USING (auth.role() = 'service_role');

-- 7. Create profiles for existing users who don't have them
INSERT INTO public.profiles (
  id,
  name,
  phone,
  role,
  subscription_tier,
  preferences,
  stats
)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.raw_user_meta_data->>'phone',
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
ON CONFLICT (id) DO NOTHING;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles USING btree (id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles USING btree (role);
CREATE INDEX IF NOT EXISTS idx_profiles_university ON profiles USING btree (university);
CREATE INDEX IF NOT EXISTS idx_profiles_major ON profiles USING btree (major);

-- Done!
SELECT 'Fix completed! Check the results.' as status;