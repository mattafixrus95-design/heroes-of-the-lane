import type { TowerType } from "../data/towers";
import { TOWER_DEFS } from "../data/towers";

interface Props {
  gold: number;
  selected: TowerType | null;
  waveActive: boolean;
  onSelect: (type: TowerType | null) => void;
}

export default function TowerShop({ gold, selected, waveActive, onSelect }: Props) {
  return (
    <div className="shop">
      {waveActive && <div className="shop-locked">🔒 Строительство заблокировано</div>}
      {!waveActive && (Object.values(TOWER_DEFS)).map(def => {
        const base = def.grades[0];
        const canAfford = gold >= def.purchaseCost;
        const isSelected = selected === def.type;
        return (
          <button
            key={def.type}
            className={`shop-item${isSelected ? " selected" : ""}${!canAfford ? " unaffordable" : ""}`}
            onClick={() => canAfford && onSelect(isSelected ? null : def.type)}
            disabled={!canAfford && !isSelected}
          >
            <span className="shop-emoji">{def.emoji}</span>
            <span className="shop-name">{def.name} · {base.gradeName}</span>
            <span className="shop-stat">⚔️ {base.damage}{base.aoe > 0 ? ` AoE${base.aoe}` : ""}</span>
            <span className="shop-stat">🎯 {base.range} &nbsp; ⚡ {base.attackSpeed}/с</span>
            <span className="shop-cost">💰 {def.purchaseCost}</span>
          </button>
        );
      })}
      {!waveActive && selected && (
        <button className="shop-cancel" onClick={() => onSelect(null)}>✕</button>
      )}
    </div>
  );
}
