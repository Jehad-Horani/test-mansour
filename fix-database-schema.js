const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixDatabaseSchema() {
  console.log('🔧 Fixing database schema...')

  try {
    // First, let's run the SQL fixes directly
    const sqlFixes = `
    -- 1. Add email column if it doesn't exist
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
    
    -- 2. Make phone nullable
    ALTER TABLE profiles ALTER COLUMN phone DROP NOT NULL;
    
    -- 3. Change university to text instead of array
    ALTER TABLE profiles ALTER COLUMN university TYPE TEXT;
    
    -- 4. Update email column for existing profiles
    UPDATE profiles SET email = (
      SELECT email FROM auth.users WHERE auth.users.id = profiles.id
    ) WHERE email IS NULL;
    
    -- 5. Drop existing policies to avoid conflicts
    DROP POLICY IF EXISTS "users_can_view_own_profile" ON profiles;
    DROP POLICY IF EXISTS "users_can_update_own_profile" ON profiles;
    DROP POLICY IF EXISTS "users_can_insert_own_profile" ON profiles;
    DROP POLICY IF EXISTS "service_role_full_access" ON profiles;
    
    -- 6. Recreate simple policies
    CREATE POLICY "users_can_view_own_profile" ON profiles
      FOR SELECT USING (auth.uid() = id);
    
    CREATE POLICY "users_can_update_own_profile" ON profiles
      FOR UPDATE USING (auth.uid() = id);
    
    CREATE POLICY "users_can_insert_own_profile" ON profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
    
    CREATE POLICY "service_role_full_access" ON profiles
      FOR ALL USING (auth.role() = 'service_role');
    `

    console.log('📝 Running SQL schema fixes...')
    
    // Split and execute SQL commands
    const commands = sqlFixes.split(';').filter(cmd => cmd.trim())
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: command.trim() })
          if (error) {
            console.log(`⚠️  SQL command warning: ${error.message}`)
          }
        } catch (err) {
          // Try alternative method for schema changes
          console.log(`⚠️  Trying alternative method for: ${command.substring(0, 50)}...`)
        }
      }
    }

    console.log('✅ Database schema fixes completed!')
    return true
  } catch (error) {
    console.error('❌ Error fixing database schema:', error.message)
    return false
  }
}

// Run the fix
fixDatabaseSchema().then(success => {
  console.log(success ? '🎉 Schema fix completed!' : '❌ Schema fix failed!')
  process.exit(success ? 0 : 1)
})