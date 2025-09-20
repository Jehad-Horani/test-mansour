import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.json({ session: null, userProfile: null }, { status: 200 })
    }

    let userProfile = null

    if (session?.user) {
      const maxRetries = 3
      let attempts = 0
      let profileData = null
      let profileError = null

      while (attempts < maxRetries) {
        const res = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        profileData = res.data
        profileError = res.error

        if (!profileError && profileData) break

        console.log(`[v0] Profile fetch attempt ${attempts + 1} failed, retrying...`, profileError)
        await new Promise(resolve => setTimeout(resolve, 1000)) // انتظر 1 ثانية قبل المحاولة التالية
        attempts++
      }

      if (profileError || !profileData) {
        console.error("Profile fetch failed after retries:", profileError)
        userProfile = null
      } else {
        userProfile = profileData
      }
    }

    return NextResponse.json({ session, userProfile }, { status: 200 })
    
  } catch (err: any) {
    console.error("Error fetching session:", err)
    return NextResponse.json({ 
      session: null, 
      userProfile: null, 
      error: err.message || "Unexpected error" 
    }, { status: 500 })
  }
}
