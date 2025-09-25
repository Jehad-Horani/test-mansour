const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSQL(sql, description) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql })
    if (error) {
      console.error(`❌ ${description}:`, error.message)
      return false
    } else {
      console.log(`✅ ${description}`)
      return true
    }
  } catch (err) {
    console.error(`💥 ${description}:`, err.message)
    return false
  }
}

async function fixAllCriticalIssues() {
  console.log('🚨 FIXING ALL CRITICAL ISSUES...')
  
  // 1. Add missing email column to profiles table
  console.log('\n📧 Adding email column to profiles...')
  await executeSQL(`
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
  `, 'Add email column to profiles')
  
  // 2. Ensure all necessary columns exist in profiles
  console.log('\n👤 Ensuring all profile columns exist...')
  await executeSQL(`
    DO $$
    BEGIN
      -- Add missing columns if they don't exist
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'name') THEN
        ALTER TABLE profiles ADD COLUMN name TEXT;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'university') THEN
        ALTER TABLE profiles ADD COLUMN university TEXT;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'major') THEN
        ALTER TABLE profiles ADD COLUMN major TEXT;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin'));
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_tier') THEN
        ALTER TABLE profiles ADD COLUMN subscription_tier TEXT DEFAULT 'basic';
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'created_at') THEN
        ALTER TABLE profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
      END IF;
    END $$;
  `, 'Add all missing profile columns')
  
  // 3. Fix summaries table to use correct column name
  console.log('\n📄 Fixing summaries table structure...')
  await executeSQL(`
    DO $$
    BEGIN
      -- Check if we need to rename column
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'summaries' AND column_name = 'is_approved') THEN
        ALTER TABLE summaries RENAME COLUMN is_approved TO status;
        ALTER TABLE summaries ADD CHECK (status IN ('pending', 'approved', 'rejected'));
      END IF;
      
      -- Add status column if it doesn't exist
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'summaries' AND column_name = 'status') THEN
        ALTER TABLE summaries ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
      END IF;
    END $$;
  `, 'Fix summaries table structure')
  
  // 4. Create books table with proper structure
  console.log('\n📚 Ensuring books table exists...')
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
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `, 'Create books table')
  
  // 5. Create book_images table
  console.log('\n🖼️ Creating book_images table...')
  await executeSQL(`
    CREATE TABLE IF NOT EXISTS book_images (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      is_primary BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `, 'Create book_images table')
  
  // 6. Insert sample book data if none exists
  console.log('\n📖 Adding sample books if needed...')
  await executeSQL(`
    INSERT INTO books (title, author, subject_name, university_name, college, major, condition, selling_price, seller_id, approval_status)
    SELECT 
      'كتاب الرياضيات المتقدمة',
      'د. أحمد محمد',
      'الرياضيات',
      'الجامعة الأردنية',
      'كلية العلوم',
      'الرياضيات',
      'good',
      25.00,
      (SELECT id FROM profiles LIMIT 1),
      'pending'
    WHERE NOT EXISTS (SELECT 1 FROM books LIMIT 1)
    AND EXISTS (SELECT 1 FROM profiles LIMIT 1);
  `, 'Add sample book data')
  
  // 7. Add sample profiles if none exist (for testing)
  console.log('\n👥 Adding sample profiles if needed...')
  await executeSQL(`
    INSERT INTO profiles (id, name, email, role, subscription_tier, university, major)
    SELECT 
      gen_random_uuid(),
      'مدير النظام',
      'admin@takhassus.com',
      'admin',
      'premium',
      'جامعة العلوم التطبيقية',
      'علوم الحاسوب'
    WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin' LIMIT 1);
  `, 'Add admin profile if needed')
  
  await executeSQL(`
    INSERT INTO profiles (id, name, email, role, subscription_tier, university, major)
    SELECT 
      gen_random_uuid(),
      'طالب تجريبي',
      'student@takhassus.com',
      'student',
      'basic',
      'الجامعة الأردنية',
      'الهندسة'
    WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'student' LIMIT 1);
  `, 'Add student profile if needed')
  
  console.log('\n🎉 ALL CRITICAL DATABASE FIXES COMPLETED!')
}

fixAllCriticalIssues()
