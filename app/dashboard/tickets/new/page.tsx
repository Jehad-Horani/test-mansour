"use client"

import type React from "react"
import { RetroWindow } from "@/app/components/retro-window"
import { RetroToggle } from "@/app/components/retro-toggle"
import { Button } from "@/app/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/contexts/user-context"
import { Upload, AlertCircle, FileText, X } from "lucide-react"
import Link from "next/link"

export default function NewTicketPage() {
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
    attachments: [] as File[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { user } = useUserContext()

  const categories = [
    { value: "technical", label: "مشكلة تقنية", icon: "🔧" },
    { value: "account", label: "مشكلة في الحساب", icon: "👤" },
    { value: "payment", label: "مشكلة في الدفع", icon: "💳" },
    { value: "content", label: "مشكلة في المحتوى", icon: "📚" },
    { value: "sessions", label: "مشكلة في الجلسات", icon: "🎓" },
    { value: "other", label: "أخرى", icon: "❓" },
  ]

  const priorities = [
    { value: "low", label: "منخفضة", color: "#22c55e", description: "غير عاجل" },
    { value: "medium", label: "متوسطة", color: "#f59e0b", description: "يحتاج متابعة" },
    { value: "high", label: "عالية", color: "#ef4444", description: "عاجل ومهم" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.subject.trim()) {
      newErrors.subject = "عنوان التذكرة مطلوب"
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "العنوان يجب أن يكون 5 أحرف على الأقل"
    }

    if (!formData.category) {
      newErrors.category = "يرجى اختيار فئة المشكلة"
    }

    if (!formData.description.trim()) {
      newErrors.description = "وصف المشكلة مطلوب"
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "وصف المشكلة يجب أن يكون 20 حرف على الأقل"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate ticket ID
      const ticketId = `TK-${Date.now().toString().slice(-6)}`

      alert(`تم إرسال تذكرة الدعم بنجاح!
رقم التذكرة: ${ticketId}
سيتم الرد عليك خلال 24 ساعة عمل.
يمكنك متابعة حالة التذكرة من لوحة التحكم.`)

      router.push("/dashboard")
    } catch (error) {
      alert("حدث خطأ أثناء إرسال التذكرة. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => {
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      const isValidType = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
      return isValidSize && isValidType
    })

    if (validFiles.length !== files.length) {
      alert("بعض الملفات تجاوزت الحد الأقصى للحجم (10 ميجابايت) أو نوع الملف غير مدعوم")
    }

    const totalFiles = formData.attachments.length + validFiles.length
    if (totalFiles > 5) {
      alert("يمكنك رفع 5 ملفات كحد أقصى")
      return
    }

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles],
    }))
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return "📄"
      case "doc":
      case "docx":
        return "📝"
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️"
      default:
        return "📎"
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      <RetroToggle />

      {/* Header */}
      <section className="retro-window mx-4 mt-4 mb-6">
        <div className="retro-window-title">
          <span>إنشاء تذكرة دعم جديدة - نحن هنا لمساعدتك</span>
        </div>
        <div className="p-4">
          <Link href="/help" className="retro-button inline-block mb-4">
            ← العودة لمركز المساعدة
          </Link>
        </div>
      </section>

      <div className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <RetroWindow title="نموذج تذكرة الدعم">
            <form onSubmit={handleSubmit} className="p-6">
              {/* User Info */}
              <RetroWindow title="معلومات المستخدم" className="mb-6 bg-gray-50">
                <div className="p-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">الاسم:</span>
                      <span className="font-semibold" style={{ color: "var(--ink)" }}>
                        {user?.name || "غير محدد"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span className="font-semibold" style={{ color: "var(--ink)" }}>
                        {user?.email || "غير محدد"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">التخصص:</span>
                      <span className="font-semibold" style={{ color: "var(--ink)" }}>
                        {user?.major || "غير محدد"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">نوع الاشتراك:</span>
                      <span className="font-semibold" style={{ color: "var(--ink)" }}>
                        {user?.subscription?.tier || "مجاني"}
                      </span>
                    </div>
                  </div>
                </div>
              </RetroWindow>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                    عنوان التذكرة *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="مثال: لا أستطيع الوصول لحسابي"
                    className={`retro-input w-full ${errors.subject ? "border-red-500" : ""}`}
                    maxLength={100}
                  />
                  {errors.subject && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{formData.subject.length}/100 حرف</p>
                </div>

                {/* Category and Priority */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      فئة المشكلة *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className={`retro-input w-full ${errors.category ? "border-red-500" : ""}`}
                    >
                      <option value="">اختر فئة المشكلة</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      الأولوية
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
                      className="retro-input w-full"
                    >
                      {priorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label} - {priority.description}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: priorities.find((p) => p.value === formData.priority)?.color }}
                      />
                      <span className="text-xs text-gray-600">
                        {priorities.find((p) => p.value === formData.priority)?.description}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                    وصف المشكلة بالتفصيل *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="يرجى وصف المشكلة بالتفصيل:
• متى حدثت المشكلة؟
• ما الخطوات التي اتخذتها؟
• هل تكررت المشكلة؟
• أي معلومات إضافية قد تساعد في الحل"
                    rows={8}
                    className={`retro-input w-full resize-none ${errors.description ? "border-red-500" : ""}`}
                    maxLength={1000}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">{formData.description.length}/1000 حرف</p>
                </div>

                {/* File Attachments */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                    المرفقات (اختياري)
                  </label>
                  <div className="retro-window border-2 border-dashed border-gray-300 p-6 text-center bg-gray-50">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600 mb-2">اسحب الملفات هنا أو اضغط للاختيار</p>
                    <p className="text-gray-500 text-sm mb-4">
                      الأنواع المدعومة: JPG, PNG, PDF, DOC, DOCX
                      <br />
                      الحد الأقصى: 5 ملفات، 10 ميجابايت لكل ملف
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="retro-button bg-transparent"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      اختيار الملفات
                    </Button>
                  </div>

                  {/* Uploaded Files */}
                  {formData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                        الملفات المرفقة ({formData.attachments.length}/5):
                      </h4>
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white retro-window">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{getFileIcon(file.name)}</span>
                            <div>
                              <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} ميجابايت</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:bg-red-50 p-1"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Section */}
              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <div className="bg-blue-50 retro-window p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">معلومات مهمة</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• سيتم الرد على تذكرتك خلال 24 ساعة عمل</li>
                        <li>• ستصلك رسالة تأكيد على بريدك الإلكتروني</li>
                        <li>• يمكنك متابعة حالة التذكرة من لوحة التحكم</li>
                        <li>• للاستفسارات العاجلة، تواصل معنا مباشرة</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="retro-button flex-1"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "إرسال التذكرة"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="retro-button bg-transparent"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </form>
          </RetroWindow>
        </div>
      </div>
    </div>
  )
}
