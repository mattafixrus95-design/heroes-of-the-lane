import farm from "./farm.png";

const ASPECT = 190 / 240;

export default function FarmImage({ size = 52 }: { size?: number }) {
  return (
    <img
      src={farm}
      alt=""
      style={{ width: size, height: size * ASPECT, objectFit: "contain", display: "block" }}
    />
  );
}
