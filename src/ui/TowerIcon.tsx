import type { TowerType } from "../data/towers";
import type { TowerAttackPhase } from "../game/systems/towerAttack";
import { TOWER_ART } from "../assets/towers/towerArt";

interface Props {
  type: TowerType;
  grade: number;
  size?: number;
  phase?: TowerAttackPhase;
  gameTime?: number;
}

// ── Pegasus ───────────────────────────────────────────────────────────────────
function PegasusGrade0({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="20" cy="24" rx="12" ry="8" fill="#FAFAFA"/>
      {/* Legs */}
      <rect x="12" y="28" width="3" height="8" rx="1.5" fill="#E0E0E0"/>
      <rect x="25" y="28" width="3" height="8" rx="1.5" fill="#E0E0E0"/>
      {/* Wings */}
      <path d="M14,20 Q4,10 8,4 Q16,8 18,18" fill="#FFFFFF" opacity="0.95"/>
      <path d="M26,20 Q36,10 32,4 Q24,8 22,18" fill="#FFFFFF" opacity="0.95"/>
      <path d="M14,20 Q8,14 10,8" fill="none" stroke="#CFCFCF" strokeWidth="1"/>
      <path d="M26,20 Q32,14 30,8" fill="none" stroke="#CFCFCF" strokeWidth="1"/>
      {/* Neck & head */}
      <path d="M13,18 Q11,10 16,7" fill="none" stroke="#FAFAFA" strokeWidth="6" strokeLinecap="round"/>
      <ellipse cx="16" cy="6" rx="4" ry="3" fill="#FAFAFA"/>
      {/* Mane */}
      <path d="M13,10 Q10,8 12,4" fill="none" stroke="#8B6914" strokeWidth="1.5"/>
      {/* Tail */}
      <path d="M30,26 Q37,28 35,34" fill="none" stroke="#E0E0E0" strokeWidth="2.5"/>
      {/* Eye */}
      <circle cx="17" cy="6" r="0.8" fill="#2C2C2C"/>
    </svg>
  );
}

function PegasusGrade1({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Body – silver */}
      <ellipse cx="20" cy="24" rx="12" ry="8" fill="#CFD8DC"/>
      {/* Legs */}
      <rect x="12" y="28" width="3" height="8" rx="1.5" fill="#90A4AE"/>
      <rect x="25" y="28" width="3" height="8" rx="1.5" fill="#90A4AE"/>
      {/* Wings – larger, silver-gold */}
      <path d="M14,20 Q2,8 7,2 Q17,7 18,18" fill="#ECEFF1"/>
      <path d="M26,20 Q38,8 33,2 Q23,7 22,18" fill="#ECEFF1"/>
      <path d="M14,20 Q7,12 10,5" fill="none" stroke="#FFD700" strokeWidth="1"/>
      <path d="M26,20 Q33,12 30,5" fill="none" stroke="#FFD700" strokeWidth="1"/>
      {/* Neck & head */}
      <path d="M13,18 Q11,10 16,7" fill="none" stroke="#CFD8DC" strokeWidth="6" strokeLinecap="round"/>
      <ellipse cx="16" cy="6" rx="4" ry="3" fill="#CFD8DC"/>
      {/* Golden mane */}
      <path d="M13,10 Q9,8 12,3" fill="none" stroke="#FFD700" strokeWidth="1.8"/>
      {/* Tail */}
      <path d="M30,26 Q38,28 36,34" fill="none" stroke="#FFD700" strokeWidth="2.5"/>
      {/* Horn-like crest */}
      <path d="M16,3 L15,-1 L18,2" fill="#FFD700"/>
      {/* Eye */}
      <circle cx="17" cy="6" r="0.8" fill="#1A237E"/>
    </svg>
  );
}

// ── Dendroid ──────────────────────────────────────────────────────────────────
function DendroidGrade0({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Trunk body */}
      <rect x="13" y="16" width="14" height="18" rx="4" fill="#6D4C41"/>
      {/* Bark texture */}
      <path d="M16,18 L16,32 M20,16 L20,34 M24,18 L24,32" stroke="#4E342E" strokeWidth="1"/>
      {/* Arms – branches */}
      <path d="M13,20 Q4,16 3,10" fill="none" stroke="#6D4C41" strokeWidth="4" strokeLinecap="round"/>
      <path d="M27,20 Q36,16 37,10" fill="none" stroke="#6D4C41" strokeWidth="4" strokeLinecap="round"/>
      {/* Legs – roots */}
      <path d="M16,34 Q13,38 9,38" fill="none" stroke="#4E342E" strokeWidth="4" strokeLinecap="round"/>
      <path d="M24,34 Q27,38 31,38" fill="none" stroke="#4E342E" strokeWidth="4" strokeLinecap="round"/>
      {/* Foliage head */}
      <circle cx="20" cy="11" r="9" fill="#558B2F"/>
      <circle cx="14" cy="8" r="5" fill="#689F38"/>
      <circle cx="26" cy="8" r="5" fill="#689F38"/>
      {/* Eyes */}
      <circle cx="16" cy="13" r="1.3" fill="#FFEB3B"/>
      <circle cx="24" cy="13" r="1.3" fill="#FFEB3B"/>
    </svg>
  );
}

function DendroidGrade1({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Trunk body – armoured bark */}
      <rect x="12" y="16" width="16" height="18" rx="4" fill="#4E342E"/>
      {/* Bark plates */}
      <rect x="12" y="16" width="16" height="6" rx="2" fill="#3E2723"/>
      <path d="M16,23 L16,32 M20,22 L20,34 M24,23 L24,32" stroke="#2C1810" strokeWidth="1"/>
      {/* Thorny arms */}
      <path d="M12,20 Q2,15 1,8" fill="none" stroke="#4E342E" strokeWidth="5" strokeLinecap="round"/>
      <path d="M28,20 Q38,15 39,8" fill="none" stroke="#4E342E" strokeWidth="5" strokeLinecap="round"/>
      <path d="M2,10 L-1,6 M3,13 L0,10" stroke="#2C1810" strokeWidth="1"/>
      {/* Roots */}
      <path d="M15,34 Q11,39 6,39" fill="none" stroke="#2C1810" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M25,34 Q29,39 34,39" fill="none" stroke="#2C1810" strokeWidth="4.5" strokeLinecap="round"/>
      {/* Foliage head – darker, battle-worn */}
      <circle cx="20" cy="10" r="9" fill="#33691E"/>
      <circle cx="13" cy="7" r="5" fill="#558B2F"/>
      <circle cx="27" cy="7" r="5" fill="#558B2F"/>
      {/* Glowing eyes */}
      <circle cx="16" cy="12" r="1.5" fill="#FF6F00"/>
      <circle cx="24" cy="12" r="1.5" fill="#FF6F00"/>
    </svg>
  );
}

// ── Unicorn ───────────────────────────────────────────────────────────────────
function UnicornGrade0({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="20" cy="25" rx="12" ry="8" fill="#FFFFFF"/>
      {/* Legs */}
      <rect x="12" y="29" width="3" height="8" rx="1.5" fill="#F0F0F0"/>
      <rect x="25" y="29" width="3" height="8" rx="1.5" fill="#F0F0F0"/>
      {/* Neck & head */}
      <path d="M13,19 Q11,10 17,6" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round"/>
      <ellipse cx="17" cy="5" rx="4.5" ry="3.5" fill="#FFFFFF"/>
      {/* Horn */}
      <path d="M17,1 L15,-4 L19,0 Z" fill="#FFECB3" stroke="#FFD700" strokeWidth="0.5"/>
      {/* Rainbow mane */}
      <path d="M13,10 Q9,8 11,3" fill="none" stroke="#BA68C8" strokeWidth="1.5"/>
      <path d="M12,13 Q8,12 9,7" fill="none" stroke="#4FC3F7" strokeWidth="1.5"/>
      {/* Tail */}
      <path d="M30,27 Q38,29 36,35" fill="none" stroke="#BA68C8" strokeWidth="2.5"/>
      {/* Eye */}
      <circle cx="18" cy="5" r="0.8" fill="#2C2C2C"/>
    </svg>
  );
}

function UnicornGrade1({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Body – armoured white */}
      <ellipse cx="20" cy="25" rx="12" ry="8" fill="#FFFFFF"/>
      <ellipse cx="20" cy="24" rx="10" ry="5" fill="#FFD700" opacity="0.25"/>
      {/* Legs */}
      <rect x="12" y="29" width="3" height="8" rx="1.5" fill="#F0F0F0"/>
      <rect x="25" y="29" width="3" height="8" rx="1.5" fill="#F0F0F0"/>
      {/* Neck & head */}
      <path d="M13,19 Q11,10 17,6" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round"/>
      <ellipse cx="17" cy="5" rx="4.5" ry="3.5" fill="#FFFFFF"/>
      {/* Golden horn */}
      <path d="M17,1 L14,-5 L19,-1 Z" fill="#FFD700"/>
      {/* Battle armour on head */}
      <path d="M13,5 Q13,1 17,0 Q21,1 21,5" fill="none" stroke="#FFD700" strokeWidth="1"/>
      {/* Rainbow mane – vivid */}
      <path d="M13,10 Q8,8 10,2" fill="none" stroke="#AB47BC" strokeWidth="1.8"/>
      <path d="M12,13 Q7,11 8,6" fill="none" stroke="#29B6F6" strokeWidth="1.8"/>
      <path d="M12,16 Q7,15 7,10" fill="none" stroke="#FFCA28" strokeWidth="1.8"/>
      {/* Tail */}
      <path d="M30,27 Q40,29 38,36" fill="none" stroke="#AB47BC" strokeWidth="2.8"/>
      {/* Eye */}
      <circle cx="18" cy="5" r="0.8" fill="#1A237E"/>
    </svg>
  );
}

// ── Dragon ────────────────────────────────────────────────────────────────────
function DragonGrade0({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="20" cy="26" rx="11" ry="9" fill="#388E3C"/>
      {/* Tail */}
      <path d="M28,28 Q36,32 38,26 Q36,22 32,24" fill="#2E7D32"/>
      {/* Left wing */}
      <path d="M10,22 Q2,10 8,6 Q12,12 14,18" fill="#43A047" opacity="0.9"/>
      <path d="M10,22 Q6,14 10,8" fill="none" stroke="#2E7D32" strokeWidth="1"/>
      {/* Right wing */}
      <path d="M30,22 Q38,10 32,6 Q28,12 26,18" fill="#43A047" opacity="0.9"/>
      <path d="M30,22 Q34,14 30,8" fill="none" stroke="#2E7D32" strokeWidth="1"/>
      {/* Neck */}
      <path d="M16,20 Q18,14 20,12 Q22,14 24,20" fill="#388E3C"/>
      {/* Head */}
      <ellipse cx="20" cy="12" rx="7" ry="6" fill="#43A047"/>
      {/* Snout */}
      <ellipse cx="20" cy="15" rx="4" ry="3" fill="#388E3C"/>
      {/* Nostrils */}
      <circle cx="18" cy="16" r="0.8" fill="#1B5E20"/>
      <circle cx="22" cy="16" r="0.8" fill="#1B5E20"/>
      {/* Eyes – slit pupils */}
      <ellipse cx="16" cy="11" rx="2" ry="2.5" fill="#FFC107"/>
      <ellipse cx="24" cy="11" rx="2" ry="2.5" fill="#FFC107"/>
      <ellipse cx="16" cy="11" rx="0.6" ry="2" fill="#1B5E20"/>
      <ellipse cx="24" cy="11" rx="0.6" ry="2" fill="#1B5E20"/>
      {/* Horns */}
      <path d="M15,8 L12,2 L16,6" fill="#2E7D32"/>
      <path d="M25,8 L28,2 L24,6" fill="#2E7D32"/>
      {/* Belly scales */}
      <ellipse cx="20" cy="28" rx="7" ry="5" fill="#81C784" opacity="0.6"/>
      {/* Scale texture */}
      <path d="M13,24 Q16,21 19,24 Q22,21 25,24 Q22,27 19,24 Q16,27 13,24" fill="#2E7D32" opacity="0.4"/>
    </svg>
  );
}

function DragonGrade1({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="20" cy="26" rx="11" ry="9" fill="#F57F17"/>
      {/* Gold sheen on body */}
      <ellipse cx="18" cy="24" rx="6" ry="5" fill="#FFD700" opacity="0.4"/>
      {/* Tail */}
      <path d="M28,28 Q36,32 38,26 Q36,22 32,24" fill="#E65100"/>
      {/* Left wing – larger, golden */}
      <path d="M10,22 Q0,8 7,3 Q13,10 14,18" fill="#FFD700" opacity="0.85"/>
      <path d="M10,22 Q4,12 9,5" fill="none" stroke="#E65100" strokeWidth="1"/>
      <path d="M12,20 Q8,14 11,8" fill="none" stroke="#FF8F00" strokeWidth="0.8" opacity="0.6"/>
      {/* Right wing – larger, golden */}
      <path d="M30,22 Q40,8 33,3 Q27,10 26,18" fill="#FFD700" opacity="0.85"/>
      <path d="M30,22 Q36,12 31,5" fill="none" stroke="#E65100" strokeWidth="1"/>
      <path d="M28,20 Q32,14 29,8" fill="none" stroke="#FF8F00" strokeWidth="0.8" opacity="0.6"/>
      {/* Neck */}
      <path d="M16,20 Q18,14 20,12 Q22,14 24,20" fill="#F57F17"/>
      {/* Head */}
      <ellipse cx="20" cy="12" rx="7" ry="6" fill="#FFA000"/>
      {/* Snout */}
      <ellipse cx="20" cy="15" rx="4" ry="3" fill="#F57F17"/>
      {/* Nostrils with flame glow */}
      <circle cx="18" cy="16" r="1" fill="#FF3D00"/>
      <circle cx="22" cy="16" r="1" fill="#FF3D00"/>
      {/* Eyes – golden slit */}
      <ellipse cx="16" cy="11" rx="2" ry="2.5" fill="#FF6F00"/>
      <ellipse cx="24" cy="11" rx="2" ry="2.5" fill="#FF6F00"/>
      <ellipse cx="16" cy="11" rx="0.6" ry="2" fill="#1A1A00"/>
      <ellipse cx="24" cy="11" rx="0.6" ry="2" fill="#1A1A00"/>
      {/* Crown-like horns */}
      <path d="M15,8 L11,1 L16,6" fill="#FFD700"/>
      <path d="M25,8 L29,1 L24,6" fill="#FFD700"/>
      <path d="M18,7 L17,3 L20,6" fill="#FFD700"/>
      <path d="M22,7 L23,3 L20,6" fill="#FFD700"/>
      {/* Belly – lighter gold */}
      <ellipse cx="20" cy="28" rx="7" ry="5" fill="#FFE082" opacity="0.7"/>
      {/* Scale texture */}
      <path d="M13,24 Q16,21 19,24 Q22,21 25,24 Q22,27 19,24 Q16,27 13,24" fill="#E65100" opacity="0.4"/>
      {/* Gem on chest */}
      <circle cx="20" cy="27" r="2" fill="#E53935"/>
      <circle cx="20" cy="26.5" r="0.8" fill="#FF8A80" opacity="0.7"/>
    </svg>
  );
}

// ── Растровый арт (гном/эльф) ───────────────────────────────────────────────────
// Кадры атаки листаются по gameTime, пока у башни есть цель (phase==="attack"),
// иначе показывается статичный idle-кадр — тот же паттерн, что у HeroIcon,
// только с непрерывным циклом кадров вместо дискретных поз.
function RasterTowerIcon({ type, grade, size, phase, gameTime }: Props & { size: number }) {
  const art = TOWER_ART[type]!.grades[grade as 0 | 1];
  const attacking = phase === "attack" && art.attackFrames.length > 0;
  const frame = attacking
    ? art.attackFrames[Math.floor((gameTime ?? 0) * art.attackFps) % art.attackFrames.length]
    : art.idle;
  const w = size * (art.sizeMult ?? 1);
  return (
    <img
      src={frame.src}
      alt=""
      style={{ width: w, height: w * art.aspect, objectFit: "contain", display: "block" }}
    />
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function TowerIcon(props: Props) {
  const { type, grade, size = 36 } = props;
  if (TOWER_ART[type]) return <RasterTowerIcon {...props} size={size} />;
  const s = size;
  if (type === "pegasus")  return grade === 0 ? <PegasusGrade0  s={s} /> : <PegasusGrade1  s={s} />;
  if (type === "dendroid") return grade === 0 ? <DendroidGrade0 s={s} /> : <DendroidGrade1 s={s} />;
  if (type === "unicorn")  return grade === 0 ? <UnicornGrade0  s={s} /> : <UnicornGrade1  s={s} />;
  return grade === 0 ? <DragonGrade0 s={s} /> : <DragonGrade1 s={s} />;
}
