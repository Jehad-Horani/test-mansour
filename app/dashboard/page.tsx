"use client"

import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { Badge } from "@/app/components/ui/badge"
import { useUserContext } from "@/contexts/user-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"

import {
  BookOpen,
  Calendar,
  FileText,
  Users,
  MessageSquare,
  ShoppingBag,
  GraduationCap,
  Settings,
  Bell,
  TrendingUp,
} from "lucide-react"

const getMajorLabelSafe = (major: string | null | undefined) => {
  switch (major) {
    case "law": return "القانون"
    case "it": return "تكنولوجيا المعلومات"
    case "medical": return "الطب"
    case "business": return "الأعمال"
    default: return "غير محدد"
  }
}

const getTierLabelSafe = (tier: string | null | undefined) => {
  switch (tier) {
    case "free": return "مجاني"
    case "standard": return "أساسي"
    case "premium": return "مميز"
    default: return "غير محدد"
  }
}
export default function DashboardPage() {
  const { profile } = useAuth()
  const { user, loading, isLoggedIn } = useUserContext()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    console.log("[v0] Dashboard - Auth state:", { loading, isLoggedIn, user: !!user, profile: !!user })

    if (!loading) {
      if (!isLoggedIn) {
        console.log("[v0] Dashboard - Not logged in, redirecting to login")
        router.push("/auth/login")
      } else {
        console.log("[v0] Dashboard - User is logged in, showing dashboard")
        setIsLoading(false)
        // Clear any existing timeout
        if (redirectTimeout) {
          clearTimeout(redirectTimeout)
          setRedirectTimeout(null)
        }
      }
    }
  }, [loading, isLoggedIn, router])

  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.log("[v0] Dashboard - Loading timeout reached")
        if (loading) {
          console.log("[v0] Still loading after timeout, redirecting to login")
          router.push("/auth/login")
        }
      }, 1000) // 10 second timeout

      setRedirectTimeout(timeout)

      return () => {
        clearTimeout(timeout)
        setRedirectTimeout(null)
      }
    }
  }, [loading, router])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--panel)" }}>
        <RetroWindow title="جاري التحميل...">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p style={{ color: "var(--ink)" }}>
              {loading ? "جاري التحقق من بيانات المستخدم..." : isLoading ? "جاري تحميل لوحة التحكم..." : "يرجى الانتظار..."}
            </p>
          </div>
        </RetroWindow>
      </div>
    )
  }


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--panel)" }}>
        <RetroWindow title="خطأ">
          <div className="p-6 text-center">
            <p style={{ color: "var(--ink)" }}>تعذر تحميل بيانات المستخدم</p>
            <Button asChild>
              <Link href="/auth/login">العودة لتسجيل الدخول</Link>
            </Button>
          </div>
        </RetroWindow>
      </div>
    )
  }


  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free":
        return "gray"
      case "standard":
        return "blue"
      case "premium":
        return "purple"
      default:
        return "gray"
    }
  }

  const recentActivity = [
    { type: "upload", title: `رفع محاضرة جديدة: ${getMajorLabelSafe(profile?.major)}`, time: "منذ ساعتين" },
    { type: "exam", title: `امتحان ${getMajorLabelSafe(profile?.major)} غداً`, time: "منذ 4 ساعات" },
    { type: "community", title: "إجابة جديدة على سؤالك", time: "منذ يوم" },
  ]



  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      {/* Welcome Header */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <RetroWindow title="مرحباً بك في لوحة التحكم">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <img
                  src={profile?.avatar_url || "/diverse-user-avatars.png"}
                  alt="صورة المستخدم"
                  className="w-20 h-20 border-2 border-gray-300"
                  style={{ background: "var(--panel)" }}
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                    مرحباً، {profile?.name}
                  </h1>
                  <p className="text-gray-600 mb-2">
                    {profile?.university} - {getMajorLabelSafe(profile?.major)}
                  </p>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge
                      className={`bg-${(profile?.subscription_tier)}-100 text-${(profile?.subscription_tier)}-800`}
                      style={{ background: "var(--accent)", color: "white" }}
                    >
                      الخطة الحالية: {getTierLabelSafe(profile?.subscription_tier)}
                    </Badge>
                    {profile?.subscription_tier === "free" && (
                      <Button
                        asChild
                        size="sm"
                        className="retro-button"
                        style={{ background: "var(--primary)", color: "white" }}
                      >
                        <Link href="/pricing">ترقية الاشتراك</Link>
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="retro-button bg-transparent">
                    <Link href="/profile">
                      <Settings className="w-4 h-4 ml-1" />
                      الملف الشخصي
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>
      </section>



      {/* Main Dashboard Grid */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">


            {/* Market */}
            <Link href="/market" className="block">
              <RetroWindow
                title="السوق الأكاديمي"
                className="hover:shadow-lg transition-shadow cursor-pointer group h-full"
              >
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    السوق الأكاديمي
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">بيع وشراء المستلزمات</p>
                </div>
              </RetroWindow>


            </Link>

            {/* Daily Lectures - New Card */}
            <Link href="/dashboard/notebooks" className="block">
              <RetroWindow
                title="المحاضرات"
                className="hover:shadow-lg transition-shadow cursor-pointer group h-full"
              >
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    المحاضرات
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">شارك صور محاضراتك اليومية</p>
                </div>
              </RetroWindow>
            </Link>

            {/* summaries - New Card */}
            <Link href="/summaries" className="block">
              <RetroWindow
                title="الملخصات"
                className="hover:shadow-lg transition-shadow cursor-pointer group h-full"
              >
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    الملخصات
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">شارك ملخصات موادك الجامعية هنا</p>
                </div>
              </RetroWindow>
            </Link>

            {/* Schedule */}
              <Link
              href={profile?.subscription_tier === "premium" ? `/dashboard/schedule` : "#"}
              className={`group h-full ${profile?.subscription_tier !== "premium" ? "pointer-events-none cursor-not-allowed opacity-70" : ""}`}
            >
              <RetroWindow title="الامتحانات" className="hover:shadow-lg transition-shadow cursor-pointer h-full">
<h5 className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-md border border-amber-300">
  مميز
</h5>
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--accent)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    الجدول الدراسي
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">نظم جدولك الدراسي</p>
                </div>
              </RetroWindow>
            </Link>

            {/* Exams */}
            <Link
              href={profile?.subscription_tier === "premium" ? `/dashboard/exams` : "#"}
              className={`group h-full ${profile?.subscription_tier !== "premium" ? "pointer-events-none cursor-not-allowed opacity-70" : ""}`}
            >
              <RetroWindow title="الامتحانات" className="hover:shadow-lg transition-shadow cursor-pointer h-full">
<h5 className="inline-block px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-md border border-amber-300">
  مميز
</h5>
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    الامتحانات
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">جدولة ومتابعة الامتحانات</p>
                </div>
              </RetroWindow>
            </Link>


            {/* Ambassadors */}
            <Link href="/ambassadors" className="block">
              <RetroWindow title="السفراء" className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    السفراء
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">تواصل مع السفراء الأكاديميين</p>
                </div>
              </RetroWindow>
            </Link>



          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-4 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <RetroWindow title="إجراءات سريعة">
            <div className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Button
                  asChild
                  className="retro-button h-auto p-4 flex flex-col items-center gap-2"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  <Link href="/market">
                    <BookOpen className="w-6 h-6" />
                    <span>تصفح الكتب</span>
                  </Link>
                </Button>



                <Button
                  asChild
                  className="retro-button h-auto p-4 flex flex-col items-center gap-2"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  <Link href="/ambassadors">
                    <Users className="w-6 h-6" />
                    <span>السفراء</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="retro-button h-auto p-4 flex flex-col items-center gap-2"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  <Link href="/settings">
                    <Settings className="w-6 h-6" />
                    <span>الإعدادات</span>
                  </Link>
                </Button>
              </div>
            </div>
          </RetroWindow>
        </div>
      </section>
    </div>
  )
}
