const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function debugDatabase() {
  console.log('🔍 Checking Supabase Database State...\n')
  
  try {
    // Check if profiles table exists and get structure
    console.log('1. Checking profiles table structure:')
    const { data: tableInfo, error: tableError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error('❌ Error accessing profiles table:', tableError.message)
    } else {
      console.log('✅ Profiles table exists')
    }

    // Check existing profiles
    console.log('\n2. Checking existing profiles:')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(10)
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message)
    } else {
      console.log(`✅ Found ${profiles.length} profiles:`)
      profiles.forEach(profile => {
        console.log(`   - ID: ${profile.id}, Name: ${profile.name}, Email: ${profile.email || 'N/A'}`)
      })
    }

    // Check auth users
    console.log('\n3. Checking auth users:')
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Error fetching auth users:', usersError.message)
    } else {
      console.log(`✅ Found ${users.users.length} auth users:`)
      users.users.forEach(user => {
        console.log(`   - ID: ${user.id}, Email: ${user.email}`)
      })
    }

    // Check trigger function
    console.log('\n4. Checking trigger function:')
    const { data: functions, error: funcError } = await supabase
      .rpc('check_function_exists', { function_name: 'handle_new_user' })
      .catch(() => {
        // If RPC doesn't exist, try a simple query to test connection
        return supabase.from('profiles').select('count', { count: 'exact', head: true })
      })

    console.log('✅ Database connection working')

  } catch (error) {
    console.error('❌ General error:', error.message)
  }
}

debugDatabase()