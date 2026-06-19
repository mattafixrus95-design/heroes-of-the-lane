import { useState, useEffect, useCallback, useRef } from "react";
import { createInitialState } from "./game/engine/gameState";
import type { GameState } from "./game/engine/gameState";
import { GameLoop } from "./game/engine/gameLoop";
import HUD from "./ui/HUD";
import TowerShop from "./ui/TowerShop";
import type { ShopItem } from "./ui/TowerShop";
import GameGrid from "./ui/GameGrid";
import TowerMenu from "./ui/TowerMenu";
import FarmMenu from "./ui/FarmMenu";
import FarmPanel from "./ui/FarmPanel";
import StatsOverlay from "./ui/StatsOverlay";
import "./index.css";

export default function App() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

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
    setSelectedItem(null);
    setSelectedTowerId(null);
    setSelectedFarmId(null);
  }

  function handleSelectTowerId(id: string) {
    setSelectedTowerId(id);
    setSelectedFarmId(null);
    setSelectedItem(null);
  }

  function handleSelectFarmId(id: string) {
    setSelectedFarmId(id);
    setSelectedTowerId(null);
    setSelectedItem(null);
  }

  const menuTower = selectedTowerId
    ? state.towers.find(t => t.id === selectedTowerId) ?? null
    : null;

  const menuFarm = selectedFarmId
    ? state.farms.find(f => f.id === selectedFarmId) ?? null
    : null;

  const showStats = state.phase === "defeat" || state.phase === "victory";

  return (
    <div className="app">
      <h1 className="title">Heroes of the Lane</h1>
      <HUD state={state} onUpdateState={updateState} onReset={handleReset} />
      <GameGrid
        state={state}
        selectedItem={selectedItem}
        onUpdateState={updateState}
        onClearSelection={() => setSelectedItem(null)}
        onSelectTowerId={handleSelectTowerId}
      />
      <TowerShop
        gold={state.gold}
        food={state.food}
        selected={selectedItem}
        waveActive={state.phase === "wave"}
        onSelect={setSelectedItem}
      />
      <FarmPanel farms={state.farms} onSelectFarmId={handleSelectFarmId} />
      {menuTower && !showStats && (
        <TowerMenu
          tower={menuTower}
          gold={state.gold}
          food={state.food}
          waveActive={state.phase === "wave"}
          onUpdateState={updateState}
          onClose={() => setSelectedTowerId(null)}
        />
      )}
      {menuFarm && !showStats && (
        <FarmMenu
          farm={menuFarm}
          gold={state.gold}
          food={state.food}
          waveActive={state.phase === "wave"}
          onUpdateState={updateState}
          onClose={() => setSelectedFarmId(null)}
        />
      )}
      {showStats && (
        <StatsOverlay state={state} onReset={handleReset} />
      )}
    </div>
  );
}
