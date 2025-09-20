import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) throw error

    let userProfile = null
    if (session?.user) {
      // Add retry logic for profile fetching
      let retries = 0
      const maxRetries = 3
      
      while (retries < maxRetries && !userProfile) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (!profileError && profileData) {
          userProfile = profileData
          break
        }
        
        retries++
        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
      
      if (!userProfile) {
        console.log("[v0] Profile not found for user:", session.user.id)
      }
    }

    return NextResponse.json({ session, userProfile })
  } catch (err: any) {
    console.error("Error fetching session:", err)
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
  }
}
