import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RetroWindow } from "@/components/retro-window"
import Link from "next/link"
import { Save, ArrowRight } from "lucide-react"

export default function EditProfilePage() {
  return (
    <div className="min-h-screen p-4" style={{ background: "var(--panel)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="outline" className="retro-button bg-transparent mb-4">
            <Link href="/profile">
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للملف الشخصي
            </Link>
          </Button>
        </div>

        <RetroWindow title="تعديل الملف الشخصي">
          <div className="p-6">
            <form className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
                  المعلومات الشخصية
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      الاسم الكامل
                    </label>
                    <Input
                      defaultValue="أحمد محمد السالم"
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      البريد الإلكتروني
                    </label>
                    <Input
                      type="email"
                      defaultValue="ahmed.salem@example.com"
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      رقم الهاتف
                    </label>
                    <Input
                      defaultValue="+966501234567"
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      تاريخ الميلاد
                    </label>
                    <Input
                      type="date"
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>
                  المعلومات الأكاديمية
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      الجامعة
                    </label>
                    <select
                      className="w-full p-2 retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                      defaultValue="جامعة الملك سعود"
                    >
                      <option>جامعة الملك سعود</option>
                      <option>جامعة الملك عبدالعزيز</option>
                      <option>جامعة الإمام محمد بن سعود</option>
                      <option>جامعة الملك فهد للبترول والمعادن</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      التخصص
                    </label>
                    <select
                      className="w-full p-2 retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                      defaultValue="علوم الحاسب"
                    >
                      <option>علوم الحاسب</option>
                      <option>هندسة البرمجيات</option>
                      <option>القانون</option>
                      <option>الطب</option>
                      <option>إدارة الأعمال</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      المستوى الدراسي
                    </label>
                    <select
                      className="w-full p-2 retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    >
                      <option>السنة الأولى</option>
                      <option>السنة الثانية</option>
                      <option>السنة الثالثة</option>
                      <option>السنة الرابعة</option>
                      <option>دراسات عليا</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                      الرقم الجامعي
                    </label>
                    <Input
                      defaultValue="441234567"
                      className="retro-window"
                      style={{ background: "white", border: "2px inset #c0c0c0" }}
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
                  نبذة شخصية
                </label>
                <textarea
                  rows={4}
                  className="w-full p-2 retro-window resize-none"
                  style={{ background: "white", border: "2px inset #c0c0c0" }}
                  placeholder="اكتب نبذة مختصرة عن نفسك..."
                  defaultValue="طالب علوم حاسب مهتم بتطوير البرمجيات والذكاء الاصطناعي. أسعى لتطوير مهاراتي في البرمجة والمساهمة في المجتمع التقني."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="retro-button" style={{ background: "var(--primary)", color: "white" }}>
                  <Save className="w-4 h-4 ml-1" />
                  حفظ التغييرات
                </Button>
                <Button asChild variant="outline" className="retro-button bg-transparent">
                  <Link href="/profile">إلغاء</Link>
                </Button>
              </div>
            </form>
          </div>
        </RetroWindow>
      </div>
    </div>
  )
}
