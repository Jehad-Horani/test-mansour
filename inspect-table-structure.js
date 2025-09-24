const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function inspectTable() {
  console.log('🔍 Inspecting table structure...')

  try {
    // Get table schema info via information_schema if possible
    const { data: columns, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error:', error)
      return
    }

    if (columns && columns.length > 0) {
      console.log('📋 Sample profile data:')
      console.log(JSON.stringify(columns[0], null, 2))
      
      console.log('\n📋 Field types detected:')
      Object.entries(columns[0]).forEach(([key, value]) => {
        console.log(`  ${key}: ${typeof value} ${Array.isArray(value) ? '(array)' : ''}`)
      })
    } else {
      console.log('📋 No profiles found, trying to insert a test profile...')
      
      // Try with array format
      console.log('🧪 Testing array format...')
      const { error: arrayError } = await supabase
        .from('profiles')
        .insert({
          id: 'test-id-array',
          name: 'Test Array',
          phone: '123456789',
          university: ['Test University'],
          major: 'law',
          year: '1',
          role: 'student',
          subscription_tier: 'free'
        })
      
      if (arrayError) {
        console.log('❌ Array format failed:', arrayError.message)
      } else {
        console.log('✅ Array format works!')
        // Clean up
        await supabase.from('profiles').delete().eq('id', 'test-id-array')
        return
      }
      
      // Try with string format
      console.log('🧪 Testing string format...')
      const { error: stringError } = await supabase
        .from('profiles')
        .insert({
          id: 'test-id-string',
          name: 'Test String',
          phone: '123456789',
          university: 'Test University',
          major: 'law',
          year: '1',
          role: 'student',
          subscription_tier: 'free'
        })
      
      if (stringError) {
        console.log('❌ String format failed:', stringError.message)
      } else {
        console.log('✅ String format works!')
        // Clean up
        await supabase.from('profiles').delete().eq('id', 'test-id-string')
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

inspectTable()