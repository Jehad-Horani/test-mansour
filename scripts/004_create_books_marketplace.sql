-- Books and Marketplace Tables
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT,
  edition TEXT,
  publisher TEXT,
  publication_year INTEGER,
  subject_name TEXT NOT NULL,
  course_code TEXT,
  university_name TEXT NOT NULL,
  college TEXT NOT NULL,
  major TEXT NOT NULL,
  description TEXT,
  condition TEXT CHECK (condition IN ('new', 'excellent', 'good', 'fair', 'poor')),
  original_price DECIMAL(10,2),
  selling_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'JOD',
  is_available BOOLEAN DEFAULT true,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sold_at TIMESTAMP WITH TIME ZONE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Book Images
CREATE TABLE IF NOT EXISTS book_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book Categories/Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  college TEXT NOT NULL,
  major TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Universities and Colleges
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_en TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, university_id)
);

CREATE TABLE IF NOT EXISTS majors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, college_id)
);

-- Indexes for books table
CREATE INDEX IF NOT EXISTS idx_books_seller_id ON books(seller_id);
CREATE INDEX IF NOT EXISTS idx_books_subject ON books(subject_name);
CREATE INDEX IF NOT EXISTS idx_books_university ON books(university_name);
CREATE INDEX IF NOT EXISTS idx_books_college ON books(college);
CREATE INDEX IF NOT EXISTS idx_books_major ON books(major);
CREATE INDEX IF NOT EXISTS idx_books_available ON books(is_available);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at);
CREATE INDEX IF NOT EXISTS idx_book_images_book_id ON book_images(book_id);
