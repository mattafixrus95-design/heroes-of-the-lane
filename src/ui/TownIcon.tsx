import VillageSVG from "../assets/buildings/town/VillageSVG";
import FortSVG from "../assets/buildings/town/FortSVG";
import CitadelSVG from "../assets/buildings/town/CitadelSVG";
import CastleSVG from "../assets/buildings/town/CastleSVG";

interface Props {
  level: 1 | 2 | 3 | 4;
  size?: number;
}

export default function TownIcon({ level, size = 52 }: Props) {
  if (level === 1) return <VillageSVG size={size} />;
  if (level === 2) return <FortSVG size={size} />;
  if (level === 3) return <CitadelSVG size={size} />;
  return <CastleSVG size={size} />;
}
