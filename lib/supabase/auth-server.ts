import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Profile } from "./auth"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options)   // ✅ هيك الصح
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", { ...options, maxAge: 0 })
        },
      },
    }
  )
}


// Server-side auth functions
export const authServer = {
  async getUser() {
const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  },

  async getProfile(): Promise<Profile | null> {
const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) return null
    return profile
  },
}