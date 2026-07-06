export default function IvorSVG({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Длинный светлый плащ — силуэт выше и стройнее обычного эльфа */}
      <path d="M15,20 L25,20 L27,38 L13,38 Z" fill="#e8e4d8"/>
      <path d="M14,20 L11,38 L16,38 Z" fill="#cfc9b8"/>
      <path d="M26,20 L29,38 L24,38 Z" fill="#cfc9b8"/>
      {/* Руки */}
      <rect x="7" y="19" width="6" height="11" rx="3" fill="#e8e4d8"/>
      <rect x="27" y="19" width="6" height="11" rx="3" fill="#e8e4d8"/>
      {/* Серебряный наплечник */}
      <ellipse cx="10" cy="19" rx="4" ry="2.6" fill="#b9c4cc"/>
      <ellipse cx="30" cy="19" rx="4" ry="2.6" fill="#b9c4cc"/>
      {/* Шея */}
      <rect x="18" y="12" width="4" height="6" fill="#F5CBA7"/>
      {/* Голова — вытянутая, "высокий эльф" */}
      <ellipse cx="20" cy="8" rx="6" ry="7.5" fill="#F5CBA7"/>
      {/* Острые уши */}
      <polygon points="13,7 9,2 15,9" fill="#F5CBA7"/>
      <polygon points="27,7 31,2 25,9" fill="#F5CBA7"/>
      {/* Серебристые волосы */}
      <path d="M13,4 Q20,-1 27,4 L27,7 Q20,3 13,7 Z" fill="#e0e0e0"/>
      {/* Глаза */}
      <ellipse cx="17" cy="7.5" rx="1.3" ry="1.8" fill="#2a5c8a"/>
      <ellipse cx="23" cy="7.5" rx="1.3" ry="1.8" fill="#2a5c8a"/>
      {/* Тонкий серебряный венец */}
      <path d="M14,3.5 Q20,0.5 26,3.5" fill="none" stroke="#d8d8d8" strokeWidth="1.2"/>
      <circle cx="20" cy="1.5" r="1.2" fill="#7fd6ff"/>
      {/* Большой лук */}
      <path d="M33,4 Q39,20 33,36" fill="none" stroke="#c8b48a" strokeWidth="2.2"/>
      <line x1="33" y1="4" x2="33" y2="36" stroke="#8a7554" strokeWidth="1"/>
      {/* Стрела на тетиве */}
      <line x1="33" y1="20" x2="22" y2="20" stroke="#c8b48a" strokeWidth="1.2"/>
      <polygon points="20,20 24,18.5 24,21.5" fill="#8a7554"/>
    </svg>
  );
}
