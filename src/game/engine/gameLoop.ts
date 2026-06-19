import type { GameState } from "./gameState";
import { tickSystems } from "../systems";

export type StateUpdater = (updater: (s: GameState) => GameState) => void;

const TARGET_FPS = 60;
const FRAME_MS = 1000 / TARGET_FPS;

export class GameLoop {
  private rafId: number | null = null;
  private lastTime = 0;
  private accumulator = 0;
  private updateState: StateUpdater;

  constructor(updateState: StateUpdater) {
    this.updateState = updateState;
  }

  start() {
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  private loop = (now: number) => {
    const delta = now - this.lastTime;
    this.lastTime = now;
    this.accumulator += delta;

    // Fixed-step ticks — catch up if we fell behind, cap at 3 ticks
    let steps = 0;
    while (this.accumulator >= FRAME_MS && steps < 3) {
      this.updateState(state => tickSystems(state, FRAME_MS / 1000));
      this.accumulator -= FRAME_MS;
      steps++;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };
}
