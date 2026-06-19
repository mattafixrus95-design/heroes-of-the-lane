import type { GameState } from "../game/engine/gameState";
import { startWave } from "../game/entities/spawnWave";

interface Props {
  state: GameState;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
}

export default function HUD({ state, onUpdateState }: Props) {
  const canStart = state.phase === "idle";
  const remaining = state.creeps.length + state.toSpawn;

  return (
    <div className="hud">
      <div className="hud-stat">💰 {state.gold}</div>
      <div className="hud-stat">❤️ {state.lives}</div>
      <div className="hud-stat">🌊 Волна {state.wave}</div>

      <button
        className="hud-btn"
        disabled={!canStart}
        onClick={() => onUpdateState(startWave)}
      >
        {canStart ? "▶ Начать волну" : `👾 ${remaining}`}
      </button>

      {state.phase === "wave" && (
        <button
          className="hud-btn secondary"
          onClick={() => onUpdateState(s => ({ ...s, isPaused: !s.isPaused }))}
        >
          {state.isPaused ? "▶ Продолжить" : "⏸ Пауза"}
        </button>
      )}
    </div>
  );
}
