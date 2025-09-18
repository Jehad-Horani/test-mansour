"use client"

import type React from "react"

import { RetroWindow } from "@/app/components/retro-window"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.")
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--panel)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <RetroWindow title="تواصل معنا">
          <div className="p-6 text-center">
            <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              نحن هنا لمساعدتك
            </h1>
            <p className="text-gray-600">لديك سؤال أو اقتراح؟ تواصل معنا وسنرد عليك في أقرب وقت ممكن</p>
          </div>
        </RetroWindow>

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Contact Form */}
          <RetroWindow title="إرسال رسالة">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">الاسم الأول *</Label>
                  <Input id="firstName" required className="retro-input mt-2" placeholder="أدخل اسمك الأول" />
                </div>
                <div>
                  <Label htmlFor="lastName">الاسم الأخير *</Label>
                  <Input id="lastName" required className="retro-input mt-2" placeholder="أدخل اسمك الأخير" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input id="email" type="email" required className="retro-input mt-2" placeholder="example@email.com" />
              </div>

              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input id="phone" type="tel" className="retro-input mt-2" placeholder="+962 7X XXX XXXX" />
              </div>

              <div>
                <Label htmlFor="subject">الموضوع *</Label>
                <Select>
                  <SelectTrigger className="retro-input mt-2">
                    <SelectValue placeholder="اختر موضوع الرسالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">دعم فني</SelectItem>
                    <SelectItem value="billing">الفواتير والاشتراكات</SelectItem>
                    <SelectItem value="suggestion">اقتراح أو تحسين</SelectItem>
                    <SelectItem value="complaint">شكوى</SelectItem>
                    <SelectItem value="partnership">شراكة</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">الرسالة *</Label>
                <Textarea
                  id="message"
                  required
                  className="retro-input mt-2 min-h-[120px]"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full retro-button"
                style={{ background: "var(--primary)", color: "white" }}
              >
                <Send className="w-4 h-4 ml-2" />
                {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
              </Button>
            </form>
          </RetroWindow>

          {/* Contact Information */}
          <div className="space-y-6">
            <RetroWindow title="معلومات التواصل">
              <div className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ background: "var(--accent)", color: "white" }}>
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "var(--ink)" }}>
                      البريد الإلكتروني
                    </h3>
                    <p className="text-gray-600">support@takhassus.com</p>
                    <p className="text-gray-600">info@takhassus.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ background: "var(--accent)", color: "white" }}>
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "var(--ink)" }}>
                      الهاتف
                    </h3>
                    <p className="text-gray-600">+962 6 123 4567</p>
                    <p className="text-gray-600">+962 7 987 6543</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ background: "var(--accent)", color: "white" }}>
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "var(--ink)" }}>
                      العنوان
                    </h3>
                    <p className="text-gray-600">عمان، الأردن</p>
                    <p className="text-gray-600">شارع الجامعة الأردنية</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ background: "var(--accent)", color: "white" }}>
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: "var(--ink)" }}>
                      ساعات العمل
                    </h3>
                    <p className="text-gray-600">الأحد - الخميس: 9:00 ص - 6:00 م</p>
                    <p className="text-gray-600">الجمعة - السبت: 10:00 ص - 4:00 م</p>
                  </div>
                </div>
              </div>
            </RetroWindow>

            <RetroWindow title="الأسئلة الشائعة">
              <div className="p-6">
                <p className="text-gray-600 mb-4">قبل التواصل معنا، تحقق من الأسئلة الشائعة للحصول على إجابات سريعة</p>
                <Button asChild variant="outline" className="retro-button bg-transparent w-full">
                  <a href="/help">عرض الأسئلة الشائعة</a>
                </Button>
              </div>
            </RetroWindow>
          </div>
        </div>
      </div>
    </div>
  )
}
