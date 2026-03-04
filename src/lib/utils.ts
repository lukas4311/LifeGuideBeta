import { ModuleSource } from "@/components/ModuleDetailLegacy";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createPageUrl(pageName: string) {
    return '/' + pageName.replace(/ /g, '-');
}

export function getSourceTexts(
  source: ModuleSource,
  preferredLang: string = 'cs'
): { title: string; description: string } {
  const langs = [
    preferredLang,
    'en',  // fallback
    ...Object.keys(source.translations).filter(l => l !== preferredLang)
  ];

  for (const lang of langs) {
    const t = source.translations[lang];
    if (t?.title) {
      return {
        title: t.title,
        description: t.description || '',
      };
    }
  }

  // bezpečný fallback
  return {
    title: `No translation for source ${source.id}`,
    description: '',
  };
}