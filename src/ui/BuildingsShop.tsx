import type { GameState } from "../game/engine/gameState";
import { SAWMILL_MAX_LEVEL } from "../data/buildings";
import { TOWN_LEVELS } from "../data/buildings";
import type { Selection } from "./selection";
import FarmSVG from "../assets/FarmSVG";
import SawmillSVG from "../assets/SawmillSVG";
import TavernSVG from "../assets/TavernSVG";
import TownIcon from "./TownIcon";

interface Props {
  state: GameState;
  selection: Selection | null;
  onSelect: (s: Selection | null) => void;
}

export default function BuildingsShop({ state, selection, onSelect }: Props) {
  const farmLevel = state.farm?.level ?? 0;
  const farmBuilding = !!state.farm && state.farm.buildTimeRemaining > 0;
  const sawmillLevel = state.sawmill?.level ?? 0;
  const sawmillBuilding = !!state.sawmill && state.sawmill.buildTimeRemaining > 0;
  const sawmillMaxed = sawmillLevel >= SAWMILL_MAX_LEVEL;
  const townDef = TOWN_LEVELS[state.townLevel - 1];
  const townMaxed = state.townLevel >= TOWN_LEVELS.length;
  const tavernBuilding = !!state.tavern && state.tavern.buildTimeRemaining > 0;
  const tavernBuilt = !!state.tavern;

  function isSelected(kind: Selection["kind"]): boolean {
    return selection?.kind === kind;
  }

  return (
    <div className="shop">
      <div
        className={`shop-item${isSelected("farm") ? " selected" : ""}`}
        onClick={() => onSelect(isSelected("farm") ? null : { kind: "farm" })}
      >
        <span className="shop-emoji"><FarmSVG size={26} /></span>
        <span className="shop-name">Ферма{farmLevel > 0 ? ` ур.${farmLevel}` : ""}</span>
        <span className="shop-cost">{farmBuilding ? "⚙️ строится" : farmLevel > 0 ? "" : "построить"}</span>
      </div>

      <div
        className={`shop-item${isSelected("sawmill") ? " selected" : ""}${sawmillMaxed ? " unaffordable" : ""}`}
        onClick={() => onSelect(isSelected("sawmill") ? null : { kind: "sawmill" })}
      >
        <span className="shop-emoji"><SawmillSVG size={26} /></span>
        <span className="shop-name">Лесопилка{sawmillLevel > 0 ? ` ур.${sawmillLevel}` : ""}</span>
        <span className="shop-cost">{sawmillBuilding ? "⚙️ строится" : sawmillMaxed ? "макс." : sawmillLevel > 0 ? "" : "построить"}</span>
      </div>

      <div
        className={`shop-item${isSelected("town") ? " selected" : ""}${townMaxed ? " unaffordable" : ""}`}
        onClick={() => onSelect(isSelected("town") ? null : { kind: "town" })}
      >
        <span className="shop-emoji"><TownIcon level={state.townLevel} size={26} /></span>
        <span className="shop-name">{townDef.name}</span>
        <span className="shop-cost">{townMaxed ? "макс." : ""}</span>
      </div>

      <div
        className={`shop-item${isSelected("tavern") ? " selected" : ""}`}
        onClick={() => onSelect(isSelected("tavern") ? null : { kind: "tavern" })}
      >
        <span className="shop-emoji"><TavernSVG size={26} /></span>
        <span className="shop-name">Таверна</span>
        <span className="shop-cost">{tavernBuilding ? "⚙️ строится" : tavernBuilt ? "" : "построить"}</span>
      </div>
    </div>
  );
}
