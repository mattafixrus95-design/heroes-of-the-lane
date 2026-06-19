# Heroes of the Lane — CLAUDE.md

## Обзор проекта

Браузерный tower defense в стиле HoMM3. Деплой: **tower-lane-chess.vercel.app**.  
GitHub: `mattafixrus95-design/heroes-of-the-lane` (ветка `master`).  
Авто-версионирование: GitHub Actions бампает `src/version.json` на +0.1 при каждом пуше в master.

## Стек

- **Vite + React 19 + TypeScript** (строгий `verbatimModuleSyntax` — всегда `import type` для типов)
- **PWA** через `vite-plugin-pwa` (generateSW, SVG-иконка)
- Никаких сторонних game-фреймворков — чистый `requestAnimationFrame`

## Архитектура

```
src/
  data/
    towers.ts      — определения башен (TowerDef, TowerGrade, TOWER_DEFS)
    waves.ts       — определения крипов (CreepDef, CREEP_DEFS) + волны (WAVE_DEFS)
    map.ts         — PATH, GRID_COLS/ROWS, ENTRY_CELL, EXIT_CELL
  game/
    engine/
      gameState.ts — ВСЕ типы и интерфейсы состояния + createInitialState()
      gameLoop.ts  — requestAnimationFrame, тикает wave/prep/idle фазы
    entities/
      spawnWave.ts — startWave() (→ prep) и startWaveInternal() (→ wave)
    systems/
      index.ts        — tickSystems / tickPrepSystems / tickIdleSystems
      creepSpawn.ts   — спавн по spawnQueue с per-entry задержкой
      enemyMovement.ts— движение по PATH, per-creep speed, regen
      towerAttack.ts  — поиск цели, создание снарядов; пропускает buildTimeRemaining > 0
      projectiles.ts  — урон при прилёте, floating texts при смерти крипа
      buildTimer.ts   — тикает buildTimeRemaining башен
      prepCountdown.ts— тикает prepTimer → автозапуск волны
      floatingTexts.ts— очищает устаревшие FloatingText
      waveEnd.ts      — defeat / victory / → prep
  ui/
    App.tsx         — корневой компонент, стейт selectedItem/Tower/Farm
    HUD.tsx         — gold, lives, food, wave, prep-таймер
    GameGrid.tsx    — рендер сетки, крипов, снарядов, ферм, floating texts
    TowerShop.tsx   — шоп башен + ферма, чекает gold И food
    TowerMenu.tsx   — апгрейд/продажа башни; учитывает food, buildTime
    FarmMenu.tsx    — апгрейд/продажа фермы
    TowerIcon.tsx   — SVG-иконки для 6 грейдов трёх башен
    StatsOverlay.tsx— оверлей победы/поражения со статистикой
  assets/
    GateSVG.tsx / CastleSVG.tsx
```

## Ключевые концепции

### Игровой цикл (фазы)
```
idle → [кнопка "Начать"] → prep (15с) → wave → prep (15с) → wave → ... → victory
                                                          ↘ defeat (lives = 0)
```
- **idle** — только в начале игры
- **prep** — между волнами, строить башни можно, крипы не идут
- **wave** — строить нельзя, все системы тикают
- **victory** — после 10-й волны
- **defeat** — жизни = 0

### Состояние (gameState.ts)
`GameState` — иммутабельный value object. Все системы — чистые функции `(GameState, dt) → GameState`.  
Никакого мутабельного глобального стейта.

### Снаряды и урон
Урон НЕ применяется сразу при выстреле — хранится в `pendingDamage` внутри снаряда и применяется при прилёте (`projectiles.ts`). Так взрыв дракона срабатывает даже если основная цель умерла раньше.

### Спавн крипов
`spawnQueue: SpawnEntry[]` — очередь `{ kind, delay }`. `delay` — пауза перед этим крипом (в секундах). Первый всегда `delay: 0`. Позволяет делать разные интервалы и паузы перед боссом.

### Еда (food)
Supply-механика как в Warcraft 3:
- `state.food` = текущая доступная еда
- Башни тратят еду при постройке/апгрейде; еда возвращается при продаже
- Ферма (`Farm`) даёт +15 еды при постройке и при каждом апгрейде
- При продаже фермы еда забирается обратно (блокируется если food < farm.foodProduced)

### Floating texts
`FloatingText { id, text, x, y, color, spawnTime, duration }` — тайловые координаты.  
Создаются в: `projectiles.ts` (смерть крипа), `GameGrid.tsx` (постройка), `TowerMenu.tsx` (апгрейд/продажа), `FarmMenu.tsx`.

## Данные волн и башен

**10 волн (HoMM3):**
1. 😈 Бесёнки ×40 (hp 8, ×1.3)
2. 🛡️ Копейщики ×25 (hp 30, ×1.0)
3. 🐺 Волч. Всадники ×20 (hp 22, ×2.0)
4. 💀 Зомби ×15 (hp 70, ×0.6, реген 2/с)
5. 🐂 Минотавры ×10 + 👑 Король (hp 250)
6. 🐴 Кавалеристы ×18 (hp 40, ×1.6)
7. 👹 Повелители Ям ×12 (hp 90)
8. ⚡ Титаны ×8 (hp 160, ×0.7)
9. 🐃 Бегемоты ×8 (hp 200, ×0.5, реген 4/с)
10. 🐲 Чёрные Драконы ×3 (hp 500, реген 5/с, финальный босс)

**Башни:**
| Тип   | Цена  | Еда | Стройка | Апгрейд |
|-------|-------|-----|---------|---------|
| Гном  | 20💰  | 🌾×1 | 1с    | 40💰, 2с, 🌾×0 |
| Эльф  | 50💰  | 🌾×1 | 3с    | 100💰, 5с, 🌾×2 |
| Дракон| 200💰 | 🌾×3 | 10с   | 300💰, 15с, 🌾×3 |
| Ферма | 50💰  | —   | мгн.  | +15🌾 / 50💰 |

## Карта

10×9 сетки. Путь — змейка 57 точек (PATH в `map.ts`).  
`BASE_SPEED` убран — скорость хранится в каждом крипе (`c.speed` tiles/sec).

## Соглашения по коду

- Пишем на **русском** в коммитах и комментариях
- Эмодзи в коде — только Unicode ≤ 9.0 (Windows 10 Segoe UI Emoji): ок 😈🐺💀🐂🐴👹⚡🐃🐲, риск 🧟🦅🦁
- Все `import type` для типов — требование `verbatimModuleSyntax`
- `gradeEmoji` / `cssFilter` из старого `towers.ts` — не используются (визуал через `TowerIcon.tsx`)
- Floating text ID: `ft-${Date.now()}-${random}` (нет глобальных счётчиков в UI-файлах)
- Продажа: `SELL_RATE = 0.7` (70% от вложенного)

## Деплой

```bash
git push origin master  # → GitHub Actions бампает версию → Vercel деплоит автоматически
```

При конфликте: `git pull --rebase origin master` перед пушем.
