-- Admin and Moderation System
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'approve_content', 'ban_user', 'delete_content', 'verify_ambassador', etc.
  target_type TEXT NOT NULL, -- 'user', 'book', 'question', 'notebook', 'ambassador', etc.
  target_id UUID NOT NULL,
  reason TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'book', 'question', 'answer', 'notebook', 'profile'
  content_id UUID NOT NULL,
  report_reason TEXT CHECK (report_reason IN ('spam', 'inappropriate', 'copyright', 'fake', 'harassment', 'other')) NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings and configuration
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false, -- Whether this setting can be viewed by non-admins
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('site_maintenance', '{"enabled": false, "message": "الموقع تحت الصيانة"}', 'Site maintenance mode', true),
('max_file_size_mb', '50', 'Maximum file upload size in MB', false),
('supported_file_types', '["pdf", "docx", "pptx", "jpg", "jpeg", "png"]', 'Supported file types for uploads', false),
('default_currency', '"JOD"', 'Default currency for the platform', true),
('contact_email', '"info@takhassus.com"', 'Contact email for support', true),
('platform_commission_rate', '0.05', 'Commission rate for transactions (5%)', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Indexes for admin system
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_type ON admin_actions(target_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at);
CREATE INDEX IF NOT EXISTS idx_content_reports_reporter_id ON content_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_content_type ON content_reports(content_type);
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status);
CREATE INDEX IF NOT EXISTS idx_content_reports_created_at ON content_reports(created_at);
