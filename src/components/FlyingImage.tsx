export function FlyingImage({ src, from, to, onComplete }: any) {
  return (
    <div
      className="pointer-events-none fixed z-[200] h-20 w-20 overflow-hidden rounded-full shadow-2xl transition-all duration-700 ease-in-out"
      style={{
        left: from.x,
        top: from.y,
        transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(0.2) rotate(360deg)`,
        opacity: 0,
      }}
      onTransitionEnd={onComplete}
    >
      <img src={src} alt="flying" className="h-full w-full object-cover" />
    </div>
  );
}