// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export interface Profile {
  id: string
  name: string
  email: string
  phone?: string
  university?: string
  major?: string
  role: "student" | "admin"
  subscription_tier: string
  created_at: string
  avatar_url?: string
  preferences?: Record<string, any>
}

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
        } catch (err) {
          console.error("Failed to set cookie:", err)
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (err) {
          console.error("Failed to remove cookie:", err)
        }
      },
    },
  })
}

// Create admin client with service role key
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[v0] Admin - Missing Supabase environment variables")
    throw new Error("Missing Supabase environment variables")
  }

  return createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      get() { return undefined },
      set() {},
      remove() {},
    },
  })
}

// Server-side auth utilities
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

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (error) {
      console.error("[v0] getProfile error:", error)
      return null
    }

    return profile
  },

  async requireAuth() {
    const user = await this.getUser()
    if (!user) {
      throw new Error("Authentication required")
    }
    return user
  },

  async requireAdmin() {
    const profile = await this.getProfile()
    if (!profile || profile.role !== "admin") {
      throw new Error("Admin access required")
    }
    return profile
  }
}