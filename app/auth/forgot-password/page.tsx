"use client"

import type React from "react"
import { useState } from "react"
import { RetroWindow } from "@/components/retro-window"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [localError, setLocalError] = useState("")

  const { resetPassword, loading, error, clearError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    clearError()

    if (!email.trim()) {
      setLocalError("يرجى إدخال البريد الإلكتروني")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError("البريد الإلكتروني غير صحيح")
      return
    }

    try {
      await resetPassword(email.trim())
      setIsSuccess(true)
    } catch (err: any) {
      setLocalError(err.message || "حدث خطأ أثناء إرسال رابط الاستعادة")
    }
  }

  const displayError = localError || error

  if (isSuccess) {
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

          <RetroWindow title="تم إرسال رابط الاستعادة">
            <div className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>
                تم إرسال الرابط بنجاح
              </h2>
              <p className="text-gray-600 mb-6">
                تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد والبريد المزعج.
              </p>
              <div className="space-y-3">
                <Button
                  asChild
                  className="retro-button w-full"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  <Link href="/auth/login">العودة لتسجيل الدخول</Link>
                </Button>
                <Button
                  variant="outline"
                  className="retro-button w-full bg-transparent"
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail("")
                  }}
                >
                  إرسال رابط آخر
                </Button>
              </div>
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

        <RetroWindow title="استعادة كلمة المرور">
          <div className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                نسيت كلمة المرور؟
              </h1>
              <p className="text-gray-600 text-sm">أدخل بريدك الإلكتروني وسنرسل لك رابط لاستعادة كلمة المرور</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (localError || error) {
                      setLocalError("")
                      clearError()
                    }
                  }}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="retro-window"
                  style={{ background: "white", border: "2px inset #c0c0c0" }}
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full retro-button"
                style={{ background: "var(--primary)", color: "white" }}
                disabled={loading}
              >
                {loading ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link href="/auth/register" className="text-sm hover:underline block" style={{ color: "var(--primary)" }}>
                ليس لديك حساب؟ إنشاء حساب جديد
              </Link>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
