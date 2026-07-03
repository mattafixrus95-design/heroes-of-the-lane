// Мягкая эллиптическая тень под объектом — фиксированное смещение вниз-вправо,
// чтобы карта не выглядела плоской. Рисуется как отдельный слой позади иконки
// (иконка должна лежать в соседнем positioned-контейнере с zIndex:1).
export default function ObjectShadow({ size }: { size: number }) {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 0,
        left: "50%",
        bottom: size * 0.08,
        width: size * 0.62,
        height: size * 0.22,
        transform: "translate(calc(-50% + 3px), 4px)",
        background: "radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 72%)",
        pointerEvents: "none",
      }}
    />
  );
}
