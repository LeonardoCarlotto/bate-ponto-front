// simple i18n helper that chooses between pt-BR and en based on browser language
import ptBR from "./pt-BR.json";
import en from "./en.json";

const messages = {
  "pt-BR": ptBR,
  en: en,
};

// determine locale once
let locale = "en";
if (navigator && navigator.language) {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("pt")) {
    locale = "pt-BR";
  }
}

export function t(key) {
  const msg = messages[locale] && messages[locale][key];
  return msg || key;
}

export function useTranslation() {
  return { t, locale };
}
