import TownImage from "../assets/buildings/town/TownImage";

interface Props {
  level: 1 | 2 | 3 | 4;
  size?: number;
}

export default function TownIcon({ level, size = 52 }: Props) {
  return <TownImage level={level} size={size} />;
}
