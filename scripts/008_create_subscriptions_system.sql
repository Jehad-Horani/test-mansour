-- Subscription and Payment System
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_en TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'JOD',
  duration_days INTEGER NOT NULL,
  features JSONB, -- JSON object with plan features
  max_book_listings INTEGER,
  max_questions_per_month INTEGER,
  max_consultations_per_month INTEGER,
  max_notebook_uploads INTEGER,
  priority_support BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  status TEXT CHECK (status IN ('active', 'expired', 'cancelled', 'pending')) DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_renew BOOLEAN DEFAULT false,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'JOD',
  payment_method TEXT NOT NULL,
  payment_provider TEXT, -- e.g., 'stripe', 'paypal', 'bank_transfer'
  provider_transaction_id TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  metadata JSONB, -- Additional payment data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Usage tracking for subscription limits
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL, -- 'book_listing', 'question', 'consultation', 'notebook_upload'
  resource_id UUID, -- ID of the resource
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_type, resource_id)
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, name_en, description, price, duration_days, features, max_book_listings, max_questions_per_month, max_consultations_per_month, max_notebook_uploads, priority_support) VALUES
('مجاني', 'Free', 'الخطة المجانية الأساسية', 0.00, 30, '{"access_to_marketplace": true, "basic_community": true, "limited_downloads": 5}', 3, 5, 0, 2, false),
('قياسي', 'Standard', 'الخطة القياسية للطلاب', 15.00, 30, '{"access_to_marketplace": true, "full_community": true, "unlimited_downloads": true, "basic_support": true}', 10, 20, 2, 10, false),
('مميز', 'Premium', 'الخطة المميزة مع جميع المميزات', 25.00, 30, '{"access_to_marketplace": true, "full_community": true, "unlimited_downloads": true, "consultations": true, "priority_support": true, "exclusive_content": true}', -1, -1, 10, -1, true)
ON CONFLICT (name) DO NOTHING;

-- Indexes for subscription system
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires_at ON user_subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_month_year ON usage_tracking(month_year);
