export default function FarmSVG({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="farm-wall-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d3a86a"/>
          <stop offset="100%" stopColor="#b3854c"/>
        </linearGradient>
      </defs>

      {/* Контактная тень у основания сруба */}
      <ellipse cx="24" cy="47" rx="17" ry="2.4" fill="rgba(0,0,0,0.3)"/>

      {/* Боковая грань стены (уходит вправо-вглубь — "полубоком") */}
      <polygon points="32,26 40,22 40,42 32,46" fill="#9c7442"/>
      <line x1="32" y1="31" x2="40" y2="27" stroke="#7d5c33" strokeWidth="0.8" opacity="0.6"/>
      <line x1="32" y1="36" x2="40" y2="32" stroke="#7d5c33" strokeWidth="0.8" opacity="0.6"/>
      <line x1="32" y1="41" x2="40" y2="37" stroke="#7d5c33" strokeWidth="0.8" opacity="0.6"/>

      {/* Фронтальная грань — бревенчатая стена */}
      <rect x="8" y="26" width="24" height="20" fill="url(#farm-wall-front)"/>
      <line x1="8" y1="31" x2="32" y2="31" stroke="#8a6636" strokeWidth="0.8" opacity="0.5"/>
      <line x1="8" y1="36" x2="32" y2="36" stroke="#8a6636" strokeWidth="0.8" opacity="0.5"/>
      <line x1="8" y1="41" x2="32" y2="41" stroke="#8a6636" strokeWidth="0.8" opacity="0.5"/>

      {/* Дверь и окно на фронтальной грани */}
      <rect x="18" y="35" width="7" height="11" rx="0.5" fill="#3E2723"/>
      <line x1="21.5" y1="35" x2="21.5" y2="46" stroke="#2a1a16" strokeWidth="0.8"/>
      <rect x="11" y="29" width="6" height="6" fill="#5c4326" rx="0.5"/>
      <rect x="12" y="30" width="4" height="4" fill="#bfe0f0" opacity="0.85"/>
      <line x1="14" y1="30" x2="14" y2="34" stroke="#5c4326" strokeWidth="0.6"/>
      <line x1="12" y1="32" x2="16" y2="32" stroke="#5c4326" strokeWidth="0.6"/>

      {/* Двускатная/вальмовая крыша — два ската сходятся в одной точке (эффект "полубоком") */}
      <polygon points="32,26 24,9 8,26" fill="#c9963f"/>
      <polygon points="32,26 24,9 40,22" fill="#a8762e"/>
      <line x1="8" y1="26" x2="32" y2="26" stroke="#7a541f" strokeWidth="1"/>
      {/* Соломенная текстура ската */}
      <path d="M12,25 L18,13 M17,25.5 L22,11 M23,25.7 L24,9.5 M28,25.3 L26,12" stroke="#a8762e" strokeWidth="0.8" opacity="0.5"/>

      {/* Стог сена справа во дворе */}
      <ellipse cx="45" cy="44" rx="6" ry="4" fill="#e0b84e"/>
      <ellipse cx="45" cy="40.5" rx="5" ry="3.4" fill="#eac668"/>
      <path d="M40,43 L50,43 M41,40.5 L49,40.5" stroke="#b3872f" strokeWidth="0.6" opacity="0.6"/>

      {/* Изгородь перед двором */}
      <rect x="35" y="46" width="1.6" height="5" fill="#8a6636"/>
      <rect x="41" y="47" width="1.6" height="5" fill="#8a6636"/>
      <line x1="35.8" y1="47.5" x2="41.8" y2="48.5" stroke="#8a6636" strokeWidth="1"/>
    </svg>
  );
}
