import { Globe } from 'lucide-react';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'zh-TW', label: '繁中' },
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-1 bg-card/90 backdrop-blur-md rounded-full px-2 py-1.5 clean-border shadow-lg">
        <Globe className="w-4 h-4 text-muted-foreground mr-1" />
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              language === lang.code
                ? 'bg-accent-orange text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
