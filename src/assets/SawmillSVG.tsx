export default function SawmillSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Контактная тень */}
      <ellipse cx="24" cy="49" rx="20" ry="2.3" fill="rgba(0,0,0,0.3)"/>

      {/* Небольшое здание — та же псевдо-3D техника, что у остальных построек */}
      <polygon points="28,26 35,22 35,44 28,48" fill="#6f5548"/>
      <line x1="28" y1="31" x2="35" y2="27" stroke="#54413660" strokeWidth="0.8"/>
      <line x1="28" y1="36" x2="35" y2="32" stroke="#54413660" strokeWidth="0.8"/>
      <line x1="28" y1="41" x2="35" y2="37" stroke="#54413660" strokeWidth="0.8"/>

      <rect x="8" y="26" width="20" height="22" fill="#8D6E63"/>
      <line x1="8" y1="34" x2="28" y2="34" stroke="#6b4a2a" strokeWidth="0.7" opacity="0.5"/>
      <line x1="8" y1="41" x2="28" y2="41" stroke="#6b4a2a" strokeWidth="0.7" opacity="0.5"/>

      {/* Двускатная крыша */}
      <polygon points="28,26 18,10 8,26" fill="#8D4A2A"/>
      <polygon points="28,26 18,10 35,22" fill="#6B3820"/>
      <rect x="7" y="25" width="29" height="2.4" fill="#5C2C15"/>

      {/* Дверь */}
      <rect x="14" y="37" width="7" height="11" fill="#3E2723" rx="1"/>

      {/* Три больших бревна рядом, уложенные вдоль */}
      <ellipse cx="41" cy="32" rx="3" ry="3.6" fill="#e6c98a"/>
      <rect x="41" y="29" width="9" height="6" rx="3" fill="#8B6914"/>

      <ellipse cx="40" cy="39" rx="3.2" ry="3.8" fill="#e6c98a"/>
      <rect x="40" y="36" width="11" height="6.4" rx="3.2" fill="#A0791C"/>

      <ellipse cx="41" cy="46" rx="3" ry="3.6" fill="#e6c98a"/>
      <rect x="41" y="43" width="9" height="6" rx="3" fill="#8B6914"/>
    </svg>
  );
}
