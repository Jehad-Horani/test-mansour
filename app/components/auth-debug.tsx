"use client"

import { useEffect, useState } from "react"
import { useSupabaseClient } from "@/lib/supabase/client-wrapper"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"

export function AuthDebug() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
const { data, loading1, error1 } = useSupabaseClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      setError(null)
      const res = await fetch("/api/auth/session")
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      console.log("[v0] Auth debug - session data:", data)
      
      setUser(data.session?.user || null)
      setProfile(data.userProfile || null)
      
      if (data.error) {
        setError(data.error)
      }
      
    } catch (error: any) {
      console.error("[v0] Error checking user:", error)
      setError(error.message)
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }


  const loginTestUser = async () => {
    try {
      console.log("[v0] Attempting to login test user...")
      setLoading(true)

      const res = await fetch("/api/auth/login-test", { method: "POST" })
      const data = await res.json()

      if (!res.ok) {
        alert("خطأ في تسجيل الدخول: " + data.error)
        return
      }

      console.log("[v0] Login successful:", data)
      
      // Wait for session to be established
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Refresh user data
      await checkUser()
      
    } catch (error) {
      console.error("[v0] Login exception:", error)
      alert("حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setLoading(false)
    }
  }


  const loginAdmin = async () => {
    try {
      console.log("[v0] Attempting to login admin user...")
      setLoading(true)

      const res = await fetch("/api/auth/login-admin", { method: "POST" })
      const data = await res.json()

      if (!res.ok) {
        alert("خطأ في تسجيل الدخول: " + data.error)
        return
      }

      console.log("[v0] Admin login successful:", data)
      
      // Wait for session to be established
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Refresh user data
      await checkUser()
      
    } catch (error) {
      console.error("[v0] Admin login exception:", error)
      alert("حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setLoading(false)
    }
  }


  const logout = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/logout", { method: "POST" })
      
      if (!res.ok) {
        const data = await res.json()
        alert("خطأ أثناء تسجيل الخروج: " + data.error)
        return
      }

      setUser(null)
      setProfile(null)
      setError(null)
      
      // Refresh the page to clear all state
      window.location.href = "/"
      
    } catch (err) {
      console.error("Logout exception:", err)
      alert("حدث خطأ أثناء تسجيل الخروج")
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="p-4 border rounded">
        <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
        <div className="text-center text-sm">جاري التحقق من المصادقة...</div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>حالة المصادقة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            خطأ: {error}
          </div>
        )}
        
        {user ? (
          <div>
            <p className="text-green-600 mb-2">✓ مسجل دخول: {user.email}</p>
            {profile && (
              <div className="text-sm text-gray-600 mb-2">
                <p>الاسم: {profile.name}</p>
                <p>الدور: {profile.role}</p>
                <p>الاشتراك: {profile.subscription_tier}</p>
              </div>
            )}
            <Button onClick={logout} variant="outline" className="w-full bg-transparent">
              تسجيل خروج
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-red-600">✗ غير مسجل دخول</p>
            <Button onClick={loginTestUser} className="w-full">
              تسجيل دخول كطالب تجريبي
            </Button>
            <Button onClick={loginAdmin} variant="secondary" className="w-full">
              تسجيل دخول كمدير
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
