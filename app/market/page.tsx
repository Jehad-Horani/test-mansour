"use client"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Badge } from "@/app/components/ui/badge"
import { ShoppingCart, Search, Filter, Star, ArrowRight, BookOpen, Users, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/hooks/use-cart"

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState("books")
  const [sortBy, setSortBy] = useState("popular")
  const { addToCart } = useCart()

  const handleAddToCart = (book: any) => {
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      image: book.image,
    })
  }

  const books = [
    {
      id: 1,
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
    },
    {
      id: 2,
      title: "برمجة الويب المتقدمة",
      author: "م. فاطمة علي أحمد",
      category: "تقنية",
      price: 8,
      originalPrice: 10,
      rating: 4.9,
      reviews: 89,
      image: "/programming-book-cover.png",
      condition: "جديد",
      seller: "دار النشر التقني",
      inStock: true,
      bestseller: false,
    },
    {
      id: 3,
      title: "علم التشريح البشري",
      author: "د. سارة محمد الأحمد",
      category: "طب",
      price: 9,
      originalPrice: 12,
      rating: 4.7,
      reviews: 156,
      image: "/anatomy-book-cover.jpg",
      condition: "مستعمل - ممتاز",
      seller: "أحمد الطالب",
      inStock: true,
      bestseller: true,
    },
    {
      id: 4,
      title: "إدارة المشاريع الحديثة",
      author: "د. خالد سالم",
      category: "إدارة",
      price: 6,
      originalPrice: 7,
      rating: 4.6,
      reviews: 78,
      image: "/management-book-cover.jpg",
      condition: "جديد",
      seller: "مكتبة الأعمال",
      inStock: false,
      bestseller: false,
    },
    {
      id: 5,
      title: "مبادئ المحاسبة المالية",
      author: "د. نور الدين محمد",
      category: "إدارة",
      price: 5,
      originalPrice: 7,
      rating: 4.5,
      reviews: 92,
      image: "/accounting-book-cover.jpg",
      condition: "مستعمل - جيد",
      seller: "فاطمة الطالبة",
      inStock: true,
      bestseller: false,
    },
    {
      id: 6,
      title: "أساسيات الذكاء الاصطناعي",
      author: "د. علي أحمد",
      category: "تقنية",
      price: 11,
      originalPrice: 13,
      rating: 4.9,
      reviews: 67,
      image: "/ai-book-cover.png",
      condition: "جديد",
      seller: "مكتبة التقنية",
      inStock: true,
      bestseller: true,
    },
  ]

  const usedBooks = [
    {
      id: 7,
      title: "القانون الدستوري",
      author: "د. محمد السالم",
      category: "قانون",
      price: 4,
      originalPrice: 7,
      condition: "مستعمل - جيد جداً",
      seller: "أحمد الطالب",
      university: "الجامعة الأردنية",
      contact: "ahmed@example.com",
      image: "/constitutional-law-book.jpg",
      postedDate: "2024-01-20",
    },
    {
      id: 8,
      title: "هياكل البيانات والخوارزميات",
      author: "د. فاطمة أحمد",
      category: "تقنية",
      price: 5,
      originalPrice: 9,
      condition: "مستعمل - ممتاز",
      seller: "سارة الطالبة",
      university: "جامعة العلوم والتكنولوجيا الأردنية",
      contact: "sara@example.com",
      image: "/data-structures-book.jpg",
      postedDate: "2024-01-19",
    },
  ]

  const categories = ["الكل", "قانون", "تقنية", "طب", "إدارة", "هندسة"]

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              الرئيسية
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>السوق الأكاديمي</span>
          </div>
        </div>

        <RetroWindow title="السوق الأكاديمي - الكتب والمواد التعليمية">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">السوق الأكاديمي</h1>
              <p className="text-gray-600">اكتشف أفضل الكتب والمواد التعليمية لتخصصك</p>
            </div>
            <Button asChild className="retro-button" style={{ background: "var(--accent)", color: "white" }}>
              <Link href="/market/sell">
                <BookOpen className="w-4 h-4 ml-2" />
                بيع كتابك
              </Link>
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <Button
              className={`retro-button ${activeTab === "books" ? "bg-gray-200 text-black" : "bg-transparent"}`}
              onClick={() => setActiveTab("books")}
            >
              <BookOpen className="w-4 h-4 ml-2" />
              الكتب الجديدة
            </Button>
            <Button
              className={`retro-button ${activeTab === "used" ? "bg-gray-200 text-black" : "bg-transparent"}`}
              onClick={() => setActiveTab("used")}
            >
              <Users className="w-4 h-4 ml-2" />
              كتب الطلاب المستعملة
            </Button>
          </div>

          {/* Filters */}
          <div className="retro-window bg-gray-50 mb-6">
            <div className="p-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="ابحث عن كتاب..." className="retro-button pr-10" />
                </div>
                <Select>
                  <SelectTrigger className="retro-button">
                    <SelectValue placeholder="التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="retro-button">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">الأكثر شعبية</SelectItem>
                    <SelectItem value="price-low">السعر: من الأقل للأعلى</SelectItem>
                    <SelectItem value="price-high">السعر: من الأعلى للأقل</SelectItem>
                    <SelectItem value="rating">التقييم</SelectItem>
                    <SelectItem value="newest">الأحدث</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="retro-button bg-transparent">
                  <Filter className="w-4 h-4 ml-2" />
                  فلاتر متقدمة
                </Button>
              </div>
            </div>
          </div>

          {/* Books Grid - New Books */}
          {activeTab === "books" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <div key={book.id} className="retro-window bg-white">
                  <div className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={book.image || "/placeholder.svg"}
                        alt={book.title}
                        className="w-full h-48 object-cover bg-gray-200"
                      />
                      {book.bestseller && (
                        <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">الأكثر مبيعاً</Badge>
                      )}
                      {!book.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold">نفد المخزون</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline" className="text-xs">
                        {book.category}
                      </Badge>
                      <h3 className="font-bold text-sm line-clamp-2">{book.title}</h3>
                      <p className="text-xs text-gray-600">{book.author}</p>

                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{book.rating}</span>
                        <span className="text-gray-500">({book.reviews})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold" style={{ color: "var(--primary)" }}>
                          {book.price} دينار
                        </span>
                        {book.originalPrice > book.price && (
                          <span className="text-sm text-gray-500 line-through">{book.originalPrice} دينار</span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600">الحالة: {book.condition}</p>
                      <p className="text-xs text-gray-600">البائع: {book.seller}</p>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        className="retro-button flex-1"
                        style={{ background: "var(--accent)", color: "white" }}
                        disabled={!book.inStock}
                        onClick={() => handleAddToCart(book)}
                      >
                        <ShoppingCart className="w-4 h-4 ml-1" />
                        أضف للسلة
                      </Button>
                      <Button asChild variant="outline" className="retro-button bg-transparent">
                        <Link href={`/market/${book.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Used Books Grid */}
          {activeTab === "used" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {usedBooks.map((book) => (
                <div key={book.id} className="retro-window bg-white">
                  <div className="p-4">
                    <div className="mb-4">
                      <img
                        src={book.image || "/placeholder.svg"}
                        alt={book.title}
                        className="w-full h-48 object-cover bg-gray-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline" className="text-xs">
                        {book.category}
                      </Badge>
                      <h3 className="font-bold text-sm line-clamp-2">{book.title}</h3>
                      <p className="text-xs text-gray-600">{book.author}</p>

                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold" style={{ color: "var(--primary)" }}>
                          {book.price} دينار
                        </span>
                        <span className="text-sm text-gray-500 line-through">{book.originalPrice} دينار</span>
                      </div>

                      <p className="text-xs text-gray-600">الحالة: {book.condition}</p>
                      <p className="text-xs text-gray-600">البائع: {book.seller}</p>
                      <p className="text-xs text-gray-600">الجامعة: {book.university}</p>
                      <p className="text-xs text-gray-500">
                        نُشر في: {new Date(book.postedDate).toLocaleDateString("ar-SA")}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        asChild
                        className="retro-button flex-1"
                        style={{ background: "var(--accent)", color: "white" }}
                      >
                        <Link
                          href={`/market/purchase-chat/${book.id}?seller=${encodeURIComponent(book.seller)}&bookTitle=${encodeURIComponent(book.title)}&price=${book.price}`}
                        >
                          تواصل للشراء
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="retro-button bg-transparent">
                        <Link href={`/market/used/${book.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            <Button variant="outline" className="retro-button bg-transparent">
              السابق
            </Button>
            <Button className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
              1
            </Button>
            <Button variant="outline" className="retro-button bg-transparent">
              2
            </Button>
            <Button variant="outline" className="retro-button bg-transparent">
              3
            </Button>
            <Button variant="outline" className="retro-button bg-transparent">
              التالي
            </Button>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
