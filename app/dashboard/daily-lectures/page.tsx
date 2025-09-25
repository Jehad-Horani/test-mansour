"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { RetroWindow } from "@/app/components/retro-window"
import { Badge } from "@/app/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { Progress } from "@/app/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { toast } from "sonner"
import {
  ArrowRight,
  Upload,
  Eye,
  RefreshCw,
  FileText,
  Calendar,
  Clock,
  User,
  BookOpen,
  Search,
  Download,
  Heart,
  MessageCircle,
} from "lucide-react"

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

export default function DailyLecturesPage() {
  const { user, profile, isLoggedIn } = useAuth()
  const supabase = createClient()
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [lectures, setLectures] = useState<DailyLecture[]>([])
  const [selectedLecture, setSelectedLecture] = useState<DailyLecture | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)

  // Form state for new lecture
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    scheduled_date: "",
    start_time: "",
    end_time: "",
    location: "",
    meeting_url: "",
    max_attendees: 50
  })

  useEffect(() => {
    if (isLoggedIn) {
      loadLectures()
      
      // Real-time updates
      const channel = supabase
        .channel('lectures-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'daily_lectures' },
          (payload: any) => {
            console.log('Lecture updated:', payload)
            loadLectures()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [isLoggedIn])

  const loadLectures = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('daily_lectures')
        .select(`
          *,
          instructor:profiles!daily_lectures_instructor_id_fkey(name, university, phone)
        `)
        .order('created_at', { ascending: false })

      const { data, error } = await query
      
      if (error) throw error
      setLectures(data || [])
    } catch (error: any) {
      console.error("Error loading lectures:", error)
      toast.error("حدث خطأ أثناء تحميل المحاضرات")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !formData.title.trim() || !formData.subject.trim() || !formData.scheduled_date) {
      toast.error("يرجى ملء الحقول المطلوبة")
      return
    }

    try {
      setUploading(true)
      
      const lectureData = {
        ...formData,
        instructor_id: user.id,
        approval_status: 'pending' as const,
        status: 'scheduled' as const,
        current_attendees: 0
      }

      const { data, error } = await supabase
        .from('daily_lectures')
        .insert([lectureData])
        .select()

      if (error) throw error

      toast.success("تم إرسال المحاضرة للمراجعة! سيتم إشعارك عند الموافقة عليها.")
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        subject: "",
        scheduled_date: "",
        start_time: "",
        end_time: "",
        location: "",
        meeting_url: "",
        max_attendees: 50
      })
      
      setUploadModalOpen(false)
      loadLectures()
      
    } catch (error: any) {
      console.error("Error creating lecture:", error)
      toast.error("حدث خطأ أثناء إضافة المحاضرة")
    } finally {
      setUploading(false)
    }
  }

  const resubmitLecture = async (lectureId: string) => {
    try {
      const { error } = await supabase
        .from('daily_lectures')
        .update({ 
          approval_status: 'pending',
          rejection_reason: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', lectureId)

      if (error) throw error

      toast.success("تم إعادة إرسال المحاضرة للمراجعة")
      loadLectures()
    } catch (error: any) {
      console.error("Error resubmitting lecture:", error)
      toast.error("حدث خطأ أثناء إعادة الإرسال")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "معتمد"
      case "pending":
        return "قيد المراجعة"
      case "rejected":
        return "مرفوض"
      default:
        return "غير معروف"
    }
  }

  const handleViewLecture = (lecture: DailyLecture) => {
    setSelectedLecture(lecture)
    setViewModalOpen(true)
  }

  const filteredLectures = lectures.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || lecture.approval_status === filterStatus

    return matchesSearch && matchesStatus
  })

  const approvedLectures = lectures.filter((l) => l.approval_status === "approved")
  const pendingLectures = lectures.filter((l) => l.approval_status === "pending")
  const myLectures = lectures.filter((l) => l.instructor_id === user?.id)

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="المحاضرات اليومية">
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">يجب تسجيل الدخول لعرض المحاضرات</p>
            <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
              <Link href="/auth">تسجيل الدخول</Link>
            </Button>
          </div>
        </RetroWindow>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      {/* Header */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <RetroWindow title="المحاضرات اليومية">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button asChild variant="outline" className="retro-button bg-transparent">
                  <Link href="/dashboard">
                    <ArrowRight className="w-4 h-4 ml-1" />
                    العودة للوحة التحكم
                  </Link>
                </Button>
              </div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                المحاضرات اليومية
              </h1>
              <p className="text-gray-600">شارك محاضراتك اليومية مع زملائك الطلاب</p>
            </div>
          </RetroWindow>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <RetroWindow title="إحصائيات سريعة">
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center retro-window bg-white p-4">
                  <BookOpen className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--primary)" }} />
                  <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                    {approvedLectures.length}
                  </div>
                  <div className="text-sm text-gray-600">محاضرات معتمدة</div>
                </div>
                <div className="text-center retro-window bg-white p-4">
                  <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--accent)" }} />
                  <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                    {pendingLectures.length}
                  </div>
                  <div className="text-sm text-gray-600">قيد المراجعة</div>
                </div>
                <div className="text-center retro-window bg-white p-4">
                  <User className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--primary)" }} />
                  <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                    {myLectures.length}
                  </div>
                  <div className="text-sm text-gray-600">محاضراتي</div>
                </div>
                <div className="text-center retro-window bg-white p-4">
                  <Eye className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--accent)" }} />
                  <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                    {lectures.length}
                  </div>
                  <div className="text-sm text-gray-600">إجمالي المحاضرات</div>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>
      </section>

      {/* Upload and Filters */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <RetroWindow title="إدارة المحاضرات">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="البحث في المحاضرات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="retro-window pr-10"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger
                        className="retro-window w-40"
                        style={{ background: "white", border: "2px inset #c0c0c0" }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="approved">معتمد</SelectItem>
                        <SelectItem value="pending">قيد المراجعة</SelectItem>
                        <SelectItem value="rejected">مرفوض</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                      <Upload className="w-4 h-4 ml-1" />
                      إضافة محاضرة جديدة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="retro-window max-w-2xl">
                    <DialogHeader>
                      <DialogTitle style={{ color: "var(--ink)" }}>إضافة محاضرة يومية جديدة</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        placeholder="عنوان المحاضرة *"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="retro-window"
                        style={{ background: "white", border: "2px inset #c0c0c0" }}
                        required
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="اسم المادة *"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="retro-window"
                          style={{ background: "white", border: "2px inset #c0c0c0" }}
                          required
                        />
                        <Input
                          placeholder="المكان (اختياري)"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="retro-window"
                          style={{ background: "white", border: "2px inset #c0c0c0" }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          type="date"
                          value={formData.scheduled_date}
                          onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                          className="retro-window"
                          style={{ background: "white", border: "2px inset #c0c0c0" }}
                          required
                        />
                        <Input
                          type="time"
                          placeholder="وقت البداية"
                          value={formData.start_time}
                          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                          className="retro-window"
                          style={{ background: "white", border: "2px inset #c0c0c0" }}
                        />
                        <Input
                          type="time"
                          placeholder="وقت النهاية"
                          value={formData.end_time}
                          onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                          className="retro-window"
                          style={{ background: "white", border: "2px inset #c0c0c0" }}
                        />
                      </div>
                      
                      <Input
                        placeholder="رابط الاجتماع (اختياري)"
                        value={formData.meeting_url}
                        onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                        className="retro-window"
                        style={{ background: "white", border: "2px inset #c0c0c0" }}
                      />
                      
                      <Input
                        type="number"
                        placeholder="الحد الأقصى للمشاركين"
                        value={formData.max_attendees}
                        onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) || 50 })}
                        className="retro-window"
                        style={{ background: "white", border: "2px inset #c0c0c0" }}
                        min="1"
                        max="200"
                      />
                      
                      <Textarea
                        placeholder="وصف المحاضرة (اختياري)"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="retro-window"
                        style={{ background: "white", border: "2px inset #c0c0c0" }}
                        rows={3}
                      />
                      
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          disabled={uploading}
                          className="retro-button flex-1"
                          style={{ background: "var(--primary)", color: "white" }}
                        >
                          {uploading ? "جاري الإضافة..." : "إضافة المحاضرة"}
                        </Button>
                        <Button 
                          type="button"
                          variant="outline" 
                          onClick={() => setUploadModalOpen(false)} 
                          className="retro-button bg-transparent"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Lectures Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">جاري تحميل المحاضرات...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLectures.map((lecture) => (
                    <div key={lecture.id} className="retro-window bg-white hover:shadow-lg transition-shadow">
                      <div className="retro-titlebar mb-4">
                        <h3 className="text-sm font-bold text-white">{lecture.subject}</h3>
                      </div>
                      <div className="p-4 space-y-4">
                        {/* Lecture Info */}
                        <div>
                          <h4 className="font-semibold mb-2 line-clamp-2" style={{ color: "var(--ink)" }}>
                            {lecture.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            <Calendar className="w-4 h-4 inline ml-1" />
                            {new Date(lecture.scheduled_date).toLocaleDateString('ar-SA')}
                          </p>
                          {lecture.start_time && (
                            <p className="text-sm text-gray-600 mb-1">
                              <Clock className="w-4 h-4 inline ml-1" />
                              {lecture.start_time} - {lecture.end_time}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mb-1">
                            <User className="w-4 h-4 inline ml-1" />
                            {lecture.instructor?.name}
                          </p>
                          {lecture.location && (
                            <p className="text-sm text-gray-600">📍 {lecture.location}</p>
                          )}
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between">
                          <Badge className={`${getStatusColor(lecture.approval_status)} retro-button`}>
                            {getStatusLabel(lecture.approval_status)}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {lecture.current_attendees}/{lecture.max_attendees} مشارك
                          </div>
                        </div>

                        {/* Rejection Reason */}
                        {lecture.approval_status === "rejected" && lecture.rejection_reason && (
                          <div className="retro-window bg-red-50 p-3" style={{ border: "2px inset #ffcccc" }}>
                            <p className="text-sm text-red-700">
                              <strong>سبب الرفض:</strong> {lecture.rejection_reason}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 retro-button bg-transparent"
                            onClick={() => handleViewLecture(lecture)}
                          >
                            <Eye className="w-4 h-4 ml-1" />
                            عرض
                          </Button>
                          {lecture.approval_status === "rejected" && lecture.instructor_id === user?.id && (
                            <Button
                              size="sm"
                              className="flex-1 retro-button"
                              style={{ background: "var(--accent)", color: "white" }}
                              onClick={() => resubmitLecture(lecture.id)}
                            >
                              <RefreshCw className="w-4 h-4 ml-1" />
                              إعادة إرسال
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredLectures.length === 0 && !loading && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-lg mb-2">لا توجد محاضرات</p>
                  <p className="text-gray-400">جرب تغيير معايير البحث أو ابدأ بإضافة محاضرة جديدة</p>
                </div>
              )}
            </div>
          </RetroWindow>
        </div>
      </section>

      {/* View Lecture Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="retro-window max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: "var(--ink)" }}>عرض المحاضرة</DialogTitle>
          </DialogHeader>
          {selectedLecture && (
            <div className="space-y-6">
              {/* Lecture Header */}
              <div className="retro-window bg-gray-50 p-4">
                <h3 className="font-bold text-lg mb-2">{selectedLecture.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p><strong>المادة:</strong> {selectedLecture.subject}</p>
                    <p><strong>المدرس:</strong> {selectedLecture.instructor?.name}</p>
                  </div>
                  <div>
                    <p><strong>التاريخ:</strong> {new Date(selectedLecture.scheduled_date).toLocaleDateString('ar-SA')}</p>
                    <p><strong>الوقت:</strong> {selectedLecture.start_time} - {selectedLecture.end_time}</p>
                  </div>
                </div>
                {selectedLecture.description && (
                  <p className="mt-3 text-gray-700">{selectedLecture.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <Badge className={getStatusColor(selectedLecture.approval_status)}>
                    {getStatusLabel(selectedLecture.approval_status)}
                  </Badge>
                  {selectedLecture.location && (
                    <span className="text-sm">📍 {selectedLecture.location}</span>
                  )}
                  {selectedLecture.meeting_url && (
                    <a 
                      href={selectedLecture.meeting_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      رابط الاجتماع
                    </a>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setViewModalOpen(false)} className="retro-button">
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}