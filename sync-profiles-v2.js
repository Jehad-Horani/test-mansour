const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function syncProfilesV2() {
  console.log('🔄 Syncing auth users with profiles (V2)...\n')
  
  try {
    // Get all auth users
    const { data: usersResponse, error: usersError } = await supabase.auth.admin.listUsers()
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message)
      return
    }

    console.log(`📊 Found ${usersResponse.users.length} auth users`)

    // Get existing profiles 
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message)
      return
    }

    console.log(`📊 Found ${profiles.length} existing profiles`)

    const existingProfileIds = new Set(profiles.map(p => p.id))
    const missingUsers = usersResponse.users.filter(user => !existingProfileIds.has(user.id))

    console.log(`📊 Missing profiles for ${missingUsers.length} users\n`)

    if (missingUsers.length === 0) {
      console.log('✅ All users already have profiles!')
      return
    }

    // Create profiles one by one to see any specific errors
    let successCount = 0
    let errorCount = 0

    for (const user of missingUsers) {
      console.log(`Creating profile for user: ${user.email} (${user.id})`)
      
      const profileData = {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'مستخدم جديد',
        phone: user.user_metadata?.phone || null,
        university: user.user_metadata?.university || null,
        major: user.user_metadata?.major || null,
        year: user.user_metadata?.year || null,
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
        console.error(`  ❌ Error creating profile for ${user.email}:`, insertError.message)
        errorCount++
      } else {
        console.log(`  ✅ Profile created for ${user.email}`)
        successCount++
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Errors: ${errorCount}`)
    
    // Final verification
    const { data: finalProfiles, error: finalError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
    
    if (!finalError) {
      console.log(`📊 Total profiles now: ${finalProfiles.count}`)
    }

  } catch (error) {
    console.error('❌ General error:', error.message)
  }
}

syncProfilesV2()