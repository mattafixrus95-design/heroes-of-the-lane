export default function GateSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Left stone pillar */}
      <rect x="4" y="16" width="12" height="36" fill="#7D6A50" rx="1"/>
      {/* Right stone pillar */}
      <rect x="36" y="16" width="12" height="36" fill="#7D6A50" rx="1"/>
      {/* Arch fill */}
      <path d="M4,20 Q26,0 48,20 L48,16 Q26,-4 4,16 Z" fill="#7D6A50"/>
      {/* Arch border */}
      <path d="M4,20 Q26,0 48,20" fill="none" stroke="#5C4A35" strokeWidth="2"/>
      {/* Gate opening (dark interior) */}
      <rect x="16" y="20" width="20" height="32" fill="#1A0E08"/>
      {/* Left door panel */}
      <rect x="16" y="20" width="9" height="26" fill="#7B4F2E" rx="1"/>
      {/* Right door panel */}
      <rect x="27" y="20" width="9" height="26" fill="#6B4020" rx="1"/>
      {/* Door gap */}
      <rect x="25.5" y="20" width="1.5" height="26" fill="#1A0E08"/>
      {/* Left hinges */}
      <rect x="16" y="24" width="5" height="2.5" fill="#AAA" rx="1"/>
      <rect x="16" y="36" width="5" height="2.5" fill="#AAA" rx="1"/>
      {/* Right hinges */}
      <rect x="31" y="24" width="5" height="2.5" fill="#AAA" rx="1"/>
      <rect x="31" y="36" width="5" height="2.5" fill="#AAA" rx="1"/>
      {/* Door ring */}
      <circle cx="24" cy="34" r="2" fill="none" stroke="#AAA" strokeWidth="1.5"/>
      <circle cx="28" cy="34" r="2" fill="none" stroke="#AAA" strokeWidth="1.5"/>
      {/* Stone block lines on pillars */}
      <line x1="4" y1="24" x2="16" y2="24" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="4" y1="32" x2="16" y2="32" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="4" y1="40" x2="16" y2="40" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="36" y1="24" x2="48" y2="24" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="36" y1="32" x2="48" y2="32" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      <line x1="36" y1="40" x2="48" y2="40" stroke="#5C4A35" strokeWidth="0.8" opacity="0.5"/>
      {/* Torch left */}
      <rect x="2" y="12" width="3" height="6" fill="#8B6914"/>
      <ellipse cx="3.5" cy="12" rx="2" ry="3" fill="#FF8C00"/>
      <ellipse cx="3.5" cy="11" rx="1" ry="2" fill="#FFD700"/>
      {/* Torch right */}
      <rect x="47" y="12" width="3" height="6" fill="#8B6914"/>
      <ellipse cx="48.5" cy="12" rx="2" ry="3" fill="#FF8C00"/>
      <ellipse cx="48.5" cy="11" rx="1" ry="2" fill="#FFD700"/>
    </svg>
  );
}
