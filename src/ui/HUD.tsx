import type { GameState } from "../game/engine/gameState";
import { startWave } from "../game/entities/spawnWave";
import { WAVE_DEFS } from "../data/waves";

interface Props {
  state: GameState;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onReset: () => void;
  onShowStats: () => void;
}

export default function HUD({ state, onUpdateState, onReset, onShowStats }: Props) {
  const { phase, wave, gold, lives, food, spawnQueue, creeps } = state;
  const remaining = creeps.length + spawnQueue.length;
  const isPrep = phase === "prep";
  const isWave = phase === "wave";

  // Wave name: during active wave show current, otherwise show upcoming
  const nameIdx = isWave
    ? Math.max(wave - 1, 0)
    : Math.min(wave, WAVE_DEFS.length - 1);
  const waveName = WAVE_DEFS[nameIdx]?.name ?? "";

  return (
    <div className="hud">
      {/* Строка 1: Ресурсы */}
      <div className="hud-row">
        <span className="hud-stat">💰 {gold}</span>
        <span className="hud-stat">❤️ {lives}</span>
        <span className="hud-stat">🌾 {food}</span>
      </div>

      {/* Строка 2: Инфо о волне + кнопки */}
      <div className="hud-row">
        <div className="hud-wave-info">
          <span className="hud-stat">🌊 {wave}/20</span>
          {waveName && <span className="hud-wave-name">{waveName}</span>}
          {/* Таймер до волны — сразу после названия */}
          {isPrep && (
            <span className="hud-stat" style={{ color: "#f0c040" }}>
              ⏱ {Math.ceil(state.prepTimer)}с
            </span>
          )}
          {/* Счётчик крипов — появляется когда волна началась */}
          {isWave && (
            <span className="hud-stat">👾 {remaining}</span>
          )}
        </div>

        <div className="hud-actions">
          {phase === "idle" && (
            <button className="hud-btn" onClick={() => onUpdateState(startWave)}>
              ▶ Начать
            </button>
          )}

          {(isWave || isPrep) && (
            <button
              className="hud-btn secondary"
              onClick={() => onUpdateState(s => ({ ...s, isPaused: !s.isPaused }))}
            >
              {state.isPaused ? "▶" : "⏸"}
            </button>
          )}

          <button className="hud-btn secondary" onClick={onShowStats}>📊</button>
          <button className="hud-btn secondary" onClick={onReset}>↺</button>
        </div>
      </div>
    </div>
  );
}
