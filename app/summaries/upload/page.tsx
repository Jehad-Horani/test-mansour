"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { RetroWindow } from "@/app/components/retro-window"
import  PixelIcon  from "@/app/components/pixel-icon"
import { useRouter } from "next/navigation"
import { useSupabaseClient } from "../../lib/supabase/client-wrapper"
import { useUserContext } from "@/contexts/user-context"
import { useEffect } from "react"

const colleges = [
  "كلية الحقوق",
  "كلية تكنولوجيا المعلومات",
  "كلية إدارة الأعمال",
  "كلية الهندسة",
  "كلية الطب",
  "كلية الصيدلة",
]

const majorsByCollege: Record<string, string[]> = {
  "كلية الحقوق": ["القانون", "الشريعة", "العلوم السياسية"],
  "كلية تكنولوجيا المعلومات": ["علوم الحاسوب", "هندسة البرمجيات", "أمن المعلومات", "الشبكات"],
  "كلية إدارة الأعمال": ["إدارة الأعمال", "المحاسبة", "التسويق", "الاقتصاد"],
  "كلية الهندسة": ["الهندسة المدنية", "الهندسة الكهربائية", "الهندسة الميكانيكية"],
  "كلية الطب": ["الطب العام", "طب الأسنان"],
  "كلية الصيدلة": ["الصيدلة", "العلوم الطبية"],
}

const semesters = [
  "الفصل الأول 2024/2025",
  "الفصل الثاني 2024/2025",
  "الفصل الصيفي 2024",
  "الفصل الأول 2023/2024",
  "الفصل الثاني 2023/2024",
]

export default function UploadSummaryPage() {
  const [formData, setFormData] = useState({
    title: "",
    subject_name: "",
    university_name: "",
    semester: "",
    college: "",
    major: "",
    description: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const { user, isLoggedIn } = useUserContext()
const { data, loading1, error1 } = useSupabaseClient()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login")
    }
  }, [isLoggedIn, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Reset major when college changes
    if (field === "college") {
      setFormData((prev) => ({
        ...prev,
        major: "",
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("حجم الملف يجب أن يكون أقل من 10 ميجابايت")
        return
      }

      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
      ]

      if (!allowedTypes.includes(selectedFile.type)) {
        setError("نوع الملف غير مدعوم. يرجى رفع ملف PDF أو Word أو صورة")
        return
      }

      setFile(selectedFile)
      setError("")
    }
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!user) {
    setError("يجب تسجيل الدخول أولاً")
    return
  }

  const requiredFields = ["title", "subject_name", "university_name", "semester", "college", "major"]
  const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

  if (missingFields.length > 0) {
    setError("يرجى ملء جميع الحقول المطلوبة")
    return
  }

  if (!file) {
    setError("يرجى اختيار ملف للرفع")
    return
  }

  setLoading(true)
  setError("")

  try {
    const form = new FormData()
    form.append("file", file)
    Object.entries(formData).forEach(([key, value]) => form.append(key, value as string))
    form.append("user_id", user.id)

    const res = await fetch("/api/summaries/upload", {
      method: "POST",
      body: form,
    })

    if (!res.ok) throw new Error("فشل رفع الملخص")

    setSuccess(true)

    setTimeout(() => {
      router.push("/summaries")
    }, 2000)
  } catch (err: any) {
    console.error("Error uploading summary:", err)
    setError("حدث خطأ أثناء رفع الملخص. يرجى المحاولة مرة أخرى")
  } finally {
    setLoading(false)
  }
}


  if (!isLoggedIn) {
    return null // Will redirect to login
  }

  if (success) {
    return (
      <div className="min-h-screen" style={{ background: "var(--panel)" }}>
        <div className="max-w-2xl mx-auto p-4">
          <RetroWindow title="تم الرفع بنجاح">
            <div className="p-8 text-center">
              <PixelIcon type="check" className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>
                تم رفع الملخص بنجاح!
              </h2>
              <p className="text-gray-600 mb-4">
                سيتم مراجعة الملخص من قبل الإدارة وسيظهر في القائمة بعد الموافقة عليه
              </p>
              <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                <a href="/summaries">العودة للملخصات</a>
              </Button>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      <div className="max-w-2xl mx-auto p-4">
        <RetroWindow title="رفع ملخص جديد">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--ink)" }}>
              رفع ملخص دراسي جديد
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  عنوان الملخص *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="مثال: ملخص مادة البرمجة الكائنية"
                  className="retro-input"
                  required
                />
              </div>

              {/* Subject Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  اسم المادة *
                </label>
                <Input
                  value={formData.subject_name}
                  onChange={(e) => handleInputChange("subject_name", e.target.value)}
                  placeholder="مثال: البرمجة الكائنية"
                  className="retro-input"
                  required
                />
              </div>

              {/* University */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  اسم الجامعة *
                </label>
                <Input
                  value={formData.university_name}
                  onChange={(e) => handleInputChange("university_name", e.target.value)}
                  placeholder="مثال: الجامعة الأردنية"
                  className="retro-input"
                  required
                />
              </div>

              {/* College and Major */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                    الكلية *
                  </label>
                  <Select value={formData.college} onValueChange={(value) => handleInputChange("college", value)}>
                    <SelectTrigger className="retro-input">
                      <SelectValue placeholder="اختر الكلية" />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((college) => (
                        <SelectItem key={college} value={college}>
                          {college}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                    التخصص *
                  </label>
                  <Select
                    value={formData.major}
                    onValueChange={(value) => handleInputChange("major", value)}
                    disabled={!formData.college}
                  >
                    <SelectTrigger className="retro-input">
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.college &&
                        majorsByCollege[formData.college]?.map((major) => (
                          <SelectItem key={major} value={major}>
                            {major}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  الفصل الدراسي *
                </label>
                <Select value={formData.semester} onValueChange={(value) => handleInputChange("semester", value)}>
                  <SelectTrigger className="retro-input">
                    <SelectValue placeholder="اختر الفصل الدراسي" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  وصف الملخص (اختياري)
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="وصف مختصر عن محتوى الملخص..."
                  className="retro-input min-h-[100px]"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  رفع الملف *
                </label>
                <div className="retro-window bg-white p-4">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    الأنواع المدعومة: PDF, Word, صور (JPG, PNG) - الحد الأقصى: 10 ميجابايت
                  </p>
                  {file && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm" style={{ color: "var(--ink)" }}>
                        الملف المحدد: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="retro-window bg-red-50 border-red-200">
                  <div className="p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="retro-button flex-1"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-2"></div>
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <PixelIcon type="upload" className="w-4 h-4 ml-2" />
                      رفع الملخص
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  className="retro-button bg-transparent"
                >
                  إلغاء
                </Button>
              </div>
            </form>

            {/* Info Box */}
            <div className="mt-6 retro-window bg-blue-50">
              <div className="p-4">
                <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                  <PixelIcon type="info" className="w-4 h-4 inline ml-2" />
                  معلومات مهمة
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• سيتم مراجعة الملخص من قبل الإدارة قبل نشره</li>
                  <li>• يجب أن يكون المحتوى أصلي وغير منسوخ</li>
                  <li>• تأكد من صحة المعلومات المدخلة</li>
                  <li>• سيتم إشعارك عند الموافقة على الملخص</li>
                </ul>
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
