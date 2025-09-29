-- Insert admin user directly into profiles table
-- This assumes the user will be created through Supabase Auth first

-- Create admin profile with a specific UUID that matches Supabase Auth user
-- Replace this UUID with the actual one from your Supabase Auth user
INSERT INTO profiles (
  id,
  name,
  phone,
  university,
  major,
  role,
  subscription_tier,
  subscription_expires_at,
  preferences,
  stats
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, -- Replace with actual admin user UUID
  'مدير منصة تخصص.كُم',
  '+962791234567',
  'جامعة الأردن',
  'it',
  'admin',
  'premium',
  NOW() + INTERVAL '10 years',
  '{"theme": "retro", "language": "ar", "emailNotifications": true, "pushNotifications": true, "profileVisibility": "private", "adminDashboard": true}',
  '{"uploadsCount": 0, "viewsCount": 0, "helpfulVotes": 0, "coursesEnrolled": 0, "booksOwned": 0, "consultations": 0, "communityPoints": 1000, "adminActions": 0}'
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  subscription_tier = 'premium',
  subscription_expires_at = NOW() + INTERVAL '10 years',
  preferences = '{"theme": "retro", "language": "ar", "emailNotifications": true, "pushNotifications": true, "profileVisibility": "private", "adminDashboard": true}',
  stats = '{"uploadsCount": 0, "viewsCount": 0, "helpfulVotes": 0, "coursesEnrolled": 0, "booksOwned": 0, "consultations": 0, "communityPoints": 1000, "adminActions": 0}';

-- Log the admin creation action
INSERT INTO admin_actions (
  admin_id,
  action_type,
  description,
  metadata
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'system_settings',
  'تم إنشاء حساب المدير الرئيسي',
  '{"initialSetup": true, "createdAt": "' || NOW() || '"}'
);
