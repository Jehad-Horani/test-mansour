// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Profile } from "./auth"

// ⚡ إنشاء عميل Supabase للـ server-side SSR
export async function createClient() {
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
    set(name: string, value: string, options?: any) {
      cookieStore.set({ name, value, ...options })
    },
    remove(name: string, options?: any) {
      cookieStore.set({ name, value: "", ...options })
    },
  },
})
}

// ---------------------- دوال server-side ----------------------
export const authServer = {
  async getUser() {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error("[v0] authServer.getUser error:", error)
        return null
      }
      return data.user ?? null
    } catch (err) {
      console.error("[v0] authServer.getUser unexpected error:", err)
      return null
    }
  },

  async getProfile(): Promise<Profile | null> {
    try {
      const supabase = await createClient()
      const { data: sessionData, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error("[v0] getProfile - getUser error:", userError)
        return null
      }
      const user = sessionData.user
      if (!user) return null

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

      if (error) {
        console.error("[v0] getProfile error:", error)
        return null
      }

      return profile ?? null
    } catch (err) {
      console.error("[v0] getProfile unexpected error:", err)
      return null
    }
  },
}
