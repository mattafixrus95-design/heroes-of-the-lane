import type { GameState } from "../game/engine/gameState";
import { startWave } from "../game/entities/spawnWave";

interface Props {
  state: GameState;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onReset: () => void;
}

export default function HUD({ state, onUpdateState, onReset }: Props) {
  const { phase, wave, gold, lives, food, spawnQueue, creeps } = state;
  const remaining = creeps.length + spawnQueue.length;
  const isPrep = phase === "prep";
  const isWave = phase === "wave";

  return (
    <div className="hud">
      <div className="hud-stat">💰 {gold}</div>
      <div className="hud-stat">❤️ {lives}</div>
      <div className="hud-stat">🌾 {food}</div>
      <div className="hud-stat">🌊 {wave}/10</div>

      {phase === "idle" && (
        <button className="hud-btn" onClick={() => onUpdateState(startWave)}>
          ▶ Начать
        </button>
      )}

      {isPrep && (
        <div className="hud-btn secondary" style={{ cursor: "default", minWidth: 120 }}>
          ⏱ Волна {wave + 1} через {Math.ceil(state.prepTimer)}с
        </div>
      )}

      {isWave && (
        <div className="hud-btn secondary" style={{ cursor: "default" }}>
          👾 {remaining}
        </div>
      )}

      {(isWave || isPrep) && (
        <button
          className="hud-btn secondary"
          onClick={() => onUpdateState(s => ({ ...s, isPaused: !s.isPaused }))}
        >
          {state.isPaused ? "▶ Продолжить" : "⏸ Пауза"}
        </button>
      )}

      <button className="hud-btn reset" onClick={onReset}>↺</button>
    </div>
  );
}
