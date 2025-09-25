"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import Link from "next/link"
import { Save, ArrowRight, Upload } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { marketplaceApi } from "@/lib/supabase/marketplace"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SellBookPage() {
  const { user, isLoggedIn, profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    edition: "",
    publisher: "",
    publication_year: "",
    subject_name: "",
    course_code: "",
    university_name: profile?.university || "",
    college: "",
    major: profile?.major || "",
    description: "",
    condition: "good",
    original_price: "",
    selling_price: "",
    currency: "JOD"
  })
  
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`الملف ${file.name} كبير جداً (أكثر من 5 ميجابايت)`)
        return false
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`الملف ${file.name} ليس صورة`)
        return false
      }
      return true
    })

    if (selectedImages.length + validFiles.length > 5) {
      toast.error("يمكن رفع 5 صور كحد أقصى")
      return
    }

    setSelectedImages(prev => [...prev, ...validFiles])
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const uploadBookImages = async (bookId: string) => {
    if (selectedImages.length === 0) return []

    const uploadPromises = selectedImages.map(async (file, index) => {
      try {
        const result = await marketplaceApi.uploadBookImage(bookId, file, index === 0)
        return result
      } catch (error) {
        console.error(`Error uploading image ${index}:`, error)
        return null
      }
    })

    const results = await Promise.all(uploadPromises)
    return results.filter(result => result !== null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً")
      return
    }

    // Validation
    if (!form.title || !form.author || !form.subject_name || !form.selling_price) {
      toast.error("يرجى ملء الحقول المطلوبة")
      return
    }

    setLoading(true)

    try {
      const bookData = {
        ...form,
        publication_year: form.publication_year ? parseInt(form.publication_year) : undefined,
        original_price: form.original_price ? parseFloat(form.original_price) : undefined,
        selling_price: parseFloat(form.selling_price),
        seller_id: user.id,
        is_available: true
      }

      const { error } = await marketplaceApi.createBook(bookData)
      
      if (error) throw error
      
      toast.success("تم إضافة الكتاب بنجاح!")
      router.push("/market")
      
    } catch (error: any) {
      console.error("Error creating book:", error)
      toast.error("حدث خطأ أثناء إضافة الكتاب")
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="بيع كتاب">
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">يجب تسجيل الدخول لبيع الكتب</p>
            <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
              <Link href="/auth">تسجيل الدخول</Link>
            </Button>
          </div>
        </RetroWindow>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent mb-4">
            <Link href="/market">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للسوق
            </Link>
          </Button>
        </div>

        <RetroWindow title="بيع كتاب جديد">
          <div className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Book Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
                  معلومات الكتاب
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">عنوان الكتاب *</label>
                    <Input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">المؤلف *</label>
                    <Input
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">رقم ISBN</label>
                    <Input
                      name="isbn"
                      value={form.isbn}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الطبعة</label>
                    <Input
                      name="edition"
                      value={form.edition}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">دار النشر</label>
                    <Input
                      name="publisher"
                      value={form.publisher}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">سنة النشر</label>
                    <Input
                      name="publication_year"
                      type="number"
                      value={form.publication_year}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
                  المعلومات الأكاديمية
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">اسم المادة *</label>
                    <Input
                      name="subject_name"
                      value={form.subject_name}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">رقم المادة</label>
                    <Input
                      name="course_code"
                      value={form.course_code}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الجامعة</label>
                    <Input
                      name="university_name"
                      value={form.university_name}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الكلية</label>
                    <Input
                      name="college"
                      value={form.college}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">التخصص</label>
                    <select
                      name="major"
                      value={form.major}
                      onChange={handleChange}
                      className="w-full p-2 retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    >
                      <option value="">اختر التخصص</option>
                      <option value="law">القانون</option>
                      <option value="it">علوم الحاسب</option>
                      <option value="medical">الطب</option>
                      <option value="business">إدارة الأعمال</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Condition & Pricing */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
                  الحالة والسعر
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">حالة الكتاب</label>
                    <select
                      name="condition"
                      value={form.condition}
                      onChange={handleChange}
                      className="w-full p-2 retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    >
                      <option value="new">جديد</option>
                      <option value="excellent">ممتاز</option>
                      <option value="good">جيد</option>
                      <option value="fair">مقبول</option>
                      <option value="poor">ضعيف</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">السعر الأصلي</label>
                    <Input
                      name="original_price"
                      type="number"
                      step="0.01"
                      value={form.original_price}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">سعر البيع *</label>
                    <Input
                      name="selling_price"
                      type="number"
                      step="0.01"
                      value={form.selling_price}
                      onChange={handleChange}
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">وصف الكتاب</label>
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full p-2 retro-window resize-none"
                  style={{ background: "white", border: "2px inset #c0c0c0" }}
                  placeholder="اكتب وصفاً مختصراً عن الكتاب وحالته..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="retro-button"
                  style={{ background: "var(--primary)", color: "white" }}
                  disabled={loading}
                >
                  <Save className="w-4 h-4 ml-1" />
                  {loading ? "جاري النشر..." : "نشر الكتاب"}
                </Button>
                <Button asChild variant="outline" className="retro-button bg-transparent">
                  <Link href="/market">إلغاء</Link>
                </Button>
              </div>
            </form>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
