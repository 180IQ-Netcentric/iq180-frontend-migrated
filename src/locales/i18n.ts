import { useCallback } from "react";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next, useTranslation } from "react-i18next";
import { getCookie, setCookie } from "../utils/cookie";
import th from "./th.json";
import en from "./en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: localStorage.getItem("language") === "en" ? "en" : "th",
    debug: false,
    resources: {
      th: { common: th },
      en: { common: en },
    },
    detection: {
      order: ["cookie", "queryString"],
      // cache: ["cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
    defaultNS: "common",
  });

export type Language = "th" | "en";

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const language = i18n.language as Language;

  const changeLanguage = useCallback(
    (lang: Language) => {
      localStorage.setItem("language", language === "th" ? "th" : "en");
      i18n.changeLanguage(lang);
    },
    [i18n]
  );

  return { language, changeLanguage };
};

export default i18n;
