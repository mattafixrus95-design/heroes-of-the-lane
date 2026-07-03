// Лесопилка — строго top-down (без изометрии/перспективы): акцент на брёвнах
// и механизме распила, ~45% площади занимает штабель торцов брёвен и пиломатериал.
function LogEnd({ cx, cy, r, ring }: { cx: number; cy: number; r: number; ring?: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#7a5a34" stroke="#4a3520" strokeWidth={r * 0.12}/>
      <circle cx={cx} cy={cy} r={r * 0.72} fill="#c9a06c"/>
      {ring ? (
        <>
          <circle cx={cx} cy={cy} r={r * 0.5} fill="none" stroke="#a9793f" strokeWidth={r * 0.09}/>
          <circle cx={cx} cy={cy} r={r * 0.28} fill="none" stroke="#a9793f" strokeWidth={r * 0.09}/>
        </>
      ) : (
        <ellipse cx={cx - r * 0.28} cy={cy - r * 0.28} rx={r * 0.32} ry={r * 0.2} fill="#e6c98a" opacity="0.6"/>
      )}
    </g>
  );
}

export default function SawmillSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Неровный земляной участок под всей сценой */}
      <ellipse cx="26" cy="30" rx="25" ry="23" fill="#5f4c34" opacity="0.3"/>

      {/* Навес/мастерская — крыша строго сверху, ридж-линия по центру */}
      <rect x="3" y="3" width="21" height="17" rx="1.5" fill="#4a2f18"/>
      <rect x="3" y="3" width="21" height="17" rx="1.5" fill="none" stroke="#3a2412" strokeWidth="0.8"/>
      <line x1="13.5" y1="3" x2="13.5" y2="20" stroke="#6b4a2a" strokeWidth="1.3"/>
      <line x1="6" y1="7" x2="21" y2="7" stroke="#3a2412" strokeWidth="0.6" opacity="0.6"/>
      <line x1="6" y1="12" x2="21" y2="12" stroke="#3a2412" strokeWidth="0.6" opacity="0.6"/>
      <line x1="6" y1="17" x2="21" y2="17" stroke="#3a2412" strokeWidth="0.6" opacity="0.6"/>

      {/* Большая циркулярная пила на деревянной раме */}
      <rect x="27" y="3" width="22" height="20" rx="1.5" fill="#6b4a2a"/>
      <circle cx="38" cy="13" r="9" fill="#78909C" stroke="#37474F" strokeWidth="1.4"/>
      <g stroke="#37474F" strokeWidth="1.3">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => {
          const rad = (a * Math.PI) / 180;
          const c = Math.cos(rad), s = Math.sin(rad);
          return <line key={a} x1={38 + 9 * c} y1={13 + 9 * s} x2={38 + 11.2 * c} y2={13 + 11.2 * s}/>;
        })}
      </g>
      <circle cx="38" cy="13" r="2.6" fill="#455A64"/>
      <line x1="38" y1="4.5" x2="38" y2="21.5" stroke="#546E7A" strokeWidth="0.8"/>
      <line x1="29.5" y1="13" x2="46.5" y2="13" stroke="#546E7A" strokeWidth="0.8"/>

      {/* Отдельная балка у навеса */}
      <rect x="2" y="23" width="20" height="3" rx="1" fill="#8B6914" transform="rotate(6 12 24.5)"/>

      {/* Штабель торцов брёвен — основной визуальный акцент */}
      <LogEnd cx={8}  cy={33} r={5.2}/>
      <LogEnd cx={17} cy={31} r={5.6}/>
      <LogEnd cx={26} cy={33} r={5.2}/>
      <LogEnd cx={35} cy={32} r={5.4}/>
      <LogEnd cx={12} cy={41} r={5.4}/>
      <LogEnd cx={21} cy={40} r={5.6}/>
      <LogEnd cx={30} cy={41} r={5.2}/>
      <LogEnd cx={7}  cy={48} r={6}  ring/>
      <LogEnd cx={19} cy={49} r={5.6} ring/>
      <LogEnd cx={29} cy={49} r={5}/>

      {/* Стопка досок у края */}
      <rect x="39" y="27" width="12" height="21" rx="1" fill="#c9a06c"/>
      <rect x="39" y="27" width="12" height="21" rx="1" fill="none" stroke="#8a6a3c" strokeWidth="0.6"/>
      <line x1="39" y1="31" x2="51" y2="31" stroke="#8a6a3c" strokeWidth="0.7"/>
      <line x1="39" y1="35" x2="51" y2="35" stroke="#8a6a3c" strokeWidth="0.7"/>
      <line x1="39" y1="39" x2="51" y2="39" stroke="#8a6a3c" strokeWidth="0.7"/>
      <line x1="39" y1="43" x2="51" y2="43" stroke="#8a6a3c" strokeWidth="0.7"/>

      {/* Тележка с брёвнами */}
      <rect x="38" y="46" width="12" height="6" rx="1" fill="#5a4128"/>
      <circle cx="40.5" cy="52" r="2" fill="#2e2110"/>
      <circle cx="47.5" cy="52" r="2" fill="#2e2110"/>
      <circle cx="41" cy="47.5" r="2.2" fill="#a9793f"/>
      <circle cx="45" cy="47" r="2.2" fill="#c9a06c"/>
      <circle cx="48" cy="47.7" r="2" fill="#a9793f"/>
    </svg>
  );
}
