"use client"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { RetroWindow } from "@/app/components/retro-window"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { ArrowRight, CreditCard, Smartphone, Building } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")

  const total = 170 // Mock total from previous page

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
            <Link href="/cart" className="hover:text-gray-900">
              السلة
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/checkout" className="hover:text-gray-900">
              إتمام الشراء
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span>الدفع</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <RetroWindow title="طريقة الدفع">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                {/* Credit Card */}
                <div className="retro-window bg-white">
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="w-5 h-5" />
                        بطاقة ائتمان / خصم
                      </Label>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <div>
                          <Label htmlFor="cardNumber">رقم البطاقة *</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="retro-button" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">تاريخ الانتهاء *</Label>
                            <Input id="expiry" placeholder="MM/YY" className="retro-button" />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input id="cvv" placeholder="123" className="retro-button" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName">اسم حامل البطاقة *</Label>
                          <Input id="cardName" placeholder="الاسم كما يظهر على البطاقة" className="retro-button" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Apple Pay / STC Pay */}
                <div className="retro-window bg-white">
                  <div className="p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer">
                        <Smartphone className="w-5 h-5" />
                        الدفع عبر الجوال (STC Pay / Apple Pay)
                      </Label>
                    </div>

                    {paymentMethod === "mobile" && (
                      <div className="pt-4 border-t border-gray-200 mt-4">
                        <p className="text-sm text-gray-600">سيتم توجيهك لإتمام الدفع عبر تطبيق الدفع المحدد</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bank Transfer */}
                <div className="retro-window bg-white">
                  <div className="p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                        <Building className="w-5 h-5" />
                        تحويل بنكي
                      </Label>
                    </div>

                    {paymentMethod === "bank" && (
                      <div className="pt-4 border-t border-gray-200 mt-4">
                        <div className="text-sm space-y-2">
                          <p>
                            <strong>اسم البنك:</strong> البنك الأهلي السعودي
                          </p>
                          <p>
                            <strong>رقم الحساب:</strong> SA1234567890123456789
                          </p>
                          <p>
                            <strong>اسم المستفيد:</strong> شركة تخصصكم للتعليم
                          </p>
                          <p className="text-gray-600 mt-3">
                            يرجى إرسال إيصال التحويل عبر البريد الإلكتروني لتأكيد الطلب
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </RetroWindow>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <RetroWindow title="ملخص الطلب">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>155 ريال</span>
                </div>
                <div className="flex justify-between">
                  <span>الشحن:</span>
                  <span>15 ريال</span>
                </div>
                <div className="flex justify-between">
                  <span>الضريبة (15%):</span>
                  <span>23 ريال</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                  <span>المجموع الكلي:</span>
                  <span style={{ color: "var(--primary)" }}>{total} ريال</span>
                </div>
              </div>
            </RetroWindow>

            <div className="space-y-3">
              <Button asChild className="retro-button w-full" style={{ background: "var(--accent)", color: "white" }}>
                <Link href="/checkout/review">مراجعة الطلب</Link>
              </Button>
              <Button asChild variant="outline" className="retro-button w-full bg-transparent">
                <Link href="/checkout">العودة للمعلومات</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
