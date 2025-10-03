"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import Link from "next/link"
import { Save, ArrowRight, Upload, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { marketplaceApi } from "@/lib/supabase/marketplace"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface UploadStatus {
  canUpload: boolean
  subscriptionTier: string | null
  uploadsThisMonth: number
  maxUploads: number
}

export default function SellBookPage() {
  const { user, isLoggedIn, profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checkingLimit, setCheckingLimit] = useState(true)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    canUpload: false,
    subscriptionTier: null,
    uploadsThisMonth: 0,
    maxUploads: 1,
  })
  
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

  const supabase = createClient()

  useEffect(() => {
    if (isLoggedIn) {
      checkUploadLimit()
    }
  }, [isLoggedIn])

  const checkUploadLimit = async (): Promise<UploadStatus> => {
    try {
      setCheckingLimit(true)
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        router.push("/login")
        return { 
          canUpload: false, 
          subscriptionTier: null, 
          uploadsThisMonth: 0,
          maxUploads: 1 
        }
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", currentUser.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        return { 
          canUpload: false, 
          subscriptionTier: null, 
          uploadsThisMonth: 0,
          maxUploads: 1 
        }
      }

      const tier = profile?.subscription_tier || "free"

      // Premium users have unlimited uploads
      if (tier !== "free") {
        const status = { 
          canUpload: true, 
          subscriptionTier: tier, 
          uploadsThisMonth: 0,
          maxUploads: 999 // Unlimited for premium
        }
        setUploadStatus(status)
        return status
      }

      // For free users, check monthly upload count (MAX 1 per month)
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: uploads, error: uploadsError } = await supabase
        .from("booksUpload")
        .select("id")
        .eq("user_id", currentUser.id)
        .gte("created_at", startOfMonth.toISOString())

      if (uploadsError) {
        console.error("Error fetching uploads:", uploadsError)
        return { 
          canUpload: false, 
          subscriptionTier: tier, 
          uploadsThisMonth: 0,
          maxUploads: 1 
        }
      }

      const uploadCount = uploads?.length || 0
      const canUpload = uploadCount < 1

      const status = { 
        canUpload, 
        subscriptionTier: tier, 
        uploadsThisMonth: uploadCount,
        maxUploads: 1 
      }
      setUploadStatus(status)
      return status
    } catch (error) {
      console.error("Error checking upload limit:", error)
      const status = { 
        canUpload: false, 
        subscriptionTier: null, 
        uploadsThisMonth: 0,
        maxUploads: 1 
      }
      setUploadStatus(status)
      return status
    } finally {
      setCheckingLimit(false)
    }
  }

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

    // Re-check upload limit before submitting
    const currentStatus = await checkUploadLimit()
    
    if (!currentStatus.canUpload) {
      if (currentStatus.subscriptionTier === "free") {
        toast.error(
          `لقد وصلت لحد رفع الكتب لهذا الشهر (${currentStatus.uploadsThisMonth}/${currentStatus.maxUploads}). ` +
          "يمكنك الترقية للاشتراك المميز لرفع عدد غير محدود من الكتب.",
          { duration: 5000 }
        )
      } else {
        toast.error("حدث خطأ في التحقق من حالة الاشتراك. يرجى المحاولة مرة أخرى.")
      }
      return
    }

    // Validation
    if (!form.title || !form.author || !form.subject_name || !form.selling_price) {
      toast.error("يرجى ملء الحقول المطلوبة")
      return
    }

    if (selectedImages.length === 0) {
      toast.error("يرجى إضافة صورة واحدة على الأقل للكتاب")
      return
    }

    setLoading(true)
    setUploading(true)

    try {
      const bookData = {
        ...form,
        publication_year: form.publication_year ? parseInt(form.publication_year) : undefined,
        original_price: form.original_price ? parseFloat(form.original_price) : undefined,
        selling_price: parseFloat(form.selling_price),
        seller_id: user.id,
        is_available: true
      }

      // Create book first
      const { data: book, error: bookError } = await marketplaceApi.createBook(bookData)
      
      if (bookError || !book) throw bookError || new Error("Failed to create book")
      
      // Upload images
      const uploadedImages = await uploadBookImages(book.id)
      
      // CRITICAL: Record the upload in booksUpload table for tracking
      const { error: uploadTrackError } = await supabase
        .from("booksUpload")
        .insert({
          user_id: user.id,
          book_id: book.id,
          created_at: new Date().toISOString(),
        })

      if (uploadTrackError) {
        console.error("Error tracking book upload:", uploadTrackError)
        // Don't fail the whole operation, just log it
        toast.warning("تم إنشاء الكتاب لكن حدث خطأ في تسجيل العملية")
      }

      // Show success message
      if (currentStatus.subscriptionTier === "free") {
        toast.success(
          `تم إرسال الكتاب للمراجعة! سيظهر في السوق بعد موافقة الإدارة. تم رفع ${uploadedImages.length} صورة. ` +
          "لقد استخدمت حد رفع الكتب المجاني لهذا الشهر.",
          { duration: 5000 }
        )
      } else {
        toast.success(
          `تم إرسال الكتاب للمراجعة! سيظهر في السوق بعد موافقة الإدارة. تم رفع ${uploadedImages.length} صورة.`
        )
      }

      // Redirect to market page
      router.push("/market")
      
    } catch (error: any) {
      console.error("Error creating book:", error)
      toast.error("حدث خطأ أثناء إضافة الكتاب")
    } finally {
      setLoading(false)
      setUploading(false)
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

  // Show loading state while checking limit
  if (checkingLimit) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <div className="max-w-4xl mx-auto">
          <RetroWindow title="بيع كتاب جديد">
            <div className="p-6 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">جاري التحقق من الصلاحيات...</p>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  // Show limit reached message
  if (!uploadStatus.canUpload && uploadStatus.subscriptionTier === "free") {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <div className="max-w-4xl mx-auto">
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
              <div className="bg-orange-50 border-2 border-orange-400 p-6 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-orange-600" />
                <h3 className="text-xl font-bold text-orange-800 mb-3">
                  وصلت لحد رفع الكتب المجاني
                </h3>
                <p className="text-gray-700 mb-4">
                  لقد قمت برفع {uploadStatus.uploadsThisMonth} كتاب هذا الشهر (الحد الأقصى: {uploadStatus.maxUploads} كتاب).
                </p>
                <p className="text-gray-700 mb-6">
                  يمكنك الترقية للاشتراك المميز للحصول على:
                </p>
                <ul className="text-right mb-6 inline-block">
                  <li className="text-gray-700 mb-2">✓ رفع عدد غير محدود من الكتب</li>
                  <li className="text-gray-700 mb-2">✓ تحميلات غير محدودة للملخصات والمحاضرات</li>
                  <li className="text-gray-700 mb-2">✓ أولوية في الموافقة على الكتب</li>
                  <li className="text-gray-700 mb-2">✓ دعم فني مخصص</li>
                </ul>
                <div className="flex gap-3 justify-center">
                  <Button
                    asChild
                    className="retro-button"
                    style={{ background: "var(--accent)", color: "white" }}
                  >
                    <Link href="/pricing">
                      <Upload className="w-4 h-4 ml-1" />
                      ترقية الاشتراك
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="retro-button bg-transparent"
                  >
                    <Link href="/market">العودة للسوق</Link>
                  </Button>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>
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
            {/* Upload Status Info for Free Users */}
            {uploadStatus.subscriptionTier === "free" && uploadStatus.canUpload && (
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-400">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">
                      معلومة هامة
                    </h3>
                    <p className="text-sm text-blue-700">
                      يمكنك رفع {uploadStatus.maxUploads - uploadStatus.uploadsThisMonth} كتاب هذا الشهر. 
                      بعد رفع هذا الكتاب، ستحتاج للترقية للاشتراك المميز لرفع المزيد من الكتب.
                    </p>
                  </div>
                </div>
              </div>
            )}

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

              {/* Image Upload Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
                  صور الكتاب *
                </h3>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-2">اسحب الصور هنا أو انقر للتحديد</p>
                    <p className="text-sm text-gray-500 mb-4">يمكن رفع حتى 5 صور، كل صورة أقل من 5 ميجابايت</p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="book-images"
                    />
                    <Button asChild variant="outline" className="retro-button bg-transparent">
                      <label htmlFor="book-images" className="cursor-pointer">
                        اختيار الصور
                      </label>
                    </Button>
                  </div>

                  {selectedImages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-3">الصور المحددة ({selectedImages.length}/5):</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {selectedImages.map((file, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`صورة ${index + 1}`} 
                              className="w-full h-24 object-cover rounded border"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute top-1 right-1 w-6 h-6 p-0 bg-red-500 text-white border-0"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </Button>
                            {index === 0 && (
                              <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                رئيسية
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="retro-button"
                  style={{ background: "var(--primary)", color: "white" }}
                  disabled={loading || !uploadStatus.canUpload}
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