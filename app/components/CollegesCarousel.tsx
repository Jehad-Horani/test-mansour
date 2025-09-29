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

      // نسخ العناصر عشان الحركة تكون سلسة بدون توقف
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
            {/* هنا نضيف كل الكليات */}
            {[
              { type: "gavel", name: "كلية الحقوق", desc: "القانون والشريعة والعدالة" },
              { type: "code", name: "كلية تكنولوجيا المعلومات", desc: "البرمجة والشبكات والأمن السيبراني" },
              { type: "briefcase", name: "كلية إدارة الأعمال", desc: "الإدارة والتسويق والمحاسبة" },
              { type: "atom", name: "كلية العلوم", desc: "الفيزياء والكيمياء والأحياء والرياضيات" },
              { type: "stethoscope", name: "كلية الطب", desc: "الطب البشري والتخصصات الطبية" },
              { type: "capsules", name: "كلية الصيدلة", desc: "الأدوية والعلاج والعلوم الصيدلانية" },
              { type: "cogs", name: "كلية الهندسة", desc: "الهندسة المدنية والمعمارية والكهربائية" },
              { type: "book-open", name: "كلية الآداب", desc: "اللغة العربية، الإنجليزية، والتاريخ" },
            ].map((college, idx) => (
              <div key={idx} className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] flex-shrink-0 p-6 text-center">
                <PixelIcon type={college.type} className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-bold mb-2">{college.name}</h3>
                <p className="text-sm text-gray-600">{college.desc}</p>
              </div>
            ))}
          </div>
        </RetroWindow>
      </div>
    </section>
  );
}
