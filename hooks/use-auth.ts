"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { authClient, type Profile, type RegisterData, type LoginData } from "@/lib/supabase/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        try {
          const userProfile = await authClient.getProfile()
          setProfile(userProfile)
        } catch (err) {
          console.error("Error fetching profile:", err)
        }
      }

      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        try {
          const userProfile = await authClient.getProfile()
          setProfile(userProfile)
        } catch (err) {
          console.error("Error fetching profile:", err)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signUp = async (data: RegisterData) => {
    setLoading(true)
    setError(null)

    try {
      await authClient.signUp(data)
      // Note: User will need to verify email before they can sign in
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (data: LoginData) => {
    setLoading(true)
    setError(null)

    try {
      await authClient.signIn(data)
    } catch (err: any) {
      setError(err.message || "حدث خطأ في تسجيل الدخول")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)

    try {
      await authClient.signOut()
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الخروج")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setError(null)

    try {
      await authClient.resetPassword(email)
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إرسال رابط استعادة كلمة المرور")
      throw err
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    setError(null)

    try {
      await authClient.updateProfile(updates)
      const updatedProfile = await authClient.getProfile()
      setProfile(updatedProfile)
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحديث الملف الشخصي")
      throw err
    }
  }

  const isAdmin = () => profile?.role === "admin"
  const isLoggedIn = !!user

  const hasPermission = (permission: string) => {
    if (!profile) return false
    if (profile.role === "admin") return true

    // Define permissions based on subscription tier
    const permissions = {
      free: ["view_content", "upload_files", "participate_community"],
      standard: ["view_content", "upload_files", "participate_community", "consultations"],
      premium: [
        "view_content",
        "upload_files",
        "participate_community",
        "consultations",
        "group_sessions",
        "priority_support",
      ],
    }

    return permissions[profile.subscription_tier]?.includes(permission) || false
  }

  const getMajorLabel = (major: "law" | "it" | "medical" | "business") => {
    const labels = {
      law: "القانون",
      it: "تقنية المعلومات",
      medical: "الطب",
      business: "إدارة الأعمال",
    }
    return labels[major]
  }

  const getTierLabel = (tier: "free" | "standard" | "premium") => {
    const labels = {
      free: "مجاني",
      standard: "قياسي",
      premium: "مميز",
    }
    return labels[tier]
  }

  return {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    isAdmin,
    isLoggedIn,
    hasPermission,
    getMajorLabel,
    getTierLabel,
    clearError: () => setError(null),
  }
}
