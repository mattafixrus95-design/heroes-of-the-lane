export default function WoodSVG({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="16" width="32" height="11" rx="5.5" fill="#8B6914"/>
      <rect x="4" y="26" width="32" height="11" rx="5.5" fill="#6B4F12"/>
      <circle cx="8"  cy="21.5" r="4.5" fill="#D7B98E"/>
      <circle cx="32" cy="21.5" r="4.5" fill="#D7B98E"/>
      <circle cx="8"  cy="31.5" r="4.5" fill="#D7B98E"/>
      <circle cx="32" cy="31.5" r="4.5" fill="#D7B98E"/>
      <circle cx="8"  cy="21.5" r="4.5" fill="none" stroke="#B08850" strokeWidth="0.8"/>
      <circle cx="32" cy="21.5" r="4.5" fill="none" stroke="#B08850" strokeWidth="0.8"/>
      <circle cx="8"  cy="31.5" r="4.5" fill="none" stroke="#B08850" strokeWidth="0.8"/>
      <circle cx="32" cy="31.5" r="4.5" fill="none" stroke="#B08850" strokeWidth="0.8"/>
      <path d="M8,17.5 L8,25.5 M32,17.5 L32,25.5 M8,27.5 L8,35.5 M32,27.5 L32,35.5" stroke="#5C4A0F" strokeWidth="0.6" opacity="0.5"/>
    </svg>
  );
}
