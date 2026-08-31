import { useState, useEffect, type ReactNode } from "react"

interface Props {
  active: string
}

/* ── Shared ──────────────────────────────────────────────── */
function SectionHeading({ overline, title, desc }: { overline: string; title: string; desc: string }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
        {overline}
      </div>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 40, lineHeight: 1.1, color: "var(--text-primary)", margin: "0 0 12px" }}>
        {title}
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, maxWidth: 560, lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, letterSpacing: "0.01em", color: "var(--text-primary)", margin: "0 0 20px", textTransform: "uppercase" }}>
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

/* ── Skeleton loaders ────────────────────────────────────── */
function SkeletonLine({ width = "100%", height = 12 }: { width?: string | number; height?: number }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: "var(--radius-xs)", flexShrink: 0 }}
    />
  )
}

function SkeletonBox({ width = "100%", height = 80 }: { width?: string | number; height?: number }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: "var(--radius-sm)" }}
    />
  )
}

function SkeletonStatCard() {
  return (
    <div
      style={{
        padding: 20,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderLeft: "3px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <SkeletonLine width={80} height={9} />
      <SkeletonLine width={60} height={28} />
      <SkeletonLine width={100} height={9} />
    </div>
  )
}

function SkeletonTableRow({ cols = 5 }: { cols?: number }) {
  const widths = ["60%", "45%", "30%", "50%", "25%"]
  return (
    <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
      {Array.from({ length: cols }, (_, i) => (
        <td key={i} style={{ padding: "12px 12px" }}>
          <SkeletonLine width={widths[i % widths.length]} height={10} />
        </td>
      ))}
    </tr>
  )
}

/* ── Spinner ─────────────────────────────────────────────── */
function Spinner({ size = 24, color = "var(--primary)" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "gear-spin 0.8s linear infinite" }}
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity={0.2} strokeWidth="2.5" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/* ── Loading states section ──────────────────────────────── */
function LoadingSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(timer); return 100 }
        return p + 2
      })
    }, 60)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <SectionHeading
        overline="Patterns / Loading States"
        title="Loading States"
        desc="Skeleton screens for perceived performance, spinners for async operations, and progress indicators for long-running manufacturing processes."
      />

      <Block title="Skeleton — Stat Cards">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
      </Block>

      <Block title="Skeleton — Table">
        <div style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          {/* Fake header */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, padding: "10px 12px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border-default)" }}>
            {[70, 50, 60, 45, 35].map((w, i) => (
              <SkeletonLine key={i} width={w} height={9} />
            ))}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonTableRow key={i} cols={5} />
              ))}
            </tbody>
          </table>
        </div>
      </Block>

      <Block title="Skeleton — Dashboard Card">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <SkeletonLine width={120} height={12} />
              <SkeletonLine width={48} height={22} />
            </div>
            <SkeletonBox height={140} />
          </div>
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <SkeletonLine width={100} height={12} />
            {[80, 60, 90, 55, 70].map((w, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <SkeletonLine width={60} height={9} />
                <div style={{ flex: 1, height: 6, background: "var(--bg-raised)", borderRadius: 3 }}>
                  <div className="skeleton" style={{ width: `${w}%`, height: "100%", borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Block>

      <Block title="Spinners">
        <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Spinner size={16} />
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>16px</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Spinner size={24} />
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>24px</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Spinner size={36} />
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>36px</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Spinner size={48} />
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>48px</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Spinner size={24} color="var(--accent)" />
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>cyan</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Spinner size={24} color="var(--success)" />
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>success</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Spinner size={24} color="var(--warning)" />
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>warning</span>
          </div>
        </div>
      </Block>

      <Block title="Progress Bars">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Work Order WO-0841 — Production Progress", pct: progress, color: "var(--primary)" },
            { label: "Batch Quality Verification", pct: 64, color: "var(--success)" },
            { label: "Tooling Life Remaining — Insert #4", pct: 23, color: "var(--warning)" },
            { label: "G-Code Upload", pct: 100, color: "var(--accent)" },
          ].map((p) => (
            <div key={p.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{p.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: p.color }}>{p.pct}%</span>
              </div>
              <div style={{ height: 6, background: "var(--bg-overlay)", borderRadius: 3, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${p.pct}%`,
                    background: p.color,
                    borderRadius: 3,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Loading Page Overlay">
        <div
          style={{
            position: "relative",
            height: 200,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          {/* Content behind */}
          <div style={{ padding: 20, opacity: 0.2 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: 60, background: "var(--bg-raised)", borderRadius: "var(--radius-sm)" }} />
              ))}
            </div>
          </div>
          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(9, 13, 21, 0.8)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              backdropFilter: "blur(2px)",
            }}
          >
            <Spinner size={36} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>Loading machine data…</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Fetching live metrics from CNC-001</span>
            </div>
          </div>
        </div>
      </Block>
    </div>
  )
}

/* ── Empty states section ────────────────────────────────── */
function EmptyState({
  icon,
  title,
  desc,
  action,
  variant = "default",
}: {
  icon: string
  title: string
  desc: string
  action?: { label: string }
  variant?: "default" | "error" | "search"
}) {
  const iconColors: Record<string, string> = {
    default: "var(--text-muted)",
    error: "var(--error)",
    search: "var(--accent)",
  }

  return (
    <div
      style={{
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: variant === "error" ? "var(--error-bg)" : "var(--bg-raised)",
          border: `1px solid ${variant === "error" ? "var(--error-border)" : "var(--border-default)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: iconColors[variant],
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 18,
          color: "var(--text-primary)",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          maxWidth: 320,
          marginBottom: action ? 20 : 0,
        }}
      >
        {desc}
      </div>
      {action && (
        <button
          style={{
            padding: "8px 20px",
            fontSize: 13,
            fontWeight: 500,
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

function ErrorState({ title, code, desc, onRetry }: {
  title: string; code?: string; desc: string; onRetry?: () => void
}) {
  return (
    <div
      style={{
        padding: "40px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "var(--error-bg)",
        border: "1px solid var(--error-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 12, color: "var(--error)" }}>✕</div>
      {code && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--error)", letterSpacing: "0.1em", marginBottom: 8, opacity: 0.7 }}>
          {code}
        </div>
      )}
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--text-primary)", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 340, marginBottom: 20 }}>
        {desc}
      </div>
      {onRetry && (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onRetry}
            style={{
              padding: "7px 18px",
              fontSize: 13,
              fontWeight: 500,
              background: "var(--error)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            Retry Connection
          </button>
          <button
            style={{
              padding: "7px 18px",
              fontSize: 13,
              fontWeight: 500,
              background: "transparent",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            View Details
          </button>
        </div>
      )}
    </div>
  )
}

function EmptyErrorSection() {
  const [retries, setRetries] = useState(0)

  return (
    <div>
      <SectionHeading
        overline="Patterns / Empty & Error States"
        title="Empty & Error States"
        desc="Informative states for no data, no search results, connection errors, and permission denied. Always include a clear title, contextual description, and a recovery action."
      />

      <Block title="Empty States">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <EmptyState
            icon="◉"
            title="No Work Orders"
            desc="No work orders are currently assigned to this machine. Create a new work order to get started."
            action={{ label: "Create Work Order" }}
          />
          <EmptyState
            icon="◈"
            title="No Results Found"
            desc={'No machines match your search for "Fanuc 30i". Try adjusting your filters or search terms.'}
            variant="search"
          />
          <EmptyState
            icon="◧"
            title="No Maintenance Records"
            desc="This machine has no logged maintenance activity. All scheduled PMs will appear here once recorded."
          />
        </div>
      </Block>

      <Block title="Error States">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <ErrorState
            title="Machine Fault Detected"
            code="FAULT-2024-0813-07 / E-STOP ACTIVE"
            desc="CNC-007 has triggered an emergency stop. The machine controller is not responding. Check the physical E-stop and reset from the control panel."
            onRetry={() => setRetries((r) => r + 1)}
          />
          <ErrorState
            title="Connection Lost"
            code="ERR_NETWORK_TIMEOUT"
            desc="Unable to connect to the machine monitoring service. The last known data is from 14:22:03. Check network connectivity and MFG gateway status."
            onRetry={() => setRetries((r) => r + 1)}
          />
        </div>
        {retries > 0 && (
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Retry attempted {retries}× — simulated
          </div>
        )}
      </Block>

      <Block title="Confirmation Dialog">
        <div
          style={{
            position: "relative",
            height: 280,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          {/* Backdrop */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(9,13,21,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-lg)",
                padding: "28px 32px",
                width: 380,
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--error-bg)",
                    border: "1px solid var(--error-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--error)",
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  ✕
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}>
                    Cancel Work Order?
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--error)", letterSpacing: "0.06em" }}>
                    WO-2024-0841
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                Cancelling this work order will release the machine reservation on CNC-001 and mark 142 in-progress parts as incomplete. This action cannot be undone.
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  style={{
                    padding: "7px 16px",
                    fontSize: 13,
                    background: "transparent",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                  }}
                >
                  Keep Order
                </button>
                <button
                  style={{
                    padding: "7px 16px",
                    fontSize: 13,
                    background: "var(--error)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                  }}
                >
                  Cancel Work Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </Block>

      <Block title="File Upload State">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Empty upload area */}
          <div
            style={{
              padding: "40px 24px",
              border: "2px dashed var(--border-default)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              background: "var(--bg-elevated)",
              cursor: "pointer",
              transition: "border-color 0.15s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--primary)" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-default)" }}
          >
            <div style={{ fontSize: 28, color: "var(--text-muted)" }}>⬆</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>Upload G-Code Program</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>Drag & drop .nc, .cnc, or .tap files here</div>
            <button
              style={{
                marginTop: 4,
                padding: "6px 14px",
                fontSize: 12,
                background: "var(--primary-subtle)",
                color: "var(--primary)",
                border: "1px solid var(--primary-subtle)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
              }}
            >
              Browse Files
            </button>
          </div>

          {/* Uploaded state */}
          <div
            style={{
              padding: "20px",
              border: "1px solid var(--success-border)",
              borderRadius: "var(--radius-md)",
              background: "var(--success-bg)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 20, color: "var(--success)" }}>◈</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>OP-10-AL6061-v3.nc</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>148 KB — Validated</div>
              </div>
              <button style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
            <div style={{ height: 4, background: "rgba(16,185,129,0.2)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "100%", background: "var(--success)", borderRadius: 2 }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--success)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
              ✓ Syntax check passed — 2,841 blocks, 18 tool calls
            </div>
          </div>
        </div>
      </Block>
    </div>
  )
}

/* ── Export ──────────────────────────────────────────────── */
export function PatternSection({ active }: Props) {
  if (active === "loading") return <LoadingSection />
  if (active === "empty-error") return <EmptyErrorSection />
  return null
}
