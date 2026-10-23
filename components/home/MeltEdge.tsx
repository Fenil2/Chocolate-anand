"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/format";

/**
 * "The Art of the Melt" — a band of ganache with drips that pour on first view
 * and keep stretching as the page scrolls. Drips are real paths (not scaled boxes),
 * so their rounded tips stay round at every length.
 */

const W = 1440;
const H = 320;
const BAND = 84; // y of the band's lower edge
const TOP = BAND - 8; // drips start inside the band so the join is seamless

type DripSpec = { x: number; w: number; r: number; len: number; delay: number };

// Deterministic (no Math.random) to avoid hydration mismatches. Denser in the middle third for small screens.
const DRIPS: DripSpec[] = [
  { x: 58, w: 26, r: 9, len: 168, delay: 0.35 },
  { x: 168, w: 18, r: 7, len: 128, delay: 0.7 },
  { x: 252, w: 34, r: 12, len: 232, delay: 0.15 },
  { x: 378, w: 22, r: 8, len: 150, delay: 0.55 },
  { x: 470, w: 30, r: 11, len: 262, delay: 0.05 },
  { x: 560, w: 16, r: 6, len: 120, delay: 0.8 },
  { x: 642, w: 40, r: 14, len: 292, delay: 0.25 },
  { x: 736, w: 20, r: 7, len: 172, delay: 0.6 },
  { x: 822, w: 28, r: 10, len: 244, delay: 0.1 },
  { x: 914, w: 18, r: 7, len: 140, delay: 0.75 },
  { x: 1002, w: 36, r: 13, len: 278, delay: 0.3 },
  { x: 1094, w: 22, r: 8, len: 158, delay: 0.5 },
  { x: 1182, w: 30, r: 11, len: 218, delay: 0.2 },
  { x: 1290, w: 18, r: 7, len: 132, delay: 0.65 },
  { x: 1382, w: 26, r: 9, len: 190, delay: 0.4 },
];

const f = (n: number) => n.toFixed(1);

function dripPath(x: number, w: number, r: number, bottom: number) {
  const span = bottom - TOP;
  return [
    `M${f(x - w)},${TOP}`,
    `C${f(x - w * 0.4)},${f(TOP + span * 0.32)} ${f(x - r)},${f(TOP + span * 0.5)} ${f(x - r)},${f(bottom - r)}`,
    `A${r},${r} 0 0 0 ${f(x + r)},${f(bottom - r)}`,
    `C${f(x + r)},${f(TOP + span * 0.5)} ${f(x + w * 0.4)},${f(TOP + span * 0.32)} ${f(x + w)},${TOP}`,
    "Z",
  ].join(" ");
}

// Softly undulating lower edge of the ganache band
const WAVE = [0, 7, -3, 9, -2, 6, -5, 8, -1, 5, -4, 7, -2, 9, -3, 6, 0];
const wavePoints = WAVE.map((dy, i) => ({ x: (W / (WAVE.length - 1)) * i, y: BAND + dy }));

function smoothEdge(points: { x: number; y: number }[]) {
  const step = points.length > 1 ? (points[1].x - points[0].x) / 2 : 0;
  return points
    .map((p, i) => (i === 0 ? `M${f(p.x)},${p.y}` : `S${f(p.x - step)},${p.y + 4} ${f(p.x)},${p.y}`))
    .join(" ");
}

const bandEdge = smoothEdge(wavePoints);
const reversed = [...wavePoints].reverse();
const bandPath = `M0,0 L${W},0 L${W},${reversed[0].y} ${smoothEdge(reversed).replace(/^M[^ ]+ /, "")} Z`;

type DripProps = {
  spec: DripSpec;
  active: boolean;
  reduce: boolean;
  stretch: MotionValue<number>;
  gradId: string;
  glossId: string;
};

function Drip({ spec, active, reduce, stretch, gradId, glossId }: DripProps) {
  const { x, w, r, len, delay } = spec;
  const start = TOP + r * 2 + 6;
  const progress = useMotionValue(0);

  useEffect(() => {
    if (reduce) {
      progress.set(1);
      return;
    }
    if (!active) return;
    const controls = animate(progress, 1, { duration: 2.6, delay: 0.9 + delay, ease: [0.33, 0, 0.12, 1] });
    return () => controls.stop();
  }, [active, reduce, progress, delay]);

  const bottom = useTransform([progress, stretch], ([p, s]: number[]) => {
    const target = TOP + (len - TOP) * (1 + s * (0.35 + (len / 300) * 0.4));
    return Math.min(H - 2, start + (target - start) * p);
  });
  const d = useTransform(bottom, (b) => dripPath(x, w, r, b));
  const hy = useTransform(bottom, (b) => b - r * 1.15);

  return (
    <g>
      <motion.path d={d} fill={`url(#${gradId})`} />
      <motion.ellipse cx={x - r * 0.38} cy={hy} rx={r * 0.26} ry={r * 0.42} fill={`url(#${glossId})`} />
    </g>
  );
}

type MeltEdgeProps = {
  className?: string;
  /** Fade the top of the band into whatever sits above (for photos). */
  fadeTop?: boolean;
  /** Start pouring immediately on mount instead of when scrolled into view. */
  pourOnMount?: boolean;
};

export function MeltEdge({ className, fadeTop = false, pourOnMount = false }: MeltEdgeProps) {
  const uid = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduce = useReducedMotion() ?? false;
  const active = pourOnMount || inView;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const stretch = useTransform(scrollYProgress, [0.45, 1], [0, 1], { clamp: true });
  const staticStretch = useMotionValue(0);

  const ids = {
    body: `melt-body-${uid}`,
    drip: `melt-drip-${uid}`,
    gloss: `melt-gloss-${uid}`,
    fade: `melt-fade-${uid}`,
    sheen: `melt-sheen-${uid}`,
    clip: `melt-clip-${uid}`,
    blur: `melt-blur-${uid}`,
  };

  return (
    <div ref={ref} className={cn("pointer-events-none", className)} aria-hidden>
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMin slice"
      // lg+: height follows the viewBox ratio (320/1440 ≈ 22.3vw) so long drips are never cropped flat on wide screens
      className="block h-[clamp(150px,20vw,360px)] w-full lg:h-[22.3vw]"
      focusable="false"
    >
      <defs>
        <linearGradient id={ids.body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a2516" />
          <stop offset="0.55" stopColor="#35180f" />
          <stop offset="1" stopColor="#241009" />
        </linearGradient>
        {/* Horizontal shading gives each drip a rounded, glossy volume */}
        <linearGradient id={ids.drip} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#170905" />
          <stop offset="0.22" stopColor="#5b2f1c" />
          <stop offset="0.36" stopColor="#7a4429" />
          <stop offset="0.5" stopColor="#3b1b10" />
          <stop offset="1" stopColor="#120704" />
        </linearGradient>
        <radialGradient id={ids.gloss}>
          <stop offset="0" stopColor="#f4ebdd" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f4ebdd" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.fade} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="52">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${ids.fade}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect x="0" y="0" width={W} height={H} fill={`url(#${ids.fade})`} />
        </mask>
        <linearGradient id={ids.sheen} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f4ebdd" stopOpacity="0" />
          <stop offset="0.5" stopColor="#f0c99a" stopOpacity="0.22" />
          <stop offset="1" stopColor="#f4ebdd" stopOpacity="0" />
        </linearGradient>
        <clipPath id={ids.clip}>
          <path d={bandPath} />
        </clipPath>
        <filter id={ids.blur} x="-5%" y="-50%" width="110%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      {DRIPS.map((spec) => (
        <Drip
          key={spec.x}
          spec={spec}
          active={active}
          reduce={reduce}
          stretch={reduce ? staticStretch : stretch}
          gradId={ids.drip}
          glossId={ids.gloss}
        />
      ))}

      <path d={bandPath} fill={`url(#${ids.body})`} mask={fadeTop ? `url(#${ids.fade}-mask)` : undefined} />

      {/* Light catching the rim of the pour */}
      <path d={bandEdge} transform="translate(0,-7)" fill="none" stroke="#e9c79f" strokeOpacity="0.22" strokeWidth="2.2" filter={`url(#${ids.blur})`} />

      {/* Rendered unconditionally (hydration-safe); hidden by CSS for reduced motion */}
      <g clipPath={`url(#${ids.clip})`} className="motion-reduce:hidden">
          <motion.rect
            y="0"
            width="420"
            height={BAND + 12}
            fill={`url(#${ids.sheen})`}
            initial={{ x: -480 }}
            animate={{ x: W + 60 }}
            transition={{ duration: 3.2, delay: 2.2, ease: "easeInOut", repeat: 2, repeatDelay: 7 }}
          />
        </g>
    </svg>
    </div>
  );
}
