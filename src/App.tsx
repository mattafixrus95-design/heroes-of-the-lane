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
import ShopPreviewPanel from "./ui/ShopPreviewPanel";
import HeroPreviewPanel from "./ui/HeroPreviewPanel";
import TowerInfoModal from "./ui/TowerInfoModal";
import BuildingInfoModal from "./ui/BuildingInfoModal";
import HeroInfoModal from "./ui/HeroInfoModal";
import StatsOverlay from "./ui/StatsOverlay";
import UpdateButton from "./ui/UpdateButton";
import type { TowerType } from "./data/towers";
import type { HeroType } from "./data/heroes";
import type { Selection } from "./ui/selection";
import { audioManager } from "./audio/AudioManager";
import "./index.css";

export default function App() {
  const [state, setState] = useState<GameState>(createInitialState);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [pendingHero, setPendingHero] = useState<HeroType | null>(null);
  const [bottomTab, setBottomTab] = useState<BottomTab>("towers");
  const [volume, setVolume] = useState(0.7);
  const prevVolumeRef = useRef(0.7);
  const [infoTowerType, setInfoTowerType] = useState<TowerType | null>(null);
  const [infoBuildingKind, setInfoBuildingKind] = useState<"farm" | "sawmill" | "town" | "tavern" | null>(null);
  const [infoHeroType, setInfoHeroType] = useState<HeroType | null>(null);

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

  const handleReset = useCallback(() => {
    setState(createInitialState());
    setSelectedItem(null);
    setSelection(null);
    setPendingHero(null);
    setInfoTowerType(null);
    setInfoBuildingKind(null);
  }, []);

  // Выбор объекта (клик по башне/зданию — на карте или из под-списка в
  // табе) НЕ трогает состояние табов — таб остаётся таким, каким был.
  const handleSelect = useCallback((sel: Selection | null) => {
    setSelection(sel);
    setSelectedItem(null);
  }, []);

  const handleSelectShopItem = useCallback((item: ShopItem | null) => {
    setSelectedItem(item);
    setSelection(null);
    setPendingHero(null);
  }, []);

  const handleExitBuildMode = useCallback(() => setSelectedItem(null), []);
  const handleCloseSelection = useCallback(() => setSelection(null), []);

  // Клик по табу Башни/Здания (включение ИЛИ выключение) всегда сбрасывает
  // текущее выделение — таб и выделение больше не рассинхронизируются.
  const handleTabChange = useCallback((tab: BottomTab) => {
    setBottomTab(tab);
    setSelection(null);
  }, []);

  // Герой ведёт себя как обычная башня в шопе: клик по иконке в таверне
  // только выбирает его для размещения (превью статов), деньги и еда
  // списываются, а оффер из таверны убирается только в момент реальной
  // постройки на поле (см. placeHero в GameGrid.tsx).
  const handleSelectHero = useCallback((type: HeroType) => {
    setPendingHero(type);
    setSelection(null);
    setSelectedItem(null);
  }, []);

  const handleCancelPendingHero = useCallback(() => setPendingHero(null), []);

  // Герой уже размещён в state (GameGrid вызвал placeHero) — здесь только
  // очищаем режим размещения.
  const handlePlaceHero = useCallback(() => setPendingHero(null), []);
  const handleCloseTowerInfo = useCallback(() => setInfoTowerType(null), []);
  const handleCloseBuildingInfo = useCallback(() => setInfoBuildingKind(null), []);
  const handleCloseHeroInfo = useCallback(() => setInfoHeroType(null), []);

  const handleVolumeChange = useCallback((v: number) => {
    if (v > 0) prevVolumeRef.current = v;
    setVolume(v);
  }, []);

  const handleToggleMute = useCallback(() => {
    setVolume(v => v > 0 ? (prevVolumeRef.current = v, 0) : prevVolumeRef.current);
  }, []);

  const showStats = state.phase === "defeat" || state.phase === "victory";

  return (
    <div className="app">
      <HUD
        state={state}
        onUpdateState={updateState}
        onReset={handleReset}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
      />
      <GameGrid
        state={state}
        selectedItem={selectedItem}
        selection={selection}
        pendingHero={pendingHero}
        onUpdateState={updateState}
        onExitBuildMode={handleExitBuildMode}
        onSelect={handleSelect}
        onPlaceHero={handlePlaceHero}
        onCancelPendingHero={handleCancelPendingHero}
      />
      <div className="bottom-dock">
        <BottomHUD
          state={state}
          activeTab={bottomTab}
          onTabChange={handleTabChange}
          selectedShopItem={selectedItem}
          onSelectShopItem={handleSelectShopItem}
          selection={selection}
          onSelectBuilding={handleSelect}
        />
        {selection && !showStats && (
          <ContextMenu
            state={state}
            selection={selection}
            pendingHero={pendingHero}
            onUpdateState={updateState}
            onClose={handleCloseSelection}
            onShowTowerInfo={setInfoTowerType}
            onShowBuildingInfo={setInfoBuildingKind}
            onSelectHero={handleSelectHero}
            onShowHeroInfo={setInfoHeroType}
          />
        )}
        {!selection && selectedItem && !showStats && (
          <ShopPreviewPanel type={selectedItem} onShowInfo={setInfoTowerType} />
        )}
        {!selection && !selectedItem && pendingHero && !showStats && (
          <HeroPreviewPanel type={pendingHero} onShowInfo={setInfoHeroType} />
        )}
      </div>
      {infoTowerType && (
        <TowerInfoModal type={infoTowerType} onClose={handleCloseTowerInfo} />
      )}
      {infoBuildingKind && (
        <BuildingInfoModal kind={infoBuildingKind} onClose={handleCloseBuildingInfo} />
      )}
      {infoHeroType && (
        <HeroInfoModal type={infoHeroType} onClose={handleCloseHeroInfo} />
      )}
      {showStats && (
        <StatsOverlay state={state} onReset={handleReset} />
      )}
      <UpdateButton currentVersion={versionData.version} />
    </div>
  );
}
