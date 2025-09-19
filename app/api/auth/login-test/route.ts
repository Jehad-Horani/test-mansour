import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "student@takhassus.com",
      password: "password123",
    })

    if (error) throw error

    return NextResponse.json({ user: data.user })
  } catch (err: any) {
    console.error("Error in /api/auth/login-test:", err)
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
  }
}
