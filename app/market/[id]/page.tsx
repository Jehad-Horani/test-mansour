"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { Badge } from "@/app/components/ui/badge"
import { 
  ArrowRight, 
  Heart, 
  Share2, 
  ShoppingCart,
  MessageCircle,
  User,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface Book {
  id: string
  title: string
  author: string
  isbn?: string
  edition?: string
  publisher?: string
  publication_year?: number
  subject_name: string
  course_code?: string
  university_name: string
  college: string
  major: string
  description?: string
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
  original_price?: number
  selling_price: number
  currency: string
  is_available: boolean
  seller_id: string
  approval_status: 'pending' | 'approved' | 'rejected'
  created_at: string
  book_images: Array<{
    id: string
    image_url: string
    is_primary: boolean
  }>
  seller: {
    name: string
    avatar_url?: string
    university?: string
    phone?: string
    email?: string
  }
}

export default function BookDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoggedIn } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)

useEffect(() => {
  if (params?.id) {
    fetchBook(params.id as string)
  }
}, [params])


  const fetchBook = async (bookId: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/books/${bookId}`)
      const data = await res.json()
      
      if (res.ok) {
        setBook(data)
      } else {
        console.error("Error fetching book:", data.error)
        toast.error("الكتاب غير موجود")
        router.push('/market')
      }
    } catch (error) {
      console.error("Error fetching book:", error)
      toast.error("خطأ في تحميل تفاصيل الكتاب")
      router.push('/market')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    if (!isLoggedIn) {
      toast.error("يجب تسجيل الدخول أولاً")
      router.push('/auth')
      return
    }

    if (!book) return

    if (book.seller_id === user?.id) {
      toast.error("لا يمكنك إضافة كتابك الخاص إلى السلة")
      return
    }

    try {
      setAddingToCart(true)
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          quantity: 1
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("تم إضافة الكتاب إلى السلة")
      } else {
        console.error("Error adding to cart:", data.error)
        toast.error(data.error || "خطأ في إضافة الكتاب إلى السلة")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("خطأ في الاتصال")
    } finally {
      setAddingToCart(false)
    }
  }

  const getConditionText = (condition: string) => {
    const conditionMap: Record<string, string> = {
      'new': 'جديد',
      'excellent': 'ممتاز',
      'good': 'جيد',
      'fair': 'مقبول',
      'poor': 'ضعيف'
    }
    return conditionMap[condition] || condition
  }

  const getConditionColor = (condition: string) => {
    const colorMap: Record<string, string> = {
      'new': 'bg-green-100 text-green-800',
      'excellent': 'bg-blue-100 text-blue-800',
      'good': 'bg-yellow-100 text-yellow-800',
      'fair': 'bg-orange-100 text-orange-800',
      'poor': 'bg-red-100 text-red-800'
    }
    return colorMap[condition] || 'bg-gray-100 text-gray-800'
  }

  const nextImage = () => {
    if (book?.book_images && book.book_images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % book.book_images.length)
    }
  }

  const prevImage = () => {
    if (book?.book_images && book.book_images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? book.book_images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <div className="max-w-6xl mx-auto">
          <RetroWindow title="تحميل تفاصيل الكتاب">
            <div className="text-center py-12">
              <div className="text-gray-600">جاري تحميل تفاصيل الكتاب...</div>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <div className="max-w-6xl mx-auto">
          <RetroWindow title="الكتاب غير موجود">
            <div className="text-center py-12">
              <div className="text-gray-600 mb-4">الكتاب المطلوب غير موجود</div>
              <Button asChild className="retro-button">
                <Link href="/market">العودة للسوق</Link>
              </Button>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  const images = book.book_images || []
  const currentImage = images[currentImageIndex]

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent mb-4">
            <Link href="/market">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للسوق
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <RetroWindow title="صور الكتاب">
              <div className="p-4">
                <div className="relative">
                  <img
                    src={currentImage?.image_url || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-96 object-cover bg-gray-200 rounded"
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 retro-button bg-white bg-opacity-80 p-2"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 retro-button bg-white bg-opacity-80 p-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                
                {images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {images.map((image, index) => (
                      <img
                        key={image.id}
                        src={image.image_url}
                        alt={`${book.title} - ${index + 1}`}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-20 h-20 object-cover bg-gray-200 rounded cursor-pointer border-2 ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </RetroWindow>

            {/* Description */}
            <RetroWindow title="وصف الكتاب" className="mt-6">
              <div className="p-4">
                <p className="text-gray-700 leading-relaxed">
                  {book.description || "لا يوجد وصف متاح لهذا الكتاب."}
                </p>
              </div>
            </RetroWindow>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Book Info */}
            <RetroWindow title="معلومات الكتاب">
              <div className="p-4 space-y-4">
                <h1 className="text-2xl font-bold text-black">{book.title}</h1>
                <p className="text-lg text-gray-700">بقلم: {book.author}</p>
                
                <div className="flex items-center gap-2">
                  <Badge className={getConditionColor(book.condition)}>
                    {getConditionText(book.condition)}
                  </Badge>
                  {!book.is_available && (
                    <Badge className="bg-red-100 text-red-800">غير متوفر</Badge>
                  )}
                </div>

                <div className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
                  {book.selling_price} {book.currency}
                  {book.original_price && book.original_price > book.selling_price && (
                    <span className="text-lg text-gray-500 line-through ml-2">
                      {book.original_price} {book.currency}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span><strong>المادة:</strong> {book.subject_name}</span>
                  </div>
                  {book.course_code && (
                    <div><strong>رمز المادة:</strong> {book.course_code}</div>
                  )}
                  <div><strong>الجامعة:</strong> {book.university_name}</div>
                  <div><strong>الكلية:</strong> {book.college}</div>
                  <div><strong>التخصص:</strong> {book.major}</div>
                  {book.isbn && (
                    <div><strong>ISBN:</strong> {book.isbn}</div>
                  )}
                  {book.edition && (
                    <div><strong>الطبعة:</strong> {book.edition}</div>
                  )}
                  {book.publisher && (
                    <div><strong>الناشر:</strong> {book.publisher}</div>
                  )}
                  {book.publication_year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span><strong>سنة النشر:</strong> {book.publication_year}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  {book.is_available && book.seller_id !== user?.id && (
                    <Button
                      onClick={addToCart}
                      disabled={addingToCart || !isLoggedIn}
                      className="retro-button flex-1"
                      style={{ background: "var(--accent)", color: "white" }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {addingToCart ? "جاري الإضافة..." : "أضف للسلة"}
                    </Button>
                  )}
                  
                  <Button variant="outline" className="retro-button bg-transparent">
                    <Heart className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="outline" className="retro-button bg-transparent">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </RetroWindow>

            {/* Seller Info */}
            <RetroWindow title="بيانات البائع">
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {book?.seller?.avatar_url ? (
                      <img 
                        src={book?.seller?.avatar_url} 
                        alt={book.seller.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">{book.seller.name}</h3>
                    {book.seller.university && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {book.seller.university}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    asChild
                    className="retro-button flex-1"
                    style={{ background: "var(--primary)", color: "white" }}
                  >
                    <Link href={`/messages/new?user=${book.seller_id}&book=${book.id}`}>
                      <MessageCircle className="w-4 h-4 mr-1" />
                      تواصل مع البائع
                    </Link>
                  </Button>
                </div>

                <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded">
                  تم نشر الإعلان في {new Date(book.created_at).toLocaleDateString('ar-SA')}
                </div>
              </div>
            </RetroWindow>

            {/* Safety Tips */}
            <RetroWindow title="نصائح الأمان">
              <div className="p-4 text-sm text-gray-600 space-y-2">
                <p>• تأكد من حالة الكتاب قبل الشراء</p>
                <p>• اتفق على مكان آمن للقاء</p>
                <p>• افحص الكتاب جيداً قبل الدفع</p>
                <p>• احتفظ بالإيصالات والمراسلات</p>
                <p>• أبلغ عن أي مشكلة فوراً</p>
              </div>
            </RetroWindow>
          </div>
        </div>
      </div>
    </div>
  )
}