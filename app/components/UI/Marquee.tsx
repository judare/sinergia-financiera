"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Marquee({
  children,
  speed = 100,
  pauseOnHover = true,
  className = "",
}: any) {
  const containerRef = useRef<any>(null);
  const contentRef = useRef<any>(null); // primera copia
  const trackRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  const w: any = typeof window !== "undefined" ? window : {};

  useEffect(() => {
    if (!contentRef.current || !trackRef.current || !containerRef.current)
      return;

    const update = () => {
      const contentWidth = contentRef.current?.offsetWidth;
      if (!contentWidth) return;

      // duración en segundos = ancho / speed (px/s)
      const duration = contentWidth / speed;

      // establecer variables CSS para keyframes dinámicos
      trackRef.current.style.setProperty(
        "--marquee-translate",
        `${contentWidth}px`
      );
      trackRef.current.style.setProperty("--marquee-duration", `${duration}s`);
      setReady(true);
    };

    update();
    // recalcular en resize/observe children cambios
    const ro = new ResizeObserver(update);
    ro.observe(contentRef.current);
    ro.observe(containerRef.current);
    w.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      w.removeEventListener("resize", update);
    };
  }, [children, speed]);

  // pausa on hover
  useEffect(() => {
    if (!containerRef.current) return;
    const el = trackRef.current;
    if (!el) return;
    const enter = () => {
      if (pauseOnHover) el.style.animationPlayState = "paused";
    };
    const leave = () => {
      if (pauseOnHover) el.style.animationPlayState = "running";
    };
    containerRef.current.addEventListener("mouseenter", enter);
    containerRef.current.addEventListener("mouseleave", leave);
    return () => {
      if (!containerRef.current) return;
      containerRef.current.removeEventListener("mouseenter", enter);
      containerRef.current.removeEventListener("mouseleave", leave);
    };
  }, [pauseOnHover]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden w-full ${className}`}
      aria-hidden={false}
    >
      {/* inject simple CSS for the marquee animation that uses CSS variables */}
      <style>{`
        .marquee-track {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          /* animation uses CSS variables set from JS */
          animation-name: marquee;
          animation-timing-function: linear;
          animation-duration: var(--marquee-duration, 10s);
          animation-iteration-count: infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(var(--marquee-translate) * -1)); }
        }
      `}</style>

      {/* track contiene dos copias consecutivas del contenido para loop seamless */}
      <div
        ref={trackRef}
        className="marquee-track whitespace-nowrap"
        // hide animation until ready to avoid jump
        style={{ animationPlayState: ready ? "running" : "paused" }}
      >
        <div ref={contentRef} className="flex items-center">
          {children}
        </div>
        <div className="flex items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
