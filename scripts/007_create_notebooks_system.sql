-- Study Notebooks and Materials System
CREATE TABLE IF NOT EXISTS notebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject_name TEXT NOT NULL,
  course_code TEXT,
  university_name TEXT NOT NULL,
  college TEXT NOT NULL,
  major TEXT NOT NULL,
  semester TEXT,
  academic_year TEXT,
  notebook_type TEXT CHECK (notebook_type IN ('lecture_notes', 'summary', 'exercises', 'exam_prep', 'project', 'lab_report')),
  content_format TEXT CHECK (content_format IN ('pdf', 'docx', 'pptx', 'txt', 'images', 'mixed')),
  file_urls TEXT[], -- Array of file URLs
  file_names TEXT[], -- Array of file names
  file_sizes INTEGER[], -- Array of file sizes in bytes
  total_pages INTEGER,
  language TEXT DEFAULT 'ar',
  tags TEXT[], -- Array of tags
  is_public BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS notebook_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID REFERENCES notebooks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(notebook_id, user_id)
);

CREATE TABLE IF NOT EXISTS notebook_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID REFERENCES notebooks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Favorites system for notebooks
CREATE TABLE IF NOT EXISTS notebook_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID REFERENCES notebooks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(notebook_id, user_id)
);

-- Indexes for notebooks system
CREATE INDEX IF NOT EXISTS idx_notebooks_author_id ON notebooks(author_id);
CREATE INDEX IF NOT EXISTS idx_notebooks_subject ON notebooks(subject_name);
CREATE INDEX IF NOT EXISTS idx_notebooks_university ON notebooks(university_name);
CREATE INDEX IF NOT EXISTS idx_notebooks_college ON notebooks(college);
CREATE INDEX IF NOT EXISTS idx_notebooks_major ON notebooks(major);
CREATE INDEX IF NOT EXISTS idx_notebooks_is_public ON notebooks(is_public);
CREATE INDEX IF NOT EXISTS idx_notebooks_is_approved ON notebooks(is_approved);
CREATE INDEX IF NOT EXISTS idx_notebooks_created_at ON notebooks(created_at);
CREATE INDEX IF NOT EXISTS idx_notebooks_rating ON notebooks(rating);
CREATE INDEX IF NOT EXISTS idx_notebook_downloads_notebook_id ON notebook_downloads(notebook_id);
CREATE INDEX IF NOT EXISTS idx_notebook_downloads_user_id ON notebook_downloads(user_id);
