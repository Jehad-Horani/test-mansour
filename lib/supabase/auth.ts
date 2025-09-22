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
  email: string
  password: string
  id: string
  name: string
  phone?: string
  university?: string
  major?: "law" | "it" | "medical" | "business"
  year: string
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
  async signUp(data: Profile) {
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
          university: data.university,
          major: data.major,
          year: data.year,
          role: "student",
          subscription_tier: "free",
        },
      },
    })

    if (authError) throw new Error(authError.message)
    if (!authData.user) throw new Error("فشل في إنشاء حساب المستخدم")
    console.log("[v0] inserting profile:", {
      id: authData.user.id,
      name: data.name,
      phone: data.phone,
      university: data.university,
      major: data.major,
      year: data.year,
      role: "student",
      subscription_tier: "free",
      graduation_year: (new Date().getFullYear() + Number.parseInt(data.year) + 3).toString(),
    })


    // Insert full profile directly
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        name: data.name,
        phone: data.phone,
        university: data.university,
        major: data.major,
        year: data.year,
        role: "student",
        subscription_tier: "free",
        graduation_year: (new Date().getFullYear() + Number.parseInt(data.year) + 3).toString(),
      })

    if (profileError) console.warn("[v0] Profile insert warning:", profileError.message)

    return authData
  },

  async signIn(data: LoginData) {
    const supabase = createClient()
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) throw error
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
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  },

  async getProfile(): Promise<Profile | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
    if (error) throw error
    return profile
  },

  async updateProfile(updates: Partial<Profile>) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)
    if (error) throw error
  },
}
