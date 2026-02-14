"use client";

import { useLang } from "@/components/LanguageProvider";

export default function HowItWorks() {
  const { t } = useLang();

  const steps = [
    {
      n: "01",
      title: t("اختر الخدمة", "Choose a service"),
      desc: t(
        "حدد نوع الخدمة اللي تحتاجها: تصميم، تطوير، تسويق، أو إنتاج مرئي.",
        "Pick what you need: design, development, marketing, or visual production."
      ),
    },
    {
      n: "02",
      title: t("نحلل الطلب", "We review your request"),
      desc: t(
        "نراجع التفاصيل ونقترح أفضل خطة تنفيذ حسب الهدف والميزانية والوقت.",
        "We review details and propose the best plan based on goals, budget, and timeline."
      ),
    },
    {
      n: "03",
      title: t("نرشّح الفريق", "We match the right team"),
      desc: t(
        "نربطك بأفضل فريلانسر/فريق مناسب لمشروعك مع توضيح الخطوات والجدول.",
        "We match you with the best freelancer/team and define milestones clearly."
      ),
    },
    {
      n: "04",
      title: t("تنفيذ وتسليم", "Execution & delivery"),
      desc: t(
        "تنفيذ منظم + متابعة + ضمان جودة إلى أن تستلم النتيجة النهائية.",
        "Structured execution + follow-up + QA until final delivery."
      ),
    },
  ];

  return (
    <section id="how" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="text-right">
            <h2 className="text-3xl font-bold">{t("كيف نشتغل؟", "How it works")}</h2>
            <p className="mt-2 text-white/80 leading-relaxed">
              {t("خطوات بسيطة… لكن بنظام يضمن الجودة والسرعة.", "Simple steps—backed by a system that ensures quality & speed.")}
            </p>
          </div>

          <a
            href="#services"
            className="rounded-2xl px-5 py-3 font-semibold bg-white/10 border border-white/15 hover:bg-white/15 transition"
          >
            {t("استكشف الخدمات", "Explore services")}
          </a>
        </div>

        <div className="mt-10 glass rounded-[1.75rem] border border-white/10 p-6 md:p-10">
          <div className="grid lg:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div
                key={s.n}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-6 text-right"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-white/60">{t("الخطوة", "Step")}</div>
                    <div className="mt-1 text-2xl font-black">{s.n}</div>
                  </div>

                  <div
                    className="h-10 w-10 rounded-2xl border border-white/10"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(24,161,182,.25), rgba(251,125,20,.20))",
                    }}
                  />
                </div>

                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">{s.desc}</p>

                <div
                  className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-30"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(251,125,20,.55), transparent 60%)",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <div className="text-right">
              <div className="text-sm text-white/70">{t("جاهز تبدأ؟", "Ready to start?")}</div>
              <div className="text-xl font-bold">{t("خلّنا نحوّل فكرتك إلى شيء ملموس.", "Let’s turn your idea into something real.")}</div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <a
                href="#contact"
                className="rounded-2xl px-6 py-3 font-semibold bg-white/10 border border-white/15 hover:bg-white/15 transition"
              >
                {t("تواصل معنا", "Contact")}
              </a>
              <a
                href="#services"
                className="rounded-2xl px-6 py-3 font-semibold text-black"
                style={{
                  background:
                    "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))",
                }}
              >
                {t("اختر الخدمة الآن", "Pick a service")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
