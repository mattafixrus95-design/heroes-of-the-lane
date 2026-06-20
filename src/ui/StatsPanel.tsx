import type { GameState } from "../game/engine/gameState";
import { WAVE_DEFS, CREEP_DEFS } from "../data/waves";

interface Props {
  state: GameState;
  onClose: () => void;
}

function enemyValueSent(waveCount: number): number {
  let total = 0;
  for (let i = 0; i < Math.min(waveCount, WAVE_DEFS.length); i++) {
    for (const entry of WAVE_DEFS[i].entries) {
      total += CREEP_DEFS[entry.kind].reward;
    }
  }
  return total;
}

export default function StatsPanel({ state, onClose }: Props) {
  const enemyValue = enemyValueSent(state.wave);
  const towerValue = state.towers.reduce((s, t) => s + t.totalInvested, 0);
  const diff = towerValue - enemyValue;

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
          Баланс сил — волна {state.wave}
        </div>

        <Row label="Потрачено врагом" value={enemyValue} color="#e57373" />
        <Row label="Велью башен" value={towerValue} color="#81c784" />

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 10,
          display: "flex", justifyContent: "space-between", fontSize: "0.85rem",
        }}>
          <span style={{ color: "#aaa" }}>Разница</span>
          <span style={{ color: diff >= 0 ? "#81c784" : "#e57373", fontWeight: 700 }}>
            {diff >= 0 ? "+" : ""}{diff}💰
          </span>
        </div>

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
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
      <span style={{ color: "#ccc" }}>{label}</span>
      <span style={{ color, fontWeight: 700 }}>{value}💰</span>
    </div>
  );
}
