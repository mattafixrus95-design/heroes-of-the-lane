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
  onInfo: (type: TowerType) => void;
}

export default function TowerShop({ gold, food, selected, waveActive, onSelect, onInfo }: Props) {
  return (
    <div className="shop">
      {Object.values(TOWER_DEFS).map(def => {
        const canAfford = gold >= def.purchaseCost && food >= def.foodCost;
        const isSelected = selected === def.type;
        const clickable = !waveActive && (canAfford || isSelected);
        return (
          <div
            key={def.type}
            className={`shop-item${isSelected ? " selected" : ""}${!canAfford ? " unaffordable" : ""}`}
            style={{ cursor: clickable ? "pointer" : waveActive ? "default" : "not-allowed" }}
            onClick={() => clickable && onSelect(isSelected ? null : def.type)}
          >
            <button
              className="shop-info-btn"
              onClick={e => { e.stopPropagation(); onInfo(def.type); }}
            >
              ℹ
            </button>
            <span className="shop-emoji">
              <TowerIcon type={def.type} grade={0} size={26} />
            </span>
            <span className="shop-name">{def.name}</span>
            <span className="shop-cost">💰{def.purchaseCost} 🌾{def.foodCost}</span>
          </div>
        );
      })}
    </div>
  );
}
