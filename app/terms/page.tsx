"use client"

import { RetroWindow } from "@/components/retro-window"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen p-4">
      <RetroWindow title="شروط الاستخدام" className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">شروط الاستخدام</h1>
            <p className="text-gray-600">آخر تحديث: ديسمبر 2024</p>
          </div>

          <div className="space-y-6 text-black">
            <section>
              <h2 className="text-xl font-bold mb-3">1. قبول الشروط</h2>
              <p className="text-gray-700 leading-relaxed">
                باستخدام منصة تخصص، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط،
                يرجى عدم استخدام المنصة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. وصف الخدمة</h2>
              <p className="text-gray-700 leading-relaxed">
                تخصص هي منصة تعليمية تقدم دورات ومواد تعليمية في مختلف التخصصات الأكاديمية. نحن نوفر محتوى تعليمي عالي
                الجودة للطلاب والمهتمين بالتعلم.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. حقوق المستخدم والتزاماته</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>يحق للمستخدم الوصول إلى المحتوى التعليمي المتاح</li>
                <li>يلتزم المستخدم بعدم مشاركة بيانات الدخول مع الآخرين</li>
                <li>يلتزم المستخدم بعدم نسخ أو توزيع المحتوى دون إذن</li>
                <li>يحق للمستخدم إلغاء الاشتراك في أي وقت</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. الملكية الفكرية</h2>
              <p className="text-gray-700 leading-relaxed">
                جميع المحتويات المتاحة على المنصة محمية بحقوق الطبع والنشر. لا يجوز نسخ أو توزيع أو تعديل أي محتوى دون
                الحصول على إذن كتابي مسبق.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. الدفع والاشتراكات</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>الأسعار المعلنة شاملة لضريبة القيمة المضافة</li>
                <li>يتم تجديد الاشتراكات تلقائياً ما لم يتم إلغاؤها</li>
                <li>لا توجد استردادات للمبالغ المدفوعة إلا في حالات خاصة</li>
                <li>نحتفظ بالحق في تغيير الأسعار مع إشعار مسبق</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. إنهاء الخدمة</h2>
              <p className="text-gray-700 leading-relaxed">
                نحتفظ بالحق في إنهاء أو تعليق حسابك في حالة انتهاك هذه الشروط. كما يمكنك إنهاء حسابك في أي وقت من خلال
                إعدادات الحساب.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. إخلاء المسؤولية</h2>
              <p className="text-gray-700 leading-relaxed">
                المنصة تقدم المحتوى "كما هو" دون أي ضمانات. لا نتحمل مسؤولية أي أضرار قد تنتج عن استخدام المنصة أو
                المحتوى المتاح عليها.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. تعديل الشروط</h2>
              <p className="text-gray-700 leading-relaxed">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعار المستخدمين بأي تغييرات جوهرية عبر البريد
                الإلكتروني أو إشعارات المنصة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. التواصل</h2>
              <p className="text-gray-700 leading-relaxed">
                لأي استفسارات حول هذه الشروط، يمكنك التواصل معنا عبر البريد الإلكتروني: support@takhassus.com
              </p>
            </section>
          </div>

          <div className="text-center pt-6 border-t">
            <Button asChild className="retro-button">
              <Link href="/">العودة للصفحة الرئيسية</Link>
            </Button>
          </div>
        </div>
      </RetroWindow>
    </div>
  )
}
