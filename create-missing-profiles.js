const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createMissingProfiles() {
  console.log('🔧 Creating missing profiles...')

  try {
    // Get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message)
      return false
    }

    // Get existing profiles
    const { data: existingProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message)
      return false
    }

    console.log(`📊 Found ${authUsers.users?.length || 0} auth users`)
    console.log(`📊 Found ${existingProfiles?.length || 0} existing profiles`)

    const existingProfileIds = new Set(existingProfiles?.map(p => p.id) || [])
    const missingUsers = authUsers.users?.filter(user => !existingProfileIds.has(user.id)) || []

    console.log(`⚠️  Found ${missingUsers.length} users missing profiles`)

    if (missingUsers.length === 0) {
      console.log('✅ All users already have profiles!')
      return true
    }

    // Create profiles one by one with error handling
    let successCount = 0
    let errorCount = 0

    for (const user of missingUsers) {
      try {
        const profileData = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'مستخدم جديد',
          phone: user.user_metadata?.phone || '000000000', // Provide default phone
          university: user.user_metadata?.university || 'جامعة افتراضية',
          major: user.user_metadata?.major || 'law',
          year: user.user_metadata?.year || '1',
          role: user.user_metadata?.role || 'student',
          subscription_tier: 'free',
          preferences: {
            theme: 'retro',
            language: 'ar',
            emailNotifications: true,
            pushNotifications: true,
            profileVisibility: 'university'
          },
          stats: {
            uploadsCount: 0,
            viewsCount: 0,
            helpfulVotes: 0,
            coursesEnrolled: 0,
            booksOwned: 0,
            consultations: 0,
            communityPoints: 0
          }
        }

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData)

        if (insertError) {
          console.error(`❌ Error creating profile for ${user.email}:`, insertError.message)
          errorCount++
        } else {
          console.log(`✅ Created profile for ${user.email}`)
          successCount++
        }
      } catch (err) {
        console.error(`❌ Unexpected error for ${user.email}:`, err.message)
        errorCount++
      }
    }

    console.log(`📊 Results: ${successCount} created, ${errorCount} failed`)

    // Verify final count
    const { data: finalProfiles } = await supabase
      .from('profiles')
      .select('id')

    console.log(`🎉 Total profiles now: ${finalProfiles?.length || 0}`)
    
    return successCount > 0

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

createMissingProfiles().then(success => {
  console.log(success ? '🎉 Profile creation completed!' : '❌ Profile creation failed!')
  process.exit(success ? 0 : 1)
})