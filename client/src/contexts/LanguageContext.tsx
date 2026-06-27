import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '@/lib/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['ar'];
  dir: 'rtl' | 'ltr';
  direction: 'rtl' | 'ltr';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Get initial language from localStorage or browser preference
function getInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    // First, check localStorage for saved language
    const savedLanguage = localStorage.getItem('selected-language') as Language;
    if (savedLanguage && ['ar', 'en', 'it', 'de', 'ro'].includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // If no saved language, try to detect browser language
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    if (['ar', 'en', 'it', 'de', 'ro'].includes(browserLang)) {
      return browserLang as Language;
    }
  }
  // Default to English if nothing else matches
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [isHydrated, setIsHydrated] = useState(false);

  // Custom setLanguage that also saves to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('selected-language', lang);
    // Update document immediately
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  // Initialize on mount to ensure localStorage is loaded
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selected-language') as Language;
    if (savedLanguage && ['ar', 'en', 'it', 'de', 'ro'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    } else {
      // Detect browser language on first load
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      if (['ar', 'en', 'it', 'de', 'ro'].includes(browserLang)) {
        const detectedLang = browserLang as Language;
        setLanguageState(detectedLang);
        localStorage.setItem('selected-language', detectedLang);
        document.documentElement.dir = detectedLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = detectedLang;
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, isHydrated]);

  const dir = language === 'ar' ? 'rtl' : 'ltr' as 'rtl' | 'ltr';
  
  const value = {
    language,
    setLanguage,
    t: translations[language],
    dir,
    direction: dir
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
