"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WindowCard } from "@/components/window-card"
import { TabBarRetro } from "@/components/tab-bar-retro"
import { RetroToggle } from "@/components/retro-toggle"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useTier } from "@/hooks/use-tier"
import Link from "next/link"

interface CourseHubProps {
  params: {
    major: string
    slug: string
  }
}

// Mock course data
const mockCourseData = {
  "law-101": {
    title: "مبادئ القانون",
    code: "LAW 101",
    instructor: "د. أحمد العلي",
    university: "جامعة الملك سعود",
    description: "مقدمة شاملة في أساسيات القانون والنظام القانوني السعودي",
  },
  "it-101": {
    title: "مقدمة في البرمجة",
    code: "CS 101",
    instructor: "د. عبدالله الشهري",
    university: "جامعة الملك فهد",
    description: "تعلم أساسيات البرمجة باستخدام لغة Python",
  },
  "med-101": {
    title: "علم التشريح",
    code: "MED 101",
    instructor: "د. محمد الأحمد",
    university: "جامعة الملك سعود",
    description: "دراسة شاملة لتشريح جسم الإنسان",
  },
}

const mockNotes = [
  {
    id: 1,
    title: "محاضرة الأسبوع الأول",
    date: "2024-01-15",
    tags: ["مقدمة", "أساسيات"],
    approved: true,
    uploader: "أحمد محمد",
  },
  {
    id: 2,
    title: "محاضرة الأسبوع الثاني",
    date: "2024-01-22",
    tags: ["نظريات", "تطبيقات"],
    approved: true,
    uploader: "فاطمة علي",
  },
]

const mockQuestions = [
  {
    id: 1,
    question: "ما هي أهم مبادئ القانون الأساسية؟",
    difficulty: "سهل",
    tags: ["مبادئ", "أساسيات"],
    answer: "المبادئ الأساسية تشمل العدالة والمساواة وسيادة القانون...",
  },
  {
    id: 2,
    question: "كيف يتم تطبيق القانون في المحاكم؟",
    difficulty: "متوسط",
    tags: ["تطبيق", "محاكم"],
    answer: "يتم تطبيق القانون من خلال إجراءات قضائية محددة...",
  },
]

export default function CourseHub({ params }: CourseHubProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { major, slug } = params
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "summary")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const { tier, canAccess } = useTier()

  const course = mockCourseData[slug as keyof typeof mockCourseData]

  const getMajorColor = (major: string) => {
    switch (major) {
      case "law":
        return "blue"
      case "it":
        return "green"
      case "medical":
        return "pink"
      default:
        return "gray"
    }
  }

  const color = getMajorColor(major)

  const tabs = [
    {
      id: "summary",
      label: "الملخص",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">وصف المقرر</h3>
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          </div>
          {!canAccess("standard") && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">ترقية الاشتراك مطلوبة</h4>
              <p className="text-yellow-700 mb-3">للوصول الكامل لجميع محتويات المقرر، يرجى ترقية اشتراكك</p>
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                ترقية الآن
              </Button>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">معلومات المقرر</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>الأستاذ: {course.instructor}</li>
                <li>الجامعة: {course.university}</li>
                <li>رمز المقرر: {course.code}</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">الإحصائيات</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>المحاضرات: {mockNotes.length}</li>
                <li>الأسئلة: {mockQuestions.length}</li>
                <li>الطلاب المسجلين: 245</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "notes",
      label: "المحاضرات",
      content: (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <Input placeholder="ابحث في المحاضرات..." className="w-64 bg-transparent" />
              <Select>
                <SelectTrigger className="w-32 bg-transparent">
                  <SelectValue placeholder="التاريخ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">الأحدث</SelectItem>
                  <SelectItem value="oldest">الأقدم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
              <DialogTrigger asChild>
                <Button className={`bg-${color}-600 hover:bg-${color}-700`}>رفع محاضرة</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>رفع محاضرة جديدة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="عنوان المحاضرة" className="bg-transparent" />
                  <Input type="file" accept="image/*,application/pdf" className="bg-transparent" />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        // Handle actual upload logic here
                        alert("تم رفع المحاضرة بنجاح!")
                        setUploadModalOpen(false)
                      }}
                    >
                      رفع
                    </Button>
                    <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
                      إلغاء
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockNotes.map((note) => (
              <WindowCard key={note.id} title={note.title} showControls={false}>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">رفع بواسطة: {note.uploader}</p>
                  <p className="text-sm text-gray-500">{note.date}</p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    عرض
                  </Button>
                </div>
              </WindowCard>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "questions",
      label: "الأسئلة",
      content: (
        <div className="space-y-6">
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-32 bg-transparent">
                <SelectValue placeholder="الصعوبة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">سهل</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="hard">صعب</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="ابحث في الأسئلة..." className="bg-transparent" />
          </div>
          <div className="space-y-4">
            {mockQuestions.slice(0, canAccess("standard") ? mockQuestions.length : 1).map((q) => (
              <WindowCard key={q.id} title={`سؤال ${q.id}`} showControls={false}>
                <div className="space-y-3">
                  <p className="font-medium">{q.question}</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {q.difficulty}
                    </Badge>
                    {q.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {canAccess("standard") && (
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-sm text-gray-700">{q.answer}</p>
                    </div>
                  )}
                </div>
              </WindowCard>
            ))}
            {!canAccess("standard") && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">للوصول لجميع الأسئلة، يرجى ترقية اشتراكك</p>
                <Button className="bg-yellow-600 hover:bg-yellow-700">ترقية الآن</Button>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "assets",
      label: "المواد",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <WindowCard title="المنهج الدراسي" showControls={false}>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">منهج المقرر الكامل للفصل الدراسي</p>
                <Button size="sm" variant="outline" className="bg-transparent">
                  تحميل PDF
                </Button>
              </div>
            </WindowCard>
            <WindowCard title="امتحانات سابقة" showControls={false}>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">مجموعة من الامتحانات السابقة</p>
                <Button size="sm" variant="outline" className="bg-transparent">
                  عرض الامتحانات
                </Button>
              </div>
            </WindowCard>
          </div>
        </div>
      ),
    },
    {
      id: "tips",
      label: "النصائح",
      content: (
        <div className="space-y-6">
          <WindowCard title="نصائح للدراسة" showControls={false}>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                راجع المحاضرات بانتظام
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                حل الأسئلة التطبيقية
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                شارك في المناقشات الجماعية
              </li>
            </ul>
          </WindowCard>
        </div>
      ),
    },
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (tabId === "summary") {
      newSearchParams.delete("tab")
    } else {
      newSearchParams.set("tab", tabId)
    }
    const newUrl = `${pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`
    router.replace(newUrl, { scroll: false })
  }

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "summary"
    setActiveTab(tabFromUrl)
  }, [searchParams])

  if (!course) {
    return <div>المقرر غير موجود</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RetroToggle />

      {/* Header */}
      <section className={`bg-gradient-to-r from-${color}-600 to-${color}-800 text-white py-12 px-4`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href={`/${major}/courses`} className={`text-${color}-200 hover:text-white`}>
              ← العودة للمقررات
            </Link>
          </div>
          <h1 className="text-3xl font-bold font-serif mb-2">{course.title}</h1>
          <p className={`text-${color}-100`}>
            {course.code} - {course.instructor}
          </p>
        </div>
      </section>

      {/* Course Hub Content */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <TabBarRetro tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </section>
    </div>
  )
}
