export default function FortSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Контактная тень */}
      <ellipse cx="26" cy="50" rx="18" ry="2.2" fill="rgba(0,0,0,0.32)"/>

      {/* Боковая грань стены */}
      <polygon points="38,28 44,25 44,49 38,52" fill="#7d7d7d"/>
      <line x1="38" y1="33" x2="44" y2="30" stroke="#5a5a5a70" strokeWidth="0.8"/>
      <line x1="38" y1="41" x2="44" y2="38" stroke="#5a5a5a70" strokeWidth="0.8"/>

      {/* Боковая грань башни */}
      <polygon points="30,14 35,11 35,49 30,52" fill="#8a8a8a"/>
      <line x1="30" y1="20" x2="35" y2="17.5" stroke="#6b6b6b70" strokeWidth="0.7"/>
      <line x1="30" y1="30" x2="35" y2="27.5" stroke="#6b6b6b70" strokeWidth="0.7"/>
      <line x1="30" y1="40" x2="35" y2="37.5" stroke="#6b6b6b70" strokeWidth="0.7"/>
      {/* Скошенный верх башни */}
      <polygon points="19,14 30,14 35,11 24,11" fill="#cfcfcf"/>

      {/* Основная стена (фронт) */}
      <rect x="10" y="28" width="28" height="24" fill="#9E9E9E"/>
      {/* Башня (фронт) */}
      <rect x="19" y="14" width="11" height="38" fill="#BDBDBD"/>

      {/* Зубцы башни */}
      <rect x="19" y="8"  width="3" height="7" fill="#BDBDBD"/>
      <rect x="24" y="8"  width="3" height="7" fill="#BDBDBD"/>
      {/* Зубцы стены */}
      <rect x="12" y="23" width="4" height="6" fill="#9E9E9E"/>
      <rect x="20" y="23" width="4" height="6" fill="#9E9E9E"/>
      <rect x="28" y="23" width="4" height="6" fill="#9E9E9E"/>

      {/* Ворота */}
      <rect x="19" y="40" width="10" height="12" fill="#2C2C2C"/>
      <path d="M19,44 Q24,38 29,44" fill="#2C2C2C"/>
      <line x1="21" y1="40" x2="21" y2="52" stroke="#444" strokeWidth="1.2"/>
      <line x1="24" y1="40" x2="24" y2="52" stroke="#444" strokeWidth="1.2"/>
      <line x1="27" y1="40" x2="27" y2="52" stroke="#444" strokeWidth="1.2"/>

      {/* Флаг */}
      <line x1="24" y1="1" x2="24" y2="9" stroke="#757575" strokeWidth="1.5"/>
      <polygon points="24,1 34,5 24,9" fill="#C62828"/>

      {/* Окно на башне */}
      <rect x="22" y="24" width="4" height="5" fill="#1a1a2e" rx="1"/>

      {/* Линии кладки */}
      <line x1="10" y1="36" x2="19" y2="36" stroke="#0004" strokeWidth="0.8"/>
      <line x1="19" y1="30" x2="30" y2="30" stroke="#0003" strokeWidth="0.8"/>
    </svg>
  );
}
