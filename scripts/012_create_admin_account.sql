-- Create admin user account
-- Note: This will create a user in Supabase Auth and then add admin profile

-- First, we need to insert the admin user into auth.users
-- This should be done through Supabase Auth, but we'll prepare the profile

-- Insert admin profile (assuming admin user will be created through auth)
-- You'll need to replace 'ADMIN_USER_ID' with the actual UUID from Supabase Auth

-- Create a function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email TEXT,
  admin_password TEXT,
  admin_name TEXT DEFAULT 'مدير النظام',
  admin_phone TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert into auth.users (this requires superuser privileges)
  -- In production, this should be done through Supabase Auth API
  
  -- For now, we'll create a placeholder that can be updated
  -- The actual user creation should be done through the Supabase dashboard or API
  
  -- Generate a UUID for the admin user
  new_user_id := gen_random_uuid();
  
  -- Insert admin profile directly
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
    new_user_id,
    admin_name,
    admin_phone,
    'جامعة الأردن', -- Default university
    'it', -- Default major
    'admin',
    'premium',
    NOW() + INTERVAL '10 years', -- Long-term subscription
    '{"theme": "retro", "language": "ar", "emailNotifications": true, "pushNotifications": true, "profileVisibility": "private", "adminDashboard": true}',
    '{"uploadsCount": 0, "viewsCount": 0, "helpfulVotes": 0, "coursesEnrolled": 0, "booksOwned": 0, "consultations": 0, "communityPoints": 1000, "adminActions": 0}'
  );
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin user with default credentials
-- Note: You should change these credentials after first login
SELECT create_admin_user(
  'admin@takhassus.com',
  'TakhassusAdmin2024!',
  'مدير منصة تخصصكُم',
  '+962791234567'
);

-- Create admin-specific tables for system management
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'user_management', 'content_moderation', 'system_settings', 
    'financial_management', 'analytics_view', 'backup_restore'
  )),
  target_type TEXT, -- 'user', 'book', 'question', 'notebook', etc.
  target_id UUID,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin actions
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Only admins can view and insert admin actions
CREATE POLICY "Only admins can manage admin actions" ON admin_actions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create system settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for system settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage system settings
CREATE POLICY "Only admins can manage system settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_maintenance', '{"enabled": false, "message": "الموقع تحت الصيانة"}', 'Site maintenance mode'),
('registration_enabled', '{"enabled": true}', 'Allow new user registrations'),
('book_upload_enabled', '{"enabled": true, "maxSizeMB": 50}', 'Book upload settings'),
('subscription_prices', '{"standard": 10, "premium": 25, "currency": "JOD"}', 'Subscription pricing'),
('notification_settings', '{"email": true, "push": true, "sms": false}', 'Global notification settings'),
('content_moderation', '{"autoApprove": false, "requireReview": true}', 'Content moderation settings');

-- Create indexes
CREATE INDEX IF NOT EXISTS admin_actions_admin_id_idx ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS admin_actions_created_at_idx ON admin_actions(created_at);
CREATE INDEX IF NOT EXISTS system_settings_key_idx ON system_settings(setting_key);

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action_type TEXT,
  p_target_type TEXT DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT '',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  action_id UUID;
BEGIN
  INSERT INTO admin_actions (
    admin_id,
    action_type,
    target_type,
    target_id,
    description,
    metadata
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_target_type,
    p_target_id,
    p_description,
    p_metadata
  ) RETURNING id INTO action_id;
  
  -- Update admin stats
  UPDATE profiles 
  SET stats = jsonb_set(
    stats, 
    '{adminActions}', 
    (COALESCE(stats->>'adminActions', '0')::int + 1)::text::jsonb
  )
  WHERE id = auth.uid();
  
  RETURN action_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
