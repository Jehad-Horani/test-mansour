import { Button } from "@/components/ui/button"
import { RetroWindow } from "@/components/retro-window"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock book data - in a real app this would come from a database
const books = [
  {
    id: 1,
    title: "أساسيات القانون المدني",
    author: "د. محمد أحمد",
    price: 45,
    category: "قانون",
    image: "/law-book.png",
    description:
      "كتاب شامل يغطي أساسيات القانون المدني مع أمثلة عملية وتطبيقات من الواقع القانوني السعودي. يتضمن شرحاً مفصلاً للعقود والالتزامات والحقوق العينية.",
    pages: 450,
    language: "العربية",
    publisher: "دار النشر الأكاديمي",
    year: 2023,
    rating: 4.8,
    reviews: 127,
    isbn: "978-603-123-456-7",
  },
  {
    id: 2,
    title: "برمجة الويب المتقدمة",
    author: "م. فاطمة علي",
    price: 55,
    category: "تقنية",
    image: "/programming-book.png",
    description:
      "دليل شامل لتطوير تطبيقات الويب الحديثة باستخدام أحدث التقنيات مثل React وNode.js. يشمل مشاريع عملية ونصائح للمطورين المحترفين.",
    pages: 520,
    language: "العربية",
    publisher: "دار التقنية الحديثة",
    year: 2024,
    rating: 4.9,
    reviews: 89,
    isbn: "978-603-789-123-4",
  },
  {
    id: 3,
    title: "علم التشريح البشري",
    author: "د. سارة أحمد",
    price: 65,
    category: "طب",
    image: "/open-anatomy-book.png",
    description:
      "مرجع طبي متخصص في علم التشريح البشري مع رسوم توضيحية عالية الجودة وشرح مفصل لجميع أجهزة الجسم. مناسب لطلاب الطب والعلوم الصحية.",
    pages: 680,
    language: "العربية",
    publisher: "دار الطب العربي",
    year: 2023,
    rating: 5.0,
    reviews: 156,
    isbn: "978-603-456-789-1",
  },
  {
    id: 4,
    title: "إدارة المشاريع",
    author: "د. أحمد سالم",
    price: 40,
    category: "إدارة",
    image: "/management-book.png",
    description:
      "كتاب عملي في ��دارة المشاريع يغطي جميع مراحل المشروع من التخطيط إلى التنفيذ والمتابعة. يتضمن أدوات وتقنيات حديثة في إدارة المشاريع.",
    pages: 380,
    language: "العربية",
    publisher: "دار الإدارة الحديثة",
    year: 2024,
    rating: 4.7,
    reviews: 203,
    isbn: "978-603-321-654-9",
  },
]

export default function BookPage({ params }: { params: { id: string } }) {
  const bookId = Number.parseInt(params.id)
  const book = books.find((b) => b.id === bookId)

  if (!book) {
    notFound()
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
            <Link href="/store" className="hover:text-gray-900">
              المتجر
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>{book.title}</span>
          </div>
        </div>

        <RetroWindow title={`تفاصيل الكتاب - ${book.category}`}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Book Image */}
            <div className="retro-window bg-white">
              <div className="p-6 text-center">
                <img
                  src={book.image || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full max-w-sm mx-auto h-auto object-cover mb-4"
                />
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(book.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 mr-2">({book.reviews} تقييم)</span>
                </div>
                <Badge variant="secondary" className="mb-4">
                  {book.category}
                </Badge>
              </div>
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                  {book.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4">بواسطة {book.author}</p>
                <div className="text-3xl font-bold mb-6" style={{ color: "var(--primary)" }}>
                  {book.price} ريال
                </div>
              </div>

              <div className="retro-window bg-gray-50">
                <div className="retro-window-title">
                  <span>وصف الكتاب</span>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              </div>

              <div className="retro-window bg-white">
                <div className="retro-window-title">
                  <span>تفاصيل النشر</span>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">عدد الصفحات:</span>
                    <span>{book.pages} صفحة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">اللغة:</span>
                    <span>{book.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الناشر:</span>
                    <span>{book.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">سنة النشر:</span>
                    <span>{book.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ISBN:</span>
                    <span className="font-mono text-xs">{book.isbn}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="retro-button flex-1" style={{ background: "var(--accent)", color: "white" }}>
                  <ShoppingCart className="w-4 h-4 ml-2" />
                  أضف إلى السلة
                </Button>
                <Button asChild variant="outline" className="retro-button bg-transparent">
                  <Link href="/cart">عرض السلة</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Related Books */}
          <div className="mt-12">
            <div className="retro-window-title mb-6">
              <span>كتب ذات صلة</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {books
                .filter((b) => b.id !== book.id && b.category === book.category)
                .slice(0, 4)
                .map((relatedBook) => (
                  <Link key={relatedBook.id} href={`/store/${relatedBook.id}`}>
                    <div className="retro-window bg-white hover:shadow-lg transition-shadow">
                      <div className="p-4 text-center">
                        <img
                          src={relatedBook.image || "/placeholder.svg"}
                          alt={relatedBook.title}
                          className="w-full h-32 object-cover mb-2"
                        />
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{relatedBook.title}</h3>
                        <p className="text-xs text-gray-600 mb-2">{relatedBook.author}</p>
                        <p className="font-bold text-primary">{relatedBook.price} ريال</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
