interface Props {
  remaining: number;
  total: number;
  large?: boolean;
}

// Полоска прогресса стройки/апгрейда — используется и внутри модельки на
// поле (компактный вариант), и в контекстном меню (крупный вариант).
export default function BuildProgressBar({ remaining, total, large }: Props) {
  const pct = total > 0 ? Math.max(0, Math.min(1, 1 - remaining / total)) : 1;
  return (
    <div className={large ? "build-bar-outer large" : "build-bar-outer"}>
      <div className="build-bar-inner" style={{ width: `${pct * 100}%` }} />
    </div>
  );
}
