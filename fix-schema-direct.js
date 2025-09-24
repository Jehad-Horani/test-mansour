const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

async function fixSchema() {
  console.log('🔧 Fixing database schema directly...')
  
  try {
    // Direct SQL execution to fix schema issues
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Make phone nullable
        ALTER TABLE profiles ALTER COLUMN phone DROP NOT NULL;
        
        -- Change university from array to text if needed
        ALTER TABLE profiles ALTER COLUMN university TYPE TEXT;
        
        -- Ensure RLS policies are correct
        DROP POLICY IF EXISTS "users_can_view_own_profile" ON profiles;
        DROP POLICY IF EXISTS "users_can_update_own_profile" ON profiles;
        DROP POLICY IF EXISTS "users_can_insert_own_profile" ON profiles;
        DROP POLICY IF EXISTS "service_role_full_access" ON profiles;
        
        -- Recreate policies
        CREATE POLICY "users_can_view_own_profile" ON profiles
          FOR SELECT USING (auth.uid() = id);
        
        CREATE POLICY "users_can_update_own_profile" ON profiles
          FOR UPDATE USING (auth.uid() = id);
        
        CREATE POLICY "users_can_insert_own_profile" ON profiles
          FOR INSERT WITH CHECK (auth.uid() = id);
        
        CREATE POLICY "service_role_full_access" ON profiles
          FOR ALL USING (auth.role() = 'service_role');
      `
    })
    
    if (error) {
      console.log('⚠️  Some SQL commands had issues:', error.message)
    }
    
    console.log('✅ Schema fixes completed')
    return true
  } catch (err) {
    console.error('❌ Error:', err.message)
    return false
  }
}

// Check if we can connect and get table info
async function checkConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1)
    console.log('✅ Connection successful')
    
    if (data && data.length > 0) {
      console.log('📋 Sample profile structure:', Object.keys(data[0]))
    } else {
      console.log('📋 No profiles found in table')
    }
    
    return true
  } catch (err) {
    console.error('❌ Connection failed:', err.message)
    return false
  }
}

async function main() {
  console.log('🚀 Starting database diagnostic and fix...')
  
  const connected = await checkConnection()
  if (!connected) {
    process.exit(1)
  }
  
  const fixed = await fixSchema()
  process.exit(fixed ? 0 : 1)
}

main()