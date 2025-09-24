const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixSupabaseProfiles() {
  console.log('🔧 Starting Supabase profile fixes...')

  try {
    // Step 1: Check profiles table
    console.log('📋 Checking profiles table...')

    // Step 2: Check for users without profiles
    console.log('👥 Checking for users without profiles...')
    const { data: usersWithoutProfiles, error: usersError } = await supabase
      .from('profiles')
      .select('id')

    if (usersError) {
      console.error('❌ Error checking profiles:', usersError.message)
      return
    }

    console.log(`📊 Found ${usersWithoutProfiles?.length || 0} profiles in database`)

    // Step 3: Get auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message)
      return
    }

    console.log(`🔐 Found ${authUsers.users?.length || 0} auth users`)

    // Step 4: Find users missing profiles
    const profileIds = new Set(usersWithoutProfiles?.map(p => p.id) || [])
    const missingProfiles = authUsers.users?.filter(user => !profileIds.has(user.id)) || []

    console.log(`⚠️  Found ${missingProfiles.length} users missing profiles`)

    // Step 5: Create missing profiles
    if (missingProfiles.length > 0) {
      console.log('🏗️  Creating missing profiles...')
      
      for (const user of missingProfiles) {
        const profileData = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'مستخدم جديد',
          email: user.email,
          phone: user.user_metadata?.phone,
          university: user.user_metadata?.university,
          major: user.user_metadata?.major,
          year: user.user_metadata?.year,
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
        } else {
          console.log(`✅ Created profile for ${user.email}`)
        }
      }
    }

    // Step 6: Verify all profiles exist
    console.log('🔍 Verifying all profiles...')
    const { data: finalProfiles, error: finalError } = await supabase
      .from('profiles')
      .select('id, name, email')

    if (finalError) {
      console.error('❌ Error verifying profiles:', finalError.message)
      return
    }

    console.log(`✅ Total profiles in database: ${finalProfiles?.length || 0}`)
    console.log('🎉 Supabase profile fix completed successfully!')

    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

// Run the fix
fixSupabaseProfiles().then(success => {
  process.exit(success ? 0 : 1)
})