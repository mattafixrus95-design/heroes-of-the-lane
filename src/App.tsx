import { useState, useEffect, useCallback, useRef } from "react";
import { createInitialState } from "./game/engine/gameState";
import type { GameState } from "./game/engine/gameState";
import versionData from "./version.json";
import { GameLoop } from "./game/engine/gameLoop";
import HUD from "./ui/HUD";
import BottomHUD from "./ui/BottomHUD";
import type { BottomTab } from "./ui/BottomHUD";
import type { ShopItem } from "./ui/TowerShop";
import GameGrid from "./ui/GameGrid";
import ContextMenu from "./ui/ContextMenu";
import TowerInfoModal from "./ui/TowerInfoModal";
import BuildingInfoModal from "./ui/BuildingInfoModal";
import StatsOverlay from "./ui/StatsOverlay";
import UpdateButton from "./ui/UpdateButton";
import type { TowerType } from "./data/towers";
import type { Selection } from "./ui/selection";
import { audioManager } from "./audio/AudioManager";
import "./index.css";

export default function App() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [bottomTab, setBottomTab] = useState<BottomTab>("towers");
  const [volume, setVolume] = useState(0.7);
  const prevVolumeRef = useRef(0.7);
  const [infoTowerType, setInfoTowerType] = useState<TowerType | null>(null);
  const [infoBuildingKind, setInfoBuildingKind] = useState<"farm" | "sawmill" | "town" | null>(null);

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

  // Синхронизируем громкость AudioManager
  useEffect(() => { audioManager.volume = volume; }, [volume]);

  // Звуки при появлении новых снарядов
  const prevProjectileIds = useRef<Set<string>>(new Set());
  useEffect(() => {
    const current = new Set(state.projectiles.map(p => p.id));
    if (volume > 0) {
      for (const p of state.projectiles) {
        if (!prevProjectileIds.current.has(p.id)) {
          if (p.kind === "arrow")    audioManager.playArrow();
          else if (p.kind === "axe") audioManager.playAxe();
          else                       audioManager.playFire();
        }
      }
    }
    prevProjectileIds.current = current;
  }, [state.projectiles, volume]);

  function handleReset() {
    setState(createInitialState());
    setSelectedItem(null);
    setSelection(null);
    setInfoTowerType(null);
    setInfoBuildingKind(null);
  }

  function handleSelect(sel: Selection | null) {
    setSelection(sel);
    setSelectedItem(null);
    if (sel?.kind === "tower") setBottomTab("towers");
    else if (sel?.kind === "farm" || sel?.kind === "sawmill" || sel?.kind === "town") setBottomTab("buildings");
  }

  function handleSelectShopItem(item: ShopItem | null) {
    setSelectedItem(item);
    setSelection(null);
  }

  const showStats = state.phase === "defeat" || state.phase === "victory";

  return (
    <div className="app">
      <HUD
        state={state}
        onUpdateState={updateState}
        onReset={handleReset}
        volume={volume}
        onVolumeChange={v => {
          if (v > 0) prevVolumeRef.current = v;
          setVolume(v);
        }}
        onToggleMute={() => setVolume(v => v > 0 ? (prevVolumeRef.current = v, 0) : prevVolumeRef.current)}
      />
      <GameGrid
        state={state}
        selectedItem={selectedItem}
        selection={selection}
        onUpdateState={updateState}
        onExitBuildMode={() => setSelectedItem(null)}
        onSelect={handleSelect}
      />
      <BottomHUD
        state={state}
        activeTab={bottomTab}
        onTabChange={setBottomTab}
        selectedShopItem={selectedItem}
        onSelectShopItem={handleSelectShopItem}
        onInfo={setInfoTowerType}
        selection={selection}
        onSelectBuilding={handleSelect}
      />
      {selection && !showStats && (
        <ContextMenu
          state={state}
          selection={selection}
          onUpdateState={updateState}
          onClose={() => setSelection(null)}
          onShowTowerInfo={setInfoTowerType}
          onShowBuildingInfo={setInfoBuildingKind}
        />
      )}
      {infoTowerType && (
        <TowerInfoModal type={infoTowerType} onClose={() => setInfoTowerType(null)} />
      )}
      {infoBuildingKind && (
        <BuildingInfoModal kind={infoBuildingKind} onClose={() => setInfoBuildingKind(null)} />
      )}
      {showStats && (
        <StatsOverlay state={state} onReset={handleReset} />
      )}
      <UpdateButton currentVersion={versionData.version} />
    </div>
  );
}
