"use client"

import type React from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import Link from "next/link"
import { ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const { signIn, loading, error, clearError, profile } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    clearError()

    if (!formData.email.trim() || !formData.password.trim()) {
      setLocalError("يرجى إدخال البريد الإلكتروني وكلمة المرور")
      return
    }

    try {
      await signIn({
        email: formData.email.trim(),
        password: formData.password,
      })

      // Wait for the auth hook to update, then redirect
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Fetch fresh session data to get the profile
      const sessionRes = await fetch("/api/auth/session")
      const sessionData = await sessionRes.json()
      
      if (sessionData.userProfile?.role === "admin") {
        router.replace("/admin")
      } else {
        router.replace("/dashboard")
      }
    } catch (err: any) {
      console.error("Login failed:", err)
      setLocalError(err.message || "فشل في تسجيل الدخول")
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (localError || error) {
      setLocalError("")
      clearError()
    }
  }

  const displayError = localError || error

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="جاري تسجيل الدخول...">
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
              {displayError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 text-sm">{displayError}</span>
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

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4 text-center">للاختبار فقط:</p>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="retro-button bg-transparent text-xs w-full"
                  onClick={() => {
                    setFormData({ email: "student@takhassus.com", password: "password123", rememberMe: false })
                  }}
                  disabled={loading}
                >
                  حساب طالب تجريبي
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="retro-button bg-transparent text-xs w-full"
                  onClick={() => {
                    setFormData({ email: "admin@takhassus.com", password: "admin123", rememberMe: false })
                  }}
                  disabled={loading}
                >
                  حساب إدارة تجريبي
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="retro-button bg-green-100 text-xs w-full"
                  onClick={async () => {
                    try {
                      setLocalError("")
                      const response = await fetch("/api/auth/setup-admin", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                      })
                      const result = await response.json()
                      if (result.success) {
                        alert(
                          `تم إنشاء الحسابات بنجاح!\n\nحساب المدير:\nالبريد: ${result.admin.email}\nكلمة المرور: ${result.admin.password}\n\nحساب الطالب:\nالبريد: ${result.student.email}\nكلمة المرور: ${result.student.password}`,
                        )
                        // تعبئة حقول تسجيل الدخول بحساب المدير
                        setFormData({
                          email: result.admin.email,
                          password: result.admin.password,
                          rememberMe: false,
                        })
                      } else {
                        setLocalError("خطأ في إنشاء الحسابات: " + result.error)
                      }
                    } catch (error) {
                      console.error("Setup error:", error)
                      setLocalError("حدث خطأ في إعداد النظام")
                    }
                  }}
                  disabled={loading}
                >
                  إعداد النظام (إنشاء الحسابات)
                </Button>
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
