import { Button } from "@/components/ui/button"
import { RetroWindow } from "@/components/retro-window"
import { X, RefreshCw, Mail } from "lucide-react"
import Link from "next/link"

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-2xl mx-auto">
        <RetroWindow title="فشل في الدفع">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              عذراً، فشل في إتمام الدفع
            </h1>

            <p className="text-gray-600 mb-6">
              حدث خطأ أثناء معالجة عملية الدفع. يرجى المحاولة مرة أخرى أو التواصل معنا للمساعدة
            </p>

            <div className="retro-window bg-red-50 mb-6">
              <div className="p-4 text-sm text-red-800">
                <h3 className="font-medium mb-2">الأسباب المحتملة:</h3>
                <ul className="text-right space-y-1">
                  <li>• رصيد غير كافي في البطاقة</li>
                  <li>• انتهاء صلاحية البطاقة</li>
                  <li>• خطأ في بيانات البطاقة</li>
                  <li>• مشكلة مؤقتة في الشبكة</li>
                </ul>
              </div>
            </div>

            <div className="retro-window bg-blue-50 mb-6">
              <div className="p-4 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">تحتاج مساعدة؟</p>
                    <p>تواصل معنا عبر البريد الإلكتروني: support@takhassus.com</p>
                    <p>أو اتصل بنا: +966 50 123 4567</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="retro-button w-full" style={{ background: "var(--accent)", color: "white" }}>
                <Link href="/checkout/payment">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  إعادة المحاولة
                </Link>
              </Button>

              <div className="flex gap-3">
                <Button asChild variant="outline" className="retro-button flex-1 bg-transparent">
                  <Link href="/cart">العودة للسلة</Link>
                </Button>
                <Button asChild variant="outline" className="retro-button flex-1 bg-transparent">
                  <Link href="/">العودة للرئيسية</Link>
                </Button>
              </div>
            </div>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
