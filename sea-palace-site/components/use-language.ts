"use client";

import { useEffect, useState } from "react";
import { isLanguage, restaurant, type Language } from "../lib/restaurant";

const storageKey = "sea-palace-language";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("pt");
  const copy = restaurant.copy[language];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (isLanguage(saved)) setLanguage(saved);
    } catch {
      // A language can still be selected during this visit.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = copy.locale;
  }, [copy.locale]);

  function updateLanguage(next: Language) {
    setLanguage(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // Storage is optional.
    }
  }

  return { language, copy, updateLanguage };
}
