"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { useSession, signOut } from "next-auth/react";

// Helper for initials
function getInitials(nameOrEmail?: string | null) {
  if (!nameOrEmail) return "S";
  const v = nameOrEmail.trim();
  if (!v) return "S";
  const parts = v.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return v.slice(0, 2).toUpperCase();
}

export default function NavAuth() {
  const { t, lang } = useLang();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Close on click outside
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  const user = session?.user;

  const displayName = useMemo(() => {
    if (!user) return "";
    return user.name || user.email || t("مستخدم", "User");
  }, [user, t]);

  const initials = useMemo(() => getInitials(user?.name || user?.email), [user]);

  // Handle Loading State (Optional, mostly invisible if fast)
  if (status === "loading") {
    return <div className="w-20 h-8 bg-white/5 rounded-xl animate-pulse" />;
  }

  // Not Logged In
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-xl px-3 py-2 text-sm bg-white/10 border border-white/15 hover:bg-white/15 transition"
        >
          {t("دخول", "Login")}
        </Link>

        <Link
          href="/signup"
          className="rounded-xl px-3 py-2 text-sm font-semibold text-black"
          style={{
            background:
              "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))",
          }}
        >
          {t("حساب جديد", "Sign up")}
        </Link>
      </div>
    );
  }

  // Logged In
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-2xl px-2.5 py-2 bg-white/10 border border-white/15 hover:bg-white/15 transition"
        aria-label="Account menu"
      >
        {/* Avatar */}
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center font-black text-black"
          style={{
            background:
              "linear-gradient(135deg, rgba(251,125,20,.95), rgba(24,161,182,.85))",
          }}
        >
          {initials}
        </div>

        {/* Name (Visible on mobile, just smaller) */}
        <div className="text-left">
          <div className="text-[10px] md:text-sm font-semibold leading-3 md:leading-4 max-w-[70px] xs:max-w-[100px] md:max-w-[120px] truncate">{displayName}</div>
          <div className="text-[8px] md:text-[11px] text-white/60">
            {user.role?.toUpperCase() === "CLIENT" ? t("عميل", "Client") :
              user.role?.toUpperCase() === "FREELANCER" ? t("فريلانسر", "Freelancer") :
                user.role?.toUpperCase() === "ADMIN" ? t("مدير", "Admin") : user.role}
          </div>
        </div>

        {/* caret */}
        <div className="hidden xs:block text-white/70 text-xs">▾</div>
      </button>

      {open && (
        <div
          className={[
            "absolute z-50 mt-2",
            lang === "ar" ? "left-0" : "right-0",
          ].join(" ")}
        >
          <div className="w-56 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,.45)] p-2">
            <Link
              href={
                user.role?.toUpperCase() === "ADMIN" ? "/admin" :
                  user.role?.toUpperCase() === "CLIENT" ? "/dashboard/client" :
                    "/dashboard/freelancer"
              }
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              {t("لوحة التحكم", "Dashboard")}
            </Link>

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-2xl px-4 py-3 text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              {t("الصفحة الرئيسية", "Home")}
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-2 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-black"
              style={{
                background:
                  "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))",
              }}
            >
              {t("تسجيل الخروج", "Logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
