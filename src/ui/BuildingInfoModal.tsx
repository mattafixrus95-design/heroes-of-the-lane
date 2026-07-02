import type { ReactNode } from "react";
import {
  FARM_COST, FARM_BUILD_TIME, FARM_FOOD_PER_LEVEL,
  sawmillCost, SAWMILL_GOLD_COST, SAWMILL_MAX_LEVEL, SAWMILL_BUILD_TIME, SAWMILL_TICK_INTERVAL, SAWMILL_WOOD_PER_LEVEL,
  TOWN_LEVELS,
} from "../data/buildings";
import WoodSVG from "../assets/WoodSVG";
import SawmillSVG from "../assets/SawmillSVG";

interface Props {
  kind: "farm" | "sawmill" | "town";
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#ddd" }}>
      <span style={{ color: "#999" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export default function BuildingInfoModal({ kind, onClose }: Props) {
  return (
    <div className="tower-menu-overlay" onClick={onClose}>
      <div className="tower-menu" style={{ gap: 10 }} onClick={e => e.stopPropagation()}>
        <div className="tm-header">
          <div className="tm-title">
            {kind === "farm" && "🌾 Ферма"}
            {kind === "sawmill" && <span className="cost-icon"><SawmillSVG size={22} /> Лесопилка</span>}
            {kind === "town" && "🏘️ Город"}
          </div>
          <button className="tm-close" onClick={onClose}>✕</button>
        </div>

        {kind === "farm" && (
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ fontSize: "0.78rem", color: "#aaa", lineHeight: 1.3, marginBottom: 4 }}>
              Увеличивает максимальный запас еды. Уровней неограниченно.
            </div>
            <Row label="Стройка"        value={`${FARM_BUILD_TIME}с на грейд`} />
            <Row label="+еды за грейд"  value={FARM_FOOD_PER_LEVEL} />
            <Row label="Стоимость"      value={<span className="cost-icon">💰{FARM_COST.gold} <WoodSVG size={13} />{FARM_COST.wood}</span>} />
          </div>
        )}

        {kind === "sawmill" && (
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ fontSize: "0.78rem", color: "#aaa", lineHeight: 1.3, marginBottom: 4 }}>
              Автоматически производит дерево каждые {SAWMILL_TICK_INTERVAL} секунд. Максимум {SAWMILL_MAX_LEVEL} уровней.
              Золото за грейд всегда {SAWMILL_GOLD_COST}, дерево растёт с уровнем.
            </div>
            <Row label="Стройка"          value={`${SAWMILL_BUILD_TIME}с`} />
            <Row label="+дерева/уровень"  value={`${SAWMILL_WOOD_PER_LEVEL} каждые ${SAWMILL_TICK_INTERVAL}с`} />
            {Array.from({ length: SAWMILL_MAX_LEVEL }, (_, i) => {
              const cost = sawmillCost(i + 1);
              return (
                <Row key={i} label={`Ур. ${i + 1}`} value={<span className="cost-icon">💰{cost.gold} <WoodSVG size={13} />{cost.wood}</span>} />
              );
            })}
          </div>
        )}

        {kind === "town" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TOWN_LEVELS.map(lvl => (
              <div key={lvl.level} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ fontSize: "0.7rem", color: "#f0c040", fontWeight: 700 }}>{lvl.level}. {lvl.name}</div>
                <Row label="HP"                  value={lvl.maxHp} />
                <Row label="Башни: постройка"     value={`T1–T${lvl.maxBuildTier}`} />
                <Row label="Башни: улучшение"     value={`T1–T${lvl.maxUpgradeTier}`} />
                {lvl.upgradeCost && <Row label="Цена перехода" value={<span className="cost-icon">💰{lvl.upgradeCost.gold} <WoodSVG size={13} />{lvl.upgradeCost.wood}</span>} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
