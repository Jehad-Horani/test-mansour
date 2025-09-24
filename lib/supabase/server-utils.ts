import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function getServerSession() {
  try {
    // Create a Supabase client for server-side operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Get session from cookies - this is more reliable on server
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('[SERVER AUTH] Session error:', error)
      return { session: null, user: null, error: error.message }
    }
    
    return { session, user: session?.user || null, error: null }
    
  } catch (err: any) {
    console.error('[SERVER AUTH] Unexpected error:', err)
    return { session: null, user: null, error: err.message }
  }
}