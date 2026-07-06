import type { HeroType } from "../data/heroes";
import IvorSVG from "../assets/heroes/ivor/IvorSVG";

interface Props {
  type: HeroType;
  size?: number;
}

export default function HeroIcon({ type, size = 36 }: Props) {
  void type; // пока единственный герой; при добавлении новых — switch по type
  return <IvorSVG size={size} />;
}
