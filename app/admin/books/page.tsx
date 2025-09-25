"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import { Badge } from "@/app/components/ui/badge"
import Link from "next/link"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  ArrowRight,
  Search,
  Filter
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { marketplaceApi, type Book } from "@/lib/supabase/marketplace"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AdminBooksPage() {
  const { user, isLoggedIn, isAdmin } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [pendingBooks, setPendingBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [processingBookId, setProcessingBookId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth')
      return
    }

    if (!isAdmin()) {
      toast.error("غير مصرح لك بالوصول لهذه الصفحة")
      router.push('/dashboard')
      return
    }

    loadPendingBooks()

    // Real-time updates for new book submissions
    const channel = supabase
      .channel('admin-books-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'books' },
        (payload) => {
          console.log('New book submitted:', payload)
          loadPendingBooks()
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'books' },
        (payload) => {
          console.log('Book updated:', payload)
          loadPendingBooks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isLoggedIn, user])

  const loadPendingBooks = async () => {
    try {
      setLoading(true)
      const { data, error } = await marketplaceApi.getPendingBooks()
      
      if (error) throw error
      setPendingBooks(data || [])
    } catch (error: any) {
      console.error("Error loading pending books:", error)
      toast.error("حدث خطأ أثناء تحميل الكتب")
    } finally {
      setLoading(false)
    }
  }

  const approveBook = async (bookId: string) => {
    if (!confirm("هل أنت متأكد من قبول هذا الكتاب؟")) return

    try {
      setProcessingBookId(bookId)
      const { error } = await marketplaceApi.approveBook(bookId, user!.id)
      
      if (error) throw error
      
      toast.success("تم قبول الكتاب بنجاح")
      setPendingBooks(prev => prev.filter(book => book.id !== bookId))
    } catch (error: any) {
      console.error("Error approving book:", error)
      toast.error("حدث خطأ أثناء قبول الكتاب")
    } finally {
      setProcessingBookId(null)
    }
  }

  const rejectBook = async (bookId: string) => {
    const reason = prompt("يرجى إدخال سبب رفض الكتاب:")
    if (!reason) return

    try {
      setProcessingBookId(bookId)
      const { error } = await marketplaceApi.rejectBook(bookId, user!.id, reason)
      
      if (error) throw error
      
      toast.success("تم رفض الكتاب")
      setPendingBooks(prev => prev.filter(book => book.id !== bookId))
    } catch (error: any) {
      console.error("Error rejecting book:", error)
      toast.error("حدث خطأ أثناء رفض الكتاب")
    } finally {
      setProcessingBookId(null)
    }
  }

  const filteredBooks = pendingBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
      new: "جديد",
      excellent: "ممتاز", 
      good: "جيد",
      fair: "مقبول",
      poor: "ضعيف"
    }
    return labels[condition] || condition
  }

  const getMajorLabel = (major: string) => {
    const labels: Record<string, string> = {
      law: "القانون",
      it: "تقنية المعلومات",
      medical: "الطب", 
      business: "إدارة الأعمال"
    }
    return labels[major] || major
  }

  if (!isLoggedIn || !isAdmin()) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="غير مصرح">
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">غير مصرح لك بالوصول لهذه الصفحة</p>
            <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
              <Link href="/auth">تسجيل الدخول</Link>
            </Button>
          </div>
        </RetroWindow>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <RetroWindow title="مراجعة الكتب">
          <div className="p-6 text-center">
            <p className="text-gray-600">جاري تحميل الكتب المعلقة...</p>
          </div>
        </RetroWindow>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent mb-4">
            <Link href="/admin">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للوحة التحكم
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--ink)" }}>
            مراجعة الكتب المعلقة
          </h1>
          <p className="text-gray-600">مراجعة وقبول أو رفض الكتب المرسلة من الطلاب</p>
        </div>

        {/* Search and Filters */}
        <RetroWindow title="البحث والفلاتر">
          <div className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="البحث في الكتب..." 
                  className="retro-button pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="retro-button bg-transparent">
                <Filter className="w-4 h-4 ml-2" />
                فلاتر متقدمة
              </Button>
            </div>
          </div>
        </RetroWindow>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-6">
          <RetroWindow title="إجمالي الكتب المعلقة">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">{pendingBooks.length}</div>
              <p className="text-sm text-gray-600">كتاب في الانتظار</p>
            </div>
          </RetroWindow>
          
          <RetroWindow title="الكتب المفلترة">
            <div className="p-4 text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
                {filteredBooks.length}
              </div>
              <p className="text-sm text-gray-600">نتيجة البحث</p>
            </div>
          </RetroWindow>

          <RetroWindow title="الإجراءات السريعة">
            <div className="p-4">
              <Button 
                className="retro-button w-full mb-2" 
                style={{ background: "var(--accent)", color: "white" }}
                onClick={loadPendingBooks}
              >
                تحديث القائمة
              </Button>
            </div>
          </RetroWindow>
        </div>

        {/* Books List */}
        <RetroWindow title={`الكتب المعلقة (${filteredBooks.length})`}>
          <div className="p-6">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                {pendingBooks.length === 0 ? (
                  <>
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <p className="text-gray-600 text-lg">ممتاز! لا توجد كتب في الانتظار</p>
                    <p className="text-gray-500 text-sm mt-2">جميع الكتب تمت مراجعتها</p>
                  </>
                ) : (
                  <>
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">لا توجد نتائج للبحث "{searchTerm}"</p>
                    <Button 
                      variant="outline" 
                      className="retro-button bg-transparent mt-4"
                      onClick={() => setSearchTerm("")}
                    >
                      مسح البحث
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="retro-window bg-white">
                    <div className="p-6">
                      <div className="grid lg:grid-cols-4 gap-6">
                        {/* Book Image */}
                        <div>
                          <img
                            src={book.images?.[0]?.image_url || "/placeholder.svg"}
                            alt={book.title}
                            className="w-full h-48 object-cover bg-gray-200 rounded"
                          />
                          <div className="mt-2 text-center">
                            <Badge 
                              variant={book.condition === 'new' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {getConditionLabel(book.condition)}
                            </Badge>
                          </div>
                        </div>

                        {/* Book Details */}
                        <div className="lg:col-span-2">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold mb-2">{book.title}</h3>
                            <p className="text-gray-600 mb-1"><strong>المؤلف:</strong> {book.author}</p>
                            <p className="text-gray-600 mb-1"><strong>البائع:</strong> {book.seller?.name}</p>
                            <p className="text-gray-600 mb-1"><strong>الجامعة:</strong> {book.university_name}</p>
                            <p className="text-gray-600 mb-1"><strong>التخصص:</strong> {getMajorLabel(book.major)}</p>
                            <p className="text-gray-600 mb-1"><strong>المادة:</strong> {book.subject_name}</p>
                            {book.course_code && (
                              <p className="text-gray-600 mb-1"><strong>رقم المادة:</strong> {book.course_code}</p>
                            )}
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center gap-4">
                              <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                                {book.selling_price} {book.currency}
                              </div>
                              {book.original_price && (
                                <div className="text-gray-500 line-through">
                                  {book.original_price} {book.currency}
                                </div>
                              )}
                            </div>
                          </div>

                          {book.description && (
                            <div className="mb-4">
                              <h4 className="font-semibold mb-2">الوصف:</h4>
                              <p className="text-gray-600 text-sm">{book.description}</p>
                            </div>
                          )}

                          <div className="text-xs text-gray-500">
                            <p>تاريخ الإرسال: {new Date(book.created_at).toLocaleDateString('ar-SA')}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                          <Button
                            asChild
                            className="retro-button"
                            style={{ background: "var(--primary)", color: "white" }}
                          >
                            <Link href={`/market/${book.id}`} target="_blank">
                              <Eye className="w-4 h-4 ml-2" />
                              معاينة التفاصيل
                            </Link>
                          </Button>

                          <Button
                            className="retro-button"
                            style={{ background: "green", color: "white" }}
                            onClick={() => approveBook(book.id)}
                            disabled={processingBookId === book.id}
                          >
                            <CheckCircle className="w-4 h-4 ml-2" />
                            {processingBookId === book.id ? "جاري القبول..." : "قبول الكتاب"}
                          </Button>

                          <Button
                            variant="outline"
                            className="retro-button text-red-600 border-red-600 bg-transparent"
                            onClick={() => rejectBook(book.id)}
                            disabled={processingBookId === book.id}
                          >
                            <XCircle className="w-4 h-4 ml-2" />
                            {processingBookId === book.id ? "جاري الرفض..." : "رفض الكتاب"}
                          </Button>

                          <div className="mt-4 p-3 bg-gray-50 rounded">
                            <h5 className="font-semibold text-xs mb-1">معلومات البائع:</h5>
                            <p className="text-xs text-gray-600">{book.seller?.name}</p>
                            <p className="text-xs text-gray-600">{book.seller?.university}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}