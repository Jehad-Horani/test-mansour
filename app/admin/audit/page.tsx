"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/contexts/user-context"
import { RetroWindow } from "@/app/components/retro-window"
import { useSupabaseClient } from "@/lib/supabase/client-wrapper"

interface AuditLog {
  id: string
  admin_id: string
  admin_name: string
  action: string
  target_type: "user" | "content" | "summary" | "book" | "report" | "system"
  target_id?: string
  details: string
  ip_address: string
  user_agent: string
  created_at: string
  severity: "low" | "medium" | "high" | "critical"
}

export default function AdminAuditPage() {
  const { isLoggedIn, isAdmin } = useUserContext()
  const router = useRouter()
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "user" | "content" | "summary" | "book" | "report" | "system">("all")
  const [severityFilter, setSeverityFilter] = useState<"all" | "low" | "medium" | "high" | "critical">("all")
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("today")

const { data, loading1, error1 } = useSupabaseClient()

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      router.push("/auth/login")
      return
    }
    fetchAuditLogs()
  }, [isLoggedIn, isAdmin, router, filter, severityFilter, dateRange])

  const fetchAuditLogs = async () => {
    try {
      setLoading(true)

      // Mock audit logs data - in real implementation, this would come from database
      const mockAuditLogs: AuditLog[] = [
        {
          id: "audit-1",
          admin_id: "admin-1",
          admin_name: "مدير النظام",
          action: "قبول ملخص",
          target_type: "summary",
          target_id: "summary-123",
          details: "تم قبول ملخص مادة القانون المدني للطالب أحمد محمد",
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          created_at: new Date().toISOString(),
          severity: "medium",
        },
        {
          id: "audit-2",
          admin_id: "admin-1",
          admin_name: "مدير النظام",
          action: "حذف مستخدم",
          target_type: "user",
          target_id: "user-456",
          details: "تم حذف حساب المستخدم بسبب مخالفة القوانين",
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          severity: "high",
        },
        {
          id: "audit-3",
          admin_id: "admin-1",
          admin_name: "مدير النظام",
          action: "تغيير إعدادات النظام",
          target_type: "system",
          details: "تم تفعيل وضع الصيانة",
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          created_at: new Date(Date.now() - 7200000).toISOString(),
          severity: "critical",
        },
      ]

      setAuditLogs(mockAuditLogs)
    } catch (error) {
      console.error("Error fetching audit logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-gray-100 text-gray-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "low":
        return "منخفضة"
      case "medium":
        return "متوسطة"
      case "high":
        return "عالية"
      case "critical":
        return "حرجة"
      default:
        return severity
    }
  }

  const getActionIcon = (targetType: string) => {
    switch (targetType) {
      case "user":
        return "👤"
      case "content":
        return "📝"
      case "summary":
        return "📋"
      case "book":
        return "📚"
      case "report":
        return "⚠️"
      case "system":
        return "⚙️"
      default:
        return "📊"
    }
  }

  if (!isLoggedIn || !isAdmin()) {
    return null
  }

  return (
    <div className="min-h-screen bg-retro-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <RetroWindow title="سجل تدقيق الإدارة">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-black">سجل تدقيق الإدارة</h1>
                <div className="flex gap-2">
                  <button className="retro-button bg-blue-500 text-white px-4 py-2 hover:bg-blue-600">تصدير CSV</button>
                  <button className="retro-button bg-green-500 text-white px-4 py-2 hover:bg-green-600">
                    تصدير PDF
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">نوع العملية</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm"
                  >
                    <option value="all">جميع العمليات</option>
                    <option value="user">المستخدمين</option>
                    <option value="content">المحتوى</option>
                    <option value="summary">الملخصات</option>
                    <option value="book">الكتب</option>
                    <option value="report">التقارير</option>
                    <option value="system">النظام</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">مستوى الأهمية</label>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm"
                  >
                    <option value="all">جميع المستويات</option>
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                    <option value="critical">حرجة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">الفترة الزمنية</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm"
                  >
                    <option value="today">اليوم</option>
                    <option value="week">هذا الأسبوع</option>
                    <option value="month">هذا الشهر</option>
                    <option value="all">جميع الفترات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">البحث</label>
                  <input
                    type="text"
                    placeholder="البحث في السجلات..."
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm"
                  />
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 border border-blue-200 p-3 text-center">
                  <div className="text-lg font-bold text-blue-800">{auditLogs.length}</div>
                  <div className="text-sm text-blue-600">إجمالي العمليات</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 p-3 text-center">
                  <div className="text-lg font-bold text-orange-800">
                    {auditLogs.filter((log) => log.severity === "high" || log.severity === "critical").length}
                  </div>
                  <div className="text-sm text-orange-600">عمليات مهمة</div>
                </div>
                <div className="bg-green-50 border border-green-200 p-3 text-center">
                  <div className="text-lg font-bold text-green-800">
                    {auditLogs.filter((log) => log.created_at > new Date(Date.now() - 86400000).toISOString()).length}
                  </div>
                  <div className="text-sm text-green-600">عمليات اليوم</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-3 text-center">
                  <div className="text-lg font-bold text-purple-800">
                    {new Set(auditLogs.map((log) => log.admin_id)).size}
                  </div>
                  <div className="text-sm text-purple-600">مديرين نشطين</div>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Audit Logs List */}
        <RetroWindow title="سجل العمليات">
          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">جاري التحميل...</div>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-600">لا توجد عمليات</div>
              </div>
            ) : (
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="bg-white border border-gray-400 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-2xl">{getActionIcon(log.target_type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-black">{log.action}</h3>
                            <span className={`px-2 py-1 text-xs rounded ${getSeverityColor(log.severity)}`}>
                              {getSeverityText(log.severity)}
                            </span>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                              {log.target_type === "user"
                                ? "مستخدم"
                                : log.target_type === "content"
                                  ? "محتوى"
                                  : log.target_type === "summary"
                                    ? "ملخص"
                                    : log.target_type === "book"
                                      ? "كتاب"
                                      : log.target_type === "report"
                                        ? "تقرير"
                                        : "نظام"}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-3">{log.details}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                            <div>
                              <strong>المدير:</strong> {log.admin_name}
                            </div>
                            <div>
                              <strong>التوقيت:</strong> {new Date(log.created_at).toLocaleString("ar-SA")}
                            </div>
                            <div>
                              <strong>عنوان IP:</strong> {log.ip_address}
                            </div>
                            {log.target_id && (
                              <div>
                                <strong>معرف الهدف:</strong> {log.target_id}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600">
                          التفاصيل
                        </button>
                        {log.target_id && (
                          <button className="retro-button bg-gray-500 text-white px-3 py-1 text-sm hover:bg-gray-600">
                            عرض الهدف
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-300">
              <span className="text-sm text-gray-600">
                عرض 1-{auditLogs.length} من {auditLogs.length} عملية
              </span>
              <div className="flex gap-2">
                <button className="retro-button bg-gray-500 text-white px-3 py-1 text-sm hover:bg-gray-600">
                  السابق
                </button>
                <button className="retro-button bg-retro-accent text-white px-3 py-1 text-sm">1</button>
                <button className="retro-button bg-gray-500 text-white px-3 py-1 text-sm hover:bg-gray-600">
                  التالي
                </button>
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
