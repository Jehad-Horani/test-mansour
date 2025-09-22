const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkProfileStructure() {
  console.log('📊 Checking Profile Structure...\n')
  
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error:', error.message)
      return
    }
    
    if (profiles.length > 0) {
      const profile = profiles[0]
      console.log('✅ Sample profile structure:')
      console.log(JSON.stringify(profile, null, 2))
      
      console.log('\n📝 Field types:')
      Object.keys(profile).forEach(key => {
        const value = profile[key]
        const type = Array.isArray(value) ? 'array' : typeof value
        console.log(`   ${key}: ${type} = ${JSON.stringify(value)}`)
      })
    }
    
  } catch (err) {
    console.error('❌ Exception:', err.message)
  }
}

checkProfileStructure()