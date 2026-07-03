import { memo } from "react";
import type { GameState } from "../game/engine/gameState";
import { TOWER_DEFS } from "../data/towers";
import SawmillSVG from "../assets/SawmillSVG";

interface Props {
  state: GameState;
  onReset: () => void;
}

function StatsOverlay({ state, onReset }: Props) {
  const isVictory = state.phase === "victory";

  const towerCounts: Record<string, number> = {};
  const towerUpgraded: Record<string, number> = {};
  for (const t of state.towers) {
    towerCounts[t.type] = (towerCounts[t.type] ?? 0) + 1;
    if (t.gradeIndex > 0) towerUpgraded[t.type] = (towerUpgraded[t.type] ?? 0) + 1;
  }

  const totalKilled = state.waveStats.reduce((s, w) => s + w.killed, 0);
  const totalGold   = state.waveStats.reduce((s, w) => s + w.goldEarned, 0);

  const towerNames: Record<string, string> = {
    centaur: "Кентавр", dwarf: "Гном", elf: "Эльф", pegasus: "Пегас",
    dendroid: "Дендроид", unicorn: "Единорог", dragon: "Дракон",
  };

  return (
    <div className="overlay" style={{ gap: 12, textAlign: "center" }}>
      <h2 style={{ fontSize: "1.8rem" }}>
        {isVictory ? "🏆 Победа!" : "💀 Поражение"}
      </h2>
      <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Волна {state.wave} из 20</p>

      {/* Статистика по волнам */}
      <div style={{
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 10, padding: "10px 16px", width: "100%", maxWidth: 320,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 6, fontSize: "0.85rem", color: "#f0c040" }}>
          Статистика по волнам
        </div>
        {state.waveStats.map(ws => (
          <div key={ws.wave} style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "0.78rem", color: "#ccc", padding: "2px 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <span>Волна {ws.wave}</span>
            <span>убито: {ws.killed}</span>
            <span style={{ color: "#f0c040" }}>+{ws.goldEarned}💰</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontWeight: 700, fontSize: "0.82rem" }}>
          <span>Итого</span>
          <span>убито: {totalKilled}</span>
          <span style={{ color: "#f0c040" }}>+{totalGold}💰</span>
        </div>
      </div>

      {/* Башни */}
      <div style={{
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 10, padding: "10px 16px", width: "100%", maxWidth: 320,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 6, fontSize: "0.85rem", color: "#f0c040" }}>
          Башни на поле
        </div>
        {Object.keys(TOWER_DEFS).map(type => {
          const cnt = towerCounts[type] ?? 0;
          if (cnt === 0) return null;
          const up = towerUpgraded[type] ?? 0;
          return (
            <div key={type} style={{
              display: "flex", justifyContent: "space-between",
              fontSize: "0.8rem", color: "#ccc", padding: "2px 0",
            }}>
              <span>{towerNames[type]}</span>
              <span>{cnt} шт.{up > 0 ? ` (${up} прокачано)` : ""}</span>
            </div>
          );
        })}
        {state.farm && (
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "0.8rem", color: "#ccc", padding: "2px 0",
          }}>
            <span>🍖 Ферма</span>
            <span>ур. {state.farm.level}</span>
          </div>
        )}
        {state.sawmill && (
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: "0.8rem", color: "#ccc", padding: "2px 0",
          }}>
            <span className="cost-icon"><SawmillSVG size={16} /> Лесопилка</span>
            <span>ур. {state.sawmill.level}</span>
          </div>
        )}
        {state.towers.length === 0 && !state.farm && !state.sawmill && (
          <div style={{ fontSize: "0.78rem", color: "#666" }}>нет башен</div>
        )}
      </div>

      <button onClick={onReset} style={{
        background: "#f0c040", color: "#1a1a2e", border: "none",
        borderRadius: 10, padding: "12px 32px",
        fontSize: "1rem", fontWeight: 700, cursor: "pointer",
        minHeight: 44, touchAction: "manipulation",
      }}>
        Играть снова
      </button>
    </div>
  );
}

// Экран показывается только в конце игры — контент фактически
// перестаёт меняться, кроме gameTime (тикает даже в victory).
// Сверяем ссылки на массивы вместо всего state.
export default memo(StatsOverlay, (prev, next) =>
  prev.onReset === next.onReset &&
  prev.state.phase === next.state.phase &&
  prev.state.wave === next.state.wave &&
  prev.state.towers === next.state.towers &&
  prev.state.waveStats === next.state.waveStats &&
  prev.state.farm === next.state.farm &&
  prev.state.sawmill === next.state.sawmill
);
