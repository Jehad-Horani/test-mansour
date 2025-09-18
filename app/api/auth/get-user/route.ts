import { NextResponse } from "next/server"
import { createClient } from "../../../lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) throw error
    return NextResponse.json({ user: data.user })
  } catch (err: any) {
    console.error("Error in /api/auth/get-user:", err)
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
  }
}
