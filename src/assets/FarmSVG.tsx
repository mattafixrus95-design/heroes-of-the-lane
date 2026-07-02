export default function FarmSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Silo, left */}
      <rect x="4" y="22" width="10" height="26" rx="5" fill="#CFD8DC"/>
      <ellipse cx="9" cy="22" rx="5" ry="3" fill="#B0BEC5"/>
      <path d="M4,32 L14,32 M4,40 L14,40" stroke="#90A4AE" strokeWidth="1"/>

      {/* Barn body */}
      <rect x="17" y="26" width="28" height="22" fill="#C62828"/>
      {/* Roof */}
      <polygon points="15,26 31,10 47,26" fill="#8D2323"/>
      <rect x="14" y="25" width="34" height="3" fill="#6B1717"/>
      {/* Roof loft door */}
      <polygon points="27,10 31,6 35,10" fill="#5C4A35"/>
      <rect x="28.5" y="10" width="5" height="5" fill="#3E2723"/>

      {/* Barn door */}
      <path d="M25,48 L25,34 Q31,29 37,34 L37,48 Z" fill="#3E2723"/>
      <line x1="31" y1="30" x2="31" y2="48" stroke="#5C4A35" strokeWidth="1"/>

      {/* White trim */}
      <rect x="17" y="26" width="28" height="3" fill="#FAFAFA"/>
      <rect x="17" y="40" width="8" height="3" fill="#FAFAFA"/>
      <rect x="37" y="40" width="8" height="3" fill="#FAFAFA"/>

      {/* Wheat sheaf, front-right */}
      <line x1="46" y1="48" x2="46" y2="38" stroke="#8B6914" strokeWidth="1.5"/>
      <ellipse cx="43" cy="38" rx="3" ry="5" fill="#E8B84B" transform="rotate(-25 43 38)"/>
      <ellipse cx="49" cy="38" rx="3" ry="5" fill="#E8B84B" transform="rotate(25 49 38)"/>
      <ellipse cx="46" cy="35" rx="3" ry="5" fill="#F0C860"/>
    </svg>
  );
}
