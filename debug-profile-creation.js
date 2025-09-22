const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function debugProfileCreation() {
  console.log('🐛 Debugging Profile Creation...\n')
  
  // Test 1: Try creating a profile with minimal data
  console.log('1. Testing minimal profile creation:')
  try {
    const testId = 'fdba1e95-5c70-4013-883c-aa9323ffb2dd' // The user we just created
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: testId,
        name: 'Test User From Script'
      })
      .select()
    
    if (error) {
      console.error('❌ Minimal profile creation error:', error.message)
      console.error('   Error details:', error)
    } else {
      console.log('✅ Minimal profile created:', data)
    }
  } catch (err) {
    console.error('❌ Exception during minimal creation:', err.message)
  }
  
  // Test 2: Check RLS policies
  console.log('\n2. Testing RLS policy with service role:')
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name')
      .limit(1)
    
    if (error) {
      console.error('❌ RLS test error:', error.message)
    } else {
      console.log('✅ RLS test passed, can read profiles:', data.length)
    }
  } catch (err) {
    console.error('❌ RLS test exception:', err.message)
  }
  
  // Test 3: Check table structure
  console.log('\n3. Checking table structure:')
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Structure check error:', error.message)
    } else if (data.length > 0) {
      console.log('✅ Table structure (columns):')
      Object.keys(data[0]).forEach(key => {
        console.log(`   - ${key}: ${typeof data[0][key]}`)
      })
    }
  } catch (err) {
    console.error('❌ Structure check exception:', err.message)
  }
  
  // Test 4: Check if trigger function exists
  console.log('\n4. Checking trigger function:')
  try {
    const { data, error } = await supabase
      .rpc('check_function_exists', { function_name: 'handle_new_user' })
    
    if (error) {
      console.log('⚠️  Cannot check function existence (RPC may not exist)')
    } else {
      console.log('✅ Function check result:', data)
    }
  } catch (err) {
    console.log('⚠️  Function check not available')
  }
}

debugProfileCreation()