const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function fixStatusColumn() {
  console.log('🔧 Fixing summaries table status column...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  // Create admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // The direct SQL approach - we'll execute this via the Supabase SQL editor approach
  const migrationSQL = `
-- Add status column to summaries table
ALTER TABLE summaries 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Copy data from is_approved to status column
UPDATE summaries 
SET status = CASE 
    WHEN is_approved = true THEN 'approved'
    ELSE 'pending'
END
WHERE status IS NULL OR status = 'pending';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_summaries_status ON summaries(status);
  `.trim()
  
  console.log('📄 SQL to execute:')
  console.log(migrationSQL)
  
  try {
    // Since RPC might not work, let's try using the REST API directly
    // We'll use the admin client to make a direct SQL request
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        sql: migrationSQL
      })
    })
    
    if (!response.ok) {
      console.log('❌ RPC exec_sql not available, trying alternative approach...')
      
      // Alternative: Try using Supabase's query method step by step
      console.log('🔧 Adding status column...')
      
      // We can't execute DDL through the client directly, so let's verify what we can do
      console.log('⚠️  Cannot execute DDL (ALTER TABLE) through Supabase client')
      console.log('📋 Manual steps required:')
      console.log('1. Go to Supabase Dashboard > SQL Editor')
      console.log('2. Execute the following SQL:')
      console.log('')
      console.log(migrationSQL)
      console.log('')
      console.log('OR provide access to execute DDL statements through the API')
      
      return false
    }
    
    const result = await response.json()
    console.log('✅ Migration executed:', result)
    
  } catch (error) {
    console.error('❌ Failed to execute migration:', error.message)
    console.log('')
    console.log('📋 Manual migration required:')
    console.log('Please execute this SQL in Supabase Dashboard > SQL Editor:')
    console.log('')
    console.log(migrationSQL)
    return false
  }
  
  // Verify the fix
  console.log('🔍 Verifying status column...')
  try {
    const { data, error } = await supabase
      .from('summaries')
      .select('status, is_approved')
      .limit(1)
    
    if (error) {
      console.error('❌ Status column verification failed:', error.message)
      return false
    } else {
      console.log('✅ Status column accessible!')
      if (data && data.length > 0) {
        console.log('📊 Sample record:', data[0])
      }
      return true
    }
  } catch (error) {
    console.error('❌ Verification failed:', error.message)
    return false
  }
}

fixStatusColumn().then((success) => {
  if (success) {
    console.log('🎉 Status column migration completed!')
    process.exit(0)
  } else {
    console.log('⚠️  Manual intervention required')
    process.exit(1)
  }
}).catch(console.error)