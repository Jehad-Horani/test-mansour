"use client"

import { Button } from "@/components/ui/button"
import { RetroWindow } from "@/components/retro-window"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, ArrowRight, Heart, Share2, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCart } from "@/hooks/use-cart"

export default function BookDetailPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const bookId = Number.parseInt(params.id as string)

  // Mock book data - in real app, this would come from API
  const book = {
    id: bookId,
    title: "أساسيات القانون المدني",
    author: "د. محمد أحمد السالم",
    category: "قانون",
    price: 7,
    originalPrice: 9,
    rating: 4.8,
    reviews: 124,
    image: "/law-book-cover.jpg",
    condition: "جديد",
    seller: "مكتبة الجامعة",
    inStock: true,
    bestseller: true,
    description:
      "كتاب شامل يغطي أساسيات القانون المدني الأردني مع أمثلة عملية وتطبيقات قضائية. يتضمن الكتاب شرحاً مفصلاً للنظريات القانونية الأساسية والتطبيقات العملية في المحاكم الأردنية.",
    isbn: "978-9957-123-456-7",
    pages: 450,
    publisher: "دار النشر الأكاديمي",
    publishYear: 2023,
    language: "العربية",
  }

  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.image,
    })
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              الرئيسية
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/market" className="hover:text-gray-900">
              السوق
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>{book.title}</span>
          </div>
        </div>

        <RetroWindow title="تفاصيل الكتاب">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Book Image */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={book.image || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full h-96 object-cover bg-gray-200 retro-window"
                />
                {book.bestseller && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white">الأكثر مبيعاً</Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="retro-button bg-transparent flex-1">
                  <Heart className="w-4 h-4 ml-2" />
                  إضافة للمفضلة
                </Button>
                <Button variant="outline" className="retro-button bg-transparent flex-1">
                  <Share2 className="w-4 h-4 ml-2" />
                  مشاركة
                </Button>
              </div>
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-2">
                  {book.category}
                </Badge>
                <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                <p className="text-lg text-gray-600 mb-4">بواسطة {book.author}</p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-bold">{book.rating}</span>
                  </div>
                  <span className="text-gray-500">({book.reviews} تقييم)</span>
                </div>
              </div>

              <div className="retro-window bg-gray-50 p-4">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
                    {book.price} دينار
                  </span>
                  {book.originalPrice > book.price && (
                    <span className="text-xl text-gray-500 line-through">{book.originalPrice} دينار</span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <strong>الحالة:</strong> {book.condition}
                  </p>
                  <p>
                    <strong>البائع:</strong> {book.seller}
                  </p>
                  <p>
                    <strong>التوفر:</strong> {book.inStock ? "متوفر" : "نفد المخزون"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="retro-button flex-1"
                  style={{ background: "var(--accent)", color: "white" }}
                  disabled={!book.inStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  أضف للسلة
                </Button>
                <Button variant="outline" className="retro-button bg-transparent">
                  <MessageCircle className="w-5 h-5 ml-2" />
                  تواصل مع البائع
                </Button>
              </div>

              {/* Book Information */}
              <div className="retro-window bg-white p-4">
                <h3 className="font-bold mb-3">معلومات الكتاب</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <strong>ISBN:</strong> {book.isbn}
                  </div>
                  <div>
                    <strong>عدد الصفحات:</strong> {book.pages}
                  </div>
                  <div>
                    <strong>الناشر:</strong> {book.publisher}
                  </div>
                  <div>
                    <strong>سنة النشر:</strong> {book.publishYear}
                  </div>
                  <div>
                    <strong>اللغة:</strong> {book.language}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <div className="retro-window bg-white p-6">
              <h3 className="font-bold text-xl mb-4">وصف الكتاب</h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
