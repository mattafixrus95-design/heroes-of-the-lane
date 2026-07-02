import type { TowerType } from "../data/towers";

interface Props {
  type: TowerType;
  grade: number;
  size?: number;
}

// ── Dwarf ─────────────────────────────────────────────────────────────────────
function DwarfGrade0({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Body – stocky green tunic */}
      <rect x="11" y="22" width="18" height="14" rx="3" fill="#4a7c59"/>
      {/* Belt */}
      <rect x="11" y="28" width="18" height="3" fill="#6B4020"/>
      <rect x="18" y="27" width="4" height="5" fill="#8B6914" rx="1"/>
      {/* Arms */}
      <rect x="5" y="22" width="7" height="10" rx="3" fill="#4a7c59"/>
      <rect x="28" y="22" width="7" height="10" rx="3" fill="#4a7c59"/>
      {/* Head */}
      <circle cx="20" cy="15" r="9" fill="#F5CBA7"/>
      {/* Beard */}
      <path d="M12,18 Q20,28 28,18 L28,22 Q20,32 12,22 Z" fill="#8B6914"/>
      {/* Eyes */}
      <circle cx="16" cy="13" r="1.5" fill="#2C2C2C"/>
      <circle cx="24" cy="13" r="1.5" fill="#2C2C2C"/>
      {/* Eyebrows */}
      <line x1="13" y1="10" x2="18" y2="11" stroke="#6B4020" strokeWidth="1.5"/>
      <line x1="27" y1="10" x2="22" y2="11" stroke="#6B4020" strokeWidth="1.5"/>
      {/* Hat */}
      <rect x="13" y="6" width="14" height="6" rx="2" fill="#6B4020"/>
      <rect x="10" y="10" width="20" height="3" rx="1" fill="#8B5E3C"/>
      {/* Axe */}
      <rect x="29" y="18" width="3" height="16" rx="1" fill="#8B6914"/>
      <path d="M32,18 L38,14 L38,24 Z" fill="#AAA"/>
    </svg>
  );
}

function DwarfGrade1({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Body – silver armour */}
      <rect x="11" y="22" width="18" height="14" rx="3" fill="#78909C"/>
      {/* Armour plates */}
      <rect x="11" y="22" width="18" height="5" rx="2" fill="#B0BEC5"/>
      <rect x="13" y="29" width="6" height="7" rx="1" fill="#90A4AE"/>
      <rect x="21" y="29" width="6" height="7" rx="1" fill="#90A4AE"/>
      {/* Belt buckle */}
      <rect x="17" y="27" width="6" height="4" fill="#FFD700" rx="1"/>
      {/* Arms with pauldrons */}
      <rect x="4" y="22" width="8" height="10" rx="3" fill="#78909C"/>
      <ellipse cx="10" cy="22" rx="5" ry="3" fill="#B0BEC5"/>
      <rect x="28" y="22" width="8" height="10" rx="3" fill="#78909C"/>
      <ellipse cx="30" cy="22" rx="5" ry="3" fill="#B0BEC5"/>
      {/* Head */}
      <circle cx="20" cy="16" r="8" fill="#F5CBA7"/>
      {/* Beard – grey */}
      <path d="M13,19 Q20,29 27,19 L27,23 Q20,33 13,23 Z" fill="#AAA"/>
      {/* Eyes */}
      <circle cx="17" cy="14" r="1.5" fill="#1A237E"/>
      <circle cx="23" cy="14" r="1.5" fill="#1A237E"/>
      {/* Helmet */}
      <path d="M11,15 Q11,5 20,4 Q29,5 29,15 Z" fill="#90A4AE"/>
      <rect x="10" y="14" width="20" height="3" rx="1" fill="#B0BEC5"/>
      {/* Visor slit */}
      <rect x="14" y="14" width="12" height="2" rx="1" fill="#37474F"/>
      {/* Axe */}
      <rect x="30" y="17" width="3" height="17" rx="1" fill="#B0BEC5"/>
      <path d="M33,17 L40,12 L40,23 Z" fill="#E0E0E0"/>
      <line x1="33" y1="17" x2="40" y2="12" stroke="#AAA" strokeWidth="0.5"/>
      {/* Shield hint */}
      <ellipse cx="7" cy="28" rx="4" ry="5" fill="#90A4AE"/>
      <line x1="7" y1="23" x2="7" y2="33" stroke="#B0BEC5" strokeWidth="1"/>
      <line x1="3" y1="28" x2="11" y2="28" stroke="#B0BEC5" strokeWidth="1"/>
    </svg>
  );
}

// ── Elf ───────────────────────────────────────────────────────────────────────
function ElfGrade0({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Robe – forest green */}
      <path d="M14,22 L26,22 L28,36 L12,36 Z" fill="#2d6a4f"/>
      {/* Cloak overlay */}
      <path d="M13,22 L10,36 L15,36 Z" fill="#1b4332"/>
      <path d="M27,22 L30,36 L25,36 Z" fill="#1b4332"/>
      {/* Arms */}
      <rect x="6" y="22" width="6" height="9" rx="3" fill="#2d6a4f"/>
      <rect x="28" y="22" width="6" height="9" rx="3" fill="#2d6a4f"/>
      {/* Neck */}
      <rect x="18" y="18" width="4" height="5" fill="#F5CBA7"/>
      {/* Head */}
      <ellipse cx="20" cy="14" rx="7" ry="8" fill="#F5CBA7"/>
      {/* Pointed ears */}
      <polygon points="13,13 10,8 15,15" fill="#F5CBA7"/>
      <polygon points="27,13 30,8 25,15" fill="#F5CBA7"/>
      {/* Hair */}
      <path d="M13,8 Q20,3 27,8 L27,12 Q20,7 13,12 Z" fill="#8B6914"/>
      {/* Eyes */}
      <ellipse cx="17" cy="13" rx="1.5" ry="2" fill="#1b4332"/>
      <ellipse cx="23" cy="13" rx="1.5" ry="2" fill="#1b4332"/>
      {/* Leaf detail on robe */}
      <ellipse cx="20" cy="27" rx="2" ry="3" fill="#1b4332" opacity="0.5"/>
      {/* Bow */}
      <path d="M33,10 Q38,20 33,30" fill="none" stroke="#8B6914" strokeWidth="2.5"/>
      <line x1="33" y1="10" x2="33" y2="30" stroke="#6B4020" strokeWidth="1"/>
    </svg>
  );
}

function ElfGrade1({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Robe – royal blue/purple */}
      <path d="M14,22 L26,22 L28,36 L12,36 Z" fill="#1565C0"/>
      {/* Gold trim on robe */}
      <line x1="14" y1="22" x2="12" y2="36" stroke="#FFD700" strokeWidth="1.2"/>
      <line x1="26" y1="22" x2="28" y2="36" stroke="#FFD700" strokeWidth="1.2"/>
      <line x1="12" y1="30" x2="28" y2="30" stroke="#FFD700" strokeWidth="1"/>
      {/* Cloak */}
      <path d="M13,22 L9,36 L14,36 Z" fill="#0D47A1"/>
      <path d="M27,22 L31,36 L26,36 Z" fill="#0D47A1"/>
      {/* Arms */}
      <rect x="6" y="22" width="6" height="9" rx="3" fill="#1565C0"/>
      <rect x="28" y="22" width="6" height="9" rx="3" fill="#1565C0"/>
      {/* Gold cuffs */}
      <rect x="6" y="28" width="6" height="2" rx="1" fill="#FFD700"/>
      <rect x="28" y="28" width="6" height="2" rx="1" fill="#FFD700"/>
      {/* Neck */}
      <rect x="18" y="18" width="4" height="5" fill="#F5CBA7"/>
      {/* Head */}
      <ellipse cx="20" cy="14" rx="7" ry="8" fill="#F5CBA7"/>
      {/* Pointed ears with gold rings */}
      <polygon points="13,13 9,7 15,15" fill="#F5CBA7"/>
      <polygon points="27,13 31,7 25,15" fill="#F5CBA7"/>
      <circle cx="10" cy="9" r="1.2" fill="#FFD700"/>
      <circle cx="30" cy="9" r="1.2" fill="#FFD700"/>
      {/* Hair – silver-blonde */}
      <path d="M13,8 Q20,3 27,8 L27,12 Q20,7 13,12 Z" fill="#E0E0E0"/>
      {/* Eyes – deeper blue */}
      <ellipse cx="17" cy="13" rx="1.5" ry="2" fill="#0D47A1"/>
      <ellipse cx="23" cy="13" rx="1.5" ry="2" fill="#0D47A1"/>
      {/* Crown */}
      <path d="M13,9 L13,5 L16,8 L20,4 L24,8 L27,5 L27,9 Z" fill="#FFD700"/>
      <circle cx="20" cy="4" r="1.5" fill="#E53935"/>
      <circle cx="14" cy="6" r="1" fill="#29B6F6"/>
      <circle cx="26" cy="6" r="1" fill="#29B6F6"/>
      {/* Ornate bow */}
      <path d="M33,8 Q39,20 33,32" fill="none" stroke="#8B6914" strokeWidth="2.5"/>
      <line x1="33" y1="8" x2="33" y2="32" stroke="#4a3000" strokeWidth="1"/>
      {/* Gold bow tips */}
      <circle cx="33" cy="8" r="2" fill="#FFD700"/>
      <circle cx="33" cy="32" r="2" fill="#FFD700"/>
    </svg>
  );
}

// ── Centaur ───────────────────────────────────────────────────────────────────
function CentaurGrade0({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Horse body */}
      <ellipse cx="21" cy="28" rx="14" ry="7" fill="#8B6914"/>
      <rect x="4" y="24" width="4" height="12" rx="1.5" fill="#6B4020"/>
      <rect x="32" y="24" width="4" height="12" rx="1.5" fill="#6B4020"/>
      {/* Tail */}
      <path d="M35,26 Q40,30 37,36" fill="none" stroke="#4a3000" strokeWidth="2.5"/>
      {/* Human torso */}
      <rect x="13" y="12" width="12" height="14" rx="3" fill="#4a7c59"/>
      {/* Head */}
      <circle cx="19" cy="9" r="6" fill="#F5CBA7"/>
      <circle cx="17" cy="8" r="1.2" fill="#2C2C2C"/>
      <circle cx="21" cy="8" r="1.2" fill="#2C2C2C"/>
      <path d="M14,6 Q19,2 24,6 L24,8 Q19,5 14,8 Z" fill="#6B4020"/>
      {/* Bow */}
      <path d="M27,8 Q32,17 27,26" fill="none" stroke="#8B6914" strokeWidth="2"/>
      <line x1="27" y1="8" x2="27" y2="26" stroke="#6B4020" strokeWidth="1"/>
    </svg>
  );
}

function CentaurGrade1({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      {/* Horse body – dark armoured */}
      <ellipse cx="21" cy="28" rx="14" ry="7" fill="#5D4037"/>
      <rect x="4" y="24" width="4" height="12" rx="1.5" fill="#3E2723"/>
      <rect x="32" y="24" width="4" height="12" rx="1.5" fill="#3E2723"/>
      <path d="M35,26 Q40,30 37,36" fill="none" stroke="#2C1810" strokeWidth="2.5"/>
      {/* Barding */}
      <ellipse cx="21" cy="26" rx="12" ry="4" fill="#8D6E63" opacity="0.6"/>
      {/* Human torso – armoured */}
      <rect x="13" y="12" width="12" height="14" rx="3" fill="#B71C1C"/>
      <rect x="13" y="12" width="12" height="5" rx="2" fill="#D32F2F"/>
      {/* Head with helmet */}
      <circle cx="19" cy="9" r="6" fill="#F5CBA7"/>
      <path d="M13,9 Q13,2 19,1 Q25,2 25,9 Z" fill="#B0BEC5"/>
      <rect x="15" y="8" width="8" height="2" rx="1" fill="#78909C"/>
      <circle cx="17" cy="8" r="1.2" fill="#1A237E"/>
      <circle cx="21" cy="8" r="1.2" fill="#1A237E"/>
      {/* Ornate bow */}
      <path d="M27,7 Q33,17 27,27" fill="none" stroke="#FFD700" strokeWidth="2"/>
      <line x1="27" y1="7" x2="27" y2="27" stroke="#8B6914" strokeWidth="1"/>
      <circle cx="27" cy="7" r="1.5" fill="#FFD700"/>
      <circle cx="27" cy="27" r="1.5" fill="#FFD700"/>
    </svg>
  );
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

// ── Export ────────────────────────────────────────────────────────────────────
export default function TowerIcon({ type, grade, size = 36 }: Props) {
  const s = size;
  if (type === "centaur")  return grade === 0 ? <CentaurGrade0  s={s} /> : <CentaurGrade1  s={s} />;
  if (type === "dwarf")    return grade === 0 ? <DwarfGrade0    s={s} /> : <DwarfGrade1    s={s} />;
  if (type === "elf")      return grade === 0 ? <ElfGrade0      s={s} /> : <ElfGrade1      s={s} />;
  if (type === "pegasus")  return grade === 0 ? <PegasusGrade0  s={s} /> : <PegasusGrade1  s={s} />;
  if (type === "dendroid") return grade === 0 ? <DendroidGrade0 s={s} /> : <DendroidGrade1 s={s} />;
  if (type === "unicorn")  return grade === 0 ? <UnicornGrade0  s={s} /> : <UnicornGrade1  s={s} />;
  return grade === 0 ? <DragonGrade0 s={s} /> : <DragonGrade1 s={s} />;
}
