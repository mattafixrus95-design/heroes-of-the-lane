import { memo } from "react";
import type { TowerType } from "../data/towers";
import { TOWER_DEFS } from "../data/towers";
import TowerIcon from "./TowerIcon";

const TRAIT: Record<TowerType, string> = {
  centaur:  "После апгрейда — 20% шанс нанести двойной урон",
  dwarf:    "После апгрейда замедляет врагов на 25% (не стакается)",
  elf:      "После апгрейда — Мультишот: основная стрела + 3 доп. по 40% урона",
  pegasus:  "Цель получает больше входящего урона (не стакается, обновляется)",
  dendroid: "Каждая N-я атака сковывает цель на 0.75с",
  unicorn:  "Аура: соседние башни атакуют быстрее",
  dragon:   "Огненный выстрел с AoE уроном по площади",
};

interface Props {
  type: TowerType;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#ddd" }}>
      <span style={{ color: "#999" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function TowerInfoModal({ type, onClose }: Props) {
  const def = TOWER_DEFS[type];
  const base = def.grades[0];
  const up   = def.grades[1];

  return (
    <div className="tower-menu-overlay" onClick={onClose}>
      <div className="tower-menu" style={{ gap: 10 }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="tm-header">
          <div className="tm-title">
            <TowerIcon type={type} grade={0} size={26} />
            {def.name}
          </div>
          <button className="tm-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ fontSize: "0.78rem", color: "#aaa", lineHeight: 1.3 }}>{TRAIT[type]}</div>

        {/* Base grade */}
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ fontSize: "0.7rem", color: "#f0c040", fontWeight: 700, marginBottom: 2 }}>
            {base.gradeName} — базовый
          </div>
          <Row label="Урон"          value={base.damage} />
          <Row label="Дальность"     value={base.range} />
          <Row label="Скорость (APS)" value={`${base.attackSpeed}/с`} />
          {base.ability?.kind === "aoe"           && <Row label="AoE радиус"    value={base.ability.radius} />}
          {base.ability?.kind === "multishot"     && <Row label="Мультишот"    value={`+${base.ability.extraTargets}×${Math.round(base.ability.extraDmgPct * 100)}%`} />}
          {base.ability?.kind === "crit"          && <Row label="Крит. удар"   value={`${Math.round(base.ability.chance * 100)}% × ${base.ability.multiplier}`} />}
          {base.ability?.kind === "vulnerability" && <Row label="Уязвимость"   value={`+${Math.round(base.ability.pct * 100)}% на ${base.ability.duration}с`} />}
          {base.ability?.kind === "root"          && <Row label="Сковывание"  value={`каждая ${base.ability.everyNth}-я атака`} />}
          {base.ability?.kind === "aura_haste"    && <Row label="Аура скор."  value={`+${Math.round(base.ability.pct * 100)}% r${base.ability.radius}`} />}
          {base.slow > 0 && <Row label="Замедление" value={`${Math.round(base.slow * 100)}%`} />}
          <div style={{ marginTop: 4, fontSize: "0.78rem", color: "#f0c040", fontWeight: 700 }}>
            💰 {def.purchaseCost} &nbsp; 🍖 {def.foodCost}
          </div>
        </div>

        {/* Upgrade grade */}
        <div style={{ background: "rgba(42,157,157,0.08)", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ fontSize: "0.7rem", color: "#2a9d9d", fontWeight: 700, marginBottom: 2 }}>
            {up.gradeName} — улучшение
          </div>
          <Row label="Урон"          value={up.damage} />
          <Row label="Дальность"     value={up.range} />
          <Row label="Скорость (APS)" value={`${up.attackSpeed}/с`} />
          {up.ability?.kind === "aoe"           && <Row label="AoE радиус"    value={up.ability.radius} />}
          {up.ability?.kind === "multishot"     && <Row label="Мультишот"    value={`+${up.ability.extraTargets}×${Math.round(up.ability.extraDmgPct * 100)}%`} />}
          {up.ability?.kind === "crit"          && <Row label="Крит. удар"   value={`${Math.round(up.ability.chance * 100)}% × ${up.ability.multiplier}`} />}
          {up.ability?.kind === "vulnerability" && <Row label="Уязвимость"   value={`+${Math.round(up.ability.pct * 100)}% на ${up.ability.duration}с`} />}
          {up.ability?.kind === "root"          && <Row label="Сковывание"  value={`каждая ${up.ability.everyNth}-я атака`} />}
          {up.ability?.kind === "aura_haste"    && <Row label="Аура скор."  value={`+${Math.round(up.ability.pct * 100)}% r${up.ability.radius}`} />}
          {up.slow > 0 && <Row label="Замедление"  value={`${Math.round(up.slow * 100)}%`} />}
          <div style={{ marginTop: 4, fontSize: "0.78rem", color: "#2a9d9d", fontWeight: 700 }}>
            💰 {up.upgradeCost}
            {up.foodUpgradeCost > 0 && <> &nbsp; 🍖 {up.foodUpgradeCost}</>}
            &nbsp; ⏱ {up.upgradeTime}с
          </div>
        </div>

      </div>
    </div>
  );
}

export default memo(TowerInfoModal);
