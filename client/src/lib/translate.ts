// Translation service using Google Translate API (free tier)

const GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single";

interface TranslateCache {
  [key: string]: string;
}

// Cache translations to avoid repeated API calls
const translationCache: TranslateCache = {};

function getCacheKey(text: string, targetLang: string): string {
  return `${targetLang}:${text.substring(0, 100)}`;
}

export async function translateText(text: string, targetLang: string, sourceLang: string = "auto"): Promise<string> {
  if (!text || text.trim() === "") return text;
  
  // Map language codes
  const langMap: Record<string, string> = {
    ar: "ar",
    en: "en",
    it: "it",
    de: "de",
  };
  
  const target = langMap[targetLang] || "en";
  
  // Check cache first
  const cacheKey = getCacheKey(text, target);
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  
  try {
    const params = new URLSearchParams({
      client: "gtx",
      sl: sourceLang,
      tl: target,
      dt: "t",
      q: text,
    });
    
    const response = await fetch(`${GOOGLE_TRANSLATE_URL}?${params.toString()}`);
    
    if (!response.ok) {
      console.error("Translation API error:", response.status);
      return text;
    }
    
    const data = await response.json();
    
    // Extract translated text from response
    if (data && data[0]) {
      const translatedText = data[0]
        .map((item: any[]) => item[0])
        .filter((item: string | null) => item !== null)
        .join("");
      
      // Cache the result
      translationCache[cacheKey] = translatedText;
      
      return translatedText;
    }
    
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

// Hook for React components
import { useState, useEffect } from "react";

export function useTranslation(text: string | null | undefined, targetLang: string): { translatedText: string; isLoading: boolean } {
  const [translatedText, setTranslatedText] = useState(text || "");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!text) {
      setTranslatedText("");
      return;
    }
    
    // If target language is Arabic (original), no need to translate
    if (targetLang === "ar") {
      setTranslatedText(text);
      return;
    }
    
    const doTranslate = async () => {
      setIsLoading(true);
      try {
        const result = await translateText(text, targetLang, "ar");
        setTranslatedText(result);
      } catch (error) {
        setTranslatedText(text);
      } finally {
        setIsLoading(false);
      }
    };
    
    doTranslate();
  }, [text, targetLang]);
  
  return { translatedText, isLoading };
}
