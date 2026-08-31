import { type ReactNode } from "react"

type SectionId = "overview" | "colors" | "typography" | "spacing"

interface Props {
  active: string
}

/* ── Shared layout helpers ───────────────────────────────── */
function SectionHeading({ overline, title, desc }: { overline: string; title: string; desc: string }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div
        style={{
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: 8,
        }}
      >
        {overline}
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          color: "var(--text-primary)",
          margin: "0 0 12px",
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, maxWidth: 560, lineHeight: 1.6 }}>
        {desc}
      </p>
    </div>
  )
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 20,
        letterSpacing: "0.01em",
        color: "var(--text-primary)",
        margin: "0 0 20px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </h2>
  )
}

function Block({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      {title && <SubHeading>{title}</SubHeading>}
      {children}
    </div>
  )
}

/* ── Color token swatch ──────────────────────────────────── */
function ColorSwatch({
  name,
  value,
  hex,
  dark = false,
}: {
  name: string
  value: string
  hex: string
  dark?: boolean
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 100 }}>
      <div
        style={{
          height: 64,
          background: value,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-sm)",
        }}
      />
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.04em",
          }}
        >
          {hex}
        </div>
      </div>
    </div>
  )
}

function ColorRow({ label, swatches }: { label: string; swatches: Array<{ name: string; value: string; hex: string }> }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {swatches.map((s) => (
          <ColorSwatch key={s.name} {...s} />
        ))}
      </div>
    </div>
  )
}

function SemanticCard({ label, color, bg, border, tokens }: {
  label: string; color: string; bg: string; border: string; tokens: string[]
}) {
  return (
    <div
      style={{
        padding: "16px",
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />
        <span style={{ fontSize: 13, fontWeight: 600, color, fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {tokens.map((t) => (
          <code
            key={t}
            style={{
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {t}
          </code>
        ))}
      </div>
    </div>
  )
}

/* ── Overview ────────────────────────────────────────────── */
function OverviewSection() {
  const principles = [
    {
      icon: "◈",
      title: "Precision",
      desc: "Every pixel deliberate. Spacing, sizing, and alignment derived from an 8pt grid.",
    },
    {
      icon: "◉",
      title: "Hierarchy",
      desc: "Information organized by role — KPIs, status, actions, and data each occupy their own visual tier.",
    },
    {
      icon: "◫",
      title: "Consistency",
      desc: "Shared tokens for color, type, radius, and shadow ensure the system reads as one product.",
    },
    {
      icon: "◧",
      title: "Accessibility",
      desc: "AA contrast on all interactive text, clear focus states, and semantic color application.",
    },
    {
      icon: "◪",
      title: "Data-first",
      desc: "Dense tables, KPI cards, and charts designed for scan speed at high information density.",
    },
    {
      icon: "◬",
      title: "Industrial",
      desc: "Dark neutral ground, metallic borders, and controlled blue accents communicate engineering precision.",
    },
  ]

  return (
    <div>
      <SectionHeading
        overline="CNC Manufacturing Management System"
        title="Design System"
        desc="A complete token-driven design language for internal manufacturing operations. Every component is production-ready, accessible, and built for high-density enterprise data."
      />

      {/* System stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1,
          background: "var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginBottom: 48,
          border: "1px solid var(--border-default)",
        }}
      >
        {[
          { label: "Color Tokens", value: "42" },
          { label: "Components", value: "28+" },
          { label: "Typography Styles", value: "12" },
          { label: "Spacing Steps", value: "16" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg-elevated)",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 28,
                fontWeight: 600,
                color: "var(--primary)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.04em",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Principles */}
      <div style={{ marginBottom: 48 }}>
        <SubHeading>Design Principles</SubHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {principles.map((p) => (
            <div
              key={p.title}
              style={{
                padding: "20px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  color: "var(--accent)",
                  marginBottom: 10,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {p.icon}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 6,
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.02em",
                }}
              >
                {p.title}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font preview */}
      <div style={{ marginBottom: 48 }}>
        <SubHeading>Type Stack</SubHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { family: "Barlow Condensed", role: "Display / Headers", sample: "PRECISION\nMANUFACTURING" },
            { family: "Inter", role: "Body / UI Text", sample: "System operational.\nAll lines nominal." },
            { family: "JetBrains Mono", role: "Data / Code / KPI", sample: "G0 X42.500 Y-18.3\n#REF: OP-20240813" },
          ].map((f) => (
            <div
              key={f.family}
              style={{
                padding: "20px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                {f.role}
              </div>
              <div
                style={{
                  fontFamily: f.family,
                  fontSize: f.family === "Barlow Condensed" ? 22 : 15,
                  fontWeight: f.family === "Barlow Condensed" ? 700 : 400,
                  color: "var(--text-primary)",
                  lineHeight: 1.3,
                  whiteSpace: "pre-line",
                  letterSpacing: f.family === "Barlow Condensed" ? "0.04em" : 0,
                  marginBottom: 12,
                }}
              >
                {f.sample}
              </div>
              <code
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent)",
                  letterSpacing: "0.02em",
                }}
              >
                {f.family}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Colors section ──────────────────────────────────────── */
function ColorsSection() {
  return (
    <div>
      <SectionHeading
        overline="Foundation / Colors"
        title="Color System"
        desc="Semantic tokens derived from a deep navy base. Colors are role-based — never arbitrary. Use the token name, not the hex."
      />

      <Block title="Brand & Interactive">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          <ColorSwatch name="Primary" value="#2563eb" hex="#2563EB" />
          <ColorSwatch name="Primary Hover" value="#1d4ed8" hex="#1D4ED8" />
          <ColorSwatch name="Primary Active" value="#1e40af" hex="#1E40AF" />
          <ColorSwatch name="Primary Subtle" value="rgba(37,99,235,0.12)" hex="rgba(37,99,235,0.12)" />
          <ColorSwatch name="Accent Cyan" value="#06b6d4" hex="#06B6D4" />
          <ColorSwatch name="Accent Subtle" value="rgba(6,182,212,0.12)" hex="rgba(6,182,212,0.12)" />
        </div>
      </Block>

      <Block title="Semantic Colors">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <SemanticCard
            label="Success"
            color="var(--success)"
            bg="var(--success-bg)"
            border="var(--success-border)"
            tokens={["--success: #10b981", "--success-bg", "--success-border"]}
          />
          <SemanticCard
            label="Warning"
            color="var(--warning)"
            bg="var(--warning-bg)"
            border="var(--warning-border)"
            tokens={["--warning: #f59e0b", "--warning-bg", "--warning-border"]}
          />
          <SemanticCard
            label="Error"
            color="var(--error)"
            bg="var(--error-bg)"
            border="var(--error-border)"
            tokens={["--error: #ef4444", "--error-bg", "--error-border"]}
          />
          <SemanticCard
            label="Info"
            color="var(--info)"
            bg="var(--info-bg)"
            border="var(--info-border)"
            tokens={["--info: #3b82f6", "--info-bg", "--info-border"]}
          />
        </div>
      </Block>

      <Block title="Backgrounds & Surfaces">
        <ColorRow
          label="Surface scale — dark to light"
          swatches={[
            { name: "Base", value: "#090d15", hex: "#090D15" },
            { name: "Surface", value: "#0f1623", hex: "#0F1623" },
            { name: "Elevated", value: "#141d2e", hex: "#141D2E" },
            { name: "Raised", value: "#1a2540", hex: "#1A2540" },
            { name: "Overlay", value: "#1e2d4d", hex: "#1E2D4D" },
          ]}
        />
      </Block>

      <Block title="Text Colors">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Primary text", color: "var(--text-primary)", hex: "#E2E8F0", note: "Main body, headings" },
            { label: "Secondary text", color: "var(--text-secondary)", hex: "#94A3B8", note: "Labels, subheadings" },
            { label: "Muted text", color: "var(--text-muted)", hex: "#4B5A72", note: "Captions, placeholders" },
            { label: "Disabled text", color: "var(--text-disabled)", hex: "#2E3D55", note: "Disabled states" },
          ].map((t) => (
            <div
              key={t.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 16px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: t.color, border: "1px solid var(--border-subtle)" }} />
              <span style={{ fontWeight: 500, fontSize: 13, color: t.color, flex: 1 }}>{t.label} — The quick brown fox</span>
              <code style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{t.hex}</code>
              <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 160 }}>{t.note}</span>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Border Tokens">
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { name: "Subtle", value: "rgba(255,255,255,0.06)", desc: "Section dividers" },
            { name: "Default", value: "rgba(255,255,255,0.09)", desc: "Card borders" },
            { name: "Strong", value: "rgba(255,255,255,0.15)", desc: "Emphasized borders" },
            { name: "Focus", value: "#2563eb", desc: "Focus rings" },
          ].map((b) => (
            <div
              key={b.name}
              style={{
                flex: "1 1 140px",
                padding: 16,
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${b.value}`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>{b.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>{b.desc}</div>
              <code style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>--border-{b.name.toLowerCase()}</code>
            </div>
          ))}
        </div>
      </Block>
    </div>
  )
}

/* ── Typography section ──────────────────────────────────── */
function TypographySection() {
  const styles = [
    { name: "Display XL", family: "var(--font-display)", weight: 700, size: "56px", lh: 1.0, ls: "-0.01em", sample: "PRECISION MANUFACTURING", transform: "uppercase" as const },
    { name: "Display", family: "var(--font-display)", weight: 700, size: "40px", lh: 1.1, ls: "-0.005em", sample: "CNC Operations Dashboard", transform: "none" as const },
    { name: "H1", family: "var(--font-display)", weight: 600, size: "32px", lh: 1.15, ls: "0", sample: "Machine Status Overview", transform: "none" as const },
    { name: "H2", family: "var(--font-display)", weight: 600, size: "24px", lh: 1.2, ls: "0.01em", sample: "Production Line Analysis", transform: "none" as const },
    { name: "H3", family: "var(--font-sans)", weight: 600, size: "18px", lh: 1.3, ls: "0.01em", sample: "Work Order #WO-20240813-042", transform: "none" as const },
    { name: "H4", family: "var(--font-sans)", weight: 500, size: "16px", lh: 1.4, ls: "0.01em", sample: "Spindle speed: 4200 RPM", transform: "none" as const },
    { name: "Body", family: "var(--font-body)", weight: 400, size: "14px", lh: 1.6, ls: "0", sample: "All systems nominal. Coolant flow at 98.4% capacity. Next scheduled maintenance in 72 hours.", transform: "none" as const },
    { name: "Body Small", family: "var(--font-body)", weight: 400, size: "13px", lh: 1.5, ls: "0", sample: "Material: 6061-T6 Aluminum. Tolerance: ±0.002 in. Surface finish: 63 Ra.", transform: "none" as const },
    { name: "Caption", family: "var(--font-body)", weight: 400, size: "11px", lh: 1.4, ls: "0.02em", sample: "Last updated: Aug 13, 2026 — 14:32:07 UTC", transform: "none" as const },
    { name: "Label / UI", family: "var(--font-body)", weight: 500, size: "12px", lh: 1, ls: "0.06em", sample: "MACHINE STATUS", transform: "uppercase" as const },
    { name: "Mono / Data", family: "var(--font-mono)", weight: 500, size: "13px", lh: 1.5, ls: "0.02em", sample: "G0 X42.500 Y-18.300 Z5.000 F3500", transform: "none" as const },
    { name: "Mono Caption", family: "var(--font-mono)", weight: 400, size: "11px", lh: 1.4, ls: "0.04em", sample: "REF: MFG-OP-042 | PART: AL6061-CNC-V2", transform: "none" as const },
  ]

  return (
    <div>
      <SectionHeading
        overline="Foundation / Typography"
        title="Type System"
        desc="Three-family stack: Barlow Condensed for display headers, Inter for body UI, JetBrains Mono for data and code. Built for manufacturing data density at every scale."
      />

      <Block title="Type Scale">
        <div
          style={{
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          {styles.map((s, i) => (
            <div
              key={s.name}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 180px",
                alignItems: "center",
                gap: 24,
                padding: "16px 20px",
                borderBottom: i < styles.length - 1 ? "1px solid var(--border-subtle)" : "none",
                background: i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg-surface)",
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 2 }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.04em" }}>
                  {s.size} / {s.weight}
                </div>
              </div>
              <div
                style={{
                  fontFamily: s.family,
                  fontSize: s.size,
                  fontWeight: s.weight,
                  lineHeight: s.lh,
                  letterSpacing: s.ls,
                  color: "var(--text-primary)",
                  textTransform: s.transform,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {s.sample}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
                <code style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                  lh: {s.lh}
                </code>
                <code style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                  ls: {s.ls || "0"}
                </code>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Numeric & KPI Typography">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "KPI Large", value: "98.4%", unit: "OEE Score", size: "48px" },
            { label: "KPI Medium", value: "4,218", unit: "Parts Today", size: "36px" },
            { label: "KPI Small", value: "12.5h", unit: "Uptime", size: "28px" },
          ].map((k) => (
            <div
              key={k.label}
              style={{
                padding: "24px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {k.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: k.size,
                  fontWeight: 600,
                  color: "var(--primary)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {k.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{k.unit}</div>
            </div>
          ))}
        </div>
      </Block>
    </div>
  )
}

/* ── Spacing section ─────────────────────────────────────── */
function SpacingSection() {
  const spacingScale = [
    { name: "px", value: "1px", px: 1 },
    { name: "0.5", value: "2px", px: 2 },
    { name: "1", value: "4px", px: 4 },
    { name: "1.5", value: "6px", px: 6 },
    { name: "2", value: "8px", px: 8 },
    { name: "3", value: "12px", px: 12 },
    { name: "4", value: "16px", px: 16 },
    { name: "5", value: "20px", px: 20 },
    { name: "6", value: "24px", px: 24 },
    { name: "8", value: "32px", px: 32 },
    { name: "10", value: "40px", px: 40 },
    { name: "12", value: "48px", px: 48 },
    { name: "16", value: "64px", px: 64 },
    { name: "20", value: "80px", px: 80 },
    { name: "24", value: "96px", px: 96 },
    { name: "32", value: "128px", px: 128 },
  ]

  const radii = [
    { name: "xs", value: "2px" },
    { name: "sm", value: "4px" },
    { name: "md", value: "6px" },
    { name: "lg", value: "8px" },
    { name: "xl", value: "12px" },
    { name: "full", value: "9999px" },
  ]

  return (
    <div>
      <SectionHeading
        overline="Foundation / Spacing"
        title="Spacing & Grid"
        desc="8pt base grid. All spacing, sizing, and layout values are multiples of 4px. Use Tailwind's spacing scale directly — it aligns to this system."
      />

      <Block title="Spacing Scale">
        <div
          style={{
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          {spacingScale.map((s, i) => (
            <div
              key={s.name}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 80px 1fr 80px",
                alignItems: "center",
                gap: 16,
                padding: "8px 16px",
                borderBottom: i < spacingScale.length - 1 ? "1px solid var(--border-subtle)" : "none",
                background: i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg-surface)",
              }}
            >
              <code style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                {s.name}
              </code>
              <code style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                {s.value}
              </code>
              <div style={{ height: 4, display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    height: 8,
                    width: Math.min(s.px * 2, 360),
                    background: "linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)",
                    borderRadius: 2,
                    opacity: 0.7,
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right" }}>{s.px}px</span>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Border Radius">
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {radii.map((r) => (
            <div key={r.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  borderRadius: r.value,
                }}
              />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{r.name}</div>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{r.value}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Grid Layout">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "12-column desktop", cols: 12, note: "max-width: 1440px" },
            { label: "6-column tablet", cols: 6, note: "max-width: 1024px" },
            { label: "4-column mobile", cols: 4, note: "max-width: 768px" },
          ].map((g) => (
            <div key={g.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{g.label}</span>
                <code style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{g.note}</code>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${g.cols}, 1fr)`, gap: 4, height: 32 }}>
                {Array.from({ length: g.cols }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      background: i % 2 === 0 ? "var(--primary-subtle)" : "var(--accent-subtle)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Elevation & Shadows">
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { name: "SM", shadow: "var(--shadow-sm)", desc: "Buttons, tags" },
            { name: "MD", shadow: "var(--shadow-md)", desc: "Cards, dropdowns" },
            { name: "LG", shadow: "var(--shadow-lg)", desc: "Modals, drawers" },
            { name: "XL", shadow: "var(--shadow-xl)", desc: "Popovers, tooltips" },
            { name: "Glow Blue", shadow: "var(--shadow-glow-blue)", desc: "Active states" },
            { name: "Glow Cyan", shadow: "var(--shadow-glow-cyan)", desc: "Accent highlights" },
          ].map((s) => (
            <div key={s.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: s.shadow,
                  border: "1px solid var(--border-subtle)",
                }}
              />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{s.name}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>
    </div>
  )
}

/* ── Export ──────────────────────────────────────────────── */
export function FoundationSection({ active }: Props) {
  if (active === "overview") return <OverviewSection />
  if (active === "colors") return <ColorsSection />
  if (active === "typography") return <TypographySection />
  if (active === "spacing") return <SpacingSection />
  return null
}
