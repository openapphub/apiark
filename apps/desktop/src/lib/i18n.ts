import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "@/locales/ar.json";
import de from "@/locales/de.json";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";
import pt from "@/locales/pt.json";
import zh from "@/locales/zh.json";

const supportedLanguages = ["en", "zh", "ja", "ko", "de", "fr", "es", "pt", "ar"] as const;

function detectLanguage(): (typeof supportedLanguages)[number] {
  const locale = (navigator.language || "en").toLowerCase();
  const normalized = locale.split("-")[0];
  if (supportedLanguages.includes(normalized as (typeof supportedLanguages)[number])) {
    return normalized as (typeof supportedLanguages)[number];
  }
  return "en";
}

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    de: { translation: de },
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    ja: { translation: ja },
    ko: { translation: ko },
    pt: { translation: pt },
    zh: { translation: zh },
  },
  lng: detectLanguage(),
  supportedLngs: [...supportedLanguages],
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

export default i18n;
