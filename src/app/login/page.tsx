"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { loginAction } from "@/actions/auth-actions";

export default function LoginPage() {
  const { lang, t } = useLang();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isRTL = lang === "ar";

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.trim().length >= 6 && !loading;
  }, [email, password, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("redirectTo", "/dashboard");

    try {
      const res = await loginAction(undefined, formData);
      if (typeof res === "string") {
        setErrorMsg(res);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      // NextAuth redirects often throw errors in catch block in client components? 
      // No, server action redirect happens on server. client gets redirect response. 
      // But if we called it via fetch wrapper, redirect happens.
    }
  }

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen w-full pt-28 pb-20"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Background */}
        <div className="fixed inset-0 -z-10" />
        <div
          className="fixed inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(900px 600px at 15% 20%, rgba(24,161,182,.28), transparent 60%), radial-gradient(900px 600px at 85% 25%, rgba(251,125,20,.20), transparent 55%), linear-gradient(180deg, #071f25, #0b3a45)",
          }}
        />

        <div className="mx-auto w-[92%] max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: pitch */}
          <section className="order-2 lg:order-1">
            <div className="glass rounded-3xl border border-white/10 p-8">
              <span className="inline-flex items-center gap-2 text-xs bg-white/10 border border-white/15 px-3 py-1 rounded-full">
                {t("دخول آمن", "Secure login")}
              </span>

              <h1 className="mt-4 text-3xl md:text-4xl font-black leading-tight">
                {t("سجّل دخولك", "Sign in")}
                <span className="block text-white/70 text-xl md:text-2xl font-semibold mt-2">
                  {t("واكمل طلب خدمتك أو أعمالك", "and continue your requests / jobs")}
                </span>
              </h1>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <div className="px-4 py-3 rounded-2xl border border-white/10 bg-black/20">
                  <div className="font-bold">{t("عميل", "Client")}</div>
                </div>
                <div className="px-4 py-3 rounded-2xl border border-white/10 bg-black/20">
                  <div className="font-bold">{t("فريلانسر", "Freelancer")}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Right: form */}
          <section className="order-1 lg:order-2">
            <div className="glass rounded-3xl border border-white/10 p-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black">
                  {t("تسجيل الدخول", "Login")}
                </h2>

                <span className="text-xs text-white/60">
                  {t("لا حساب؟", "No account?")}{" "}
                  <Link href="/signup" className="text-white underline underline-offset-4">
                    {t("سجل الآن", "Create one")}
                  </Link>
                </span>
              </div>

              {errorMsg && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm text-white/70">
                    {t("البريد الإلكتروني", "Email")}
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("example@domain.com", "example@domain.com")}
                    className="mt-2 w-full rounded-2xl px-4 py-3 bg-black/25 border border-white/10 focus:outline-none focus:border-white/25"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70">
                    {t("كلمة المرور", "Password")}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("٦ أحرف على الأقل", "At least 6 characters")}
                    className="mt-2 w-full rounded-2xl px-4 py-3 bg-black/25 border border-white/10 focus:outline-none focus:border-white/25"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white/60">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="accent-[var(--shaal-orange)]" />
                    {t("تذكرني", "Remember me")}
                  </label>

                  <Link href="/forgot" className="hover:text-white transition">
                    {t("نسيت كلمة المرور؟", "Forgot password?")}
                  </Link>
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
                  {loading ? t("جاري الدخول...", "Signing in...") : t("دخول", "Sign in")}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
