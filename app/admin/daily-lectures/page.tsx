"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { RetroWindow } from "@/app/components/retro-window"
import { useSupabaseClient } from "@/lib/supabase/client-wrapper"

interface DailyLecture {
  id: string
  title: string
  course_name: string
  course_code: string
  professor_name: string
  lecture_date: string
  lecture_time: string
  description: string
  image_urls: string[]
  image_names: string[]
  image_sizes: number[]
  status: "pending" | "approved" | "rejected"
  rejection_reason?: string
  uploaded_by: string
  upload_date: string
  approved_by?: string
  approved_at?: string
  views_count: number
  likes_count: number
  comments_count: number
  is_featured: boolean
  tags: string[]
  uploader_name?: string
}

export default function AdminDailyLecturesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [lectures, setLectures] = useState<DailyLecture[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [selectedLecture, setSelectedLecture] = useState<DailyLecture | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState<string | null>(null)

  const { data, loading1, error1 } = useSupabaseClient()


  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login")
      return
    }
    if (user?.role === "admin") {
      fetchLectures()
    }
  }, [user, loading, router, filter])

 const fetchLectures = async () => {
  try {
    setLoadingData(true)
    const res = await fetch("/api/lectures")
    const data = await res.json()

    let filtered = data
    if (filter !== "all") {
      filtered = data.filter((lecture: any) => lecture.status === filter)
    }

    const formattedLectures = filtered.map((lecture: any) => ({
      ...lecture,
      uploader_name: lecture.profiles?.name || "مستخدم غير معروف",
    }))

    setLectures(formattedLectures)
  } catch (error) {
    console.error("Error fetching lectures:", error)
  } finally {
    setLoadingData(false)
  }
}


const handleApprove = async (lectureId: string) => {
  try {
    await fetch("/api/lectures/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lectureId, userId: user?.id }),
    })

    fetchLectures()
  } catch (error) {
    console.error("Error approving lecture:", error)
  }
}


  const handleReject = async () => {
  if (!selectedLecture || !rejectionReason.trim()) return

  try {
    await fetch("/api/lectures/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lectureId: selectedLecture.id,
        rejectionReason,
        userId: user?.id,
      }),
    })

    setShowRejectionModal(false)
    setSelectedLecture(null)
    setRejectionReason("")
    fetchLectures()
  } catch (error) {
    console.error("Error rejecting lecture:", error)
  }
}


  const handleToggleFeatured = async (lectureId: string, currentFeatured: boolean) => {
  try {
    await fetch("/api/lectures/toggle-featured", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lectureId, isFeatured: !currentFeatured }),
    })

    fetchLectures()
  } catch (error) {
    console.error("Error toggling featured:", error)
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
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "في الانتظار"
      case "approved":
        return "مقبول"
      case "rejected":
        return "مرفوض"
      default:
        return status
    }
  }

  if (loading || !user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-retro-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <RetroWindow title="إدارة المحاضرات اليومية">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-black">إدارة المحاضرات اليومية</h1>
                <div className="flex gap-2">
                  {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1 text-sm border border-gray-400 ${filter === status ? "bg-retro-accent text-white" : "bg-white text-black hover:bg-gray-50"
                        }`}
                    >
                      {status === "all"
                        ? "الكل"
                        : status === "pending"
                          ? "في الانتظار"
                          : status === "approved"
                            ? "مقبول"
                            : "مرفوض"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-yellow-50 border border-yellow-200 p-3 text-center">
                  <div className="text-lg font-bold text-yellow-800">
                    {lectures.filter((l) => l.status === "pending").length}
                  </div>
                  <div className="text-sm text-yellow-600">في الانتظار</div>
                </div>
                <div className="bg-green-50 border border-green-200 p-3 text-center">
                  <div className="text-lg font-bold text-green-800">
                    {lectures.filter((l) => l.status === "approved").length}
                  </div>
                  <div className="text-sm text-green-600">مقبول</div>
                </div>
                <div className="bg-red-50 border border-red-200 p-3 text-center">
                  <div className="text-lg font-bold text-red-800">
                    {lectures.filter((l) => l.status === "rejected").length}
                  </div>
                  <div className="text-sm text-red-600">مرفوض</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 text-center">
                  <div className="text-lg font-bold text-blue-800">{lectures.length}</div>
                  <div className="text-sm text-blue-600">إجمالي</div>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Lectures List */}
        <RetroWindow title="قائمة المحاضرات">
          <div className="p-4">
            {loadingData ? (
              <div className="text-center py-8">
                <div className="text-gray-600">جاري التحميل...</div>
              </div>
            ) : lectures.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-600">لا توجد محاضرات</div>
              </div>
            ) : (
              <div className="space-y-4">
                {lectures.map((lecture) => (
                  <div key={lecture.id} className="bg-white border border-gray-400 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-black">{lecture.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${getStatusColor(lecture.status)}`}>
                            {getStatusText(lecture.status)}
                          </span>
                          {lecture.is_featured && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">مميز</span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <strong>المادة:</strong> {lecture.course_name}
                          </div>
                          <div>
                            <strong>رمز المادة:</strong> {lecture.course_code}
                          </div>
                          <div>
                            <strong>الأستاذ:</strong> {lecture.professor_name}
                          </div>
                          <div>
                            <strong>تاريخ المحاضرة:</strong>{" "}
                            {new Date(lecture.lecture_date).toLocaleDateString("ar-SA")}
                          </div>
                          <div>
                            <strong>وقت المحاضرة:</strong> {lecture.lecture_time}
                          </div>
                          <div>
                            <strong>المرفوع بواسطة:</strong> {lecture.uploader_name}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          <strong>الوصف:</strong> {lecture.description}
                        </div>

                        {lecture.tags && lecture.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {lecture.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>🖼️ {lecture.image_urls?.length || 0} صورة</span>
                          <span>👁️ {lecture.views_count} مشاهدة</span>
                          <span>❤️ {lecture.likes_count} إعجاب</span>
                          <span>💬 {lecture.comments_count} تعليق</span>
                          <span>📅 {new Date(lecture.upload_date).toLocaleDateString("ar-SA")}</span>
                        </div>

                        {lecture.rejection_reason && (
                          <div className="bg-red-50 border border-red-200 p-2 text-sm text-red-800 mb-3">
                            <strong>سبب الرفض:</strong> {lecture.rejection_reason}
                          </div>
                        )}

                        {/* Images Preview */}
                        {lecture.image_urls && lecture.image_urls.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm font-medium text-black mb-2">صور المحاضرة:</div>
                            <div className="flex gap-2 flex-wrap">
                              {lecture.image_urls.slice(0, 3).map((url, index) => (
                                <button
                                  key={index}
                                  onClick={() => setShowImageModal(url)}
                                  className="w-16 h-16 border border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                >
                                  <img
                                    src={url || "/placeholder.svg"}
                                    alt={`صورة ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                              {lecture.image_urls.length > 3 && (
                                <div className="w-16 h-16 border border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                                  +{lecture.image_urls.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 mr-4">
                        {lecture.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(lecture.id)}
                              className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600"
                            >
                              قبول
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLecture(lecture)
                                setShowRejectionModal(true)
                              }}
                              className="retro-button bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600"
                            >
                              رفض
                            </button>
                          </>
                        )}

                        {lecture.status === "approved" && (
                          <button
                            onClick={() => handleToggleFeatured(lecture.id, lecture.is_featured)}
                            className={`retro-button px-3 py-1 text-sm ${lecture.is_featured
                                ? "bg-purple-500 text-white hover:bg-purple-600"
                                : "bg-gray-500 text-white hover:bg-gray-600"
                              }`}
                          >
                            {lecture.is_featured ? "إلغاء التمييز" : "تمييز"}
                          </button>
                        )}

                        <button className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600">
                          عرض التفاصيل
                        </button>
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
              <h3 className="text-lg font-bold text-black mb-4">رفض المحاضرة</h3>
              <p className="text-gray-600 mb-4">يرجى إدخال سبب رفض هذه المحاضرة:</p>

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
                    setSelectedLecture(null)
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
                  رفض المحاضرة
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="max-w-4xl max-h-4xl p-4">
              <div className="bg-white border-4 border-black p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-black">معاينة الصورة</h3>
                  <button
                    onClick={() => setShowImageModal(null)}
                    className="retro-button bg-red-500 text-white px-3 py-1 hover:bg-red-600"
                  >
                    إغلاق
                  </button>
                </div>
                <img
                  src={showImageModal || "/placeholder.svg"}
                  alt="معاينة الصورة"
                  className="max-w-full max-h-96 object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
