import type { TowerType } from "../data/towers";
import type { TowerAttackPhase } from "../game/systems/towerAttack";
import { TOWER_ART } from "../assets/towers/towerArt";

interface Props {
  type: TowerType;
  grade: number;
  size?: number;
  phase?: TowerAttackPhase;
  gameTime?: number;
}

// ── Растровый арт ────────────────────────────────────────────────────────────
// Кадры атаки листаются по gameTime, пока у башни есть цель (phase==="attack"),
// иначе показывается статичный idle-кадр — тот же паттерн, что у HeroIcon,
// только с непрерывным циклом кадров вместо дискретных поз.
function RasterTowerIcon({ type, grade, size, phase, gameTime }: Props & { size: number }) {
  const art = TOWER_ART[type]!.grades[grade as 0 | 1];
  const attacking = phase === "attack" && art.attackFrames.length > 0;
  const frame = attacking
    ? art.attackFrames[Math.floor((gameTime ?? 0) * art.attackFps) % art.attackFrames.length]
    : art.idle;
  const w = size * (art.sizeMult ?? 1);
  return (
    <img
      src={frame.src}
      alt=""
      style={{ width: w, height: w * art.aspect, objectFit: "contain", display: "block" }}
    />
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
// Все 7 типов башен теперь имеют растровый арт в TOWER_ART — SVG-фолбэк
// (использовавшийся, пока арт не был готов) полностью вытеснен.
export default function TowerIcon(props: Props) {
  const { size = 36 } = props;
  return <RasterTowerIcon {...props} size={size} />;
}
