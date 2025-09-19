import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) throw error

    let userProfile = null
    if (session?.user) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (profileError) throw profileError
      userProfile = profileData
    }

    return NextResponse.json({ session, userProfile })
  } catch (err: any) {
    console.error("Error fetching session:", err)
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
  }
}
