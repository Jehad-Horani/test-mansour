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
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (profileError) {
        console.error("Profile error:", profileError)
        // Return session without profile if profile doesn't exist yet
        return NextResponse.json({ 
          session, 
          userProfile: null,
          error: "Profile not found"
        }, { status: 200 })
      }
      
      userProfile = profileData
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
