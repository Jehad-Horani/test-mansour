-- Fix Supabase RLS policies to resolve infinite recursion issue

-- First, drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Service role can do everything" ON profiles;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
-- Policy 1: Users can view their own profile
CREATE POLICY "users_can_view_own_profile" ON profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile  
CREATE POLICY "users_can_update_own_profile" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile (for registration)
CREATE POLICY "users_can_insert_own_profile" ON profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Policy 4: Service role has full access (for server-side operations)
CREATE POLICY "service_role_full_access" ON profiles
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Policy 5: Public read access for basic profile info (optional - remove if you want strict privacy)
-- CREATE POLICY "public_profiles_read" ON profiles
--   FOR SELECT 
--   USING (true);

-- Ensure proper permissions are set
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- Create or replace the user creation function (safe version)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert new profile with basic info from auth metadata
  INSERT INTO public.profiles (
    id,
    name,
    phone,
    university,
    major,
    year,
    role,
    subscription_tier,
    email,
    preferences,
    stats,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'مستخدم جديد'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'university',
    NEW.raw_user_meta_data->>'major',
    NEW.raw_user_meta_data->>'year',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    'free',
    NEW.email,
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
    ),
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- If insert fails, log the error but don't fail the user creation
  RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add email column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email') THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

COMMIT;