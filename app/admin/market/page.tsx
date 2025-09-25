"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/contexts/user-context"
import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { 
  Package,
  User,
  Clock,
  Check,
  X,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { toast } from "sonner"

interface Book {
  id: string
  title: string
  author: string
  subject_name: string
  university_name: string
  major: string
  condition: string
  selling_price: number
  currency: string
  approval_status: 'pending' | 'approved' | 'rejected'
  created_at: string
  rejection_reason?: string
  seller: {
    name: string
    email: string
    university?: string
    phone?: string
  }
  book_images: Array<{
    id: string
    image_url: string
    is_primary: boolean
  }>
}

export default function AdminMarketPage() {
  const { isLoggedIn, isAdmin } = useUserContext()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  })
  const [updating, setUpdating] = useState<string | null>(null)
  const [rejectionModal, setRejectionModal] = useState<{ bookId: string; title: string } | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      router.push('/')
      return
    }
    fetchBooks()
  }, [isLoggedIn, isAdmin, router, filter, page])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        status: filter,
        page: page.toString(),
        limit: '20'
      })
      
      const res = await fetch(`/api/admin/books?${params}`)
      const data = await res.json()
      
      if (res.ok) {
        setBooks(data.books || [])
        setPagination(data.pagination)
      } else {
        console.error("Error fetching books:", data.error)
        toast.error("خطأ في جلب الكتب")
      }
    } catch (error) {
      console.error("Error fetching books:", error)
      toast.error("خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (bookId: string) => {
    if (!confirm('هل تريد الموافقة على هذا الكتاب؟')) return

    try {
      setUpdating(bookId)
      const res = await fetch('/api/admin/books', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          action: 'approve'
        })
      })

      const data = await res.json()

      if (res.ok) {
        setBooks(prev => prev.map(book => 
          book.id === bookId ? { ...book, approval_status: 'approved' } : book
        ))
        toast.success("تم قبول الكتاب بنجاح")
      } else {
        console.error("Error approving book:", data.error)
        toast.error("خطأ في قبول الكتاب")
      }
    } catch (error) {
      console.error("Error approving book:", error)
      toast.error("خطأ في الاتصال")
    } finally {
      setUpdating(null)
    }
  }

  const handleReject = async () => {
    if (!rejectionModal || !rejectionReason.trim()) return

    try {
      setUpdating(rejectionModal.bookId)
      const res = await fetch('/api/admin/books', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: rejectionModal.bookId,
          action: 'reject',
          reason: rejectionReason
        })
      })

      const data = await res.json()

      if (res.ok) {
        setBooks(prev => prev.map(book => 
          book.id === rejectionModal.bookId 
            ? { ...book, approval_status: 'rejected', rejection_reason: rejectionReason } 
            : book
        ))
        toast.success("تم رفض الكتاب")
        setRejectionModal(null)
        setRejectionReason("")
      } else {
        console.error("Error rejecting book:", data.error)
        toast.error("خطأ في رفض الكتاب")
      }
    } catch (error) {
      console.error("Error rejecting book:", error)
      toast.error("خطأ في الاتصال")
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (bookId: string, title: string) => {
    if (!confirm(`هل تريد حذف كتاب "${title}" نهائياً؟`)) return

    try {
      setUpdating(bookId)
      const res = await fetch('/api/admin/books', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId })
      })

      const data = await res.json()

      if (res.ok) {
        setBooks(prev => prev.filter(book => book.id !== bookId))
        toast.success("تم حذف الكتاب")
      } else {
        console.error("Error deleting book:", data.error)
        toast.error("خطأ في حذف الكتاب")
      }
    } catch (error) {
      console.error("Error deleting book:", error)
      toast.error("خطأ في الاتصال")
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار'
      case 'approved': return 'مقبول'
      case 'rejected': return 'مرفوض'
      default: return status
    }
  }

  if (!isLoggedIn || !isAdmin()) {
    return null
  }

  return (
    <div className="min-h-screen bg-retro-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <RetroWindow title="إدارة السوق">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-black">إدارة السوق</h1>
                <div className="flex gap-2">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1 text-sm border border-gray-400 ${
                        filter === status ? "bg-retro-accent text-white" : "bg-white text-black hover:bg-gray-50"
                      }`}
                    >
                      {status === 'all' ? 'الكل' : getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-yellow-50 border border-yellow-200 p-3 text-center">
                  <div className="text-lg font-bold text-yellow-800">
                    {books.filter(b => b.approval_status === 'pending').length}
                  </div>
                  <div className="text-sm text-yellow-600">في الانتظار</div>
                </div>
                <div className="bg-green-50 border border-green-200 p-3 text-center">
                  <div className="text-lg font-bold text-green-800">
                    {books.filter(b => b.approval_status === 'approved').length}
                  </div>
                  <div className="text-sm text-green-600">مقبول</div>
                </div>
                <div className="bg-red-50 border border-red-200 p-3 text-center">
                  <div className="text-lg font-bold text-red-800">
                    {books.filter(b => b.approval_status === 'rejected').length}
                  </div>
                  <div className="text-sm text-red-600">مرفوض</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 text-center">
                  <div className="text-lg font-bold text-blue-800">{pagination.total}</div>
                  <div className="text-sm text-blue-600">إجمالي</div>
                </div>
              </div>
            </div>
          </RetroWindow>
        </div>

        {/* Books List */}
        <RetroWindow title="قائمة الكتب">
          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : books.length === 0 ? (
              <div className="text-center py-8">لا توجد كتب</div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {books.map((book) => (
                    <div key={book.id} className="bg-white border border-gray-400 p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={book.book_images?.find(img => img.is_primary)?.image_url || "/placeholder.svg"}
                          alt={book.title}
                          className="w-16 h-20 object-cover bg-gray-200 rounded"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-black">{book.title}</h3>
                            <Badge className={getStatusColor(book.approval_status)}>
                              {getStatusText(book.approval_status)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                            <div><strong>المؤلف:</strong> {book.author}</div>
                            <div><strong>المادة:</strong> {book.subject_name}</div>
                            <div><strong>الجامعة:</strong> {book.university_name}</div>
                            <div><strong>التخصص:</strong> {book.major}</div>
                            <div><strong>الحالة:</strong> {book.condition}</div>
                            <div><strong>السعر:</strong> {book.selling_price} {book.currency}</div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              البائع: {book.seller.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(book.created_at).toLocaleDateString('ar-SA')}
                            </span>
                          </div>

                          {book.rejection_reason && (
                            <div className="bg-red-50 border border-red-200 p-2 text-sm text-red-800 mb-3">
                              <strong>سبب الرفض:</strong> {book.rejection_reason}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="retro-button bg-transparent"
                          >
                            <a href={`/market/${book.id}`} target="_blank">
                              <Eye className="w-4 h-4 mr-1" />
                              عرض
                            </a>
                          </Button>

                          {book.approval_status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(book.id)}
                                disabled={updating === book.id}
                                className="retro-button bg-green-500 text-white hover:bg-green-600"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                قبول
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => setRejectionModal({ bookId: book.id, title: book.title })}
                                disabled={updating === book.id}
                                className="retro-button bg-red-500 text-white hover:bg-red-600"
                              >
                                <X className="w-4 h-4 mr-1" />
                                رفض
                              </Button>
                            </>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(book.id, book.title)}
                            disabled={updating === book.id}
                            className="retro-button bg-transparent text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      صفحة {pagination.page} من {pagination.totalPages} ({pagination.total} كتاب)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                        className="retro-button bg-transparent"
                      >
                        <ChevronRight className="w-4 h-4" />
                        السابق
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= pagination.totalPages}
                        className="retro-button bg-transparent"
                      >
                        التالي
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </RetroWindow>
      </div>

      {/* Rejection Modal */}
      {rejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-black mb-4">رفض الكتاب</h3>
            <p className="text-gray-600 mb-4">سبب رفض كتاب "{rejectionModal.title}":</p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="اكتب سبب الرفض هنا..."
              className="w-full p-3 border border-gray-400 mb-4 h-24 resize-none"
              dir="rtl"
            />

            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setRejectionModal(null)
                  setRejectionReason("")
                }}
                variant="outline"
                className="retro-button bg-transparent"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleReject}
                disabled={!rejectionReason.trim() || updating === rejectionModal.bookId}
                className="retro-button bg-red-500 text-white hover:bg-red-600"
              >
                رفض الكتاب
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}