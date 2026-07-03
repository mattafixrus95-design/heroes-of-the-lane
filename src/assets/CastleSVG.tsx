export default function CastleSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Контактная тень */}
      <ellipse cx="26" cy="50" rx="24" ry="2.2" fill="rgba(0,0,0,0.32)"/>

      {/* Боковая грань правой башни */}
      <polygon points="47,22 52,19 52,49 47,52" fill="#8a8a8a"/>
      <line x1="47" y1="28" x2="52" y2="25" stroke="#6b6b6b70" strokeWidth="0.8"/>
      <line x1="47" y1="36" x2="52" y2="33" stroke="#6b6b6b70" strokeWidth="0.8"/>
      <line x1="47" y1="44" x2="52" y2="41" stroke="#6b6b6b70" strokeWidth="0.8"/>
      <polygon points="38,22 47,22 52,19 43,19" fill="#cfcfcf"/>

      {/* Боковая грань центральной башни */}
      <polygon points="30,10 35,7 35,49 30,52" fill="#9a9a9a"/>
      <line x1="30" y1="18" x2="35" y2="15.5" stroke="#7a7a7a70" strokeWidth="0.8"/>
      <line x1="30" y1="28" x2="35" y2="25.5" stroke="#7a7a7a70" strokeWidth="0.8"/>
      <line x1="30" y1="38" x2="35" y2="35.5" stroke="#7a7a7a70" strokeWidth="0.8"/>
      <polygon points="19,10 30,10 35,7 24,7" fill="#e0e0e0"/>

      {/* Основная стена */}
      <rect x="6" y="30" width="40" height="22" fill="#9E9E9E"/>
      {/* Левая башня */}
      <rect x="2" y="22" width="12" height="30" fill="#BDBDBD"/>
      {/* Правая башня (фронт) */}
      <rect x="38" y="22" width="9" height="30" fill="#BDBDBD"/>
      {/* Центральная башня (фронт, самая высокая) */}
      <rect x="19" y="10" width="11" height="42" fill="#CFCFCF"/>

      {/* Зубцы левой башни */}
      <rect x="2"  y="16" width="3" height="7" fill="#BDBDBD"/>
      <rect x="7"  y="16" width="4" height="7" fill="#BDBDBD"/>
      <rect x="12" y="16" width="2" height="7" fill="#BDBDBD"/>
      {/* Зубцы правой башни */}
      <rect x="38" y="16" width="2" height="7" fill="#BDBDBD"/>
      <rect x="42" y="16" width="4" height="7" fill="#BDBDBD"/>
      {/* Зубцы центральной башни */}
      <rect x="19" y="4" width="3" height="7" fill="#CFCFCF"/>
      <rect x="24" y="4" width="4" height="7" fill="#CFCFCF"/>
      {/* Зубцы стены */}
      <rect x="8"  y="25" width="4" height="6" fill="#9E9E9E"/>
      <rect x="16" y="25" width="4" height="6" fill="#9E9E9E"/>
      <rect x="34" y="25" width="4" height="6" fill="#9E9E9E"/>
      <rect x="42" y="25" width="4" height="6" fill="#9E9E9E"/>

      {/* Арка ворот */}
      <rect x="20" y="40" width="12" height="12" fill="#2C2C2C"/>
      <path d="M20,44 Q26,36 32,44" fill="#2C2C2C"/>
      <line x1="22" y1="40" x2="22" y2="52" stroke="#444" strokeWidth="1.2"/>
      <line x1="26" y1="40" x2="26" y2="52" stroke="#444" strokeWidth="1.2"/>
      <line x1="30" y1="40" x2="30" y2="52" stroke="#444" strokeWidth="1.2"/>
      <line x1="20" y1="46" x2="32" y2="46" stroke="#444" strokeWidth="1.2"/>

      {/* Золотой флаг на центральной башне — знак высшего тира */}
      <line x1="24" y1="0" x2="24" y2="6" stroke="#757575" strokeWidth="1.5"/>
      <polygon points="24,0 36,4 24,8" fill="#FFD700"/>

      {/* Малые боковые флаги */}
      <line x1="8" y1="10" x2="8" y2="16" stroke="#757575" strokeWidth="1"/>
      <polygon points="8,10 14,13 8,16" fill="#C62828"/>
      <line x1="42" y1="10" x2="42" y2="16" stroke="#757575" strokeWidth="1"/>
      <polygon points="42,10 48,13 42,16" fill="#C62828"/>

      {/* Линии кладки */}
      <line x1="2"  y1="28" x2="14" y2="28" stroke="#0004" strokeWidth="0.8"/>
      <line x1="2"  y1="36" x2="14" y2="36" stroke="#0004" strokeWidth="0.8"/>
      <line x1="6"  y1="36" x2="46" y2="36" stroke="#0003" strokeWidth="0.8"/>
      <line x1="19" y1="20" x2="30" y2="20" stroke="#0003" strokeWidth="0.8"/>
      <line x1="19" y1="30" x2="30" y2="30" stroke="#0003" strokeWidth="0.8"/>

      {/* Окна */}
      <rect x="5"  y="32" width="5" height="6" fill="#1a1a2e" rx="1"/>
      <rect x="40" y="32" width="4" height="6" fill="#1a1a2e" rx="1"/>
      <rect x="23" y="24" width="4" height="5" fill="#1a1a2e" rx="1"/>
      <rect x="23" y="34" width="4" height="5" fill="#1a1a2e" rx="1"/>
    </svg>
  );
}
