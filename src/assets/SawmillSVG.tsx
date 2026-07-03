export default function SawmillSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Контактная тень у основания сруба */}
      <ellipse cx="30" cy="49" rx="16" ry="2.3" fill="rgba(0,0,0,0.3)"/>

      {/* Сложенные брёвна, слева */}
      <rect x="2" y="34" width="16" height="6" rx="3" fill="#8B6914"/>
      <rect x="2" y="28" width="16" height="6" rx="3" fill="#A0791C"/>
      <circle cx="4"  cy="31" r="2.6" fill="#D7B98E"/>
      <circle cx="4"  cy="37" r="2.6" fill="#D7B98E"/>
      <circle cx="16" cy="31" r="2.6" fill="#D7B98E"/>
      <circle cx="16" cy="37" r="2.6" fill="#D7B98E"/>

      {/* Боковая грань здания — развёрнуто "полубоком" */}
      <polygon points="38,24 45,20 45,44 38,48" fill="#6f5548"/>
      <line x1="38" y1="29" x2="45" y2="25" stroke="#54413660" strokeWidth="0.8"/>
      <line x1="38" y1="34" x2="45" y2="30" stroke="#54413660" strokeWidth="0.8"/>
      <line x1="38" y1="39" x2="45" y2="35" stroke="#54413660" strokeWidth="0.8"/>

      {/* Фронтальная стена мельницы */}
      <rect x="19" y="24" width="19" height="24" fill="#8D6E63"/>

      {/* Крыша — два ската, сходящиеся в одной точке */}
      <polygon points="38,24 28,10 19,24" fill="#5f2f1a"/>
      <polygon points="38,24 28,10 45,20" fill="#4a2413"/>
      <rect x="18" y="23" width="20" height="2.6" fill="#5C4A35"/>

      {/* Дверь */}
      <rect x="28" y="34" width="8" height="14" fill="#3E2723" rx="1"/>

      {/* Циркулярная пила на стене */}
      <circle cx="24" cy="33" r="6" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.5"/>
      <circle cx="24" cy="33" r="1.8" fill="#607D8B"/>
      <line x1="24" y1="27.3" x2="24" y2="38.7" stroke="#78909C" strokeWidth="1"/>
      <line x1="18.3" y1="33" x2="29.7" y2="33" stroke="#78909C" strokeWidth="1"/>
      <line x1="20.2" y1="28.8" x2="27.8" y2="37.2" stroke="#78909C" strokeWidth="1"/>
      <line x1="20.2" y1="37.2" x2="27.8" y2="28.8" stroke="#78909C" strokeWidth="1"/>

      {/* Дерево рядом с мельницей */}
      <rect x="47" y="38" width="3" height="10" fill="#6B4020"/>
      <circle cx="48.5" cy="32" r="7" fill="#558B2F"/>
      <circle cx="45"   cy="35" r="4.5" fill="#689F38"/>
      <circle cx="52"   cy="35" r="4.5" fill="#689F38"/>
    </svg>
  );
}
