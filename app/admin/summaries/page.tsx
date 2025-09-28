"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/contexts/user-context"
import { RetroWindow } from "@/app/components/retro-window"

interface Summary {
  id: string
  title: string
  subject_name: string
  university_name: string
  semester: string
  college: string
  major: string
  file_url: string
  file_name: string
  file_size: number
  is_approved: boolean | null
  created_at: string
  user_id: string
  user_name: string
  rejection_reason?: string
}

export default function AdminSummariesPage() {
  const { isLoggedIn, isAdmin } = useUserContext()
  const router = useRouter()
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionModal, setShowRejectionModal] = useState(false)

  useEffect(() => {
    fetchSummaries()
  }, [isLoggedIn, isAdmin, router, filter])

  const fetchSummaries = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/summaries")
      if (!res.ok) throw new Error("فشل في جلب الملخصات")
      const data: Summary[] = await res.json()

      // تحويل is_approved -> status
      const mapped = data.map((s) => ({
        ...s,
        status: s.is_approved === null ? "pending" : s.is_approved ? "approved" : "pending"
      }))

      let filtered = mapped
      if (filter !== "all") {
        filtered = mapped.filter((s) => s.status === filter)
      }

      setSummaries(filtered || [])
    } catch (err) {
      console.error(err)
      setSummaries([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (summaryId: string) => {
    try {
      await fetch("/api/summaries/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summaryId }),
      })
      fetchSummaries()
    } catch (error) {
      console.error("Error approving summary:", error)
    }
  }

  const handleReject = async () => {
    if (!selectedSummary || !rejectionReason.trim()) return

    try {
      await fetch("/api/summaries/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summaryId: selectedSummary.id,
          rejectionReason,
        }),
      })

      setShowRejectionModal(false)
      setSelectedSummary(null)
      setRejectionReason("")
      fetchSummaries()
    } catch (error) {
      console.error("Error rejecting summary:", error)
    }
  }

  const handleDelete = async (summaryId: string) => {
    if (!confirm("هل تريد حذف الملخص نهائيًا؟")) return
    try {
      const res = await fetch("/api/summaries/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summaryId }),
      })
      if (!res.ok) throw new Error("فشل في حذف الملخص")
      fetchSummaries()
    } catch (err) {
      console.error(err)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "approved": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "في الانتظار"
      case "approved": return "مقبول"
      case "rejected": return "مرفوض"
      default: return status
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
          <RetroWindow title="إدارة الملخصات">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-black">إدارة الملخصات</h1>
                <div className="flex gap-2">
                  {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1 text-sm border border-gray-400 ${
                        filter === status ? "bg-retro-accent text-white" : "bg-white text-black hover:bg-gray-50"
                      }`}
                    >
                      {status === "all" ? "الكل"
                        : status === "pending" ? "في الانتظار"
                        : status === "approved" ? "مقبول"
                        : "مرفوض"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-yellow-50 border border-yellow-200 p-3 text-center">
                  <div className="text-lg font-bold text-yellow-800">
                    {summaries.filter((s: any) => s.status === "pending").length}
                  </div>
                  <div className="text-sm text-yellow-600">في الانتظار</div>
                </div>
                <div className="bg-green-50 border border-green-200 p-3 text-center">
                  <div className="text-lg font-bold text-green-800">
                    {summaries.filter((s: any) => s.status === "approved").length}
                  </div>
                  <div className="text-sm text-green-600">مقبول</div>
                </div>
                <div className="bg-red-50 border border-red-200 p-3 text-center">
                  <div className="text-lg font-bold text-red-800">
                    {summaries.filter((s: any) => s.status === "rejected").length}
                  </div>
                  <div className="text-sm text-red-600">مرفوض</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 text-center">
                  <div className="text-lg font-bold text-blue-800">{summaries.length}</div>
                  <div className="text-sm text-blue-600">إجمالي</div>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Summaries List */}
        <RetroWindow title="قائمة الملخصات">
          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">جاري التحميل...</div>
              </div>
            ) : summaries.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-600">لا توجد ملخصات</div>
              </div>
            ) : (
              <div className="space-y-4">
                {summaries.map((summary: any) => (
                  <div key={summary.id} className="bg-white border border-gray-400 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-black">{summary.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${getStatusColor(summary.status)}`}>
                            {getStatusText(summary.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div><strong>المادة:</strong> {summary.subject_name}</div>
                          <div><strong>الجامعة:</strong> {summary.university_name}</div>
                          <div><strong>الفصل:</strong> {summary.semester}</div>
                          <div><strong>الكلية:</strong> {summary.college}</div>
                          <div><strong>التخصص:</strong> {summary.major}</div>
                          <div><strong>المرفوع بواسطة:</strong> {summary.user_name}</div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>📎 {summary.file_name}</span>
                          <span>📊 {formatFileSize(summary.file_size)}</span>
                          <span>📅 {new Date(summary.created_at).toLocaleDateString("ar-SA")}</span>
                        </div>

                        {summary.rejection_reason && (
                          <div className="bg-red-50 border border-red-200 p-2 text-sm text-red-800 mb-3">
                            <strong>سبب الرفض:</strong> {summary.rejection_reason}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 mr-4">
                        <a
                          href={summary.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600"
                        >
                          عرض الملف
                        </a>
                        <button
                          onClick={() => handleDelete(summary.id)}
                          className="retro-button bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600"
                        >
                          حذف الملف
                        </button>

                        {summary.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(summary.id)}
                              className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600"
                            >
                              قبول
                            </button>
                            <button
                              onClick={() => {
                                setSelectedSummary(summary)
                                setShowRejectionModal(true)
                              }}
                              className="retro-button bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600"
                            >
                              رفض
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RetroWindow>

        {/* Rejection Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border-4 border-black p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-black mb-4">رفض الملخص</h3>
              <p className="text-gray-600 mb-4">يرجى إدخال سبب رفض هذا الملخص:</p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="اكتب سبب الرفض هنا..."
                className="w-full p-3 border border-gray-400 mb-4 h-24 resize-none"
                dir="rtl"
              />

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowRejectionModal(false)
                    setSelectedSummary(null)
                    setRejectionReason("")
                  }}
                  className="retro-button bg-gray-500 text-white px-4 py-2 hover:bg-gray-600"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="retro-button bg-red-500 text-white px-4 py-2 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  رفض الملخص
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
