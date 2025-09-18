-- Create admin user in Supabase Auth and profiles table
-- This script should be run after the database is set up

-- First, let's make sure we have the admin user in the profiles table
INSERT INTO profiles (
  id,
  name,
  role,
  subscription_tier,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'مدير النظام',
  'admin',
  'premium',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = 'مدير النظام',
  subscription_tier = 'premium',
  updated_at = NOW();

-- Create a test admin user (you'll need to create this through the API)
-- Email: admin@takhassus.com
-- Password: Admin123!@#
-- This will be created through the /api/auth/create-admin endpoint
