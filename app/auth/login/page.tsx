"use client"

import type React from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import Link from "next/link"
import { ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react"
import { authClient } from "@/lib/supabase/auth"
import { useUserContext } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function LoginPage() {
  const { user, loading: contextLoading, refreshUser } = useUserContext()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect if already logged in
  useEffect(() => {
    if (user && !contextLoading) {
      const redirectPath = user.role === "admin" ? "/admin" : "/dashboard"
      router.replace(redirectPath)
    }
  }, [user, contextLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور")
      return
    }

    setLoading(true)

    try {
      console.log("[v0] Starting login process...")
      
      // Sign in using the auth client
      await authClient.signIn({
        email: formData.email.trim(),
        password: formData.password,
      })

      console.log("[v0] Login successful, refreshing user context...")
      
      // Refresh the user context to get the latest auth state
      await refreshUser()
      
      console.log("[v0] Auth state refreshed")
      
      // Navigation will be handled by the useEffect above
      
    } catch (err: any) {
      console.error("Login failed:", err)
      setError(err.message || "فشل في تسجيل الدخول")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) {
      setError("")
    }
  }

  if (contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="جاري التحقق من الهوية...">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p style={{ color: "var(--ink)" }}>يرجى الانتظار...</p>
          </div>
        </RetroWindow>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--panel)" }}>
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent">
            <Link href="/">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للرئيسية
            </Link>
          </Button>
        </div>

        <RetroWindow title="تسجيل الدخول">
          <div className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  placeholder="example@domain.com"
                  className="retro-window"
                  style={{ background: "white", border: "2px inset #c0c0c0" }}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  كلمة المرور
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="retro-window pr-10"
                    style={{ background: "white", border: "2px inset #c0c0c0" }}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                    disabled={loading}
                  />
                  <span className="text-sm" style={{ color: "var(--ink)" }}>
                    تذكرني
                  </span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm hover:underline"
                  style={{ color: "var(--primary)" }}
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full retro-button"
                style={{ background: "var(--primary)", color: "white" }}
                disabled={loading}
              >
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{" "}
                <Link href="/auth/register" className="hover:underline" style={{ color: "var(--primary)" }}>
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>

            
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
