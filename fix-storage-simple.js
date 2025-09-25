const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createStorageBucketsAndPolicies() {
  console.log('🗂️ Setting up storage...')
  
  // Create buckets
  const buckets = ['avatars', 'summaries', 'book-images', 'notebooks', 'lectures']
  
  for (const bucketId of buckets) {
    try {
      const { data, error } = await supabase.storage.createBucket(bucketId, { public: true })
      if (error && !error.message.includes('already exists')) {
        console.error(`❌ Failed to create bucket ${bucketId}:`, error.message)
      } else {
        console.log(`✅ Bucket ${bucketId} ready`)
      }
    } catch (err) {
      console.log(`ℹ️ Bucket ${bucketId} already exists`)
    }
  }
  
  // Create storage policies using SQL
  console.log('🔒 Creating storage policies via SQL...')
  
  const storagePolicies = [
    // Avatars policies
    `DROP POLICY IF EXISTS "avatar_upload_policy" ON storage.objects;`,
    `CREATE POLICY "avatar_upload_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');`,
    `DROP POLICY IF EXISTS "avatar_view_policy" ON storage.objects;`,
    `CREATE POLICY "avatar_view_policy" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');`,
    `DROP POLICY IF EXISTS "avatar_update_policy" ON storage.objects;`,
    `CREATE POLICY "avatar_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');`,
    
    // Book images policies
    `DROP POLICY IF EXISTS "book_images_upload_policy" ON storage.objects;`,
    `CREATE POLICY "book_images_upload_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'book-images' AND auth.role() = 'authenticated');`,
    `DROP POLICY IF EXISTS "book_images_view_policy" ON storage.objects;`,
    `CREATE POLICY "book_images_view_policy" ON storage.objects FOR SELECT USING (bucket_id = 'book-images');`,
    
    // Summaries policies
    `DROP POLICY IF EXISTS "summaries_upload_policy" ON storage.objects;`,
    `CREATE POLICY "summaries_upload_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'summaries' AND auth.role() = 'authenticated');`,
    `DROP POLICY IF EXISTS "summaries_view_policy" ON storage.objects;`,
    `CREATE POLICY "summaries_view_policy" ON storage.objects FOR SELECT USING (bucket_id = 'summaries');`,
    
    // Notebooks policies
    `DROP POLICY IF EXISTS "notebooks_upload_policy" ON storage.objects;`,
    `CREATE POLICY "notebooks_upload_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'notebooks' AND auth.role() = 'authenticated');`,
    `DROP POLICY IF EXISTS "notebooks_view_policy" ON storage.objects;`,
    `CREATE POLICY "notebooks_view_policy" ON storage.objects FOR SELECT USING (bucket_id = 'notebooks');`,
    
    // Lectures policies  
    `DROP POLICY IF EXISTS "lectures_upload_policy" ON storage.objects;`,
    `CREATE POLICY "lectures_upload_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lectures' AND auth.role() = 'authenticated');`,
    `DROP POLICY IF EXISTS "lectures_view_policy" ON storage.objects;`,
    `CREATE POLICY "lectures_view_policy" ON storage.objects FOR SELECT USING (bucket_id = 'lectures');`
  ]
  
  for (const policy of storagePolicies) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: policy })
      if (error) {
        console.error(`❌ Policy error: ${error.message}`)
      } else {
        const policyName = policy.includes('CREATE POLICY') ? policy.split('"')[1] : 'Policy'
        console.log(`✅ ${policyName}`)
      }
    } catch (err) {
      console.error(`💥 Policy execution error: ${err.message}`)
    }
  }
  
  console.log('\n🎉 Storage setup completed!')
}

createStorageBucketsAndPolicies()
