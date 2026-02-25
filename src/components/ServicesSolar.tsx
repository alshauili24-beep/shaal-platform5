"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/LanguageProvider";

type Service = {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  orbitRadius: number; // px
  planetSize: number; // px
  speedSec: number; // seconds per rotation
  phaseDeg: number; // starting angle
  accent: "teal" | "orange";
};

export default function ServicesSolar() {
  const { t } = useLang();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isHoveringSystem, setIsHoveringSystem] = useState(false);

  const services: Service[] = useMemo(
    () => [
      {
        id: "social",
        titleAr: "إدارة منصات التواصل",
        titleEn: "Social Media Management",
        descAr: "خطة محتوى + تصميم + جدولة + تقارير أداء ورفع التفاعل.",
        descEn: "Content plan + design + scheduling + performance reports & growth.",
        orbitRadius: 120,
        planetSize: 16,
        speedSec: 25,
        phaseDeg: 0,
        accent: "teal",
      },
      {
        id: "dev",
        titleAr: "تطوير المواقع والتطبيقات",
        titleEn: "Web & App Development",
        descAr: "مواقع حديثة + صفحات هبوط + أنظمة بسيطة + أداء سريع وتجربة ممتازة.",
        descEn: "Modern websites + landing pages + simple systems + fast performance & UX.",
        orbitRadius: 165,
        planetSize: 20,
        speedSec: 35,
        phaseDeg: 120,
        accent: "teal",
      },
      {
        id: "design",
        titleAr: "تصميم الجرافيك",
        titleEn: "Graphic Design",
        descAr: "هوية + بوستات + إعلانات + تصاميم احترافية متناسقة مع البراند.",
        descEn: "Branding + posts + ads + professional visuals aligned with your brand.",
        orbitRadius: 210,
        planetSize: 22,
        speedSec: 45,
        phaseDeg: 240,
        accent: "orange",
      },
      {
        id: "video",
        titleAr: "تصوير ومونتاج",
        titleEn: "Video Production",
        descAr: "تصوير Reels + مونتاج سريع + ستايل فخم + سكربت هوك و CTA.",
        descEn: "Reels shooting + fast editing + premium style + hook & CTA scripting.",
        orbitRadius: 255,
        planetSize: 18,
        speedSec: 55,
        phaseDeg: 300,
        accent: "orange",
      },
    ],
    []
  );

  const active = services.find((s) => s.id === activeId) || null;

  return (
    <section className="glass rounded-[2rem] border border-white/10 p-8 md:p-12 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.03),_transparent_70%)] pointer-events-none" />

      <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* LEFT: Text Content */}
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              {t("خدماتنا بطريقة مختلفة", "Services, in a different way")}
            </h2>
            <p className="mt-4 text-white/60 text-lg leading-relaxed max-w-md">
              {t(
                "اختر كوكب الخدمة لاستكشاف التفاصيل. نظامنا الشمسي يمثل تكامل خدماتنا لدعم نمو مشروعك.",
                "Pick a service planet to view details. Our solar system represents the integration of services to support your growth."
              )}
            </p>
          </div>

          {/* Quick Selection Buttons */}
          <div className="flex flex-wrap gap-3">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border
                  ${activeId === s.id
                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {t(s.titleAr, s.titleEn)}
              </button>
            ))}
          </div>

          {/* Active Service Card */}
          <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 transition-all duration-500 ${active ? 'opacity-100 translate-y-0' : 'opacity-50 blur-sm'}`}>
            {/* Card Glow */}
            {active && (
              <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-30 ${active.accent === 'orange' ? 'bg-[var(--shaal-orange)]' : 'bg-teal-500'}`} />
            )}

            <div className="relative">
              <div className="text-sm font-bold text-white/40 uppercase tracking-widest mb-2">{t("تفاصيل الخدمة", "Service Details")}</div>
              <h3 className="text-2xl font-bold mb-3">
                {active ? t(active.titleAr, active.titleEn) : t("اختر خدمة", "Pick a service")}
              </h3>
              <p className="text-white/70 leading-relaxed mb-6">
                {active
                  ? t(active.descAr, active.descEn)
                  : t("اضغط على كوكب أو زر من القائمة لعرض التفاصيل.", "Click a planet or a button to view details.")}
              </p>

              <div className="flex gap-4">
                <a
                  href="#request"
                  className="px-6 py-3 rounded-xl font-bold text-black bg-[var(--shaal-orange)] hover:bg-[var(--shaal-orange-hover)] transition shadow-lg shadow-[var(--shaal-orange)]/20"
                >
                  {t("اطلب الخدمة", "Request Now")}
                </a>
                <a
                  href="#contact"
                  className="px-6 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition"
                >
                  {t("تواصل معنا", "Contact Us")}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Solar System */}
        <div
          className="relative h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden"
          onMouseEnter={() => setIsHoveringSystem(true)}
          onMouseLeave={() => setIsHoveringSystem(false)}
        >
          {/* Deep Space Background */}
          <div className="absolute inset-0 bg-gradient-radial from-[#0a1f26] to-transparent rounded-full opacity-50 blur-3xl transform scale-75 md:scale-90" />

          {/* Center Sun (Logo) */}
          <motion.div
            className="absolute z-20 w-24 h-24 md:w-32 md:h-32 rounded-full bg-black border border-white/10 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)]"
            whileHover={{ scale: 1.05, boxShadow: "0 0 80px rgba(255,255,255,0.15)" }}
            onClick={() => setActiveId(null)}
          >
            <div className="text-lg md:text-xl font-black tracking-wider text-white">SHAAL</div>
            <div className="text-[8px] md:text-[10px] text-white/40 font-bold tracking-[0.2em] uppercase">Connect</div>

            {/* Sun Glow Layers */}
            <div className="absolute inset-0 rounded-full border border-white/5 animate-pulse" />
            <div className="absolute -inset-3 md:-inset-4 rounded-full border border-white/5 border-dashed bg-transparent animate-[spin_10s_linear_infinite]" />
          </motion.div>

          {/* Orbits & Planets */}
          {services.map((s, idx) => {
            const isActive = activeId === s.id;
            // Responsive scaling factor
            const scale = typeof window !== 'undefined' && window.innerWidth < 768 ? 0.6 : 1;
            const radius = s.orbitRadius * scale;

            return (
              <div
                key={s.id}
                className="absolute rounded-full border border-white/10 border-dashed flex items-center justify-center transition-all duration-500"
                style={{
                  width: radius * 2,
                  height: radius * 2,
                  borderColor: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)',
                }}
              >
                {/* Planet Container - Rotates */}
                <motion.div
                  className="absolute w-full h-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: s.speedSec,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <motion.button
                    onClick={() => setActiveId(s.id)}
                    whileHover={{ scale: 1.5 }}
                    animate={{ scale: isActive ? 1.3 : 1 }}
                    className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg transition-all duration-300 z-10
                            ${s.accent === 'orange' ? 'shadow-orange-500/30' : 'shadow-teal-500/30'}
                        `}
                    style={{
                      width: s.planetSize * scale,
                      height: s.planetSize * scale,
                      background: s.accent === 'orange'
                        ? 'linear-gradient(135deg, #ff8c42, #ff5f6d)'
                        : 'linear-gradient(135deg, #26c485, #0a8f88)',
                    }}
                  >
                    {/* Label (Hidden on small mobile to avoid clutter, shows on active/hover) */}
                    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap border border-white/10 pointer-events-none transition-opacity duration-300
                            ${(isActive || (isHoveringSystem && scale > 0.7)) ? 'opacity-100' : 'opacity-0'}
                        `}>
                      {t(s.titleAr, s.titleEn)}
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
