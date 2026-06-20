import type { GameState } from "../game/engine/gameState";
import { WAVE_DEFS } from "../data/waves";

interface Props {
  state: GameState;
  onClose: () => void;
}

export default function StatsPanel({ state, onClose }: Props) {
  // Always show recommendation for the NEXT wave
  const nextWaveNum = Math.min(state.wave + 1, 20);
  const nextWaveIdx = Math.min(state.wave, WAVE_DEFS.length - 1);
  const recommended = WAVE_DEFS[nextWaveIdx]?.recommended ?? 0;
  const towerValue = state.towers.reduce((s, t) => s + t.totalInvested, 0);

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 14, padding: "20px 24px", minWidth: 280, maxWidth: 340,
          display: "flex", flexDirection: "column", gap: 14,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 700, fontSize: "1rem", textAlign: "center", color: "#f0c040" }}>
          Информация об игре
        </div>

        <Row label={`Рекомендуемая стоимость башен к уровню ${nextWaveNum}`} value={recommended} color="#e57373" />
        <Row label="Текущая стоимость башен" value={towerValue} color="#81c784" />

        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8, color: "#ccc", fontSize: "0.85rem",
            padding: "8px 0", cursor: "pointer", touchAction: "manipulation",
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: "0.85rem" }}>
      <span style={{ color: "#ccc" }}>{label}</span>
      <span style={{ color, fontWeight: 700, whiteSpace: "nowrap" }}>{value}💰</span>
    </div>
  );
}
