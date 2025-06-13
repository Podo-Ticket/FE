import {useState, useEffect} from 'react';
import {Language} from '../constants/text/Language';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() =>
    typeof window !== 'undefined'
      ? (localStorage.getItem('language') as Language) || Language.Korean
      : Language.Korean,
  );

  useEffect(() => {
    const handler = () => {
      setLanguage((localStorage.getItem('language') as Language) || Language.Korean);
    };

    window.addEventListener('storage', handler);
    window.addEventListener('languageChange', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('languageChange', handler);
    };
  }, []);

  return {language, setLanguage};
};
