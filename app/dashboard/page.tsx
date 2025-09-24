"use client"

import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { Badge } from "@/app/components/ui/badge"
import { useUserContext } from "@/contexts/user-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
  const { user, loading, isLoggedIn } = useUserContext()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    console.log("[v0] Dashboard - Auth state:", { loading, isLoggedIn, user: !!user, profile: !!profile })
    
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
  { type: "upload", title: `رفع محاضرة جديدة: ${getMajorLabelSafe(user?.major)}`, time: "منذ ساعتين" },
  { type: "exam", title: `امتحان ${getMajorLabelSafe(user?.major)} غداً`, time: "منذ 4 ساعات" },
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
                  src={user.avatar_url || "/diverse-user-avatars.png"}
                  alt="صورة المستخدم"
                  className="w-20 h-20 border-2 border-gray-300"
                  style={{ background: "var(--panel)" }}
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                    مرحباً، {user.name}
                  </h1>
                  <p className="text-gray-600 mb-2">
                    {user.university} - {getMajorLabelSafe(user?.major)}
                  </p>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge
                      className={`bg-${getTierColor(user.subscription_tier)}-100 text-${getTierColor(user.subscription_tier)}-800`}
                      style={{ background: "var(--accent)", color: "white" }}
                    >
                      الخطة الحالية: {getTierLabelSafe(user.subscription_tier)}
                    </Badge>
                    {user.subscription_tier === "free" && (
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

      {/* Quick Stats */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <RetroWindow title="إحصائياتك السريعة">
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="retro-window bg-white p-4">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--primary)" }} />
                    <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                      {profile.stats?.uploadsCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">المحاضرات المرفوعة</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="retro-window bg-white p-4">
                    <BookOpen className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--accent)" }} />
                    <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                      {profile.stats?.coursesEnrolled || 0}
                    </div>
                    <div className="text-sm text-gray-600">المقررات المتابعة</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="retro-window bg-white p-4">
                    <Calendar className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--primary)" }} />
                    <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                      {profile.stats?.booksOwned || 0}
                    </div>
                    <div className="text-sm text-gray-600">الكتب المملوكة</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="retro-window bg-white p-4">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--accent)" }} />
                    <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                      {profile.stats?.communityPoints || 0}
                    </div>
                    <div className="text-sm text-gray-600">نقاط المجتمع</div>
                  </div>
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
            {/* Daily Lectures - New Card */}
            <Link href="/dashboard/daily-lectures" className="block">
              <RetroWindow
                title="المحاضرات اليومية"
                className="hover:shadow-lg transition-shadow cursor-pointer group h-full"
              >
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    المحاضرات اليومية
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">شارك صور محاضراتك اليومية</p>
                  <div className="text-xs text-gray-500">0 محاضرة جديدة</div>
                </div>
              </RetroWindow>
            </Link>

            {/* Notebooks */}
            <Link href="/dashboard/notebooks" className="block">
              <RetroWindow title="المحاضرات" className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    إدارة المحاضرات
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">ارفع وإدارة محاضراتك</p>
                  <div className="text-xs text-gray-500">{profile.stats?.uploadsCount || 0} محاضرة مرفوعة</div>
                </div>
              </RetroWindow>
            </Link>

            {/* Schedule */}
            <Link href="/dashboard/schedule" className="block">
              <RetroWindow
                title="الجدول الدراسي"
                className="hover:shadow-lg transition-shadow cursor-pointer group h-full"
              >
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--accent)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    الجدول الدراسي
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">نظم جدولك الدراسي</p>
                  <div className="text-xs text-gray-500">{profile.stats?.coursesEnrolled || 0} مقررات مسجلة</div>
                </div>
              </RetroWindow>
            </Link>

            {/* Exams */}
            <Link href="/dashboard/exams" className="block">
              <RetroWindow title="الامتحانات" className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    الامتحانات
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">جدولة ومتابعة الامتحانات</p>
                  <div className="text-xs text-gray-500">0 امتحانات قادمة</div>
                </div>
              </RetroWindow>
            </Link>

            {/* Study Plans */}
            <Link href="/dashboard/study" className="block">
              <RetroWindow
                title="الخطط الدراسية"
                className="hover:shadow-lg transition-shadow cursor-pointer group h-full"
              >
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--accent)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    الخطط الدراسية
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">خطط دراسية ومتابعة</p>
                  <div className="text-xs text-gray-500">0 خطة نشطة</div>
                </div>
              </RetroWindow>
            </Link>

            {/* Ambassadors */}
            <Link href="/dashboard/ambassadors" className="block">
              <RetroWindow title="السفراء" className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--primary)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    السفراء
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">تواصل مع السفراء الأكاديميين</p>
                  <div className="text-xs text-gray-500">0 سفير متاح</div>
                </div>
              </RetroWindow>
            </Link>

            {/* Sessions */}
            <Link href="/dashboard/sessions" className="block">
              <RetroWindow
                title="الجلسات الدراسية"
                className="hover:shadow-lg transition-shadow cursor-pointer group h-full"
              >
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--accent)" }} />
                  <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                    الجلسات الدراسية
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">جلسات دراسية جماعية</p>
                  {user.subscription_tier === "free" && (
                    <Badge className="text-xs" style={{ background: "var(--accent)", color: "white" }}>
                      مميز
                    </Badge>
                  )}
                </div>
              </RetroWindow>
            </Link>

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
                  <div className="text-xs text-gray-500">0 إعلان جديد</div>
                </div>
              </RetroWindow>
            </Link>

            {/* Recent Activity */}
            <div className="md:col-span-2 lg:col-span-1">
              <RetroWindow title="النشاط الأخير">
                <div className="p-4 space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 bg-white retro-window">
                      <Bell className="w-4 h-4 mt-1" style={{ color: "var(--accent)" }} />
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full retro-button bg-transparent">
                    <Link href="/profile/activity">عرض جميع الأنشطة</Link>
                  </Button>
                </div>
              </RetroWindow>
            </div>
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
                  <Link href="/store">
                    <BookOpen className="w-6 h-6" />
                    <span>تصفح الكتب</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="retro-button h-auto p-4 flex flex-col items-center gap-2"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  <Link href="/community">
                    <MessageSquare className="w-6 h-6" />
                    <span>المجتمع</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="retro-button h-auto p-4 flex flex-col items-center gap-2"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  <Link href="/ambassadors">
                    <Users className="w-6 h-6" />
                    <span>احجز استشارة</span>
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
