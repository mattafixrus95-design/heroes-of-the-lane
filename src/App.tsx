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
import TowerInfoModal from "./ui/TowerInfoModal";
import FarmPanel from "./ui/FarmPanel";
import StatsOverlay from "./ui/StatsOverlay";
import UpdateButton from "./ui/UpdateButton";
import type { TowerType } from "./data/towers";
import { audioManager } from "./audio/AudioManager";
import "./index.css";

export default function App() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [infoTowerType, setInfoTowerType] = useState<TowerType | null>(null);

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

  // Звуки при появлении новых снарядов
  const prevProjectileIds = useRef<Set<string>>(new Set());
  useEffect(() => {
    const current = new Set(state.projectiles.map(p => p.id));
    if (soundEnabled) {
      for (const p of state.projectiles) {
        if (!prevProjectileIds.current.has(p.id)) {
          if (p.kind === "arrow")    audioManager.playArrow();
          else if (p.kind === "axe") audioManager.playAxe();
          else                       audioManager.playFire();
        }
      }
    }
    prevProjectileIds.current = current;
  }, [state.projectiles, soundEnabled]);

  // Синхронизируем muted флаг AudioManager
  useEffect(() => { audioManager.muted = !soundEnabled; }, [soundEnabled]);

  function handleReset() {
    setState(createInitialState());
    setSelectedItem(null);
    setSelectedTowerId(null);
    setInfoTowerType(null);
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
      <HUD
        state={state}
        onUpdateState={updateState}
        onReset={handleReset}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(v => !v)}
      />
      <GameGrid
        state={state}
        selectedItem={selectedItem}
        onUpdateState={updateState}
        onClearSelection={() => setSelectedItem(null)}
        onSelectTowerId={handleSelectTowerId}
        onCancelBuild={() => setSelectedItem(null)}
      />
      <TowerShop
        gold={state.gold}
        food={state.food}
        selected={selectedItem}
        waveActive={state.phase === "wave"}
        onSelect={setSelectedItem}
        onInfo={setInfoTowerType}
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
      {infoTowerType && (
        <TowerInfoModal type={infoTowerType} onClose={() => setInfoTowerType(null)} />
      )}
      {showStats && (
        <StatsOverlay state={state} onReset={handleReset} />
      )}
      <UpdateButton currentVersion={versionData.version} />
    </div>
  );
}
