"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { RetroWindow } from "@/components/retro-window"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    // Handle the auth callback
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setError("رابط استعادة كلمة المرور غير صحيح أو منتهي الصلاحية")
      }
    }

    handleAuthCallback()
  }, [supabase.auth])

  const validateForm = () => {
    if (!password) {
      setError("كلمة المرور مطلوبة")
      return false
    }

    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      return false
    }

    if (password !== confirmPassword) {
      setError("كلمة المرور غير متطابقة")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحديث كلمة المرور")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--panel)" }}>
        <div className="w-full max-w-md">
          <RetroWindow title="تم تحديث كلمة المرور">
            <div className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>
                تم تحديث كلمة المرور بنجاح
              </h2>
              <p className="text-gray-600 mb-6">يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.</p>
              <Button asChild className="retro-button w-full" style={{ background: "var(--primary)", color: "white" }}>
                <Link href="/auth/login">تسجيل الدخول</Link>
              </Button>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--panel)" }}>
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent">
            <Link href="/auth/login">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة لتسجيل الدخول
            </Link>
          </Button>
        </div>

        <RetroWindow title="تحديث كلمة المرور">
          <div className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                كلمة مرور جديدة
              </h1>
              <p className="text-gray-600 text-sm">أدخل كلمة المرور الجديدة لحسابك</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                    placeholder="••••••••"
                    className="retro-window pr-10"
                    style={{ background: "white", border: "2px inset #c0c0c0" }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError("")
                    }}
                    placeholder="••••••••"
                    className="retro-window pr-10"
                    style={{ background: "white", border: "2px inset #c0c0c0" }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full retro-button"
                style={{ background: "var(--primary)", color: "white" }}
                disabled={isLoading}
              >
                {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
              </Button>
            </form>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
