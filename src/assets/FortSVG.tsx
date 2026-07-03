export default function FortSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Main wall */}
      <rect x="10" y="28" width="32" height="24" fill="#9E9E9E"/>
      {/* Single tower, centered */}
      <rect x="19" y="14" width="14" height="38" fill="#BDBDBD"/>
      {/* Tower battlements */}
      <rect x="19" y="8"  width="3" height="7" fill="#BDBDBD"/>
      <rect x="24" y="8"  width="4" height="7" fill="#BDBDBD"/>
      <rect x="30" y="8"  width="3" height="7" fill="#BDBDBD"/>
      {/* Wall battlements */}
      <rect x="12" y="23" width="4" height="6" fill="#9E9E9E"/>
      <rect x="20" y="23" width="4" height="6" fill="#9E9E9E"/>
      <rect x="28" y="23" width="4" height="6" fill="#9E9E9E"/>
      <rect x="36" y="23" width="4" height="6" fill="#9E9E9E"/>
      {/* Gate */}
      <rect x="21" y="40" width="10" height="12" fill="#2C2C2C"/>
      <path d="M21,44 Q26,38 31,44" fill="#2C2C2C"/>
      <line x1="23" y1="40" x2="23" y2="52" stroke="#444" strokeWidth="1.2"/>
      <line x1="26" y1="40" x2="26" y2="52" stroke="#444" strokeWidth="1.2"/>
      <line x1="29" y1="40" x2="29" y2="52" stroke="#444" strokeWidth="1.2"/>
      {/* Flag */}
      <line x1="26" y1="1" x2="26" y2="9" stroke="#757575" strokeWidth="1.5"/>
      <polygon points="26,1 36,5 26,9" fill="#C62828"/>
      {/* Window on tower */}
      <rect x="24" y="24" width="4" height="5" fill="#1a1a2e" rx="1"/>
      {/* Stone lines */}
      <line x1="10" y1="36" x2="19" y2="36" stroke="#0004" strokeWidth="0.8"/>
      <line x1="33" y1="36" x2="42" y2="36" stroke="#0004" strokeWidth="0.8"/>
      <line x1="19" y1="30" x2="33" y2="30" stroke="#0003" strokeWidth="0.8"/>
    </svg>
  );
}
