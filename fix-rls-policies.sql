-- =====================================================
-- COMPREHENSIVE RLS POLICIES FIX
-- This script creates all necessary RLS policies for the application
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Allow users to view all profiles (needed for marketplace, messaging)
CREATE POLICY "Users can view all profiles" ON profiles 
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles 
FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles 
FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" ON profiles 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- CART ITEMS POLICIES 
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
DROP POLICY IF EXISTS "Admins can view all carts" ON cart_items;

-- Users can view their own cart items
CREATE POLICY "Users can view own cart" ON cart_items 
FOR SELECT USING (user_id = auth.uid());

-- Users can manage their own cart items
CREATE POLICY "Users can manage own cart" ON cart_items 
FOR ALL USING (user_id = auth.uid());

-- Admins can view all carts
CREATE POLICY "Admins can view all carts" ON cart_items 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- BOOKS TABLE POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view approved books" ON books;
DROP POLICY IF EXISTS "Users can create books" ON books;
DROP POLICY IF EXISTS "Users can manage own books" ON books;
DROP POLICY IF EXISTS "Admins can manage all books" ON books;

-- Anyone can view approved books
CREATE POLICY "Anyone can view approved books" ON books 
FOR SELECT USING (
  approval_status = 'approved' OR 
  seller_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Users can create books
CREATE POLICY "Users can create books" ON books 
FOR INSERT WITH CHECK (seller_id = auth.uid());

-- Users can manage their own books
CREATE POLICY "Users can manage own books" ON books 
FOR UPDATE USING (seller_id = auth.uid());

-- Admins can manage all books
CREATE POLICY "Admins can manage all books" ON books 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- BOOK IMAGES POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view book images" ON book_images;
DROP POLICY IF EXISTS "Book owners can manage images" ON book_images;
DROP POLICY IF EXISTS "Admins can manage all images" ON book_images;

-- Anyone can view book images
CREATE POLICY "Anyone can view book images" ON book_images 
FOR SELECT USING (true);

-- Book owners can manage their book images
CREATE POLICY "Book owners can manage images" ON book_images 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM books 
    WHERE books.id = book_images.book_id 
    AND books.seller_id = auth.uid()
  )
);

-- Admins can manage all images
CREATE POLICY "Admins can manage all images" ON book_images 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- SUMMARIES POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view approved summaries" ON summaries;
DROP POLICY IF EXISTS "Users can create summaries" ON summaries;
DROP POLICY IF EXISTS "Users can manage own summaries" ON summaries;
DROP POLICY IF EXISTS "Admins can manage all summaries" ON summaries;

-- Users can view approved summaries and their own
CREATE POLICY "Users can view approved summaries" ON summaries 
FOR SELECT USING (
  status = 'approved' OR 
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Users can create summaries
CREATE POLICY "Users can create summaries" ON summaries 
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can manage their own summaries
CREATE POLICY "Users can manage own summaries" ON summaries 
FOR UPDATE USING (user_id = auth.uid());

-- Admins can manage all summaries
CREATE POLICY "Admins can manage all summaries" ON summaries 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- DAILY LECTURES POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view approved lectures" ON daily_lectures;
DROP POLICY IF EXISTS "Users can create lectures" ON daily_lectures;
DROP POLICY IF EXISTS "Users can manage own lectures" ON daily_lectures;
DROP POLICY IF EXISTS "Admins can manage all lectures" ON daily_lectures;

-- Users can view approved lectures and their own
CREATE POLICY "Users can view approved lectures" ON daily_lectures 
FOR SELECT USING (
  approval_status = 'approved' OR 
  instructor_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Users can create lectures
CREATE POLICY "Users can create lectures" ON daily_lectures 
FOR INSERT WITH CHECK (instructor_id = auth.uid());

-- Users can manage their own lectures
CREATE POLICY "Users can manage own lectures" ON daily_lectures 
FOR UPDATE USING (instructor_id = auth.uid());

-- Admins can manage all lectures
CREATE POLICY "Admins can manage all lectures" ON daily_lectures 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- NOTEBOOKS POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own notebooks" ON notebooks;
DROP POLICY IF EXISTS "Users can manage own notebooks" ON notebooks;
DROP POLICY IF EXISTS "Admins can manage all notebooks" ON notebooks;

-- Users can view their own notebooks
CREATE POLICY "Users can view own notebooks" ON notebooks 
FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Users can manage their own notebooks
CREATE POLICY "Users can manage own notebooks" ON notebooks 
FOR ALL USING (user_id = auth.uid());

-- Admins can manage all notebooks
CREATE POLICY "Admins can manage all notebooks" ON notebooks 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- MESSAGES POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON messages;

-- Users can view messages they sent or received
CREATE POLICY "Users can view own messages" ON messages 
FOR SELECT USING (
  sender_id = auth.uid() OR 
  receiver_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Users can send messages
CREATE POLICY "Users can send messages" ON messages 
FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Users can update their own messages
CREATE POLICY "Users can update own messages" ON messages 
FOR UPDATE USING (sender_id = auth.uid());

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications 
FOR SELECT USING (user_id = auth.uid());

-- Allow creating notifications
CREATE POLICY "System can create notifications" ON notifications 
FOR INSERT WITH CHECK (true);

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON notifications 
FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- ADMIN TABLES POLICIES
-- =====================================================

-- Admin activities - only admins can access
CREATE POLICY "Only admins can access admin activities" ON admin_activities 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- System settings - only admins can access
CREATE POLICY "Only admins can access system settings" ON system_settings 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- STORAGE BUCKET POLICIES
-- =====================================================

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('summaries', 'summaries', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('book-images', 'book-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('notebooks', 'notebooks', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for summaries bucket
CREATE POLICY "Users can upload summaries" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'summaries' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view summaries" ON storage.objects 
FOR SELECT USING (bucket_id = 'summaries');

CREATE POLICY "Users can update own summaries" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'summaries' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR
   EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- Storage policies for book-images bucket  
CREATE POLICY "Users can upload book images" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'book-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view book images" ON storage.objects 
FOR SELECT USING (bucket_id = 'book-images');

CREATE POLICY "Book owners can update images" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'book-images' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR
   EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- Storage policies for notebooks bucket
CREATE POLICY "Users can upload notebooks" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'notebooks' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view notebooks" ON storage.objects 
FOR SELECT USING (bucket_id = 'notebooks');

CREATE POLICY "Users can update own notebooks" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'notebooks' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR
   EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- Storage policies for avatars bucket
CREATE POLICY "Users can upload avatars" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view avatars" ON storage.objects 
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatars" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR
   EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);