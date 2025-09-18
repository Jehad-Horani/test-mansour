"use client"

import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { Badge } from "@/app/components/ui/badge"
import { Mail, Phone, ArrowRight, MapPin, Calendar, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function UsedBookDetailPage() {
  const params = useParams()
  const bookId = Number.parseInt(params.id as string)

  // Mock used book data
  const book = {
    id: bookId,
    title: "القانون الدستوري",
    author: "د. محمد السالم",
    category: "قانون",
    price: 4,
    originalPrice: 7,
    condition: "مستعمل - جيد جداً",
    seller: "أحمد الطالب",
    sellerId: "ahmed-student", // Added seller ID for chat routing
    university: "الجامعة الأردنية",
    contact: "ahmed@example.com",
    phone: "+962 79 123 4567",
    image: "/constitutional-law-book.jpg",
    postedDate: "2024-01-20",
    description:
      "كتاب في حالة ممتازة، تم استخدامه لفصل دراسي واحد فقط. لا توجد كتابات أو تمزقات. جميع الصفحات سليمة ومقروءة بوضوح.",
    reason: "انتهيت من دراسة المادة",
    negotiable: true,
    meetingLocation: "الجامعة الأردنية - كلية الحقوق",
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
            <span>كتب مستعملة</span>
            <ArrowRight className="w-4 h-4" />
            <span>{book.title}</span>
          </div>
        </div>

        <RetroWindow title="تفاصيل الكتاب المستعمل">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Book Image */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={book.image || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full h-96 object-cover bg-gray-200 retro-window"
                />
                <Badge className="absolute top-4 right-4 bg-blue-500 text-white">مستعمل</Badge>
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
              </div>

              <div className="retro-window bg-gray-50 p-4">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
                    {book.price} دينار
                  </span>
                  <span className="text-xl text-gray-500 line-through">{book.originalPrice} دينار</span>
                  {book.negotiable && (
                    <Badge variant="outline" className="text-xs">
                      قابل للتفاوض
                    </Badge>
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
                    <strong>الجامعة:</strong> {book.university}
                  </p>
                  <p className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <strong>تاريخ النشر:</strong> {new Date(book.postedDate).toLocaleDateString("ar-SA")}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="retro-window bg-white p-4">
                <h3 className="font-bold mb-3">معلومات التواصل</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${book.contact}`} className="text-blue-600 hover:underline">
                      {book.contact}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href={`tel:${book.phone}`} className="text-blue-600 hover:underline">
                      {book.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{book.meetingLocation}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  asChild
                  className="retro-button w-full"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  <Link
                    href={`/market/purchase-chat/${book.sellerId}?bookId=${book.id}&bookTitle=${encodeURIComponent(book.title)}`}
                  >
                    <MessageCircle className="w-5 h-5 ml-2" />
                    بدء محادثة شراء
                  </Link>
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" className="retro-button bg-transparent">
                    <Link href={`mailto:${book.contact}?subject=استفسار عن كتاب ${book.title}`}>
                      <Mail className="w-4 h-4 ml-1" />
                      إيميل
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="retro-button bg-transparent">
                    <Link href={`tel:${book.phone}`}>
                      <Phone className="w-4 h-4 ml-1" />
                      اتصال
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 space-y-6">
            <div className="retro-window bg-white p-6">
              <h3 className="font-bold text-xl mb-4">وصف الكتاب</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{book.description}</p>
              <p className="text-sm text-gray-600">
                <strong>سبب البيع:</strong> {book.reason}
              </p>
            </div>

            <div className="retro-window bg-yellow-50 p-4">
              <h4 className="font-bold mb-2">نصائح للشراء الآمن</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• تأكد من حالة الكتاب قبل الشراء</li>
                <li>• اتفق على مكان آمن للقاء</li>
                <li>• تحقق من هوية البائع</li>
                <li>• لا تدفع مقدماً قبل رؤية الكتاب</li>
                <li>• استخدم محادثة الشراء للتفاوض والاتفاق على التفاصيل</li>
              </ul>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
