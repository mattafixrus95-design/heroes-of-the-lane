export default function TavernSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Тело здания */}
      <rect x="6" y="24" width="40" height="24" fill="#8D6E63"/>
      <rect x="6" y="24" width="40" height="6" fill="#6B4A3F"/>
      {/* Двускатная крыша */}
      <polygon points="4,24 26,10 48,24" fill="#7A3B1E"/>
      <rect x="3" y="22" width="46" height="3" fill="#5C2C15"/>

      {/* Окна */}
      <rect x="11" y="32" width="8" height="8" fill="#f0c040" stroke="#5C4A35" strokeWidth="1.5"/>
      <rect x="33" y="32" width="8" height="8" fill="#f0c040" stroke="#5C4A35" strokeWidth="1.5"/>

      {/* Дверь */}
      <rect x="21" y="34" width="10" height="14" fill="#3E2723" rx="1"/>

      {/* Вывешенная вывеска с кружкой */}
      <line x1="26" y1="10" x2="26" y2="6" stroke="#5C2C15" strokeWidth="1.5"/>
      <line x1="26" y1="7" x2="34" y2="7" stroke="#5C2C15" strokeWidth="1.5"/>
      <line x1="34" y1="7" x2="34" y2="14" stroke="#5C2C15" strokeWidth="1"/>
      <rect x="30" y="10" width="8" height="7" rx="1.5" fill="#f0d060" stroke="#5C2C15" strokeWidth="1"/>
      <path d="M32,12 h4 v3 a2,2 0 0 1 -4,0 z" fill="#8D6E63"/>
    </svg>
  );
}
