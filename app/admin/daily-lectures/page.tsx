"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/contexts/user-context"
import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import {
  GraduationCap,
  User,
  Clock,
  Check,
  X,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


interface Lecture {
  id: string
  title: string
  description: string
  subject_name: string
  university_name: string
  major: string
  lecture_date: string
  duration_minutes: number
  approval_status: 'pending' | 'approved' | 'rejected'
  created_at: string
  rejection_reason?: string
  file_url?: string
  file_name?: string
  instructor: {
    name: string
    email: string
    university?: string
    phone?: string
  }
}

export default function AdminDailyLecturesPage() {
  const { isLoggedIn, isAdmin } = useUserContext()
  const router = useRouter()
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  })
  const [updating, setUpdating] = useState<string | null>(null)
  const [rejectionModal, setRejectionModal] = useState<{ lectureId: string; title: string } | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      router.push('/')
      return
    }
    fetchLectures()
  }, [isLoggedIn, isAdmin, router, filter, page])

  const fetchLectures = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        status: filter,
        page: page.toString(),
        limit: '20'
      })

      const res = await fetch(`/api/admin/lectures?${params}`)
      const data = await res.json()

      if (res.ok) {
        setLectures(data.lectures || [])
        setPagination(data.pagination)
      } else {
        console.error("Error fetching lectures:", data.error)
        toast.error("خطأ في جلب المحاضرات")
      }
    } catch (error) {
      console.error("Error fetching lectures:", error)
      toast.error("خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (lectureId: string) => {
    try {
      setUpdating(lectureId)
      const { error } = await supabase
        .from("lectures")
        .update({ approval_status: "approved" })
        .eq("id", lectureId)

      if (error) throw error

      setLectures(prev => prev.map(l => l.id === lectureId ? { ...l, approval_status: "approved" } : l))
      toast.success("تم قبول المحاضرة بنجاح")
    } catch (err) {
      console.error(err)
      toast.error("خطأ في قبول المحاضرة")
    } finally {
      setUpdating(null)
    }
  }

  const handleReject = async (lectureId: string, reason: string) => {
    try {
      setUpdating(lectureId)
      const { error } = await supabase
        .from("lectures")
        .update({ approval_status: "rejected" })
        .eq("id", lectureId)

      if (error) throw error

      setLectures(prev => prev.filter(l => l.id !== lectureId))
      toast.success("تم رفض المحاضرة ")
    } catch (err) {
      console.error(err)
      toast.error("خطأ في رفض المحاضرة")
    } finally {
      setUpdating(null)
    }
  }

  const handledelete = async (lectureId: string) => {
    try {
      setUpdating(lectureId)
      const { error } = await supabase
        .from("lectures")
        .delete()
        .eq("id", lectureId)

      if (error) throw error

      setLectures(prev => prev.filter(l => l.id !== lectureId))
      toast.success("تم حذفها")
    } catch (err) {
      console.error(err)
      toast.error("خطأ في حذف المحاضرة")
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار'
      case 'approved': return 'مقبولة'
      case 'rejected': return 'مرفوضة'
      default: return status
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours} ساعة ${mins > 0 ? `و ${mins} دقيقة` : ''}`
    }
    return `${mins} دقيقة`
  }

  if (!isLoggedIn || !isAdmin()) {
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
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1 text-sm border border-gray-400 ${filter === status ? "bg-retro-accent text-white" : "bg-white text-black hover:bg-gray-50"
                        }`}
                    >
                      {status === 'all' ? 'الكل' : getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-yellow-50 border border-yellow-200 p-3 text-center">
                  <div className="text-lg font-bold text-yellow-800">
                    {lectures.filter(l => l.approval_status === 'pending').length}
                  </div>
                  <div className="text-sm text-yellow-600">في الانتظار</div>
                </div>
                <div className="bg-green-50 border border-green-200 p-3 text-center">
                  <div className="text-lg font-bold text-green-800">
                    {lectures.filter(l => l.approval_status === 'approved').length}
                  </div>
                  <div className="text-sm text-green-600">مقبولة</div>
                </div>
                <div className="bg-red-50 border border-red-200 p-3 text-center">
                  <div className="text-lg font-bold text-red-800">
                    {lectures.filter(l => l.approval_status === 'rejected').length}
                  </div>
                  <div className="text-sm text-red-600">مرفوضة</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 text-center">
                  <div className="text-lg font-bold text-blue-800">{pagination.total}</div>
                  <div className="text-sm text-blue-600">إجمالي</div>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Lectures List */}
        <RetroWindow title="قائمة المحاضرات">
          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : lectures.length === 0 ? (
              <div className="text-center py-8">لا توجد محاضرات</div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {lectures.map((lecture) => (
                    <div key={lecture.id} className="bg-white border border-gray-400 p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-8 h-8 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-black">{lecture.title}</h3>
                            <Badge className={getStatusColor(lecture.approval_status)}>
                              {getStatusText(lecture.approval_status)}
                            </Badge>
                          </div>

                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{lecture.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                            <div><strong>المادة:</strong> {lecture.subject_name}</div>
                            <div><strong>الجامعة:</strong> {lecture.university_name}</div>
                            <div><strong>التخصص:</strong> {lecture.major}</div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <strong>موعد المحاضرة:</strong> {new Date(lecture.lecture_date).toLocaleDateString('ar-SA')}
                            </div>
                            <div><strong>المدة:</strong> {formatDuration(lecture.duration_minutes)}</div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              المحاضر: {lecture.instructor.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              تم الرفع: {new Date(lecture.created_at).toLocaleDateString('ar-SA')}
                            </span>
                          </div>

                          {lecture.rejection_reason && (
                            <div className="bg-red-50 border border-red-200 p-2 text-sm text-red-800 mb-3">
                              <strong>سبب الرفض:</strong> {lecture.rejection_reason}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          {lecture.approval_status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(lecture.id)}
                                disabled={updating === lecture.id}
                                className="retro-button bg-green-500 text-white hover:bg-green-600"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                قبول
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => setRejectionModal({ lectureId: lecture.id, title: lecture.title })}
                                disabled={updating === lecture.id}
                                className="retro-button bg-red-500 text-white hover:bg-red-600"
                              >
                                <X className="w-4 h-4 mr-1" />
                                رفض
                              </Button>
                            </>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            className="retro-button bg-transparent"
                          >
                            <a href={lecture.file_url} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4 mr-1" />
                              عرض التفاصيل
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>handledelete(lecture.id)}
                            className="retro-button bg-red-500 text-white hover:bg-red-600"
                          >
                            <X className="w-4 h-4 mr-1" />
                            حذف المحاضرة
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      صفحة {pagination.page} من {pagination.totalPages} ({pagination.total} محاضرة)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                        className="retro-button bg-transparent"
                      >
                        <ChevronRight className="w-4 h-4" />
                        السابق
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= pagination.totalPages}
                        className="retro-button bg-transparent"
                      >
                        التالي
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </RetroWindow>
      </div>

      {/* Rejection Modal */}
      {rejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-black mb-4">رفض المحاضرة</h3>
            <p className="text-gray-600 mb-4">سبب رفض محاضرة "{rejectionModal.title}":</p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="اكتب سبب الرفض هنا..."
              className="w-full p-3 border border-gray-400 mb-4 h-24 resize-none"
              dir="rtl"
            />

            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setRejectionModal(null)
                  setRejectionReason("")
                }}
                variant="outline"
                className="retro-button bg-transparent"
              >
                إلغاء
              </Button>
              <Button
                onClick={() => handleReject(rejectionModal!.lectureId, rejectionReason)}
                disabled={!rejectionReason.trim() || updating === rejectionModal?.lectureId}
                className="retro-button bg-red-500 text-white hover:bg-red-600"
              >
                رفض المحاضرة
              </Button>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}