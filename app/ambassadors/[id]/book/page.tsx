"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RetroWindow } from "@/components/retro-window"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, ArrowRight, User, CreditCard } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function BookAmbassadorPage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  // Mock ambassador data
  const ambassador = {
    name: "د. أحمد محمد السالم",
    specialty: "القانون التجاري",
    price: 150,
  }

  const availableDates = [
    "2024-02-15",
    "2024-02-16",
    "2024-02-17",
    "2024-02-18",
    "2024-02-19",
    "2024-02-20",
    "2024-02-21",
  ]

  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto">
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
            <Link href={`/ambassadors/${params.id}`} className="hover:text-gray-900">
              {ambassador.name}
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>حجز جلسة</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <RetroWindow title="حجز جلسة استشارية">
              <div className="space-y-6">
                {/* Ambassador Info */}
                <div className="retro-window bg-blue-50">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span className="font-bold">السفير المختار</span>
                    </div>
                    <h3 className="text-lg font-bold">{ambassador.name}</h3>
                    <p className="text-gray-600">{ambassador.specialty}</p>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">اختر التاريخ *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {availableDates.map((date) => (
                      <Button
                        key={date}
                        variant={selectedDate === date ? "default" : "outline"}
                        className={`retro-button ${
                          selectedDate === date ? "bg-primary text-white" : "bg-transparent hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <Calendar className="w-4 h-4 ml-1" />
                        {new Date(date).toLocaleDateString("ar-SA", {
                          month: "short",
                          day: "numeric",
                        })}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <Label className="text-base font-semibold mb-3 block">اختر الوقت *</Label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className={`retro-button ${
                            selectedTime === time ? "bg-primary text-white" : "bg-transparent hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          <Clock className="w-4 h-4 ml-1" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">معلومات التواصل</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">الاسم الأول *</Label>
                      <Input id="firstName" className="retro-button" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">الاسم الأخير *</Label>
                      <Input id="lastName" className="retro-button" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input id="email" type="email" className="retro-button" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input id="phone" type="tel" className="retro-button" required />
                  </div>
                </div>

                {/* Session Details */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">تفاصيل الجلسة</Label>
                  <div>
                    <Label htmlFor="topic">موضوع الاستشارة *</Label>
                    <Input id="topic" placeholder="مثال: استشارة حول عقد شراكة" className="retro-button" required />
                  </div>
                  <div>
                    <Label htmlFor="description">وصف مفصل للمشكلة أو الاستفسار</Label>
                    <Textarea
                      id="description"
                      placeholder="اكتب تفاصيل ما تحتاج استشارة بشأنه..."
                      className="retro-button min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="platform">منصة الاجتماع المفضلة</Label>
                    <Select>
                      <SelectTrigger className="retro-button">
                        <SelectValue placeholder="اختر المنصة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="teams">Microsoft Teams</SelectItem>
                        <SelectItem value="meet">Google Meet</SelectItem>
                        <SelectItem value="phone">مكالمة هاتفية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </RetroWindow>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <RetroWindow title="ملخص الحجز">
              <div className="space-y-4">
                <div className="retro-window bg-gray-50">
                  <div className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>السفير:</span>
                      <span className="font-medium">{ambassador.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>التخصص:</span>
                      <span>{ambassador.specialty}</span>
                    </div>
                    {selectedDate && (
                      <div className="flex justify-between">
                        <span>التاريخ:</span>
                        <span>
                          {new Date(selectedDate).toLocaleDateString("ar-SA", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between">
                        <span>الوقت:</span>
                        <span>{selectedTime}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>المدة:</span>
                      <span>60 دقيقة</span>
                    </div>
                  </div>
                </div>

                <div className="retro-window bg-green-50">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">التكلفة الإجمالية:</span>
                      <span className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                        {ambassador.price} ريال
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">شامل ضريبة القيمة المضافة</p>
                  </div>
                </div>

                <Button
                  className="retro-button w-full"
                  style={{ background: "var(--accent)", color: "white" }}
                  disabled={!selectedDate || !selectedTime}
                >
                  <CreditCard className="w-4 h-4 ml-2" />
                  تأكيد الحجز والدفع
                </Button>

                <Button asChild variant="outline" className="retro-button w-full bg-transparent">
                  <Link href={`/ambassadors/${params.id}`}>العودة للملف الشخصي</Link>
                </Button>
              </div>
            </RetroWindow>

            <RetroWindow title="ملاحظات مهمة">
              <div className="text-xs text-gray-600 space-y-2">
                <p>• يمكن إلغاء الحجز قبل 24 ساعة من موعد الجلسة</p>
                <p>• سيتم إرسال رابط الاجتماع قبل الموعد بـ 30 دقيقة</p>
                <p>• يرجى الحضور في الوقت المحدد</p>
                <p>• في حالة التأخير أكثر من 15 دقيقة، قد يتم إلغاء الجلسة</p>
              </div>
            </RetroWindow>
          </div>
        </div>
      </div>
    </div>
  )
}
