import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Profile } from "./auth"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Server - Missing Supabase environment variables")
    throw new Error("Missing Supabase environment variables")
  }

  const cookieStore = cookies()
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Handle cookie setting errors in middleware
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch (error) {
          // Handle cookie removal errors in middleware
        }
      },
    },
  })
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