"use client"

import { useEffect, useState } from "react"
import { useSupabaseClient } from "@/app/lib/supabase/client-wrapper"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"

export function AuthDebug() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
const { data, loading1, error1 } = useSupabaseClient()

  useEffect(() => {
    checkUser()
  }, [])

 const checkUser = async () => {
  try {
    const res = await fetch("/api/auth/get-user")
    if (!res.ok) throw new Error("فشل جلب بيانات المستخدم")

    const data = await res.json()
    setUser(data.user)
  } catch (error) {
    console.error("[v0] Error checking user:", error)
  } finally {
    setLoading(false)
  }
}


  const loginTestUser = async () => {
  try {
    console.log("[v0] Attempting to login test user...")

    const res = await fetch("/api/auth/login-test", { method: "POST" })
    const data = await res.json()

    if (!res.ok) {
      alert("خطأ في تسجيل الدخول: " + data.error)
      return
    }

    console.log("[v0] Login successful:", data)
    setUser(data.user)
    window.location.reload()
  } catch (error) {
    console.error("[v0] Login exception:", error)
  }
}


 const loginAdmin = async () => {
  try {
    console.log("[v0] Attempting to login admin user...")

    const res = await fetch("/api/auth/login-admin", { method: "POST" })
    const data = await res.json()

    if (!res.ok) {
      alert("خطأ في تسجيل الدخول: " + data.error)
      return
    }

    console.log("[v0] Admin login successful:", data)
    setUser(data.user)
    window.location.reload()
  } catch (error) {
    console.error("[v0] Admin login exception:", error)
  }
}


  const logout = async () => {
  try {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    const data = await res.json()

    if (!res.ok) {
      alert("خطأ أثناء تسجيل الخروج: " + data.error)
      return
    }

    setUser(null)
    window.location.reload()
  } catch (err) {
    console.error("Logout exception:", err)
  }
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
