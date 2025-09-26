const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function checkSchema() {
  console.log('🔍 Checking current database schema...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    process.exit(1)
  }
  
  // Create admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  console.log('✅ Connected to Supabase')
  console.log('🏢 URL:', supabaseUrl)
  
  // Check summaries table schema
  try {
    console.log('📊 Checking summaries table structure...')
    
    // Try to get a sample record to see the schema
    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Failed to query summaries table:', error.message)
      console.error('   Code:', error.code)
      console.error('   Details:', error.details)
      console.error('   Hint:', error.hint)
    } else {
      console.log('✅ Summaries table accessible')
      if (data && data.length > 0) {
        console.log('📋 Sample record structure:', Object.keys(data[0]))
        console.log('🔍 Has status column?', 'status' in data[0])
        console.log('🔍 Has is_approved column?', 'is_approved' in data[0])
      } else {
        console.log('📋 Table is empty, checking by attempting insert...')
        
        // Try to insert a test record to see what columns are expected
        const testRecord = {
          title: "Test Summary",
          user_id: "00000000-0000-0000-0000-000000000000",
          status: "pending" // This should fail if column doesn't exist
        }
        
        const { data: insertData, error: insertError } = await supabase
          .from('summaries')
          .insert(testRecord)
          .select()
        
        if (insertError) {
          console.log('📋 Insert test failed (expected):', insertError.message)
          if (insertError.message.includes('column "status" of relation "summaries" does not exist')) {
            console.log('🎯 CONFIRMED: status column is missing from summaries table')
          }
        } else {
          console.log('✅ Insert test succeeded - status column exists')
          // Clean up test record
          await supabase
            .from('summaries')
            .delete()
            .eq('title', 'Test Summary')
        }
      }
    }
    
  } catch (error) {
    console.error('💥 Schema check failed:', error.message)
  }
}

checkSchema().catch(console.error)