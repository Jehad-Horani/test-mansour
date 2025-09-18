"use client"

import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { useUserContext } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Sparkles, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  const { user, isLoggedIn, getMajorLabel } = useUserContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn || !user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--panel)" }}>
      <div className="w-full max-w-2xl">
        <RetroWindow title="مرحباً بك في تخصص">
          <div className="p-8 text-center">
            {/* Welcome Animation */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 retro-window bg-white flex items-center justify-center">
                <Sparkles className="w-12 h-12" style={{ color: "var(--primary)" }} />
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                أهلاً وسهلاً، {user.name}!
              </h1>
              <p className="text-lg text-gray-600 mb-6">مرحباً بك في منصة تخصص الأكاديمية</p>
            </div>

            {/* User Info Summary */}
            <div className="retro-window bg-white p-6 mb-6 text-right">
              <h3 className="font-semibold mb-4" style={{ color: "var(--ink)" }}>
                معلومات حسابك:
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <CheckCircle className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  <span>التخصص: {getMajorLabel(user.major)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <CheckCircle className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  <span>الجامعة: {user.university}</span>
                </div>
                <div className="flex items-center justify-between">
                  <CheckCircle className="w-5 h-5" style={{ color: "var(--accent)" }} />
                  <span>المستوى: {user.year}</span>
                </div>
              </div>
            </div>

            {/* Platform Features Preview */}
            <div className="retro-window bg-white p-6 mb-6 text-right">
              <h3 className="font-semibold mb-4" style={{ color: "var(--ink)" }}>
                ما يمكنك فعله في تخصص:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div>📚 تصفح المحاضرات والمواد الدراسية</div>
                  <div>📅 تنظيم جدولك الدراسي</div>
                  <div>🎓 متابعة الامتحانات والدرجات</div>
                </div>
                <div className="space-y-2">
                  <div>👥 التواصل مع السفراء الأكاديميين</div>
                  <div>💬 المشاركة في مجتمع الطلاب</div>
                  <div>🛒 شراء وبيع الكتب الدراسية</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="retro-button px-8 py-3"
                style={{ background: "var(--primary)", color: "white" }}
              >
                <Link href="/onboarding">
                  <ArrowLeft className="w-5 h-5 ml-2" />
                  ابدأ الجولة التعريفية
                </Link>
              </Button>

              <Button asChild variant="outline" className="retro-button bg-transparent px-8 py-3">
                <Link href="/dashboard">انتقل للوحة التحكم مباشرة</Link>
              </Button>
            </div>

            {/* Skip Option */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                يمكنك دائماً الوصول للجولة التعريفية من{" "}
                <Link href="/settings" className="hover:underline" style={{ color: "var(--primary)" }}>
                  الإعدادات
                </Link>
              </p>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
