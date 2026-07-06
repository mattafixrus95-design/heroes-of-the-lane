interface Props {
  size?: number;
  open?: boolean;
}

export default function GateSVG({ size = 52, open = false }: Props) {
  // Створки уезжают под соответствующий пилон — визуально «прячутся» в кладке.
  const leftX = open ? -8 : 0;
  const rightX = open ? 8 : 0;

  return (
    <svg width={size} height={size} viewBox="0 0 52 52" style={{ overflow: "visible" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gate-pillar-front" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9c876a"/>
          <stop offset="100%" stopColor="#7d6a51"/>
        </linearGradient>
        <linearGradient id="gate-arch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8916f"/>
          <stop offset="100%" stopColor="#6d5c44"/>
        </linearGradient>
      </defs>

      {/* Сдвиг всей композиции так, чтобы проём (где появляются крипы) совпадал
          с центром клетки — крипы идут именно через центр тайла, а не по его низу. */}
      <g transform="translate(2,-10)">
        {/* Контактная тень у основания пилонов */}
        <ellipse cx="11" cy="51" rx="8" ry="1.6" fill="rgba(0,0,0,0.35)"/>
        <ellipse cx="41" cy="51" rx="8" ry="1.6" fill="rgba(0,0,0,0.35)"/>

        {/* Тёмный проём — виден насквозь, когда створки уезжают */}
        <rect x="15" y="20" width="18" height="32" fill="#1A0E08"/>

        {/* Левая створка */}
        <g style={{ transform: `translateX(${leftX}px)`, transition: "transform 0.5s ease" }}>
          <rect x="15" y="20" width="8" height="26" fill="#7B4F2E" rx="1"/>
          <rect x="15" y="24" width="5" height="2.5" fill="#AAA" rx="1"/>
          <rect x="15" y="36" width="5" height="2.5" fill="#AAA" rx="1"/>
          <circle cx="22.5" cy="34" r="2" fill="none" stroke="#AAA" strokeWidth="1.5"/>
        </g>

        {/* Правая створка */}
        <g style={{ transform: `translateX(${rightX}px)`, transition: "transform 0.5s ease" }}>
          <rect x="25" y="20" width="8" height="26" fill="#6B4020" rx="1"/>
          <rect x="28" y="24" width="5" height="2.5" fill="#AAA" rx="1"/>
          <rect x="28" y="36" width="5" height="2.5" fill="#AAA" rx="1"/>
          <circle cx="27" cy="34" r="2" fill="none" stroke="#AAA" strokeWidth="1.5"/>
        </g>

        {/* Правый пилон — боковая грань (развёрнута в сторону дороги, видна раньше фронта) */}
        <polygon points="44,16 48,13 48,49 44,52" fill="#5c4c38"/>
        <line x1="44" y1="22" x2="48" y2="19" stroke="#463a29" strokeWidth="0.7" opacity="0.7"/>
        <line x1="44" y1="30" x2="48" y2="27" stroke="#463a29" strokeWidth="0.7" opacity="0.7"/>
        <line x1="44" y1="38" x2="48" y2="35" stroke="#463a29" strokeWidth="0.7" opacity="0.7"/>
        <line x1="44" y1="46" x2="48" y2="43" stroke="#463a29" strokeWidth="0.7" opacity="0.7"/>
        {/* Правый пилон — скошенный верх */}
        <polygon points="33,16 44,16 48,13 37,13" fill="#c2ac89"/>

        {/* Левый пилон — тонкая боковая грань (чуть развёрнута к нам) */}
        <polygon points="15,16 19,13 19,49 15,52" fill="#6a5940"/>
        <line x1="15" y1="22" x2="19" y2="20" stroke="#4f4230" strokeWidth="0.6" opacity="0.6"/>
        <line x1="15" y1="30" x2="19" y2="28" stroke="#4f4230" strokeWidth="0.6" opacity="0.6"/>
        <line x1="15" y1="38" x2="19" y2="36" stroke="#4f4230" strokeWidth="0.6" opacity="0.6"/>
        {/* Левый пилон — скошенный верх */}
        <path d="M4,16 L15,16 L13,12.5 L2,12.5 Z" fill="#b9a482"/>

        {/* Фронтальные грани пилонов */}
        <rect x="4" y="16" width="11" height="36" fill="url(#gate-pillar-front)" rx="1"/>
        <rect x="33" y="16" width="11" height="36" fill="url(#gate-pillar-front)" rx="1"/>

        {/* Внутренняя тень у проёма — глубина между пилоном и створками */}
        <rect x="12" y="16" width="3" height="36" fill="rgba(0,0,0,0.25)"/>
        <rect x="33" y="16" width="3" height="36" fill="rgba(0,0,0,0.25)"/>

        {/* Арка */}
        <path d="M4,20 Q26,0 48,20 L48,16 Q26,-4 4,16 Z" fill="url(#gate-arch)"/>
        <path d="M4,20 Q26,1.5 48,20 L48,17.5 Q26,-0.5 4,17.5 Z" fill="rgba(0,0,0,0.22)"/>
        <path d="M6,15.5 Q26,-2.5 46,15.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
        <path d="M4,20 Q26,0 48,20" fill="none" stroke="#5C4A35" strokeWidth="2"/>

        {/* Каменная кладка — блоки на пилонах */}
        <line x1="4" y1="24" x2="15" y2="24" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
        <line x1="4" y1="32" x2="15" y2="32" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
        <line x1="4" y1="40" x2="15" y2="40" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
        <line x1="33" y1="24" x2="44" y2="24" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
        <line x1="33" y1="32" x2="44" y2="32" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
        <line x1="33" y1="40" x2="44" y2="40" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>

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
      </g>
    </svg>
  );
}
