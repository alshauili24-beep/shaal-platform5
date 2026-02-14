"use client";

import { useLang } from "@/components/LanguageProvider";
import { useState } from "react";

export default function Contact() {
  const { t } = useLang();
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const phone = "96896105670";
  const email = "shaalsmarts@gmail.com";
  const msg = encodeURIComponent(
    t(
      "السلام عليكم",
      "Hi"
    )
  );
  const waLink = `https://api.whatsapp.com/send?phone=${phone}&text=${msg}`;

  async function handleSuggestion() {
    if (!suggestion.trim()) return;
    setLoading(true);
    try {
      const { submitComplaint } = await import("@/actions/complaints");
      await submitComplaint(suggestion);
      alert(t("تم إرسال مقترحك بنجاح، شكرًا لك!", "Your suggestion has been sent, thank you!"));
      setSuggestion("");
    } catch (e) {
      alert(t("حدث خطأ", "An error occurred"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Contact Card */}
        <div className="glass rounded-[1.75rem] border border-white/10 p-7 md:p-10 text-right mb-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold">{t("تواصل معنا", "Contact")}</h2>
              <p className="mt-2 text-white/80 leading-relaxed">
                {t("خلّنا نفهم احتياجك بسرعة ونقترح أفضل حل.", "Tell us what you need and we’ll propose the best solution.")}
              </p>
            </div>

            <a
              href="#services"
              className="rounded-2xl px-5 py-3 font-semibold bg-white/10 border border-white/15 hover:bg-white/15 transition"
            >
              {t("رجوع للخدمات", "Back to services")}
            </a>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="text-sm text-white/60">{t("واتساب", "WhatsApp")}</div>
              <div className="mt-2 text-xl font-bold" dir="ltr">+968 9610 5670</div>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center w-full rounded-2xl px-5 py-3 font-semibold text-black"
                style={{
                  background:
                    "linear-gradient(135deg, var(--shaal-orange), var(--shaal-orange2))",
                }}
              >
                {t("ارسل رسالة واتساب", "Message on WhatsApp")}
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="text-sm text-white/60">{t("البريد الإلكتروني", "Email")}</div>
              <div className="mt-2 text-lg font-bold truncate">{email}</div>
              <a
                href={`mailto:${email}`}
                className="mt-4 inline-flex items-center justify-center w-full rounded-2xl px-5 py-3 font-semibold bg-white/10 hover:bg-white/20 text-white transition"
              >
                {t("ارسل إيميل", "Send Email")}
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="text-sm text-white/60">{t("سرعة الرد", "Response time")}</div>
              <div className="mt-2 text-xl font-bold">{t("خلال وقت قصير", "Quick reply")}</div>
              <div className="mt-3 text-sm text-white/70 leading-relaxed">
                {t("بنرد عليك ونحدد أفضل خيار حسب احتياجك.", "We’ll respond and recommend the best option for you.")}
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion / Complaint Box */}
        <div className="glass rounded-[1.75rem] border border-white/10 p-7 md:p-10 text-right">
          <h3 className="text-xl font-bold mb-4">{t("مقترح أو شكوى", "Suggestion or Complaint")}</h3>
          <p className="text-white/60 text-sm mb-4">
            {t("ارسل لنا أي ملاحظة أو مقترح لتحسين تجربتك معنا.", "Send us any note or suggestion to improve your experience with us.")}
          </p>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder={t("اكتب هنا...", "Type here...")}
            className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 h-32 resize-none"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSuggestion}
              disabled={loading || !suggestion.trim()}
              className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold transition"
            >
              {loading ? t("جاري الإرسال...", "Sending...") : t("إرسال", "Send")}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
