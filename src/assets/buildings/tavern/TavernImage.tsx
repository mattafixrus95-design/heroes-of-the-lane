import tavern from "./tavern.png";

const ASPECT = 223 / 240;

export default function TavernImage({ size = 52 }: { size?: number }) {
  return (
    <img
      src={tavern}
      alt=""
      style={{ width: size, height: size * ASPECT, objectFit: "contain", display: "block" }}
    />
  );
}
