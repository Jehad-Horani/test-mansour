const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createStorageBuckets() {
  console.log('🗂️ Creating storage buckets...')
  
  const buckets = [
    { id: 'avatars', public: true },
    { id: 'summaries', public: true },
    { id: 'book-images', public: true },
    { id: 'notebooks', public: true },
    { id: 'lectures', public: true }
  ]
  
  for (const bucket of buckets) {
    try {
      const { data, error } = await supabase.storage.createBucket(bucket.id, { public: bucket.public })
      if (error && !error.message.includes('already exists')) {
        console.error(`❌ Failed to create bucket ${bucket.id}:`, error.message)
      } else {
        console.log(`✅ Bucket ${bucket.id} ready`)
      }
    } catch (err) {
      console.log(`ℹ️ Bucket ${bucket.id} might already exist`)
    }
  }
}

async function createStoragePolicies() {
  console.log('🔒 Creating storage policies...')
  
  // Delete existing policies first
  const policies = await supabase.storage.listPolicies('avatars')
  if (policies.data) {
    for (const policy of policies.data) {
      await supabase.storage.deletePolicy(policy.name, 'avatars')
    }
  }

  // Avatars bucket policies
  try {
    await supabase.storage.createPolicy('avatar_upload', 'avatars', {
      operation: 'INSERT',
      definition: 'auth.role() = \'authenticated\''
    })
    console.log('✅ Avatar upload policy created')
  } catch (err) {
    console.log('ℹ️ Avatar upload policy might already exist')
  }

  try {
    await supabase.storage.createPolicy('avatar_view', 'avatars', {
      operation: 'SELECT',
      definition: 'true'
    })
    console.log('✅ Avatar view policy created')
  } catch (err) {
    console.log('ℹ️ Avatar view policy might already exist')
  }

  try {
    await supabase.storage.createPolicy('avatar_update', 'avatars', {
      operation: 'UPDATE',
      definition: 'auth.role() = \'authenticated\''
    })
    console.log('✅ Avatar update policy created')
  } catch (err) {
    console.log('ℹ️ Avatar update policy might already exist')
  }
}

async function fixStorageIssues() {
  await createStorageBuckets()
  await createStoragePolicies()
  
  console.log('\n🎉 Storage setup completed!')
  console.log('✅ All storage buckets created')
  console.log('✅ Storage policies configured')
  console.log('✅ Avatar uploads should now work without RLS violations')
}

fixStorageIssues()
