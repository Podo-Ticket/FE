import { useState, useEffect } from "react";

export const useLanguage = () => {
  const [language, setLanguage] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("language") || "korean"
      : "korean"
  );

  useEffect(() => {
    console.log("language:", language);
  }, [language]);

  useEffect(() => {
    const handler = () => {
      setLanguage(localStorage.getItem("language") || "korean");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      setLanguage(localStorage.getItem("language") || "korean");
    };
    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  return { language, setLanguage };
};
