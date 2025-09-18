import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET() {
  try {
    // فحص وجود حساب المدير في جدول profiles
    const { data: adminProfile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("role", "admin")
      .single()

    const setupComplete = !error && adminProfile

    return NextResponse.json({
      setupComplete,
      message: setupComplete ? "النظام جاهز" : "يحتاج إعداد",
    })
  } catch (error) {
    console.error("Error checking setup:", error)
    return NextResponse.json(
      {
        setupComplete: false,
        error: "خطأ في فحص حالة النظام",
      },
      { status: 500 },
    )
  }
}
