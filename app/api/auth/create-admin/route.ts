import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Create user in Supabase Auth using service role
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation for admin
      user_metadata: {
        name,
      },
    })

    if (authError) {
      console.error("Auth creation error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Create profile with admin role
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      name,
      role: "admin",
      subscription_tier: "premium",
      preferences: {
        theme: "retro",
        language: "ar",
        emailNotifications: true,
        pushNotifications: true,
        profileVisibility: "private",
      },
      stats: {
        uploadsCount: 0,
        viewsCount: 0,
        helpfulVotes: 0,
        coursesEnrolled: 0,
        booksOwned: 0,
        consultations: 0,
        communityPoints: 0,
      },
    })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Try to clean up the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
        role: "admin",
      },
    })
  } catch (error: any) {
    console.error("Admin creation error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
