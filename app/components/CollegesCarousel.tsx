"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { RetroWindow } from "@/app/components/retro-window";
import PixelIcon from "@/app/components/pixel-icon";

export default function CollegesCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carouselRef.current) {
      const el = carouselRef.current;

      // نسخ الكروت عشان الحركة تكون loop
      const clone = el.innerHTML;
      el.innerHTML += clone;

      const totalWidth = el.scrollWidth / 2;

      gsap.to(el, {
        x: -totalWidth,
        duration: 30,
        ease: "linear",
        repeat: -1,
      });
    }
  }, []);

  return (
    <section className="py-12 px-4">
      <div className="max-w-full mx-auto overflow-hidden">
        <RetroWindow title="الكليات المتاحة">
          <div
            ref={carouselRef}
            className="flex space-x-6 whitespace-nowrap"
            style={{ display: "flex" }}
          >
            {/* كلية الحقوق */}
            <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] flex-shrink-0 p-6 text-center">
              <PixelIcon type="gavel" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold mb-2">كلية الحقوق</h3>
              <p className="text-sm text-gray-600">القانون والشريعة والعدالة</p>
            </div>

            {/* كلية تكنولوجيا المعلومات */}
            <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] flex-shrink-0 p-6 text-center">
              <PixelIcon type="code" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold mb-2">كلية تكنولوجيا المعلومات</h3>
              <p className="text-sm text-gray-600">البرمجة والشبكات والأمن السيبراني</p>
            </div>

            {/* كلية إدارة الأعمال */}
            <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] flex-shrink-0 p-6 text-center">
              <PixelIcon type="briefcase" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold mb-2">كلية إدارة الأعمال</h3>
              <p className="text-sm text-gray-600">الإدارة والتسويق والمحاسبة</p>
            </div>

            {/* كلية العلوم */}
            <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] flex-shrink-0 p-6 text-center">
              <PixelIcon type="atom" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold mb-2">كلية العلوم</h3>
              <p className="text-sm text-gray-600">الفيزياء والكيمياء والأحياء والرياضيات</p>
            </div>

            {/* كلية الطب */}
            <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] flex-shrink-0 p-6 text-center">
              <PixelIcon type="stethoscope" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold mb-2">كلية الطب</h3>
              <p className="text-sm text-gray-600">الطب البشري والتخصصات الطبية</p>
            </div>

            {/* كلية الصيدلة */}
            <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] flex-shrink-0 p-6 text-center">
              <PixelIcon type="capsules" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold mb-2">كلية الصيدلة</h3>
              <p className="text-sm text-gray-600">الأدوية والعلاج والعلوم الصيدلانية</p>
            </div>

            {/* كلية الهندسة */}
            <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] flex-shrink-0 p-6 text-center">
              <PixelIcon type="cogs" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold mb-2">كلية الهندسة</h3>
              <p className="text-sm text-gray-600">الهندسة المدنية والمعمارية والكهربائية</p>
            </div>

            {/* كلية الآداب */}
            <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] flex-shrink-0 p-6 text-center">
              <PixelIcon type="book-open" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="font-bold mb-2">كلية الآداب</h3>
              <p className="text-sm text-gray-600">اللغة العربية، الإنجليزية، والتاريخ</p>
            </div>
          </div>
        </RetroWindow>
      </div>
    </section>
  );
}
