const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

async function applyMigration() {
  console.log('🚀 Starting database migration...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    process.exit(1)
  }
  
  // Create admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  console.log('✅ Connected to Supabase')
  
  // Read migration script
  const migrationPath = path.join(__dirname, 'scripts', 'fix_all_upload_issues.sql')
  console.log('📄 Reading migration script:', migrationPath)
  
  let migrationSQL
  try {
    migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    console.log('✅ Migration script loaded')
  } catch (error) {
    console.error('❌ Failed to read migration script:', error.message)
    process.exit(1)
  }
  
  console.log('🔧 Applying database migration...')
  
  // Apply migration
  try {
    const { data, error } = await supabase.rpc('execute_sql', { 
      sql: migrationSQL 
    })
    
    if (error) {
      console.error('❌ Migration failed with RPC error:', error)
      // Try direct query approach
      console.log('🔄 Trying direct query approach...')
      const { data: directData, error: directError } = await supabase
        .from('summaries')
        .select('status')
        .limit(1)
      
      if (directError) {
        console.log('📊 Current summaries table schema check failed:', directError.message)
        console.log('🔧 Need to add status column to summaries table')
        
        // Execute the critical part of the migration directly
        const addStatusColumn = `
          ALTER TABLE summaries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
          
          UPDATE summaries 
          SET status = CASE 
              WHEN is_approved = true THEN 'approved'
              ELSE 'pending'
          END
          WHERE status IS NULL OR status = 'pending';
        `
        
        console.log('🔧 Executing critical schema fix...')
        // Note: We'll need to use a different approach since RPC might not be available
      }
    } else {
      console.log('✅ Migration applied successfully:', data)
    }
    
  } catch (error) {
    console.error('❌ Migration execution failed:', error.message)
  }
  
  console.log('🔍 Verifying schema changes...')
  
  // Check if status column exists
  try {
    const { data, error } = await supabase
      .from('summaries')
      .select('status')
      .limit(1)
    
    if (error) {
      console.error('❌ Status column verification failed:', error.message)
      return false
    } else {
      console.log('✅ Status column exists and is accessible')
      return true
    }
  } catch (error) {
    console.error('❌ Schema verification failed:', error.message)
    return false
  }
}

applyMigration().then((success) => {
  if (success) {
    console.log('🎉 Migration completed successfully!')
    process.exit(0)
  } else {
    console.log('❌ Migration verification failed')
    process.exit(1)
  }
}).catch((error) => {
  console.error('💥 Migration script failed:', error)
  process.exit(1)
})