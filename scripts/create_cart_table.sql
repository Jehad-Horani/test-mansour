-- Cart table for user shopping carts
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Indexes for cart table
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_book_id ON cart_items(book_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_added_at ON cart_items(added_at);

-- Enable RLS for cart
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Cart policies
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create book-images storage bucket policies
-- Note: This is typically done in Supabase dashboard, but including for reference
-- INSERT INTO storage.buckets (id, name, public) VALUES ('book-images', 'book-images', true);

-- Storage policies for book images
-- CREATE POLICY "Anyone can view book images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'book-images');

-- CREATE POLICY "Authenticated users can upload book images" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'book-images' AND auth.role() = 'authenticated');

-- CREATE POLICY "Users can update their own book images" ON storage.objects
--   FOR UPDATE USING (bucket_id = 'book-images' AND auth.uid()::text = (storage.foldername(name))[1]);