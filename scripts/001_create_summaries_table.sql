-- Create summaries table with admin approval system
CREATE TABLE IF NOT EXISTS public.summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  university_name TEXT NOT NULL,
  semester TEXT NOT NULL,
  college TEXT NOT NULL,
  major TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Policies for summaries
-- Users can view approved summaries and their own summaries
CREATE POLICY "summaries_select_approved_or_own"
  ON public.summaries FOR SELECT
  USING (is_approved = true OR auth.uid() = user_id);

-- Users can insert their own summaries
CREATE POLICY "summaries_insert_own"
  ON public.summaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own unapproved summaries
CREATE POLICY "summaries_update_own"
  ON public.summaries FOR UPDATE
  USING (auth.uid() = user_id AND is_approved = false);

-- Users can delete their own unapproved summaries
CREATE POLICY "summaries_delete_own"
  ON public.summaries FOR DELETE
  USING (auth.uid() = user_id AND is_approved = false);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_summaries_college ON public.summaries(college);
CREATE INDEX IF NOT EXISTS idx_summaries_major ON public.summaries(major);
CREATE INDEX IF NOT EXISTS idx_summaries_approved ON public.summaries(is_approved);
CREATE INDEX IF NOT EXISTS idx_summaries_user_id ON public.summaries(user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_summaries_updated_at 
    BEFORE UPDATE ON public.summaries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
