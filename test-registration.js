const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MjYyNjAsImV4cCI6MjA3MzAwMjI2MH0.Juj9ccOUxnbHJ_b5OODhBBvKMpwTi4l2p6Rr-sZNg1E'

async function testRegistration() {
  console.log('🧪 Testing Supabase Registration...\n')
  
  // Test with anon key (like frontend does)
  console.log('1. Testing with anon key (frontend simulation):')
  const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    const { data, error } = await supabaseAnon.auth.signUp({
      email: 'testuser123@gmail.com',
      password: 'TestPassword123!',
      options: {
        data: {
          name: 'Test User',
          phone: '+962791234567',
          university: 'الجامعة الأردنية',
          major: 'law',
          year: '1'
        }
      }
    })
    
    if (error) {
      console.error('❌ Anon signup error:', error.message)
      
      // Check if it's email validation issue
      if (error.message.includes('invalid')) {
        console.log('🔍 This appears to be an email validation issue')
        
        // Try with service role to see if it's a permission issue
        console.log('\n2. Testing with service role key:')
        const supabaseService = createClient(supabaseUrl, supabaseServiceKey)
        
        const { data: serviceData, error: serviceError } = await supabaseService.auth.adminlb.createUser({
          email: 'testuser456@gmail.com',
          password: 'TestPassword123!',
          user_metadata: {
            name: 'Test User Service',
            phone: '+962791234567',
            university: 'الجامعة الأردنية',
            major: 'law',
            year: '1'
          },
          email_confirm: true
        })
        
        if (serviceError) {
          console.error('❌ Service role error:', serviceError.message)
        } else {
          console.log('✅ Service role user creation successful:', serviceData.user?.id)
        }
      }
    } else {
      console.log('✅ Anon signup successful:', data.user?.id)
    }
    
  } catch (err) {
    console.error('❌ Test error:', err.message)
  }
  
  // Test profile creation directly
  console.log('\n3. Testing direct profile creation:')
  const supabaseService = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    const { data: profileData, error: profileError } = await supabaseService
      .from('profiles')
      .insert({
        id: '123e4567-e89b-12d3-a456-426614174000', // Random UUID
        name: 'Direct Test User',
        phone: '+962791234567',
        university: 'الجامعة الأردنية',
        major: 'law',
        year: '1',
        role: 'student',
        subscription_tier: 'free'
      })
      
    if (profileError) {
      console.error('❌ Direct profile creation error:', profileError.message)
    } else {
      console.log('✅ Direct profile creation successful')
      
      // Clean up
      await supabaseService.from('profiles').delete().eq('id', '123e4567-e89b-12d3-a456-426614174000')
      console.log('🧹 Test profile cleaned up')
    }
  } catch (err) {
    console.error('❌ Profile test error:', err.message)
  }
}

testRegistration()