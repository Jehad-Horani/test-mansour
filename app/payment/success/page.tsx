import { Button } from "@/app/components/ui/button"
import { RetroWindow } from "@/app/components/retro-window"
import { Check, Download, Mail } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const orderNumber = "ORD-2024-001234"
  const orderDate = new Date().toLocaleDateString("ar-SA")

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-2xl mx-auto">
        <RetroWindow title="تم الدفع بنجاح">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              شكراً لك! تم تأكيد طلبك
            </h1>

            <p className="text-gray-600 mb-6">تم استلام طلبك وسيتم معالجته في أقرب وقت ممكن</p>

            <div className="retro-window bg-gray-50 mb-6">
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>رقم الطلب:</span>
                  <span className="font-mono font-bold">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>تاريخ الطلب:</span>
                  <span>{orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>المبلغ المدفوع:</span>
                  <span className="font-bold" style={{ color: "var(--primary)" }}>
                    170 دينار
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>حالة الطلب:</span>
                  <span className="text-green-600 font-medium">مؤكد</span>
                </div>
              </div>
            </div>

            <div className="retro-window bg-blue-50 mb-6">
              <div className="p-4 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">تأكيد عبر البريد الإلكتروني</p>
                    <p>تم إرسال تأكيد الطلب وإيصال الدفع إلى بريدك الإلكتروني</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="retro-button w-full" style={{ background: "var(--primary)", color: "white" }}>
                <Download className="w-4 h-4 ml-2" />
                تحميل الإيصال
              </Button>

              <div className="flex gap-3">
                <Button asChild variant="outline" className="retro-button flex-1 bg-transparent">
                  <Link href="/market">متابعة التسوق</Link>
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
