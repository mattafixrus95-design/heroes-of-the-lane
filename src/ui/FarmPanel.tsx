import type { Farm } from "../game/engine/gameState";
import { FARM_FOOD_PER_LEVEL } from "../game/engine/gameState";

interface Props {
  farms: Farm[];
  onSelectFarmId: (id: string) => void;
}

export default function FarmPanel({ farms, onSelectFarmId }: Props) {
  if (farms.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
      {farms.map(farm => {
        const level = Math.round(farm.foodProduced / FARM_FOOD_PER_LEVEL);
        return (
          <button
            key={farm.id}
            onClick={() => onSelectFarmId(farm.id)}
            style={{
              background: "rgba(139,195,74,0.12)",
              border: "1px solid rgba(139,195,74,0.35)",
              borderRadius: 8,
              color: "#c8e6a0",
              padding: "6px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.82rem",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>🌾</span>
            <span>
              <span style={{ fontWeight: 700 }}>Ферма ур.{level}</span>
              <span style={{ color: "#8bc34a", marginLeft: 6 }}>+{farm.foodProduced} еды</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
