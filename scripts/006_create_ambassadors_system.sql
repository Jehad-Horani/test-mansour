-- Academic Ambassadors System
CREATE TABLE IF NOT EXISTS ambassadors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  specialization TEXT NOT NULL,
  university_name TEXT NOT NULL,
  college TEXT NOT NULL,
  major TEXT NOT NULL,
  gpa DECIMAL(3,2),
  graduation_year INTEGER,
  experience_years INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  currency TEXT DEFAULT 'JOD',
  bio TEXT,
  skills TEXT[], -- Array of skills
  languages TEXT[], -- Array of languages
  availability_schedule JSONB, -- JSON object for schedule
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_sessions INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.0,
  verification_documents TEXT[], -- Array of document URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS consultation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambassador_id UUID REFERENCES ambassadors(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject_area TEXT,
  session_type TEXT CHECK (session_type IN ('one_on_one', 'group', 'workshop')),
  duration_minutes INTEGER NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
  meeting_link TEXT,
  meeting_platform TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'JOD',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  notes TEXT,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS ambassador_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambassador_id UUID REFERENCES ambassadors(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES consultation_sessions(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, reviewer_id)
);

-- Ambassador specializations and certifications
CREATE TABLE IF NOT EXISTS ambassador_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambassador_id UUID REFERENCES ambassadors(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  issuing_organization TEXT,
  issue_date DATE,
  expiry_date DATE,
  certificate_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for ambassadors system
CREATE INDEX IF NOT EXISTS idx_ambassadors_user_id ON ambassadors(user_id);
CREATE INDEX IF NOT EXISTS idx_ambassadors_university ON ambassadors(university_name);
CREATE INDEX IF NOT EXISTS idx_ambassadors_college ON ambassadors(college);
CREATE INDEX IF NOT EXISTS idx_ambassadors_major ON ambassadors(major);
CREATE INDEX IF NOT EXISTS idx_ambassadors_is_verified ON ambassadors(is_verified);
CREATE INDEX IF NOT EXISTS idx_ambassadors_is_active ON ambassadors(is_active);
CREATE INDEX IF NOT EXISTS idx_ambassadors_rating ON ambassadors(rating);
CREATE INDEX IF NOT EXISTS idx_consultation_sessions_ambassador_id ON consultation_sessions(ambassador_id);
CREATE INDEX IF NOT EXISTS idx_consultation_sessions_student_id ON consultation_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_consultation_sessions_scheduled_at ON consultation_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_consultation_sessions_status ON consultation_sessions(status);
