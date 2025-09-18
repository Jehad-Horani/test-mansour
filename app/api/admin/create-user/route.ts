import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// بننشئ supabase client بسيرفر باستخدام service_role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // خليها بالـ .env.local
)

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      )
    }

    // إنشاء المستخدم بسوبابيز Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // نعمل confirm تلقائي
      user_metadata: { name },
    })

    if (authError) {
      console.error("Auth creation error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // إنشاء profile بالجدول profiles
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
      // إذا فشل إنشاء profile نحذف اليوزر من auth
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
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
