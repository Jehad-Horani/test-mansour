"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import PixelIcon from "./pixel-icon";

export default function Carousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselRef.current) return;

    const el = carouselRef.current;

    const originalCards = Array.from(el.children) as HTMLElement[];

    // عمل نسخة كاملة من الكروت ووضعها بعد الأصلية
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      el.appendChild(clone);
    });

    // حساب الطول الكامل للكروت الأصلية
    let totalWidth = 0;
    originalCards.forEach(card => {
      totalWidth += (card as HTMLElement).offsetWidth + 16; // + gap
    });

    gsap.to(el, {
      x: `-=${totalWidth}`,
      ease: "linear",
      duration: 30,
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      }
    });
  }, []);

  return (
    <div className="carousel-container" style={{ overflow: "hidden" }}>
      <div
        ref={carouselRef}
        className="carousel-track flex gap-4"
        style={{ display: "flex" }}
      >
        {/* كلية الحقوق */}
        <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
          <PixelIcon type="gavel" className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            كلية الحقوق
          </h3>
          <p className="text-sm text-gray-600">القانون والشريعة والعدالة</p>
        </div>

        {/* كلية تكنولوجيا المعلومات */}
        <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
          <PixelIcon type="code" className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            كلية تكنولوجيا المعلومات
          </h3>
          <p className="text-sm text-gray-600">
            البرمجة والشبكات والأمن السيبراني
          </p>
        </div>

        {/* كلية إدارة الأعمال */}
        <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
          <PixelIcon type="briefcase" className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            كلية إدارة الأعمال
          </h3>
          <p className="text-sm text-gray-600">
            الإدارة والتسويق والمحاسبة
          </p>
        </div>

        {/* كلية العلوم */}
        <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
          <PixelIcon type="atom" className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            كلية العلوم
          </h3>
          <p className="text-sm text-gray-600">
            الفيزياء والكيمياء والأحياء والرياضيات
          </p>
        </div>

        {/* كلية الطب */}
        <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
          <PixelIcon type="stethoscope" className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            كلية الطب
          </h3>
          <p className="text-sm text-gray-600">
            الطب البشري والتخصصات الطبية
          </p>
        </div>

        {/* كلية الصيدلة */}
        <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
          <PixelIcon type="capsules" className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            كلية الصيدلة
          </h3>
          <p className="text-sm text-gray-600">
            الأدوية والعلاج والعلوم الصيدلانية
          </p>
        </div>

        {/* كلية الهندسة */}
        <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
          <PixelIcon type="cogs" className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            كلية الهندسة
          </h3>
          <p className="text-sm text-gray-600">
            الهندسة المدنية والمعمارية والكهربائية
          </p>
        </div>

        {/* كلية الآداب */}
        <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
          <PixelIcon type="book-open" className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            كلية الآداب
          </h3>
          <p className="text-sm text-gray-600">
            اللغة العربية، الإنجليزية، والتاريخ
          </p>
        </div>

        {/* كلية الإعلام */}
        <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
          <PixelIcon type="mic" className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            كلية الإعلام
          </h3>
          <p className="text-sm text-gray-600">
            الصحافة والإذاعة والتلفزيون
          </p>
        </div>

        {/* كلية الفنون */}
        <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
          <PixelIcon type="palette" className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            كلية الفنون
          </h3>
          <p className="text-sm text-gray-600">
            الموسيقى، التصميم والفنون الجميلة
          </p>
        </div>

        {/* كلية التمريض */}
        <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
          <PixelIcon type="heartbeat" className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            كلية التمريض
          </h3>
          <p className="text-sm text-gray-600">
            الرعاية الصحية والتمريض السريري
          </p>
        </div>

        {/* كلية الشريعة */}
        <div className="retro-window bg-white rounded-xl shadow-lg min-w-[250px] p-6 text-center">
          <PixelIcon type="mosque" className="w-12 h-12 mx-auto mb-4" />
          <h3 className="font-bold mb-2" style={{ color: "var(--ink)" }}>
            كلية الشريعة
          </h3>
          <p className="text-sm text-gray-600">
            الشريعة الإسلامية وأصول الدين
          </p>
        </div>
      </div>
    </div>
  );
}
