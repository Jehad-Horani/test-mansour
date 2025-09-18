import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST() {
  try {
    console.log("[v0] Setting up admin user...")

    const { data: existingAdmin } = await supabaseAdmin.auth.admin.listUsers()
    const adminExists = existingAdmin.users.some((user) => user.email === "admin@takhassus.com")
    const studentExists = existingAdmin.users.some((user) => user.email === "student@takhassus.com")

    let adminData, studentData

    if (!adminExists) {
      // إنشاء المستخدم الإداري
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: "admin@takhassus.com",
        password: "admin123",
        email_confirm: true,
        user_metadata: {
          name: "مدير النظام",
          role: "admin",
        },
      })

      if (authError) {
        console.log("[v0] Auth error:", authError)
        return NextResponse.json({ error: authError.message }, { status: 400 })
      }

      adminData = authData
      console.log("[v0] Admin user created in auth:", authData.user?.id)
    } else {
      console.log("[v0] Admin user already exists")
    }

    if (!studentExists) {
      // إنشاء مستخدم طالب تجريبي
      const { data: authData, error: studentError } = await supabaseAdmin.auth.admin.createUser({
        email: "student@takhassus.com",
        password: "password123",
        email_confirm: true,
        user_metadata: {
          name: "أحمد محمد",
          role: "student",
        },
      })

      if (!studentError && authData.user) {
        studentData = authData
        console.log("[v0] Student user created:", authData.user.id)
      }
    } else {
      console.log("[v0] Student user already exists")
    }

    console.log("[v0] Setup completed successfully")

    return NextResponse.json({
      success: true,
      message: "تم إعداد النظام بنجاح",
      admin: {
        email: "admin@takhassus.com",
        password: "admin123",
      },
      student: {
        email: "student@takhassus.com",
        password: "password123",
      },
    })
  } catch (error) {
    console.error("[v0] Setup error:", error)
    return NextResponse.json(
      {
        error: "حدث خطأ في إعداد النظام",
        details: error instanceof Error ? error.message : "خطأ غير معروف",
      },
      { status: 500 },
    )
  }
}
