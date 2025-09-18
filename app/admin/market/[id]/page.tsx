"use client"

import { useState } from "react"
import { RetroWindow } from "@/components/retro-window"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Edit, Trash2, Eye, Star, Package } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminBookDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const book = {
    id: params.id,
    title: "كتاب القانون الدستوري",
    author: "د. محمد أحمد",
    price: 30,
    originalPrice: 45,
    category: "القانون",
    condition: "جديد",
    description: "كتاب شامل في القانون الدستوري يغطي جميع المواضيع الأساسية...",
    seller: "أحمد محمد",
    sellerEmail: "ahmed@example.com",
    publishDate: "2024-01-10",
    views: 245,
    rating: 4.5,
    reviews: 12,
    status: "active",
    stock: 5,
  }

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  const handleDelete = () => {
    if (confirm("هل أنت متأكد من حذف هذا الكتاب؟")) {
      // Delete logic here
      router.push("/admin/market")
    }
  }

  return (
    <div className="p-6">
      <RetroWindow title={`إدارة الكتاب #${params.id}`} className="w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.back()}
                className="retro-button"
                style={{ background: "var(--panel)", color: "var(--ink)" }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "var(--ink)" }}>
                  تفاصيل الكتاب
                </h1>
                <p className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                  إدارة وتعديل معلومات الكتاب
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="retro-button"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="retro-button"
                    style={{ background: "#dc2626", color: "white" }}
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="retro-button"
                    style={{ background: "var(--accent)", color: "white" }}
                  >
                    حفظ
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="retro-button"
                    style={{ background: "var(--panel)", color: "var(--ink)" }}
                  >
                    إلغاء
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Book Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <Eye className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--primary)" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {book.views}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                المشاهدات
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <Star className="w-6 h-6 mx-auto mb-2" style={{ color: "#f59e0b" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {book.rating}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                التقييم
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <Package className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--accent)" }} />
              <div className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
                {book.stock}
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                المخزون
              </div>
            </div>

            <div className="p-4 text-center" style={{ background: "var(--panel)", border: "2px inset var(--border)" }}>
              <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                {book.price} د.أ
              </div>
              <div className="text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                السعر الحالي
              </div>
            </div>
          </div>

          {/* Book Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  عنوان الكتاب
                </label>
                {isEditing ? (
                  <Input defaultValue={book.title} className="retro-input" />
                ) : (
                  <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                    {book.title}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  المؤلف
                </label>
                {isEditing ? (
                  <Input defaultValue={book.author} className="retro-input" />
                ) : (
                  <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                    {book.author}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                    السعر (د.أ)
                  </label>
                  {isEditing ? (
                    <Input type="number" defaultValue={book.price} className="retro-input" />
                  ) : (
                    <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                      {book.price} د.أ
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                    المخزون
                  </label>
                  {isEditing ? (
                    <Input type="number" defaultValue={book.stock} className="retro-input" />
                  ) : (
                    <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                      {book.stock}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  التصنيف
                </label>
                {isEditing ? (
                  <select className="retro-input w-full" defaultValue={book.category}>
                    <option value="القانون">القانون</option>
                    <option value="تكنولوجيا المعلومات">تكنولوجيا المعلومات</option>
                    <option value="إدارة الأعمال">إدارة الأعمال</option>
                  </select>
                ) : (
                  <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                    {book.category}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  البائع
                </label>
                <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                  {book.seller}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  البريد الإلكتروني
                </label>
                <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                  {book.sellerEmail}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  الحالة
                </label>
                {isEditing ? (
                  <select className="retro-input w-full" defaultValue={book.condition}>
                    <option value="جديد">جديد</option>
                    <option value="مستعمل - ممتاز">مستعمل - ممتاز</option>
                    <option value="مستعمل - جيد">مستعمل - جيد</option>
                    <option value="مستعمل - مقبول">مستعمل - مقبول</option>
                  </select>
                ) : (
                  <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                    {book.condition}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  حالة النشر
                </label>
                {isEditing ? (
                  <select className="retro-input w-full" defaultValue={book.status}>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="pending">في الانتظار</option>
                  </select>
                ) : (
                  <div className="p-2" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                    {book.status === "active" ? "نشط" : book.status === "inactive" ? "غير نشط" : "في الانتظار"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
              الوصف
            </label>
            {isEditing ? (
              <textarea
                defaultValue={book.description}
                className="retro-input w-full h-32"
                placeholder="وصف الكتاب..."
              />
            ) : (
              <div className="p-4" style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                {book.description}
              </div>
            )}
          </div>
        </div>
      </RetroWindow>
    </div>
  )
}
