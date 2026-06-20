import { useState, useEffect, useCallback, useRef } from "react";
import { createInitialState } from "./game/engine/gameState";
import type { GameState } from "./game/engine/gameState";
import versionData from "./version.json";
import { GameLoop } from "./game/engine/gameLoop";
import HUD from "./ui/HUD";
import TowerShop from "./ui/TowerShop";
import type { ShopItem } from "./ui/TowerShop";
import GameGrid from "./ui/GameGrid";
import TowerMenu from "./ui/TowerMenu";
import FarmPanel from "./ui/FarmPanel";
import StatsOverlay from "./ui/StatsOverlay";
import StatsPanel from "./ui/StatsPanel";
import "./index.css";

export default function App() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);
  const [showStatsPanel, setShowStatsPanel] = useState(false);

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
  }

  function handleSelectTowerId(id: string) {
    setSelectedTowerId(id);
    setSelectedItem(null);
  }

  const menuTower = selectedTowerId
    ? state.towers.find(t => t.id === selectedTowerId) ?? null
    : null;

  const showStats = state.phase === "defeat" || state.phase === "victory";

  return (
    <div className="app">
      <h1 className="title">Heroes of the Lane</h1>
      <HUD state={state} onUpdateState={updateState} onReset={handleReset} onShowStats={() => setShowStatsPanel(true)} />
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
      <FarmPanel
        farms={state.farms}
        gold={state.gold}
        onUpdateState={updateState}
      />
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
      {showStats && (
        <StatsOverlay state={state} onReset={handleReset} />
      )}
      {showStatsPanel && !showStats && (
        <StatsPanel state={state} onClose={() => setShowStatsPanel(false)} />
      )}

      {/* Версия — фиксированно внизу справа */}
      <div style={{
        position: "fixed", bottom: 10, right: 12,
        display: "flex", alignItems: "center", gap: 6,
        fontSize: "0.65rem", color: "#555",
      }}>
        <span>v{versionData.version}</span>
        <button
          onClick={() => {
            if ("serviceWorker" in navigator) {
              navigator.serviceWorker.getRegistrations().then(regs => {
                regs.forEach(r => r.update());
              });
            }
            window.location.reload();
          }}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 4, color: "#666",
            fontSize: "0.6rem", padding: "2px 6px",
            cursor: "pointer", touchAction: "manipulation",
          }}
        >
          обновить
        </button>
      </div>
    </div>
  );
}
