"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/contexts/user-context"
import { RetroWindow } from "@/app/components/retro-window"
import { 
  Users, 
  BookOpen, 
  FileText, 
  GraduationCap,
  ShoppingCart,
  MessageCircle,
  TrendingUp,
  Calendar,
  BarChart3,
  RefreshCw
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { toast } from "sonner"

interface Analytics {
  overview: {
    totalUsers: number
    totalBooks: number
    totalSummaries: number
    totalLectures: number
    totalMessages: number
    recentActivity: {
      newUsers: number
      newBooks: number
      newSummaries: number
    }
  }
  users: {
    total: number
    students: number
    admins: number
    premium: number
    basic: number
  }
  books: {
    total: number
    pending: number
    approved: number
    rejected: number
    totalValue: number
  }
  summaries: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  lectures: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  cart: {
    totalItems: number
    totalQuantity: number
  }
  messages: {
    total: number
  }
  monthlyGrowth: Array<{
    month: string
    users: number
    books: number
    summaries: number
  }>
  generatedAt: string
}

export default function AdminAnalyticsPage() {
  const { isLoggedIn, isAdmin } = useUserContext()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      router.push('/')
      return
    }
    fetchAnalytics()
  }, [isLoggedIn, isAdmin, router])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/analytics')
      const data = await res.json()
      
      if (res.ok) {
        setAnalytics(data)
      } else {
        console.error("Error fetching analytics:", data.error)
        toast.error("خطأ في جلب الإحصائيات")
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast.error("خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn || !isAdmin()) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-retro-bg p-4">
        <div className="max-w-7xl mx-auto">
          <RetroWindow title="الإحصائيات والتحليلات">
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <div className="text-gray-600">جاري تحميل الإحصائيات...</div>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-retro-bg p-4">
        <div className="max-w-7xl mx-auto">
          <RetroWindow title="الإحصائيات والتحليلات">
            <div className="p-8 text-center">
              <div className="text-gray-600 mb-4">فشل في تحميل الإحصائيات</div>
              <Button onClick={fetchAnalytics} className="retro-button">
                إعادة المحاولة
              </Button>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-retro-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <RetroWindow title="الإحصائيات والتحليلات">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-black">الإحصائيات والتحليلات</h1>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    آخر تحديث: {new Date(analytics.generatedAt).toLocaleString('ar-SA')}
                  </span>
                  <Button 
                    onClick={fetchAnalytics}
                    size="sm"
                    className="retro-button"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    تحديث
                  </Button>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <RetroWindow title="المستخدمين">
            <div className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-800">{analytics.overview.totalUsers}</div>
              <div className="text-sm text-gray-600">إجمالي المستخدمين</div>
              <div className="text-xs text-green-600 mt-1">
                +{analytics.overview.recentActivity.newUsers} هذا الأسبوع
              </div>
            </div>
          </RetroWindow>

          <RetroWindow title="الكتب">
            <div className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-800">{analytics.overview.totalBooks}</div>
              <div className="text-sm text-gray-600">إجمالي الكتب</div>
              <div className="text-xs text-green-600 mt-1">
                +{analytics.overview.recentActivity.newBooks} هذا الأسبوع
              </div>
            </div>
          </RetroWindow>

          <RetroWindow title="الملخصات">
            <div className="p-4 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-800">{analytics.overview.totalSummaries}</div>
              <div className="text-sm text-gray-600">إجمالي الملخصات</div>
              <div className="text-xs text-green-600 mt-1">
                +{analytics.overview.recentActivity.newSummaries} هذا الأسبوع
              </div>
            </div>
          </RetroWindow>

          <RetroWindow title="المحاضرات">
            <div className="p-4 text-center">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-800">{analytics.overview.totalLectures}</div>
              <div className="text-sm text-gray-600">إجمالي المحاضرات</div>
            </div>
          </RetroWindow>

          <RetroWindow title="الرسائل">
            <div className="p-4 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold text-red-800">{analytics.overview.totalMessages}</div>
              <div className="text-sm text-gray-600">إجمالي الرسائل</div>
            </div>
          </RetroWindow>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Users Statistics */}
          <RetroWindow title="إحصائيات المستخدمين">
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    إجمالي المستخدمين
                  </span>
                  <span className="font-bold text-blue-800">{analytics.users.total}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>طلاب</span>
                  <span className="font-bold">{analytics.users.students}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span>مشرفين</span>
                  <span className="font-bold text-red-800">{analytics.users.admins}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                  <span>اشتراك مميز</span>
                  <span className="font-bold text-yellow-800">{analytics.users.premium}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>اشتراك عادي</span>
                  <span className="font-bold">{analytics.users.basic}</span>
                </div>
              </div>
            </div>
          </RetroWindow>

          {/* Books Statistics */}
          <RetroWindow title="إحصائيات الكتب">
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    إجمالي الكتب
                  </span>
                  <span className="font-bold text-green-800">{analytics.books.total}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                  <span>في الانتظار</span>
                  <span className="font-bold text-yellow-800">{analytics.books.pending}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span>مقبولة</span>
                  <span className="font-bold text-green-800">{analytics.books.approved}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span>مرفوضة</span>
                  <span className="font-bold text-red-800">{analytics.books.rejected}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span>إجمالي القيمة</span>
                  <span className="font-bold text-blue-800">{analytics.books.totalValue.toFixed(2)} دينار</span>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Summaries Statistics */}
          <RetroWindow title="إحصائيات الملخصات">
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    إجمالي الملخصات
                  </span>
                  <span className="font-bold text-purple-800">{analytics.summaries.total}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                  <span>في الانتظار</span>
                  <span className="font-bold text-yellow-800">{analytics.summaries.pending}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span>مقبولة</span>
                  <span className="font-bold text-green-800">{analytics.summaries.approved}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span>مرفوضة</span>
                  <span className="font-bold text-red-800">{analytics.summaries.rejected}</span>
                </div>
              </div>
            </div>
          </RetroWindow>

          {/* Lectures Statistics */}
          <RetroWindow title="إحصائيات المحاضرات">
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-orange-600" />
                    إجمالي المحاضرات
                  </span>
                  <span className="font-bold text-orange-800">{analytics.lectures.total}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                  <span>في الانتظار</span>
                  <span className="font-bold text-yellow-800">{analytics.lectures.pending}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span>مقبولة</span>
                  <span className="font-bold text-green-800">{analytics.lectures.approved}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span>مرفوضة</span>
                  <span className="font-bold text-red-800">{analytics.lectures.rejected}</span>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Monthly Growth Chart */}
        <RetroWindow title="النمو الشهري">
          <div className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold">البيانات لآخر 6 أشهر</span>
            </div>
            
            <div className="space-y-4">
              {analytics.monthlyGrowth.map((month, index) => (
                <div key={index} className="border border-gray-200 rounded p-3">
                  <div className="font-semibold text-lg mb-2">{month.month}</div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span>مستخدمين جدد</span>
                      <span className="font-bold text-blue-800">{month.users}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span>كتب جديدة</span>
                      <span className="font-bold text-green-800">{month.books}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <span>ملخصات جديدة</span>
                      <span className="font-bold text-purple-800">{month.summaries}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}