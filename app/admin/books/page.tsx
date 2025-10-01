"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/contexts/user-context"
import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import Link from "next/link"
import {
  CheckCircle,
  XCircle,
  Eye,
  ArrowRight,
  Search,
  Filter,
  Trash2,
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
  approval_status: "pending" | "approved" | "rejected"
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

export default function AdminBooksPage() {
  const { isLoggedIn, isAdmin } = useUserContext()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  })
  const [updating, setUpdating] = useState<string | null>(null)
  const [rejectionModal, setRejectionModal] = useState<{ bookId: string; title: string } | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    if (!isLoggedIn || !isAdmin()) {
      router.push("/")
      return
    }
    fetchBooks()
  }, [isLoggedIn, isAdmin, filter, page])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        status: filter,
        page: page.toString(),
        limit: "20",
      })

      const res = await fetch(`/api/admin/books?${params}`)
      const data = await res.json()

      if (res.ok) {
        setBooks(data.books || [])
        setPagination(data.pagination)
      } else {
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
    if (!confirm("هل تريد الموافقة على هذا الكتاب؟")) return
    try {
      setUpdating(bookId)
      const res = await fetch("/api/admin/books", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, action: "approve" }),
      })

      if (res.ok) {
        setBooks(prev =>
          prev.map(b => (b.id === bookId ? { ...b, approval_status: "approved" } : b))
        )
        toast.success("تم قبول الكتاب")
      } else {
        toast.error("خطأ في قبول الكتاب")
      }
    } finally {
      setUpdating(null)
    }
  }

  const handleReject = async () => {
    if (!rejectionModal || !rejectionReason.trim()) return
    try {
      setUpdating(rejectionModal.bookId)
      const res = await fetch("/api/admin/books", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: rejectionModal.bookId,
          action: "reject",
          reason: rejectionReason,
        }),
      })

      if (res.ok) {
        setBooks(prev =>
          prev.map(b =>
            b.id === rejectionModal.bookId
              ? { ...b, approval_status: "rejected", rejection_reason: rejectionReason }
              : b
          )
        )
        toast.success("تم رفض الكتاب")
        setRejectionModal(null)
        setRejectionReason("")
      } else {
        toast.error("خطأ في رفض الكتاب")
      }
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (bookId: string, title: string) => {
    if (!confirm(`هل تريد حذف كتاب "${title}" نهائياً؟`)) return
    try {
      setUpdating(bookId)
      const res = await fetch("/api/admin/books", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      })

      if (res.ok) {
        setBooks(prev => prev.filter(b => b.id !== bookId))
        toast.success("تم حذف الكتاب")
      } else {
        toast.error("خطأ في حذف الكتاب")
      }
    } finally {
      setUpdating(null)
    }
  }

  const filteredBooks = books.filter(
    b =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <RetroWindow title="مراجعة الكتب">
          <div className="p-6 text-center">جاري تحميل الكتب...</div>
        </RetroWindow>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <RetroWindow title="مراجعة الكتب">
          <div className="p-4">
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="بحث..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Button onClick={fetchBooks}>تحديث</Button>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="text-center">لا توجد كتب</div>
            ) : (
              <div className="space-y-4">
                {filteredBooks.map(book => (
                  <div key={book.id} className="bg-white border p-4">
                    <div className="flex gap-4">
                      <img
                        src={book.book_images?.find(img => img.is_primary)?.image_url || "/placeholder.svg"}
                        alt={book.title}
                        className="w-24 h-32 object-cover bg-gray-200 rounded"
                      />

                      <div className="flex-1">
                        <h3 className="font-bold">{book.title}</h3>
                        <p>المؤلف: {book.author}</p>
                        <p>البائع: {book.seller?.name}</p>
                        <p>الجامعة: {book.university_name}</p>
                        <p>التخصص: {book.major}</p>
                        <p>السعر: {book.selling_price} {book.currency}</p>
                        <Badge>{book.approval_status}</Badge>
                        {book.rejection_reason && (
                          <p className="text-red-500 text-sm">سبب الرفض: {book.rejection_reason}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button asChild size="sm" variant="outline">
                          <a href={`/market/${book.id}`} target="_blank">
                            <Eye className="w-4 h-4 mr-1" /> عرض
                          </a>
                        </Button>

                        {book.approval_status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(book.id)}
                              disabled={updating === book.id}
                              className="bg-green-500 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" /> قبول
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setRejectionModal({ bookId: book.id, title: book.title })}
                              disabled={updating === book.id}
                              className="bg-red-500 text-white"
                            >
                              <XCircle className="w-4 h-4 mr-1" /> رفض
                            </Button>
                          </>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(book.id, book.title)}
                          disabled={updating === book.id}
                          className="text-red-500 border-red-500"
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> حذف
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RetroWindow>

        {/* Modal للرفض */}
        {rejectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
              <h2 className="font-bold mb-2">رفض الكتاب: {rejectionModal.title}</h2>
              <Input
                placeholder="سبب الرفض"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setRejectionModal(null)}>
                  إلغاء
                </Button>
                <Button className="bg-red-500 text-white" onClick={handleReject}>
                  تأكيد الرفض
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
