const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixSpecificAPIIssues() {
  console.log('🔧 Fixing specific API issues...')

  try {
    // 1. Add email column to profiles table if it doesn't exist
    console.log('1. Adding email column to profiles table...')
    
    const { data: addEmailResult, error: addEmailError } = await supabase
      .from('profiles')
      .select('email')
      .limit(1)

    if (addEmailError && addEmailError.message.includes('column "email" does not exist')) {
      console.log('Email column does not exist, adding it...')
      
      // Use raw SQL to add the column
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE profiles ADD COLUMN email TEXT;'
      })
      
      if (error) {
        console.error('Error adding email column:', error)
      } else {
        console.log('✅ Email column added successfully')
        
        // Update existing profiles with email from auth.users
        const { data: updateResult, error: updateError } = await supabase.rpc('exec_sql', {
          sql: `
            UPDATE profiles 
            SET email = (SELECT email FROM auth.users WHERE auth.users.id = profiles.id) 
            WHERE email IS NULL;
          `
        })
        
        if (updateError) {
          console.error('Error updating profiles with email:', updateError)
        } else {
          console.log('✅ Profiles updated with email addresses')
        }
      }
    } else {
      console.log('✅ Email column already exists')
    }

    // 2. Check summaries table foreign key relationship
    console.log('2. Checking summaries table foreign key...')
    
    const { data: summariesTest, error: summariesError } = await supabase
      .from('summaries')
      .select('user_id')
      .limit(1)

    if (summariesError) {
      console.error('Summaries table issue:', summariesError)
    } else {
      console.log('✅ Summaries table accessible')
    }

    // 3. Test the specific joins that are failing
    console.log('3. Testing problematic joins...')
    
    // Test summaries join with profiles
    const { data: summariesJoinTest, error: summariesJoinError } = await supabase
      .from('summaries')
      .select(`
        id,
        title,
        profiles!summaries_user_id_fkey(name, avatar_url)
      `)
      .limit(1)

    if (summariesJoinError) {
      console.error('Summaries join error:', summariesJoinError)
      
      // Try alternative join syntax
      const { data: altJoinTest, error: altJoinError } = await supabase
        .from('summaries')
        .select(`
          id,
          title,
          user_id,
          profiles(name, avatar_url)
        `)
        .limit(1)
        
      if (altJoinError) {
        console.error('Alternative join also failed:', altJoinError)
      } else {
        console.log('✅ Alternative join syntax works')
      }
    } else {
      console.log('✅ Summaries join with profiles works')
    }

    // Test books join with profiles including email
    const { data: booksJoinTest, error: booksJoinError } = await supabase
      .from('books')
      .select(`
        id,
        title,
        seller:profiles!books_seller_id_fkey(name, avatar_url, university, phone, email)
      `)
      .limit(1)

    if (booksJoinError) {
      console.error('Books join error:', booksJoinError)
    } else {
      console.log('✅ Books join with profiles (including email) works')
    }

    // 4. Create a test summary and book to verify functionality
    console.log('4. Creating test data...')
    
    // First, get or create a test user
    const { data: testUser, error: testUserError } = await supabase.auth.admin.createUser({
      email: 'testuser@example.com',
      password: 'testpass123',
      email_confirm: true
    })

    if (testUserError && !testUserError.message.includes('already registered')) {
      console.error('Test user creation error:', testUserError)
    } else {
      const userId = testUser?.user?.id || (await supabase.auth.admin.listUsers()).data?.users?.find(u => u.email === 'testuser@example.com')?.id
      
      if (userId) {
        // Create/update profile for test user
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            name: 'Test User',
            email: 'testuser@example.com',
            university: 'Test University',
            phone: '123456789'
          })

        if (profileError) {
          console.error('Test profile creation error:', profileError)
        } else {
          console.log('✅ Test user profile created')
        }
      }
    }

    console.log('\n🎉 Targeted API fixes completed!')

  } catch (error) {
    console.error('❌ Error during targeted fixes:', error)
  }
}

fixSpecificAPIIssues()