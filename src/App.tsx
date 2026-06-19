import { useState, useEffect, useCallback, useRef } from "react";
import { createInitialState } from "./game/engine/gameState";
import type { GameState } from "./game/engine/gameState";
import { GameLoop } from "./game/engine/gameLoop";
import type { TowerType } from "./data/towers";
import HUD from "./ui/HUD";
import TowerShop from "./ui/TowerShop";
import GameGrid from "./ui/GameGrid";
import "./index.css";

export default function App() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [selectedTower, setSelectedTower] = useState<TowerType | null>(null);

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

  function handleRestart() {
    setState(createInitialState());
    setSelectedTower(null);
  }

  return (
    <div className="app">
      <h1 className="title">Heroes of the Lane</h1>
      <HUD state={state} onUpdateState={updateState} />
      <TowerShop gold={state.gold} selected={selectedTower} onSelect={setSelectedTower} />
      <GameGrid
        state={state}
        selectedTower={selectedTower}
        onUpdateState={updateState}
        onClearSelection={() => setSelectedTower(null)}
      />
      {state.phase === "defeat" && (
        <div className="overlay">
          <h2>💀 Поражение</h2>
          <p>Волна {state.wave}</p>
          <button onClick={handleRestart}>Заново</button>
        </div>
      )}
    </div>
  );
}
