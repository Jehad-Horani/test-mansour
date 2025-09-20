import { createClient } from "./client"

export interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  university: string
  major: "law" | "it" | "medical" | "business"
  year: string
}

export interface LoginData {
  email: string
  password: string
}

export interface Profile {
  id: string
  name: string
  phone?: string
  university?: string
  major?: "law" | "it" | "medical" | "business"
  year?: string
  graduation_year?: string
  study_level?: string
  avatar_url?: string
  bio?: string
  role: "student" | "admin"
  subscription_tier: "free" | "standard" | "premium"
  subscription_expires_at?: string
  preferences: {
    theme: "retro" | "modern"
    language: "ar" | "en"
    emailNotifications: boolean
    pushNotifications: boolean
    profileVisibility: "public" | "university" | "private"
  }
  stats: {
    uploadsCount: number
    viewsCount: number
    helpfulVotes: number
    coursesEnrolled: number
    booksOwned: number
    consultations: number
    communityPoints: number
  }
  created_at: string
  updated_at: string
}

// Client-side auth functions
export const authClient = {
  async signUp(data: RegisterData) {
    const supabase = createClient()

    console.log("[v0] Starting signUp process for:", data.email)

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          name: data.name,
          phone: data.phone,
          role: "student",
          university: data.university,
          major: data.major,
          year: data.year,
        },
      },
    })

    if (authError) {
      console.log("[v0] SignUp auth error:", authError.message)
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error("فشل في إنشاء حساب المستخدم")
    }

    console.log("[v0] SignUp successful, user created:", authData.user.id)

    // Wait for the profile trigger to complete
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      console.log("[v0] Updating profile with additional data...")

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,  // نفس الـ id من auth.users
          name: data.name,
          phone: data.phone,
          university: data.university,
          major: data.major,
          year: data.year,
          role: "student",
          subscription_tier: "free",
          graduation_year: (new Date().getFullYear() + Number.parseInt(data.year) + 3).toString(),
        })

        

      if (profileError) {
        console.log("[v0] Profile update error:", profileError.message)
        // Profile should be created by trigger, so this is just a warning
        console.warn("[v0] Profile update failed, but profile should exist from trigger")
      }

      console.log("[v0] Profile updated successfully")

    } catch (err: any) {
      console.log("[v0] Profile operation failed:", err.message)
      console.warn("[v0] Profile operation failed, but continuing...")
    }

    return authData
  },

  async signIn(data: LoginData) {
    const supabase = createClient()

    console.log("[v0] Attempting signIn for:", data.email)

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      console.log("[v0] SignIn error:", error)
      throw error
    }

    console.log("[v0] SignIn successful for user:", authData.user?.id)

    // Wait a moment for the session to be established
    await new Promise(resolve => setTimeout(resolve, 300))

    return authData
  },

  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async resetPassword(email: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error
  },

  async updatePassword(newPassword: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  },

  async getProfile(): Promise<Profile | null> {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.log("[v0] No authenticated user found")
      return null
    }

    console.log("[v0] Fetching profile for user:", user.id)

    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) {
      console.log("[v0] Profile fetch error:", error)
      throw error
    }

    console.log("[v0] Profile fetched successfully:", profile?.name)
    return profile
  },

  async updateProfile(updates: Partial<Profile>) {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)

    if (error) throw error
  },
}
