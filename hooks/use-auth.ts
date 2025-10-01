"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { authClient, type Profile, type RegisterData, type LoginData } from "@/lib/supabase/auth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"


export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Fetch session + profile
  const fetchSession = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/session")

      if (!res.ok) {
        console.error("Session fetch failed:", res.status, res.statusText)
        setUser(null)
        setProfile(null)
        return
      }

      const data = await res.json()

      console.log("[v0] Session data received:", {
        hasSession: !!data.session,
        hasUser: !!data.session?.user,
        hasProfile: !!data.userProfile,
        error: data.error
      })

      const currentUser = data.session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        // جلب البروفايل من جدول profiles
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single()

        if (profileError) {
          console.error("Profile fetch error:", profileError)
          setProfile({
            id: currentUser.id,
            role: currentUser.user_metadata?.role ?? currentUser.email ?? "",
            email: currentUser.email ?? "",
            password: "",
            name: currentUser.user_metadata?.name ?? currentUser.email ?? "",
            year: currentUser.user_metadata?.year ?? currentUser.email ?? "",
            university: currentUser.user_metadata?.university ?? currentUser.email ?? "",
            major: currentUser.user_metadata?.major ?? currentUser.email ?? "",
            subscription_tier: currentUser.user_metadata?.subscription_tier ?? "",
            avatar_url: currentUser.user_metadata?.avatar_url ?? currentUser.email ?? "",
            bio: currentUser.user_metadata?.bio ?? currentUser.email ?? "",
          })
        } else {
          setProfile(userProfile)
        }
      } else {
        setProfile(null)
      }

    } catch (err) {
      console.error("Session fetch error:", err)
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
  const signUp = async (data: Profile & { password: string }) => {
    setLoading(true);
    setError(null);

    try {
      console.log("[v0] Starting signUp process...");

      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: data.role,
            name: data.name,
            year: data.year,
            university: data.university,
            major: data.major,
            subscription_tier: data.subscription_tier,
            avatar_url: data.avatar_url,
            bio: data.bio,
          },
        },
      });

      if (error) {
        throw error;
      }

      console.log("[v0] SignUp completed, waiting for session...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await fetchSession();

      console.log("[v0] SignUp process completed");
      return { user: signUpData.user };

    } catch (err: any) {
      console.error("[v0] SignUp error:", err);
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب");
      throw err;
    } finally {
      setLoading(false);
    }
  };





  // Sign In
  const signIn = async (data: LoginData) => {
    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Starting signIn process...")
      const result = await authClient.signIn(data)

      console.log("[v0] SignIn completed, fetching session...")

      await new Promise(resolve => setTimeout(resolve, 1000))

      await fetchSession()

      console.log("[v0] SignIn process completed")
      return result

    } catch (err: any) {
      console.error("[v0] SignIn error:", err)
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
      console.log("[v0] Starting signOut process...")
      await authClient.signOut()
      setUser(null)
      setProfile(null)
      console.log("[v0] SignOut completed")
      router.push("/")
    } catch (err: any) {
      console.error("[v0] SignOut error:", err)
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

  // Helper functions
  const isAdmin = () => profile?.role === "admin"
  const ispremium = () => profile?.subscription_tier === "premium"

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
    ispremium,
  }
}
