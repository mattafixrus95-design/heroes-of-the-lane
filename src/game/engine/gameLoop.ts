import type { GameState } from "./gameState";
import { tickSystems, tickPrepSystems, tickIdleSystems } from "../systems";

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
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.updateState(state => {
      if (state.isPaused) return state;
      if (state.phase === "wave") return tickSystems(state, dt);
      if (state.phase === "prep") return tickPrepSystems(state, dt);
      if (state.phase === "idle" || state.phase === "victory") return tickIdleSystems(state, dt);
      return state; // defeat — заморожено
    });
    this.rafId = requestAnimationFrame(this.loop);
  };
}
