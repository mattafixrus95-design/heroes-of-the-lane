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
        <linearGradient id="gate-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8f7c60"/>
          <stop offset="100%" stopColor="#6d5c44"/>
        </linearGradient>
      </defs>

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

      {/* Каменные пилоны + арка — рисуются поверх, скрывая уехавшие створки */}
      <rect x="4" y="16" width="12" height="36" fill="url(#gate-stone)" rx="1"/>
      <rect x="36" y="16" width="12" height="36" fill="url(#gate-stone)" rx="1"/>
      <path d="M4,20 Q26,0 48,20 L48,16 Q26,-4 4,16 Z" fill="url(#gate-stone)"/>
      <path d="M4,20 Q26,0 48,20" fill="none" stroke="#5C4A35" strokeWidth="2"/>

      {/* Каменная кладка — блоки на пилонах */}
      <line x1="4" y1="24" x2="16" y2="24" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="4" y1="32" x2="16" y2="32" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="4" y1="40" x2="16" y2="40" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="36" y1="24" x2="48" y2="24" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="36" y1="32" x2="48" y2="32" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="36" y1="40" x2="48" y2="40" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>

      {/* Факелы */}
      <rect x="2" y="12" width="3" height="6" fill="#8B6914"/>
      <ellipse cx="3.5" cy="12" rx="2" ry="3" fill="#FF8C00"/>
      <ellipse cx="3.5" cy="11" rx="1" ry="2" fill="#FFD700"/>
      <rect x="47" y="12" width="3" height="6" fill="#8B6914"/>
      <ellipse cx="48.5" cy="12" rx="2" ry="3" fill="#FF8C00"/>
      <ellipse cx="48.5" cy="11" rx="1" ry="2" fill="#FFD700"/>
    </svg>
  );
}
