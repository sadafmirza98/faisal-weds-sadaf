import { cn } from "@/lib/utils";

interface CandleProps {
  /** Height of the wax body in px. */
  height?: number;
  width?: number;
  className?: string;
  style?: React.CSSProperties;
  flickerDelay?: string;
}

/** A single enchanted candle: wax, drips, wick, flickering flame and halo. */
export function Candle({ height = 70, width = 14, className, style, flickerDelay = "0s" }: CandleProps) {
  return (
    <div className={cn("relative flex flex-col items-center", className)} style={style} aria-hidden>
      {/* Halo */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          top: -width * 3.2,
          width: width * 7,
          height: width * 7,
          background: "radial-gradient(circle, rgb(232 201 139 / 0.42) 0%, rgb(232 201 139 / 0.12) 38%, transparent 70%)",
        }}
      />
      {/* Flame */}
      <div className="relative" style={{ width: width * 0.9, height: width * 1.8 }}>
        <div
          className="animate-flicker absolute inset-0 origin-bottom"
          style={{
            animationDelay: flickerDelay,
            borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%",
            background: "radial-gradient(ellipse at 50% 72%, #fffbe8 0%, #ffe7a3 28%, #f2b54d 58%, rgb(214 120 40 / 0) 78%)",
            filter: "blur(0.4px)",
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{ bottom: width * 0.1, width: width * 0.28, height: width * 0.5, background: "rgb(120 150 255 / 0.55)", filter: "blur(1px)" }}
        />
      </div>
      {/* Wick */}
      <div style={{ width: 1.5, height: width * 0.3, background: "#2a1a0e" }} />
      {/* Wax */}
      <div
        className="relative"
        style={{
          width,
          height,
          borderRadius: `${width * 0.25}px ${width * 0.25}px 2px 2px`,
          background: "linear-gradient(90deg, #b9a37d 0%, #f3e7cd 30%, #fbf3e0 45%, #e4d3b0 70%, #9c8661 100%)",
          boxShadow: "inset 0 6px 8px -4px rgb(255 214 140 / 0.65)",
        }}
      >
        <div className="absolute left-[18%] top-0 rounded-b-full" style={{ width: width * 0.22, height: height * 0.22, background: "#efe2c4" }} />
        <div className="absolute right-[22%] top-0 rounded-b-full" style={{ width: width * 0.18, height: height * 0.12, background: "#efe2c4" }} />
      </div>
    </div>
  );
}
