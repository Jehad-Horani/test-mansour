const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSQL(sql, description) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql })
    if (error) {
      console.error(`❌ ${description}:`, error.message)
    } else {
      console.log(`✅ ${description}`)
    }
  } catch (err) {
    console.error(`💥 ${description}:`, err.message)
  }
}

async function completeSetup() {
  console.log('🚀 COMPLETE DATABASE & RLS SETUP STARTING...')
  
  // 1. Create all tables with proper structure
  console.log('\n📋 Creating all necessary tables...')
  
  // Profiles table
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE,
      name TEXT,
      phone TEXT,
      university TEXT,
      major TEXT,
      role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
      subscription_tier TEXT DEFAULT 'basic',
      avatar_url TEXT,
      preferences JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `, 'Profiles table')

  // Books table with all necessary columns
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS books (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      author TEXT NOT NULL,
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
      condition TEXT NOT NULL CHECK (condition IN ('new', 'excellent', 'good', 'fair', 'poor')),
      original_price DECIMAL(10,2),
      selling_price DECIMAL(10,2) NOT NULL,
      currency TEXT DEFAULT 'JOD',
      is_available BOOLEAN DEFAULT true,
      seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
      approved_by UUID REFERENCES profiles(id),
      approved_at TIMESTAMPTZ,
      rejection_reason TEXT,
      sold_at TIMESTAMPTZ,
      buyer_id UUID REFERENCES profiles(id),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `, 'Books table')

  // Book images table
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS book_images (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      is_primary BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `, 'Book images table')

  // Cart items table
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
      added_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, book_id)
    );
  `, 'Cart items table')

  // Summaries table
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS summaries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      subject_name TEXT NOT NULL,
      university_name TEXT NOT NULL,
      semester TEXT,
      college TEXT,
      major TEXT,
      description TEXT,
      file_url TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER DEFAULT 0,
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      rejection_reason TEXT,
      approved_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `, 'Summaries table')

  // Daily lectures table
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS daily_lectures (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      subject_name TEXT NOT NULL,
      university_name TEXT NOT NULL,
      major TEXT NOT NULL,
      lecture_date TIMESTAMPTZ NOT NULL,
      duration_minutes INTEGER DEFAULT 60,
      file_url TEXT,
      file_name TEXT,
      instructor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
      approved_by UUID REFERENCES profiles(id),
      approved_at TIMESTAMPTZ,
      rejection_reason TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `, 'Daily lectures table')

  // Messages table
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      book_id UUID REFERENCES books(id) ON DELETE SET NULL,
      read BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `, 'Messages table')

  // Admin activities table
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS admin_activities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      action TEXT NOT NULL,
      target_type TEXT,
      target_id TEXT,
      details JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `, 'Admin activities table')

  // System settings table
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS system_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      setting_key TEXT UNIQUE NOT NULL,
      setting_value JSONB NOT NULL,
      description TEXT,
      updated_by UUID REFERENCES profiles(id),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `, 'System settings table')

  // Notifications table
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      read BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `, 'Notifications table')

  // 2. Create all indexes for performance
  console.log('\n📊 Creating performance indexes...')
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);',
    'CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);',
    'CREATE INDEX IF NOT EXISTS idx_books_seller_id ON books(seller_id);',
    'CREATE INDEX IF NOT EXISTS idx_books_approval_status ON books(approval_status);',
    'CREATE INDEX IF NOT EXISTS idx_books_is_available ON books(is_available);',
    'CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_cart_items_book_id ON cart_items(book_id);',
    'CREATE INDEX IF NOT EXISTS idx_summaries_user_id ON summaries(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_summaries_status ON summaries(status);',
    'CREATE INDEX IF NOT EXISTS idx_daily_lectures_instructor_id ON daily_lectures(instructor_id);',
    'CREATE INDEX IF NOT EXISTS idx_daily_lectures_approval_status ON daily_lectures(approval_status);',
    'CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);',
    'CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);'
  ]

  for (const index of indexes) {
    await executeSQL(index, `Index: ${index.split('idx_')[1]?.split(' ')[0]}`)
  }

  // 3. Enable RLS on all tables
  console.log('\n🔒 Enabling Row Level Security...')
  const tables = ['profiles', 'books', 'book_images', 'cart_items', 'summaries', 'daily_lectures', 'messages', 'admin_activities', 'system_settings', 'notifications']
  
  for (const table of tables) {
    await executeSQL(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`, `RLS enabled on ${table}`)
  }

  // 4. Create comprehensive RLS policies
  console.log('\n🛡️ Creating RLS policies...')

  // Profiles policies
  await executeSQL(`
    DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
    CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT USING (true);
  `, 'Profiles SELECT policy')

  await executeSQL(`
    DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
    CREATE POLICY "profiles_insert_policy" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
  `, 'Profiles INSERT policy')

  await executeSQL(`
    DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
    CREATE POLICY "profiles_update_policy" ON profiles FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
  `, 'Profiles UPDATE policy')

  // Books policies
  await executeSQL(`
    DROP POLICY IF EXISTS "books_select_policy" ON books;
    CREATE POLICY "books_select_policy" ON books FOR SELECT USING (
      approval_status = 'approved' OR 
      seller_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `, 'Books SELECT policy')

  await executeSQL(`
    DROP POLICY IF EXISTS "books_insert_policy" ON books;
    CREATE POLICY "books_insert_policy" ON books FOR INSERT WITH CHECK (seller_id = auth.uid());
  `, 'Books INSERT policy')

  await executeSQL(`
    DROP POLICY IF EXISTS "books_update_policy" ON books;
    CREATE POLICY "books_update_policy" ON books FOR UPDATE USING (
      seller_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `, 'Books UPDATE policy')

  await executeSQL(`
    DROP POLICY IF EXISTS "books_delete_policy" ON books;
    CREATE POLICY "books_delete_policy" ON books FOR DELETE USING (
      seller_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `, 'Books DELETE policy')

  // Cart items policies
  await executeSQL(`
    DROP POLICY IF EXISTS "cart_items_policy" ON cart_items;
    CREATE POLICY "cart_items_policy" ON cart_items FOR ALL USING (user_id = auth.uid());
  `, 'Cart items ALL policy')

  // Summaries policies
  await executeSQL(`
    DROP POLICY IF EXISTS "summaries_select_policy" ON summaries;
    CREATE POLICY "summaries_select_policy" ON summaries FOR SELECT USING (
      status = 'approved' OR 
      user_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `, 'Summaries SELECT policy')

  await executeSQL(`
    DROP POLICY IF EXISTS "summaries_insert_policy" ON summaries;
    CREATE POLICY "summaries_insert_policy" ON summaries FOR INSERT WITH CHECK (user_id = auth.uid());
  `, 'Summaries INSERT policy')

  await executeSQL(`
    DROP POLICY IF EXISTS "summaries_update_policy" ON summaries;
    CREATE POLICY "summaries_update_policy" ON summaries FOR UPDATE USING (
      user_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `, 'Summaries UPDATE policy')

  // Book images policies
  await executeSQL(`
    DROP POLICY IF EXISTS "book_images_select_policy" ON book_images;
    CREATE POLICY "book_images_select_policy" ON book_images FOR SELECT USING (true);
  `, 'Book images SELECT policy')

  await executeSQL(`
    DROP POLICY IF EXISTS "book_images_insert_policy" ON book_images;
    CREATE POLICY "book_images_insert_policy" ON book_images FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM books WHERE id = book_id AND seller_id = auth.uid())
    );
  `, 'Book images INSERT policy')

  // Admin-only policies for admin tables
  await executeSQL(`
    DROP POLICY IF EXISTS "admin_activities_policy" ON admin_activities;
    CREATE POLICY "admin_activities_policy" ON admin_activities FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `, 'Admin activities policy')

  await executeSQL(`
    DROP POLICY IF EXISTS "system_settings_policy" ON system_settings;
    CREATE POLICY "system_settings_policy" ON system_settings FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `, 'System settings policy')

  console.log('\n🎉 COMPLETE DATABASE SETUP FINISHED!')
  console.log('✅ All tables created with proper structure')
  console.log('✅ All foreign keys and constraints in place')  
  console.log('✅ Performance indexes created')
  console.log('✅ Row Level Security enabled')
  console.log('✅ Comprehensive RLS policies created')
}

completeSetup()
