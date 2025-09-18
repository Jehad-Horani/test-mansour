"use client"

import { useState } from "react"
import Link from "next/link"
import { RetroWindow } from "@/components/retro-window"

interface BookListing {
  id: string
  title: string
  author: string
  isbn?: string
  condition: "new" | "like-new" | "good" | "fair" | "poor"
  price: number
  originalPrice?: number
  category: "textbook" | "reference" | "novel" | "research" | "other"
  major: "law" | "it" | "medical" | "business" | "general"
  seller: {
    id: string
    name: string
    university: string
    rating: number
  }
  status: "pending" | "approved" | "rejected" | "sold" | "removed"
  images: string[]
  description: string
  publishDate: string
  views: number
  inquiries: number
  reports: number
  isOfficial: boolean
  stock?: number
}

export default function MarketManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "textbook" | "reference" | "novel" | "research" | "other"
  >("all")
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "approved" | "rejected" | "sold" | "removed"
  >("all")
  const [selectedMajor, setSelectedMajor] = useState<"all" | "law" | "it" | "medical" | "business" | "general">("all")
  const [showAddBookForm, setShowAddBookForm] = useState(false)
  const [selectedBooks, setSelectedBooks] = useState<string[]>([])

  // Mock book listings data
  const mockBookListings: BookListing[] = [
    {
      id: "book-1",
      title: "أساسيات القانون المدني",
      author: "د. محمد العبدالله",
      isbn: "978-603-8000-12-3",
      condition: "good",
      price: 85,
      originalPrice: 120,
      category: "textbook",
      major: "law",
      seller: {
        id: "user-law-1",
        name: "أحمد محمد السالم",
        university: "جامعة الملك سعود",
        rating: 4.5,
      },
      status: "pending",
      images: ["/law-book.png"],
      description: "كتاب في حالة جيدة، تم استخدامه لفصل دراسي واحد فقط. يحتوي على بعض الملاحظات المفيدة.",
      publishDate: "2024-01-15T10:00:00Z",
      views: 45,
      inquiries: 8,
      reports: 0,
      isOfficial: false,
    },
    {
      id: "book-2",
      title: "البرمجة بلغة Java - الإصدار الحديث",
      author: "د. فاطمة النمر",
      isbn: "978-603-8000-45-6",
      condition: "like-new",
      price: 95,
      originalPrice: 130,
      category: "textbook",
      major: "it",
      seller: {
        id: "user-it-1",
        name: "فاطمة عبدالله النمر",
        university: "جامعة الملك فهد للبترول والمعادن",
        rating: 4.8,
      },
      status: "approved",
      images: ["/programming-book.png"],
      description: "كتاب ممتاز لتعلم البرمجة بلغة Java، في حالة ممتازة تقريباً جديد.",
      publishDate: "2024-01-12T14:30:00Z",
      views: 123,
      inquiries: 15,
      reports: 0,
      isOfficial: false,
    },
    {
      id: "book-3",
      title: "أطلس التشريح البشري",
      author: "د. نورا الشهري",
      isbn: "978-603-8000-78-9",
      condition: "new",
      price: 200,
      category: "reference",
      major: "medical",
      seller: {
        id: "admin-1",
        name: "المكتبة الرسمية",
        university: "منصة تخصص",
        rating: 5.0,
      },
      status: "approved",
      images: ["/open-anatomy-book.png"],
      description: "أطلس تشريح شامل ومفصل، نسخة جديدة من المكتبة الرسمية.",
      publishDate: "2024-01-10T09:00:00Z",
      views: 234,
      inquiries: 28,
      reports: 0,
      isOfficial: true,
      stock: 15,
    },
    {
      id: "book-4",
      title: "مبادئ إدارة الأعمال الحديثة",
      author: "د. خالد الأحمد",
      isbn: "978-603-8000-91-2",
      condition: "fair",
      price: 60,
      originalPrice: 110,
      category: "textbook",
      major: "business",
      seller: {
        id: "user-bus-1",
        name: "خالد الأحمد",
        university: "جامعة الملك عبدالعزيز",
        rating: 4.2,
      },
      status: "rejected",
      images: ["/management-book.png"],
      description: "كتاب مستعمل، يحتوي على ملاحظات كثيرة وبعض الصفحات مطوية.",
      publishDate: "2024-01-08T16:45:00Z",
      views: 67,
      inquiries: 3,
      reports: 2,
      isOfficial: false,
    },
  ]

  const filteredBooks = mockBookListings.filter((book) => {
    const categoryMatch = selectedCategory === "all" || book.category === selectedCategory
    const statusMatch = selectedStatus === "all" || book.status === selectedStatus
    const majorMatch = selectedMajor === "all" || book.major === selectedMajor
    return categoryMatch && statusMatch && majorMatch
  })

  const handleBookAction = (bookId: string, action: "approve" | "reject" | "remove" | "feature") => {
    console.log(`[v0] Book action: ${action} for book: ${bookId}`)
    // Here you would implement the actual book management actions
  }

  const handleBulkAction = (action: "approve" | "reject" | "remove") => {
    console.log(`[v0] Bulk ${action} for books:`, selectedBooks)
    setSelectedBooks([])
  }

  const toggleBookSelection = (bookId: string) => {
    setSelectedBooks((prev) => (prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]))
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      textbook: "كتاب دراسي",
      reference: "مرجع",
      novel: "رواية",
      research: "بحثي",
      other: "أخرى",
    }
    return labels[category as keyof typeof labels] || category
  }

  const getConditionLabel = (condition: string) => {
    const labels = {
      new: "جديد",
      "like-new": "شبه جديد",
      good: "جيد",
      fair: "مقبول",
      poor: "ضعيف",
    }
    return labels[condition as keyof typeof labels] || condition
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      sold: "bg-blue-100 text-blue-800",
      removed: "bg-gray-100 text-gray-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getMajorLabel = (major: string) => {
    const labels = {
      law: "القانون",
      it: "تقنية المعلومات",
      medical: "الطب",
      business: "إدارة الأعمال",
      general: "عام",
    }
    return labels[major as keyof typeof labels] || major
  }

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <RetroWindow title="إدارة السوق الأكاديمي">
          <div className="p-6">
            {/* Header Actions */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-black">الكتب والمنتجات</h2>
                <span className="text-sm text-gray-600">({filteredBooks.length} كتاب)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddBookForm(true)}
                  className="retro-button bg-green-500 text-white px-4 py-2 hover:bg-green-600"
                >
                  إضافة كتاب رسمي
                </button>
                <Link
                  href="/admin/market/analytics"
                  className="retro-button bg-purple-500 text-white px-4 py-2 hover:bg-purple-600"
                >
                  تقارير المبيعات
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black">الفئة:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                >
                  <option value="all">جميع الفئات</option>
                  <option value="textbook">كتب دراسية</option>
                  <option value="reference">مراجع</option>
                  <option value="novel">روايات</option>
                  <option value="research">بحثية</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black">الحالة:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">في الانتظار</option>
                  <option value="approved">مقبول</option>
                  <option value="rejected">مرفوض</option>
                  <option value="sold">مباع</option>
                  <option value="removed">محذوف</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black">التخصص:</label>
                <select
                  value={selectedMajor}
                  onChange={(e) => setSelectedMajor(e.target.value as any)}
                  className="px-3 py-1 border border-gray-400 bg-white text-black text-sm"
                >
                  <option value="all">جميع التخصصات</option>
                  <option value="law">القانون</option>
                  <option value="it">تقنية المعلومات</option>
                  <option value="medical">الطب</option>
                  <option value="business">إدارة الأعمال</option>
                  <option value="general">عام</option>
                </select>
              </div>

              {selectedBooks.length > 0 && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200">
                  <span className="text-sm text-black">تم تحديد {selectedBooks.length} كتاب</span>
                  <button
                    onClick={() => handleBulkAction("approve")}
                    className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600"
                  >
                    قبول الكل
                  </button>
                  <button
                    onClick={() => handleBulkAction("reject")}
                    className="retro-button bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600"
                  >
                    رفض الكل
                  </button>
                </div>
              )}
            </div>

            {/* Add Book Form */}
            {showAddBookForm && (
              <div className="mb-6 p-4 border border-gray-400 bg-gray-50">
                <h3 className="font-semibold text-black mb-4">إضافة كتاب رسمي جديد</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">عنوان الكتاب</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                      placeholder="اكتب عنوان الكتاب..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">المؤلف</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                      placeholder="اسم المؤلف..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">السعر (ريال)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">الكمية المتوفرة</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">الفئة</label>
                    <select className="w-full px-3 py-2 border border-gray-400 bg-white text-black">
                      <option value="textbook">كتاب دراسي</option>
                      <option value="reference">مرجع</option>
                      <option value="research">بحثي</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">التخصص</label>
                    <select className="w-full px-3 py-2 border border-gray-400 bg-white text-black">
                      <option value="general">عام</option>
                      <option value="law">القانون</option>
                      <option value="it">تقنية المعلومات</option>
                      <option value="medical">الطب</option>
                      <option value="business">إدارة الأعمال</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-black mb-1">وصف الكتاب</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-black"
                    rows={3}
                    placeholder="اكتب وصفاً للكتاب..."
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button className="retro-button bg-green-500 text-white px-4 py-2 hover:bg-green-600">
                    إضافة الكتاب
                  </button>
                  <button
                    onClick={() => setShowAddBookForm(false)}
                    className="retro-button bg-gray-500 text-white px-4 py-2 hover:bg-gray-600"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            {/* Books List */}
            <div className="space-y-4">
              {filteredBooks.map((book) => (
                <div key={book.id} className="border border-gray-400 bg-white">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.id)}
                        onChange={() => toggleBookSelection(book.id)}
                        className="mt-1"
                      />

                      <div className="w-16 h-20 bg-gray-200 border border-gray-400 flex items-center justify-center">
                        {book.images[0] ? (
                          <img
                            src={book.images[0] || "/placeholder.svg"}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs">صورة</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-black">{book.title}</h3>
                            <p className="text-sm text-gray-600">بواسطة: {book.author}</p>
                            {book.isbn && <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(book.status)}`}>
                              {book.status === "pending"
                                ? "في الانتظار"
                                : book.status === "approved"
                                  ? "مقبول"
                                  : book.status === "rejected"
                                    ? "مرفوض"
                                    : book.status === "sold"
                                      ? "مباع"
                                      : "محذوف"}
                            </span>
                            {book.isOfficial && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">رسمي</span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <strong>السعر:</strong> {book.price} ر.س
                            {book.originalPrice && (
                              <span className="line-through text-gray-400 mr-2">{book.originalPrice} ر.س</span>
                            )}
                          </div>
                          <div>
                            <strong>الحالة:</strong> {getConditionLabel(book.condition)}
                          </div>
                          <div>
                            <strong>الفئة:</strong> {getCategoryLabel(book.category)}
                          </div>
                          <div>
                            <strong>التخصص:</strong> {getMajorLabel(book.major)}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span>البائع: {book.seller.name}</span>
                          <span>⭐ {book.seller.rating}</span>
                          <span>👁️ {book.views}</span>
                          <span>💬 {book.inquiries}</span>
                          {book.reports > 0 && <span className="text-red-600">⚠️ {book.reports} تقارير</span>}
                          {book.stock && <span>📦 {book.stock} متوفر</span>}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{book.description}</p>

                        <div className="flex items-center gap-2">
                          {book.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleBookAction(book.id, "approve")}
                                className="retro-button bg-green-500 text-white px-3 py-1 text-sm hover:bg-green-600"
                              >
                                قبول
                              </button>
                              <button
                                onClick={() => handleBookAction(book.id, "reject")}
                                className="retro-button bg-red-500 text-white px-3 py-1 text-sm hover:bg-red-600"
                              >
                                رفض
                              </button>
                            </>
                          )}

                          <Link
                            href={`/admin/market/${book.id}`}
                            className="retro-button bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600"
                          >
                            التفاصيل
                          </Link>

                          <button
                            onClick={() => handleBookAction(book.id, "feature")}
                            className="retro-button bg-purple-500 text-white px-3 py-1 text-sm hover:bg-purple-600"
                          >
                            ترويج
                          </button>

                          <button
                            onClick={() => handleBookAction(book.id, "remove")}
                            className="retro-button bg-gray-500 text-white px-3 py-1 text-sm hover:bg-gray-600"
                          >
                            حذف
                          </button>

                          <button className="retro-button bg-orange-500 text-white px-3 py-1 text-sm hover:bg-orange-600">
                            مراسلة البائع
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="text-center py-8 text-gray-600">لا توجد كتب تطابق المعايير المحددة</div>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
