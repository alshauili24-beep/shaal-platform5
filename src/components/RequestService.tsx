"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { submitServiceRequest } from "@/actions/requests";
import { Loader2, CheckCircle } from "lucide-react";

type ServiceOpt = {
  id: string;
  ar: string;
  en: string;
};

export default function RequestService() {
  const { t, lang } = useLang();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const services: ServiceOpt[] = useMemo(
    () => [
      { id: "social", ar: "إدارة منصات التواصل", en: "Social Media Management" },
      { id: "design", ar: "تصميم الجرافيك", en: "Graphic Design" },
      { id: "dev", ar: "تطوير المواقع والتطبيقات", en: "Web & App Development" },
      { id: "video", ar: "تصوير ومونتاج", en: "Video Production" },
      { id: "other", ar: "خدمة أخرى", en: "Other" },
    ],
    []
  );

  const budgets = useMemo(
    () => [
      {
        id: "economy",
        titleAr: "اقتصادي",
        titleEn: "Economy",
        descAr: "مناسب للمهام السريعة",
        descEn: "Best for quick tasks",
      },
      {
        id: "mid",
        titleAr: "متوسط",
        titleEn: "Standard",
        descAr: "أفضل توازن جودة/سعر",
        descEn: "Best quality/price balance",
      },
      {
        id: "pro",
        titleAr: "احترافي",
        titleEn: "Pro",
        descAr: "للبرياندات والمتطلبات الكبيرة",
        descEn: "For brands & larger requirements",
      },
    ],
    []
  );

  const [serviceId, setServiceId] = useState<string>("design");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [brief, setBrief] = useState("");
  const [budget, setBudget] = useState("mid");
  const [duration, setDuration] = useState("3-7");

  const selectedService = services.find((s) => s.id === serviceId);

  async function handleSubmit() {
    if (!name || !phone || !brief) {
      alert(t("يرجى تعبئة جميع الحقول", "Please fill all fields"));
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("service", selectedService ? t(selectedService.ar, selectedService.en) : serviceId);
    formData.append("budget", budgets.find(b => b.id === budget)?.titleEn || budget);
    formData.append("timeline", duration);
    formData.append("brief", brief);

    try {
      await submitServiceRequest(formData);
      setName("");
      setPhone("");
      setBrief("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      alert(t("حدث خطأ ما", "Something went wrong"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="request" className="mt-10">
      <div className="glass rounded-[1.75rem] border border-white/10 p-6 md:p-10">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="text-right">
            <h3 className="text-3xl font-bold">{t("اطلب خدمة الآن من شعل", "Request a service now from shaal")}</h3>
            <p className="mt-2 text-white/80">
              {t(
                "أعطنا البيانات، وخلال وقت قصير نرشّح لك أفضل فريلانسر/فريق يناسب مشروعك.",
                "Share details and we’ll quickly match you with the best freelancer/team."
              )}
            </p>
          </div>

          <a
            href="#services"
            className="rounded-2xl px-5 py-3 font-semibold bg-white/10 border border-white/15 hover:bg-white/15 transition"
          >
            {t("رجوع للخدمات", "Back to services")}
          </a>
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-right">
            <div className="text-sm text-white/60">{t("اختر نوع الخدمة", "Choose a service")}</div>

            <div className="mt-3 flex flex-wrap gap-2 justify-end">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={`rounded-2xl px-4 py-2 text-sm border transition
                    ${serviceId === s.id ? "bg-white/20 border-white/20" : "bg-white/10 border-white/15 hover:bg-white/15"}`}
                >
                  {t(s.ar, s.en)}
                </button>
              ))}
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">{t("الاسم", "Name")}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
                  placeholder={t("مثال: طه الشعيلي", "e.g. Taha Alshaaili")}
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">{t("رقم التواصل", "Phone")}</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
                  placeholder={t("مثال: 94720577", "e.g. 94720577")}
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm text-white/70 mb-2">{t("وصف الطلب (Brief)", "Request brief")}</label>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                className="w-full min-h-[140px] rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
                placeholder={t("اكتب الهدف + التفاصيل + أمثلة تعجبك + أي ملاحظات…", "Write goal + details + references + notes…")}
              />
            </div>

            <div className="mt-6 flex gap-3 justify-end flex-wrap items-center">

              {success && (
                <div className="flex items-center gap-2 text-green-400 text-sm font-bold animate-pulse">
                  <CheckCircle className="w-5 h-5" />
                  <span>{t("تم إرسال طلبك بنجاح!", "Request sent successfully!")}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || success}
                className="rounded-2xl px-8 py-3 font-semibold text-black disabled:opacity-50 flex items-center gap-2"
                style={{
                  background:
                    "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("جاري الإرسال...", "Sending...")}
                  </>
                ) : (
                  t("إرسال", "Send")
                )}
              </button>

              <a
                href="#contact"
                className="rounded-2xl px-6 py-3 font-semibold bg-white/10 border border-white/15 hover:bg-white/15 transition"
              >
                {t("تواصل معنا", "Contact")}
              </a>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-right">
            <div className="text-lg font-bold">{t("ملخص سريع", "Quick summary")}</div>
            <p className="mt-2 text-white/80 text-sm">
              {t(
                "اختر ميزانيتك ومدتك، ونضبط لك أفضل خطة تنفيذ.",
                "Choose your budget and timeline, and we’ll set the best execution plan."
              )}
            </p>

            <div className="mt-6">
              <div className="text-sm text-white/60">{t("الميزانية", "Budget")}</div>
              <div className="mt-2 grid gap-3">
                {budgets.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBudget(b.id)}
                    className={`rounded-2xl border p-4 text-right transition
                      ${budget === b.id ? "bg-white/20 border-white/20" : "bg-white/10 border-white/15 hover:bg-white/15"}`}
                  >
                    <div className="font-bold">{t(b.titleAr, b.titleEn)}</div>
                    <div className="text-xs text-white/70 mt-1">{t(b.descAr, b.descEn)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-white/60">{t("المدة المتوقعة", "Expected duration")}</div>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-white/20"
              >
                <option value="1-2">{t("1-2 يوم", "1-2 days")}</option>
                <option value="3-7">{t("3-7 أيام", "3-7 days")}</option>
                <option value="7-14">{t("7-14 يوم", "7-14 days")}</option>
                <option value="14+">{t("أكثر من 14 يوم", "14+ days")}</option>
              </select>
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-white/60">{t("الخدمة المختارة", "Selected service")}</div>
              <div className="mt-2 text-xl font-bold">
                {selectedService ? t(selectedService.ar, selectedService.en) : "-"}
              </div>
              <div className="mt-1 text-sm text-white/70">
                {t("جاهزين نبدأ…", "Ready to start…")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
