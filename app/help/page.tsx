"use client"

import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { useState } from "react"
import Link from "next/link"
import {
  MessageCircle,
  Book,
  Users,
  ShoppingCart,
  Settings,
  Phone,
  Mail,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqCategories = [
    {
      title: "الحساب والتسجيل",
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          q: "كيف أنشئ حساب جديد؟",
          a: "يمكنك إنشاء حساب جديد من خلال النقر على 'ابدأ الآن' في الصفحة الرئيسية وملء البيانات المطلوبة.",
        },
        {
          q: "نسيت كلمة المرور، ماذا أفعل؟",
          a: "اذهب إلى صفحة تسجيل الدخول واضغط على 'نسيت كلمة المرور' وسنرسل لك رابط إعادة تعيين كلمة المرور.",
        },
        {
          q: "كيف أغير معلومات ملفي الشخصي؟",
          a: "اذهب إلى الملف الشخصي من لوحة التحكم واضغط على 'تعديل الملف الشخصي' لتحديث معلوماتك.",
        },
      ],
    },
    {
      title: "الدورات والمحاضرات",
      icon: <Book className="w-5 h-5" />,
      questions: [
        {
          q: "كيف أرفع محاضرة جديدة؟",
          a: "اذهب إلى لوحة التحكم > المحاضرات واضغط على 'رفع محاضرة جديدة' واتبع الخطوات.",
        },
        {
          q: "ما هي صيغ الملفات المدعومة؟",
          a: "ندعم ملفات PDF, DOC, DOCX, PPT, PPTX بحد أقصى 50 ميجابايت للملف الواحد.",
        },
        {
          q: "كيف أصل للدورات المتقدمة؟",
          a: "الدورات المتقدمة متاحة للمشتركين في الباقة المعيارية والمميزة. يمكنك ترقية اشتراكك من الإعدادات.",
        },
      ],
    },
    {
      title: "السوق والمشتريات",
      icon: <ShoppingCart className="w-5 h-5" />,
      questions: [
        {
          q: "كيف أشتري كتاب من السوق؟",
          a: "تصفح السوق، اختر الكتاب المطلوب، اضغط 'أضف للسلة' ثم اتبع خطوات الدفع.",
        },
        {
          q: "كيف أبيع كتبي المستعملة؟",
          a: "اذهب إلى السوق واضغط على 'بيع كتاب' وأدخل تفاصيل الكتاب وصوره.",
        },
        {
          q: "ما هي طرق الدفع المتاحة؟",
          a: "نقبل الدفع بالبطاقات الائتمانية، مدى، والتحويل البنكي.",
        },
      ],
    },
    {
      title: "السفراء والاستشارات",
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          q: "كم تكلفة الاستشارة؟",
          a: "تختلف التكلفة حسب السفير والتخصص، وتتراوح بين 50-200 دينار للجلسة الواحدة.",
        },
        {
          q: "كيف أصبح سفيراً أكاديمياً؟",
          a: "يمكنك التقديم من خلال صفحة السفراء والضغط على 'انضم كسفير' وملء النموذج المطلوب.",
        },
      ],
    },
  ]

  const quickActions = [
    { title: "تواصل معنا", href: "/contact", icon: <MessageCircle className="w-5 h-5" /> },
    { title: "الأسئلة الشائعة", href: "#faq", icon: <Book className="w-5 h-5" /> },
    { title: "دليل المستخدم", href: "/guide", icon: <Settings className="w-5 h-5" /> },
    { title: "الدعم الفني", href: "/support", icon: <Phone className="w-5 h-5" /> },
  ]

  const filteredFaqs = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter((q) => q.q.includes(searchQuery) || q.a.includes(searchQuery)),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <RetroWindow title="مركز المساعدة والدعم">
          <div className="p-6 text-center">
            <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              كيف يمكننا مساعدتك؟
            </h1>
            <p className="text-gray-600 mb-6">ابحث عن إجابات لأسئلتك أو تواصل مع فريق الدعم</p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن سؤالك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border-2 border-gray-300 retro-input"
                style={{ background: "var(--panel)" }}
              />
            </div>
          </div>
        </RetroWindow>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 my-8">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <RetroWindow className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="p-6 text-center">
                  <div className="mb-4" style={{ color: "var(--primary)" }}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold" style={{ color: "var(--ink)" }}>
                    {action.title}
                  </h3>
                </div>
              </RetroWindow>
            </Link>
          ))}
        </div>

        {/* FAQ Section */}
        <div id="faq">
          <RetroWindow title="الأسئلة الشائعة">
            <div className="p-6">
              {(searchQuery ? filteredFaqs : faqCategories).map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{ color: "var(--primary)" }}>{category.icon}</div>
                    <h2 className="text-xl font-bold" style={{ color: "var(--ink)" }}>
                      {category.title}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {category.questions.map((faq, faqIndex) => {
                      const globalIndex = categoryIndex * 100 + faqIndex
                      const isExpanded = expandedFaq === globalIndex

                      return (
                        <div key={faqIndex} className="retro-window bg-white">
                          <button
                            onClick={() => setExpandedFaq(isExpanded ? null : globalIndex)}
                            className="w-full p-4 text-right flex items-center justify-between hover:bg-gray-50"
                          >
                            <span className="font-medium" style={{ color: "var(--ink)" }}>
                              {faq.q}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" style={{ color: "var(--primary)" }} />
                            ) : (
                              <ChevronDown className="w-5 h-5" style={{ color: "var(--primary)" }} />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 border-t border-gray-200">
                              <p className="text-gray-600 pt-3">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {searchQuery && filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">لم نجد نتائج لبحثك</p>
                  <Button onClick={() => setSearchQuery("")} variant="outline" className="retro-button bg-transparent">
                    مسح البحث
                  </Button>
                </div>
              )}
            </div>
          </RetroWindow>
        </div>

        {/* Contact Section */}
        <RetroWindow title="تواصل معنا">
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-4" style={{ color: "var(--ink)" }}>
                  معلومات التواصل
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" style={{ color: "var(--primary)" }} />
                    <span style={{ color: "var(--ink)" }}>support@takhassus.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" style={{ color: "var(--primary)" }} />
                    <span style={{ color: "var(--ink)" }}>+966 11 123 4567</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4" style={{ color: "var(--ink)" }}>
                  ساعات العمل
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>الأحد - الخميس: 9:00 ص - 6:00 م</p>
                  <p>الجمعة - السبت: 10:00 ص - 4:00 م</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                  <Link href="/dashboard/tickets/new">
                    <MessageCircle className="w-4 h-4 ml-1" />
                    إرسال تذكرة دعم
                  </Link>
                </Button>

                <Button asChild variant="outline" className="retro-button bg-transparent">
                  <Link href="/community">
                    <Users className="w-4 h-4 ml-1" />
                    انضم للمجتمع
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
