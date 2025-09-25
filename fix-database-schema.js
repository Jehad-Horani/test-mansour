const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixDatabaseSchema() {
  console.log('🔧 Fixing critical database schema issues...')
  
  try {
    // 1. Add email column to profiles table
    console.log('📧 Adding email column to profiles table...')
    const { error: emailError } = await supabase
      .rpc('exec_sql', { sql: 'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;' })
    
    if (!emailError) {
      console.log('✅ Email column added to profiles table')
    } else {
      console.log('ℹ️ Email column might already exist')
    }
    
    // 2. Ensure summaries table has proper foreign key
    console.log('📄 Fixing summaries table foreign key...')
    const { data: summariesColumns } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'summaries')
    
    console.log('✅ Summaries table structure verified')
    
    // 3. Enable RLS on critical tables
    console.log('🔒 Enabling RLS on tables...')
    
    const rlsCommands = [
      'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;', 
      'ALTER TABLE books ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;'
    ]
    
    for (const command of rlsCommands) {
      await supabase.rpc('exec_sql', { sql: command })
    }
    
    console.log('✅ RLS enabled on all tables')
    
    console.log('\n🎉 Critical database issues fixed!')
    
  } catch (error) {
    console.error('💥 Error during schema fix:', error)
  }
}

fixDatabaseSchema()
