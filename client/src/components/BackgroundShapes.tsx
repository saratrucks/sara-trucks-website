// أشكال الشاحنات والمعدات للخلفية المتحركة

// شكل شاحنة
export function TruckShape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 60" className={className} fill="currentColor">
      {/* جسم الشاحنة */}
      <rect x="5" y="20" width="60" height="25" rx="3" />
      {/* الكابينة */}
      <path d="M65 20 L65 45 L90 45 L90 30 L80 20 Z" />
      {/* النوافذ */}
      <rect x="70" y="25" width="15" height="10" rx="2" fill="rgba(255,255,255,0.3)" />
      {/* العجلات */}
      <circle cx="25" cy="48" r="8" />
      <circle cx="75" cy="48" r="8" />
      <circle cx="25" cy="48" r="4" fill="rgba(255,255,255,0.2)" />
      <circle cx="75" cy="48" r="4" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

// شكل مقطورة
export function TrailerShape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 50" className={className} fill="currentColor">
      {/* جسم المقطورة */}
      <rect x="5" y="10" width="100" height="30" rx="2" />
      {/* خطوط التفاصيل */}
      <line x1="35" y1="10" x2="35" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <line x1="70" y1="10" x2="70" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      {/* العجلات */}
      <circle cx="30" cy="43" r="6" />
      <circle cx="50" cy="43" r="6" />
      <circle cx="80" cy="43" r="6" />
      {/* وصلة السحب */}
      <rect x="105" y="22" width="15" height="6" rx="1" />
    </svg>
  );
}

// شكل رافعة شوكية
export function ForkliftShape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 70" className={className} fill="currentColor">
      {/* الجسم الرئيسي */}
      <rect x="25" y="25" width="35" height="30" rx="3" />
      {/* المقصورة */}
      <path d="M30 25 L30 15 L55 15 L55 25" fill="none" stroke="currentColor" strokeWidth="3" />
      {/* الشوكة */}
      <rect x="5" y="50" width="25" height="4" rx="1" />
      <rect x="5" y="58" width="25" height="4" rx="1" />
      <rect x="25" y="35" width="5" height="30" />
      {/* العجلات */}
      <circle cx="35" cy="58" r="7" />
      <circle cx="55" cy="58" r="7" />
    </svg>
  );
}

// شكل حفارة
export function ExcavatorShape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 70" className={className} fill="currentColor">
      {/* الجسم */}
      <rect x="20" y="35" width="40" height="20" rx="3" />
      {/* المقصورة */}
      <rect x="25" y="20" width="25" height="18" rx="2" />
      <rect x="28" y="23" width="10" height="8" rx="1" fill="rgba(255,255,255,0.3)" />
      {/* الذراع */}
      <path d="M50 30 L70 15 L85 25 L90 40" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      {/* الدلو */}
      <path d="M88 38 L95 45 L85 50 L80 42 Z" />
      {/* الجنزير */}
      <rect x="15" y="55" width="50" height="12" rx="6" />
    </svg>
  );
}

// شكل محرك/موتور
export function EngineShape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 60" className={className} fill="currentColor">
      {/* جسم المحرك */}
      <rect x="10" y="15" width="50" height="35" rx="3" />
      {/* رأس المحرك */}
      <rect x="15" y="8" width="40" height="10" rx="2" />
      {/* التفاصيل */}
      <rect x="60" y="20" width="15" height="8" rx="2" />
      <rect x="60" y="32" width="15" height="8" rx="2" />
      {/* المروحة */}
      <circle cx="5" cy="32" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
      <line x1="5" y1="20" x2="5" y2="44" stroke="currentColor" strokeWidth="2" />
      <line x1="-7" y1="32" x2="17" y2="32" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// شكل عجلة/إطار
export function WheelShape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="currentColor">
      <circle cx="30" cy="30" r="28" />
      <circle cx="30" cy="30" r="20" fill="rgba(255,255,255,0.1)" />
      <circle cx="30" cy="30" r="8" fill="rgba(255,255,255,0.2)" />
      {/* البراغي */}
      <circle cx="30" cy="15" r="3" fill="rgba(255,255,255,0.3)" />
      <circle cx="30" cy="45" r="3" fill="rgba(255,255,255,0.3)" />
      <circle cx="15" cy="30" r="3" fill="rgba(255,255,255,0.3)" />
      <circle cx="45" cy="30" r="3" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}
