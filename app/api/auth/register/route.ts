import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, university, major, year } = await req.json()
    const supabase = createClient()

    // تسجيل المستخدم في Supabase Auth
    const { data: user, error: signUpError } = await supabase.auth.signUp({
      
        email,
      password,
    })

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 })
    }

    // إنشاء profile في جدول profiles
    const { error: profileError } = await supabase.from("profiles").insert({
      name,
      phone,
      university,
      major,
      year,
      created_at: new Date(),
    })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ message: "تم إنشاء الحساب بنجاح" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
