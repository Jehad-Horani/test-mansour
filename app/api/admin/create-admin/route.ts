import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json()

    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone },
      email_confirm: true,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Update profile to admin role
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update({
        role: "admin",
        subscription_tier: "premium",
        subscription_expires_at: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", authData.user.id)
      .select()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({
      message: "تم إنشاء حساب المدير بنجاح",
      user: authData.user,
      profile: profileData[0],
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ error: "حدث خطأ في إنشاء حساب المدير" }, { status: 500 })
  }
}
