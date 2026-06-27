// مكونات الأعلام SVG لجميع اللغات

// علم بريطانيا
export function UKFlag({ className = "w-12 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} style={{ borderRadius: '3px' }}>
      <clipPath id="uk-clip">
        <rect width="60" height="30" rx="2" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="30" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#uk-diag)"/>
        <clipPath id="uk-diag">
          <path d="M30,15 L60,30 L60,15 L30,0 L0,0 L0,15 L30,30 L60,30 L60,15 L30,15 L0,0 L0,15 L30,30"/>
        </clipPath>
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
  );
}

// علم سوريا الجديد (الاستقلال)
export function SyriaFlag({ className = "w-12 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 600" className={className} style={{ borderRadius: '3px' }}>
      <rect width="900" height="200" fill="#007A3D" />
      <rect y="200" width="900" height="200" fill="#FFFFFF" />
      <rect y="400" width="900" height="200" fill="#000000" />
      <g fill="#CE1126">
        <polygon points="250,300 265,340 310,340 275,365 290,405 250,380 210,405 225,365 190,340 235,340" />
        <polygon points="450,300 465,340 510,340 475,365 490,405 450,380 410,405 425,365 390,340 435,340" />
        <polygon points="650,300 665,340 710,340 675,365 690,405 650,380 610,405 625,365 590,340 635,340" />
      </g>
    </svg>
  );
}

// علم إيطاليا
export function ItalyFlag({ className = "w-12 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" className={className} style={{ borderRadius: '3px' }}>
      <rect width="1" height="2" fill="#009246"/>
      <rect x="1" width="1" height="2" fill="#fff"/>
      <rect x="2" width="1" height="2" fill="#CE2B37"/>
    </svg>
  );
}

// علم ألمانيا
export function GermanyFlag({ className = "w-12 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 5 3" className={className} style={{ borderRadius: '3px' }}>
      <rect width="5" height="1" fill="#000"/>
      <rect y="1" width="5" height="1" fill="#DD0000"/>
      <rect y="2" width="5" height="1" fill="#FFCE00"/>
    </svg>
  );
}

// علم رومانيا
export function RomaniaFlag({ className = "w-12 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 3 2" className={className} style={{ borderRadius: '3px' }}>
      <rect width="1" height="2" fill="#002B7F"/>
      <rect x="1" width="1" height="2" fill="#FCD116"/>
      <rect x="2" width="1" height="2" fill="#CE1126"/>
    </svg>
  );
}
