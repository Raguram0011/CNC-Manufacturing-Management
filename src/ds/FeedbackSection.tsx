import { useState, type ReactNode } from "react"

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

/* ── Badge ───────────────────────────────────────────────── */
type BadgeVariant = "success" | "warning" | "error" | "info" | "primary" | "neutral"
type BadgeSize = "sm" | "md" | "lg"

const BADGE_STYLES: Record<BadgeVariant, { color: string; bg: string; border: string }> = {
  success: { color: "var(--success)", bg: "var(--success-bg)", border: "var(--success-border)" },
  warning: { color: "var(--warning)", bg: "var(--warning-bg)", border: "var(--warning-border)" },
  error:   { color: "var(--error)",   bg: "var(--error-bg)",   border: "var(--error-border)" },
  info:    { color: "var(--info)",    bg: "var(--info-bg)",    border: "var(--info-border)" },
  primary: { color: "var(--primary)", bg: "var(--primary-subtle)", border: "var(--primary-subtle)" },
  neutral: { color: "var(--text-secondary)", bg: "var(--bg-raised)", border: "var(--border-default)" },
}

function Badge({ variant = "neutral", size = "md", dot = false, pulse = false, children }: {
  variant?: BadgeVariant; size?: BadgeSize; dot?: boolean; pulse?: boolean; children: ReactNode
}) {
  const s = BADGE_STYLES[variant]
  const sizes = {
    sm: { fontSize: 10, padding: "1px 6px", gap: 4 },
    md: { fontSize: 11, padding: "2px 8px", gap: 5 },
    lg: { fontSize: 12, padding: "4px 10px", gap: 6 },
  }
  const sz = sizes[size]
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: sz.gap,
        padding: sz.padding,
        borderRadius: "var(--radius-xs)",
        background: s.bg,
        border: `1px solid ${s.border}`,
        fontSize: sz.fontSize,
        fontWeight: 500,
        color: s.color,
        fontFamily: "var(--font-body)",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span
          className={pulse ? "pulse-dot" : ""}
          style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }}
        />
      )}
      {children}
    </span>
  )
}

/* ── Badges section ──────────────────────────────────────── */
function BadgesSection() {
  const statuses = [
    { label: "Running",      variant: "success" as const, icon: "●" },
    { label: "Idle",         variant: "warning" as const, icon: "○" },
    { label: "Maintenance",  variant: "info"    as const, icon: "◎" },
    { label: "Offline",      variant: "error"   as const, icon: "✕" },
    { label: "In Progress",  variant: "primary" as const, icon: "◉" },
    { label: "Completed",    variant: "success" as const, icon: "✓" },
    { label: "Queued",       variant: "neutral" as const, icon: "◷" },
    { label: "Cancelled",    variant: "neutral" as const, icon: "—" },
  ]

  const priorities = [
    { label: "Emergency", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
    { label: "Rush", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
    { label: "Standard", color: "#64748b", bg: "var(--bg-raised)", border: "var(--border-default)" },
    { label: "Low", color: "#4b5a72", bg: "var(--bg-surface)", border: "var(--border-subtle)" },
  ]

  return (
    <div>
      <SectionHeading
        overline="Components / Badges & Status"
        title="Badge System"
        desc="Status indicators, priority labels, and categorical tags. Badges use semantic color tokens and should always carry a visible text label alongside any dot indicator."
      />

      <Block title="Semantic Status Badges">
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Machine status */}
          <div>
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Machine Status
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {statuses.map((s) => (
                <Badge key={s.label} variant={s.variant} dot pulse={s.variant === "success" && s.label === "Running"}>
                  {s.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Sizes — SM / MD / LG
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <Badge variant="success" size="sm" dot>Running SM</Badge>
              <Badge variant="success" size="md" dot>Running MD</Badge>
              <Badge variant="success" size="lg" dot>Running LG</Badge>
              <Badge variant="error" size="sm" dot>Error SM</Badge>
              <Badge variant="error" size="md" dot>Error MD</Badge>
              <Badge variant="error" size="lg" dot>Error LG</Badge>
            </div>
          </div>

          {/* Priority */}
          <div>
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Priority Labels
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {priorities.map((p) => (
                <span
                  key={p.label}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "var(--radius-xs)",
                    background: p.bg,
                    border: `1px solid ${p.border}`,
                    fontSize: 10,
                    fontWeight: 700,
                    color: p.color,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          {/* Categorical */}
          <div>
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Categorical / Type Tags
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Milling", "Turning", "Drilling", "5-Axis", "EDM", "Grinding", "QC Hold", "First Article"].map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "3px 9px",
                    borderRadius: "var(--radius-xs)",
                    background: "var(--bg-raised)",
                    border: "1px solid var(--border-default)",
                    fontSize: 11,
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Block>

      <Block title="Inline Usage in Context">
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>Work Orders — Inline badge usage</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--bg-surface)" }}>
                {["Work Order", "Status", "Priority", "Type", "Machine"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { wo: "WO-0841", status: "In Progress", priority: "Rush", type: "Milling", machine: "CNC-001" },
                { wo: "WO-0842", status: "Queued", priority: "Standard", type: "Turning", machine: "CNC-002" },
                { wo: "WO-0843", status: "Completed", priority: "Standard", type: "5-Axis", machine: "CNC-010" },
                { wo: "WO-0844", status: "Offline", priority: "Emergency", type: "QC Hold", machine: "CNC-007" },
              ].map((r, i) => (
                <tr key={r.wo} style={{ borderBottom: "1px solid var(--border-subtle)", background: i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg-surface)" }}>
                  <td style={{ padding: "9px 12px", fontFamily: "var(--font-mono)", color: "var(--primary)", fontWeight: 500 }}>{r.wo}</td>
                  <td style={{ padding: "9px 12px" }}>
                    <Badge variant={r.status === "In Progress" ? "primary" : r.status === "Queued" ? "neutral" : r.status === "Completed" ? "success" : "error"} dot size="sm">
                      {r.status}
                    </Badge>
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: r.priority === "Emergency" ? "var(--error)" : r.priority === "Rush" ? "var(--warning)" : "var(--text-muted)", letterSpacing: "0.08em" }}>
                      {r.priority}
                    </span>
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ fontSize: 11, color: "var(--text-secondary)", background: "var(--bg-overlay)", padding: "2px 7px", borderRadius: "var(--radius-xs)", border: "1px solid var(--border-subtle)" }}>
                      {r.type}
                    </span>
                  </td>
                  <td style={{ padding: "9px 12px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>{r.machine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>
    </div>
  )
}

/* ── Alert component ─────────────────────────────────────── */
type AlertVariant = "info" | "success" | "warning" | "error"

const ALERT_STYLES: Record<AlertVariant, { color: string; bg: string; border: string; icon: string }> = {
  info:    { color: "var(--info)",    bg: "var(--info-bg)",    border: "var(--info-border)",    icon: "ℹ" },
  success: { color: "var(--success)", bg: "var(--success-bg)", border: "var(--success-border)", icon: "✓" },
  warning: { color: "var(--warning)", bg: "var(--warning-bg)", border: "var(--warning-border)", icon: "⚠" },
  error:   { color: "var(--error)",   bg: "var(--error-bg)",   border: "var(--error-border)",   icon: "✕" },
}

function Alert({ variant = "info", title, children, dismissible = false }: {
  variant?: AlertVariant; title: string; children: ReactNode; dismissible?: boolean
}) {
  const [visible, setVisible] = useState(true)
  const s = ALERT_STYLES[variant]
  if (!visible) return null
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "14px 16px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderLeft: `3px solid ${s.color}`,
        borderRadius: "var(--radius-sm)",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: s.color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {s.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: s.color, marginBottom: 3, fontFamily: "var(--font-sans)" }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 16, padding: 0, alignSelf: "flex-start" }}
        >
          ×
        </button>
      )}
    </div>
  )
}

/* ── Toast notification ──────────────────────────────────── */
function Toast({ variant = "info", title, message }: { variant?: AlertVariant; title: string; message: string }) {
  const s = ALERT_STYLES[variant]
  return (
    <div
      style={{
        background: "var(--bg-overlay)",
        border: "1px solid var(--border-strong)",
        borderLeft: `3px solid ${s.color}`,
        borderRadius: "var(--radius-md)",
        padding: "12px 16px",
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        boxShadow: "var(--shadow-lg)",
        width: 320,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: s.color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {s.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>{message}</div>
      </div>
      <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
    </div>
  )
}

/* ── Alerts section ──────────────────────────────────────── */
function AlertsSection() {
  return (
    <div>
      <SectionHeading
        overline="Components / Alerts & Notifications"
        title="Alert System"
        desc="Inline alerts, dismissible banners, and toast notifications for system feedback. Each severity has a consistent icon, color, and border treatment."
      />

      <Block title="Inline Alerts">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Alert variant="info" title="Scheduled Maintenance — CNC-007">
            Routine spindle maintenance scheduled for Aug 15, 2026 at 06:00. Machine will be unavailable for approximately 4 hours. Redirect work orders to CNC-005 or CNC-008.
          </Alert>
          <Alert variant="success" title="Work Order WO-0838 Completed">
            250 parts completed to spec. First-article inspection passed. Parts moved to shipping queue. QC signed off by R. Tanaka.
          </Alert>
          <Alert variant="warning" title="Coolant Level Low — CNC-003">
            Coolant reservoir at 23% capacity. Automatic replenishment system offline. Manual refill required before next shift. Contact facilities team.
          </Alert>
          <Alert variant="error" title="Machine Fault — CNC-007 Offline" dismissible>
            Spindle drive fault detected. Machine has been taken offline automatically. Work orders reassigned. Maintenance team notified. Reference: FAULT-2024-0813-07.
          </Alert>
        </div>
      </Block>

      <Block title="Dismissible Banners">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Alert variant="warning" title="3 Machines Approaching Maintenance Threshold" dismissible>
            CNC-002, CNC-006, and CNC-009 are within 50 hours of scheduled maintenance. Review maintenance queue.
          </Alert>
          <Alert variant="info" title="System Update Available — v2.4.1" dismissible>
            A new version of the MFG Management System is available. Changes include improved OEE calculation and new defect tracking features. Schedule update for off-shift hours.
          </Alert>
        </div>
      </Block>

      <Block title="Toast Notifications">
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Toast variant="success" title="Work order created" message="WO-2024-0846 has been created and assigned to CNC-001." />
          <Toast variant="error" title="Machine fault detected" message="CNC-007 reported spindle fault. Machine taken offline." />
          <Toast variant="warning" title="Shift ending in 30 minutes" message="Evening shift handover checklist required before 22:00." />
          <Toast variant="info" title="OEE report ready" message="Weekly OEE report for week 33 is ready to review." />
        </div>
      </Block>

      <Block title="Inline Validation Messages">
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 420 }}>
          {[
            { type: "error", msg: "Part number not found in material database." },
            { type: "warning", msg: "Spindle speed exceeds recommended limit for this material." },
            { type: "success", msg: "G-code validated — no errors detected." },
            { type: "info", msg: "First-article inspection required before batch run." },
          ].map((v) => {
            const icons: Record<string, string> = { error: "✕", warning: "⚠", success: "✓", info: "ℹ" }
            const colors: Record<string, string> = { error: "var(--error)", warning: "var(--warning)", success: "var(--success)", info: "var(--info)" }
            return (
              <div key={v.msg} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: colors[v.type] }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>{icons[v.type]}</span>
                <span style={{ color: v.type === "info" ? "var(--text-secondary)" : colors[v.type] }}>{v.msg}</span>
              </div>
            )
          })}
        </div>
      </Block>
    </div>
  )
}

/* ── Tabs section ────────────────────────────────────────── */
function TabsSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [activeTabPill, setActiveTabPill] = useState(0)
  const [activeTabVert, setActiveTabVert] = useState(0)

  const tabs = ["Overview", "Work Orders", "Maintenance", "Quality", "Reports"]
  const tabContent = [
    { title: "Machine Overview", desc: "All 10 CNC machines are displayed with live status, current program, and OEE metrics. 7 running, 1 idle, 1 in maintenance, 1 offline." },
    { title: "Work Orders", desc: "4 active work orders, 3 queued, 2 completed today. Total parts on schedule: 87% of daily target achieved." },
    { title: "Maintenance Schedule", desc: "3 machines approaching threshold. CNC-007 requires immediate attention — spindle fault logged. Next scheduled PM: Aug 15." },
    { title: "Quality Dashboard", desc: "Overall defect rate 0.42% — within 1% tolerance limit. 2 flagged parts on QC hold from WO-0838. CPK: 1.67." },
    { title: "Production Reports", desc: "Weekly report ready. OEE Week 33: 96.4% average. Best machine: CNC-008 Speedio at 99.7%. Improve focus: CNC-003." },
  ]

  /* Breadcrumbs */
  const crumbs = ["Dashboard", "Machines", "CNC-001 — Haas VF-2", "Work Orders"]

  return (
    <div>
      <SectionHeading
        overline="Components / Navigation & Tabs"
        title="Navigation & Tabs"
        desc="Tabbed interfaces, breadcrumb navigation, and sidebar nav patterns for the CNC management application."
      />

      <Block title="Underline Tabs">
        <div>
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--border-default)",
              gap: 0,
            }}
          >
            {tabs.map((tab, i) => {
              const isActive = activeTab === i
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  style={{
                    padding: "10px 20px",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--primary)" : "var(--text-secondary)",
                    background: "transparent",
                    border: "none",
                    borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.01em",
                    whiteSpace: "nowrap",
                    marginBottom: -1,
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)" }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)" }}
                >
                  {tab}
                </button>
              )
            })}
          </div>
          <div
            style={{
              padding: "24px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderTop: "none",
              borderRadius: "0 0 var(--radius-md) var(--radius-md)",
            }}
          >
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "var(--text-primary)", marginBottom: 6 }}>
              {tabContent[activeTab].title}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {tabContent[activeTab].desc}
            </div>
          </div>
        </div>
      </Block>

      <Block title="Pill Tabs">
        <div>
          <div
            style={{
              display: "inline-flex",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              padding: 4,
              gap: 2,
              marginBottom: 16,
            }}
          >
            {["Daily", "Weekly", "Monthly", "Quarterly"].map((tab, i) => {
              const isActive = activeTabPill === i
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTabPill(i)}
                  style={{
                    padding: "6px 16px",
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#fff" : "var(--text-secondary)",
                    background: isActive ? "var(--primary)" : "transparent",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    fontFamily: "var(--font-body)",
                    boxShadow: isActive ? "var(--shadow-sm)" : "none",
                  }}
                >
                  {tab}
                </button>
              )
            })}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Viewing: {["Daily — Aug 13, 2026", "Weekly — Week 33, 2026", "Monthly — August 2026", "Q3 2026"][activeTabPill]}
          </div>
        </div>
      </Block>

      <Block title="Vertical Tab Navigation">
        <div style={{ display: "flex", gap: 0, border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <div style={{ width: 180, background: "var(--bg-surface)", borderRight: "1px solid var(--border-default)" }}>
            {["Machine Info", "G-Code Programs", "Tool Library", "Maintenance Log", "Alarm History"].map((tab, i) => {
              const isActive = activeTabVert === i
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTabVert(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--primary)" : "var(--text-secondary)",
                    background: isActive ? "var(--primary-subtle)" : "transparent",
                    border: "none",
                    borderLeft: `2px solid ${isActive ? "var(--primary)" : "transparent"}`,
                    borderBottom: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {tab}
                </button>
              )
            })}
          </div>
          <div style={{ flex: 1, padding: 24, background: "var(--bg-elevated)" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 8 }}>
              {["Machine Info", "G-Code Programs", "Tool Library", "Maintenance Log", "Alarm History"][activeTabVert]}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Content for the selected tab section would appear here. This panel adapts to the selected navigation item while keeping the sidebar state persistent.
            </div>
          </div>
        </div>
      </Block>

      <Block title="Breadcrumb Navigation">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {crumbs.map((crumb, i) => (
              <span key={crumb} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && <span style={{ color: "var(--text-muted)", fontSize: 11 }}>/</span>}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: i < crumbs.length - 1 ? "pointer" : "default",
                    fontSize: 13,
                    color: i === crumbs.length - 1 ? "var(--text-primary)" : "var(--primary)",
                    fontFamily: "var(--font-body)",
                    fontWeight: i === crumbs.length - 1 ? 500 : 400,
                    padding: 0,
                    textDecoration: i < crumbs.length - 1 ? "none" : "none",
                  }}
                >
                  {crumb}
                </button>
              </span>
            ))}
          </div>
          {/* Compact mono breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {["MFG", "Line-B", "CNC-001", "WO-0841"].map((crumb, i) => (
              <span key={crumb} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && <span style={{ color: "var(--border-strong)", fontSize: 10 }}>▶</span>}
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    color: i === 3 ? "var(--accent)" : "var(--text-muted)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        </div>
      </Block>
    </div>
  )
}

/* ── Export ──────────────────────────────────────────────── */
export function FeedbackSection({ active }: Props) {
  if (active === "badges") return <BadgesSection />
  if (active === "alerts") return <AlertsSection />
  if (active === "navigation") return <TabsSection />
  return null
}
