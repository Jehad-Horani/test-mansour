import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { access_token } = await req.json()

    if (!access_token) {
      return NextResponse.json(
        { error: "الرابط غير صالح" },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // نثبت السيشن باستخدام الـ access_token اللي اجا من الرابط
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token: access_token, // Supabase بطلب refresh_token برضو، بنحط نفس القيمة
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || "الرابط غير صالح أو منتهي الصلاحية" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, user: data?.user })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "خطأ غير متوقع" },
      { status: 500 }
    )
  }
}
