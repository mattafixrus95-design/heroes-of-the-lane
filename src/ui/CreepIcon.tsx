import type { CreepKind } from "../game/engine/gameState";
import { CREEP_DEFS } from "../data/waves";
import impIcon from "../assets/creeps/01_imp/imp-walk-1.png";
import goblinIcon from "../assets/creeps/02_goblin/goblin-walk-1.png";
import pikemanIcon from "../assets/creeps/03_pikeman/pikeman-walk-1.png";

// Реестр статичных иконок для UI (панели/списки) — по аналогии с CREEP_ART
// в creepArt.ts, но там HTMLImageElement для canvas-анимации, здесь просто
// путь к PNG для <img>. Остальные типы крипов — эмодзи, отдельного арта нет.
const CREEP_ICONS: Partial<Record<CreepKind, string>> = {
  imp: impIcon,
  goblin: goblinIcon,
  pikeman: pikemanIcon,
};

interface Props {
  kind: CreepKind;
  size?: number;
}

export default function CreepIcon({ kind, size = 18 }: Props) {
  const src = CREEP_ICONS[kind];
  if (!src) {
    return <span style={{ fontSize: size }}>{CREEP_DEFS[kind].emoji}</span>;
  }
  return (
    <img
      src={src}
      alt=""
      style={{ width: size, height: size, objectFit: "contain", display: "inline-block", verticalAlign: "middle" }}
    />
  );
}
