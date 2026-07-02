import type { GameState } from "../game/engine/gameState";
import { TOWN_LEVELS } from "../data/buildings";
import TowerShop from "./TowerShop";
import type { ShopItem } from "./TowerShop";
import BuildingsShop from "./BuildingsShop";
import type { Selection } from "./selection";
import type { TowerType } from "../data/towers";

export type BottomTab = "towers" | "buildings" | null;

interface Props {
  state: GameState;
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
  selectedShopItem: ShopItem | null;
  onSelectShopItem: (item: ShopItem | null) => void;
  onInfo: (type: TowerType) => void;
  selection: Selection | null;
  onSelectBuilding: (s: Selection | null) => void;
}

export default function BottomHUD({
  state, activeTab, onTabChange,
  selectedShopItem, onSelectShopItem, onInfo,
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
          waveActive={state.phase === "wave"}
          maxBuildTier={maxBuildTier}
          onSelect={onSelectShopItem}
          onInfo={onInfo}
        />
      )}

      {activeTab === "buildings" && (
        <BuildingsShop state={state} selection={selection} onSelect={onSelectBuilding} />
      )}
    </div>
  );
}
