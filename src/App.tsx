import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
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
import TowerInfoModal from "./ui/TowerInfoModal";
import BuildingInfoModal from "./ui/BuildingInfoModal";
import StatsOverlay from "./ui/StatsOverlay";
import UpdateButton from "./ui/UpdateButton";
import type { TowerType } from "./data/towers";
import type { HeroType } from "./data/heroes";
import { HERO_HIRE_COST } from "./data/buildings";
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

  // Сетке нужно знать, сколько высоты уже занято HUD сверху и шопом/панелью
  // снизу, чтобы клетки уменьшались и всё помещалось на невысоких экранах.
  const hudRef = useRef<HTMLDivElement>(null);
  const bottomDockRef = useRef<HTMLDivElement>(null);
  const [reservedHeight, setReservedHeight] = useState(0);
  useLayoutEffect(() => {
    const hudEl = hudRef.current, bottomEl = bottomDockRef.current;
    if (!hudEl || !bottomEl) return;
    const update = () => setReservedHeight(hudEl.getBoundingClientRect().height + bottomEl.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(hudEl);
    ro.observe(bottomEl);
    return () => ro.disconnect();
  }, []);

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

  const handleSelect = useCallback((sel: Selection | null) => {
    setSelection(sel);
    setSelectedItem(null);
    if (sel?.kind === "tower") setBottomTab("towers");
    else if (sel?.kind === "farm" || sel?.kind === "sawmill" || sel?.kind === "town" || sel?.kind === "tavern") setBottomTab("buildings");
  }, []);

  const handleSelectShopItem = useCallback((item: ShopItem | null) => {
    setSelectedItem(item);
    setSelection(null);
  }, []);

  const handleExitBuildMode = useCallback(() => setSelectedItem(null), []);
  const handleCloseSelection = useCallback(() => setSelection(null), []);

  // Найм героя: золото списывается сразу, оффер убирается из таверны,
  // герой переходит в режим размещения на поле (аналог selectedItem для башен).
  const handleHireHero = useCallback((type: HeroType) => {
    setState(s => {
      if (s.gold < HERO_HIRE_COST) return s;
      if (!s.tavern || s.tavern.buildTimeRemaining > 0) return s;
      if (s.heroes.length > 0) return s;
      const idx = s.tavern.offers.findIndex(o => o.type === type);
      if (idx === -1) return s;
      const offers = [...s.tavern.offers];
      offers.splice(idx, 1);
      return { ...s, gold: s.gold - HERO_HIRE_COST, tavern: { ...s.tavern, offers } };
    });
    setPendingHero(type);
    setSelection(null);
    setSelectedItem(null);
  }, []);

  // Отмена размещения героя до того, как он поставлен на поле — возврат
  // золота и восстановление оффера в таверне.
  const handleCancelPendingHero = useCallback(() => {
    setPendingHero(current => {
      if (current) {
        setState(s => s.tavern ? {
          ...s,
          gold: s.gold + HERO_HIRE_COST,
          tavern: { ...s.tavern, offers: [...s.tavern.offers, { type: current }] },
        } : s);
      }
      return null;
    });
  }, []);

  // Герой уже размещён в state (GameGrid вызвал placeHero) — здесь только
  // очищаем режим размещения.
  const handlePlaceHero = useCallback(() => setPendingHero(null), []);
  const handleCloseTowerInfo = useCallback(() => setInfoTowerType(null), []);
  const handleCloseBuildingInfo = useCallback(() => setInfoBuildingKind(null), []);

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
      <div ref={hudRef}>
        <HUD
          state={state}
          onUpdateState={updateState}
          onReset={handleReset}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
        />
      </div>
      <GameGrid
        state={state}
        selectedItem={selectedItem}
        selection={selection}
        pendingHero={pendingHero}
        reservedHeight={reservedHeight}
        onUpdateState={updateState}
        onExitBuildMode={handleExitBuildMode}
        onSelect={handleSelect}
        onPlaceHero={handlePlaceHero}
        onCancelPendingHero={handleCancelPendingHero}
      />
      <div className="bottom-dock" ref={bottomDockRef}>
        <BottomHUD
          state={state}
          activeTab={bottomTab}
          onTabChange={setBottomTab}
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
            onHireHero={handleHireHero}
          />
        )}
        {!selection && selectedItem && !showStats && (
          <ShopPreviewPanel type={selectedItem} onShowInfo={setInfoTowerType} />
        )}
      </div>
      {infoTowerType && (
        <TowerInfoModal type={infoTowerType} onClose={handleCloseTowerInfo} />
      )}
      {infoBuildingKind && (
        <BuildingInfoModal kind={infoBuildingKind} onClose={handleCloseBuildingInfo} />
      )}
      {showStats && (
        <StatsOverlay state={state} onReset={handleReset} />
      )}
      <UpdateButton currentVersion={versionData.version} />
    </div>
  );
}
