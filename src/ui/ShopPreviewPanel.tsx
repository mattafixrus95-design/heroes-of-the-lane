import { memo } from "react";
import type { TowerType } from "../data/towers";
import { TOWER_DEFS } from "../data/towers";
import TowerIcon from "./TowerIcon";
import InfoBadge from "./InfoBadge";

interface Props {
  type: TowerType;
  onShowInfo: (type: TowerType) => void;
}

function ShopPreviewPanel({ type, onShowInfo }: Props) {
  const def = TOWER_DEFS[type];
  const grade = def.grades[0];

  return (
    <div className="context-menu">
      <div className="cm-header">
        <span className="cm-title">
          <TowerIcon type={type} grade={0} size={26} />
          {" "}{def.name} · {grade.gradeName}
        </span>
        <InfoBadge onClick={() => onShowInfo(type)} />
      </div>

      <div className="cm-stats">
        <span>⚔️ {grade.damage}</span>
        <span>🎯 {grade.range}</span>
        <span>⚡ {grade.attackSpeed}/с</span>
        {grade.ability?.kind === "aoe"           && <span>💥 AoE r{grade.ability.radius}</span>}
        {grade.ability?.kind === "multishot"     && <span>🏹 +{grade.ability.extraTargets}×{Math.round(grade.ability.extraDmgPct * 100)}%</span>}
        {grade.ability?.kind === "crit"           && <span>🎯 Крит {Math.round(grade.ability.chance * 100)}%×{grade.ability.multiplier}</span>}
        {grade.ability?.kind === "vulnerability" && <span>🔻 Уязв. +{Math.round(grade.ability.pct * 100)}%</span>}
        {grade.ability?.kind === "root"           && <span>🌿 Корни /{grade.ability.everyNth}</span>}
        {grade.ability?.kind === "aura_haste"     && <span>✨ Аура +{Math.round(grade.ability.pct * 100)}%</span>}
        {grade.slow > 0 && <span>❄️ {grade.slow * 100}%</span>}
        <span>💰 {def.purchaseCost}</span>
        <span>🍖 {def.foodCost}</span>
      </div>
    </div>
  );
}

export default memo(ShopPreviewPanel);
