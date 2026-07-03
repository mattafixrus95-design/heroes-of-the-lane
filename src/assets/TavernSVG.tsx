export default function TavernSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Контактная тень у основания сруба */}
      <ellipse cx="24" cy="49" rx="19" ry="2.4" fill="rgba(0,0,0,0.3)"/>

      {/* Боковая грань стены — здание развёрнуто "полубоком" */}
      <polygon points="32,24 40,20 40,44 32,48" fill="#6f5548"/>
      <line x1="32" y1="29" x2="40" y2="25" stroke="#54413660" strokeWidth="0.8"/>
      <line x1="32" y1="34" x2="40" y2="30" stroke="#54413660" strokeWidth="0.8"/>
      <line x1="32" y1="39" x2="40" y2="35" stroke="#54413660" strokeWidth="0.8"/>

      {/* Фронтальная стена */}
      <rect x="6" y="24" width="26" height="24" fill="#8D6E63"/>
      <rect x="6" y="24" width="26" height="5" fill="#6B4A3F"/>

      {/* Крыша — два ската, сходящиеся в одной точке (та же техника, что у фермы) */}
      <polygon points="32,24 19,8 6,24" fill="#8a4526"/>
      <polygon points="32,24 19,8 40,20" fill="#6e341c"/>
      <rect x="4" y="22" width="30" height="2.6" fill="#5C2C15"/>
      <line x1="10" y1="23" x2="18" y2="10" stroke="#6e341c" strokeWidth="0.7" opacity="0.5"/>
      <line x1="16" y1="23.5" x2="19.5" y2="9" stroke="#6e341c" strokeWidth="0.7" opacity="0.5"/>
      <line x1="24" y1="23.5" x2="20.5" y2="9.5" stroke="#5a2a15" strokeWidth="0.7" opacity="0.5"/>

      {/* Окно */}
      <rect x="10" y="32" width="8" height="8" fill="#f0c040" stroke="#5C4A35" strokeWidth="1.5"/>
      <line x1="14" y1="32" x2="14" y2="40" stroke="#5C4A35" strokeWidth="0.8"/>
      <line x1="10" y1="36" x2="18" y2="36" stroke="#5C4A35" strokeWidth="0.8"/>

      {/* Дверь */}
      <rect x="20" y="34" width="9" height="14" fill="#3E2723" rx="1"/>

      {/* Вывеска с кружкой на столбе у крыши */}
      <line x1="19" y1="8" x2="19" y2="4" stroke="#5C2C15" strokeWidth="1.5"/>
      <line x1="19" y1="5" x2="27" y2="5" stroke="#5C2C15" strokeWidth="1.5"/>
      <line x1="27" y1="5" x2="27" y2="12" stroke="#5C2C15" strokeWidth="1"/>
      <rect x="23" y="8" width="8" height="7" rx="1.5" fill="#f0d060" stroke="#5C2C15" strokeWidth="1"/>
      <path d="M25,10 h4 v3 a2,2 0 0 1 -4,0 z" fill="#8D6E63"/>
    </svg>
  );
}
