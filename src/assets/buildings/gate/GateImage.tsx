import { useEffect, useRef, useState } from "react";
import closed from "./gate-closed.png";
import opening1 from "./gate-opening-1.png";
import opening2 from "./gate-opening-2.png";
import opened from "./gate-opened.png";

const FRAMES = [closed, opening1, opening2, opened];
const OPEN_DURATION_MS = 1000;  // открытие целиком
const CLOSE_DELAY_MS = 1000;    // пауза перед началом закрытия (крипы успевают выйти)
const CLOSE_DURATION_MS = 1000; // закрытие целиком

interface Props {
  size?: number;
  open?: boolean;
}

// Растровые ворота на 4 кадра (закрыты → приоткрыты → приоткрыты сильнее →
// открыты). При open=true сразу листаем кадры вперёд за OPEN_DURATION_MS.
// При open=false — сначала ждём CLOSE_DELAY_MS (чтобы крипы успели выйти из
// уже открытых ворот), потом листаем кадры назад за CLOSE_DURATION_MS.
export default function GateImage({ size = 52, open = false }: Props) {
  const [frameIdx, setFrameIdx] = useState(open ? FRAMES.length - 1 : 0);
  const frameIdxRef = useRef(frameIdx);

  useEffect(() => {
    frameIdxRef.current = frameIdx;
  }, [frameIdx]);

  useEffect(() => {
    const target = open ? FRAMES.length - 1 : 0;
    if (frameIdxRef.current === target) return;

    const timers: number[] = [];
    const dir = open ? 1 : -1;
    const totalMs = open ? OPEN_DURATION_MS : CLOSE_DURATION_MS;
    const startDelay = open ? 0 : CLOSE_DELAY_MS;
    const stepsNeeded = Math.abs(target - frameIdxRef.current);
    const stepMs = totalMs / stepsNeeded;
    for (let i = 1; i <= stepsNeeded; i++) {
      timers.push(window.setTimeout(() => {
        setFrameIdx(frameIdxRef.current + dir);
      }, startDelay + i * stepMs));
    }

    return () => timers.forEach(clearTimeout);
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
