// Illustrated placeholder banners — no photo upload/storage is wired up yet
// (Cloudflare R2 isn't connected), so real content gets one of these preset
// themed illustrations instead of a random unrelated stock photo.

export const BANNER_THEMES = [
  "blender",
  "unity",
  "shader",
  "rigging",
  "vfx",
  "team",
  "asset",
] as const;

export type BannerTheme = (typeof BANNER_THEMES)[number];

const GRADIENTS: Record<BannerTheme, string> = {
  blender:
    "linear-gradient(135deg, oklch(30% 0.05 300), oklch(20% 0.03 290))",
  unity: "linear-gradient(135deg, oklch(28% 0.05 240), oklch(18% 0.03 260))",
  shader:
    "linear-gradient(135deg, oklch(35% 0.08 165), oklch(22% 0.04 200))",
  rigging:
    "linear-gradient(135deg, oklch(32% 0.06 340), oklch(20% 0.03 300))",
  vfx: "linear-gradient(135deg, oklch(34% 0.08 55), oklch(20% 0.04 340))",
  team: "linear-gradient(135deg, oklch(30% 0.05 210), oklch(20% 0.03 165))",
  asset: "linear-gradient(135deg, oklch(30% 0.05 55), oklch(20% 0.03 300))",
};

function Scene({ theme }: { theme: BannerTheme }) {
  const stroke = "rgba(255,255,255,0.55)";
  const fill = "rgba(255,255,255,0.12)";

  switch (theme) {
    case "blender":
      // Low-poly wireframe icosphere, evoking a 3D viewport.
      return (
        <svg viewBox="0 0 200 120" className="h-full w-full">
          <polygon
            points="100,20 140,45 130,85 70,85 60,45"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <line x1="100" y1="20" x2="100" y2="60" stroke={stroke} strokeWidth="1" />
          <line x1="60" y1="45" x2="100" y2="60" stroke={stroke} strokeWidth="1" />
          <line x1="140" y1="45" x2="100" y2="60" stroke={stroke} strokeWidth="1" />
          <line x1="70" y1="85" x2="100" y2="60" stroke={stroke} strokeWidth="1" />
          <line x1="130" y1="85" x2="100" y2="60" stroke={stroke} strokeWidth="1" />
        </svg>
      );
    case "unity":
      // Code-editor style stacked lines.
      return (
        <svg viewBox="0 0 200 120" className="h-full w-full">
          {[
            [30, 30, 60],
            [30, 44, 100],
            [46, 58, 70],
            [30, 72, 90],
            [30, 86, 50],
          ].map(([x, y, w], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height="8"
              rx="4"
              fill={i % 2 === 0 ? "rgba(255,255,255,0.4)" : fill}
            />
          ))}
        </svg>
      );
    case "shader":
      // Glowing light source with rays.
      return (
        <svg viewBox="0 0 200 120" className="h-full w-full">
          <circle cx="100" cy="60" r="34" fill="rgba(255,255,255,0.10)" />
          <circle cx="100" cy="60" r="20" fill="rgba(255,255,255,0.22)" />
          <circle cx="100" cy="60" r="9" fill="rgba(255,255,255,0.5)" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1={100 + Math.cos((deg * Math.PI) / 180) * 44}
              y1={60 + Math.sin((deg * Math.PI) / 180) * 44}
              x2={100 + Math.cos((deg * Math.PI) / 180) * 56}
              y2={60 + Math.sin((deg * Math.PI) / 180) * 56}
              stroke={stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ))}
        </svg>
      );
    case "rigging":
      // Bone chain / skeleton joints.
      return (
        <svg viewBox="0 0 200 120" className="h-full w-full">
          <polyline
            points="50,95 75,60 105,70 135,35 155,25"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
          />
          {[
            [50, 95],
            [75, 60],
            [105, 70],
            [135, 35],
            [155, 25],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i === 0 ? 7 : 5} fill="rgba(255,255,255,0.5)" />
          ))}
        </svg>
      );
    case "vfx":
      // Scattered particles/sparks.
      return (
        <svg viewBox="0 0 200 120" className="h-full w-full">
          {[
            [40, 30, 3],
            [70, 20, 2],
            [100, 45, 4],
            [130, 25, 2],
            [160, 40, 3],
            [55, 70, 2],
            [90, 85, 3],
            [120, 75, 2],
            [150, 90, 4],
            [175, 65, 2],
          ].map(([cx, cy, r], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={i % 3 === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)"}
            />
          ))}
        </svg>
      );
    case "team":
      // Connected node graph, evoking collaboration.
      return (
        <svg viewBox="0 0 200 120" className="h-full w-full">
          <line x1="60" y1="40" x2="100" y2="75" stroke={stroke} strokeWidth="1.5" />
          <line x1="100" y1="75" x2="145" y2="40" stroke={stroke} strokeWidth="1.5" />
          <line x1="60" y1="40" x2="145" y2="40" stroke={stroke} strokeWidth="1.5" />
          <line x1="100" y1="75" x2="100" y2="95" stroke={stroke} strokeWidth="1.5" />
          {[
            [60, 40, 9],
            [145, 40, 9],
            [100, 75, 11],
            [100, 95, 6],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.45)" />
          ))}
        </svg>
      );
    case "asset":
    default:
      // Stacked boxes, evoking asset packs.
      return (
        <svg viewBox="0 0 200 120" className="h-full w-full">
          <rect x="45" y="55" width="45" height="35" rx="4" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="82" y="40" width="45" height="35" rx="4" fill="rgba(255,255,255,0.18)" stroke={stroke} strokeWidth="1.5" />
          <rect x="120" y="60" width="40" height="32" rx="4" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
  }
}

// Hashes `seed` into a hue-rotation so cards that share a theme (multiple
// assets both using the generic "asset" icon, say) still read as visually
// distinct in a grid — without needing a real per-item thumbnail image.
function hueRotationFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 360;
}

export function SceneBanner({
  theme,
  className = "",
  seed,
}: {
  theme: BannerTheme;
  className?: string;
  // Optional: give each instance of a shared theme a distinct tint.
  seed?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: GRADIENTS[theme],
        filter: seed ? `hue-rotate(${hueRotationFor(seed)}deg)` : undefined,
      }}
    >
      <div className="w-full max-w-[220px] p-3">
        <Scene theme={theme} />
      </div>
    </div>
  );
}
