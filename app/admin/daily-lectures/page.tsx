"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import { Badge } from "@/app/components/ui/badge"
import Link from "next/link"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  ArrowRight,
  Search,
  Filter,
  Star,
  StarOff
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { adminService } from "@/lib/supabase/admin"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface DailyLecture {
  id: string
  title: string
  description?: string
  subject: string
  instructor_id: string
  scheduled_date: string
  start_time: string
  end_time: string
  location?: string
  meeting_url?: string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  max_attendees: number
  current_attendees: number
  approval_status: 'pending' | 'approved' | 'rejected'
  approved_by?: string
  approved_at?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
  instructor?: {
    name: string
    university?: string
    phone?: string
  }
}

export default function AdminDailyLecturesPage() {
  const { user, isLoggedIn, isAdmin } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [pendingLectures, setPendingLectures] = useState<DailyLecture[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [processingLectureId, setProcessingLectureId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
  

    loadPendingLectures()

    // Real-time updates for new lecture submissions
    const channel = supabase
      .channel('admin-lectures-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'daily_lectures' },
        (payload: any) => {
          console.log('New lecture submitted:', payload)
          loadPendingLectures()
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'daily_lectures' },
        (payload: any) => {
          console.log('Lecture updated:', payload)
          loadPendingLectures()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [ user])

  const loadPendingLectures = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('daily_lectures')
        .select(`
          *,
          instructor:profiles!daily_lectures_instructor_id_fkey(name, university, phone)
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filter !== 'all') {
        query = query.eq('approval_status', filter)
      }

      const { data, error } = await query
      
      if (error) throw error
      setPendingLectures(data || [])
    } catch (error: any) {
      console.error("Error loading lectures:", error)
      toast.error("حدث خطأ أثناء تحميل المحاضرات")
    } finally {
      setLoading(false)
    }
  }

  const approveLecture = async (lectureId: string) => {
    if (!confirm("هل أنت متأكد من قبول هذه المحاضرة؟")) return

    try {
      setProcessingLectureId(lectureId)
      
      const { data, error } = await supabase
        .from('daily_lectures')
        .update({
          approval_status: 'approved',
          approved_by: user!.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', lectureId)
        .select()

      if (error) throw error
      
      toast.success("تم قبول المحاضرة بنجاح")
      loadPendingLectures()
    } catch (error: any) {
      console.error("Error approving lecture:", error)
      toast.error("حدث خطأ أثناء قبول المحاضرة")
    } finally {
      setProcessingLectureId(null)
    }
  }

  const rejectLecture = async (lectureId: string) => {
    const reason = prompt("يرجى إدخال سبب رفض المحاضرة:")
    if (!reason) return

    try {
      setProcessingLectureId(lectureId)
      
      const { data, error } = await supabase
        .from('daily_lectures')
        .update({
          approval_status: 'rejected',
          approved_by: user!.id,
          approved_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', lectureId)
        .select()

      if (error) throw error
      
      toast.success("تم رفض المحاضرة")
      loadPendingLectures()
    } catch (error: any) {
      console.error("Error rejecting lecture:", error)
      toast.error("حدث خطأ أثناء رفض المحاضرة")
    } finally {
      setProcessingLectureId(null)
    }
  }

  const filteredLectures = pendingLectures.filter(lecture =>
    lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lecture.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lecture.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار'
      case 'approved':
        return 'مقبول'
      case 'rejected':
        return 'مرفوض'
      default:
        return status
    }
  }

 

  if (loading) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="مراجعة المحاضرات">
          <div className="p-6 text-center">
            <p className="text-gray-600">جاري تحميل المحاضرات المعلقة...</p>
          </div>
        </RetroWindow>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent mb-4">
            <Link href="/admin">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للوحة التحكم
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--ink)" }}>
            مراجعة المحاضرات اليومية
          </h1>
          <p className="text-gray-600">مراجعة وقبول أو رفض المحاضرات المرسلة من الأساتذة</p>
        </div>

        {/* Filters */}
        <RetroWindow title="الفلاتر والبحث">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="البحث في المحاضرات..." 
                  className="retro-button pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? "default" : "outline"}
                    size="sm"
                    className="retro-button"
                    style={filter === status ? { background: "var(--primary)", color: "white" } : {}}
                    onClick={() => setFilter(status)}
                  >
                    {status === 'all' ? 'الكل' :
                     status === 'pending' ? 'في الانتظار' :
                     status === 'approved' ? 'مقبول' : 'مرفوض'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </RetroWindow>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-6">
          <RetroWindow title="في الانتظار">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {pendingLectures.filter(l => l.approval_status === 'pending').length}
              </div>
              <p className="text-sm text-gray-600">محاضرة معلقة</p>
            </div>
          </RetroWindow>
          
          <RetroWindow title="مقبولة">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {pendingLectures.filter(l => l.approval_status === 'approved').length}
              </div>
              <p className="text-sm text-gray-600">محاضرة مقبولة</p>
            </div>
          </RetroWindow>

          <RetroWindow title="مرفوضة">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-red-600">
                {pendingLectures.filter(l => l.approval_status === 'rejected').length}
              </div>
              <p className="text-sm text-gray-600">محاضرة مرفوضة</p>
            </div>
          </RetroWindow>

          <RetroWindow title="المجموع">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
                {filteredLectures.length}
              </div>
              <p className="text-sm text-gray-600">نتيجة البحث</p>
            </div>
          </RetroWindow>
        </div>

        {/* Lectures List */}
        <RetroWindow title={`المحاضرات (${filteredLectures.length})`}>
          <div className="p-6">
            {filteredLectures.length === 0 ? (
              <div className="text-center py-12">
                {pendingLectures.length === 0 ? (
                  <>
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <p className="text-gray-600 text-lg">ممتاز! لا توجد محاضرات في الانتظار</p>
                    <p className="text-gray-500 text-sm mt-2">جميع المحاضرات تمت مراجعتها</p>
                  </>
                ) : (
                  <>
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">لا توجد نتائج للبحث "{searchTerm}"</p>
                    <Button 
                      variant="outline" 
                      className="retro-button bg-transparent mt-4"
                      onClick={() => setSearchTerm("")}
                    >
                      مسح البحث
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredLectures.map((lecture) => (
                  <div key={lecture.id} className="retro-window bg-white">
                    <div className="p-6">
                      <div className="grid lg:grid-cols-4 gap-6">
                        {/* Lecture Info */}
                        <div className="lg:col-span-3">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-xl font-bold">{lecture.title}</h3>
                            <Badge className={getStatusColor(lecture.approval_status)}>
                              {getStatusText(lecture.approval_status)}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-gray-600 mb-1"><strong>المادة:</strong> {lecture.subject}</p>
                              <p className="text-gray-600 mb-1"><strong>المدرس:</strong> {lecture.instructor?.name}</p>
                              <p className="text-gray-600 mb-1"><strong>الجامعة:</strong> {lecture.instructor?.university}</p>
                              <p className="text-gray-600 mb-1"><strong>التاريخ:</strong> {new Date(lecture.scheduled_date).toLocaleDateString('ar-SA')}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 mb-1"><strong>وقت البداية:</strong> {lecture.start_time}</p>
                              <p className="text-gray-600 mb-1"><strong>وقت النهاية:</strong> {lecture.end_time}</p>
                              <p className="text-gray-600 mb-1"><strong>المكان:</strong> {lecture.location || 'غير محدد'}</p>
                              <p className="text-gray-600 mb-1"><strong>الحد الأقصى:</strong> {lecture.max_attendees} مشارك</p>
                            </div>
                          </div>

                          {lecture.description && (
                            <div className="mb-4">
                              <h4 className="font-semibold mb-2">الوصف:</h4>
                              <p className="text-gray-600 text-sm">{lecture.description}</p>
                            </div>
                          )}

                          {lecture.meeting_url && (
                            <div className="mb-4">
                              <h4 className="font-semibold mb-2">رابط الاجتماع:</h4>
                              <a 
                                href={lecture.meeting_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                {lecture.meeting_url}
                              </a>
                            </div>
                          )}

                          {lecture.rejection_reason && (
                            <div className="bg-red-50 border border-red-200 p-3 mb-4">
                              <h4 className="font-semibold text-red-800 mb-1">سبب الرفض:</h4>
                              <p className="text-red-600 text-sm">{lecture.rejection_reason}</p>
                            </div>
                          )}

                          <div className="text-xs text-gray-500">
                            <p>تاريخ الإرسال: {new Date(lecture.created_at).toLocaleDateString('ar-SA')}</p>
                            <p>الحالة الحالية: {lecture.status}</p>
                            <p>المشاركون الحاليون: {lecture.current_attendees}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                          {lecture.approval_status === 'pending' && (
                            <>
                              <Button
                                className="retro-button"
                                style={{ background: "green", color: "white" }}
                                onClick={() => approveLecture(lecture.id)}
                                disabled={processingLectureId === lecture.id}
                              >
                                <CheckCircle className="w-4 h-4 ml-2" />
                                {processingLectureId === lecture.id ? "جاري القبول..." : "قبول المحاضرة"}
                              </Button>

                              <Button
                                variant="outline"
                                className="retro-button text-red-600 border-red-600 bg-transparent"
                                onClick={() => rejectLecture(lecture.id)}
                                disabled={processingLectureId === lecture.id}
                              >
                                <XCircle className="w-4 h-4 ml-2" />
                                {processingLectureId === lecture.id ? "جاري الرفض..." : "رفض المحاضرة"}
                              </Button>
                            </>
                          )}

                          <Button
                            variant="outline"
                            className="retro-button bg-transparent"
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            عرض التفاصيل
                          </Button>

                          <div className="mt-4 p-3 bg-gray-50 rounded">
                            <h5 className="font-semibold text-xs mb-1">معلومات المدرس:</h5>
                            <p className="text-xs text-gray-600">{lecture.instructor?.name}</p>
                            <p className="text-xs text-gray-600">{lecture.instructor?.university}</p>
                            {lecture.instructor?.phone && (
                              <p className="text-xs text-gray-600">{lecture.instructor?.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>
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