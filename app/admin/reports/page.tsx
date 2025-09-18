"use client"

import { useState } from "react"
import { RetroWindow } from "@/components/retro-window"

interface Report {
  id: string
  type: "content" | "user" | "spam" | "harassment" | "copyright" | "other"
  title: string
  description: string
  reportedBy: string
  reportedUser?: string
  reportedContent?: string
  status: "pending" | "investigating" | "resolved" | "dismissed"
  priority: "low" | "medium" | "high" | "urgent"
  createdDate: string
  resolvedDate?: string
  assignedTo?: string
  evidence?: string[]
}

export default function ReportsPage() {
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "content" | "user" | "spam" | "harassment" | "copyright" | "other"
  >("all")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "investigating" | "resolved" | "dismissed">(
    "pending",
  )
  const [showDetails, setShowDetails] = useState<string | null>(null)

  // Mock reports data
  const mockReports: Report[] = [
    {
      id: "report-1",
      type: "content",
      title: "محتوى غير مناسب في ملف القانون المدني",
      description: "يحتوي الملف على معلومات خاطئة ومضللة حول القانون المدني",
      reportedBy: "فاطمة النمر",
      reportedContent: "content-1",
      status: "pending",
      priority: "medium",
      createdDate: "2024-01-15T10:30:00Z",
      evidence: ["screenshot1.png", "reference_document.pdf"],
    },
    {
      id: "report-2",
      type: "harassment",
      title: "تحرش في التعليقات",
      description: "مستخدم يرسل رسائل مضايقة ومحتوى غير لائق",
      reportedBy: "أحمد السالم",
      reportedUser: "user-problematic-1",
      status: "investigating",
      priority: "high",
      createdDate: "2024-01-14T16:45:00Z",
      assignedTo: "مدير النظام",
      evidence: ["chat_screenshots.png"],
    },
    {
      id: "report-3",
      type: "spam",
      title: "رسائل دعائية متكررة",
      description: "مستخدم يرسل رسائل دعائية لبيع كتب خارج النظام",
      reportedBy: "نورا الشهري",
      reportedUser: "user-spammer-1",
      status: "resolved",
      priority: "low",
      createdDate: "2024-01-12T09:15:00Z",
      resolvedDate: "2024-01-13T14:20:00Z",
      assignedTo: "مدير النظام",
    },
  ]

  const filteredReports = mockReports.filter((report) => {
    const typeMatch = selectedFilter === "all" || report.type === selectedFilter
    const statusMatch = selectedStatus === "all" || report.status === selectedStatus
    return typeMatch && statusMatch
  })

  const getTypeLabel = (type: string) => {
    const labels = {
      content: "محتوى",
      user: "مستخدم",
      spam: "رسائل مزعجة",
      harassment: "تحرش",
      copyright: "حقوق طبع",
      other: "أخرى",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      investigating: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      dismissed: "bg-gray-100 text-gray-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleReportAction = (reportId: string, action: "investigate" | "resolve" | "dismiss") => {
    console.log(`[v0] Report action: ${action} for report: ${reportId}`)
  }

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <RetroWindow title="إدارة التقارير والشكاوى">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-black">التقارير والشكاوى</h2>
                <p className="text-sm text-gray-600">مراجعة وإدارة التقارير المرسلة من المستخدمين</p>
              </div>
              <div className="text-sm text-gray-600">
                إجمالي التقارير: {mockReports.length} | معلقة:{" "}
                {mockReports.filter((r) => r.status === "pending").length}
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black">نوع التقرير:</label>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="content">محتوى</option>
                  <option value="user">مستخدم</option>
                  <option value="spam">رسائل مزعجة</option>
                  <option value="harassment">تحرش</option>
                  <option value="copyright">حقوق طبع</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black">الحالة:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">معلقة</option>
                  <option value="investigating">قيد التحقيق</option>
                  <option value="resolved">محلولة</option>
                  <option value="dismissed">مرفوضة</option>
                </select>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="border border-gray-400 bg-white">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-black">{report.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(report.priority)}`}>
                            {report.priority === "low"
                              ? "منخفضة"
                              : report.priority === "medium"
                                ? "متوسطة"
                                : report.priority === "high"
                                  ? "عالية"
                                  : "عاجلة"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(report.status)}`}>
                          {report.status === "pending"
                            ? "معلقة"
                            : report.status === "investigating"
                              ? "قيد التحقيق"
                              : report.status === "resolved"
                                ? "محلولة"
                                : "مرفوضة"}
                        </span>
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                          {getTypeLabel(report.type)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <strong>المبلغ:</strong> {report.reportedBy}
                      </div>
                      <div>
                        <strong>تاريخ الإبلاغ:</strong> {new Date(report.createdDate).toLocaleDateString("ar-SA")}
                      </div>
                      {report.assignedTo && (
                        <div>
                          <strong>المسؤول:</strong> {report.assignedTo}
                        </div>
                      )}
                      {report.resolvedDate && (
                        <div>
                          <strong>تاريخ الحل:</strong> {new Date(report.resolvedDate).toLocaleDateString("ar-SA")}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowDetails(showDetails === report.id ? null : report.id)}
                        className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600"
                      >
                        {showDetails === report.id ? "إخفاء التفاصيل" : "عرض التفاصيل"}
                      </button>

                      {report.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleReportAction(report.id, "investigate")}
                            className="retro-button bg-orange-500 text-white px-3 py-1 text-sm hover:bg-orange-600"
                          >
                            بدء التحقيق
                          </button>
                          <button
                            onClick={() => handleReportAction(report.id, "dismiss")}
                            className="retro-button bg-gray-500 text-white px-3 py-1 text-sm hover:bg-gray-600"
                          >
                            رفض
                          </button>
                        </>
                      )}

                      {report.status === "investigating" && (
                        <button
                          onClick={() => handleReportAction(report.id, "resolve")}
                          className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600"
                        >
                          حل التقرير
                        </button>
                      )}
                    </div>

                    {/* Detailed View */}
                    {showDetails === report.id && (
                      <div className="mt-4 p-4 bg-gray-50 border border-gray-300">
                        <h4 className="font-semibold text-black mb-2">تفاصيل التقرير</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <strong>معرف التقرير:</strong> {report.id}
                          </div>
                          {report.reportedUser && (
                            <div>
                              <strong>المستخدم المبلغ عنه:</strong> {report.reportedUser}
                            </div>
                          )}
                          {report.reportedContent && (
                            <div>
                              <strong>المحتوى المبلغ عنه:</strong> {report.reportedContent}
                            </div>
                          )}
                          {report.evidence && (
                            <div className="col-span-2">
                              <strong>الأدلة المرفقة:</strong>
                              <div className="flex gap-2 mt-1">
                                {report.evidence.map((evidence, index) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {evidence}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {report.status === "investigating" && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-black mb-1">ملاحظات الحل:</label>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-400 bg-white text-black text-sm"
                              rows={3}
                              placeholder="اكتب ملاحظات حول كيفية حل هذا التقرير..."
                            />
                            <div className="flex gap-2 mt-2">
                              <button className="retro-button bg-green-500 text-white px-4 py-2 text-sm hover:bg-green-600">
                                حل مع الملاحظات
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-8 text-gray-600">لا توجد تقارير تطابق المعايير المحددة</div>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
