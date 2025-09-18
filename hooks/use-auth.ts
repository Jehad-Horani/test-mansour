"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { useSupabaseClient } from "@/app/lib/supabase/client-wrapper"
import { authClient, type Profile, type RegisterData, type LoginData } from "@/app/lib/supabase/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

const { data, loading1, error1 } = useSupabaseClient()

 useEffect(() => {
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/session")
      const data = await res.json()

      if (res.ok) {
        setUser(data.session?.user ?? null)
        setProfile(data.userProfile ?? null)
      } else {
        console.error("Error fetching session:", data.error)
        setUser(null)
        setProfile(null)
      }
    } catch (err) {
      console.error("Exception fetching session:", err)
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  fetchSession()
}, [])


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
