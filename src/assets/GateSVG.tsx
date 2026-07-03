interface Props {
  size?: number;
  open?: boolean;
}

export default function GateSVG({ size = 52, open = false }: Props) {
  // Створки уезжают под соответствующий пилон — визуально «прячутся» в кладке.
  const leftX = open ? -9 : 0;
  const rightX = open ? 9 : 0;

  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Свет слева-сверху — фронтальная грань пилона светлее слева, темнее у проёма */}
        <linearGradient id="gate-pillar-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9c876a"/>
          <stop offset="100%" stopColor="#6a5842"/>
        </linearGradient>
        <linearGradient id="gate-pillar-r" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6a5842"/>
          <stop offset="100%" stopColor="#9c876a"/>
        </linearGradient>
        <linearGradient id="gate-arch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8916f"/>
          <stop offset="100%" stopColor="#6d5c44"/>
        </linearGradient>
      </defs>

      {/* Контактная тень у основания пилонов — усиливает ощущение опоры на землю */}
      <ellipse cx="10" cy="51" rx="7" ry="1.6" fill="rgba(0,0,0,0.35)"/>
      <ellipse cx="42" cy="51" rx="7" ry="1.6" fill="rgba(0,0,0,0.35)"/>

      {/* Тёмный проём — виден насквозь, когда створки уезжают */}
      <rect x="16" y="20" width="20" height="32" fill="#1A0E08"/>

      {/* Левая створка */}
      <g style={{ transform: `translateX(${leftX}px)`, transition: "transform 0.5s ease" }}>
        <rect x="16" y="20" width="9" height="26" fill="#7B4F2E" rx="1"/>
        <rect x="16" y="24" width="5" height="2.5" fill="#AAA" rx="1"/>
        <rect x="16" y="36" width="5" height="2.5" fill="#AAA" rx="1"/>
        <circle cx="24" cy="34" r="2" fill="none" stroke="#AAA" strokeWidth="1.5"/>
      </g>

      {/* Правая створка */}
      <g style={{ transform: `translateX(${rightX}px)`, transition: "transform 0.5s ease" }}>
        <rect x="27" y="20" width="9" height="26" fill="#6B4020" rx="1"/>
        <rect x="31" y="24" width="5" height="2.5" fill="#AAA" rx="1"/>
        <rect x="31" y="36" width="5" height="2.5" fill="#AAA" rx="1"/>
        <circle cx="28" cy="34" r="2" fill="none" stroke="#AAA" strokeWidth="1.5"/>
      </g>

      {/* Каменные пилоны — рисуются поверх, скрывая уехавшие створки */}
      <rect x="4" y="16" width="12" height="36" fill="url(#gate-pillar-l)" rx="1"/>
      <rect x="36" y="16" width="12" height="36" fill="url(#gate-pillar-r)" rx="1"/>

      {/* Внутренняя тень у проёма — глубина между пилоном и створками */}
      <rect x="13" y="16" width="3" height="36" fill="rgba(0,0,0,0.25)"/>
      <rect x="36" y="16" width="3" height="36" fill="rgba(0,0,0,0.25)"/>

      {/* Скошенный верх пилонов — плоская "крыша", видимая чуть сверху */}
      <path d="M4,16 L16,16 L14,12.5 L2,12.5 Z" fill="#b9a482"/>
      <path d="M36,16 L48,16 L46,12.5 L34,12.5 Z" fill="#b9a482"/>

      {/* Арка */}
      <path d="M4,20 Q26,0 48,20 L48,16 Q26,-4 4,16 Z" fill="url(#gate-arch)"/>
      {/* Тень на внутренней (нижней) стороне арки */}
      <path d="M4,20 Q26,1.5 48,20 L48,17.5 Q26,-0.5 4,17.5 Z" fill="rgba(0,0,0,0.22)"/>
      {/* Блик на внешнем верхнем крае арки */}
      <path d="M6,15.5 Q26,-2.5 46,15.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
      <path d="M4,20 Q26,0 48,20" fill="none" stroke="#5C4A35" strokeWidth="2"/>

      {/* Каменная кладка — блоки на пилонах */}
      <line x1="4" y1="24" x2="16" y2="24" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="4" y1="32" x2="16" y2="32" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="4" y1="40" x2="16" y2="40" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="36" y1="24" x2="48" y2="24" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="36" y1="32" x2="48" y2="32" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="36" y1="40" x2="48" y2="40" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>

      {/* Факелы с лёгким мерцанием пламени */}
      <rect x="2" y="12" width="3" height="6" fill="#8B6914"/>
      <g className="gate-flame">
        <ellipse cx="3.5" cy="12" rx="2" ry="3" fill="#FF8C00"/>
        <ellipse cx="3.5" cy="11" rx="1" ry="2" fill="#FFD700"/>
      </g>
      <rect x="47" y="12" width="3" height="6" fill="#8B6914"/>
      <g className="gate-flame" style={{ animationDelay: "0.6s" }}>
        <ellipse cx="48.5" cy="12" rx="2" ry="3" fill="#FF8C00"/>
        <ellipse cx="48.5" cy="11" rx="1" ry="2" fill="#FFD700"/>
      </g>
    </svg>
  );
}
