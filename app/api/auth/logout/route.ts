import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return NextResponse.json({ message: "Logged out" })
  } catch (err: any) {
    console.error("Error in /api/auth/logout:", err)
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
  }
}
