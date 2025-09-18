import { Button } from "@/components/ui/button"
import { RetroWindow } from "@/components/retro-window"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, Clock, ArrowRight, Award, BookOpen, MessageSquare } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock ambassador data
const ambassadors = [
  {
    id: 1,
    name: "د. أحمد محمد السالم",
    specialty: "القانون التجاري",
    university: "جامعة الملك سعود",
    rating: 4.9,
    sessions: 127,
    price: 150,
    image: "/placeholder.svg?height=200&width=200",
    experience: "15 سنة",
    languages: ["العربية", "الإنجليزية"],
    available: true,
    bio: "أستاذ مساعد في كلية الحقوق بجامعة الملك سعود، متخصص في القانون التجاري والشركات. حاصل على الدكتوراه من جامعة السوربون، فرنسا. له خبرة واسعة في الاستشارات القانونية للشركات الكبرى والمتوسطة.",
    education: [
      "دكتوراه في القانون التجاري - جامعة السوربون، فرنسا (2008)",
      "ماجستير في القانون المدني - جامعة الملك سعود (2004)",
      "بكالوريوس الحقوق - جامعة الملك سعود (2002)",
    ],
    achievements: [
      "أفضل أستاذ في كلية الحقوق لعام 2022",
      "عضو في الجمعية السعودية للقانون التجاري",
      "مؤلف كتاب 'أساسيات القانون التجاري السعودي'",
      "محكم معتمد في المحكمة التجارية",
    ],
    specializations: ["قانون الشركات", "العقود التجارية", "الإفلاس والتصفية", "القانون المصرفي"],
    reviews: [
      {
        name: "محمد أحمد",
        rating: 5,
        comment: "استشارة ممتازة ومفيدة جداً، أنصح بشدة",
        date: "2024-01-15",
      },
      {
        name: "فاطمة علي",
        rating: 5,
        comment: "خبرة واسعة وشرح واضح ومفهوم",
        date: "2024-01-10",
      },
    ],
  },
]

export default function AmbassadorProfilePage({ params }: { params: { id: string } }) {
  const ambassadorId = Number.parseInt(params.id)
  const ambassador = ambassadors.find((a) => a.id === ambassadorId)

  if (!ambassador) {
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
            <Link href="/ambassadors" className="hover:text-gray-900">
              السفراء
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>{ambassador.name}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ambassador Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <RetroWindow title="الملف الشخصي">
              <div className="flex items-start gap-6">
                <img
                  src={ambassador.image || "/placeholder.svg"}
                  alt={ambassador.name}
                  className="w-32 h-32 rounded-lg bg-gray-200 object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{ambassador.name}</h1>
                  <p className="text-lg text-gray-600 mb-2">{ambassador.specialty}</p>
                  <p className="text-gray-500 mb-4">{ambassador.university}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-bold">{ambassador.rating}</span>
                      <span className="text-gray-600">({ambassador.sessions} جلسة)</span>
                    </div>
                    <Badge variant={ambassador.available ? "default" : "secondary"}>
                      {ambassador.available ? "متاح للحجز" : "مشغول"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {ambassador.languages.map((lang) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </RetroWindow>

            {/* Biography */}
            <RetroWindow title="نبذة تعريفية">
              <p className="text-gray-700 leading-relaxed">{ambassador.bio}</p>
            </RetroWindow>

            {/* Education */}
            <RetroWindow title="المؤهلات العلمية">
              <div className="space-y-3">
                {ambassador.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                    <span className="text-gray-700">{edu}</span>
                  </div>
                ))}
              </div>
            </RetroWindow>

            {/* Achievements */}
            <RetroWindow title="الإنجازات والجوائز">
              <div className="space-y-3">
                {ambassador.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <span className="text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </RetroWindow>

            {/* Specializations */}
            <RetroWindow title="التخصصات الفرعية">
              <div className="flex flex-wrap gap-2">
                {ambassador.specializations.map((spec) => (
                  <Badge key={spec} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            </RetroWindow>

            {/* Reviews */}
            <RetroWindow title="آراء الطلاب">
              <div className="space-y-4">
                {ambassador.reviews.map((review, index) => (
                  <div key={index} className="retro-window bg-gray-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.name}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RetroWindow>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <RetroWindow title="احجز جلسة استشارية">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2" style={{ color: "var(--primary)" }}>
                    {ambassador.price} ريال
                  </div>
                  <p className="text-gray-600 text-sm">لكل جلسة (60 دقيقة)</p>
                </div>

                <div className="retro-window bg-gray-50">
                  <div className="p-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>مدة الجلسة: 60 دقيقة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>متاح: الأحد - الخميس</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span>عبر Zoom أو Teams</span>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  className="retro-button w-full"
                  style={{ background: "var(--accent)", color: "white" }}
                  disabled={!ambassador.available}
                >
                  <Link href={`/ambassadors/${ambassador.id}/book`}>احجز الآن</Link>
                </Button>

                <Button asChild variant="outline" className="retro-button w-full bg-transparent">
                  <Link href="/ambassadors">تصفح السفراء الآخرين</Link>
                </Button>
              </div>
            </RetroWindow>

            <RetroWindow title="إحصائيات السفير">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>إجمالي الجلسات:</span>
                  <span className="font-bold">{ambassador.sessions}</span>
                </div>
                <div className="flex justify-between">
                  <span>سنوات الخبرة:</span>
                  <span className="font-bold">{ambassador.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span>التقييم:</span>
                  <span className="font-bold">{ambassador.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>معدل الاستجابة:</span>
                  <span className="font-bold">98%</span>
                </div>
              </div>
            </RetroWindow>
          </div>
        </div>
      </div>
    </div>
  )
}
