"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import PixelIcon from "./pixel-icon";

export default function CircularCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Animation speed: lower = faster, higher = slower
  const ROTATION_SPEED = 40; // seconds for one full rotation
  
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
    if (!containerRef.current || cardsRef.current.length === 0) return;

    const cards = cardsRef.current.filter((card): card is HTMLDivElement => card !== null);
    const totalCards = cards.length;
    const radius = window.innerWidth < 640 ? 180 : window.innerWidth < 1024 ? 280 : 350;
    
    // Position cards in a circle initially
    cards.forEach((card, i) => {
      const angle = (i / totalCards) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      gsap.set(card, {
        x,
        y,
        rotation: 0
      });
    });

    // Create rotation animation
    const timeline = gsap.timeline({ repeat: -1 });
    
    timeline.to(cards, {
      duration: ROTATION_SPEED,
      ease: "none",
      rotation: 360,
      transformOrigin: "center center",
      modifiers: {
        rotation: (rotation) => {
          // Keep rotating continuously
          return parseFloat(rotation as string) % 360;
        }
      },
      onUpdate: function() {
        // Update position of each card as container rotates
        cards.forEach((card, i) => {
          const currentRotation = gsap.getProperty(card, "rotation") as number;
          const angle = ((i / totalCards) * Math.PI * 2) + (currentRotation * Math.PI / 180);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          gsap.set(card, {
            x,
            y,
            rotation: currentRotation
          });
        });
      }
    });

    // Handle window resize
    const handleResize = () => {
      const newRadius = window.innerWidth < 640 ? 180 : window.innerWidth < 1024 ? 280 : 350;
      cards.forEach((card, i) => {
        const currentRotation = (gsap.getProperty(card, "rotation") as number) || 0;
        const angle = ((i / totalCards) * Math.PI * 2) + (currentRotation * Math.PI / 180);
        const x = Math.cos(angle) * newRadius;
        const y = Math.sin(angle) * newRadius;
        
        gsap.set(card, { x, y });
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      timeline.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden py-20">
      <div className="relative w-full h-full flex items-center justify-center">
        <div 
          ref={containerRef}
          className="relative"
          style={{ 
            width: '100%',
            height: '100%',
            minHeight: '600px'
          }}
        >
          {colleges.map((college, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-56 lg:w-64"
              style={{ transformOrigin: 'center center' }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow duration-300 border-2 border-purple-100">
                <div className="text-4xl mb-4">
                  <PixelIcon type={college.icon} className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  {college.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {college.desc}
                </p>
              </div>
            </div>
          ))}
          
          {/* Center decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-lg flex items-center justify-center">
            <span className="text-3xl sm:text-4xl">🎓</span>
          </div>
        </div>
      </div>
    </div>
  );
}