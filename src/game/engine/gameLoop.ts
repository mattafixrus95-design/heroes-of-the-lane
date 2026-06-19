import type { GameState } from "./gameState";
import { tickSystems } from "../systems";

export type StateUpdater = (updater: (s: GameState) => GameState) => void;

export class GameLoop {
  private rafId: number | null = null;
  private lastTime = 0;
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
    const dt = Math.min((now - this.lastTime) / 1000, 0.1); // cap at 100 ms
    this.lastTime = now;
    this.updateState(state => {
      if (state.isPaused || state.phase !== "wave") return state;
      return tickSystems(state, dt);
    });
    this.rafId = requestAnimationFrame(this.loop);
  };
}
