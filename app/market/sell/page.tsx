"use client"

import type React from "react"

import { useState } from "react"
import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"

export default function SellPage() {
  const { isLoggedIn } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    condition: "",
    price: "",
    category: "",
    major: "",
    description: "",
    images: [] as File[],
  })

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <RetroWindow title="تسجيل الدخول مطلوب" className="w-full max-w-md">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-black">يجب تسجيل الدخول أولاً</h2>
            <p className="text-gray-700">لبيع الكتب، يجب أن تكون مسجلاً في المنصة</p>
            <div className="space-y-2">
              <Button asChild className="retro-button w-full">
                <Link href="/auth/login">تسجيل الدخول</Link>
              </Button>
              <Button asChild variant="outline" className="retro-button w-full bg-transparent">
                <Link href="/auth/register">إنشاء حساب جديد</Link>
              </Button>
            </div>
          </div>
        </RetroWindow>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert("تم إرسال طلب بيع الكتاب بنجاح! سيتم مراجعته من قبل الإدارة.")
      router.push("/market")
    }, 2000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({ ...prev, images: files }))
  }

  return (
    <div className="min-h-screen p-4">
      <RetroWindow title="بيع كتاب" className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-black mb-2">بيع كتابك المستعمل</h1>
            <p className="text-gray-700 text-sm">املأ النموذج أدناه لعرض كتابك للبيع في السوق</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">عنوان الكتاب *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل عنوان الكتاب"
                required
                className="retro-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-black">المؤلف *</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                placeholder="اسم المؤلف"
                required
                className="retro-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">رقم ISBN (اختياري)</label>
              <Input
                value={formData.isbn}
                onChange={(e) => setFormData((prev) => ({ ...prev, isbn: e.target.value }))}
                placeholder="978-1234567890"
                className="retro-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-black">السعر (ريال) *</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="0"
                required
                min="1"
                className="retro-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">التخصص *</label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, major: value }))}>
                <SelectTrigger className="retro-input">
                  <SelectValue placeholder="اختر التخصص" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="law">القانون</SelectItem>
                  <SelectItem value="it">تقنية المعلومات</SelectItem>
                  <SelectItem value="medical">الطب</SelectItem>
                  <SelectItem value="engineering">الهندسة</SelectItem>
                  <SelectItem value="business">إدارة الأعمال</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-black">حالة الكتاب *</label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, condition: value }))}>
                <SelectTrigger className="retro-input">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">ممتازة</SelectItem>
                  <SelectItem value="very-good">جيدة جداً</SelectItem>
                  <SelectItem value="good">جيدة</SelectItem>
                  <SelectItem value="fair">مقبولة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black">الفئة *</label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
              <SelectTrigger className="retro-input">
                <SelectValue placeholder="اختر فئة الكتاب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="textbook">كتاب منهجي</SelectItem>
                <SelectItem value="reference">كتاب مرجعي</SelectItem>
                <SelectItem value="workbook">كتاب تمارين</SelectItem>
                <SelectItem value="guide">دليل دراسي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black">وصف الكتاب</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="اكتب وصفاً مفصلاً عن حالة الكتاب، أي ملاحظات، أو معلومات إضافية..."
              rows={4}
              className="retro-input"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black">صور الكتاب</label>
            <Input type="file" multiple accept="image/*" onChange={handleImageUpload} className="retro-input" />
            <p className="text-xs text-gray-600">يمكنك رفع عدة صور للكتاب (الغلاف، الصفحات الداخلية، إلخ)</p>
          </div>

          <div className="retro-pane p-4 bg-blue-50">
            <h3 className="font-bold text-black mb-2">ملاحظات مهمة:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• سيتم مراجعة طلبك من قبل الإدارة قبل النشر</li>
              <li>• تأكد من دقة المعلومات المدخلة</li>
              <li>• سيتم التواصل معك عبر البريد الإلكتروني</li>
              <li>• يحق للإدارة رفض أي طلب لا يتوافق مع الشروط</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="retro-button flex-1" disabled={isSubmitting}>
              {isSubmitting ? "جاري الإرسال..." : "إرسال طلب البيع"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="retro-button bg-transparent"
              onClick={() => router.back()}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </RetroWindow>
    </div>
  )
}
