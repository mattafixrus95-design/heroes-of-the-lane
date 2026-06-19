import type { GameState, Phase } from "../game/engine/gameState";
import { spawnWave } from "../game/entities/spawnWave";

interface Props {
  state: GameState;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
}

const phaseLabel: Record<Phase, string> = {
  idle: "Готов",
  wave: "Волна идёт...",
  victory: "Победа!",
  defeat: "Поражение",
};

export default function HUD({ state, onUpdateState }: Props) {
  const canStart = state.phase === "idle";

  return (
    <div className="hud">
      <div className="hud-stat">💰 {state.gold}</div>
      <div className="hud-stat">❤️ {state.lives}</div>
      <div className="hud-stat">🌊 Волна {state.wave}</div>
      <div className="hud-stat hud-phase">{phaseLabel[state.phase]}</div>
      <button
        className="hud-btn"
        disabled={!canStart}
        onClick={() => onUpdateState(spawnWave)}
      >
        {canStart ? "▶ Начать волну" : "..."}
      </button>
    </div>
  );
}
