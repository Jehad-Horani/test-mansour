"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import Link from "next/link"
import { ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState("")
  const [tokenValid, setTokenValid] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const access_token = searchParams.get("access_token")
        const refresh_token = searchParams.get("refresh_token")
        const type = searchParams.get("type")
        
        // Check if this is a password recovery callback
        if (type !== "recovery" && !access_token) {
          throw new Error("رابط غير صالح أو منتهي الصلاحية")
        }

        if (!access_token) {
          throw new Error("رابط غير صالح أو منتهي الصلاحية")
        }

        // Verify the token with the API
        const res = await fetch("/api/auth/verify-reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            access_token,
            refresh_token 
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "رابط غير صالح أو منتهي الصلاحية")
        }

        // Token is valid
        setTokenValid(true)
        setIsVerifying(false)
      } catch (err: any) {
        setError(err.message || "حدث خطأ في التحقق من الرابط")
        setTokenValid(false)
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [searchParams])

  const validatePassword = () => {
    if (!password) {
      setError("كلمة المرور مطلوبة")
      return false
    }

    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      return false
    }

    if (!/[A-Z]/.test(password)) {
      setError("كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
      return false
    }

    if (!/[a-z]/.test(password)) {
      setError("كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل")
      return false
    }

    if (!/[0-9]/.test(password)) {
      setError("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل")
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

    if (!validatePassword()) {
      return
    }

    setIsLoading(true)

    try {
      const access_token = searchParams.get("access_token")
      const refresh_token = searchParams.get("refresh_token")

      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          password,
          access_token,
          refresh_token
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setIsSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      } else {
        setError(data.error || "حدث خطأ أثناء تحديث كلمة المرور")
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحديث كلمة المرور")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while verifying token
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--panel)" }}>
        <div className="w-full max-w-md">
          <RetroWindow title="جاري التحقق...">
            <div className="p-6 text-center">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">جاري التحقق من الرابط...</p>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  // Show success state
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
              <p className="text-gray-600 mb-6">
                يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                جاري التحويل إلى صفحة تسجيل الدخول...
              </p>
              <Button asChild className="retro-button w-full" style={{ background: "var(--primary)", color: "white" }}>
                <Link href="/auth/login">تسجيل الدخول الآن</Link>
              </Button>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  // Show error state if verification failed
  if (!tokenValid && error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--panel)" }}>
        <div className="w-full max-w-md">
          <RetroWindow title="خطأ">
            <div className="p-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>
                رابط غير صالح
              </h2>
              <p className="text-gray-600 mb-2">{error}</p>
              <p className="text-sm text-gray-500 mb-6">
                قد يكون الرابط منتهي الصلاحية أو تم استخدامه من قبل.
              </p>
              <div className="space-y-3">
                <Button asChild className="retro-button w-full" style={{ background: "var(--primary)", color: "white" }}>
                  <Link href="/auth/forgot-password">طلب رابط جديد</Link>
                </Button>
                <Button asChild variant="outline" className="retro-button w-full bg-transparent">
                  <Link href="/auth/login">العودة لتسجيل الدخول</Link>
                </Button>
              </div>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  // Show reset password form
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
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  8 أحرف على الأقل، حرف كبير وصغير ورقم
                </p>
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
                    tabIndex={-1}
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