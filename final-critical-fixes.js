const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

async function finalCriticalFixes() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  })

  console.log('🚨 Applying final critical fixes...')

  try {
    // 1. Create cart_items table using direct SQL approach
    console.log('1. Creating cart_items table with direct SQL...')
    
    const { data: cartResult, error: cartError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Drop table if exists and recreate
        DROP TABLE IF EXISTS public.cart_items CASCADE;
        
        -- Create cart_items table
        CREATE TABLE public.cart_items (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL,
          book_id UUID NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
          added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, book_id)
        );
        
        -- Add foreign key constraints with proper references
        ALTER TABLE public.cart_items 
        ADD CONSTRAINT cart_items_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
        
        ALTER TABLE public.cart_items 
        ADD CONSTRAINT cart_items_book_id_fkey 
        FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;
        
        -- Create indexes for performance
        CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
        CREATE INDEX idx_cart_items_book_id ON public.cart_items(book_id);
        
        -- Enable Row Level Security
        ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Users can view their own cart items" ON public.cart_items
          FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own cart items" ON public.cart_items
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own cart items" ON public.cart_items
          FOR UPDATE USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own cart items" ON public.cart_items
          FOR DELETE USING (auth.uid() = user_id);
      `
    })

    if (cartError) {
      console.error('Cart table creation error:', cartError)
    } else {
      console.log('✅ Cart table created successfully with RLS policies')
    }

    // 2. Test cart table access
    console.log('2. Testing cart table access...')
    const { data: cartTestData, error: cartTestError } = await supabase
      .from('cart_items')
      .select('*')
      .limit(1)

    if (cartTestError) {
      console.error('Cart table test failed:', cartTestError)
    } else {
      console.log('✅ Cart table accessible via Supabase client')
    }

    // 3. Create admin user properly
    console.log('3. Creating admin user with proper auth flow...')
    
    try {
      // First try to delete any existing admin user with this email
      const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
      
      if (existingUsers && existingUsers.users) {
        const existingAdmin = existingUsers.users.find(u => u.email === 'admin@takhassus.com')
        if (existingAdmin) {
          console.log('Found existing admin user, deleting first...')
          await supabase.auth.admin.deleteUser(existingAdmin.id)
        }
      }

      // Create new admin user
      const { data: newAdminUser, error: createUserError } = await supabase.auth.admin.createUser({
        email: 'admin@takhassus.com',
        password: 'takhassusJH123',
        email_confirm: true,
        user_metadata: {
          name: 'Admin User',
          role: 'admin'
        }
      })

      if (createUserError) {
        console.error('Admin user creation error:', createUserError)
      } else if (newAdminUser?.user) {
        console.log('✅ Admin user created successfully:', newAdminUser.user.email)
        
        // Update/create admin profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: newAdminUser.user.id,
            name: 'Admin User',
            email: 'admin@takhassus.com',
            role: 'admin',
            subscription_tier: 'premium',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })

        if (profileError) {
          console.error('Admin profile creation error:', profileError)
        } else {
          console.log('✅ Admin profile created/updated successfully')
        }
      }

    } catch (adminError) {
      console.error('Admin user creation process error:', adminError)
    }

    // 4. Create some sample data for testing
    console.log('4. Creating sample data for testing...')
    
    // Create sample books if none exist
    const { data: existingBooks, error: booksCheckError } = await supabase
      .from('books')
      .select('id')
      .limit(1)

    if (!booksCheckError && (!existingBooks || existingBooks.length === 0)) {
      console.log('Creating sample books for testing...')
      
      // First create a sample user for book ownership
      const { data: sampleUser, error: sampleUserError } = await supabase.auth.admin.createUser({
        email: 'user@example.com',
        password: 'password123',
        email_confirm: true
      })

      if (!sampleUserError && sampleUser?.user) {
        // Create profile for sample user
        await supabase
          .from('profiles')
          .upsert({
            id: sampleUser.user.id,
            name: 'Sample User',
            email: 'user@example.com',
            created_at: new Date().toISOString()
          })

        // Create sample books
        const sampleBooks = [
          {
            title: 'كتاب في البرمجة',
            description: 'كتاب تعليمي في البرمجة',
            price: 50.00,
            condition: 'جيد',
            seller_id: sampleUser.user.id,
            approval_status: 'approved',
            created_at: new Date().toISOString()
          },
          {
            title: 'كتاب في الرياضيات',
            description: 'كتاب رياضيات للجامعة',
            price: 75.00,
            condition: 'ممتاز',
            seller_id: sampleUser.user.id,
            approval_status: 'pending',
            created_at: new Date().toISOString()
          }
        ]

        const { data: booksData, error: booksInsertError } = await supabase
          .from('books')
          .insert(sampleBooks)

        if (booksInsertError) {
          console.error('Sample books creation error:', booksInsertError)
        } else {
          console.log('✅ Sample books created for testing')
        }
      }
    }

    // 5. Test admin authentication
    console.log('5. Testing admin authentication...')
    
    const { data: authTest, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@takhassus.com',
      password: 'takhassusJH123'
    })

    if (authError) {
      console.error('Admin auth test failed:', authError)
    } else {
      console.log('✅ Admin authentication test successful')
      
      // Sign out after test
      await supabase.auth.signOut()
    }

    console.log('\n🎉 Final critical fixes completed!')
    
    // Run final verification
    console.log('\n🔍 Running final verification...')
    
    const verificationResults = {
      cart_table: false,
      admin_user: false,
      sample_data: false
    }

    // Verify cart table
    try {
      const { error: cartVerifyError } = await supabase.from('cart_items').select('*').limit(1)
      verificationResults.cart_table = !cartVerifyError
    } catch (e) { }

    // Verify admin user
    try {
      const { error: adminVerifyError } = await supabase.auth.signInWithPassword({
        email: 'admin@takhassus.com',
        password: 'takhassusJH123'
      })
      verificationResults.admin_user = !adminVerifyError
      if (!adminVerifyError) await supabase.auth.signOut()
    } catch (e) { }

    // Verify sample data
    try {
      const { data: booksCheck } = await supabase.from('books').select('*').limit(1)
      verificationResults.sample_data = booksCheck && booksCheck.length > 0
    } catch (e) { }

    console.log('\n📋 Verification Results:')
    console.log(`Cart Table: ${verificationResults.cart_table ? '✅' : '❌'}`)
    console.log(`Admin User: ${verificationResults.admin_user ? '✅' : '❌'}`)
    console.log(`Sample Data: ${verificationResults.sample_data ? '✅' : '❌'}`)

    const allVerified = Object.values(verificationResults).every(v => v)
    console.log(`\nOverall Status: ${allVerified ? '✅ ALL VERIFIED' : '⚠️  SOME ISSUES REMAIN'}`)

  } catch (error) {
    console.error('❌ Final fixes failed:', error)
  }
}

finalCriticalFixes()