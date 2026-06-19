import { useState, useEffect, useCallback, useRef } from "react";
import { createInitialState } from "./game/engine/gameState";
import type { GameState } from "./game/engine/gameState";
import { GameLoop } from "./game/engine/gameLoop";
import type { TowerType } from "./data/towers";
import HUD from "./ui/HUD";
import TowerShop from "./ui/TowerShop";
import GameGrid from "./ui/GameGrid";
import TowerMenu from "./ui/TowerMenu";
import "./index.css";

export default function App() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [selectedTower, setSelectedTower] = useState<TowerType | null>(null);
  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);

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

  function handleReset() {
    setState(createInitialState());
    setSelectedTower(null);
    setSelectedTowerId(null);
  }

  const menuTower = selectedTowerId
    ? state.towers.find(t => t.id === selectedTowerId) ?? null
    : null;

  return (
    <div className="app">
      <h1 className="title">Heroes of the Lane</h1>
      <HUD state={state} onUpdateState={updateState} onReset={handleReset} />
      <TowerShop
        gold={state.gold}
        selected={selectedTower}
        waveActive={state.phase === "wave"}
        onSelect={setSelectedTower}
      />
      <GameGrid
        state={state}
        selectedTower={selectedTower}
        onUpdateState={updateState}
        onClearSelection={() => setSelectedTower(null)}
        onSelectTowerId={setSelectedTowerId}
      />
      {menuTower && (
        <TowerMenu
          tower={menuTower}
          gold={state.gold}
          onUpdateState={updateState}
          onClose={() => setSelectedTowerId(null)}
        />
      )}
      {state.phase === "defeat" && (
        <div className="overlay">
          <h2>💀 Поражение</h2>
          <p>Волна {state.wave}</p>
          <button onClick={handleReset}>Заново</button>
        </div>
      )}
    </div>
  );
}
