// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 })
    }

    const supabase = createClient()

    // إرسال رابط إعادة كلمة السر من Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://test-mansour-e92w.vercel.app/auth/reset-password",
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
