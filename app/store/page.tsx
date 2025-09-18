import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function StorePage() {
  const books = [
    {
      id: 1,
      title: "أساسيات القانون المدني",
      author: "د. محمد أحمد",
      price: 45,
      category: "قانون",
      image: "/law-book.png",
    },
    {
      id: 2,
      title: "برمجة الويب المتقدمة",
      author: "م. فاطمة علي",
      price: 55,
      category: "تقنية",
      image: "/programming-book.png",
    },
    {
      id: 3,
      title: "علم التشريح البشري",
      author: "د. سارة أحمد",
      price: 65,
      category: "طب",
      image: "/open-anatomy-book.png",
    },
    {
      id: 4,
      title: "إدارة المشاريع",
      author: "د. أحمد سالم",
      price: 40,
      category: "إدارة",
      image: "/management-book.png",
    },
    { id: 5, title: "القانون التجاري", author: "د. نور الدين", price: 50, category: "قانون", image: "/law-book.png" },
    {
      id: 6,
      title: "هياكل البيانات",
      author: "م. محمد علي",
      price: 60,
      category: "تقنية",
      image: "/programming-book.png",
    },
    {
      id: 7,
      title: "علم وظائف الأعضاء",
      author: "د. ليلى محمد",
      price: 70,
      category: "طب",
      image: "/open-anatomy-book.png",
    },
    {
      id: 8,
      title: "التسويق الرقمي",
      author: "د. عمر أحمد",
      price: 35,
      category: "إدارة",
      image: "/management-book.png",
    },
  ]

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-7xl mx-auto">
        <RetroWindow title="متجر الكتب الأكاديمية">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input placeholder="ابحث عن كتاب..." className="flex-1 retro-button" />
              <Select>
                <SelectTrigger className="w-full md:w-48 retro-button">
                  <SelectValue placeholder="التخصص" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التخصصات</SelectItem>
                  <SelectItem value="law">قانون</SelectItem>
                  <SelectItem value="tech">تقنية</SelectItem>
                  <SelectItem value="medical">طب</SelectItem>
                  <SelectItem value="business">إدارة</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-48 retro-button">
                  <SelectValue placeholder="السعر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأسعار</SelectItem>
                  <SelectItem value="low">أقل من 40 ريال</SelectItem>
                  <SelectItem value="medium">40-60 ريال</SelectItem>
                  <SelectItem value="high">أكثر من 60 ريال</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book.id} className="retro-window bg-white">
                <div className="p-4">
                  <img
                    src={book.image || "/placeholder.svg"}
                    alt={book.title}
                    className="w-full h-40 object-cover mb-3"
                  />
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{book.category}</span>
                    <span className="font-bold text-primary">{book.price} ريال</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="retro-button flex-1"
                      style={{ background: "var(--accent)", color: "white" }}
                    >
                      <ShoppingCart className="w-4 h-4 ml-1" />
                      أضف للسلة
                    </Button>
                    <Button asChild size="sm" variant="outline" className="retro-button bg-transparent">
                      <Link href={`/store/${book.id}`}>عرض</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="flex justify-center gap-2">
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
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
