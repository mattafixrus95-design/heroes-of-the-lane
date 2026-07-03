export default function CastleSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Main wall */}
      <rect x="6" y="30" width="40" height="22" fill="#9E9E9E"/>
      {/* Left tower */}
      <rect x="2" y="22" width="12" height="30" fill="#BDBDBD"/>
      {/* Right tower */}
      <rect x="38" y="22" width="12" height="30" fill="#BDBDBD"/>
      {/* Central tower — tallest */}
      <rect x="19" y="10" width="14" height="42" fill="#CFCFCF"/>
      {/* Left battlements */}
      <rect x="2"  y="16" width="3" height="7" fill="#BDBDBD"/>
      <rect x="7"  y="16" width="4" height="7" fill="#BDBDBD"/>
      <rect x="12" y="16" width="2" height="7" fill="#BDBDBD"/>
      {/* Right battlements */}
      <rect x="38" y="16" width="2" height="7" fill="#BDBDBD"/>
      <rect x="42" y="16" width="4" height="7" fill="#BDBDBD"/>
      <rect x="47" y="16" width="3" height="7" fill="#BDBDBD"/>
      {/* Central battlements */}
      <rect x="19" y="4" width="3" height="7" fill="#CFCFCF"/>
      <rect x="24" y="4" width="4" height="7" fill="#CFCFCF"/>
      <rect x="30" y="4" width="3" height="7" fill="#CFCFCF"/>
      {/* Wall battlements */}
      <rect x="8"  y="25" width="4" height="6" fill="#9E9E9E"/>
      <rect x="16" y="25" width="4" height="6" fill="#9E9E9E"/>
      <rect x="34" y="25" width="4" height="6" fill="#9E9E9E"/>
      <rect x="42" y="25" width="4" height="6" fill="#9E9E9E"/>
      {/* Gate arch */}
      <rect x="20" y="40" width="12" height="12" fill="#2C2C2C"/>
      <path d="M20,44 Q26,36 32,44" fill="#2C2C2C"/>
      <line x1="22" y1="40" x2="22" y2="52" stroke="#444" strokeWidth="1.2"/>
      <line x1="26" y1="40" x2="26" y2="52" stroke="#444" strokeWidth="1.2"/>
      <line x1="30" y1="40" x2="30" y2="52" stroke="#444" strokeWidth="1.2"/>
      <line x1="20" y1="46" x2="32" y2="46" stroke="#444" strokeWidth="1.2"/>
      {/* Flag pole on central tower */}
      <line x1="26" y1="0" x2="26" y2="6" stroke="#757575" strokeWidth="1.5"/>
      {/* Golden flag — signature of the top tier */}
      <polygon points="26,0 38,4 26,8" fill="#FFD700"/>
      {/* Small side flags */}
      <line x1="8" y1="10" x2="8" y2="16" stroke="#757575" strokeWidth="1"/>
      <polygon points="8,10 14,13 8,16" fill="#C62828"/>
      <line x1="44" y1="10" x2="44" y2="16" stroke="#757575" strokeWidth="1"/>
      <polygon points="44,10 50,13 44,16" fill="#C62828"/>
      {/* Stone block lines */}
      <line x1="2"  y1="28" x2="14" y2="28" stroke="#0004" strokeWidth="0.8"/>
      <line x1="2"  y1="36" x2="14" y2="36" stroke="#0004" strokeWidth="0.8"/>
      <line x1="38" y1="28" x2="50" y2="28" stroke="#0004" strokeWidth="0.8"/>
      <line x1="38" y1="36" x2="50" y2="36" stroke="#0004" strokeWidth="0.8"/>
      <line x1="6"  y1="36" x2="46" y2="36" stroke="#0003" strokeWidth="0.8"/>
      <line x1="19" y1="20" x2="33" y2="20" stroke="#0003" strokeWidth="0.8"/>
      <line x1="19" y1="30" x2="33" y2="30" stroke="#0003" strokeWidth="0.8"/>
      {/* Windows */}
      <rect x="5"  y="32" width="5" height="6" fill="#1a1a2e" rx="1"/>
      <rect x="41" y="32" width="5" height="6" fill="#1a1a2e" rx="1"/>
      <rect x="24" y="24" width="4" height="5" fill="#1a1a2e" rx="1"/>
      <rect x="24" y="34" width="4" height="5" fill="#1a1a2e" rx="1"/>
    </svg>
  );
}
