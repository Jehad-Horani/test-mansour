import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.json({ user: null, error: sessionError.message }, { status: 200 })
    }

    if (!session?.user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      console.error("Profile error:", profileError)
      // Return user without profile if profile doesn't exist yet
      return NextResponse.json({ 
        user: session.user, 
        profile: null,
        error: "Profile not found" 
      }, { status: 200 })
    }

    return NextResponse.json({ 
      user: session.user, 
      profile 
    }, { status: 200 })
    
  } catch (err: any) {
    console.error("Error in /api/auth/get-user:", err)
    return NextResponse.json({ 
      user: null, 
      error: err.message || "Unexpected error" 
    }, { status: 500 })
  }
}