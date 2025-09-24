import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function runComprehensiveTest() {
  console.log('🧪 Starting Supabase Fetch like site...')

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', "ID_HERE") // بدل ID_HERE خلي الـ user.id

  if (error) {
    console.error("Fetch error:", error.message)
    return
  }

  console.log("Profiles:", data)
}

runComprehensiveTest()
