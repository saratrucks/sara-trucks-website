import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Users, MapPin, X } from "lucide-react";
import { useState, useEffect } from "react";

export function RecruitmentBanner() {
  const { t, dir } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed in this session
    const dismissed = sessionStorage.getItem('recruitmentBannerDismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('recruitmentBannerDismissed', 'true');
    }, 300);
  };

  const handleApply = () => {
    // Navigate to application form
    window.location.href = '/apply-representative';
  };

  if (!isVisible) return null;

  const countries = [
    { flag: '🇦🇪', code: 'AE', name: t.recruitment?.countries?.uae || 'الإمارات', nameEn: 'Emirati Arabi' },
    { flag: '🇸🇦', code: 'SA', name: t.recruitment?.countries?.saudi || 'السعودية', nameEn: 'Arabia Saudita' },
    { flag: '🇸🇾', code: 'SY', name: t.recruitment?.countries?.syria || 'سوريا', nameEn: 'Siria' },
    { flag: '🇮🇶', code: 'IQ', name: t.recruitment?.countries?.iraq || 'العراق', nameEn: 'Iraq' },
  ];

  return (
    <div 
      className={`bg-gradient-to-r from-primary via-primary/90 to-secondary text-white py-3 px-4 relative overflow-hidden transition-all duration-300 ${isAnimating ? 'opacity-0 -translate-y-full' : 'opacity-100'}`}
      dir={dir}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3 relative z-10">
        {/* Icon and Title */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
            <span className="font-bold text-lg">
              {t.recruitment?.title || '🔔 نبحث عن مندوبين!'}
            </span>
            <span className="text-white/90 text-sm md:text-base">
              {t.recruitment?.subtitle || 'انضم لفريقنا في منطقتك'}
            </span>
          </div>
        </div>

        {/* Countries */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <MapPin className="h-4 w-4 text-white/80" />
          {countries.map((country, index) => (
            <span 
              key={index}
              className="bg-white/20 px-2 py-1 rounded-full text-sm flex items-center gap-1.5 hover:bg-white/30 transition-colors cursor-default"
              title={dir === 'rtl' ? country.name : country.nameEn}
            >
              <span className="text-base">{country.flag}</span>
              <span className="font-medium text-xs uppercase tracking-wide">{country.code}</span>
              <span className="hidden md:inline">{dir === 'rtl' ? country.name : country.nameEn}</span>
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleApply}
            className="bg-white text-primary hover:bg-white/90 font-bold px-6"
            size="sm"
          >
            {t.recruitment?.apply || 'تقدم الآن'}
          </Button>
          <button 
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
