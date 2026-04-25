import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enAiAssistant from "@/locales/en/aiAssistant.json";
import enAssets from "@/locales/en/assets.json";
import enCommon from "@/locales/en/common.json";
import enDashboard from "@/locales/en/dashboard.json";
import enNav from "@/locales/en/nav.json";
import enOnboarding from "@/locales/en/onboarding.json";
import enSettings from "@/locales/en/settings.json";
import zhCNAiAssistant from "@/locales/zh-CN/aiAssistant.json";
import zhCNAssets from "@/locales/zh-CN/assets.json";
import zhCNCommon from "@/locales/zh-CN/common.json";
import zhCNDashboard from "@/locales/zh-CN/dashboard.json";
import zhCNNav from "@/locales/zh-CN/nav.json";
import zhCNOnboarding from "@/locales/zh-CN/onboarding.json";
import zhCNSettings from "@/locales/zh-CN/settings.json";

export const defaultNS = "common";
export const supportedLngs = ["en", "zh-CN"] as const;

export const resources = {
  en: {
    common: enCommon,
    nav: enNav,
    settings: enSettings,
    dashboard: enDashboard,
    assets: enAssets,
    onboarding: enOnboarding,
    aiAssistant: enAiAssistant,
  },
  "zh-CN": {
    common: zhCNCommon,
    nav: zhCNNav,
    settings: zhCNSettings,
    dashboard: zhCNDashboard,
    assets: zhCNAssets,
    onboarding: zhCNOnboarding,
    aiAssistant: zhCNAiAssistant,
  },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "zh-CN",
    fallbackLng: "en",
    supportedLngs: [...supportedLngs],
    defaultNS,
    ns: ["common", "nav", "settings", "dashboard", "assets", "onboarding", "aiAssistant"],
    debug: import.meta.env.DEV && !import.meta.env.VITEST,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Persist user's choice across reloads; check localStorage first, then browser language.
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "wealthfolio-lang",
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
