import type { HeroType } from "../data/heroes";
import type { HeroAttackPhase } from "../game/systems/heroAttack";
import ivorIdle from "../assets/heroes/ivor/Ivor_idle.png";
import ivorReady from "../assets/heroes/ivor/Ivor_ready.png";
import ivorAfterShot from "../assets/heroes/ivor/Ivor_after_shot.png";

const IVOR_FRAMES: Record<HeroAttackPhase, string> = {
  idle: ivorIdle,
  ready: ivorReady,
  after_shot: ivorAfterShot,
};
// Соотношение сторон обработанных PNG (360x510) — сохраняем при масштабировании по size.
const ASPECT = 510 / 360;

interface Props {
  type: HeroType;
  size?: number;
  phase?: HeroAttackPhase;
}

export default function HeroIcon({ type, size = 36, phase = "idle" }: Props) {
  void type; // пока единственный герой; при добавлении новых — switch по type
  return (
    <img
      src={IVOR_FRAMES[phase]}
      alt=""
      style={{ width: size, height: size * ASPECT, objectFit: "contain", display: "block" }}
    />
  );
}
