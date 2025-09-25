const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://drehfmtwazwjliahjils.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZWhmbXR3YXp3amxpYWhqaWxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQyNjI2MCwiZXhwIjoyMDczMDAyMjYwfQ.l05nEunL7NyaYv_9a_d2Pb58p4k0wmSM7QxFiT-_pHI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createCartTable() {
  console.log('Creating cart_items table...')
  
  // Method 1: Use raw SQL query
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS cart_items (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id uuid NOT NULL,
          book_id uuid NOT NULL,
          quantity integer NOT NULL DEFAULT 1,
          added_at timestamp with time zone DEFAULT now(),
          UNIQUE(user_id, book_id)
        );
        
        ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
      `
    })
    
    if (error) {
      console.error('RPC Error:', error)
    } else {
      console.log('✅ Cart table created with RPC')
    }
  } catch (rpcError) {
    console.log('RPC method failed, trying alternative...')
  }

  // Method 2: Test if table exists by trying to access it
  try {
    const { data, error } = await supabase.from('cart_items').select('*').limit(1)
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('❌ Cart table still does not exist')
        
        // Let's create it manually using a different approach
        console.log('Trying alternative creation method...')
        
        // Try creating a simple version first
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql: 'CREATE TABLE cart_items (id SERIAL PRIMARY KEY, user_id TEXT, book_id TEXT, quantity INTEGER DEFAULT 1);'
        })
        
        if (createError) {
          console.error('Alternative creation failed:', createError)
        } else {
          console.log('✅ Simple cart table created')
        }
      } else {
        console.log('✅ Cart table exists but has other issues:', error.message)
      }
    } else {
      console.log('✅ Cart table exists and accessible')
    }
  } catch (testError) {
    console.error('Test error:', testError)
  }

  // Method 3: Create using REST API directly if nothing else works
  console.log('Final verification...')
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/cart_items?select=*&limit=1`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      console.log('✅ Cart table accessible via REST API')
    } else {
      console.log('❌ Cart table not accessible via REST API:', response.status)
      const errorText = await response.text()
      console.log('Error details:', errorText)
    }
  } catch (fetchError) {
    console.error('Fetch error:', fetchError)
  }
}

createCartTable()