import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { X } from "lucide-react";

// WhatsApp icon component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// بيانات الفروع
const branches = [
  {
    id: "khalid",
    name: "Khalid Hallak",
    nameAr: "خالد الحلاق",
    phone: "393337198678",
    location: {
      ar: "صقلية - كاتانيا",
      it: "Sicilia - Catania",
      en: "Sicily - Catania",
      de: "Sizilien - Catania",
      ro: "Sicilia - Catania"
    }
  },
  {
    id: "mustafa",
    name: "Mustafa Hallak",
    nameAr: "مصطفى الحلاق",
    phone: "393314775984",
    location: {
      ar: "صقلية - كاتانيا",
      it: "Sicilia - Catania",
      en: "Sicily - Catania",
      de: "Sizilien - Catania",
      ro: "Sicilia - Catania"
    }
  }
];

export function WhatsAppButton() {
  const { language, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  // رسالة ترحيبية بحسب اللغة
  const messages: Record<string, string> = {
    ar: "مرحباً، أنا مهتم بشراء شاحنة من سارا تراكس. هل يمكنكم مساعدتي؟",
    it: "Ciao, sono interessato all'acquisto di un camion da Sara Trucks. Potete aiutarmi?",
    en: "Hello, I'm interested in buying a truck from Sara Trucks. Can you help me?",
    de: "Hallo, ich interessiere mich für den Kauf eines LKWs bei Sara Trucks. Können Sie mir helfen?",
    ro: "Bună, sunt interesat să cumpăr un camion de la Sara Trucks. Mă puteți ajuta?"
  };

  // نصوص الواجهة
  const texts: Record<string, Record<string, string>> = {
    selectBranch: {
      ar: "اختر الفرع للتواصل",
      it: "Seleziona la filiale",
      en: "Select branch to contact",
      de: "Filiale auswählen",
      ro: "Selectați filiala"
    },
    tooltip: {
      ar: "تواصل معنا عبر واتساب",
      it: "Contattaci su WhatsApp",
      en: "Contact us on WhatsApp",
      de: "Kontaktieren Sie uns auf WhatsApp",
      ro: "Contactați-ne pe WhatsApp"
    }
  };

  const handleBranchClick = (phone: string) => {
    const message = encodeURIComponent(messages[language] || messages.en);
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* قائمة الفروع */}
      {isOpen && (
        <div className={`absolute bottom-20 ${dir === 'rtl' ? 'left-0' : 'right-0'} bg-white rounded-2xl shadow-2xl p-4 min-w-[280px] animate-in fade-in slide-in-from-bottom-4 duration-300`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b">
            <h3 className="font-bold text-gray-800 text-lg">
              {texts.selectBranch[language] || texts.selectBranch.en}
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* قائمة الفروع */}
          <div className="space-y-2">
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => handleBranchClick(branch.phone)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition-all duration-200 group text-left"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <WhatsAppIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                    {language === 'ar' ? branch.nameAr : branch.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {branch.location[language as keyof typeof branch.location] || branch.location.en}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* الزر الرئيسي */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative"
        aria-label={texts.tooltip[language] || texts.tooltip.en}
      >
        {/* Tooltip */}
        {!isOpen && (
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            {texts.tooltip[language] || texts.tooltip.en}
          </span>
        )}
        
        {/* Button */}
        <div className="relative">
          {/* Pulse animation */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25"></span>
          )}
          
          {/* Main button */}
          <div className={`relative w-14 h-14 ${isOpen ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110`}>
            {isOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <WhatsAppIcon className="w-8 h-8 text-white" />
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
