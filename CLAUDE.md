# Heroes of the Lane — Манифест проекта

> **Для Claude Code:** читай этот файл перед каждым запросом в этом проекте.
> После любого пуша в `master` версия автоматически бампается на +0.1 через GitHub Actions.
> Обновляй этот файл при каждом значимом изменении архитектуры, данных или механик.

---

## Продуктовое видение

Tower defense в духе HoMM3 + LTD (Legion TD) для браузера и мобилки.  
Цель: простой вход (зашёл — сразу играешь), но глубокий геймплей (синергии башен, ресурс еды, 10 волн с боссами).  
Деплой: **tower-lane-chess.vercel.app** | GitHub: `mattafixrus95-design/heroes-of-the-lane`

### Что уже есть
- 20 волн крипов по HoMM3 (Inferno/Castle/Stronghold/Necropolis/Dungeon/Tower)
- 3 башни × 2 грейда с SVG-иконками (гном, эльф, дракон)
- Ферма как ресурсное здание (+15 еды, вне игрового поля)
- Система еды (supply как в Warcraft 3)
- Время постройки/апгрейда башен
- Prep-фаза 15с между волнами
- Анимация floating texts (+💰 / +🌾)
- Реалистичная дорога (gradient с обочинами) + текстурная трава
- PWA + мобильная адаптация
- Статистика победы/поражения (убийства и золото по волнам)
- Авто-версионирование через GitHub Actions

### Что хотим добавить (бэклог)
- Звуки юнитов и действий
- Больше типов башен и синергии
- Таблица рекордов / очки за прохождение
- Анимации крипов (не просто эмодзи)

---

## Версионирование

**Правило:** каждый пуш в `master` → GitHub Actions бампает `src/version.json` на +0.1.  
Логика: `0.9 → 0.10 → 0.11` (minor как целое число, не decimal).  
Файл: `.github/workflows/bump-version.yml` — **не менять вручную**.  
Кнопка "🔄 vX.X" в HUD форсирует обновление SW + reload страницы.

---

## Стек и инфраструктура

- **Vite + React 19 + TypeScript** (строгий `verbatimModuleSyntax` — всегда `import type`)
- **PWA** через `vite-plugin-pwa` (generateSW, SVG-иконка `/icon.svg`)
- Никаких game-фреймворков — чистый `requestAnimationFrame`
- Деплой: Vercel (авто при пуше в master)
- При конфликте пуша: `git pull --rebase origin master` перед `git push`

---

## Архитектура

```
src/
  data/
    towers.ts      — TowerDef, TowerGrade, TOWER_DEFS (3 типа × 2 грейда)
    waves.ts       — CreepDef, CREEP_DEFS (20 типов), WAVE_DEFS (20 волн)
    map.ts         — PATH (57 точек), GRID_COLS/ROWS=10×9, ENTRY/EXIT_CELL
  game/
    engine/
      gameState.ts — ВСЕ типы + createInitialState(). Единственный source of truth.
      gameLoop.ts  — rAF-цикл, тикает: wave→tickSystems, prep→tickPrepSystems, idle/victory→tickIdleSystems
    entities/
      spawnWave.ts — startWave() (→ prep 15с) | startWaveInternal() (→ wave, вызывается авто)
    systems/
      index.ts          — экспортирует tickSystems / tickPrepSystems / tickIdleSystems
      creepSpawn.ts     — спавн по spawnQueue (SpawnEntry[]{kind, delay})
      enemyMovement.ts  — движение по PATH, per-creep speed, hp regen
      towerAttack.ts    — findTarget, создание Projectile; skip если buildTimeRemaining > 0
      projectiles.ts    — урон при прилёте, floating texts при смерти, waveKilled/waveGold
      buildTimer.ts     — тикает buildTimeRemaining всех башен
      prepCountdown.ts  — тикает prepTimer → startWaveInternal при 0
      floatingTexts.ts  — фильтрует устаревшие FloatingText
      waveEnd.ts        — defeat (lives≤0) | victory (wave≥WAVE_DEFS.length) | → prep (иначе)
  ui/
    App.tsx          — root, стейт selectedItem/TowerId/FarmId
    HUD.tsx          — gold, lives, food, wave/20, prep-таймер, кнопка обновления
    GameGrid.tsx     — сетка, крипы, снаряды, фермы, floating texts, постройка
    TowerShop.tsx    — шоп (башни + ферма), чек gold И food
    TowerMenu.tsx    — апгрейд/продажа башни (food, buildTime, floating text)
    FarmMenu.tsx     — апгрейд/продажа фермы
    TowerIcon.tsx    — SVG-иконки: 6 грейдов (DwarfG0/G1, ElfG0/G1, DragonG0/G1)
    StatsOverlay.tsx — оверлей победы/поражения со статистикой
  assets/
    GateSVG.tsx | CastleSVG.tsx
```

---

## Игровой цикл

```
idle → [кнопка "Начать"] → prep (15с) → wave → prep (15с) → wave → … → victory (волна 20)
                                                                     ↘ defeat (lives = 0)
```

| Фаза | Строить | Тикают системы |
|------|---------|---------------|
| idle | ✅ | только floatingTexts |
| prep | ✅ | buildTimer, prepCountdown, floatingTexts |
| wave | ❌ | всё |
| victory/defeat | ❌ | только floatingTexts (victory) / заморожено (defeat) |

---

## Ключевые механики

### Снаряды и урон
Урон хранится в `pendingDamage` внутри `Projectile` — применяется при прилёте.  
Взрыв дракона (`explosionAoe`) срабатывает даже если основная цель уже мертва.

### Спавн крипов
`spawnQueue: SpawnEntry[]` = `{ kind: CreepKind; delay: number }`.  
`delay` — пауза перед этим крипом. Первый в очереди всегда `delay: 0`.  
Позволяет: разные интервалы, паузы 2-3с перед боссами.

### Еда (supply)
- `state.food` = доступная еда
- Башня тратит еду при постройке и апгрейде; еда возвращается при продаже
- Ферма даёт +15 еды (постройка и каждый апгрейд)
- Продажа фермы забирает всю еду что она дала (блок если food < farm.foodProduced)

### Floating texts
`FloatingText { id, text, x, y, color, spawnTime, duration }` — тайловые координаты.  
Создаются в: `projectiles.ts` (смерть крипа), `GameGrid.tsx` (постройка), `TowerMenu.tsx`, `FarmMenu.tsx`.  
ID-формат: `ft-${Date.now()}-${random}` (без глобальных счётчиков в UI-файлах).

---

## Данные башен

| Башня | Цена | Еда | Стройка | Апгрейд (цена / время / еда) | Урон G0/G1 | Range | AS G0/G1 |
|-------|------|-----|---------|------------------------------|------------|-------|---------|
| Гном  | 20💰 | 🌾×1 | 1с | 50💰 / 2с / 🌾×0 | 3/6 | 2/2 | 1.0/1.2 slow0.25 |
| Эльф  | 50💰 | 🌾×1 | 3с | 100💰 / 5с / 🌾×2 | 5/8 | 3/4 | 0.75/1.2 AoE r2×35% |
| Дракон| 185💰 | 🌾×3 | 7с | 320💰 / 9с / 🌾×4 | 20/30 | 4/5 | 0.5/0.75 AoE r1/r2×50% |
| Ферма | 50💰 | — | мгн. | 50💰 / мгн. / +15🌾 | — | — | — |

Нач. золото: 200💰, Нач. еда: 15🌾, Продажа: 70% от вложенного.
Стартовая ферма: размещена в FarmPanel (вне игрового поля).

---

## Данные волн (HoMM3)

Бонус за завершение волны: 25💰 после волны 1, +5💰 за каждую следующую.
Прогрессия ΣHP: волны 1-9 ~×1,2 каждая; волны 10-19 ~×1,1; волна 20 — финальный спайк.

| # | Юнит | Фракция | × | HP | Speed | Реген | Награда | ΣHP | Σ💰 |
|---|------|---------|---|----|-------|-------|---------|-----|-----|
| 1 | Бесёнок | Inferno T1 | 36 | 8 | 1,4 | — | 2 | 288 | 72 |
| 2 | Гоблин | Stronghold T1 | 30 | 12 | 1,6 | — | 2 | 360 | 60 |
| 3 | Копейщик | Castle T1 | 20 | 21 | 1,1 | — | 5 | 420 | 100 |
| 4 | Волч. Всадник | Stronghold T2 | 15 | 33 | 2,1 | — | 8 | 495 | 120 |
| 5 | Зомби | Necropolis T2 | 12 | 50 | 0,7 | 3/с | 12 | 600 | 144 |
| 6 | Орк | Stronghold T3 | 10 | 72 | 0,95 | — | 18 | 720 | 180 |
| 7 | Призрак | Necropolis T3 | 10 | 86 | 1,05 | 3/с | 22 | 860 | 220 |
| 8 | Минотавр | Dungeon T3 | 8 | 130 | 1,2 | — | 33 | 1040 | 264 |
| 9 | Голем | Tower T3 | 8 | 155 | 0,5 | 4/с | 39 | 1240 | 312 |
| 10 | Ангел | Castle T6 | 5 | 600 | 1,5 | 15/с | 100 | 3000 | 500 |
| 11 | Огр | Stronghold T4 | 10 | 330 | 1,0 | — | 65 | 3300 | 650 |
| 12 | Крестоносец | Castle T4 | 10 | 360 | 1,2 | — | 70 | 3600 | 700 |
| 13 | Вампир Лорд | Necropolis T5 | 9 | 445 | 1,3 | 5/с | 90 | 4005 | 810 |
| 14 | Властелин Ям | Inferno T5 | 8 | 550 | 1,1 | — | 110 | 4400 | 880 |
| 15 | Рок | Stronghold T5 | 7 | 690 | 1,5 | — | 140 | 4830 | 980 |
| 16 | Лич | Necropolis T6 | 7 | 760 | 0,9 | 8/с | 150 | 5320 | 1050 |
| 17 | Дьявол | Inferno T6 | 6 | 975 | 1,4 | — | 200 | 5850 | 1200 |
| 18 | Титан | Tower T7 | 5 | 1285 | 0,9 | — | 260 | 6425 | 1300 |
| 19 | Чёрный Дракон | Dungeon T7 | 4 | 1770 | 1,1 | 12/с | 350 | 7080 | 1400 |
| 20 | Архангел | Castle T7 | 5 | 2500 | 2,0 | 30/с | 300 | 12500 | 1500 |

---

## Карта

10×9 сетки. Путь — змейка, 57 точек, `PATH` в `map.ts`.  
Визуал: трава — шахматный градиент `#52965c`/`#3d7a48`, дорога — gradient с тёмными краями и светлым центром, углы — `#8a7050`.  
`BASE_SPEED` удалён — скорость хранится в каждом крипе (`c.speed` tiles/sec).

---

## Соглашения

- **Язык**: комментарии, коммиты, UI — на русском
- **Эмодзи**: только Unicode ≤ 9.0 (Windows 10 safe). ✅ 😈🐺💀🐂🐴👹⚡🐃🐲  ⚠️ 🧟🦅🦁
- **import type**: всегда для типов (требование `verbatimModuleSyntax`)
- **Чистые функции**: все системы — `(GameState, dt?) → GameState`, нет side effects
- **Продажа**: `SELL_RATE = 0.7`
- **Авто-версия**: не трогать `src/version.json` и `bump-version.yml` вручную
- **Git-воркфлоу**: никогда не пушить напрямую в `master`. Всегда: `git checkout -b feature/...` → коммит → `gh pr create` → пользователь мержит в GitHub
