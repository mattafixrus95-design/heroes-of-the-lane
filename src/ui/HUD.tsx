import type { GameState } from "../game/engine/gameState";
import { startWave } from "../game/entities/spawnWave";
import versionData from "../version.json";

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

      <button className="hud-btn reset" onClick={onReset}>🔄</button>

      <button
        title="Обновить до последней версии"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 6, color: "#888",
          fontSize: "0.68rem", padding: "3px 8px",
          cursor: "pointer", marginLeft: 4,
          touchAction: "manipulation",
        }}
        onClick={() => {
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistrations().then(regs => {
              regs.forEach(r => r.update());
            });
          }
          window.location.reload();
        }}
      >
        🔄 v{versionData.version}
      </button>
    </div>
  );
}
