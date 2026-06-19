import type { TowerType } from "../data/towers";
import { TOWER_DEFS } from "../data/towers";

interface Props {
  gold: number;
  selected: TowerType | null;
  onSelect: (type: TowerType | null) => void;
}

export default function TowerShop({ gold, selected, onSelect }: Props) {
  return (
    <div className="shop">
      {(Object.values(TOWER_DEFS)).map(def => {
        const canAfford = gold >= def.cost;
        const isSelected = selected === def.type;
        return (
          <button
            key={def.type}
            className={`shop-item${isSelected ? " selected" : ""}${!canAfford ? " unaffordable" : ""}`}
            onClick={() => onSelect(isSelected ? null : def.type)}
            disabled={!canAfford && !isSelected}
          >
            <span className="shop-emoji">{def.emoji}</span>
            <span className="shop-name">{def.name}</span>
            <span className="shop-stat">⚔️ {def.damage}{def.aoe > 0 ? " AoE" : ""}</span>
            <span className="shop-stat">🎯 {def.range}</span>
            <span className="shop-stat">⚡ {def.attackSpeed}/с</span>
            <span className="shop-cost">💰 {def.cost}</span>
            <span className="shop-sell">продать: {def.sellValue}</span>
          </button>
        );
      })}
      {selected && (
        <button className="shop-cancel" onClick={() => onSelect(null)}>✕</button>
      )}
    </div>
  );
}
