import { memo } from "react";
import type { GameState } from "../game/engine/gameState";
import { TOWN_LEVELS } from "../data/buildings";
import TowerShop from "./TowerShop";
import type { ShopItem } from "./TowerShop";
import BuildingsShop from "./BuildingsShop";
import type { Selection } from "./selection";

export type BottomTab = "towers" | "buildings" | null;

interface Props {
  state: GameState;
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  selectedShopItem: ShopItem | null;
  onSelectShopItem: (item: ShopItem | null) => void;
  selection: Selection | null;
  onSelectBuilding: (s: Selection | null) => void;
}

function BottomHUD({
  state, activeTab, onTabChange,
  selectedShopItem, onSelectShopItem,
  selection, onSelectBuilding,
}: Props) {
  const maxBuildTier = TOWN_LEVELS[state.townLevel - 1].maxBuildTier;

  return (
    <div className="bottom-hud">
      <div className="bottom-hud-tabs">
        <button
          className={`bottom-hud-tab${activeTab === "towers" ? " active" : ""}`}
          onClick={() => onTabChange(activeTab === "towers" ? null : "towers")}
        >
          🗼 Башни
        </button>
        <button
          className={`bottom-hud-tab${activeTab === "buildings" ? " active" : ""}`}
          onClick={() => onTabChange(activeTab === "buildings" ? null : "buildings")}
        >
          🏘️ Здания
        </button>
      </div>

      {activeTab === "towers" && (
        <TowerShop
          gold={state.gold}
          food={state.food}
          selected={selectedShopItem}
          maxBuildTier={maxBuildTier}
          onSelect={onSelectShopItem}
        />
      )}

      {activeTab === "buildings" && (
        <BuildingsShop state={state} selection={selection} onSelect={onSelectBuilding} />
      )}
    </div>
  );
}

// state целиком меняется каждый кадр (state.gameTime), поэтому обычный
// memo не сработал бы — сверяем только поля, которые реально читают
// TowerShop/BuildingsShop.
export default memo(BottomHUD, (prev, next) => {
  if (
    prev.activeTab !== next.activeTab ||
    prev.onTabChange !== next.onTabChange ||
    prev.selectedShopItem !== next.selectedShopItem ||
    prev.onSelectShopItem !== next.onSelectShopItem ||
    prev.selection !== next.selection ||
    prev.onSelectBuilding !== next.onSelectBuilding
  ) return false;

  const ps = prev.state, ns = next.state;
  return (
    ps.gold === ns.gold &&
    ps.food === ns.food &&
    ps.townLevel === ns.townLevel &&
    (ps.farm?.level ?? 0) === (ns.farm?.level ?? 0) &&
    ((ps.farm?.buildTimeRemaining ?? 0) > 0) === ((ns.farm?.buildTimeRemaining ?? 0) > 0) &&
    (ps.sawmill?.level ?? 0) === (ns.sawmill?.level ?? 0) &&
    ((ps.sawmill?.buildTimeRemaining ?? 0) > 0) === ((ns.sawmill?.buildTimeRemaining ?? 0) > 0)
  );
});
