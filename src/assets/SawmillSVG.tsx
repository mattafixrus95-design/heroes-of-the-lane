export default function SawmillSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Stacked logs, left */}
      <rect x="2" y="34" width="16" height="6" rx="3" fill="#8B6914"/>
      <rect x="2" y="28" width="16" height="6" rx="3" fill="#A0791C"/>
      <circle cx="4"  cy="31" r="2.6" fill="#D7B98E"/>
      <circle cx="4"  cy="37" r="2.6" fill="#D7B98E"/>
      <circle cx="16" cy="31" r="2.6" fill="#D7B98E"/>
      <circle cx="16" cy="37" r="2.6" fill="#D7B98E"/>

      {/* Mill shed */}
      <rect x="19" y="24" width="26" height="24" fill="#8D6E63"/>
      <polygon points="19,24 32,12 45,24" fill="#6B3820"/>
      <rect x="18" y="23" width="28" height="3" fill="#5C4A35"/>

      {/* Door */}
      <rect x="34" y="34" width="9" height="14" fill="#3E2723" rx="1"/>

      {/* Circular saw blade on the wall */}
      <circle cx="27" cy="34" r="7" fill="#B0BEC5" stroke="#78909C" strokeWidth="1.5"/>
      <circle cx="27" cy="34" r="2" fill="#607D8B"/>
      <line x1="27" y1="27" x2="27" y2="41" stroke="#78909C" strokeWidth="1"/>
      <line x1="20" y1="34" x2="34" y2="34" stroke="#78909C" strokeWidth="1"/>
      <line x1="22.2" y1="28.8" x2="31.8" y2="39.2" stroke="#78909C" strokeWidth="1"/>
      <line x1="22.2" y1="39.2" x2="31.8" y2="28.8" stroke="#78909C" strokeWidth="1"/>

      {/* Small tree beside the mill */}
      <rect x="47" y="38" width="3" height="10" fill="#6B4020"/>
      <circle cx="48.5" cy="32" r="7" fill="#558B2F"/>
      <circle cx="45"   cy="35" r="4.5" fill="#689F38"/>
      <circle cx="52"   cy="35" r="4.5" fill="#689F38"/>
    </svg>
  );
}
