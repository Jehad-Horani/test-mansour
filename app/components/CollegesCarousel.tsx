"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import PixelIcon from "./pixel-icon";

export default function HorizontalScrollingCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const colleges = [
    { icon: "gavel" as const, title: "كلية الحقوق", desc: "القانون والشريعة والعدالة" },
    { icon: "code" as const, title: "كلية تكنولوجيا المعلومات", desc: "البرمجة والشبكات والأمن السيبراني" },
    { icon: "briefcase" as const, title: "كلية إدارة الأعمال", desc: "الإدارة والتسويق والمحاسبة" },
    { icon: "atom" as const, title: "كلية العلوم", desc: "الفيزياء والكيمياء والأحياء والرياضيات" },
    { icon: "stethoscope" as const, title: "كلية الطب", desc: "الطب البشري والتخصصات الطبية" },
    { icon: "capsules" as const, title: "كلية الصيدلة", desc: "الأدوية والعلاج والعلوم الصيدلانية" },
    { icon: "cogs" as const, title: "كلية الهندسة", desc: "الهندسة المدنية والمعمارية والكهربائية" },
    { icon: "book-open" as const, title: "كلية الآداب", desc: "اللغة العربية، الإنجليزية، والتاريخ" },
    { icon: "mic" as const, title: "كلية الإعلام", desc: "الصحافة والإذاعة والتلفزيون" },
    { icon: "palette" as const, title: "كلية الفنون", desc: "الموسيقى، التصميم والفنون الجميلة" },
    { icon: "heartbeat" as const, title: "كلية التمريض", desc: "الرعاية الصحية والتمريض السريري" },
    { icon: "mosque" as const, title: "كلية الشريعة", desc: "الشريعة الإسلامية وأصول الدين" }
  ];

  useEffect(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const cards = Array.from(track.children) as HTMLElement[];

    let totalWidth = 0;
    cards.forEach(card => {
      totalWidth += card.offsetWidth + 16; // 16px gap
    });

    cards.forEach(card => {
      const clone = card.cloneNode(true) as HTMLElement;
      track.appendChild(clone);
    });

    gsap.to(track, {
      x: totalWidth,
      duration: 70,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => {
          const xValue = parseFloat(x);
          return `${xValue % totalWidth}px`;
        }
      }
    });

    return () => {
      gsap.killTweensOf(track);
    };
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 md:py-16 overflow-hidden">
      {/* العنوان */}
      <div className="mb-6 md:mb-8 text-center px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
          كليات تخصص.كُم
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          استكشف جميع الكليات المتاحة
        </p>
      </div>

      {/* الكاروسيل */}
      <div className="relative">
        <div ref={trackRef} className="flex gap-4">
          {colleges.map((college, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-56 sm:w-64 md:w-72 lg:w-80 bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-shadow duration-300 border-2 border-purple-100"
            >
              <div className="mb-3 md:mb-4">
                <PixelIcon type={college.icon} className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
              </div>
              <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1 md:mb-2 text-gray-800">
                {college.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                {college.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
