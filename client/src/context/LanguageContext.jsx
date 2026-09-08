import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';
import pa from '../i18n/pa.json';

const translations = { en, hi, pa };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      const saved = localStorage.getItem('ys_lang');
      if (saved && (saved === 'hi' || saved === 'pa' || saved === 'en')) {
        return saved;
      }
    } catch (e) {}
    return 'hi'; // Default to Hindi for inclusive grassroots accessibility
  });

  useEffect(() => {
    try {
      localStorage.setItem('ys_lang', currentLang);
      document.documentElement.lang = currentLang === 'pa' ? 'pa' : currentLang === 'hi' ? 'hi' : 'en';
    } catch (e) {}
  }, [currentLang]);

  const t = (key, fallback = '') => {
    if (!key) return '';
    const val = translations[currentLang]?.[key] || translations['en']?.[key];
    return val !== undefined ? val : (fallback || key);
  };

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLang(langCode);
      try {
        localStorage.setItem('ys_lang', langCode);
        window.dispatchEvent(new CustomEvent('yojnasetu_language_changed', { detail: { lang: langCode } }));
      } catch (e) {}
    }
  };

  const isHindi = currentLang === 'hi';
  const isPunjabi = currentLang === 'pa';
  const isEnglish = currentLang === 'en';

  return (
    <LanguageContext.Provider value={{
      currentLang,
      lang: currentLang,
      changeLanguage,
      t,
      isHindi,
      isPunjabi,
      isEnglish,
      translations: translations[currentLang] || translations['en']
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
