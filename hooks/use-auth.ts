"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { authClient, type Profile, type RegisterData, type LoginData } from "@/lib/supabase/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch session from API
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/session")
      const data = await res.json()
      if (res.ok) {
        setUser(data.session?.user ?? null)
        setProfile(data.userProfile ?? null)
      } else {
        setUser(null)
        setProfile(null)
      }
    } catch (err) {
      console.error(err)
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [])

  // Sign Up
 const signUp = async (data: RegisterData) => {
  setLoading(true)
  setError(null)

  try {
    await authClient.signUp(data) // throw إذا في error
    await fetchSession() // جلب الـ session بعد التسجيل
  } catch (err: any) {
    setError(err.message || "حدث خطأ أثناء إنشاء الحساب")
    throw err
  } finally {
    setLoading(false)
  }
}


  // Sign In
 const signIn = async (data: LoginData) => {
  setLoading(true)
  setError(null)

  try {
    await authClient.signIn(data) // throw إذا في error
    await fetchSession() // جلب الـ session بعد تسجيل الدخول
  } catch (err: any) {
    setError(err.message || "حدث خطأ في تسجيل الدخول")
    throw err
  } finally {
    setLoading(false)
  }
}


  // Sign Out
  const signOut = async () => {
    setLoading(true)
    setError(null)
    try {
      await authClient.signOut()
      setUser(null)
      setProfile(null)
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الخروج")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    setError(null)
    try {
      await authClient.resetPassword(email)
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إرسال رابط استعادة كلمة المرور")
      throw err
    }
  }

  // Update profile
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

  const getMajorLabel = (major?: "law" | "it" | "medical" | "business" | "") => {
    const labels: Record<string, string> = {
      law: "القانون",
      it: "تقنية المعلومات",
      medical: "الطب",
      business: "إدارة الأعمال",
      "": "غير محدد",
    }
    return labels[major || ""] ?? "غير محدد"
  }

  const getTierLabel = (tier?: "free" | "standard" | "premium" | "") => {
    const labels: Record<string, string> = {
      free: "مجاني",
      standard: "قياسي",
      premium: "مميز",
      "": "غير محدد",
    }
    return labels[tier || ""] ?? "غير محدد"
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
    getMajorLabel,
    getTierLabel,
    clearError: () => setError(null),
  }
}
