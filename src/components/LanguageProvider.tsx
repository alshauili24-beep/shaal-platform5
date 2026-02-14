"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "ar" | "en";

type LangCtxType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (ar: string, en: string) => string;
};

const LangCtx = createContext<LangCtxType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  // Load saved language once
  useEffect(() => {
    const saved = localStorage.getItem("shaal_lang");
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  // Apply to document + persist
  useEffect(() => {
    localStorage.setItem("shaal_lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (ar: string, en: string) => (lang === "ar" ? ar : en),
    }),
    [lang]
  );

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
