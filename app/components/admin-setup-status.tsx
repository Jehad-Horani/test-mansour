"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export function AdminSetupStatus() {
  const [setupStatus, setSetupStatus] = useState<"checking" | "needed" | "complete">("checking")
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      const response = await fetch("/api/auth/check-setup")
      const result = await response.json()
      setSetupStatus(result.setupComplete ? "complete" : "needed")
    } catch (error) {
      console.error("Error checking setup status:", error)
      setSetupStatus("needed")
    }
  }

  const runSetup = async () => {
    setIsSettingUp(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/setup-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const result = await response.json()

      if (result.success) {
        setSetupStatus("complete")
        alert(
          `تم إعداد النظام بنجاح!\n\nحساب المدير:\n${result.admin.email}\n${result.admin.password}\n\nحساب الطالب:\n${result.student.email}\n${result.student.password}`,
        )
      } else {
        setError(result.error || "حدث خطأ في الإعداد")
      }
    } catch (error) {
      console.error("Setup error:", error)
      setError("حدث خطأ في الاتصال بالخادم")
    } finally {
      setIsSettingUp(false)
    }
  }

  if (setupStatus === "checking") {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          جاري فحص حالة النظام...
        </div>
      </div>
    )
  }

  if (setupStatus === "complete") {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <span className="text-green-700 text-sm">النظام جاهز للاستخدام</span>
      </div>
    )
  }

  return (
    <RetroWindow title="إعداد النظام مطلوب">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <span className="text-yellow-700 text-sm">يحتاج النظام إلى إعداد أولي لإنشاء حسابات المدير والاختبار</span>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        <Button
          onClick={runSetup}
          disabled={isSettingUp}
          className="w-full retro-button"
          style={{ background: "var(--primary)", color: "white" }}
        >
          {isSettingUp ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
              جاري الإعداد...
            </>
          ) : (
            "بدء إعداد النظام"
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">سيتم إنشاء حساب مدير وحساب طالب تجريبي للاختبار</p>
      </div>
    </RetroWindow>
  )
}
