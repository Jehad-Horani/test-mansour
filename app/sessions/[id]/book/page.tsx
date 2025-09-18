"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { Badge } from "@/app/components/ui/badge"
import { Input } from "@/app/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"

const mockSessionDetails = {
  1: {
    id: 1,
    title: "جلسة مراجعة القانون المدني",
    instructor: "د. أحمد العلي",
    instructorImage: "/diverse-professor-lecturing.png",
    date: "2024-02-10",
    time: "19:00 - 21:00",
    duration: "ساعتان",
    participants: 12,
    maxParticipants: 15,
    price: 0,
    isPaid: false,
    status: "متاح",
    description: "جلسة مراجعة شاملة لمادة القانون المدني تغطي جميع المواضيع الأساسية",
    topics: ["العقود", "الالتزامات", "الحقوق العينية", "المسؤولية المدنية"],
    requirements: ["كتاب القانون المدني", "دفتر ملاحظات", "قلم"],
    location: "قاعة المحاضرات الافتراضية",
  },
  2: {
    id: 2,
    title: "ورشة البرمجة المتقدمة",
    instructor: "م. سارة الأحمد",
    instructorImage: "/female-engineer.jpg",
    date: "2024-02-12",
    time: "20:00 - 22:00",
    duration: "ساعتان",
    participants: 8,
    maxParticipants: 10,
    price: 50,
    isPaid: true,
    status: "متاح",
    description: "ورشة عملية في البرمجة المتقدمة باستخدام JavaScript و React",
    topics: ["React Hooks", "State Management", "API Integration", "Performance Optimization"],
    requirements: ["جهاز كمبيوتر", "Node.js مثبت", "محرر نصوص"],
    location: "منصة Zoom",
  },
}

export default function BookSessionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const sessionId = Number.parseInt(params.id)
  const session = mockSessionDetails[sessionId as keyof typeof mockSessionDetails]

  const [isBooking, setIsBooking] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  if (!session) {
    return (
      <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
        <div className="max-w-4xl mx-auto">
          <RetroWindow title="جلسة غير موجودة">
            <div className="text-center p-8">
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>
                الجلسة غير موجودة
              </h2>
              <Link href="/dashboard/sessions" className="retro-button bg-gray-200 hover:bg-gray-300 px-4 py-2">
                العودة للجلسات
              </Link>
            </div>
          </RetroWindow>
        </div>
      </div>
    )
  }

  const handleBooking = async () => {
    if (
      session.isPaid &&
      (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardName)
    ) {
      alert("يرجى ملء جميع بيانات الدفع")
      return
    }

    setIsBooking(true)

    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false)
      alert("تم حجز الجلسة بنجاح! ستصلك رسالة تأكيد على البريد الإلكتروني")
      router.push("/dashboard/sessions")
    }, 2000)
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto">
        <RetroWindow title="حجز جلسة دراسية">
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/dashboard/sessions" className="retro-button bg-gray-200 hover:bg-gray-300 px-4 py-2">
                ← العودة للجلسات
              </Link>
            </div>

            {/* Session Details */}
            <div className="retro-window bg-white p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--ink)" }}>
                      {session.title}
                    </h1>
                    <p className="text-lg mb-4" style={{ color: "var(--ink)", opacity: 0.8 }}>
                      {session.description}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                        تفاصيل الجلسة
                      </h3>
                      <div className="space-y-2 text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                        <p>
                          <strong>التاريخ:</strong> {session.date}
                        </p>
                        <p>
                          <strong>الوقت:</strong> {session.time}
                        </p>
                        <p>
                          <strong>المدة:</strong> {session.duration}
                        </p>
                        <p>
                          <strong>المكان:</strong> {session.location}
                        </p>
                        <p>
                          <strong>المشاركون:</strong> {session.participants}/{session.maxParticipants}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                        المواضيع المغطاة
                      </h3>
                      <ul className="space-y-1 text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                        {session.topics.map((topic, index) => (
                          <li key={index}>• {topic}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
                      المتطلبات
                    </h3>
                    <ul className="space-y-1 text-sm" style={{ color: "var(--ink)", opacity: 0.7 }}>
                      {session.requirements.map((req, index) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Instructor Info */}
                  <div className="retro-window bg-gray-50 p-4">
                    <h3 className="font-semibold mb-3" style={{ color: "var(--ink)" }}>
                      المدرب
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={session.instructorImage || "/placeholder.svg"}
                        alt={session.instructor}
                        className="w-12 h-12 rounded border-2"
                        style={{ borderColor: "var(--border)" }}
                      />
                      <div>
                        <p className="font-medium" style={{ color: "var(--ink)" }}>
                          {session.instructor}
                        </p>
                        <p className="text-sm" style={{ color: "var(--ink)", opacity: 0.6 }}>
                          مدرب معتمد
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price & Status */}
                  <div className="retro-window bg-gray-50 p-4">
                    <div className="text-center space-y-3">
                      <Badge
                        className={`text-sm ${session.status === "متاح" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {session.status}
                      </Badge>
                      <div>
                        <p className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                          {session.isPaid ? `${session.price} دينار` : "مجاني"}
                        </p>
                        {session.isPaid && (
                          <p className="text-sm" style={{ color: "var(--ink)", opacity: 0.6 }}>
                            دفعة واحدة
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form (if paid session) */}
            {session.isPaid && (
              <div className="retro-window bg-white p-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--ink)" }}>
                  معلومات الدفع
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      رقم البطاقة
                    </label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                      className="retro-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      اسم حامل البطاقة
                    </label>
                    <Input
                      type="text"
                      placeholder="الاسم كما يظهر على البطاقة"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                      className="retro-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      تاريخ الانتهاء
                    </label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                      className="retro-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      CVV
                    </label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                      className="retro-input"
                    />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">🔒 جميع المعاملات آمنة ومشفرة. لن يتم حفظ بيانات البطاقة.</p>
                </div>
              </div>
            )}

            {/* Booking Button */}
            <div className="text-center">
              <Button
                onClick={handleBooking}
                disabled={isBooking || session.status !== "متاح"}
                className="retro-button px-8 py-3 text-lg"
                style={{
                  background: session.status === "متاح" ? "var(--primary)" : "var(--border)",
                  color: "white",
                }}
              >
                {isBooking
                  ? "جاري الحجز..."
                  : session.isPaid
                    ? `احجز الآن - ${session.price} دينار`
                    : "احجز الآن - مجاني"}
              </Button>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
