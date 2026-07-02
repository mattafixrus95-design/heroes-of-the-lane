export default function VillageSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Walls */}
      <rect x="14" y="26" width="24" height="22" fill="#A1887F"/>
      {/* Roof */}
      <polygon points="26,10 10,26 42,26" fill="#8D4A2A"/>
      <rect x="9" y="25" width="34" height="3" fill="#6B3820"/>
      {/* Door */}
      <rect x="22" y="36" width="8" height="12" fill="#4E342E" rx="1"/>
      <circle cx="28.5" cy="42" r="0.8" fill="#D7B98E"/>
      {/* Window */}
      <rect x="17" y="30" width="6" height="6" fill="#1a1a2e" rx="1"/>
      <rect x="29" y="30" width="6" height="6" fill="#1a1a2e" rx="1"/>
      {/* Chimney */}
      <rect x="32" y="14" width="4" height="9" fill="#795548"/>
      {/* Wood grain */}
      <line x1="14" y1="34" x2="38" y2="34" stroke="#8D6E63" strokeWidth="0.8" opacity="0.5"/>
      <line x1="14" y1="41" x2="38" y2="41" stroke="#8D6E63" strokeWidth="0.8" opacity="0.5"/>
    </svg>
  );
}
