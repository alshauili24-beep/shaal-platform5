"use client";

import Navbar from "@/components/Navbar";
import ServicesSolar from "@/components/ServicesSolar";
import RequestService from "@/components/RequestService";
import HowItWorks from "@/components/HowItWorks";
import Contact from "@/components/Contact";
import { useLang } from "@/components/LanguageProvider";
import Image from "next/image";
import AuthButtons from "@/components/AuthButtons";
import { Instagram, Twitter, Linkedin, Youtube } from "lucide-react";



export default function Home() {
  const { t } = useLang();

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full pt-24">
        {/* HERO */}
        <section id="home" className="relative min-h-[90vh] flex items-center">
          {/* Background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#071f25] via-[#0b3a45] to-[#071f25]" />

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="text-right">
              <span className="inline-block mb-4 px-4 py-1 rounded-full text-sm bg-white/10 border border-white/15">
                {t(
                  "أول منصة عمانية لربط العملاء بالفريلانسر",
                  "The first Omani platform connecting clients & freelancers"
                )}
              </span>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                {t("نبني لك فريقك…", "We build your team…")}
                <br />
                <span className="text-[var(--shaal-orange)]">
                  {t(
                    "ونحوّل فكرتك إلى نتيجة ملموسة",
                    "and turn your idea into real results"
                  )}
                </span>
              </h1>

              <p className="mt-6 text-white/80 leading-relaxed">
                {t(
                  "شعل للحلول الذكية تجمع بين التصميم، التطوير، والتسويق المرئي… مع تجربة منظمة تضمن الجودة وسرعة التسليم.",
                  "SHAAL Smart Solutions combines design, development, and visual marketing with a structured experience that ensures quality and fast delivery."
                )}
              </p>

              <div className="mt-8 flex gap-3 justify-end flex-wrap">
                <a
                  href="#services"
                  className="rounded-2xl px-6 py-3 font-semibold text-black"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))",
                  }}
                >
                  {t("استكشف الخدمات", "Explore Services")}
                </a>

                <a
                  href="#contact"
                  className="rounded-2xl px-6 py-3 font-semibold bg-white/10 border border-white/15 hover:bg-white/15 transition"
                >
                  {t("تواصل معنا", "Contact Us")}
                </a>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-6 text-right">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xl font-black">100+</div>
                  <div className="text-sm text-white/70">
                    {t("مشروع مُنجز", "Delivered Projects")}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xl font-black">24/7</div>
                  <div className="text-sm text-white/70">
                    {t("متابعة ودعم", "Support")}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xl font-black">QA</div>
                  <div className="text-sm text-white/70">
                    {t("ضمان جودة", "Quality Assurance")}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative w-full h-full flex items-center justify-center">
              {/* Glow */}
              <div className="absolute inset-0 rounded-full blur-2xl opacity-40"
                style={{
                  background:
                    "radial-gradient(circle at 40% 35%, rgba(251,125,20,.45), rgba(24,161,182,.35), transparent 70%)",
                }}
              />

              {/* Logo */}
              <div className="relative w-[140px] h-[140px] md:w-[170px] md:h-[170px]">
                <Image
                  src="/logo.png"
                  alt="SHAAL Logo"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_12px_40px_rgba(251,125,20,.45)]"
                />
              </div>
            </div>
          </div>

        </section>

        {/* WHY */}
        <section id="why" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-right">
              <h2 className="text-3xl font-bold">{t("ليش شعل؟", "Why SHAAL?")}</h2>
              <p className="mt-2 text-white/80 leading-relaxed">
                {t(
                  "لأننا نشتغل بنظام واضح: جودة + سرعة + تجربة فخمة.",
                  "Because we work with a clear system: quality, speed, and a premium experience."
                )}
              </p>
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-6 text-right">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <div className="text-lg font-bold">{t("تجربة سهلة", "Easy Experience")}</div>
                <p className="mt-2 text-white/75 text-sm leading-relaxed">
                  {t("واجهة بسيطة وسريعة للمستخدم.", "A smooth, fast, user-friendly interface.")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <div className="text-lg font-bold">{t("إدارة وجودة", "Quality Control")}</div>
                <p className="mt-2 text-white/75 text-sm leading-relaxed">
                  {t("متابعة وتسليم احترافي بوضوح.", "Professional follow-up and delivery with clarity.")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <div className="text-lg font-bold">{t("هوية فخمة", "Premium Identity")}</div>
                <p className="mt-2 text-white/75 text-sm leading-relaxed">
                  {t("تصميم يعكس الاحتراف في كل تفصيلة.", "A design that reflects professionalism in every detail.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <ServicesSolar />
            <RequestService />
          </div>
        </section>

        {/* HOW */}
        <HowItWorks />

        {/* CONTACT */}
        <Contact />

        <AuthButtons />

        {/* FOOTER */}
        <footer className="py-12 border-t border-white/10 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Left: Logo & Location */}
            <div className="flex items-center gap-4 order-2 md:order-1">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="SHAAL"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm text-white/60">{t("عُمان", "Oman")}</span>
            </div>

            {/* Center: Social Icons */}
            <div className="flex items-center gap-6 order-1 md:order-2">
              <a href="#" className="text-white/40 hover:text-[var(--shaal-orange)] transition transform hover:scale-110">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-white/40 hover:text-[var(--shaal-orange)] transition transform hover:scale-110">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-white/40 hover:text-[var(--shaal-orange)] transition transform hover:scale-110">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-white/40 hover:text-[var(--shaal-orange)] transition transform hover:scale-110">
                <Youtube className="w-6 h-6" />
              </a>
            </div>

            {/* Right: Copyright */}
            <div className="text-sm text-white/40 order-3 text-center md:text-right">
              <span>SHAAL Smart Solutions {new Date().getFullYear()} ©</span>
            </div>

          </div>
        </footer>
      </main>
    </>
  );
}
