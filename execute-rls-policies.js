const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeRLSPolicies() {
  console.log('🔧 Starting RLS policies setup...')
  
  // Essential RLS policies for cart functionality
  const policies = [
    // Enable RLS on critical tables
    `ALTER TABLE IF EXISTS cart_items ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE IF EXISTS books ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE IF EXISTS summaries ENABLE ROW LEVEL SECURITY;`,
    
    // Cart policies
    `DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;`,
    `CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (user_id = auth.uid());`,
    
    // Books policies
    `DROP POLICY IF EXISTS "Anyone can view approved books" ON books;`,
    `CREATE POLICY "Anyone can view approved books" ON books FOR SELECT USING (
      approval_status = 'approved' OR 
      seller_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );`,
    
    // Users can create books
    `DROP POLICY IF EXISTS "Users can create books" ON books;`,
    `CREATE POLICY "Users can create books" ON books FOR INSERT WITH CHECK (seller_id = auth.uid());`,
    
    // Profiles policies
    `DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;`,
    `CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (auth.role() = 'authenticated');`,
    
    `DROP POLICY IF EXISTS "Users can update own profile" ON profiles;`,
    `CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);`,
    
    // Summaries policies
    `DROP POLICY IF EXISTS "Users can create summaries" ON summaries;`,
    `CREATE POLICY "Users can create summaries" ON summaries FOR INSERT WITH CHECK (user_id = auth.uid());`,
    
    `DROP POLICY IF EXISTS "Users can view approved summaries" ON summaries;`,
    `CREATE POLICY "Users can view approved summaries" ON summaries FOR SELECT USING (
      status = 'approved' OR 
      user_id = auth.uid() OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );`
  ]
  
  let successful = 0
  let failed = 0
  
  for (const policy of policies) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: policy })
      if (error) {
        console.error(`❌ Failed: ${policy.substring(0, 50)}...`, error.message)
        failed++
      } else {
        console.log(`✅ Success: ${policy.substring(0, 50)}...`)
        successful++
      }
    } catch (err) {
      console.error(`❌ Exception: ${policy.substring(0, 50)}...`, err.message)
      failed++
    }
  }
  
  console.log(`\n📊 RLS Policies Summary:`)
  console.log(`✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)
  
  // Create storage buckets
  console.log('\n🗂️ Creating storage buckets...')
  
  const buckets = [
    { id: 'summaries', name: 'summaries', public: true },
    { id: 'book-images', name: 'book-images', public: true },
    { id: 'notebooks', name: 'notebooks', public: true },
    { id: 'avatars', name: 'avatars', public: true }
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
  
  console.log('\n🎉 RLS policies setup completed!')
}

executeRLSPolicies().catch(console.error)