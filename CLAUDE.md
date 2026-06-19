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
- 10 волн крипов по HoMM3 (Inferno/Castle/Stronghold/Necropolis/Dungeon)
- 3 башни × 2 грейда с SVG-иконками (гном, эльф, дракон)
- Ферма как ресурсное здание (+15 еды)
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
- Бесконечный режим (волны 11+ со скейлингом)
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
    waves.ts       — CreepDef, CREEP_DEFS (11 типов), WAVE_DEFS (10 волн)
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
      waveEnd.ts        — defeat (lives≤0) | victory (wave≥10) | → prep (иначе)
  ui/
    App.tsx          — root, стейт selectedItem/TowerId/FarmId
    HUD.tsx          — gold, lives, food, wave/10, prep-таймер, кнопка обновления
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
idle → [кнопка "Начать"] → prep (15с) → wave → prep (15с) → wave → … → victory (волна 10)
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

| Башня | Цена | Еда | Стройка | Апгрейд (цена / время / еда) |
|-------|------|-----|---------|------------------------------|
| Гном  | 20💰 | 🌾×1 | 1с | 40💰 / 2с / 🌾×0 |
| Эльф  | 50💰 | 🌾×1 | 3с | 100💰 / 5с / 🌾×2 |
| Дракон| 180💰 | 🌾×3 | 7с | 300💰 / 9с / 🌾×3 |
| Ферма | 50💰 | — | мгн. | 50💰 / мгн. / +15🌾 |

Нач. золото: 200💰, Нач. еда: 15🌾, Продажа: 70% от вложенного.
Стартовая ферма: размещена по умолчанию на col=8, row=1 (верхний правый угол карты).

---

## Данные волн (HoMM3)

Бонус за завершение волны: 50💰 после волны 1, +5💰 за каждую следующую (волна 10 = +95💰).

| # | Юнит | Фракция | × | HP | Speed | Реген | Награда | ΣHP | Σ💰 |
|---|------|---------|---|----|-------|-------|---------|-----|-----|
| 1 | 😈 Бесёнок | Inferno T1 | 40 | 8 | 1.3 | — | 2 | 320 | 80 |
| 2 | 👺 Гоблин | Stronghold T1 | 50 | 12 | 1.5 | — | 2 | 600 | 100 |
| 3 | 🛡️ Копейщик | Castle T1 | 30 | 30 | 1.0 | — | 4 | 900 | 120 |
| 4 | 🐺 Волч. Всадник | Stronghold T2 | 26 | 50 | 2.0 | — | 6 | 1300 | 156 |
| 5 | 💀 Зомби | Necropolis T2 | 22 | 90 | 0.6 | 3/с | 9 | 1980 | 198 |
| 6 | 🐗 Орк | Stronghold T3 | 21 | 130 | 0.85 | — | 11 | 2730 | 231 |
| 7 | 👻 Призрак | Necropolis T3 | 19 | 185 | 0.95 | 3/с | 14 | 3515 | 266 |
| 8 | 🐂 Минотавр | Dungeon T3 | 20 | 230 | 1.1 | — | 15 | 4600 | 300 |
| 9 | 🗿 Голем | Tower T3 | 14 | 420 | 0.4 | 4/с | 24 | 5880 | 336 |
| 10 | 🐂+🗿 Минотавр+Голем | Dun+Tow T3 | 14+12 | 230/420 | — | — | 15/24 | 8260 | 498 |

**Волны 11+ (зарезервировано):** 👑 Кор. Минотавров T4, 🐴 Кавалерист T5, 👹 Повелитель Ям T5, ⚡ Титан T7, 🐃 Бегемот T7, 🐲 Чёрный Дракон T7

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
