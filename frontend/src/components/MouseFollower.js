import { useEffect, useState } from "react";

export default function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      style={{
        background: `radial-gradient(300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 44, 197, 0.2), transparent 80%)`,
      }}
    />
  );
}