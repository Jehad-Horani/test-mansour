import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) return NextResponse.json({ session: null, userProfile: null })

    let userProfile = null
    if (session?.user) {
      const maxRetries = 3
      let attempts = 0

      while (attempts < maxRetries) {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle()
        if (!error && data) {
          userProfile = data
          break
        }
        attempts++
        await new Promise(res => setTimeout(res, 1000))
      }
    }

    return NextResponse.json({ session, userProfile })
  } catch (err: any) {
    return NextResponse.json({ session: null, userProfile: null, error: err.message }, { status: 500 })
  }
}
