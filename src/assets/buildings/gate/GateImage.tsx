import { useEffect, useRef, useState } from "react";
import closed from "./gate-closed.png";
import opening1 from "./gate-opening-1.png";
import opening2 from "./gate-opening-2.png";
import opened from "./gate-opened.png";

const FRAMES = [closed, opening1, opening2, opened];
const FRAME_MS = 110;

interface Props {
  size?: number;
  open?: boolean;
}

// Растровые ворота на 4 кадра (закрыты → приоткрыты → приоткрыты сильнее →
// открыты). Переключение open листает кадры вперёд/назад вместо мгновенной
// смены — та же роль, что раньше играл CSS-transition в GateSVG.
export default function GateImage({ size = 52, open = false }: Props) {
  const [frameIdx, setFrameIdx] = useState(open ? FRAMES.length - 1 : 0);
  const frameIdxRef = useRef(frameIdx);

  useEffect(() => {
    frameIdxRef.current = frameIdx;
  }, [frameIdx]);

  useEffect(() => {
    const target = open ? FRAMES.length - 1 : 0;
    const dir = open ? 1 : -1;
    if (frameIdxRef.current === target) return;
    const timer = setInterval(() => {
      const next = frameIdxRef.current + dir;
      setFrameIdx(next);
      if (next === target) clearInterval(timer);
    }, FRAME_MS);
    return () => clearInterval(timer);
  }, [open]);

  const aspect = 480 / 463;
  return (
    <img
      src={FRAMES[frameIdx]}
      alt=""
      style={{ width: size, height: size * aspect, objectFit: "contain", display: "block" }}
    />
  );
}
