"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Badge } from "@/app/components/ui/badge"
import {
  Upload,
  Calendar,
  Clock,
  FileText,
  GraduationCap,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Lecture {
  id: string
  title: string
  description: string
  subject_name: string
  university_name: string
  major: string
  lecture_date: string
  duration_minutes: number
  file_url?: string
  file_name?: string
  approval_status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  created_at: string
}

export default function NotebooksPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [approvedLectures, setApprovedLectures] = useState<Lecture[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [approvedSearch, setApprovedSearch] = useState("")

  const supabase = createClient()

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject_name: '',
    university_name: '',
    major: '',
    lecture_date: '',
    duration_minutes: 60,
    file_url: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchLectures()
    fetchApprovedLectures()
  }, [isLoggedIn, router])

  const fetchLectures = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .eq("instructor_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setLectures(data || [])
    } catch (error) {
      console.error("Error fetching lectures:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchApprovedLectures = async () => {
    try {
      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .eq("approval_status", "approved")
        .order("created_at", { ascending: false })

      if (error) throw error
      setApprovedLectures(data || [])
    } catch (error) {
      console.error("Error fetching approved lectures:", error)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast.error("يرجى اختيار ملف")
      return
    }

    try {
      setUploading(true)

      // رفع الملف على Storage
      const filePath = `${user?.id}/${Date.now()}_${selectedFile.name}`
      const { error: uploadError } = await supabase.storage
        .from("lectures")
        .upload(filePath, selectedFile)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from("lectures")
        .getPublicUrl(filePath)

      // حفظ البيانات في جدول lectures
      const { error: insertError } = await supabase.from("lectures").insert([
        {
          ...formData,
          file_url: publicUrlData.publicUrl,
          file_name: selectedFile.name,
          instructor_id: user?.id,
        },
      ])

      if (insertError) throw insertError

      toast.success("تم رفع المحاضرة بنجاح! في انتظار موافقة الإدارة")
      setShowUploadForm(false)
      resetForm()
      fetchLectures()
    } catch (error) {
      console.error("Error uploading lecture:", error)
      toast.error("خطأ في رفع المحاضرة")
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject_name: '',
      university_name: '',
      major: '',
      lecture_date: '',
      duration_minutes: 60,
      file_url: ''
    })
    setSelectedFile(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'مقبولة'
      case 'rejected': return 'مرفوضة'
      default: return 'في الانتظار'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const filteredApprovedLectures = approvedLectures.filter((lecture) => {
    const query = approvedSearch.toLowerCase()
    return (
      lecture.title.toLowerCase().includes(query) ||
      lecture.description?.toLowerCase().includes(query) ||
      lecture.subject_name.toLowerCase().includes(query) ||
      lecture.major.toLowerCase().includes(query)
    )
  })


  if (!isLoggedIn) return null

  return (
    <div className="min-h-screen bg-retro-bg p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <RetroWindow title="دفتر المحاضرات">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-black">دفتر المحاضرات اليومية</h1>
                <Button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="retro-button bg-green-500 text-white hover:bg-green-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  رفع محاضرة جديدة
                </Button>
              </div>

              <p className="text-gray-600">
                شارك محاضراتك مع الطلاب الآخرين واحصل على موافقة الإدارة لنشرها
              </p>
            </div>
          </RetroWindow>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="mb-6">
            <RetroWindow title="رفع محاضرة جديدة">
              <form onSubmit={handleUpload} className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">عنوان المحاضرة *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="أدخل عنوان المحاضرة"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject_name">اسم المادة *</Label>
                    <Input
                      id="subject_name"
                      value={formData.subject_name}
                      onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                      placeholder="مثل: الرياضيات"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="university_name">الجامعة *</Label>
                    <Input
                      id="university_name"
                      value={formData.university_name}
                      onChange={(e) => setFormData({ ...formData, university_name: e.target.value })}
                      placeholder="أدخل اسم الجامعة"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="major">التخصص *</Label>
                    <Input
                      id="major"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      placeholder="مثل: علوم الحاسوب"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lecture_date">تاريخ المحاضرة *</Label>
                    <Input
                      id="lecture_date"
                      type="datetime-local"
                      value={formData.lecture_date}
                      onChange={(e) => setFormData({ ...formData, lecture_date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration_minutes">مدة المحاضرة (دقيقة)</Label>
                    <Input
                      id="duration_minutes"
                      type="number"
                      min="15"
                      max="240"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">وصف المحاضرة</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف مختصر لمحتوى المحاضرة"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="file">ملف المحاضرة *</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    required
                  />

                  <div className="text-xs text-gray-500 mt-1">
                    الملفات المدعومة: PDF, DOC, DOCX, PPT, PPTX (حجم أقصى 50MB)
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadForm(false)}
                    className="retro-button bg-transparent"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="retro-button bg-green-500 text-white hover:bg-green-600"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    {uploading ? 'جاري الرفع...' : 'رفع المحاضرة'}
                  </Button>
                </div>
              </form>
            </RetroWindow>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* My Lectures */}
          <RetroWindow title="محاضراتي">
            <div className="p-4">
              {loading ? (
                <div className="text-center py-8">جاري تحميل محاضراتك...</div>
              ) : lectures.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">لم ترفع أي محاضرات بعد</p>
                  <Button
                    onClick={() => setShowUploadForm(true)}
                    className="retro-button bg-green-500 text-white"
                  >
                    رفع أول محاضرة
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {lectures.map((lecture) => (
                    <div key={lecture.id} className="bg-white border border-gray-400 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-black">{lecture.title}</h3>
                            {getStatusIcon(lecture.approval_status)}
                            <Badge className={getStatusColor(lecture.approval_status)}>
                              {getStatusText(lecture.approval_status)}
                            </Badge>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">{lecture.description}</p>

                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div><strong>المادة:</strong> {lecture.subject_name}</div>
                            <div><strong>التخصص:</strong> {lecture.major}</div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(lecture.lecture_date).toLocaleDateString('ar-SA')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lecture.duration_minutes} دقيقة
                            </div>
                          </div>

                          {lecture.rejection_reason && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 text-sm text-red-800">
                              <strong>سبب الرفض:</strong> {lecture.rejection_reason}
                            </div>
                          )}
                        </div>

                        <div className="mr-4">
                          {lecture.file_url && (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="retro-button bg-transparent"
                            >
                              <a href={lecture.file_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-1" />
                                عرض
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </RetroWindow>

          {/* Approved Lectures */}
          <RetroWindow title="المحاضرات المقبولة">
            <div className="p-4">
              {/* Search Input */}
              <div className="mb-4">
                <label className="font-bold text-lg mb-1">ابحث عن اسم المادة\التخصص او اسم المحاضرة :</label>
                <Input
                  placeholder="ابحث عن محاضرة..."
                  value={approvedSearch}
                  onChange={(e) => setApprovedSearch(e.target.value)}
                  className="retro-button"
                />
              </div>

              {filteredApprovedLectures.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">لا توجد محاضرات مطابقة للبحث</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApprovedLectures.slice(0, 10).map((lecture) => (
                    <div
                      key={lecture.id}
                      className="p-4 retro-window bg-white shadow-md"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg">{lecture.title}</h3>
                          <p className="text-sm text-gray-600">
                            {lecture.subject_name} - {lecture.university_name}
                          </p>
                          <p className="text-sm text-gray-500">{lecture.major}</p>
                        </div>
                        <Button className="retro-button bg-green-600 text-white hover:bg-green-700">
                          <Link href={`${lecture.file_url}`} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-3 h-3 mr-1" />
                            عرض ملف المحاضرة
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </RetroWindow>
        </div>
      </div>
    </div>
  )
}