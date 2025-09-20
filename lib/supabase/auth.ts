import { createClient } from "./client"
import { createClient as createServerClient } from "./server"

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
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/welcome`,
        data: {
          name: data.name,
          phone: data.phone,
          role: "student",
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

    // Wait for the user to be properly created
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      console.log("[v0] Updating profile with additional data...")

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          university: data.university,
          major: data.major,
          year: data.year,
          phone: data.phone,
          graduation_year: (new Date().getFullYear() + Number.parseInt(data.year) + 3).toString(),
        })
        .eq("id", authData.user.id)

      if (profileError) {
        console.log("[v0] Profile update error:", profileError.message)
        const { error: insertError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          name: data.name,
          phone: data.phone,
          university: data.university,
          major: data.major,
          year: data.year,
          graduation_year: (new Date().getFullYear() + Number.parseInt(data.year) + 3).toString(),
          role: "student",
          subscription_tier: "free",
          preferences: {
            theme: "retro",
            language: "ar",
            emailNotifications: true,
            pushNotifications: true,
            profileVisibility: "university",
          },
          stats: {
            uploadsCount: 0,
            viewsCount: 0,
            helpfulVotes: 0,
            coursesEnrolled: 0,
            booksOwned: 0,
            consultations: 0,
            communityPoints: 0,
          },
        })

        if (insertError) {
          console.log("[v0] Profile insert error:", insertError.message)
          throw new Error("فشل في إنشاء الملف الشخصي")
        }
      }

      console.log("[v0] Profile updated successfully")
      
      // Wait a bit more for the profile to be fully created
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (err: any) {
      console.log("[v0] Profile operation failed:", err.message)
      throw new Error("فشل في حفظ بيانات المستخدم")
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

// Server-side auth functions
export const authServer = {
  async getUser() {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  },

  async getProfile(): Promise<Profile | null> {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) return null
    return profile
  },
}
