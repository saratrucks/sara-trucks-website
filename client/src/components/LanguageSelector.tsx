import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/translations";
import { Globe, Check, Sparkles, Heart } from "lucide-react";
import { UKFlag, SyriaFlag, ItalyFlag, GermanyFlag, RomaniaFlag } from "./flags";
import { TruckShape, TrailerShape, ForkliftShape, ExcavatorShape, EngineShape, WheelShape } from "./BackgroundShapes";

interface LanguageSelectorProps {
  onLanguageSelected: () => void;
}

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  welcomeMessage: string;
  verseTranslation: string;
}

// الآية الكريمة
const quranVerse = "إِنَّ رَبَّكَ يَبْسُطُ الرِّزْقَ لِمَن يَشَاءُ وَيَقْدِرُ إِنَّهُ كَانَ بِعِبَادِهِ خَبِيرًا بَصِيرًا";

const languages: LanguageOption[] = [
  { 
    code: "en", 
    name: "English", 
    nativeName: "English", 
    welcomeMessage: "Welcome to Sara Trucks!",
    verseTranslation: "Indeed, your Lord extends provision for whom He wills and restricts [it]. Indeed He is ever, concerning His servants, Acquainted and Seeing."
  },
  { 
    code: "ar", 
    name: "Arabic", 
    nativeName: "العربية", 
    welcomeMessage: "!أهلاً وسهلاً بك في سارة تراكس",
    verseTranslation: "" // الآية بالعربية لا تحتاج ترجمة
  },
  { 
    code: "it", 
    name: "Italian", 
    nativeName: "Italiano", 
    welcomeMessage: "Benvenuto in Sara Trucks!",
    verseTranslation: "In verità, il tuo Signore elargisce il sostentamento a chi vuole e lo restringe. Egli conosce e osserva i Suoi servi."
  },
  { 
    code: "de", 
    name: "German", 
    nativeName: "Deutsch", 
    welcomeMessage: "Willkommen bei Sara Trucks!",
    verseTranslation: "Wahrlich, dein Herr weitet die Versorgung aus, wem Er will, und bemisst sie. Er kennt und sieht Seine Diener."
  },
  { 
    code: "ro", 
    name: "Romanian", 
    nativeName: "Română", 
    welcomeMessage: "Bine ați venit la Sara Trucks!",
    verseTranslation: "Domnul tău întinde proviziile cui vrea și le restrânge. El este Cunoscător și Văzător al robilor Săi."
  },
];

// أشكال الخلفية المتحركة
const backgroundShapes = [
  { Component: TruckShape, size: 80 },
  { Component: TrailerShape, size: 100 },
  { Component: ForkliftShape, size: 60 },
  { Component: ExcavatorShape, size: 70 },
  { Component: EngineShape, size: 50 },
  { Component: WheelShape, size: 45 },
];

export function LanguageSelector({ onLanguageSelected }: LanguageSelectorProps) {
  const { setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [hoveredLang, setHoveredLang] = useState<Language | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [verseTranslation, setVerseTranslation] = useState("");

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectLanguage = (lang: Language) => {
    const selectedLanguage = languages.find(l => l.code === lang);
    setSelectedLang(lang);
    setShowParticles(true);
    setLanguage(lang);
    setWelcomeMessage(selectedLanguage?.welcomeMessage || "Welcome!");
    setVerseTranslation(selectedLanguage?.verseTranslation || "");
    
    // Save to localStorage
    localStorage.setItem("language-selected", "true");
    localStorage.setItem("selected-language", lang);
    
    // Show welcome message
    setTimeout(() => {
      setShowWelcome(true);
    }, 500);

    // Start exit animation
    setTimeout(() => {
      setIsAnimating(true);
    }, 4000);

    // Navigate after animation
    setTimeout(() => {
      onLanguageSelected();
    }, 4500);
  };

  const renderFlag = (langCode: Language) => {
    const flagClass = "w-14 h-10 transition-transform duration-300 group-hover:scale-110";
    switch (langCode) {
      case "en": return <UKFlag className={flagClass} />;
      case "ar": return <SyriaFlag className={flagClass} />;
      case "it": return <ItalyFlag className={flagClass} />;
      case "de": return <GermanyFlag className={flagClass} />;
      case "ro": return <RomaniaFlag className={flagClass} />;
      default: return null;
    }
  };

  // Generate random background shapes
  const shapes = [...Array(15)].map((_, i) => {
    const shapeIndex = i % backgroundShapes.length;
    const { Component, size } = backgroundShapes[shapeIndex];
    return {
      Component,
      size: size + Math.random() * 30,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    };
  });

  return (
    <div className={`fixed inset-0 z-[100] bg-gradient-to-br from-primary via-primary/95 to-primary-foreground/20 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      {/* Animated Background Shapes (Trucks, Trailers, Equipment) */}
      <div className="absolute inset-0 overflow-hidden">
        {shapes.map((shape, i) => {
          const ShapeComponent = shape.Component;
          return (
            <div
              key={i}
              className="absolute text-white/10 animate-float-shape"
              style={{
                width: shape.size + 'px',
                height: shape.size + 'px',
                left: shape.left + '%',
                top: shape.top + '%',
                animationDelay: shape.delay + 's',
                animationDuration: shape.duration + 's',
              }}
            >
              <ShapeComponent className="w-full h-full" />
            </div>
          );
        })}
      </div>

      {/* Selection Celebration Particles */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-celebration"
              style={{
                background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#F7DC6F'][i % 6],
                left: '50%',
                top: '50%',
                animationDelay: i * 0.03 + 's',
                '--tx': (Math.random() - 0.5) * 600 + 'px',
                '--ty': (Math.random() - 0.5) * 600 + 'px',
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Welcome Message Overlay */}
      {showWelcome && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="text-center animate-scale-in max-w-2xl mx-4">
            <div className="mb-6">
              <Heart className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-slide-up">
              {welcomeMessage}
            </h2>
            
            {/* الآية الكريمة */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-xl md:text-2xl text-amber-300 font-arabic leading-relaxed mb-3" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
              <p className="text-lg md:text-xl text-white font-arabic leading-relaxed" dir="rtl">
                {quranVerse}
              </p>
              {verseTranslation && (
                <p className="text-sm md:text-base text-white/70 mt-4 italic leading-relaxed">
                  {verseTranslation}
                </p>
              )}
              <p className="text-xs text-white/50 mt-3">
                [سورة الإسراء - الآية 30]
              </p>
            </div>
            
            <p className="text-white/70 text-lg animate-slide-up" style={{ animationDelay: '0.5s' }}>
              {selectedLang === 'ar' ? 'جاري تحميل الموقع...' : 'Loading your experience...'}
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: i * 0.2 + 's' }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`relative max-w-2xl w-full mx-4 transition-all duration-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${showWelcome ? 'scale-95 opacity-50' : 'scale-100'}`}>
        {/* Logo with pulse animation */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm mb-4 transition-all duration-500 ${showContent ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
            <div className="relative">
              <img 
                src="/images/logo.webp" 
                alt="Sara Trucks" 
                className="w-16 h-16 object-contain animate-pulse-slow"
              />
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping-slow" />
            </div>
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold text-white mb-2 transition-all duration-500 delay-200 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            Sara Trucks International
          </h1>
          <p className={`text-white/70 text-lg flex items-center justify-center gap-2 transition-all duration-500 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <Sparkles className="w-5 h-5 animate-sparkle" />
            Select your preferred language
            <Sparkles className="w-5 h-5 animate-sparkle" style={{ animationDelay: '0.5s' }} />
          </p>
        </div>

        {/* Language Grid with staggered animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              onMouseEnter={() => setHoveredLang(lang.code)}
              onMouseLeave={() => setHoveredLang(null)}
              disabled={isAnimating || showWelcome}
              className={`
                group relative p-6 rounded-2xl transition-all duration-300
                ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                ${selectedLang === lang.code 
                  ? 'bg-white text-primary scale-105 shadow-2xl ring-4 ring-white/50' 
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                }
                ${hoveredLang === lang.code && !selectedLang ? 'scale-105 shadow-xl' : ''}
                ${selectedLang && selectedLang !== lang.code ? 'opacity-50 scale-95' : ''}
              `}
              style={{ 
                transitionDelay: showContent ? `${400 + index * 100}ms` : '0ms',
              }}
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${selectedLang === lang.code ? 'opacity-100' : ''}`} />
              
              {/* Selection Indicator with animation */}
              {selectedLang === lang.code && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center animate-bounce-in shadow-lg">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Ripple effect on selection */}
              {selectedLang === lang.code && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-primary/10 animate-ripple" />
                </div>
              )}

              {/* Flag - Centered */}
              <div className="mb-4 flex items-center justify-center h-12 relative z-10">
                {renderFlag(lang.code)}
              </div>

              {/* Language Names - Centered */}
              <div className="text-center relative z-10">
                <div className={`text-xl font-bold transition-colors duration-300 ${selectedLang === lang.code ? 'text-primary' : 'text-white'}`}>
                  {lang.nativeName}
                </div>
                <div className={`text-sm transition-colors duration-300 ${selectedLang === lang.code ? 'text-primary/70' : 'text-white/60'}`}>
                  {lang.name}
                </div>
              </div>

              {/* Animated border */}
              <div className={`
                absolute inset-0 rounded-2xl border-2 transition-all duration-300
                ${selectedLang === lang.code 
                  ? 'border-primary' 
                  : hoveredLang === lang.code 
                    ? 'border-white/50' 
                    : 'border-transparent'
                }
              `} />

              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer Note with animation */}
        <p className={`text-center text-white/50 text-sm mt-8 flex items-center justify-center gap-2 transition-all duration-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`} style={{ transitionDelay: '900ms' }}>
          <Globe className="w-4 h-4 animate-spin-slow" />
          You can change the language anytime from the navigation bar
        </p>
      </div>

      {/* Custom styles for animations */}
      <style>{`
        @keyframes float-shape {
          0%, 100% { 
            transform: translateY(0) rotate(0deg) scale(1); 
            opacity: 0.1; 
          }
          25% { 
            transform: translateY(-30px) rotate(5deg) scale(1.05); 
            opacity: 0.15; 
          }
          50% { 
            transform: translateY(-15px) rotate(-3deg) scale(0.95); 
            opacity: 0.12; 
          }
          75% { 
            transform: translateY(-25px) rotate(3deg) scale(1.02); 
            opacity: 0.14; 
          }
        }
        
        @keyframes celebration {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-float-shape { animation: float-shape 15s ease-in-out infinite; }
        .animate-celebration { animation: celebration 1s ease-out forwards; }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out forwards; }
        .animate-ripple { animation: ripple 0.6s ease-out forwards; }
        .animate-shine { animation: shine 1.5s ease-in-out; }
        .animate-sparkle { animation: sparkle 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 2s ease-out infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.5s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
