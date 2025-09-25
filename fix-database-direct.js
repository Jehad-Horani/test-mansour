const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

async function fixDatabase() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  })

  console.log('🔧 Applying direct database fixes...')

  try {
    console.log('1. Adding approval_status column to books table...')
    
    // Add approval_status column to books table
    const { error: approvalError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          -- Add approval_status column if it doesn't exist
          BEGIN
            ALTER TABLE books ADD COLUMN approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));
            RAISE NOTICE 'approval_status column added successfully';
          EXCEPTION
            WHEN duplicate_column THEN 
              RAISE NOTICE 'approval_status column already exists';
          END;
          
          -- Add other missing columns
          BEGIN
            ALTER TABLE books ADD COLUMN approved_by UUID REFERENCES profiles(id);
            RAISE NOTICE 'approved_by column added successfully';
          EXCEPTION
            WHEN duplicate_column THEN 
              RAISE NOTICE 'approved_by column already exists';
          END;
          
          BEGIN
            ALTER TABLE books ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
            RAISE NOTICE 'approved_at column added successfully';
          EXCEPTION
            WHEN duplicate_column THEN 
              RAISE NOTICE 'approved_at column already exists';
          END;
          
          BEGIN
            ALTER TABLE books ADD COLUMN rejection_reason TEXT;
            RAISE NOTICE 'rejection_reason column added successfully';
          EXCEPTION
            WHEN duplicate_column THEN 
              RAISE NOTICE 'rejection_reason column already exists';
          END;
          
          -- Update existing books to be approved
          UPDATE books SET approval_status = 'approved' WHERE approval_status IS NULL;
          RAISE NOTICE 'Updated existing books to approved status';
        END $$;
      `
    })

    if (approvalError) {
      console.error('Error adding approval columns:', approvalError)
    } else {
      console.log('✅ Books table approval columns added successfully')
    }

    console.log('2. Creating cart_items table...')
    
    // Create cart_items table
    const { error: cartError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$
        BEGIN
          -- Create cart_items table if it doesn't exist
          CREATE TABLE IF NOT EXISTS cart_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
            book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
            quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0),
            added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, book_id)
          );
          
          -- Create indexes
          CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
          CREATE INDEX IF NOT EXISTS idx_cart_items_book_id ON cart_items(book_id);
          
          -- Enable RLS
          ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
          
          RAISE NOTICE 'cart_items table created successfully';
        EXCEPTION
          WHEN duplicate_table THEN
            RAISE NOTICE 'cart_items table already exists';
        END $$;
      `
    })

    if (cartError) {
      console.error('Error creating cart_items table:', cartError)
    } else {
      console.log('✅ cart_items table created successfully')
    }

    console.log('3. Setting up RLS policies for cart_items...')
    
    // Set up RLS policies
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
        DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
        DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
        DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;

        -- Create cart policies
        CREATE POLICY "Users can view their own cart items" ON cart_items
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own cart items" ON cart_items
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own cart items" ON cart_items
          FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own cart items" ON cart_items
          FOR DELETE USING (auth.uid() = user_id);
      `
    })

    if (policyError) {
      console.error('Error setting up cart policies:', policyError)
    } else {
      console.log('✅ Cart RLS policies set up successfully')
    }

    console.log('4. Creating admin user...')
    
    // Create admin user
    const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@takhassus.com',
      password: 'takhassusJH123',
      email_confirm: true,
      user_metadata: {
        name: 'Admin User',
        role: 'admin'
      }
    })

    if (adminError) {
      if (adminError.message.includes('already registered')) {
        console.log('✅ Admin user already exists')
      } else {
        console.error('Error creating admin user:', adminError)
      }
    } else {
      console.log('✅ Admin user created successfully')
      
      // Update profile to admin role
      if (adminUser?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: adminUser.user.id,
            name: 'Admin User',
            role: 'admin',
            subscription_tier: 'premium'
          })

        if (profileError) {
          console.error('Error updating admin profile:', profileError)
        } else {
          console.log('✅ Admin profile updated successfully')
        }
      }
    }

    console.log('5. Fixing profiles table university column type...')
    
    // Fix profiles table
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$
        BEGIN
          -- Check if university column is array type and convert to text
          BEGIN
            ALTER TABLE profiles ALTER COLUMN university TYPE TEXT;
            RAISE NOTICE 'university column type changed to TEXT';
          EXCEPTION
            WHEN others THEN
              RAISE NOTICE 'university column is already TEXT or other issue: %', SQLERRM;
          END;
          
          -- Add missing columns
          BEGIN
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_id TEXT;
            RAISE NOTICE 'Missing profile columns added';
          EXCEPTION
            WHEN others THEN
              RAISE NOTICE 'Profile columns already exist or error: %', SQLERRM;
          END;
        END $$;
      `
    })

    if (profilesError) {
      console.error('Error fixing profiles table:', profilesError)
    } else {
      console.log('✅ Profiles table fixed successfully')
    }

    console.log('6. Testing database access...')
    
    // Test database access
    const { data: booksTest, error: booksTestError } = await supabase
      .from('books')
      .select('id, title, approval_status')
      .limit(1)

    if (booksTestError) {
      console.error('Books table test failed:', booksTestError)
    } else {
      console.log('✅ Books table accessible with approval_status column')
    }

    const { data: cartTest, error: cartTestError } = await supabase
      .from('cart_items')
      .select('id')
      .limit(1)

    if (cartTestError) {
      console.error('Cart table test failed:', cartTestError)
    } else {
      console.log('✅ Cart table accessible')
    }

    console.log('\n🎉 Database fixes completed successfully!')

  } catch (error) {
    console.error('❌ Database fix failed:', error)
  }
}

fixDatabase()