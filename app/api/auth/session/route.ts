// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log("[v0] Session API - No authenticated user", userError?.message)
      return NextResponse.json({
        session: null,
        userProfile: null,
        error: userError?.message || "No authenticated user",
      })
    }

    console.log("[v0] Session API - User found:", user.id)

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.error("[v0] Session API - Profile fetch error:", profileError.message)
      return NextResponse.json({
        session: { user },
        userProfile: null,
        error: `Profile not found: ${profileError.message}`,
      })
    }

    return NextResponse.json({
      session: { user },
      userProfile: profile,
      error: null,
    })
  } catch (error: any) {
    console.error("[v0] Session API - General error:", error)
    return NextResponse.json({
      session: null,
      userProfile: null,
      error: "Internal server error",
    }, { status: 500 })
  }
}
