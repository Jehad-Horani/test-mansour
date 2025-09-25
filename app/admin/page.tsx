"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import Link from "next/link"
import { 
  BookOpen, 
  Users, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  BarChart3,
  Settings,
  AlertTriangle
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { marketplaceApi } from "@/lib/supabase/marketplace"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const { user, isLoggedIn, isAdmin , profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [bookStats, setBookStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [userStats, setUserStats] = useState({
    total: 0,
    admins: 0,
    students: 0
  })
  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    

    if (profile?.role != "admin") {
      toast.error("غير مصرح لك بالوصول لهذه الصفحة")
      router.push('/dashboard')
      return
    }

  }, [])



  if (!profile) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="لوحة تحكم الإدارة">
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">يجب تسجيل الدخول أولاً</p>
            <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
              <Link href="/auth">تسجيل الدخول</Link>
            </Button>
          </div>
        </RetroWindow>
      </div>
    )
  }

  if (profile?.role != "admin") {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="غير مصرح">
          <div className="p-6 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-gray-600 mb-4">غير مصرح لك بالوصول لهذه الصفحة</p>
            <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
              <Link href="/dashboard">العودة للرئيسية</Link>
            </Button>
          </div>
        </RetroWindow>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="لوحة تحكم الإدارة">
          <div className="p-6 text-center">
            <p className="text-gray-600">جاري تحميل البيانات...</p>
          </div>
        </RetroWindow>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--ink)" }}>
            لوحة تحكم الإدارة
          </h1>
          <p className="text-gray-600">إدارة النظام والمحتوى</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Book Stats */}
          <RetroWindow title="إحصائيات الكتب">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">إجمالي الكتب</span>
                <span className="font-bold text-lg">{bookStats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-600">في الانتظار</span>
                <span className="font-bold text-lg text-yellow-600">{bookStats.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">مقبولة</span>
                <span className="font-bold text-lg text-green-600">{bookStats.approved}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-600">مرفوضة</span>
                <span className="font-bold text-lg text-red-600">{bookStats.rejected}</span>
              </div>
            </div>
          </RetroWindow>

          {/* User Stats */}
          <RetroWindow title="إحصائيات المستخدمين">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">إجمالي المستخدمين</span>
                <span className="font-bold text-lg">{userStats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600">المديرون</span>
                <span className="font-bold text-lg text-blue-600">{userStats.admins}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">الطلاب</span>
                <span className="font-bold text-lg text-green-600">{userStats.students}</span>
              </div>
            </div>
          </RetroWindow>

          {/* Quick Actions */}
          <RetroWindow title="إجراءات سريعة">
            <div className="p-4 space-y-2">
              <Button 
                asChild 
                className="retro-button w-full" 
                style={{ background: "var(--accent)", color: "white" }}
              >
                <Link href="/admin/books">
                  <Clock className="w-4 h-4 ml-2" />
                  مراجعة الكتب ({bookStats.pending})
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="retro-button w-full bg-transparent"
              >
                <Link href="/admin/users">
                  <Users className="w-4 h-4 ml-2" />
                  إدارة المستخدمين
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="retro-button w-full bg-transparent"
              >
                <Link href="/admin/reports">
                  <BarChart3 className="w-4 h-4 ml-2" />
                  التقارير
                </Link>
              </Button>
            </div>
          </RetroWindow>

          {/* System Status */}
          <RetroWindow title="حالة النظام">
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">قاعدة البيانات</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">التخزين السحابي</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">نظام المراسلة</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">الإشعارات</span>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Button
            asChild
            className="retro-button h-24 flex flex-col items-center justify-center gap-2"
            style={{ background: "var(--primary)", color: "white" }}
          >
            <Link href="/admin/books">
              <BookOpen className="w-8 h-8" />
              <span className="font-semibold">إدارة الكتب</span>
              <span className="text-sm opacity-80">مراجعة وقبول الكتب</span>
            </Link>
          </Button>

          <Button
            asChild
            className="retro-button h-24 flex flex-col items-center justify-center gap-2"
            style={{ background: "var(--accent)", color: "white" }}
          >
            <Link href="/admin/users">
              <Users className="w-8 h-8" />
              <span className="font-semibold">إدارة المستخدمين</span>
              <span className="text-sm opacity-80">عرض وإدارة الحسابات</span>
            </Link>
          </Button>

          <Button
            asChild
            className="retro-button h-24 flex flex-col items-center justify-center gap-2"
            style={{ background: "var(--primary)", color: "white" }}
          >
            <Link href="/admin/activities">
              <Activity className="w-8 h-8" />
              <span className="font-semibold">سجل النشاطات</span>
              <span className="text-sm opacity-80">مراقبة أنشطة النظام</span>
            </Link>
          </Button>

          <Button
            asChild
            className="retro-button h-24 flex flex-col items-center justify-center gap-2"
            style={{ background: "var(--accent)", color: "white" }}
          >
            <Link href="/admin/reports">
              <BarChart3 className="w-8 h-8" />
              <span className="font-semibold">التقارير</span>
              <span className="text-sm opacity-80">إحصائيات مفصلة</span>
            </Link>
          </Button>

          <Button
            asChild
            className="retro-button h-24 flex flex-col items-center justify-center gap-2"
            style={{ background: "var(--primary)", color: "white" }}
          >
            <Link href="/admin/settings">
              <Settings className="w-8 h-8" />
              <span className="font-semibold">إعدادات النظام</span>
              <span className="text-sm opacity-80">تكوين النظام</span>
            </Link>
          </Button>
        </div>

        {/* Recent Activities */}
        <RetroWindow title="النشاطات الأخيرة">
          <div className="p-6">
            {recentActivities.length === 0 ? (
              <p className="text-center text-gray-600 py-8">لا توجد أنشطة حديثة</p>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity: any) => (
                  <div key={activity.id} className="retro-window bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {activity.action === 'approve_book' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {activity.action === 'reject_book' && <XCircle className="w-5 h-5 text-red-500" />}
                        <div>
                          <p className="font-medium">
                            {activity.admin?.name} {" "}
                            {activity.action === 'approve_book' && 'قبل كتاب'}
                            {activity.action === 'reject_book' && 'رفض كتاب'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.details?.book_title}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
