-- Fix all upload issues - Database Schema Alignment
-- This script fixes all the identified schema mismatches

BEGIN;

-- 1. Fix profiles table - Add missing email column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update email column with data from auth.users if missing
UPDATE profiles 
SET email = auth.users.email 
FROM auth.users 
WHERE profiles.id = auth.users.id 
AND (profiles.email IS NULL OR profiles.email = '');

-- 2. Fix daily_lectures table schema to match API expectations
-- Add missing columns that API expects
ALTER TABLE daily_lectures ADD COLUMN IF NOT EXISTS instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE daily_lectures ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE daily_lectures ADD COLUMN IF NOT EXISTS subject_name TEXT;
ALTER TABLE daily_lectures ADD COLUMN IF NOT EXISTS university_name TEXT;
ALTER TABLE daily_lectures ADD COLUMN IF NOT EXISTS major TEXT;
ALTER TABLE daily_lectures ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;
ALTER TABLE daily_lectures ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE daily_lectures ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE daily_lectures ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Copy data from old columns to new columns where possible
UPDATE daily_lectures 
SET instructor_id = uploaded_by,
    approval_status = status,
    subject_name = course_name
WHERE instructor_id IS NULL OR approval_status IS NULL;

-- 3. Fix summaries table - Ensure status column matches API expectations
-- Add status column if it doesn't exist (API uses 'status' not 'is_approved')
ALTER TABLE summaries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Copy data from is_approved to status column
UPDATE summaries 
SET status = CASE 
    WHEN is_approved = true THEN 'approved'
    ELSE 'pending'
END
WHERE status IS NULL OR status = 'pending';

-- 4. Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('summaries', 'summaries', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('lectures', 'lectures', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('book-images', 'book-images', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Create storage policies for uploads
-- Summaries bucket policies
INSERT INTO storage.policies (id, bucket_id, name, definition, roles, permission)
VALUES (
    'summaries-upload-policy',
    'summaries', 
    'Users can upload summaries',
    'auth.uid()::text = (storage.foldername(name))[1]',
    '{authenticated}',
    'INSERT'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.policies (id, bucket_id, name, definition, roles, permission)
VALUES (
    'summaries-select-policy',
    'summaries',
    'Users can view summaries', 
    'true',
    '{authenticated, anon}',
    'SELECT'
) ON CONFLICT (id) DO NOTHING;

-- Lectures bucket policies  
INSERT INTO storage.policies (id, bucket_id, name, definition, roles, permission)
VALUES (
    'lectures-upload-policy',
    'lectures',
    'Users can upload lectures',
    'auth.uid()::text = (storage.foldername(name))[1]', 
    '{authenticated}',
    'INSERT'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.policies (id, bucket_id, name, definition, roles, permission)
VALUES (
    'lectures-select-policy',
    'lectures',
    'Users can view lectures',
    'true',
    '{authenticated, anon}',
    'SELECT'
) ON CONFLICT (id) DO NOTHING;

-- Avatars bucket policies
INSERT INTO storage.policies (id, bucket_id, name, definition, roles, permission)  
VALUES (
    'avatars-upload-policy',
    'avatars',
    'Users can upload avatars',
    'auth.uid()::text = (storage.foldername(name))[1]',
    '{authenticated}',
    'INSERT'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.policies (id, bucket_id, name, definition, roles, permission)
VALUES (
    'avatars-select-policy', 
    'avatars',
    'Users can view avatars',
    'true',
    '{authenticated, anon}',
    'SELECT'
) ON CONFLICT (id) DO NOTHING;

-- Book images bucket policies
INSERT INTO storage.policies (id, bucket_id, name, definition, roles, permission)
VALUES (
    'book-images-upload-policy',
    'book-images',
    'Users can upload book images', 
    'auth.uid()::text = (storage.foldername(name))[1]',
    '{authenticated}',
    'INSERT'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.policies (id, bucket_id, name, definition, roles, permission)
VALUES (
    'book-images-select-policy',
    'book-images',
    'Users can view book images',
    'true', 
    '{authenticated, anon}',
    'SELECT'
) ON CONFLICT (id) DO NOTHING;

-- 6. Update foreign key references in table to match API expectations
-- Fix the foreign key reference name that admin API expects
ALTER TABLE daily_lectures DROP CONSTRAINT IF EXISTS daily_lectures_instructor_id_fkey;
ALTER TABLE daily_lectures ADD CONSTRAINT daily_lectures_instructor_id_fkey 
    FOREIGN KEY (instructor_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 7. Create missing admin tables if they don't exist
CREATE TABLE IF NOT EXISTS admin_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_lectures_instructor_id ON daily_lectures(instructor_id);
CREATE INDEX IF NOT EXISTS idx_daily_lectures_approval_status ON daily_lectures(approval_status);
CREATE INDEX IF NOT EXISTS idx_summaries_status ON summaries(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 9. Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMIT;

-- Verify the fixes by checking key tables and columns
SELECT 
    'profiles' as table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('email', 'id', 'name');

SELECT 
    'daily_lectures' as table_name,
    column_name, 
    data_type
FROM information_schema.columns
WHERE table_name = 'daily_lectures'
AND column_name IN ('instructor_id', 'approval_status', 'subject_name', 'file_url');

SELECT
    'summaries' as table_name,
    column_name,
    data_type  
FROM information_schema.columns
WHERE table_name = 'summaries'
AND column_name IN ('status', 'is_approved', 'user_id');