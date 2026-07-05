import { memo } from "react";
import type { HeroType } from "../data/heroes";
import { HERO_DEFS } from "../data/heroes";
import { HERO_HIRE_COST } from "../data/buildings";
import HeroIcon from "./HeroIcon";
import InfoBadge from "./InfoBadge";

interface Props {
  type: HeroType;
  onShowInfo: (type: HeroType) => void;
}

function HeroPreviewPanel({ type, onShowInfo }: Props) {
  const def = HERO_DEFS[type];

  return (
    <div className="context-menu">
      <div className="cm-header">
        <span className="cm-title">
          <HeroIcon type={type} size={26} />
          {" "}{def.name} · {def.race} {def.className}
        </span>
        <InfoBadge onClick={() => onShowInfo(type)} />
      </div>

      <div className="cm-stats">
        <span>⚔️ {def.damage}</span>
        <span>🎯 {def.range}</span>
        <span>⚡ {def.attackSpeed}/с</span>
        <span>🍖 {def.foodCost}</span>
        <span>⏱ {def.buildTime}с</span>
        <span>💰 {HERO_HIRE_COST}</span>
      </div>

      {def.ability.kind === "aura_damage" && (
        <div className="cm-stats">
          <span>✨ Аура +{Math.round(def.ability.basePct * 100)}% урона башням · r{def.ability.radius}</span>
        </div>
      )}
    </div>
  );
}

export default memo(HeroPreviewPanel);
