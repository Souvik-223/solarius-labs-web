"use client";
import React, { useRef, useState, useEffect } from "react";

interface WaveEffectProps {
  children: React.ReactNode;
  className?: string;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export default function WaveEffect({ children, className = "" }: WaveEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

      if (inside) {
        createRipple(x, y);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const createRipple = (x: number, y: number) => {
    setRipples((prev) => [...prev, { x, y, size: 0, opacity: 1 }]);
    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 1500);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: "transparent",
        position: "relative",
      }}
    >
      {ripples.map((ripple, i) => (
        <div
          key={i}
          className="absolute pointer-events-none ripple-effect"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: "150px",
            height: "150px",
            opacity: ripple.opacity,
            "--x": `${ripple.x}px`,
            "--y": `${ripple.y}px`,
          } as React.CSSProperties}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
