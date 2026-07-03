const TOOTH_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const COS: Record<number, number> = { 0: 1, 30: 0.866, 60: 0.5, 90: 0, 120: -0.5, 150: -0.866, 180: -1, 210: -0.866, 240: -0.5, 270: 0, 300: 0.5, 330: 0.866 };
const SIN: Record<number, number> = { 0: 0, 30: 0.5, 60: 0.866, 90: 1, 120: 0.866, 150: 0.5, 180: 0, 210: -0.5, 240: -0.866, 270: -1, 300: -0.5, 330: -0.866 };

function SawTeeth({ cx, cy, rInner, rOuter }: { cx: number; cy: number; rInner: number; rOuter: number }) {
  return (
    <g stroke="#5a6a70" strokeWidth="1.4">
      {TOOTH_ANGLES.map(a => (
        <line
          key={a}
          x1={cx + rInner * COS[a]} y1={cy + rInner * SIN[a]}
          x2={cx + rOuter * COS[a]} y2={cy + rOuter * SIN[a]}
        />
      ))}
    </g>
  );
}

export default function SawmillSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Контактная тень */}
      <ellipse cx="24" cy="49" rx="18" ry="2.3" fill="rgba(0,0,0,0.3)"/>

      {/* Боковая грань здания — развёрнуто "полубоком" */}
      <polygon points="34,26 41,22 41,46 34,48" fill="#6f5548"/>
      <line x1="34" y1="31" x2="41" y2="27" stroke="#54413660" strokeWidth="0.8"/>
      <line x1="34" y1="36" x2="41" y2="32" stroke="#54413660" strokeWidth="0.8"/>
      <line x1="34" y1="41" x2="41" y2="37" stroke="#54413660" strokeWidth="0.8"/>

      {/* Фронтальная стена */}
      <rect x="8" y="26" width="26" height="22" fill="#8D6E63"/>
      <line x1="8" y1="33" x2="34" y2="33" stroke="#6b4a2a" strokeWidth="0.7" opacity="0.5"/>
      <line x1="8" y1="40" x2="34" y2="40" stroke="#6b4a2a" strokeWidth="0.7" opacity="0.5"/>

      {/* Крыша — два ската, сходящиеся в одной точке */}
      <polygon points="34,26 21,10 8,26" fill="#5f2f1a"/>
      <polygon points="34,26 21,10 41,22" fill="#4a2413"/>
      <rect x="7" y="25" width="35" height="2.4" fill="#3e2412"/>

      {/* Дверь справа от пилы */}
      <rect x="27" y="38" width="6" height="10" fill="#3E2723" rx="1"/>

      {/* Большое зубчатое пильное колесо — фирменная деталь лесопилки */}
      <circle cx="17" cy="35" r="8.5" fill="#37474F"/>
      <circle cx="17" cy="35" r="7" fill="#90A4AE"/>
      <SawTeeth cx={17} cy={35} rInner={7} rOuter={9.6}/>
      <circle cx="17" cy="35" r="2.6" fill="#455A64"/>
      <line x1="17" y1="28" x2="17" y2="42" stroke="#607D8B" strokeWidth="0.8"/>
      <line x1="10.5" y1="35" x2="23.5" y2="35" stroke="#607D8B" strokeWidth="0.8"/>

      {/* Стопка свежих брёвен у стены */}
      <rect x="4" y="44" width="16" height="5" rx="2.4" fill="#8B6914"/>
      <circle cx="6.5" cy="46.5" r="2.4" fill="#D7B98E"/>
      <circle cx="17.5" cy="46.5" r="2.4" fill="#D7B98E"/>
    </svg>
  );
}
