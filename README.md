# Heroes of the Lane

Браузерный tower defense MVP. Vite + React + TypeScript.

## Запуск локально

```bash
npm install
npm run dev
```

Открой http://localhost:5173

## Сборка

```bash
npm run build    # артефакты в /dist
npm run preview  # превью собранного билда
```

## Deploy на Vercel

1. Залей репозиторий на GitHub
2. Подключи в [vercel.com](https://vercel.com) — Vercel автоматически определит Vite
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`

SPA-роутинг уже настроен в `vercel.json`.

## Структура

```
src/
  game/
    engine/       # GameLoop, GameState
    entities/     # spawnWave
    systems/      # enemyMovement, towerAttack, waveEnd
  ui/             # HUD, GameGrid
  data/           # map (PATH, grid)
  utils/          # idgen
```

## Механика MVP

- Сетка 8×8, фиксированный путь «змейкой»
- Башни стоят 50 💰, ставятся кликом на незанятые клетки вне пути
- Кнопка **«Начать волну»** запускает врагов
- Каждая очищенная волна даёт золото (растёт с номером волны)
- Жизни убывают, когда враги добегают до конца пути

## Roadmap

- [ ] Разные типы башен / героев
- [ ] Разные типы врагов (скорость, броня, летающие)
- [ ] Магазин / прокачка
- [ ] Синергии (Auto Chess механика)
- [ ] Анимации (canvas или CSS)
