"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LANGUAGE_NAMES = {
  english: "English",
  hindi: "हिंदी",
  urdu: "اردو"
};

const LANGUAGE_FLAGS = {
  english: "🇬🇧",
  hindi: "🇮🇳",
  urdu: "🇵🇰"
};

export default function LanguageSwitcher({ slug, currentLanguage }) {
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await fetch(`/api/blogs?search=${slug}&limit=100`);
        const data = await response.json();
        
        // Filter blogs by slug to find all language versions
        const versions = data.blogs
          ?.filter((blog) => blog.slug === slug)
          .map((blog) => blog.language || "english")
          .sort() || [];
        
        setAvailableLanguages(versions);
      } catch (error) {
        console.error("Failed to fetch available languages:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLanguages();
  }, [slug]);

  if (loading || availableLanguages.length <= 1) {
    return null;
  }

  return (
    <div className="my-8 p-4 rounded-lg border border-stone-200 bg-stone-50">
      <p className="text-sm font-semibold text-stone-600 mb-3">Read in other languages:</p>
      <div className="flex flex-wrap gap-2">
        {availableLanguages.map((lang) => (
          <Link
            key={lang}
            href={`/blog/${lang}/${slug}`}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              lang === currentLanguage
                ? "bg-accent text-white shadow-md"
                : "bg-white border border-stone-200 text-stone-700 hover:border-accent hover:text-accent"
            }`}
          >
            <span className="text-lg">{LANGUAGE_FLAGS[lang] || "🌐"}</span>
            <span>{LANGUAGE_NAMES[lang] || lang}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
