import sawmill from "./sawmill.png";

const ASPECT = 215 / 240;

export default function SawmillImage({ size = 52 }: { size?: number }) {
  return (
    <img
      src={sawmill}
      alt=""
      style={{ width: size, height: size * ASPECT, objectFit: "contain", display: "block" }}
    />
  );
}
