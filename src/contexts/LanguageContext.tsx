import { createContext, useContext, useState } from 'react';

type Lang = 'de' | 'it';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (de: string, it: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'de',
  setLang: () => {},
  t: (de) => de,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('de');

  const t = (de: string, it: string) => (lang === 'de' ? de : it);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
