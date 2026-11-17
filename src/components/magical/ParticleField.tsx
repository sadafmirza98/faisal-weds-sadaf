"use client";

import { useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ParticleFieldHandle {
  /** Dissolve a rectangle (viewport coordinates) into a burst of golden dust. */
  burst: (rect: { x: number; y: number; width: number; height: number }, count?: number) => void;
}

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  life: number; // seconds remaining (Infinity for ambient)
  maxLife: number;
  hue: 0 | 1;
}

interface ParticleFieldProps {
  /** Ambient motes per 100,000 px² of canvas. */
  density?: number;
  className?: string;
  /** Upward drift speed in px/s. */
  rise?: number;
  /** Render in a fixed full-viewport canvas (used for bursts). */
  fixed?: boolean;
  ref?: React.Ref<ParticleFieldHandle>;
}

const GOLD = ["232,201,139", "255,240,200"];

/**
 * Canvas of drifting golden motes. Pauses when off-screen or the tab is hidden,
 * caps device pixel ratio, and renders a still frame for reduced motion.
 */
export function ParticleField({ density = 6, className, rise = 8, fixed = false, ref }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motes = useRef<Mote[]>([]);
  const kick = useRef<() => void>(() => {});

  useImperativeHandle(ref, () => ({
    burst(rect, count = 260) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const box = canvas.getBoundingClientRect();
      for (let i = 0; i < count; i++) {
        const x = rect.x - box.left + Math.random() * rect.width;
        const y = rect.y - box.top + Math.random() * rect.height;
        const cx = rect.x - box.left + rect.width / 2;
        const cy = rect.y - box.top + rect.height / 2;
        const ang = Math.atan2(y - cy, x - cx) + (Math.random() - 0.5) * 0.8;
        const speed = 40 + Math.random() * 180;
        const life = 1.1 + Math.random() * 1.4;
        motes.current.push({
          x,
          y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed - 60,
          r: 0.8 + Math.random() * 2.4,
          phase: Math.random() * Math.PI * 2,
          life,
          maxLife: life,
          hue: Math.random() < 0.3 ? 1 : 0,
        });
      }
      kick.current();
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    let running = false;

    const seedAmbient = () => {
      const target = Math.round(((w * h) / 100000) * density);
      const ambient = motes.current.filter((m) => m.life === Infinity);
      const bursts = motes.current.filter((m) => m.life !== Infinity);
      while (ambient.length < target) {
        ambient.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 6,
          vy: -(rise * (0.4 + Math.random())),
          r: 0.5 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
          life: Infinity,
          maxLife: Infinity,
          hue: Math.random() < 0.25 ? 1 : 0,
        });
      }
      ambient.length = target;
      motes.current = [...ambient, ...bursts];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedAmbient();
      if (reduced) draw(0, 0);
    };

    const draw = (dt: number, t: number) => {
      ctx.clearRect(0, 0, w, h);
      const next: Mote[] = [];
      for (const m of motes.current) {
        if (m.life !== Infinity) {
          m.life -= dt;
          if (m.life <= 0) continue;
          m.vx *= 1 - 1.4 * dt;
          m.vy = m.vy * (1 - 1.4 * dt) - 22 * dt;
        }
        m.x += (m.vx + Math.sin(t * 0.6 + m.phase) * 4) * dt;
        m.y += m.vy * dt;
        if (m.life === Infinity) {
          if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w; }
          if (m.x < -10) m.x = w + 10;
          if (m.x > w + 10) m.x = -10;
        }
        const twinkle = 0.55 + 0.45 * Math.sin(t * 2 + m.phase * 3);
        const fade = m.life === Infinity ? 1 : Math.min(1, m.life / (m.maxLife * 0.6));
        const a = twinkle * fade;
        const c = GOLD[m.hue];
        ctx.beginPath();
        ctx.fillStyle = `rgba(${c},${0.12 * a})`;
        ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = `rgba(${c},${0.85 * a})`;
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
        next.push(m);
      }
      motes.current = next;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      draw(dt, now / 1000);
      const hasBursts = motes.current.some((m) => m.life !== Infinity);
      const ambient = density > 0 && visible && !document.hidden && !reduced;
      if (ambient || hasBursts) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    kick.current = start;

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduced && density > 0) start();
    });
    io.observe(canvas);
    const onVis = () => !document.hidden && !reduced && visible && density > 0 && start();
    document.addEventListener("visibilitychange", onVis);
    if (!reduced && density > 0) start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density, rise]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none", fixed ? "fixed inset-0 h-full w-full" : "absolute inset-0 h-full w-full", className)}
    />
  );
}
