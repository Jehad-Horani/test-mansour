const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🔧 Setting up database schema...')

  try {
    // 1. Fix profiles table - ensure university is TEXT not ARRAY
    console.log('1. Fixing profiles table schema...')
    await supabase.rpc('exec_sql', {
      sql: `
        -- Fix profiles table column types
        ALTER TABLE profiles ALTER COLUMN university TYPE TEXT;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_id TEXT;
        
        -- Update profiles table structure
        UPDATE profiles SET preferences = COALESCE(preferences, '{}'::jsonb) WHERE preferences IS NULL;
        UPDATE profiles SET stats = COALESCE(stats, '{}'::jsonb) WHERE stats IS NULL;
      `
    })

    // 2. Create missing cart_items table
    console.log('2. Creating cart_items table...')
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS cart_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
          book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
          quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0),
          added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, book_id)
        );
        
        CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
        CREATE INDEX IF NOT EXISTS idx_cart_items_book_id ON cart_items(book_id);
        
        ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
        
        -- Cart policies
        DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
        CREATE POLICY "Users can view their own cart items" ON cart_items
          FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
        CREATE POLICY "Users can insert their own cart items" ON cart_items
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
        CREATE POLICY "Users can update their own cart items" ON cart_items
          FOR UPDATE USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;
        CREATE POLICY "Users can delete their own cart items" ON cart_items
          FOR DELETE USING (auth.uid() = user_id);
      `
    })

    // 3. Add approval status to books table
    console.log('3. Adding approval system to books table...')
    await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE books ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));
        ALTER TABLE books ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id);
        ALTER TABLE books ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE books ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
        
        CREATE INDEX IF NOT EXISTS idx_books_approval_status ON books(approval_status);
        
        -- Update existing books to approved status
        UPDATE books SET approval_status = 'approved' WHERE approval_status IS NULL;
        
        -- Enable RLS on books
        ALTER TABLE books ENABLE ROW LEVEL SECURITY;
        
        -- Books policies
        DROP POLICY IF EXISTS "Anyone can view approved books" ON books;
        CREATE POLICY "Anyone can view approved books" ON books
          FOR SELECT USING (approval_status = 'approved' OR seller_id = auth.uid());

        DROP POLICY IF EXISTS "Users can create books" ON books;
        CREATE POLICY "Users can create books" ON books
          FOR INSERT WITH CHECK (auth.uid() = seller_id);

        DROP POLICY IF EXISTS "Users can update their own books" ON books;
        CREATE POLICY "Users can update their own books" ON books
          FOR UPDATE USING (seller_id = auth.uid());

        DROP POLICY IF EXISTS "Admins can view all books" ON books;
        CREATE POLICY "Admins can view all books" ON books
          FOR SELECT USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
          );

        DROP POLICY IF EXISTS "Admins can update book approval" ON books;
        CREATE POLICY "Admins can update book approval" ON books
          FOR UPDATE USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
          );
      `
    })

    // 4. Create admin activity log
    console.log('4. Creating admin activity log...')
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_activities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
          action TEXT NOT NULL,
          target_id UUID,
          target_type TEXT,
          details JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_admin_activities_admin_id ON admin_activities(admin_id);
        CREATE INDEX IF NOT EXISTS idx_admin_activities_created_at ON admin_activities(created_at);
        
        ALTER TABLE admin_activities ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Admins can view admin activities" ON admin_activities;
        CREATE POLICY "Admins can view admin activities" ON admin_activities
          FOR SELECT USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
          );

        DROP POLICY IF EXISTS "Admins can insert admin activities" ON admin_activities;
        CREATE POLICY "Admins can insert admin activities" ON admin_activities
          FOR INSERT WITH CHECK (
            auth.uid() = admin_id AND
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
          );
      `
    })

    // 5. Create notifications table
    console.log('5. Creating notifications table...')
    await supabase.rpc('exec_sql', {
      sql: `
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
        
        CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
        CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
        
        ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
        CREATE POLICY "Users can view their own notifications" ON notifications
          FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
        CREATE POLICY "Users can update their own notifications" ON notifications
          FOR UPDATE USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Admins can insert notifications" ON notifications;
        CREATE POLICY "Admins can insert notifications" ON notifications
          FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
          );
      `
    })

    // 6. Create daily lectures table
    console.log('6. Creating daily lectures table...')
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS daily_lectures (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          subject TEXT NOT NULL,
          instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          scheduled_date DATE NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          location TEXT,
          meeting_url TEXT,
          status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
          max_attendees INTEGER DEFAULT 50,
          current_attendees INTEGER DEFAULT 0,
          approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
          approved_by UUID REFERENCES profiles(id),
          approved_at TIMESTAMP WITH TIME ZONE,
          rejection_reason TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_daily_lectures_instructor ON daily_lectures(instructor_id);
        CREATE INDEX IF NOT EXISTS idx_daily_lectures_date ON daily_lectures(scheduled_date);
        CREATE INDEX IF NOT EXISTS idx_daily_lectures_approval ON daily_lectures(approval_status);
        
        ALTER TABLE daily_lectures ENABLE ROW LEVEL SECURITY;
        
        -- Lecture policies
        DROP POLICY IF EXISTS "Anyone can view approved lectures" ON daily_lectures;
        CREATE POLICY "Anyone can view approved lectures" ON daily_lectures
          FOR SELECT USING (approval_status = 'approved' OR instructor_id = auth.uid());

        DROP POLICY IF EXISTS "Users can create lectures" ON daily_lectures;
        CREATE POLICY "Users can create lectures" ON daily_lectures
          FOR INSERT WITH CHECK (auth.uid() = instructor_id);

        DROP POLICY IF EXISTS "Instructors can update their lectures" ON daily_lectures;
        CREATE POLICY "Instructors can update their lectures" ON daily_lectures
          FOR UPDATE USING (instructor_id = auth.uid());

        DROP POLICY IF EXISTS "Admins can view all lectures" ON daily_lectures;
        CREATE POLICY "Admins can view all lectures" ON daily_lectures
          FOR SELECT USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
          );

        DROP POLICY IF EXISTS "Admins can update lecture approval" ON daily_lectures;
        CREATE POLICY "Admins can update lecture approval" ON daily_lectures
          FOR UPDATE USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
          );
      `
    })

    console.log('✅ Database schema setup completed!')

  } catch (error) {
    console.error('❌ Database setup error:', error)
    throw error
  }
}

async function setupStorageBuckets() {
  console.log('🗂️ Setting up storage buckets...')

  try {
    // Create avatars bucket
    const { data: avatarBucket, error: avatarError } = await supabase.storage.createBucket('avatars', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })

    if (avatarError && !avatarError.message.includes('already exists')) {
      console.error('Avatar bucket error:', avatarError)
    } else {
      console.log('✅ Avatars bucket ready')
    }

    // Create book-images bucket
    const { data: bookBucket, error: bookError } = await supabase.storage.createBucket('book-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 10485760 // 10MB
    })

    if (bookError && !bookError.message.includes('already exists')) {
      console.error('Book images bucket error:', bookError)
    } else {
      console.log('✅ Book images bucket ready')
    }

  } catch (error) {
    console.error('❌ Storage setup error:', error)
  }
}

async function main() {
  try {
    await setupDatabase()
    await setupStorageBuckets()
    console.log('🎉 Database and storage setup completed successfully!')
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

main()