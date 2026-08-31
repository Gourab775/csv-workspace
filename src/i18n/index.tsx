import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import en from "./en";

type Lang = "en";
export type MessageKeys = keyof typeof en;

const locales: Record<Lang, Record<MessageKeys, string>> = { en };

interface I18nContextValue {
  lang: Lang;
  t: (key: MessageKeys) => string;
  toggle: () => void;
}

const I18nContext = createContext<I18nContextValue>(null!);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang] = useState<Lang>("en");

  const t = useCallback(
    (key: MessageKeys) => locales[lang][key] ?? key,
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, t, toggle: () => {} }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}

// Language toggle removed - English only
export function LangToggle() {
  return null;
}
