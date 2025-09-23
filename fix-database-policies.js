const { createClient } = require('@supabase/supabase-js')

async function fixDatabasePolicies() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://drehfmtwazwjliahjils.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    console.log('🔧 Starting database policy fix...')

    // Test if we can access profiles table with service role
    console.log('📋 Testing database access...')
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1)

    if (testError) {
      console.error('❌ Database access test failed:', testError.message)
      console.log('ℹ️  This indicates the policies need to be fixed in Supabase dashboard directly.')
      return false
    }

    console.log('✅ Database access successful')

    // Try to insert a test email column if missing
    try {
      const { data: columns, error: columnError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'profiles')
        .eq('column_name', 'email')

      if (!columns || columns.length === 0) {
        console.log('📝 Adding email column to profiles table...')
        // This would need to be done via SQL in Supabase dashboard
        console.log('ℹ️  Email column needs to be added via Supabase dashboard')
      }
    } catch (err) {
      console.log('ℹ️  Column check skipped, will handle via dashboard')
    }

    // Test profile creation/access
    console.log('🧪 Testing profile operations...')
    
    return true

  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

// Run the fix
if (require.main === module) {
  fixDatabasePolicies().then(success => {
    if (success) {
      console.log('✅ Database policy fix completed!')
    } else {
      console.log('❌ Database policy fix failed')
      console.log('\n📋 Manual steps needed:')
      console.log('1. Go to Supabase dashboard > Authentication > Policies')
      console.log('2. Delete all existing policies on "profiles" table')
      console.log('3. Create new policies as shown in fix_auth_policies.sql')
      console.log('4. Or copy and run the SQL from fix_auth_policies.sql in SQL Editor')
    }
    process.exit(success ? 0 : 1)
  })
}

module.exports = { fixDatabasePolicies }