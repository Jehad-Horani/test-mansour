"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { RetroWindow } from "@/app/components/retro-window"

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingContent: 0,
    totalPosts: 0,
    activeReports: 0,
    totalBooks: 0,
    monthlyRevenue: "0",
    newUsersToday: 0,
    contentApprovedToday: 0,
    pendingSummaries: 0,
  })

  useEffect(() => {
    console.log("[v0] Admin dashboard - user:", user, "loading:", loading)
    if (!loading && (!user || user.role !== "admin")) {
      console.log("[v0] Redirecting to login - not authorized")
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // This would fetch real stats from your admin API
        // For now, using mock data
        setStats({
          totalUsers: 1247,
          pendingContent: 23,
          totalPosts: 3456,
          activeReports: 8,
          totalBooks: 892,
          monthlyRevenue: "15,420",
          newUsersToday: 12,
          contentApprovedToday: 34,
          pendingSummaries: 15,
        })
      } catch (error) {
        console.error("[v0] Error fetching admin stats:", error)
      }
    }

    if (user?.role === "admin") {
      fetchStats()
    }
  }, [user])

  if (loading || !user || user.role !== "admin") {
    return null
  }

  const quickActions = [
    {
      title: "إدارة المستخدمين",
      desc: "عرض وإدارة حسابات المستخدمين",
      icon: "👥",
      href: "/admin/users",
      badge: stats.newUsersToday,
    },
    {
      title: "إدارة السوق",
      desc: "إدارة الكتب والمنتجات المعروضة",
      icon: "📚",
      href: "/admin/market",
      badge: null,
    },
    {
      title: "إدارة الملخصات",
      desc: "مراجعة وقبول/رفض الملخصات المرفوعة",
      icon: "📋",
      href: "/admin/summaries",
      badge: stats.pendingSummaries,
    },
    {
      title: "الرسائل",
      desc: "إرسال رسائل للمستخدمين",
      icon: "💬",
      href: "/admin/messages",
      badge: null,
    },
    {
      title: "الإعدادات",
      desc: "إعدادات النظام والصلاحيات",
      icon: "⚙️",
      href: "/admin/settings",
      badge: null,
    },
    {
      title: "سجل النشاط",
      desc: "مراقبة نشاط النظام والمستخدمين",
      icon: "📈",
      href: "/admin/activity",
      badge: null,
    },
  ]

  const recentActivity = [
    { type: "user", action: "مستخدم جديد انضم", user: "أحمد محمد", time: "منذ 5 دقائق" },
    { type: "content", action: "تم رفع ملف جديد", user: "فاطمة النمر", time: "منذ 12 دقيقة" },
    { type: "report", action: "تقرير جديد", user: "نورا الشهري", time: "منذ 20 دقيقة" },
    { type: "book", action: "كتاب جديد في السوق", user: "خالد الأحمد", time: "منذ 35 دقيقة" },
    { type: "content", action: "تم قبول محتوى", user: "سارة العتيبي", time: "منذ ساعة" },
  ]

  return (
    <div className="min-h-screen bg-retro-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <RetroWindow title="لوحة تحكم المدير">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-black">مرحباً،</h1>
                  <p className="text-gray-600">لوحة التحكم الرئيسية - منصة تخصصكُم</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">آخر تسجيل دخول</div>
                  <div className="text-black font-medium">{new Date().toLocaleDateString("ar-SA")}</div>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <RetroWindow title="إجمالي المستخدمين">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-retro-accent">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">مستخدم مسجل</div>
              <div className="text-xs text-green-600 mt-1">+{stats.newUsersToday} اليوم</div>
            </div>
          </RetroWindow>

          <RetroWindow title="المحتوى المعلق">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pendingContent}</div>
              <div className="text-sm text-gray-600">في انتظار المراجعة</div>
              <div className="text-xs text-blue-600 mt-1">+{stats.contentApprovedToday} تم قبولها اليوم</div>
            </div>
          </RetroWindow>

          <RetroWindow title="إجمالي المنشورات">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalPosts.toLocaleString()}</div>
              <div className="text-sm text-gray-600">منشور ومحتوى</div>
            </div>
          </RetroWindow>

          <RetroWindow title="الإيرادات الشهرية">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.monthlyRevenue} د.أ</div>
              <div className="text-sm text-gray-600">هذا الشهر</div>
            </div>
          </RetroWindow>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <RetroWindow title="الإجراءات السريعة">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      href={action.href}
                      className="retro-button bg-white hover:bg-gray-50 p-4 text-right border border-gray-400 relative"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{action.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-black">{action.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{action.desc}</p>
                        </div>
                        {action.badge && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {action.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </RetroWindow>
          </div>

          {/* Recent Activity */}
          <div>
            <RetroWindow title="النشاط الأخير">
              <div className="p-4">
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 border border-gray-200">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "user"
                            ? "bg-green-500"
                            : activity.type === "content"
                              ? "bg-blue-500"
                              : activity.type === "report"
                                ? "bg-red-500"
                                : "bg-purple-500"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="text-sm text-black">{activity.action}</div>
                        <div className="text-xs text-gray-600">{activity.user}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/admin/activity"
                  className="block text-center text-sm text-retro-accent hover:underline mt-3"
                >
                  عرض جميع الأنشطة
                </Link>
              </div>
            </RetroWindow>

            {/* System Status */}
            <div className="mt-4">
              <RetroWindow title="حالة النظام">
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black">الخادم</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1">متصل</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black">قاعدة البيانات</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1">متصل</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black">التخزين</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1">75%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black">النسخ الاحتياطي</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1">محدث</span>
                    </div>
                  </div>
                </div>
              </RetroWindow>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
