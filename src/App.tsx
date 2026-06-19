import { useState, useEffect, useCallback, useRef } from "react";
import { createInitialState } from "./game/engine/gameState";
import type { GameState } from "./game/engine/gameState";
import { GameLoop } from "./game/engine/gameLoop";
import HUD from "./ui/HUD";
import GameGrid from "./ui/GameGrid";
import "./index.css";

export default function App() {
  const [state, setState] = useState<GameState>(createInitialState);

  const updateState = useCallback(
    (updater: (s: GameState) => GameState) => setState(updater),
    []
  );

  const loopRef = useRef<GameLoop | null>(null);
  useEffect(() => {
    loopRef.current = new GameLoop(updateState);
    loopRef.current.start();
    return () => loopRef.current?.stop();
  }, [updateState]);

  return (
    <div className="app">
      <h1 className="title">Tower Lane Chess</h1>
      <HUD state={state} onUpdateState={updateState} />
      <GameGrid state={state} onUpdateState={updateState} />
      {state.phase === "defeat" && (
        <div className="overlay">
          <h2>💀 Поражение</h2>
          <p>Волна {state.wave}</p>
          <button onClick={() => setState(createInitialState())}>Заново</button>
        </div>
      )}
    </div>
  );
}
