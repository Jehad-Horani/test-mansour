import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get the current user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log("[v0] Session API - No authenticated user")
      return NextResponse.json({ 
        session: null, 
        userProfile: null,
        error: userError?.message || "No authenticated user"
      })
    }

    console.log("[v0] Session API - User found:", user.id)

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error("[v0] Session API - Profile fetch error:", profileError.message)
      return NextResponse.json({
        session: { user },
        userProfile: null,
        error: `Profile not found: ${profileError.message}`
      })
    }

    console.log("[v0] Session API - Profile found for user:", user.id)

    return NextResponse.json({
      session: { user },
      userProfile: profile,
      error: null
    })

  } catch (error) {
    console.error("[v0] Session API - General error:", error)
    return NextResponse.json({
      session: null,
      userProfile: null,
      error: "Internal server error"
    }, { status: 500 })
  }
}