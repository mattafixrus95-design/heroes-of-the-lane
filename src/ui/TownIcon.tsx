import VillageSVG from "../assets/VillageSVG";
import FortSVG from "../assets/FortSVG";
import CitadelSVG from "../assets/CitadelSVG";
import CastleSVG from "../assets/CastleSVG";

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
