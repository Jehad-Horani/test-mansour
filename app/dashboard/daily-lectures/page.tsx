"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RetroWindow } from "@/components/retro-window"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
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

// Mock data for daily lectures
const mockLectures = [
  {
    id: 1,
    title: "محاضرة القانون الدستوري - الفصل الثالث",
    course: "LAW 301",
    courseName: "القانون الدستوري",
    professor: "د. أحمد محمد",
    date: "2024-01-15",
    time: "10:00 AM",
    uploadedBy: "سارة أحمد",
    uploadDate: "2024-01-15T14:30:00",
    status: "approved" as const,
    views: 125,
    likes: 23,
    comments: 8,
    images: ["/placeholder-3e1wz.png"],
    description: "محاضرة شاملة حول مبادئ القانون الدستوري والنظام السياسي",
    tags: ["قانون", "دستوري", "نظام سياسي"],
  },
  {
    id: 2,
    title: "محاضرة البرمجة الكائنية - Java",
    course: "CS 201",
    courseName: "البرمجة الكائنية",
    professor: "د. محمد علي",
    date: "2024-01-16",
    time: "2:00 PM",
    uploadedBy: "أحمد خالد",
    uploadDate: "2024-01-16T16:45:00",
    status: "pending" as const,
    views: 0,
    likes: 0,
    comments: 0,
    images: ["/java-code-snippet.png"],
    description: "شرح مفصل للبرمجة الكائنية باستخدام لغة Java",
    tags: ["برمجة", "java", "كائنية"],
  },
  {
    id: 3,
    title: "محاضرة التشريح - الجهاز التنفسي",
    course: "MED 102",
    courseName: "علم التشريح",
    professor: "د. فاطمة حسن",
    date: "2024-01-14",
    time: "9:00 AM",
    uploadedBy: "ليلى محمود",
    uploadDate: "2024-01-14T12:20:00",
    status: "rejected" as const,
    views: 0,
    likes: 0,
    comments: 0,
    images: ["/placeholder-z1r7g.png"],
    description: "دراسة تفصيلية للجهاز التنفسي وأجزائه",
    tags: ["طب", "تشريح", "تنفسي"],
    rejectionReason: "جودة الصور غير واضحة، يرجى إعادة التصوير",
  },
]

export default function DailyLecturesPage() {
  const { user, profile, isLoggedIn } = useAuth()
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadStep, setUploadStep] = useState(1)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [lectures, setLectures] = useState(mockLectures)
  const [selectedLecture, setSelectedLecture] = useState<any>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCourse, setFilterCourse] = useState("all")
  const [selectedImages, setSelectedImages] = useState<File[]>([])

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 5) {
      alert("يمكنك رفع 5 صور كحد أقصى")
      return
    }
    setSelectedImages(files)
  }

  const handleUpload = () => {
    if (selectedImages.length === 0) {
      alert("يرجى اختيار صور المحاضرة")
      return
    }

    setUploadStep(2)
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStep(3)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const resetUpload = () => {
    setUploadStep(1)
    setUploadProgress(0)
    setSelectedImages([])
    setUploadModalOpen(false)
  }

  const handleViewLecture = (lecture: any) => {
    setSelectedLecture(lecture)
    setViewModalOpen(true)
  }

  const handleReUpload = (lectureId: number) => {
    setLectures((prev) =>
      prev.map((lecture) =>
        lecture.id === lectureId ? { ...lecture, status: "pending" as const, rejectionReason: undefined } : lecture,
      ),
    )
    alert("تم إعادة رفع المحاضرة للمراجعة")
  }

  const filteredLectures = lectures.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecture.professor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || lecture.status === filterStatus
    const matchesCourse = filterCourse === "all" || lecture.course === filterCourse

    return matchesSearch && matchesStatus && matchesCourse
  })

  const approvedLectures = lectures.filter((l) => l.status === "approved")
  const pendingLectures = lectures.filter((l) => l.status === "pending")
  const myLectures = lectures.filter((l) => l.uploadedBy === profile?.name)

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
              <p className="text-gray-600">شارك صور محاضراتك اليومية مع زملائك الطلاب</p>
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
                    {approvedLectures.reduce((sum, l) => sum + l.views, 0)}
                  </div>
                  <div className="text-sm text-gray-600">إجمالي المشاهدات</div>
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
                        className="retro-window w-32"
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
                    <Select value={filterCourse} onValueChange={setFilterCourse}>
                      <SelectTrigger
                        className="retro-window w-32"
                        style={{ background: "white", border: "2px inset #c0c0c0" }}
                      >
                        <SelectValue placeholder="المقرر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع المقررات</SelectItem>
                        <SelectItem value="LAW 301">LAW 301</SelectItem>
                        <SelectItem value="CS 201">CS 201</SelectItem>
                        <SelectItem value="MED 102">MED 102</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                      <Upload className="w-4 h-4 ml-1" />
                      رفع محاضرة جديدة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="retro-window max-w-2xl">
                    <DialogHeader>
                      <DialogTitle style={{ color: "var(--ink)" }}>رفع محاضرة يومية جديدة</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {uploadStep === 1 && (
                        <>
                          <Input
                            placeholder="عنوان المحاضرة"
                            className="retro-window"
                            style={{ background: "white", border: "2px inset #c0c0c0" }}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Select>
                              <SelectTrigger
                                className="retro-window"
                                style={{ background: "white", border: "2px inset #c0c0c0" }}
                              >
                                <SelectValue placeholder="اختر المقرر" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="law-301">LAW 301 - القانون الدستوري</SelectItem>
                                <SelectItem value="cs-201">CS 201 - البرمجة الكائنية</SelectItem>
                                <SelectItem value="med-102">MED 102 - علم التشريح</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="اسم الأستاذ"
                              className="retro-window"
                              style={{ background: "white", border: "2px inset #c0c0c0" }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              type="date"
                              className="retro-window"
                              style={{ background: "white", border: "2px inset #c0c0c0" }}
                            />
                            <Input
                              type="time"
                              className="retro-window"
                              style={{ background: "white", border: "2px inset #c0c0c0" }}
                            />
                          </div>
                          <Textarea
                            placeholder="وصف المحاضرة (اختياري)"
                            className="retro-window"
                            style={{ background: "white", border: "2px inset #c0c0c0" }}
                            rows={3}
                          />
                          <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                              صور المحاضرة (حد أقصى 5 صور)
                            </label>
                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="retro-window"
                              style={{ background: "white", border: "2px inset #c0c0c0" }}
                            />
                            {selectedImages.length > 0 && (
                              <div className="mt-2 text-sm text-gray-600">تم اختيار {selectedImages.length} صورة</div>
                            )}
                          </div>
                          <Input
                            placeholder="الكلمات المفتاحية (مفصولة بفواصل)"
                            className="retro-window"
                            style={{ background: "white", border: "2px inset #c0c0c0" }}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={handleUpload}
                              className="retro-button flex-1"
                              style={{ background: "var(--primary)", color: "white" }}
                            >
                              رفع المحاضرة
                            </Button>
                            <Button variant="outline" onClick={resetUpload} className="retro-button bg-transparent">
                              إلغاء
                            </Button>
                          </div>
                        </>
                      )}
                      {uploadStep === 2 && (
                        <div className="space-y-4 text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <Upload className="w-8 h-8 text-blue-600" />
                          </div>
                          <p className="font-medium">جاري رفع المحاضرة...</p>
                          <Progress value={uploadProgress} className="w-full" />
                          <p className="text-sm text-gray-600">{uploadProgress}% مكتمل</p>
                        </div>
                      )}
                      {uploadStep === 3 && (
                        <div className="space-y-4 text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-green-600 text-2xl">✓</span>
                          </div>
                          <p className="font-semibold">تم رفع المحاضرة بنجاح!</p>
                          <p className="text-sm text-gray-600">
                            ستتم مراجعة المحاضرة من قبل الإدارة وإشعارك بالنتيجة خلال 24 ساعة
                          </p>
                          <Button onClick={resetUpload} className="retro-button">
                            إغلاق
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Lectures Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLectures.map((lecture) => (
                  <div key={lecture.id} className="retro-window bg-white hover:shadow-lg transition-shadow">
                    <div className="retro-titlebar mb-4">
                      <h3 className="text-sm font-bold text-white">{lecture.course}</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* Lecture Image */}
                      <div className="retro-window bg-gray-100 h-32 flex items-center justify-center">
                        <img
                          src={lecture.images[0] || "/placeholder.svg"}
                          alt="معاينة المحاضرة"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Lecture Info */}
                      <div>
                        <h4 className="font-semibold mb-2 line-clamp-2" style={{ color: "var(--ink)" }}>
                          {lecture.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          <Calendar className="w-4 h-4 inline ml-1" />
                          {lecture.date} - {lecture.time}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <User className="w-4 h-4 inline ml-1" />
                          {lecture.professor}
                        </p>
                        <p className="text-sm text-gray-600">رفع بواسطة: {lecture.uploadedBy}</p>
                      </div>

                      {/* Status and Stats */}
                      <div className="flex items-center justify-between">
                        <Badge className={`${getStatusColor(lecture.status)} retro-button`}>
                          {getStatusLabel(lecture.status)}
                        </Badge>
                        {lecture.status === "approved" && (
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {lecture.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {lecture.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {lecture.comments}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Rejection Reason */}
                      {lecture.status === "rejected" && lecture.rejectionReason && (
                        <div className="retro-window bg-red-50 p-3" style={{ border: "2px inset #ffcccc" }}>
                          <p className="text-sm text-red-700">
                            <strong>سبب الرفض:</strong> {lecture.rejectionReason}
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
                        {lecture.status === "rejected" && lecture.uploadedBy === profile?.name && (
                          <Button
                            size="sm"
                            className="flex-1 retro-button"
                            style={{ background: "var(--accent)", color: "white" }}
                            onClick={() => handleReUpload(lecture.id)}
                          >
                            <RefreshCw className="w-4 h-4 ml-1" />
                            إعادة رفع
                          </Button>
                        )}
                        {lecture.status === "approved" && (
                          <Button size="sm" variant="outline" className="retro-button bg-transparent">
                            <Download className="w-4 h-4 ml-1" />
                            تحميل
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredLectures.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-lg mb-2">لا توجد محاضرات</p>
                  <p className="text-gray-400">جرب تغيير معايير البحث أو الفلترة</p>
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
                    <p>
                      <strong>المقرر:</strong> {selectedLecture.courseName} ({selectedLecture.course})
                    </p>
                    <p>
                      <strong>الأستاذ:</strong> {selectedLecture.professor}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>التاريخ:</strong> {selectedLecture.date} - {selectedLecture.time}
                    </p>
                    <p>
                      <strong>رفع بواسطة:</strong> {selectedLecture.uploadedBy}
                    </p>
                  </div>
                </div>
                {selectedLecture.description && <p className="mt-3 text-gray-700">{selectedLecture.description}</p>}
                <div className="flex items-center gap-4 mt-3">
                  <Badge className={getStatusColor(selectedLecture.status)}>
                    {getStatusLabel(selectedLecture.status)}
                  </Badge>
                  {selectedLecture.tags && (
                    <div className="flex gap-1">
                      {selectedLecture.tags.map((tag: string, index: number) => (
                        <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Lecture Images */}
              <div className="space-y-4">
                <h4 className="font-semibold">صور المحاضرة</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedLecture.images.map((image: string, index: number) => (
                    <div key={index} className="retro-window bg-white p-2">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`صورة المحاضرة ${index + 1}`}
                        className="w-full h-64 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats and Actions */}
              {selectedLecture.status === "approved" && (
                <div className="retro-window bg-blue-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {selectedLecture.views} مشاهدة
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {selectedLecture.likes} إعجاب
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {selectedLecture.comments} تعليق
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="retro-button bg-transparent">
                        <Heart className="w-4 h-4 ml-1" />
                        إعجاب
                      </Button>
                      <Button size="sm" variant="outline" className="retro-button bg-transparent">
                        <Download className="w-4 h-4 ml-1" />
                        تحميل
                      </Button>
                    </div>
                  </div>
                </div>
              )}

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
