export default function SawmillSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Контактная тень */}
      <ellipse cx="26" cy="49.5" rx="21" ry="2.3" fill="rgba(0,0,0,0.3)"/>

      {/* Пандус — доски, ведущие от земли к платформе домика */}
      <polygon points="3,47 13,47 19,32 11,32" fill="#8B6914"/>
      <polygon points="3,47 13,47 13,44.4 4.4,44.4" fill="#00000022"/>
      <line x1="6.4" y1="43.2" x2="14.6" y2="40.4" stroke="#5c4419" strokeWidth="0.9"/>
      <line x1="8.2" y1="39" x2="16.2" y2="36.3" stroke="#5c4419" strokeWidth="0.9"/>
      <line x1="9.8" y1="35" x2="17.6" y2="32.5" stroke="#5c4419" strokeWidth="0.9"/>

      {/* Колесо/жёрнов у подножия пандуса */}
      <circle cx="8" cy="45" r="5.4" fill="#c9c4b8" stroke="#8a8478" strokeWidth="1"/>
      <circle cx="8" cy="45" r="3.5" fill="none" stroke="#8a8478" strokeWidth="0.8"/>
      <line x1="8" y1="40.2" x2="8" y2="49.8" stroke="#8a8478" strokeWidth="0.8"/>
      <line x1="3.6" y1="45" x2="12.4" y2="45" stroke="#8a8478" strokeWidth="0.8"/>
      <line x1="4.9" y1="41.9" x2="11.1" y2="48.1" stroke="#8a8478" strokeWidth="0.8"/>
      <line x1="4.9" y1="48.1" x2="11.1" y2="41.9" stroke="#8a8478" strokeWidth="0.8"/>

      {/* Сваи, поднимающие платформу домика над землёй */}
      <rect x="14" y="33" width="3" height="13" fill="#4a2f1a"/>
      <rect x="37" y="33" width="3" height="13" fill="#4a2f1a"/>
      <rect x="24" y="35" width="3" height="11" fill="#3d2716"/>

      {/* Платформа-настил */}
      <polygon points="11,33 41,33 44,30 14,30" fill="#8a6a3f"/>
      <rect x="11" y="31.5" width="30" height="3.5" fill="#7a5a35"/>
      <line x1="15" y1="31.5" x2="15" y2="35" stroke="#5c4423" strokeWidth="0.6" opacity="0.6"/>
      <line x1="22" y1="31.5" x2="22" y2="35" stroke="#5c4423" strokeWidth="0.6" opacity="0.6"/>
      <line x1="29" y1="31.5" x2="29" y2="35" stroke="#5c4423" strokeWidth="0.6" opacity="0.6"/>
      <line x1="36" y1="31.5" x2="36" y2="35" stroke="#5c4423" strokeWidth="0.6" opacity="0.6"/>

      {/* Основной сруб — бревенчатые стены */}
      <rect x="13" y="15" width="24" height="17" fill="#8D6E63"/>
      <line x1="13" y1="19" x2="37" y2="19" stroke="#5c4433" strokeWidth="0.7" opacity="0.5"/>
      <line x1="13" y1="23" x2="37" y2="23" stroke="#5c4433" strokeWidth="0.7" opacity="0.5"/>
      <line x1="13" y1="27" x2="37" y2="27" stroke="#5c4433" strokeWidth="0.7" opacity="0.5"/>

      {/* Правая грань сруба (псевдо-3D) */}
      <polygon points="37,15 43,12 43,29 37,32" fill="#6b4a3a"/>
      <line x1="37" y1="20" x2="43" y2="17" stroke="#4a3324" strokeWidth="0.7" opacity="0.5"/>
      <line x1="37" y1="25" x2="43" y2="22" stroke="#4a3324" strokeWidth="0.7" opacity="0.5"/>

      {/* Дверной проём */}
      <rect x="20" y="23" width="7" height="9" rx="1" fill="#2a1810"/>

      {/* Малая двускатная крыша (передний козырёк) */}
      <polygon points="13,15 21,7 29,15" fill="#8a4526"/>
      <polygon points="29,15 21,7 25,11.5" fill="#6e341c"/>
      <rect x="12.5" y="14.2" width="17" height="1.8" fill="#4a2412"/>

      {/* Главная двускатная крыша */}
      <polygon points="17,11 27,2 37,11" fill="#8a4526"/>
      <polygon points="37,11 27,2 43,9" fill="#6e341c"/>
      <rect x="16.3" y="10.2" width="27.2" height="2" fill="#4a2412"/>

      {/* Брёвнышко у стены — намёк на профиль лесопилки */}
      <ellipse cx="45" cy="41" rx="2.6" ry="3.1" fill="#e6c98a"/>
      <rect x="45" y="38.4" width="6.5" height="5.2" rx="2.6" fill="#8B6914"/>
    </svg>
  );
}
