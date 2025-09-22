const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function syncProfiles() {
  console.log('🔄 Syncing auth users with profiles...\n')
  
  try {
    // Get all auth users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message)
      return
    }

    // Get all existing profiles 
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError.message)
      return
    }

    const existingProfileIds = new Set(profiles.map(p => p.id))
    const missingProfiles = users.users.filter(user => !existingProfileIds.has(user.id))

    console.log(`📊 Total auth users: ${users.users.length}`)
    console.log(`📊 Existing profiles: ${profiles.length}`)
    console.log(`📊 Missing profiles: ${missingProfiles.length}\n`)

    if (missingProfiles.length === 0) {
      console.log('✅ All users already have profiles!')
      return
    }

    // Create missing profiles
    const profilesToCreate = missingProfiles.map(user => ({
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
    }))

    console.log('🚀 Creating missing profiles...')
    
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert(profilesToCreate)

    if (insertError) {
      console.error('❌ Error creating profiles:', insertError.message)
      return
    }

    console.log(`✅ Successfully created ${profilesToCreate.length} profiles!`)
    
    // Verify the sync
    const { data: finalProfiles, error: finalError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
    
    if (!finalError) {
      console.log(`✅ Final profile count: ${finalProfiles.count}`)
    }

  } catch (error) {
    console.error('❌ General error:', error.message)
  }
}

syncProfiles()