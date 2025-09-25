"use client"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { RetroWindow } from "@/app/components/retro-window"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Badge } from "@/app/components/ui/badge"
import { ShoppingCart, Search, Filter, Star, ArrowRight, BookOpen, Users, Eye, Plus } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { marketplaceApi, type Book } from "@/lib/supabase/marketplace"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function MarketPage() {
  const { user, isLoggedIn } = useAuth()
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState("books")
  const [sortBy, setSortBy] = useState("newest")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState<string | null>(null)

  // Load books from Supabase
  const loadBooks = async () => {
    try {
      setLoading(true)
      const { data, error } = await marketplaceApi.getBooks({
        search: searchTerm || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        sortBy: sortBy as any,
        limit: 20
      })

      if (error) throw error
      setBooks(data || [])
    } catch (error: any) {
      console.error("Error loading books:", error)
      toast.error("حدث خطأ أثناء تحميل الكتب")
    } finally {
      setLoading(false)
    }
  }

  // Load books on component mount and filter changes
  useEffect(() => {
    loadBooks()
  }, [searchTerm, selectedCategory, sortBy])

  // Real-time updates for new books
  useEffect(() => {
    const channel = supabase
      .channel('books-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'books' },
        (payload) => {
          console.log('New book added:', payload)
          loadBooks() // Reload books when new ones are added
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'books' },
        (payload) => {
          console.log('Book updated:', payload)
          loadBooks() // Reload books when updated
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleAddToCart = async (book: Book) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول لإضافة الكتب للسلة")
      return
    }

    if (book.seller_id === user.id) {
      toast.error("لا يمكنك شراء كتبك الخاصة")
      return
    }

    try {
      setAdding(book.id)
      const { error } = await marketplaceApi.addToCart(user.id, book.id, 1)
      
      if (error) throw error
      
      toast.success("تم إضافة الكتاب للسلة بنجاح")
    } catch (error: any) {
      console.error("Error adding to cart:", error)
      toast.error("حدث خطأ أثناء إضافة الكتاب للسلة")
    } finally {
      setAdding(null)
    }
  }

  const categories = [
    { value: "all", label: "الكل" },
    { value: "law", label: "القانون" },
    { value: "it", label: "تقنية المعلومات" },
    { value: "medical", label: "الطب" },
    { value: "business", label: "إدارة الأعمال" },
  ]

  const sortOptions = [
    { value: "newest", label: "الأحدث" },
    { value: "oldest", label: "الأقدم" },
    { value: "price_asc", label: "السعر: من الأقل للأعلى" },
    { value: "price_desc", label: "السعر: من الأعلى للأقل" },
    { value: "popular", label: "الأكثر شعبية" },
  ]

  const getMajorLabel = (major: string) => {
    const labels: Record<string, string> = {
      law: "القانون",
      it: "تقنية المعلومات", 
      medical: "الطب",
      business: "إدارة الأعمال"
    }
    return labels[major] || major
  }

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
            <div className="flex gap-2">
              {isLoggedIn && (
                <Button asChild className="retro-button" style={{ background: "var(--accent)", color: "white" }}>
                  <Link href="/market/sell">
                    <Plus className="w-4 h-4 ml-2" />
                    بيع كتابك
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="retro-button bg-transparent">
                <Link href="/cart">
                  <ShoppingCart className="w-4 h-4 ml-2" />
                  السلة
                </Link>
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="retro-window bg-gray-50 mb-6">
            <div className="p-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="ابحث عن كتاب..." 
                    className="retro-button pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="retro-button">
                    <SelectValue placeholder="التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="retro-button">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="retro-button bg-transparent">
                  <Filter className="w-4 h-4 ml-2" />
                  فلاتر متقدمة
                </Button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">جاري تحميل الكتب...</p>
            </div>
          )}

          {/* No Results */}
          {!loading && books.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">لا توجد كتب متاحة حالياً</p>
              {isLoggedIn && (
                <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                  <Link href="/market/sell">
                    <Plus className="w-4 h-4 ml-2" />
                    أضف أول كتاب
                  </Link>
                </Button>
              )}
            </div>
          )}

          {/* Books Grid */}
          {!loading && books.length > 0 && (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  عرض {books.length} كتاب
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <div key={book.id} className="retro-window bg-white">
                    <div className="p-4">
                      <div className="relative mb-4">
                        <img
                          src={book.images?.[0]?.image_url || "/placeholder.svg"}
                          alt={book.title}
                          className="w-full h-48 object-cover bg-gray-200"
                        />
                        <Badge 
                          className="absolute top-2 right-2 text-xs"
                          variant={book.condition === 'new' ? 'default' : 'secondary'}
                        >
                          {getConditionLabel(book.condition)}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <Badge variant="outline" className="text-xs">
                          {getMajorLabel(book.major)}
                        </Badge>
                        <h3 className="font-bold text-sm line-clamp-2" title={book.title}>
                          {book.title}
                        </h3>
                        <p className="text-xs text-gray-600">{book.author}</p>

                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold" style={{ color: "var(--primary)" }}>
                            {book.selling_price} {book.currency}
                          </span>
                          {book.original_price && book.original_price > book.selling_price && (
                            <span className="text-sm text-gray-500 line-through">
                              {book.original_price} {book.currency}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-600">
                          البائع: {book.seller?.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          الجامعة: {book.university_name}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          className="retro-button flex-1"
                          style={{ background: "var(--accent)", color: "white" }}
                          disabled={!isLoggedIn || adding === book.id || book.seller_id === user?.id}
                          onClick={() => handleAddToCart(book)}
                        >
                          <ShoppingCart className="w-4 h-4 ml-1" />
                          {adding === book.id ? "جاري الإضافة..." : 
                           book.seller_id === user?.id ? "كتابك" :
                           !isLoggedIn ? "سجل دخولك" : "أضف للسلة"}
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

              {/* Load More Button - Future Enhancement */}
              <div className="text-center mt-8">
                <Button variant="outline" className="retro-button bg-transparent">
                  تحميل المزيد
                </Button>
              </div>
            </>
          )}
        </RetroWindow>
      </div>
    </div>
  )
}