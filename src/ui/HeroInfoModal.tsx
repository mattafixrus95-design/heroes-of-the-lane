import { memo } from "react";
import type { HeroType } from "../data/heroes";
import { HERO_DEFS, heroAuraPct } from "../data/heroes";
import { HERO_HIRE_COST, HERO_MAX_LEVEL } from "../data/buildings";
import HeroIcon from "./HeroIcon";

interface Props {
  type: HeroType;
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

function HeroInfoModal({ type, onClose }: Props) {
  const def = HERO_DEFS[type];
  const maxAuraPct = def.ability.kind === "aura_damage" ? heroAuraPct(HERO_MAX_LEVEL, def.ability) : 0;

  return (
    <div className="tower-menu-overlay" onClick={onClose}>
      <div className="tower-menu" style={{ gap: 10 }} onClick={e => e.stopPropagation()}>

        <div className="tm-header">
          <div className="tm-title">
            <HeroIcon type={type} size={26} />
            {def.name} · {def.race} {def.className}
          </div>
          <button className="tm-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ fontSize: "0.78rem", color: "#aaa", lineHeight: 1.3 }}>
          Герой стреляет по врагам как башня, но занимает клетку на поле и не продаётся.
          На поле одновременно может быть только один герой.
          {def.ability.kind === "aura_damage" && " Даёт ауру урона соседним башням, растущую с уровнем."}
          {" "}Уровень героя растёт вместе с волнами; на макс. уровне усиливается и его собственная атака.
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ fontSize: "0.7rem", color: "#f0c040", fontWeight: 700, marginBottom: 2 }}>
            Базовые характеристики (ур. 1)
          </div>
          <Row label="Урон"           value={def.damage} />
          <Row label="Дальность"      value={def.range} />
          <Row label="Скорость (APS)" value={`${def.attackSpeed}/с`} />
          <Row label="Еда"            value={def.foodCost} />
          <Row label="Время выхода"   value={`${def.buildTime}с`} />
          <div style={{ marginTop: 4, fontSize: "0.78rem", color: "#f0c040", fontWeight: 700 }}>
            💰 Найм: {HERO_HIRE_COST}
          </div>
        </div>

        <div style={{ background: "rgba(42,157,157,0.08)", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ fontSize: "0.7rem", color: "#2a9d9d", fontWeight: 700, marginBottom: 2 }}>
            Рост по уровням (макс. ур. {HERO_MAX_LEVEL})
          </div>
          <Row label="Урон" value={`+1 за каждый уровень`} />
          <Row label="Дальность / APS" value={`бонус на ${HERO_MAX_LEVEL} ур.`} />
          {def.ability.kind === "aura_damage" && (
            <Row label="Аура урона" value={`+${Math.round(def.ability.basePct * 100)}% → +${Math.round(maxAuraPct * 100)}% · r${def.ability.radius}`} />
          )}
        </div>

      </div>
    </div>
  );
}

export default memo(HeroInfoModal);
