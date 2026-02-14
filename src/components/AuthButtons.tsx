"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";

type User = {
  role: "client" | "freelancer";
  email?: string;
  name?: string;
};

export default function AuthButtons() {
  const { t } = useLang();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("shaal_user");
    if (!raw) return;
    try {
      setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("shaal_user");
    setUser(null);
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="mt-8 flex gap-3 justify-end flex-wrap">
        <Link
          href="/login"
          className="rounded-2xl px-6 py-3 font-semibold bg-white/10 border border-white/15 hover:bg-white/15 transition"
        >
          {t("تسجيل الدخول", "Login")}
        </Link>

        <Link
          href="/signup"
          className="rounded-2xl px-6 py-3 font-semibold text-black"
          style={{
            background:
              "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))",
          }}
        >
          {t("إنشاء حساب", "Sign up")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex items-center gap-3 justify-end flex-wrap">
      <div className="text-sm text-white/70">
        {t("مرحبًا", "Hello")}{" "}
        <span className="text-white font-semibold">
          {user.name || user.email || t("مستخدم", "User")}
        </span>{" "}
        •{" "}
        <span className="text-white/60">
          {user.role === "client" ? t("عميل", "Client") : t("فريلانسر", "Freelancer")}
        </span>
      </div>

      <Link
        href="/dashboard"
        className="rounded-2xl px-5 py-3 font-semibold bg-white/10 border border-white/15 hover:bg-white/15 transition"
      >
        {t("لوحة التحكم", "Dashboard")}
      </Link>

      <button
        onClick={logout}
        className="rounded-2xl px-5 py-3 font-semibold text-black"
        style={{
          background:
            "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))",
        }}
      >
        {t("تسجيل الخروج", "Logout")}
      </button>
    </div>
  );
}
