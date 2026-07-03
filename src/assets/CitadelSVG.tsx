export default function CitadelSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Main wall */}
      <rect x="12" y="28" width="28" height="24" fill="#9E9E9E"/>
      {/* Left tower */}
      <rect x="4" y="20" width="14" height="32" fill="#BDBDBD"/>
      {/* Right tower */}
      <rect x="34" y="20" width="14" height="32" fill="#BDBDBD"/>
      {/* Left battlements */}
      <rect x="4"  y="14" width="4" height="8" fill="#BDBDBD"/>
      <rect x="10" y="14" width="4" height="8" fill="#BDBDBD"/>
      <rect x="16" y="14" width="2" height="8" fill="#BDBDBD"/>
      {/* Right battlements */}
      <rect x="34" y="14" width="2" height="8" fill="#BDBDBD"/>
      <rect x="38" y="14" width="4" height="8" fill="#BDBDBD"/>
      <rect x="44" y="14" width="4" height="8" fill="#BDBDBD"/>
      {/* Wall battlements */}
      <rect x="14" y="23" width="4" height="6" fill="#9E9E9E"/>
      <rect x="22" y="23" width="4" height="6" fill="#9E9E9E"/>
      <rect x="30" y="23" width="4" height="6" fill="#9E9E9E"/>
      {/* Gate arch */}
      <rect x="19" y="38" width="14" height="14" fill="#2C2C2C"/>
      <path d="M19,42 Q26,34 33,42" fill="#2C2C2C"/>
      {/* Portcullis bars */}
      <line x1="21" y1="38" x2="21" y2="52" stroke="#444" strokeWidth="1.5"/>
      <line x1="25" y1="38" x2="25" y2="52" stroke="#444" strokeWidth="1.5"/>
      <line x1="29" y1="38" x2="29" y2="52" stroke="#444" strokeWidth="1.5"/>
      <line x1="19" y1="44" x2="33" y2="44" stroke="#444" strokeWidth="1.5"/>
      <line x1="19" y1="48" x2="33" y2="48" stroke="#444" strokeWidth="1.5"/>
      {/* Flag pole */}
      <line x1="26" y1="2" x2="26" y2="18" stroke="#757575" strokeWidth="1.5"/>
      {/* Flag */}
      <polygon points="26,2 38,7 26,12" fill="#C62828"/>
      {/* Stone block lines */}
      <line x1="4"  y1="26" x2="18" y2="26" stroke="#0004" strokeWidth="0.8"/>
      <line x1="4"  y1="34" x2="18" y2="34" stroke="#0004" strokeWidth="0.8"/>
      <line x1="34" y1="26" x2="48" y2="26" stroke="#0004" strokeWidth="0.8"/>
      <line x1="34" y1="34" x2="48" y2="34" stroke="#0004" strokeWidth="0.8"/>
      <line x1="12" y1="34" x2="40" y2="34" stroke="#0003" strokeWidth="0.8"/>
      {/* Windows on towers */}
      <rect x="8"  y="30" width="5" height="6" fill="#1a1a2e" rx="1"/>
      <rect x="39" y="30" width="5" height="6" fill="#1a1a2e" rx="1"/>
    </svg>
  );
}
