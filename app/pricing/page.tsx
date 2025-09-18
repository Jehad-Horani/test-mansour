import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { Badge } from "@/app/components/ui/badge"
import { Check, X, ArrowRight, Star, Zap, Crown } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "مجاني",
      price: 0,
      period: "مجاناً للأبد",
      description: "للطلاب الذين يريدون تجربة المنصة",
      icon: Star,
      color: "gray",
      features: [
        { name: "عرض محدود للكتب (5 كتب شهرياً)", included: true },
        { name: "رفع 3 ملفات شهرياً", included: true },
        { name: "مشاركة في المجتمع", included: true },
        { name: "دعم عبر البريد الإلكتروني", included: true },
        { name: "وصول للكتب المجانية", included: true },
        { name: "تحميل الكتب", included: false },
        { name: "استشارات مع السفراء", included: false },
        { name: "جلسات دراسية جماعية", included: false },
        { name: "دعم فني أولوية", included: false },
        { name: "محتوى حصري", included: false },
      ],
      cta: "ابدأ مجاناً",
      ctaLink: "/register",
      popular: false,
    },
    {
      name: "قياسي",
      price: 10,
      period: "شهرياً",
      description: "الأفضل للطلاب النشطين",
      icon: Zap,
      color: "blue",
      features: [
        { name: "وصول كامل لجميع الكتب", included: true },
        { name: "رفع غير محدود للملفات", included: true },
        { name: "تحميل جميع الكتب", included: true },
        { name: "مشاركة متقدمة في المجتمع", included: true },
        { name: "جدولة الامتحانات والمهام", included: true },
        { name: "دعم فني أولوية", included: true },
        { name: "إحصائيات التقدم", included: true },
        { name: "استشارات مع السفراء (محدودة)", included: true },
        { name: "جلسات دراسية جماعية", included: false },
        { name: "محتوى حصري", included: false },
      ],
      cta: "اشترك الآن",
      ctaLink: "/subscribe/standard",
      popular: true,
    },
    {
      name: "مميز",
      price: 20,
      period: "شهرياً",
      description: "للطلاب الذين يريدون الأفضل",
      icon: Crown,
      color: "purple",
      features: [
        { name: "جميع مميزات الخطة القياسية", included: true },
        { name: "استشارات غير محدودة مع السفراء", included: true },
        { name: "جلسات دراسية جماعية", included: true },
        { name: "محتوى حصري ومتقدم", included: true },
        { name: "وصول مبكر للميزات الجديدة", included: true },
        { name: "دعم فني متقدم (24/7)", included: true },
        { name: "تقارير تقدم مفصلة", included: true },
        { name: "شهادات إتمام معتمدة", included: true },
        { name: "خصومات على الفعاليات", included: true },
        { name: "مدير حساب شخصي", included: true },
      ],
      cta: "اشترك الآن",
      ctaLink: "/subscribe/premium",
      popular: false,
    },
  ]

  const faqs = [
    {
      question: "هل يمكنني تغيير خطتي في أي وقت؟",
      answer: "نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت. التغييرات ستطبق في دورة الفوترة التالية.",
    },
    {
      question: "هل هناك التزام طويل المدى؟",
      answer: "لا، جميع خططنا شهرية ويمكنك إلغاء اشتراكك في أي وقت دون أي رسوم إضافية.",
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نقبل جميع البطاقات الائتمانية الرئيسية، STC Pay، Apple Pay، والتحويل البنكي.",
    },
    {
      question: "هل يمكنني الحصول على فاتورة ضريبية؟",
      answer: "نعم، نرسل فاتورة ضريبية تلقائياً لجميع المشتركين عبر البريد الإلكتروني.",
    },
    {
      question: "هل هناك خصم للطلاب؟",
      answer: "نعم، نوفر خصم 20% للطلاب المسجلين في الجامعات السعودية مع إثبات التسجيل.",
    },
  ]

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
            <span>الأسعار</span>
          </div>
        </div>

        {/* Header */}
        <RetroWindow title="خطط الاشتراك">
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold mb-4">اختر الخطة المناسبة لك</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              خطط مرنة تناسب جميع احتياجات الطلاب، من المبتدئين إلى المتقدمين
            </p>
          </div>
        </RetroWindow>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <div
                key={plan.name}
                className={`retro-window bg-white relative ${plan.popular ? "ring-2 ring-blue-500" : ""}`}
              >
                {plan.popular && <Badge className="absolute -top-3 right-4 bg-blue-500 text-white">الأكثر شعبية</Badge>}

                <div className="retro-window-title">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{plan.name}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-4xl font-bold" style={{ color: "var(--primary)" }}>
                        {plan.price}
                      </span>
                      {plan.price > 0 && <span className="text-gray-600">ريال</span>}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{plan.period}</p>
                    <p className="text-gray-700 text-sm">{plan.description}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? "text-gray-900" : "text-gray-500"}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    className={`retro-button w-full ${
                      plan.popular
                        ? "text-white"
                        : plan.price === 0
                          ? "bg-transparent border-gray-300"
                          : "bg-transparent"
                    }`}
                    style={
                      plan.popular
                        ? { background: "var(--accent)", color: "white" }
                        : plan.price > 0
                          ? { background: "var(--primary)", color: "white" }
                          : {}
                    }
                  >
                    <Link href={plan.ctaLink}>{plan.cta}</Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Features Comparison */}
        <RetroWindow title="مقارنة مفصلة للميزات">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-semibold">الميزة</th>
                  <th className="text-center py-3 px-4 font-semibold">مجاني</th>
                  <th className="text-center py-3 px-4 font-semibold">قياسي</th>
                  <th className="text-center py-3 px-4 font-semibold">مميز</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "عدد الكتب المتاحة", free: "5 شهرياً", standard: "غير محدود", premium: "غير محدود" },
                  { feature: "تحميل الكتب", free: "✗", standard: "✓", premium: "✓" },
                  { feature: "رفع الملفات", free: "3 شهرياً", standard: "غير محدود", premium: "غير محدود" },
                  { feature: "استشارات السفراء", free: "✗", standard: "محدودة", premium: "غير محدود" },
                  { feature: "الجلسات الجماعية", free: "✗", standard: "✗", premium: "✓" },
                  { feature: "الدعم الفني", free: "بريد إلكتروني", standard: "أولوية", premium: "24/7" },
                  { feature: "المحتوى الحصري", free: "✗", standard: "✗", premium: "✓" },
                  { feature: "التقارير المفصلة", free: "✗", standard: "أساسية", premium: "متقدمة" },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-center">{row.free}</td>
                    <td className="py-3 px-4 text-center">{row.standard}</td>
                    <td className="py-3 px-4 text-center">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RetroWindow>

        {/* FAQ */}
        <RetroWindow title="الأسئلة الشائعة">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="retro-window bg-gray-50">
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-700 text-sm">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </RetroWindow>

        {/* CTA Section */}
        <RetroWindow title="ابدأ رحلتك التعليمية اليوم">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">جاهز للبدء؟</h2>
            <p className="text-gray-600 mb-6">انضم إلى آلاف الطلاب الذين يحققون النجاح مع تخصصكُم</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="retro-button" style={{ background: "var(--accent)", color: "white" }}>
                <Link href="/subscribe/standard">ابدأ بالخطة القياسية</Link>
              </Button>
              <Button asChild variant="outline" className="retro-button bg-transparent">
                <Link href="/register">جرب مجاناً</Link>
              </Button>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
