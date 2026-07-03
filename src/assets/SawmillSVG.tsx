export default function SawmillSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Контактная тень */}
      <ellipse cx="27" cy="49" rx="19" ry="2.3" fill="rgba(0,0,0,0.3)"/>

      {/* Ель позади, слева */}
      <rect x="1" y="30" width="2.4" height="9" fill="#5c4326"/>
      <polygon points="2.2,10 -2,24 6.4,24" fill="#2e5c34"/>
      <polygon points="2.2,16 -1.5,28 5.9,28" fill="#356a3c"/>

      {/* Большое пильное колесо HoMM3-style — деревянная рама с зубчатым лезвием */}
      <circle cx="11" cy="30" r="10" fill="none" stroke="#6b4a2a" strokeWidth="2.6"/>
      <circle cx="11" cy="30" r="10" fill="none" stroke="#b0bec5" strokeWidth="1.4" strokeDasharray="2.2 2.4"/>
      <circle cx="11" cy="30" r="3" fill="#8d6e63"/>
      <line x1="11" y1="20" x2="11" y2="40" stroke="#6b4a2a" strokeWidth="1.4"/>
      <line x1="1" y1="30" x2="21" y2="30" stroke="#6b4a2a" strokeWidth="1.4"/>
      <rect x="9" y="39" width="4" height="10" fill="#5c4326"/>

      {/* Боковая грань здания — развёрнуто "полубоком" */}
      <polygon points="38,24 45,20 45,44 38,48" fill="#6f5548"/>
      <line x1="38" y1="29" x2="45" y2="25" stroke="#54413660" strokeWidth="0.8"/>
      <line x1="38" y1="34" x2="45" y2="30" stroke="#54413660" strokeWidth="0.8"/>
      <line x1="38" y1="39" x2="45" y2="35" stroke="#54413660" strokeWidth="0.8"/>

      {/* Фронтальная стена мельницы */}
      <rect x="23" y="24" width="15" height="24" fill="#8D6E63"/>
      <line x1="23" y1="32" x2="38" y2="32" stroke="#6b4a2a" strokeWidth="0.7" opacity="0.5"/>
      <line x1="23" y1="40" x2="38" y2="40" stroke="#6b4a2a" strokeWidth="0.7" opacity="0.5"/>

      {/* Крыша — два ската, сходящиеся в одной точке */}
      <polygon points="38,24 30,10 23,24" fill="#5f2f1a"/>
      <polygon points="38,24 30,10 45,20" fill="#4a2413"/>
      <rect x="22" y="23" width="17" height="2.4" fill="#3e2412"/>

      {/* Труба с дымком */}
      <rect x="33" y="13" width="3" height="7" fill="#4a2413"/>
      <circle cx="34.5" cy="9" r="1.6" fill="#cfcfcf" opacity="0.55"/>
      <circle cx="36" cy="6.5" r="2" fill="#cfcfcf" opacity="0.4"/>

      {/* Дверь */}
      <rect x="30" y="36" width="6" height="12" fill="#3E2723" rx="1"/>

      {/* Стопки свежих брёвен у входа */}
      <rect x="15" y="42" width="17" height="5" rx="2.4" fill="#8B6914"/>
      <rect x="16" y="37" width="15" height="5" rx="2.4" fill="#A0791C"/>
      <circle cx="17.5" cy="39.5" r="2.4" fill="#D7B98E"/>
      <circle cx="17.5" cy="44.5" r="2.4" fill="#D7B98E"/>
      <circle cx="29.5" cy="39.5" r="2.4" fill="#D7B98E"/>
      <circle cx="29.5" cy="44.5" r="2.4" fill="#D7B98E"/>
    </svg>
  );
}
