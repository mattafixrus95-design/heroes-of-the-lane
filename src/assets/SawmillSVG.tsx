// Лесопилка: открытый навес для распила (без стен) на неровном земляном
// участке — брёвна, козлы, пень и доски читаются издалека как деревообработка,
// а не жилой дом. Свет условно сверху слева (светлые грани — верх/фронт).
export default function SawmillSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Неровный земляной участок — вместо квадратной плитки */}
      <ellipse cx="25" cy="40" rx="24" ry="13.5" fill="#5f4c34" opacity="0.55"/>
      <ellipse cx="23" cy="38.5" rx="21" ry="11.5" fill="#8a7355"/>
      <ellipse cx="14" cy="45" rx="9" ry="5.5" fill="#8a7355"/>
      <ellipse cx="37" cy="43" rx="8" ry="5" fill="#8a7355"/>
      {/* Камешки по краю участка */}
      <ellipse cx="5" cy="37" rx="2.6" ry="1.8" fill="#9a9a92"/>
      <ellipse cx="46" cy="35" rx="3" ry="2" fill="#8f8f87"/>
      <ellipse cx="9" cy="49" rx="2.4" ry="1.6" fill="#9a9a92"/>
      <ellipse cx="41" cy="49" rx="2.6" ry="1.7" fill="#8f8f87"/>

      {/* Пень слева */}
      <rect x="2" y="38" width="7" height="5" rx="1.5" fill="#5a4128"/>
      <ellipse cx="5.5" cy="38" rx="4" ry="2.8" fill="#c9a06c"/>
      <ellipse cx="5.5" cy="38" rx="2.6" ry="1.8" fill="#b58a54" opacity="0.7"/>
      <ellipse cx="5.5" cy="38" rx="1.2" ry="0.8" fill="#9c7748" opacity="0.7"/>

      {/* Поленница справа */}
      <rect x="39" y="41" width="12" height="5" rx="2.4" fill="#8B6914"/>
      <rect x="40" y="36.5" width="10" height="5" rx="2.4" fill="#A0791C"/>
      <circle cx="41" cy="39" r="2.3" fill="#D7B98E"/>
      <circle cx="49" cy="39" r="2.3" fill="#D7B98E"/>
      <circle cx="40.5" cy="43.5" r="2.3" fill="#D7B98E"/>
      <circle cx="50.5" cy="43.5" r="2.3" fill="#D7B98E"/>

      {/* Стопка досок справа у навеса */}
      <rect x="36" y="30" width="13" height="2.4" fill="#c9a06c"/>
      <rect x="35.5" y="27.4" width="13" height="2.4" fill="#d3ac76"/>
      <rect x="36" y="24.8" width="13" height="2.4" fill="#c9a06c"/>
      <rect x="48.6" y="24.6" width="1.4" height="8" fill="#a9793f"/>

      {/* Открытый навес: столбы */}
      <rect x="9" y="22" width="3" height="21" fill="#4a2f18"/>
      <rect x="33" y="20" width="3" height="21" fill="#4a2f18"/>

      {/* Двускатная крыша над навесом (два ската, фронт светлее — свет слева-сверху) */}
      <polygon points="5,24 21,8 37,24" fill="#5c4326"/>
      <polygon points="21,24 21,8 37,24 44,20 44,24" fill="#3c2c16"/>
      <rect x="4" y="23" width="41" height="2.3" fill="#2e2110"/>

      {/* Бревно на козлах под навесом — в процессе распила */}
      <path d="M15,34 L19,30 M19,30 L23,34 M15,42 L19,38 M19,38 L23,42" stroke="#3b2a17" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M25,34 L29,30 M29,30 L33,34 M25,42 L29,38 M29,38 L33,42" stroke="#3b2a17" strokeWidth="1.6" strokeLinecap="round"/>
      <rect x="13" y="32" width="22" height="5.5" rx="2.7" fill="#8B6914"/>
      <ellipse cx="13" cy="34.7" rx="2.6" ry="3" fill="#e6c98a"/>
      <ellipse cx="35" cy="34.7" rx="2.6" ry="3" fill="#e6c98a"/>
      {/* Пропил и клин пилы */}
      <line x1="24" y1="32" x2="24" y2="37.4" stroke="#6b4a2a" strokeWidth="0.8"/>
      <polygon points="24,32 27,33.5 24,35" fill="#b0bec5"/>
    </svg>
  );
}
