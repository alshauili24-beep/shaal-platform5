"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/components/LanguageProvider";

export default function ForgotPage() {
  const { lang, t } = useLang();

  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);

  const isRTL = lang === "ar";
  const canSubmit = value.trim().length > 3;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    // Demo فقط
    setSent(true);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full pt-28 pb-16" dir={isRTL ? "rtl" : "ltr"}>
        {/* Background */}
        <div
          className="fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(900px 600px at 15% 20%, rgba(24,161,182,.28), transparent 60%), radial-gradient(900px 600px at 85% 25%, rgba(251,125,20,.20), transparent 55%), linear-gradient(180deg, #071f25, #0b3a45)",
          }}
        />

        <div className="mx-auto w-[92%] max-w-xl">
          <div className="glass rounded-3xl border border-white/10 p-8 text-right">
            <h1 className="text-3xl font-black">{t("استعادة كلمة المرور", "Password recovery")}</h1>
            <p className="mt-2 text-white/70 leading-relaxed">
              {t(
                "أدخل بريدك الإلكتروني أو رقمك، وسنرسل لك رابط/رمز لاستعادة كلمة المرور (حاليًا تجريبي).",
                "Enter your email or phone and we’ll send a reset link/code (demo for now)."
              )}
            </p>

            {sent ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="font-bold">
                  {t("تم الإرسال ✅", "Sent ✅")}
                </div>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  {t(
                    "هذه نسخة تجريبية. لاحقًا سنربط الإرسال الحقيقي عبر OTP أو البريد.",
                    "This is a demo. Later we’ll connect real OTP/email sending."
                  )}
                </p>

                <div className="mt-4 flex gap-3 justify-end flex-wrap">
                  <Link
                    href="/login"
                    className="rounded-2xl px-5 py-3 font-semibold text-black"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))",
                    }}
                  >
                    {t("العودة للدخول", "Back to login")}
                  </Link>

                  <button
                    onClick={() => {
                      setSent(false);
                      setValue("");
                    }}
                    className="rounded-2xl px-5 py-3 font-semibold bg-white/10 border border-white/15 hover:bg-white/15 transition"
                  >
                    {t("إرسال مرة أخرى", "Send again")}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm text-white/70">
                    {t("البريد أو الرقم", "Email or phone")}
                  </label>
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="mt-2 w-full rounded-2xl px-4 py-3 bg-black/25 border border-white/10 focus:outline-none focus:border-white/25"
                    placeholder={t("example@domain.com أو 94720577", "example@domain.com or 94720577")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={[
                    "w-full rounded-2xl px-4 py-3 font-bold text-black transition",
                    canSubmit ? "" : "opacity-50 cursor-not-allowed",
                  ].join(" ")}
                  style={{
                    background:
                      "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))",
                  }}
                >
                  {t("إرسال رابط الاستعادة", "Send reset link")}
                </button>

                <div className="flex items-center justify-between text-xs text-white/60">
                  <Link href="/login" className="hover:text-white transition">
                    {t("رجوع للدخول", "Back to login")}
                  </Link>
                  <Link href="/signup" className="hover:text-white transition">
                    {t("إنشاء حساب", "Create account")}
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
