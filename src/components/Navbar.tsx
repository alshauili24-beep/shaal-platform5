"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { useSession } from "next-auth/react";
import NavAuth from "@/components/NavAuth";
import NotificationBell from "@/components/NotificationBell";


type NavItem = {
  id: string;
  href: string;
  labelAr: string;
  labelEn: string;
};

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const items: NavItem[] = useMemo(
    () => [
      { id: "home", href: "#home", labelAr: "الرئيسية", labelEn: "Home" },
      { id: "services", href: "#services", labelAr: "الخدمات", labelEn: "Services" },
      { id: "how", href: "#how", labelAr: "كيف نشتغل", labelEn: "How it works" },
      { id: "contact", href: "#contact", labelAr: "تواصل", labelEn: "Contact" },
    ],
    []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on language change
    setOpen(false);
  }, [lang]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50">
        <div className="mx-auto w-[92%] max-w-6xl">
          <div
            className={[
              "rounded-3xl border border-white/10 backdrop-blur-xl",
              "bg-black/25 shadow-[0_10px_40px_rgba(0,0,0,.35)]",
              "transition-all",
              scrolled ? "py-2" : "py-3",
            ].join(" ")}
          >
            <div className="px-4 md:px-6 flex items-center justify-between gap-4">
              {/* Brand */}
              <Link
                href="/"
                className="flex items-center gap-2 md:gap-3 flex-1 md:flex-initial min-w-0"
              >
                {/* ضع شعارك في public/logo.png */}
                <div className="relative h-11 w-11 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  <Image
                    src="/logo.png"
                    alt="SHAAL"
                    fill
                    sizes="44px"
                    priority
                    className="object-contain p-1.5"
                  />
                </div>

                <div className="leading-tight truncate">
                  <div className="flex items-baseline gap-1.5 md:gap-2">
                    <span className="font-black tracking-wide text-white text-sm md:text-base">SHAAL</span>
                    <span className="text-white/60 text-sm hidden xs:inline">|</span>
                    <span className="font-semibold text-white/80 text-xs md:text-sm truncate">
                      {t("شعل للحلول الذكية", "SHAAL Smart Solutions")}
                    </span>
                  </div>
                  <div className="text-[10px] md:text-xs text-white/60 truncate">
                    {t(
                      "منصة عمانية تربط العملاء بالفريلانسرز",
                      "An Omani platform connecting clients & freelancers"
                    )}
                  </div>
                </div>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                {items.map((it) => (
                  <Link
                    key={it.id}
                    href={`/${it.href}`}
                    onClick={(e) => handleNavClick(e, it.href)}
                    className="text-white/75 hover:text-white transition"
                  >
                    {t(it.labelAr, it.labelEn)}
                  </Link>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Lang toggle */}
                <button
                  type="button"
                  onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                  className="rounded-xl px-3 py-2 text-sm bg-white/10 border border-white/15 hover:bg-white/15 transition"
                  aria-label="Toggle language"
                >
                  {lang === "ar" ? "EN" : "عربي"}
                </button>




                {/* Notification Bell */}
                <NotificationBell />

                {/* Auth buttons & User Profile */}
                <NavAuth />

                {/* Mobile Dash menu or main menu button */}
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className="md:hidden rounded-xl px-3 py-2 bg-white/10 border border-white/15 hover:bg-white/15 transition flex flex-col gap-1 items-center justify-center"
                  aria-label="Open menu"
                >
                  <span className="block w-5 h-[2px] bg-white/80" />
                  <span className="block w-5 h-[2px] bg-white/80" />
                  <span className="block w-5 h-[2px] bg-white/80" />
                </button>
              </div>

            </div>

            {/* Mobile menu */}
            {open && (
              <div className="md:hidden px-4 pb-4 pt-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3 shadow-2xl">
                  {/* Dashboard Links (if on dash) */}
                  {pathname.startsWith("/dashboard") && (
                    <div className="mb-4 space-y-2 border-b border-white/10 pb-4">
                      <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-2">
                        {t("قائمة لوحة التحكم", "Dashboard Menu")}
                      </div>
                      {/* Inject Role-based Links */}
                      {status === "authenticated" && session?.user?.role === "CLIENT" && (
                        <div className="flex flex-col gap-1">
                          <Link href="/dashboard/client" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-white/70 hover:text-white transition">{t("نظرة عامة", "Overview")}</Link>
                          <Link href="/dashboard/client/requests" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-white/70 hover:text-white transition">{t("طلباتي", "My Requests")}</Link>
                          <Link href="/dashboard/client/messages" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-white/70 hover:text-white transition">{t("الرسائل", "Messages")}</Link>
                          <Link href="/dashboard/client/settings" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-white/70 hover:text-white transition">{t("الإعدادات", "Settings")}</Link>
                        </div>
                      )}
                      {status === "authenticated" && session?.user?.role === "FREELANCER" && (
                        <div className="flex flex-col gap-1">
                          <Link href="/dashboard/freelancer" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-white/70 hover:text-white transition">{t("منصة العمل", "Overview")}</Link>
                          <Link href="/dashboard/freelancer/jobs" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-white/70 hover:text-white transition">{t("ابحث عن عمل", "Find Work")}</Link>
                          <Link href="/dashboard/freelancer/tasks" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-white/70 hover:text-white transition">{t("مهامي", "My Tasks")}</Link>
                          <Link href="/dashboard/freelancer/messages" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-white/70 hover:text-white transition">{t("الرسائل", "Messages")}</Link>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    {items.map((it) => (
                      <Link
                        key={it.id}
                        href={`/${it.href}`}
                        onClick={(e) => handleNavClick(e, it.href)}
                        className="block w-full text-left rounded-xl px-3 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition"
                      >
                        {t(it.labelAr, it.labelEn)}
                      </Link>
                    ))}

                    {/* ... other items ... */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer so content doesn't hide under navbar */}
      <div className="h-24" />


    </>
  );
}
