import type { GameState } from "../game/engine/gameState";
import { maxFood, usedFood } from "../game/engine/gameState";
import { startWave, startWaveInternal } from "../game/entities/spawnWave";
import { WAVE_DEFS } from "../data/waves";

interface Props {
  state: GameState;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onReset: () => void;
  volume: number;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
}

function volumeEmoji(v: number) {
  if (v === 0)   return "🔇";
  if (v < 0.35)  return "🔈";
  if (v < 0.70)  return "🔉";
  return "🔊";
}

export default function HUD({ state, onUpdateState, onReset, volume, onVolumeChange, onToggleMute }: Props) {
  const { phase, wave, gold, wood, lives, maxLives, spawnQueue, creeps } = state;
  const remaining = creeps.length + spawnQueue.length;
  const isPrep = phase === "prep";
  const isWave = phase === "wave";

  // Один индекс для имени И рекомендации — всегда одна волна
  // Во время волны: текущая (wave-1), в prep/idle: следующая (wave)
  const waveIdx = isWave
    ? Math.max(wave - 1, 0)
    : Math.min(wave, WAVE_DEFS.length - 1);
  const waveDef      = WAVE_DEFS[waveIdx];
  const waveName    = waveDef?.name ?? "";
  const recommended = waveDef?.recommended ?? 0;
  const mobCount    = isWave ? remaining : (waveDef?.entries.length ?? 0);

  // Текущая стоимость башен
  const towerValue = state.towers.reduce((s, t) => s + t.totalInvested, 0);

  return (
    <div className="hud">
      {/* Строка 1: Ресурсы + стоимость башен + звук */}
      <div className="hud-row">
        <span className="hud-stat">💰 {gold}</span>
        <span className="hud-stat">🪵 {wood}</span>
        <span className="hud-stat">🌾 {usedFood(state)}/{maxFood(state)}</span>
        <span className="hud-stat">❤️ {lives}/{maxLives}</span>
        <span className="hud-stat hud-stat-dim">🏰 {towerValue}</span>
        <div className="hud-volume">
          <button className="hud-volume-icon" onClick={onToggleMute}>
            {volumeEmoji(volume)}
          </button>
          <input
            type="range" min="0" max="1" step="0.05"
            value={volume}
            onChange={e => onVolumeChange(+e.target.value)}
            className="hud-volume-slider"
          />
        </div>
      </div>

      {/* Строка 2: Инфо о волне + кнопки */}
      <div className="hud-row">
        <div className="hud-wave-info">
          <span className="hud-stat">🌊 {wave}/20</span>
          {waveName && <span className="hud-wave-name">{waveName}</span>}
          <span className="hud-stat hud-stat-dim">Рек.{recommended}</span>
          <span className="hud-stat hud-stat-dim">👾{mobCount}</span>
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
