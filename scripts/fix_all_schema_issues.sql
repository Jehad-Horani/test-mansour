-- Fix all database schema issues and create missing tables

-- 1. Fix profiles table - ensure university is TEXT not ARRAY
ALTER TABLE profiles ALTER COLUMN university TYPE TEXT;

-- 2. Create cart_items table (missing)
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- 3. Add approval status to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE books ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id);
ALTER TABLE books ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE books ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 4. Create admin activity log table
CREATE TABLE IF NOT EXISTS admin_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL, -- 'approve_book', 'reject_book', 'delete_book', etc.
  target_id UUID, -- ID of the affected resource (book, user, etc.)
  target_type TEXT, -- 'book', 'user', 'profile', etc.
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB DEFAULT '{}'
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_book_id ON cart_items(book_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_added_at ON cart_items(added_at);

CREATE INDEX IF NOT EXISTS idx_books_approval_status ON books(approval_status);
CREATE INDEX IF NOT EXISTS idx_books_approved_by ON books(approved_by);
CREATE INDEX IF NOT EXISTS idx_books_approved_at ON books(approved_at);

CREATE INDEX IF NOT EXISTS idx_admin_activities_admin_id ON admin_activities(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activities_created_at ON admin_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_activities_target_id ON admin_activities(target_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Enable RLS for all new tables
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activities ENABLE ROW LEVEL SECURITY;  
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Cart items policies
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Admin activities policies
CREATE POLICY "Admins can view admin activities" ON admin_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert admin activities" ON admin_activities
  FOR INSERT WITH CHECK (
    auth.uid() = admin_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications for users" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update books policies to include approval status
DROP POLICY IF EXISTS "Anyone can view approved books" ON books;
CREATE POLICY "Anyone can view approved books" ON books
  FOR SELECT USING (approval_status = 'approved' OR seller_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their own books" ON books;
CREATE POLICY "Users can view their own books" ON books
  FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "Admins can view all books" ON books
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update book approval status" ON books
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create notification when book status changes
CREATE OR REPLACE FUNCTION notify_book_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify if approval_status changed
  IF OLD.approval_status IS DISTINCT FROM NEW.approval_status THEN
    INSERT INTO notifications (user_id, title, message, type, data)
    VALUES (
      NEW.seller_id,
      CASE 
        WHEN NEW.approval_status = 'approved' THEN 'تم قبول كتابك'
        WHEN NEW.approval_status = 'rejected' THEN 'تم رفض كتابك'
        ELSE 'تم تحديث حالة كتابك'
      END,
      CASE 
        WHEN NEW.approval_status = 'approved' THEN 'تم قبول كتاب "' || NEW.title || '" وسيظهر في السوق الآن'
        WHEN NEW.approval_status = 'rejected' THEN 'تم رفض كتاب "' || NEW.title || '". السبب: ' || COALESCE(NEW.rejection_reason, 'لم يتم تحديد السبب')
        ELSE 'تم تحديث حالة كتاب "' || NEW.title || '"'
      END,
      CASE 
        WHEN NEW.approval_status = 'approved' THEN 'success'
        WHEN NEW.approval_status = 'rejected' THEN 'warning'
        ELSE 'info'
      END,
      jsonb_build_object(
        'book_id', NEW.id,
        'book_title', NEW.title,
        'approval_status', NEW.approval_status,
        'rejection_reason', NEW.rejection_reason
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for book status notifications
DROP TRIGGER IF EXISTS book_status_notification_trigger ON books;
CREATE TRIGGER book_status_notification_trigger
  AFTER UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION notify_book_status_change();

-- Update existing books to have approved status (for existing data)
UPDATE books SET approval_status = 'approved' WHERE approval_status IS NULL;