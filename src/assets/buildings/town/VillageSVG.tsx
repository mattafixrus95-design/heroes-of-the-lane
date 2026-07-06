export default function VillageSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Контактная тень */}
      <ellipse cx="26" cy="49" rx="16" ry="2.3" fill="rgba(0,0,0,0.3)"/>

      {/* Боковая грань стены — развёрнуто "полубоком" */}
      <polygon points="32,26 39,22 39,44 32,48" fill="#8a6f65"/>
      <line x1="32" y1="31" x2="39" y2="27" stroke="#6b544b60" strokeWidth="0.8"/>
      <line x1="32" y1="36" x2="39" y2="32" stroke="#6b544b60" strokeWidth="0.8"/>
      <line x1="32" y1="41" x2="39" y2="37" stroke="#6b544b60" strokeWidth="0.8"/>

      {/* Фронтальная стена */}
      <rect x="14" y="26" width="18" height="22" fill="#A1887F"/>
      <line x1="14" y1="33" x2="32" y2="33" stroke="#8D6E63" strokeWidth="0.8" opacity="0.5"/>
      <line x1="14" y1="40" x2="32" y2="40" stroke="#8D6E63" strokeWidth="0.8" opacity="0.5"/>

      {/* Крыша — два ската, сходящиеся в одной точке */}
      <polygon points="32,26 23,10 14,26" fill="#8D4A2A"/>
      <polygon points="32,26 23,10 39,22" fill="#6B3820"/>
      <rect x="13" y="25" width="26" height="2.6" fill="#5C2C15"/>

      {/* Труба */}
      <rect x="27" y="14" width="4" height="9" fill="#795548"/>

      {/* Дверь */}
      <rect x="19" y="36" width="7" height="12" fill="#4E342E" rx="1"/>
      <circle cx="24.5" cy="42" r="0.8" fill="#D7B98E"/>

      {/* Окно */}
      <rect x="17" y="30" width="6" height="6" fill="#1a1a2e" rx="1"/>
      <line x1="20" y1="30" x2="20" y2="36" stroke="#0a0a1a" strokeWidth="0.6"/>
    </svg>
  );
}
