"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LanguageProvider";
import { registerUser } from "@/actions/auth-actions";

export default function SignupPage() {
  const { lang, t } = useLang();
  const router = useRouter();

  const [role, setRole] = useState<"Client" | "Freelancer">("Client");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isRTL = lang === "ar";
  const canSubmit =
    name.trim().length >= 2 &&
    phone.trim().length >= 8 &&
    email.trim().length > 3 &&
    password.trim().length >= 6 &&
    agree &&
    !loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("role", role.toUpperCase());
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);

    const res = await registerUser(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // Success
      router.push("/login?signup=success"); // Go to login
    }
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

        <div className="mx-auto w-[92%] max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Info */}
          <section className="order-2 lg:order-1">
            <div className="glass rounded-3xl border border-white/10 p-8">
              <span className="inline-flex items-center text-xs bg-white/10 border border-white/15 px-3 py-1 rounded-full">
                {t("ابدأ حسابك الآن", "Start your account now")}
              </span>

              <h1 className="mt-4 text-3xl md:text-4xl font-black leading-tight">
                {t("إنشاء حساب", "Create account")}
                <span className="block text-white/70 text-xl md:text-2xl font-semibold mt-2">
                  {t("وانطلق مع شعل", "and launch with SHAAL")}
                </span>
              </h1>

              <p className="mt-4 text-white/70 leading-relaxed">
                {t("اختر نوع الحساب ثم أدخل بياناتك.", "Pick an account type and enter your details.")}
              </p>

              <div className="mt-6 text-sm text-white/70 space-y-2">
                <div>• {t("واجهة عربية/إنجليزية", "Arabic/English UI")}</div>
                <div>• {t("هوية شعل (Teal / Orange)", "SHAAL colors (Teal / Orange)")}</div>
              </div>
            </div>
          </section>

          {/* Right Form */}
          <section className="order-1 lg:order-2">
            <div className="glass rounded-3xl border border-white/10 p-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black">{t("سجّل الآن", "Sign up")}</h2>
                <Link href="/login" className="text-xs text-white/70 hover:text-white transition">
                  {t("لديك حساب؟ دخول", "Have an account? Login")}
                </Link>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Role */}
              <div className="mt-5">
                <div className="text-sm text-white/70 mb-2">{t("نوع الحساب", "Account type")}</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("Client")}
                    className={[
                      "rounded-2xl px-4 py-3 border transition text-sm",
                      role === "Client"
                        ? "bg-white/10 border-white/20"
                        : "bg-black/20 border-white/10 hover:bg-white/5",
                    ].join(" ")}
                  >
                    <div className="font-bold">{t("عميل", "Client")}</div>
                    <div className="text-xs text-white/60 mt-1">{t("طلب خدمة", "Request service")}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("Freelancer")}
                    className={[
                      "rounded-2xl px-4 py-3 border transition text-sm",
                      role === "Freelancer"
                        ? "bg-white/10 border-white/20"
                        : "bg-black/20 border-white/10 hover:bg-white/5",
                    ].join(" ")}
                  >
                    <div className="font-bold">{t("فريلانسر", "Freelancer")}</div>
                    <div className="text-xs text-white/60 mt-1">{t("استلام مهام", "Receive tasks")}</div>
                  </button>
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm text-white/70">{t("الاسم", "Name")}</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-2xl px-4 py-3 bg-black/25 border border-white/10 focus:outline-none focus:border-white/25"
                    placeholder={t("مثال: طه الشعيلي", "e.g. Taha Al-Shaaili")}
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70">{t("رقم الهاتف", "Phone number")}</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 w-full rounded-2xl px-4 py-3 bg-black/25 border border-white/10 focus:outline-none focus:border-white/25"
                    placeholder={t("مثال: 94720577", "e.g. 94720577")}
                    inputMode="tel"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70">{t("البريد الإلكتروني", "Email")}</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-2xl px-4 py-3 bg-black/25 border border-white/10 focus:outline-none focus:border-white/25"
                    placeholder="example@domain.com"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70">{t("كلمة المرور", "Password")}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-2xl px-4 py-3 bg-black/25 border border-white/10 focus:outline-none focus:border-white/25"
                    placeholder={t("٦ أحرف على الأقل", "At least 6 characters")}
                  />
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 text-sm text-white/70 select-none">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                  <span>
                    {t("أوافق على الشروط والأحكام وسياسة الخصوصية", "I agree to Terms & Privacy Policy")}
                  </span>
                </label>

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
                  {loading ? t("جاري إنشاء الحساب...", "Creating account...") : t("إنشاء حساب", "Create account")}
                </button>

                <div className="flex items-center justify-between text-xs text-white/60">
                  <Link href="/" className="hover:text-white transition">
                    {t("العودة للرئيسية", "Back to home")}
                  </Link>
                  <Link href="/login" className="hover:text-white transition">
                    {t("دخول", "Login")}
                  </Link>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
