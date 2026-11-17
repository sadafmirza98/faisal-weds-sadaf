"use client";

import { useEffect, useRef } from "react";

/** Golden sparkles follow the wand cursor over [data-wand] areas (fine pointers only). */
export function WandTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const sparks: { x: number; y: number; vx: number; vy: number; life: number; r: number }[] = [];
    let raf = 0;
    let running = false;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= 0.022;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.03;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,236,180,${s.life})`;
        ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = `rgba(232,201,139,${s.life * 0.18})`;
        ctx.arc(s.x, s.y, s.r * 3 * s.life, 0, Math.PI * 2);
        ctx.fill();
      }
      if (sparks.length) raf = requestAnimationFrame(loop);
      else running = false;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as HTMLElement | null;
      if (!t?.closest("[data-wand]")) return;
      for (let i = 0; i < 2; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2 - 0.3, life: 1, r: 1 + Math.random() * 1.8 });
      }
      if (sparks.length > 160) sparks.splice(0, sparks.length - 160);
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[46] h-full w-full" />;
}
