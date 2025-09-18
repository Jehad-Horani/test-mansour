"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/app/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthDebug() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      console.log("[v0] Current user:", user)
      setUser(user)
    } catch (error) {
      console.error("[v0] Error checking user:", error)
    } finally {
      setLoading(false)
    }
  }

  const loginTestUser = async () => {
    try {
      console.log("[v0] Attempting to login test user...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "student@takhassus.com",
        password: "password123",
      })

      if (error) {
        console.error("[v0] Login error:", error)
        alert("خطأ في تسجيل الدخول: " + error.message)
      } else {
        console.log("[v0] Login successful:", data)
        setUser(data.user)
        window.location.reload()
      }
    } catch (error) {
      console.error("[v0] Login exception:", error)
    }
  }

  const loginAdmin = async () => {
    try {
      console.log("[v0] Attempting to login admin user...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "admin@takhassus.com",
        password: "admin123",
      })

      if (error) {
        console.error("[v0] Admin login error:", error)
        alert("خطأ في تسجيل الدخول: " + error.message)
      } else {
        console.log("[v0] Admin login successful:", data)
        setUser(data.user)
        window.location.reload()
      }
    } catch (error) {
      console.error("[v0] Admin login exception:", error)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  if (loading) {
    return <div>جاري التحقق من المصادقة...</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>حالة المصادقة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user ? (
          <div>
            <p className="text-green-600">✓ مسجل دخول: {user.email}</p>
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
