export type GrassVariant = 0 | 1 | 2 | 3 | 4;

// Каждый вариант — свой оттенок зелёного + мелкая деталь. Заливка идёт
// в 100x100 без обводки, поэтому плитки стыкуются без видимого шва.
const BASE_COLORS: [string, string][] = [
  ["#4a8a54", "#3d7a48"],
  ["#52965c", "#457f50"],
  ["#468250", "#3a7244"],
  ["#4e8e58", "#417a4c"],
  ["#448050", "#387042"],
];

function Blades({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6">
      <path d={`M${x},${y} q-2,-8 -1,-13`}/>
      <path d={`M${x + 4},${y} q1,-9 4,-14`}/>
      <path d={`M${x + 8},${y} q3,-7 6,-11`}/>
    </g>
  );
}

function Flower({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.85">
      {[0, 72, 144, 216, 288].map(a => {
        const rad = (a * Math.PI) / 180;
        return <circle key={a} cx={x + Math.cos(rad) * 3} cy={y + Math.sin(rad) * 3} r="2.2" fill="#f2e6a8"/>;
      })}
      <circle cx={x} cy={y} r="2" fill="#e0a83c"/>
    </g>
  );
}

export default function GrassTile({ variant, size = 56 }: { variant: GrassVariant; size?: number }) {
  const [c1, c2] = BASE_COLORS[variant];
  const gradId = `grass-grad-${variant}`;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={c1}/>
          <stop offset="100%" stopColor={c2}/>
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill={`url(#${gradId})`}/>

      {variant === 0 && (
        <circle cx="70" cy="65" r="10" fill={c1} opacity="0.25"/>
      )}

      {variant === 1 && (
        <>
          <circle cx="28" cy="68" r="3.4" fill="#6b6255" opacity="0.5"/>
          <circle cx="35" cy="72" r="2.2" fill="#7a7062" opacity="0.5"/>
        </>
      )}

      {variant === 2 && <Blades x={62} y={40} color="#2f6a3a"/>}

      {variant === 3 && <Flower x={40} y={60}/>}

      {variant === 4 && (
        <>
          <ellipse cx="60" cy="30" rx="12" ry="7" fill="#5c4a34" opacity="0.35"/>
          <circle cx="58" cy="30" r="2" fill="#6f5a3e" opacity="0.5"/>
        </>
      )}
    </svg>
  );
}
