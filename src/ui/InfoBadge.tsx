interface Props {
  onClick: () => void;
}

// Квадратная кнопка информации с объёмной буквой "i" (не текст, а SVG-форма).
export default function InfoBadge({ onClick }: Props) {
  return (
    <button className="cm-info-badge" onClick={onClick} aria-label="Информация">
      <svg width="15" height="15" viewBox="0 0 15 15">
        <circle cx="7.5" cy="3.6" r="1.7" fill="currentColor" />
        <rect x="5.9" y="6.6" width="3.2" height="6.4" rx="1.4" fill="currentColor" />
      </svg>
    </button>
  );
}
