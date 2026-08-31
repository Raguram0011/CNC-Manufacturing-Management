import { useEffect, useRef } from "react"

/* ── Gear path generator ─────────────────────────────────── */
function gearPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  teeth: number,
  boreR: number = 0
): string {
  const angle = (2 * Math.PI) / teeth
  const toothFrac = 0.44
  const pts: string[] = []

  for (let i = 0; i < teeth; i++) {
    const base = i * angle - Math.PI / 2
    const gap = (angle * (1 - toothFrac)) / 2
    const tw = angle * toothFrac
    const a0 = base
    const a1 = base + gap
    const a2 = base + gap + tw * 0.18
    const a3 = base + gap + tw * 0.82
    const a4 = base + gap + tw
    const a5 = base + angle - 0.001

    const p = (a: number, r: number) =>
      `${(cx + r * Math.cos(a)).toFixed(3)} ${(cy + r * Math.sin(a)).toFixed(3)}`

    if (i === 0) pts.push(`M ${p(a0, innerR)}`)
    pts.push(
      `A ${innerR} ${innerR} 0 0 1 ${p(a1, innerR)}`,
      `L ${p(a2, outerR)}`,
      `L ${p(a3, outerR)}`,
      `L ${p(a4, innerR)}`,
      `A ${innerR} ${innerR} 0 0 1 ${p(a5, innerR)}`
    )
  }
  pts.push("Z")

  /* Bore hole — clockwise winding = subtraction */
  if (boreR > 0) {
    const bx = (cx + boreR).toFixed(3)
    const by = cy.toFixed(3)
    const bx2 = (cx - boreR).toFixed(3)
    pts.push(
      `M ${bx} ${by}`,
      `A ${boreR} ${boreR} 0 1 0 ${bx2} ${by}`,
      `A ${boreR} ${boreR} 0 1 0 ${bx} ${by}`,
      "Z"
    )
  }
  return pts.join(" ")
}

/* ── Bolt holes on pitch circle ──────────────────────────── */
function boltHolePaths(cx: number, cy: number, pitchR: number, count: number, r: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * 2 * Math.PI - Math.PI / 2
    const bx = cx + pitchR * Math.cos(a)
    const by = cy + pitchR * Math.sin(a)
    return `M ${(bx + r).toFixed(2)} ${by.toFixed(2)} A ${r} ${r} 0 1 0 ${(bx - r).toFixed(2)} ${by.toFixed(2)} A ${r} ${r} 0 1 0 ${(bx + r).toFixed(2)} ${by.toFixed(2)} Z`
  })
}

/* ── Dimension line component ────────────────────────────── */
function DimLine({
  x1, y1, x2, y2, label, labelX, labelY, orient = "h",
}: {
  x1: number; y1: number; x2: number; y2: number
  label: string; labelX: number; labelY: number; orient?: "h" | "v"
}) {
  const CYAN = "rgba(6,182,212,0.45)"
  const ext = 8
  return (
    <g stroke={CYAN} strokeWidth={0.6} fill="none">
      {/* Extension lines */}
      {orient === "h" ? (
        <>
          <line x1={x1} y1={y1 - ext} x2={x1} y2={y1 + ext} />
          <line x1={x2} y1={y2 - ext} x2={x2} y2={y2 + ext} />
        </>
      ) : (
        <>
          <line x1={x1 - ext} y1={y1} x2={x1 + ext} y2={y1} />
          <line x1={x2 - ext} y1={y2} x2={x2 + ext} y2={y2} />
        </>
      )}
      {/* Main dimension line with arrowheads */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      {/* Left arrow */}
      {orient === "h" ? (
        <>
          <polygon points={`${x1},${y1} ${x1 + 5},${y1 - 2.5} ${x1 + 5},${y1 + 2.5}`} fill={CYAN} stroke="none" />
          <polygon points={`${x2},${y2} ${x2 - 5},${y2 - 2.5} ${x2 - 5},${y2 + 2.5}`} fill={CYAN} stroke="none" />
        </>
      ) : (
        <>
          <polygon points={`${x1},${y1} ${x1 - 2.5},${y1 + 5} ${x1 + 2.5},${y1 + 5}`} fill={CYAN} stroke="none" />
          <polygon points={`${x2},${y2} ${x2 - 2.5},${y2 - 5} ${x2 + 2.5},${y2 - 5}`} fill={CYAN} stroke="none" />
        </>
      )}
      <text
        x={labelX}
        y={labelY}
        fontSize={9}
        fontFamily="var(--font-mono)"
        fill={CYAN}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label}
      </text>
    </g>
  )
}

/* ── Main illustration ───────────────────────────────────── */
export function IndustrialSVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const scanRef = useRef<SVGLineElement>(null)
  const rafRef = useRef<number>(0)
  const yRef = useRef(0)

  useEffect(() => {
    const HEIGHT = 700
    const SPEED = 0.35
    const animate = () => {
      yRef.current = (yRef.current + SPEED) % HEIGHT
      if (scanRef.current) {
        scanRef.current.setAttribute("y1", String(yRef.current))
        scanRef.current.setAttribute("y2", String(yRef.current))
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* Gear definitions */
  const CX = 300
  const CY = 350
  const G1_outer = 148
  const G1_inner = 128
  const G1_bore  = 28
  const G1_teeth = 24

  /* Satellite gear 1 — bottom-right */
  const dist12 = G1_outer + 62 + 6
  const G2_outer = 62
  const G2_inner = 52
  const G2_bore  = 12
  const G2_teeth = 10
  const A2 = Math.PI * 0.2
  const G2X = CX + dist12 * Math.cos(A2)
  const G2Y = CY + dist12 * Math.sin(A2)

  /* Satellite gear 2 — upper-left */
  const dist13 = G1_outer + 44 + 6
  const G3_outer = 44
  const G3_inner = 36
  const G3_bore  = 9
  const G3_teeth = 7
  const A3 = Math.PI * 1.3
  const G3X = CX + dist13 * Math.cos(A3)
  const G3Y = CY + dist13 * Math.sin(A3)

  const GEAR_FILL   = "#0f1623"
  const GEAR_STROKE = "#1e2d4d"
  const GEAR_HL     = "rgba(37,99,235,0.10)"
  const GRID_COLOR  = "rgba(255,255,255,0.035)"
  const BLUE        = "rgba(37,99,235,0.55)"
  const CYAN_TEXT   = "rgba(6,182,212,0.5)"
  const BLUE_DIM    = "rgba(6,182,212,0.4)"

  const bolt1 = boltHolePaths(CX, CY, 90, 6, 5.5)

  return (
    <svg
      viewBox="0 0 600 700"
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
      aria-hidden="true"
    >
      <defs>
        {/* Blueprint grid pattern */}
        <pattern id="grid" width={30} height={30} patternUnits="userSpaceOnUse">
          <path d={`M 30 0 L 0 0 0 30`} stroke={GRID_COLOR} strokeWidth={0.5} fill="none" />
        </pattern>
        {/* Radial glow for main gear */}
        <radialGradient id="gearGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2563eb" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
        </radialGradient>
        {/* Scan line gradient */}
        <linearGradient id="scanGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563eb" stopOpacity={0} />
          <stop offset="15%" stopColor="#2563eb" stopOpacity={0.6} />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.9} />
          <stop offset="85%" stopColor="#2563eb" stopOpacity={0.6} />
          <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
        </linearGradient>
        {/* Clip to svg bounds */}
        <clipPath id="svgClip">
          <rect width={600} height={700} />
        </clipPath>
        {/* Gear clip (for highlight arc) */}
        <clipPath id="g1Clip">
          <circle cx={CX} cy={CY} r={G1_outer} />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width={600} height={700} fill="#090d15" />

      {/* Blueprint grid */}
      <rect width={600} height={700} fill="url(#grid)" />

      {/* Subtle corner accent dots */}
      {[0, 1, 2, 3, 4].map((i) =>
        [0, 1, 2, 3, 4].map((j) => (
          <circle
            key={`${i}-${j}`}
            cx={i * 150}
            cy={j * 175}
            r={1.2}
            fill="rgba(37,99,235,0.2)"
          />
        ))
      )}

      {/* ── Gear 1 — main (rotating CW) ─────── */}
      <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: "gear-spin-slow 20s linear infinite" }}>
        {/* Glow */}
        <circle cx={CX} cy={CY} r={G1_outer} fill="url(#gearGlow)" />
        {/* Gear body */}
        <path
          d={gearPath(CX, CY, G1_outer, G1_inner, G1_teeth, G1_bore)}
          fill={GEAR_FILL}
          stroke={GEAR_STROKE}
          strokeWidth={1}
          fillRule="evenodd"
        />
        {/* Bolt holes */}
        {bolt1.map((d, i) => (
          <path key={i} d={d} fill="#090d15" stroke={GEAR_STROKE} strokeWidth={0.8} />
        ))}
        {/* Inner hub ring */}
        <circle cx={CX} cy={CY} r={G1_inner * 0.55} fill="none" stroke={GEAR_STROKE} strokeWidth={0.8} />
        {/* Keyway slot */}
        <rect
          x={CX - 6}
          y={CY - G1_bore - 18}
          width={12}
          height={20}
          fill="#090d15"
          stroke={GEAR_STROKE}
          strokeWidth={0.8}
          rx={2}
        />
        {/* Top highlight arc */}
        <path
          d={`M ${CX - G1_inner} ${CY} A ${G1_inner} ${G1_inner} 0 0 1 ${CX + G1_inner} ${CY}`}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={G1_inner * 0.2}
          clipPath="url(#g1Clip)"
        />
      </g>

      {/* ── Gear 2 — satellite, counter-rotating ── */}
      <g style={{ transformOrigin: `${G2X.toFixed(1)}px ${G2Y.toFixed(1)}px`, animation: "gear-spin 8s linear infinite reverse" }}>
        <path
          d={gearPath(G2X, G2Y, G2_outer, G2_inner, G2_teeth, G2_bore)}
          fill={GEAR_FILL}
          stroke={GEAR_STROKE}
          strokeWidth={0.8}
          fillRule="evenodd"
        />
        <circle cx={G2X} cy={G2Y} r={G2_inner * 0.45} fill="none" stroke={GEAR_STROKE} strokeWidth={0.6} />
      </g>

      {/* ── Gear 3 — satellite, co-rotating ───── */}
      <g style={{ transformOrigin: `${G3X.toFixed(1)}px ${G3Y.toFixed(1)}px`, animation: "gear-spin 5s linear infinite" }}>
        <path
          d={gearPath(G3X, G3Y, G3_outer, G3_inner, G3_teeth, G3_bore)}
          fill={GEAR_FILL}
          stroke={GEAR_STROKE}
          strokeWidth={0.7}
          fillRule="evenodd"
        />
        <circle cx={G3X} cy={G3Y} r={G3_inner * 0.4} fill="none" stroke={GEAR_STROKE} strokeWidth={0.5} />
      </g>

      {/* ── Center hub detail ─────────────────── */}
      <circle cx={CX} cy={CY} r={G1_bore + 2} fill="#0f1623" stroke={GEAR_STROKE} strokeWidth={0.8} />
      <circle cx={CX} cy={CY} r={3} fill={BLUE} />

      {/* ── Pitch circle annotation ───────────── */}
      <circle
        cx={CX} cy={CY} r={G1_inner - 10}
        fill="none"
        stroke="rgba(6,182,212,0.12)"
        strokeWidth={0.8}
        strokeDasharray="4 6"
      />

      {/* ── Dimension lines ───────────────────── */}
      <DimLine
        x1={CX - G1_outer} y1={CY + 200}
        x2={CX + G1_outer} y2={CY + 200}
        label="⌀ 296.00 mm"
        labelX={CX} labelY={CY + 218}
        orient="h"
      />
      <DimLine
        x1={CX + G1_outer + 40} y1={CY - G1_inner}
        x2={CX + G1_outer + 40} y2={CY + G1_inner}
        label="256.00"
        labelX={CX + G1_outer + 64} labelY={CY}
        orient="v"
      />

      {/* ── Center crosshair ──────────────────── */}
      <g stroke={BLUE_DIM} strokeWidth={0.7} fill="none">
        <line x1={CX - 200} y1={CY} x2={CX + 200} y2={CY} />
        <line x1={CX} y1={CY - 200} x2={CX} y2={CY + 200} />
        <circle cx={CX} cy={CY} r={20} />
        <circle cx={CX} cy={CY} r={40} strokeDasharray="3 5" />
        {/* Crosshair tick marks */}
        {[60, 80, 100, 120, 140, 160, 180].map((r) => (
          <line key={r} x1={CX} y1={CY - r} x2={CX} y2={CY - r - 4} />
        ))}
      </g>

      {/* ── XYZ Coordinate indicator (bottom-left) */}
      <g transform="translate(54, 580)">
        <text x={0} y={-24} fontSize={8} fontFamily="var(--font-mono)" fill={CYAN_TEXT} letterSpacing={1}>COORD SYS</text>
        {/* Z axis */}
        <line x1={0} y1={0} x2={0} y2={-36} stroke="rgba(6,182,212,0.7)" strokeWidth={1.2} />
        <polygon points="0,-42 -2.5,-36 2.5,-36" fill="rgba(6,182,212,0.7)" />
        <text x={4} y={-38} fontSize={8} fontFamily="var(--font-mono)" fill="rgba(6,182,212,0.7)">Z</text>
        {/* X axis */}
        <line x1={0} y1={0} x2={36} y2={0} stroke="rgba(37,99,235,0.7)" strokeWidth={1.2} />
        <polygon points="42,0 36,-2.5 36,2.5" fill="rgba(37,99,235,0.7)" />
        <text x={44} y={4} fontSize={8} fontFamily="var(--font-mono)" fill="rgba(37,99,235,0.7)">X</text>
        {/* Y axis */}
        <line x1={0} y1={0} x2={-22} y2={22} stroke="rgba(16,185,129,0.7)" strokeWidth={1.2} />
        <polygon points={`${-28},${28} ${-24},${20} ${-20},${24}`} fill="rgba(16,185,129,0.7)" />
        <text x={-36} y={34} fontSize={8} fontFamily="var(--font-mono)" fill="rgba(16,185,129,0.7)">Y</text>
        {/* Origin */}
        <circle cx={0} cy={0} r={2.5} fill="#090d15" stroke="rgba(255,255,255,0.2)" strokeWidth={0.8} />
      </g>

      {/* ── G-code data overlay (upper-left) ───── */}
      <g fill={CYAN_TEXT} fontFamily="var(--font-mono)" fontSize={8} letterSpacing={0.5}>
        <text x={28} y={48}>% O0010 (FLANGE-AL6061-OP10)</text>
        <text x={28} y={60}>N10 G90 G94 G17</text>
        <text x={28} y={72}>N20 T01 M06</text>
        <text x={28} y={84} fill="rgba(37,99,235,0.5)">N30 G0 X0. Y0. Z50.</text>
        <text x={28} y={96}>N40 S4200 M03</text>
        <text x={28} y={108}>N50 G43 H01 Z5.</text>
        <text x={28} y={120} fill="rgba(37,99,235,0.5)">N60 G01 Z-2. F800</text>
        <text x={28} y={132}>…</text>
      </g>

      {/* ── Machine readout (upper-right) ────── */}
      <g fill={CYAN_TEXT} fontFamily="var(--font-mono)" fontSize={8} letterSpacing={0.4} textAnchor="end">
        <text x={572} y={48}>SPINDLE: 4200 RPM</text>
        <text x={572} y={60}>FEED:    800 mm/min</text>
        <text x={572} y={72}>X: +042.500</text>
        <text x={572} y={84}>Y: -018.300</text>
        <text x={572} y={96}>Z: +005.000</text>
        <text x={572} y={108} fill="rgba(16,185,129,0.5)">STATUS: RUN ●</text>
      </g>

      {/* ── Bottom annotation bar ─────────────── */}
      <g fill="rgba(255,255,255,0.06)" fontFamily="var(--font-mono)" fontSize={7.5}>
        <rect x={0} y={672} width={600} height={28} />
        <text x={16} y={689} fill={CYAN_TEXT}>ACME CNC MFG — INTERNAL SYSTEM — AUTHORIZED ACCESS ONLY</text>
        <text x={572} y={689} fill={CYAN_TEXT} textAnchor="end">REV 2.0.0</text>
      </g>

      {/* ── Scanning line (animated by JS) ────── */}
      <g clipPath="url(#svgClip)">
        <line
          ref={scanRef}
          x1={0} y1={0} x2={600} y2={0}
          stroke="url(#scanGrad)"
          strokeWidth={1.5}
          opacity={0.8}
        />
        {/* Trailing glow */}
        <line
          ref={scanRef as React.RefObject<SVGLineElement>}
          x1={0} y1={2} x2={600} y2={2}
          stroke="url(#scanGrad)"
          strokeWidth={6}
          opacity={0.12}
        />
      </g>

      {/* ── Precision circle target (top-right) ── */}
      <g stroke="rgba(37,99,235,0.3)" strokeWidth={0.6} fill="none" transform="translate(548, 560)">
        <circle r={32} />
        <circle r={20} />
        <circle r={8} />
        <line x1={-38} y1={0} x2={38} y2={0} />
        <line x1={0} y1={-38} x2={0} y2={38} />
        <circle r={1.5} fill="rgba(6,182,212,0.6)" stroke="none" />
      </g>
    </svg>
  )
}
