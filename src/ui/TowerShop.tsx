import type { TowerType } from "../data/towers";
import { TOWER_DEFS } from "../data/towers";
import TowerIcon from "./TowerIcon";

export type ShopItem = TowerType;

interface Props {
  gold: number;
  food: number;
  selected: ShopItem | null;
  waveActive: boolean;
  onSelect: (item: ShopItem | null) => void;
}

export default function TowerShop({ gold, food, selected, waveActive, onSelect }: Props) {
  return (
    <div
      className="shop"
      style={waveActive ? { filter: "blur(2px)", pointerEvents: "none", opacity: 0.5 } : undefined}
    >
      {Object.values(TOWER_DEFS).map(def => {
        const base = def.grades[0];
        const canAffordGold = gold >= def.purchaseCost;
        const canAffordFood = food >= def.foodCost;
        const canAfford = canAffordGold && canAffordFood;
        const isSelected = selected === def.type;
        return (
          <button
            key={def.type}
            className={`shop-item${isSelected ? " selected" : ""}${!canAfford ? " unaffordable" : ""}`}
            onClick={() => canAfford && onSelect(isSelected ? null : def.type)}
            disabled={!canAfford && !isSelected}
          >
            <span className="shop-emoji"><TowerIcon type={def.type} grade={0} size={40} /></span>
            <span className="shop-name">{def.name} · {base.gradeName}</span>
            <span className="shop-stat">⚔️ {base.damage}{base.aoe > 0 ? ` AoE${base.aoe}` : ""}</span>
            <span className="shop-stat">🎯 {base.range} &nbsp; ⚡ {base.attackSpeed}/с</span>
            <span className="shop-cost">💰 {def.purchaseCost} &nbsp; 🌾 {def.foodCost}</span>
          </button>
        );
      })}
      {selected && (
        <button className="shop-cancel" onClick={() => onSelect(null)}>✕</button>
      )}
    </div>
  );
}
