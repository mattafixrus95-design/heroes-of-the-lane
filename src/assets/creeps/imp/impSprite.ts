import impUrl from "./imp-sprite.png";

// Общий на все крипы-Бесы экземпляр Image — грузится один раз при импорте
// модуля. Перед отрисовкой проверяем .complete, чтобы не рисовать пустоту
// до загрузки (в этот момент просто пропускаем кадр — не критично).
const impImage = new Image();
impImage.src = impUrl;

export default impImage;
