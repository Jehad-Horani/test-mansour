"use client"

import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Book, Users, ShoppingCart, MessageCircle, Settings, Star, Play, Download } from "lucide-react"
import Link from "next/link"

export default function GuidePage() {
  const guideSteps = [
    {
      title: "إنشاء الحساب",
      description: "ابدأ رحلتك الأكاديمية بإنشاء حساب جديد",
      icon: <Users className="w-8 h-8" />,
      steps: [
        "اضغط على 'ابدأ الآن' في الصفحة الرئيسية",
        "املأ البيانات المطلوبة (الاسم، البريد الإلكتروني، الجامعة)",
        "اختر تخصصك الأكاديمي",
        "فعّل حسابك من خلال البريد الإلكتروني",
      ],
    },
    {
      title: "استكشاف المحتوى",
      description: "تعرف على المحاضرات والدورات المتاحة",
      icon: <Book className="w-8 h-8" />,
      steps: [
        "تصفح المحاضرات حسب التخصص",
        "استخدم البحث للعثور على محتوى محدد",
        "احفظ المحاضرات المفضلة لديك",
        "قيّم المحتوى وشارك تعليقاتك",
      ],
    },
    {
      title: "التفاعل مع المجتمع",
      description: "انضم للمناقشات واطرح أسئلتك",
      icon: <MessageCircle className="w-8 h-8" />,
      steps: [
        "اطرح أسئلتك في قسم المجتمع",
        "أجب على أسئلة الطلاب الآخرين",
        "شارك في المناقشات الأكاديمية",
        "اكسب نقاط السمعة من خلال المشاركة",
      ],
    },
    {
      title: "استخدام السوق",
      description: "اشتري وبع الكتب الأكاديمية",
      icon: <ShoppingCart className="w-8 h-8" />,
      steps: [
        "تصفح الكتب المتاحة في السوق",
        "أضف الكتب للسلة واتمم عملية الشراء",
        "بع كتبك المستعملة للطلاب الآخرين",
        "تابع طلباتك ومبيعاتك",
      ],
    },
  ]

  const features = [
    {
      title: "المحاضرات والدورات",
      description: "آلاف المحاضرات في مختلف التخصصات",
      icon: <Book className="w-6 h-6" />,
    },
    {
      title: "السفراء الأكاديميون",
      description: "احصل على استشارات من خبراء التخصص",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "السوق الأكاديمي",
      description: "اشتري وبع الكتب بأسعار مناسبة",
      icon: <ShoppingCart className="w-6 h-6" />,
    },
    {
      title: "المجتمع التفاعلي",
      description: "اطرح أسئلتك وشارك معرفتك",
      icon: <MessageCircle className="w-6 h-6" />,
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <RetroWindow title="دليل المستخدم">
          <div className="p-6 text-center">
            <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              مرحباً بك في تخصص
            </h1>
            <p className="text-gray-600 mb-6">دليلك الشامل لاستخدام منصة تخصص والاستفادة من جميع ميزاتها</p>
            <Badge variant="secondary" className="mb-4">
              <Star className="w-4 h-4 ml-1" />
              دليل تفاعلي
            </Badge>
          </div>
        </RetroWindow>

        {/* Quick Start */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <RetroWindow title="البدء السريع">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded border">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">أنشئ حسابك</h3>
                    <p className="text-sm text-gray-600">ابدأ بإنشاء حساب مجاني</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded border">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">اختر تخصصك</h3>
                    <p className="text-sm text-gray-600">حدد مجال دراستك</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded border">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">ابدأ التعلم</h3>
                    <p className="text-sm text-gray-600">تصفح المحاضرات والدورات</p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="w-full mt-6 retro-button"
                style={{ background: "var(--primary)", color: "white" }}
              >
                <Link href="/auth/register">
                  <Play className="w-4 h-4 ml-2" />
                  ابدأ الآن
                </Link>
              </Button>
            </div>
          </RetroWindow>

          <RetroWindow title="الميزات الرئيسية">
            <div className="p-6 space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
                  <div style={{ color: "var(--primary)" }}>{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "var(--ink)" }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RetroWindow>
        </div>

        {/* Detailed Guide */}
        <div className="mt-8 space-y-6">
          {guideSteps.map((step, index) => (
            <RetroWindow key={index} title={`${index + 1}. ${step.title}`}>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg" style={{ background: "var(--accent)", color: "white" }}>
                    {step.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                      {step.title}
                    </h2>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-3" style={{ color: "var(--ink)" }}>
                      الخطوات:
                    </h3>
                    <ol className="space-y-2">
                      {step.steps.map((stepItem, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <span className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </span>
                          <span className="text-gray-700">{stepItem}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <div style={{ color: "var(--primary)" }}>{step.icon}</div>
                      </div>
                      <p className="text-sm text-gray-600">صورة توضيحية</p>
                    </div>
                  </div>
                </div>
              </div>
            </RetroWindow>
          ))}
        </div>

        {/* Additional Resources */}
        <RetroWindow title="موارد إضافية">
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="retro-button bg-transparent h-auto p-4">
                <Link href="/help" className="flex flex-col items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  <span>الأسئلة الشائعة</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="retro-button bg-transparent h-auto p-4">
                <Link href="/contact" className="flex flex-col items-center gap-2">
                  <Settings className="w-6 h-6" />
                  <span>تواصل معنا</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="retro-button bg-transparent h-auto p-4"
                onClick={() => window.print()}
              >
                <div className="flex flex-col items-center gap-2">
                  <Download className="w-6 h-6" />
                  <span>طباعة الدليل</span>
                </div>
              </Button>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
