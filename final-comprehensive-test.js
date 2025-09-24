import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function runComprehensiveTest() {
  console.log('🧪 Starting Supabase Fetch for logged-in user...')

  // جلب بيانات الجلسة
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user) {
    console.error("⚠️ User not logged in")
    return
  }

  const userId = session.user.id

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error("Fetch error:", error.message)
    return
  }

  console.log("Profile of logged-in user:", data)
}

runComprehensiveTest()
