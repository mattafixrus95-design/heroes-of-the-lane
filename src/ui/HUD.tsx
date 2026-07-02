import type { GameState } from "../game/engine/gameState";
import { startWave, startWaveInternal } from "../game/entities/spawnWave";
import { WAVE_DEFS } from "../data/waves";

interface Props {
  state: GameState;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function HUD({ state, onUpdateState, onReset, soundEnabled, onToggleSound }: Props) {
  const { phase, wave, gold, lives, food, spawnQueue, creeps } = state;
  const remaining = creeps.length + spawnQueue.length;
  const isPrep = phase === "prep";
  const isWave = phase === "wave";

  // Один индекс для имени И рекомендации — всегда одна волна
  // Во время волны: текущая (wave-1), в prep/idle: следующая (wave)
  const waveIdx = isWave
    ? Math.max(wave - 1, 0)
    : Math.min(wave, WAVE_DEFS.length - 1);
  const waveName    = WAVE_DEFS[waveIdx]?.name ?? "";
  const recommended = WAVE_DEFS[waveIdx]?.recommended ?? 0;

  // Текущая стоимость башен
  const towerValue = state.towers.reduce((s, t) => s + t.totalInvested, 0);

  return (
    <div className="hud">
      {/* Строка 1: Ресурсы + стоимость башен + звук */}
      <div className="hud-row">
        <span className="hud-stat">💰 {gold}</span>
        <span className="hud-stat">❤️ {lives}</span>
        <span className="hud-stat">🌾 {food}</span>
        <span className="hud-stat hud-stat-dim">🏰 {towerValue}</span>
        <button className="hud-btn secondary hud-sound-btn" onClick={onToggleSound}>
          {soundEnabled ? "🔊" : "🔇"}
        </button>
      </div>

      {/* Строка 2: Инфо о волне + кнопки */}
      <div className="hud-row">
        <div className="hud-wave-info">
          <span className="hud-stat">🌊 {wave}/20</span>
          {waveName && <span className="hud-wave-name">{waveName}</span>}
          <span className="hud-stat hud-stat-dim">Рек.{recommended}</span>
          {isPrep && (
            <>
              <span className="hud-stat" style={{ color: "#f0c040" }}>
                ⏱ {Math.ceil(state.prepTimer)}с
              </span>
              <button
                className="hud-btn"
                style={{ padding: "4px 10px", fontSize: "0.78rem", minHeight: 28 }}
                onClick={() => onUpdateState(startWaveInternal)}
              >
                ⚔️ Вперёд
              </button>
            </>
          )}
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
          <button className="hud-btn secondary" onClick={onReset}>↺</button>
        </div>
      </div>
    </div>
  );
}
