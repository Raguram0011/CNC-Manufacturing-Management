import { useState } from "react"
import { PageHeader } from "../shell/PageHeader"

/* ─── Section navigation ─────────────────────────────────── */
type Section =
  | "overview" | "tokens" | "typography" | "components"
  | "states" | "patterns" | "pages" | "animations" | "responsive"

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: "overview",    label: "Overview",          icon: "◈" },
  { id: "tokens",      label: "Design Tokens",     icon: "⬟" },
  { id: "typography",  label: "Typography",        icon: "T" },
  { id: "components",  label: "Components",        icon: "⬡" },
  { id: "states",      label: "States",            icon: "◉" },
  { id: "patterns",    label: "Patterns",          icon: "⬣" },
  { id: "pages",       label: "Page Inventory",    icon: "☰" },
  { id: "animations",  label: "Animations",        icon: "◇" },
  { id: "responsive",  label: "Responsive",        icon: "⊡" },
]

/* ─── Primitives ─────────────────────────────────────────── */
function Chip({ label, color, bg }: { label: string; color?: string; bg?: string }) {
  return <span style={{ fontSize: 10, fontWeight: 700, color: color ?? "var(--text-muted)", background: bg ?? "var(--bg-raised)", padding: "2px 9px", borderRadius: 99, letterSpacing: "0.04em" }}>{label}</span>
}

function SecTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid var(--border-subtle)" }}>
      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{subtitle}</div>}
    </div>
  )
}

function SubTitle({ title }: { title: string }) {
  return <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, marginTop: 24 }}>{title}</div>
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "20px 22px", ...style }}>{children}</div>
}

function Swatch({ label, value, text }: { label: string; value: string; text?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ height: 40, borderRadius: "var(--radius-sm)", background: value, border: "1px solid var(--border-subtle)" }} />
      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)" }}>{text ?? value}</div>
    </div>
  )
}

function Row2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="inv-row2">{children}</div>
}

/* ─── Button showcase ────────────────────────────────────── */
function ButtonShowcase() {
  return (
    <Card>
      <SubTitle title="Button / Primary" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-primary btn-sm">Small</button>
        <button className="btn btn-primary btn-lg">Large</button>
        <button className="btn btn-primary" disabled>Disabled</button>
        <button className="btn btn-primary" style={{ opacity: 0.7 }}>Loading…</button>
      </div>
      <SubTitle title="Button / Secondary" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-secondary btn-sm">Small</button>
        <button className="btn btn-secondary" disabled>Disabled</button>
      </div>
      <SubTitle title="Button / Danger" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <button className="btn btn-danger">Delete Record</button>
        <button className="btn btn-danger" disabled>Disabled</button>
      </div>
      <SubTitle title="Button / Ghost" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-ghost btn-sm">Small Ghost</button>
      </div>
    </Card>
  )
}

/* ─── Input showcase ─────────────────────────────────────── */
function InputShowcase() {
  const [val, setVal] = useState("Edit me…")
  const [err, setErr] = useState("")
  return (
    <Card>
      <SubTitle title="Input / Text — Default" />
      <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Type here…" style={{ width: "100%", marginBottom: 12 }} />
      <SubTitle title="Input / Text — Error" />
      <div style={{ marginBottom: 12 }}>
        <input value={err} onChange={(e) => setErr(e.target.value)} placeholder="Invalid input" style={{ width: "100%", borderColor: "var(--error)" }} />
        <div className="form-error">⚠ This field is required</div>
      </div>
      <SubTitle title="Input / Text — Disabled" />
      <input value="Read-only value" disabled style={{ width: "100%", marginBottom: 12 }} />
      <SubTitle title="Input / Select" />
      <select style={{ width: "100%", marginBottom: 12 }}>
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </select>
      <SubTitle title="Input / Textarea" />
      <textarea rows={3} placeholder="Multi-line text…" style={{ width: "100%", resize: "vertical", padding: "8px 11px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 13, lineHeight: 1.5, outline: "none" }} />
    </Card>
  )
}

/* ─── Badge showcase ─────────────────────────────────────── */
function BadgeShowcase() {
  return (
    <Card>
      <SubTitle title="Badge / Status" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <span className="badge badge-success">Success</span>
        <span className="badge badge-warning">Warning</span>
        <span className="badge badge-error">Error</span>
        <span className="badge badge-info">Info</span>
        <span className="badge badge-neutral">Neutral</span>
      </div>
      <SubTitle title="Badge / With Pulse Dot" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {[
          { label: "Running",     bg: "rgba(16,185,129,0.12)", color: "#10b981" },
          { label: "Idle",        bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
          { label: "Breakdown",   bg: "rgba(239,68,68,0.12)",  color: "#ef4444" },

        ].map((b) => (
          <span key={b.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: b.color, background: b.bg, padding: "3px 10px", borderRadius: 99 }}>
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: b.color }} />{b.label}
          </span>
        ))}
      </div>
      <SubTitle title="Badge / Module Tag" />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["Production", "Quality", "Inventory", "Accounts"].map((m, i) => {
          const colors = ["#a78bfa","#f59e0b","#10b981","#06b6d4","#64748b","#34d399"]
          return <span key={m} style={{ fontSize: 9, fontWeight: 700, background: `${colors[i]}20`, color: colors[i], padding: "2px 9px", borderRadius: 99, letterSpacing: "0.06em" }}>{m.toUpperCase()}</span>
        })}
      </div>
    </Card>
  )
}

/* ─── Table showcase ─────────────────────────────────────── */
function TableShowcase() {
  const rows = [
    { id: "EMP-001", name: "R. Sharma",    dept: "Production",   status: "Active",   salary: "₹42,000" },
    { id: "EMP-002", name: "S. Kumar",     dept: "Production",   status: "Active",   salary: "₹38,000" },
    { id: "EMP-003", name: "P. Yadav",     dept: "Quality",      status: "On Leave", salary: "₹36,000" },

  ]
  return (
    <Card style={{ padding: 0 }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Employee ID</th><th>Name</th><th>Department</th><th>Status</th><th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--primary)" }}>{r.id}</td>
              <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{r.name}</td>
              <td>{r.dept}</td>
              <td>
                <span className={`badge badge-${r.status === "Active" ? "success" : "warning"}`}>{r.status}</span>
              </td>
              <td style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{r.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

/* ─── Card showcase ──────────────────────────────────────── */
function CardShowcase() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }} className="inv-row3">
      {/* KPI Card */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "18px 18px", borderTop: "3px solid #2563eb" }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Card / KPI</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 700, color: "#2563eb" }}>₹8.4L</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
          <span style={{ fontSize: 10, color: "#10b981", background: "var(--success-bg)", padding: "1px 7px", borderRadius: 99, fontWeight: 700 }}>▲ 12.4%</span>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>vs last month</span>
        </div>
      </div>
      {/* Status Card */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid #10b98130", borderRadius: "var(--radius-md)", padding: "18px" }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Card / Status</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontWeight: 600, color: "#10b981", fontSize: 13 }}>Running</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>CNC-001 · WO-0841</div>
      </div>
      {/* Info Card */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "18px" }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Card / Info</div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 4 }}>Scheduled PM</div>
        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>CNC-004 · Aug 19 · 16:00</div>
        <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }}>View Details</button>
      </div>
    </div>
  )
}

/* ─── Modal showcase ─────────────────────────────────────── */
function ModalShowcase() {
  const [open, setOpen] = useState(false)
  return (
    <Card>
      <button className="btn btn-secondary" onClick={() => setOpen(true)}>Open Confirmation Dialog</button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(9,13,21,0.7)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 501, background: "var(--bg-elevated)", border: "1px solid var(--error-border)", borderRadius: "var(--radius-lg)", padding: "28px", width: 400, boxShadow: "var(--shadow-xl)", animation: "scale-in 0.18s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--error-bg)", border: "2px solid var(--error-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>⚠</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--error)" }}>Delete Record</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>This action cannot be undone</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.5 }}>Are you sure you want to delete <strong style={{ color: "var(--text-primary)" }}>EMP-042 · J. Martinez</strong>? All associated records will be permanently removed.</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setOpen(false)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn btn-danger" onClick={() => setOpen(false)} style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}

/* ─── State showcase ─────────────────────────────────────── */
function StateShowcase() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Loading */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Loading — Skeleton</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="skeleton" style={{ height: 16, borderRadius: "var(--radius-xs)", width: "60%" }} />
          <div className="skeleton" style={{ height: 12, borderRadius: "var(--radius-xs)", width: "80%" }} />
          <div className="skeleton" style={{ height: 12, borderRadius: "var(--radius-xs)", width: "45%" }} />
        </div>
      </Card>
      {/* Empty */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Empty State</div>
        <div style={{ textAlign: "center", padding: "24px 16px" }}>
          <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>📋</div>
          <div style={{ fontWeight: 600, color: "var(--text-muted)", fontSize: 14 }}>No records found</div>
          <div style={{ fontSize: 12, color: "var(--text-disabled)", marginTop: 4 }}>Create the first record to get started.</div>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>Create Record</button>
        </div>
      </Card>
      {/* Error */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Error State</div>
        <div style={{ background: "var(--error-bg)", border: "1px solid var(--error-border)", borderRadius: "var(--radius-sm)", padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ color: "var(--error)", fontSize: 16, flexShrink: 0 }}>✕</span>
          <div>
            <div style={{ fontWeight: 600, color: "var(--error)", fontSize: 13 }}>Failed to load data</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>Network error — please check your connection and try again.</div>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }}>Retry</button>
          </div>
        </div>
      </Card>
      {/* Success */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Success State</div>
        <div style={{ background: "var(--success-bg)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-sm)", padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ color: "var(--success)", fontSize: 16, flexShrink: 0 }}>✓</span>
          <div>
            <div style={{ fontWeight: 600, color: "var(--success)", fontSize: 13 }}>Record saved successfully</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>Invoice INV-2026-0184 has been created and sent to TechMetal Industries.</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ─── Page inventory ─────────────────────────────────────── */
const PAGE_INVENTORY = [
  { page: "Login / Auth", route: "auth", components: ["LoginPage", "ForgotPage", "ResetPage", "IndustrialSVG"], variants: ["Default", "Loading", "Error", "Success"], responsive: "Full mobile (390→1440)", assets: ["IndustrialSVG.tsx (pure SVG)", "CNC blueprint illustration"], animation: "Grid lines, blueprint shimmer, form fade-in" },
  { page: "Owner Dashboard", route: "dashboard (owner)", components: ["KpiCard", "AreaChart", "BarChart", "ComposedChart", "PieChart", "LiveFeed", "AlertCard"], variants: ["Loading skeleton", "Populated"], responsive: "4→2→1 column KPI grid; charts stack on mobile", assets: ["Recharts library"], animation: "Counter count-up, chart entry, pulse dot" },
  { page: "HR Module", route: "employees/attendance/leave", components: ["EmployeeList", "EmployeeProfile", "AttendanceGrid", "LeaveQueue", "CalendarHeatmap"], variants: ["List", "Profile detail", "Create/Edit form"], responsive: "Table collapses to card view on mobile", assets: ["Avatar initials"], animation: "fade-in on view switch" },
  { page: "Accounts Module", route: "billing/payments/expenses", components: ["InvoiceList", "InvoiceDetail", "PaymentLedger", "ExpenseForm"], variants: ["Draft/Sent/Paid/Overdue invoice states"], responsive: "Table horizontal scroll on mobile", assets: [], animation: "Status badge transitions" },
  { page: "Store Module", route: "inventory/purchase/suppliers/materialIssue", components: ["StockGrid", "PurchaseOrders", "SupplierList", "MaterialIssueForm"], variants: ["Low stock warning", "Overdue PO state"], responsive: "Side-by-side stats collapse to stack", assets: [], animation: "Stock level bars" },

  { page: "Reports Module", route: "reports", components: ["FilterBar", "ExportBar", "ChartCard (11 variants)", "KpiCard", "TrendPill", "DataTable", "LegendDot"], variants: ["Loading skeleton", "Empty", "Error", "Ready — 11 report categories"], responsive: "Sidebar hidden <1024px; KPIs 4→2→1; charts stack", assets: ["Recharts"], animation: "Category switch 480ms delay + skeleton" },
  { page: "Backup Module", route: "backup", components: ["BackupDashboard", "RestoreWizard (7-step stepper)", "BackupHistory", "ShieldIcon", "ScoreRing", "DropZone", "Stepper", "ConfirmDialog", "RestoreResult"], variants: ["All stepper steps", "Verification score ring (0–100)", "Compare view (6 statuses)", "Restore progress animation"], responsive: "Action grid 4→2→1; stat grid 3→2→1", assets: [], animation: "shield-pulse, shield-trace, dataflow-line, ScoreRing stroke-dashoffset" },
  { page: "Settings Module", route: "settings", components: ["SettingsNav", "CompanySettings", "GSTSettings", "InvoiceSettings", "NumberingSettings", "DepartmentsSettings", "DesignationsSettings", "ShiftsSettings", "LeaveSettings", "StockSettings", "NotificationSettings", "BackupSettings", "SecuritySettings", "EditableList", "ShiftRow", "Toggle", "SaveBar"], variants: ["12 sections", "Toggle on/off", "EditableList (add/remove tags)"], responsive: "Sidebar hidden <800px; form rows 2→1 <600px", assets: [], animation: "Section fade-in on active change" },
  { page: "Notifications Module", route: "notifications", components: ["NotifCard", "TabBar", "GroupedList", "SearchInput"], variants: ["8 tab filters", "Unread (bold border)", "Read", "Dismissed"], responsive: "Full-width cards; tab bar wraps", assets: [], animation: "fade-in per card on render" },
  { page: "Audit Logs Module", route: "audit", components: ["AuditTable", "FilterBar (4 filters)", "Drawer (slide-in right)", "DiffTable", "PaginationBar", "StatTiles"], variants: ["All result types (success/failure/warning)", "External IP highlighted", "DIFF chip on changed records", "Drawer with before/after"], responsive: "Stats 4→2→1; table horizontal scroll", assets: [], animation: "slide-in-right drawer, fade-in table" },
  { page: "Profile Module", route: "profile", components: ["AvatarBlock", "ProfileTab", "SecurityTab (password strength)", "SessionsTab", "NotifPrefsTab", "ActivityTab", "PasswordStrengthBar"], variants: ["5 tab views", "Password strength 1–4", "MFA toggle + QR placeholder", "Session revoke"], responsive: "Form rows 2→1 <600px", assets: [], animation: "Tab content fade-in" },
]

/* ─── Animation inventory ─────────────────────────────────── */
const ANIM_INVENTORY = [
  { name: "fade-in",         keyframes: "opacity 0→1 + translateY 6px→0",    usage: "Every page/view entry", duration: "250ms", easing: "ease-out",      purposeful: true  },
  { name: "scale-in",        keyframes: "scale 0.96→1, opacity 0→1",          usage: "Modals, dialogs",        duration: "200ms", easing: "ease-out",      purposeful: true  },
  { name: "slide-in-right",  keyframes: "translateX 100%→0, opacity 0→1",     usage: "Detail drawers",         duration: "220ms", easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", purposeful: true },
  { name: "shimmer",         keyframes: "bg-position -400→400px",              usage: "Skeleton loading",       duration: "1600ms loop", easing: "ease-in-out", purposeful: true },
  { name: "pulse-dot",       keyframes: "scale 1→0.85, opacity 1→0.6",        usage: "Live status indicators", duration: "2s loop",     easing: "ease-in-out", purposeful: true  },

  { name: "gear-spin",       keyframes: "rotate 0→360",                        usage: "Gear SVG by status",     duration: "8s/12s/20s loop", easing: "linear", purposeful: true },
  { name: "shield-pulse",    keyframes: "scale 1→1.06 breathing",              usage: "Backup upload state",    duration: "2.4s loop",   easing: "ease-in-out", purposeful: true  },
  { name: "shield-trace",    keyframes: "stroke-dashoffset 0→-128",            usage: "Shield SVG arc",         duration: "6s loop",     easing: "linear",      purposeful: true  },
  { name: "dataflow-line",   keyframes: "opacity + translateX",                usage: "Drop zone background",   duration: "3s staggered", easing: "ease-in-out",purposeful: true  },

  { name: "count-up",        keyframes: "translateY 4→0, opacity 0→1",         usage: "KPI counter entry",      duration: "400ms",        easing: "ease-out",    purposeful: true  },
  { name: "score ring",      keyframes: "stroke-dashoffset CSS transition",     usage: "Backup verification score", duration: "1.4s",      easing: "cubic-bezier(0.4,0,0.2,1)", purposeful: true },
]

/* ─── Responsive breakpoints ─────────────────────────────── */
const BREAKPOINTS = [
  { label: "1440px Desktop",  desc: "Full 3-column layouts, all sidebars visible, expanded tables" },
  { label: "1280px Desktop",  desc: "Same as 1440 — sidebar width adapts, no layout change" },
  { label: "1024px Tablet",   desc: "Reports sidebar hidden, 2-column KPI grids, charts retain width" },
  { label: "768px Tablet",    desc: "App sidebar collapses to icon-only, mobile bottom nav appears" },
  { label: "390px Mobile",    desc: "Single column, tables horizontal scroll, forms stack, bottom nav active" },
]

/* ─── Token list ─────────────────────────────────────────── */
const BG_TOKENS = [
  { label: "--bg-base",     value: "#090d15",   text: "#090d15" },
  { label: "--bg-surface",  value: "#0f1623",   text: "#0f1623" },
  { label: "--bg-elevated", value: "#141d2e",   text: "#141d2e" },
  { label: "--bg-raised",   value: "#1a2540",   text: "#1a2540" },
  { label: "--bg-overlay",  value: "#1e2d4d",   text: "#1e2d4d" },
]
const BRAND_TOKENS = [
  { label: "--primary",  value: "#2563eb", text: "#2563eb" },
  { label: "--accent",   value: "#06b6d4", text: "#06b6d4" },
  { label: "--success",  value: "#10b981", text: "#10b981" },
  { label: "--warning",  value: "#f59e0b", text: "#f59e0b" },
  { label: "--error",    value: "#ef4444", text: "#ef4444" },
  { label: "--info",     value: "#3b82f6", text: "#3b82f6" },
]

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
interface Props { onNavigate?: (id: string) => void }

export function UIInventory({ onNavigate }: Props) {
  const [section, setSection] = useState<Section>("overview")

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", animation: "fade-in 0.25s ease-out" }}>
      {/* Sidebar nav */}
      <aside style={{ width: 200, flexShrink: 0, position: "sticky", top: 80 }} className="inv-aside">
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-disabled)", padding: "0 8px 8px" }}>UI Inventory</div>
        {SECTIONS.map((s) => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px",
            background: section === s.id ? "var(--primary-subtle)" : "none",
            border: section === s.id ? "1px solid rgba(37,99,235,0.2)" : "1px solid transparent",
            borderRadius: "var(--radius-sm)", color: section === s.id ? "var(--primary)" : "var(--text-muted)",
            fontSize: 12, fontWeight: section === s.id ? 600 : 400, cursor: "pointer",
            fontFamily: "var(--font-body)", textAlign: "left",
          }}>
            <span style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}>{s.icon}</span>{s.label}
          </button>
        ))}
        <div style={{ marginTop: 24, padding: "12px 10px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
          <strong style={{ color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>React Handoff</strong>
          Stack: React 19 · TypeScript 5.7 · Vite 8 · Tailwind CSS v4 · Recharts
        </div>
      </aside>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }} key={section}>

        {/* ── OVERVIEW ── */}
        {section === "overview" && (
          <div style={{ animation: "fade-in 0.2s ease-out" }}>
            <div style={{ marginBottom: 4 }}>
              <div style={{ width: 24, height: 3, background: "var(--primary)", borderRadius: 2, marginBottom: 10, boxShadow: "0 0 8px rgba(37,99,235,0.6)" }} />
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, color: "var(--text-primary)", margin: 0 }}>UI Inventory · Handoff</h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8, maxWidth: 560, lineHeight: 1.6 }}>
                ACME CNC Manufacturing Management System — complete design token system, component library, and page inventory for React implementation.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, margin: "28px 0" }} className="inv-row3">
              {[
                { label: "Pages Built",     value: "12",  sub: "Fully implemented modules" },
                { label: "Components",      value: "80+", sub: "Named reusable components" },
                { label: "Design Tokens",   value: "60+", sub: "CSS custom properties" },
                { label: "Breakpoints",     value: "5",   sub: "390 · 768 · 1024 · 1280 · 1440" },
                { label: "Animation Types", value: "13",  sub: "Purposeful, reduced-motion safe" },
                { label: "User Roles",      value: "5",   sub: "Owner · HR · Accounts · Store · Prod" },
              ].map((k) => (
                <div key={k.label} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "16px 18px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: "var(--primary)" }}>{k.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginTop: 3 }}>{k.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>
            <Card>
              <SubTitle title="Tech Stack" />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["React 19", "TypeScript 5.7", "Vite 8", "Tailwind CSS v4", "Recharts 2", "Inter", "Barlow Condensed", "JetBrains Mono"].map((t) => (
                  <Chip key={t} label={t} color="var(--primary)" bg="var(--primary-subtle)" />
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── TOKENS ── */}
        {section === "tokens" && (
          <div style={{ animation: "fade-in 0.2s ease-out" }}>
            <SecTitle title="Design Tokens" subtitle="All tokens defined as CSS custom properties in src/index.css" />
            <SubTitle title="Background / Surface Elevation" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }} className="inv-swatch">
              {BG_TOKENS.map((t) => <Swatch key={t.label} label={t.label} value={t.value} text={t.text} />)}
            </div>
            <SubTitle title="Brand + Semantic Colors" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 24 }} className="inv-swatch">
              {BRAND_TOKENS.map((t) => <Swatch key={t.label} label={t.label} value={t.value} text={t.text} />)}
            </div>
            <SubTitle title="Border Tokens" />
            <Card style={{ marginBottom: 16 }}>
              {[["--border-subtle","rgba(255,255,255,0.06)"],["--border-default","rgba(255,255,255,0.09)"],["--border-strong","rgba(255,255,255,0.15)"],["--border-focus","#2563eb"]].map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>{k}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{v}</span>
                </div>
              ))}
            </Card>
            <SubTitle title="Radius Scale" />
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              {[["xs","2px"],["sm","4px"],["md","6px"],["lg","8px"],["xl","12px"]].map(([name,val]) => (
                <div key={name} style={{ textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: val, marginBottom: 6 }} />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)" }}>--radius-{name}<br />{val}</div>
                </div>
              ))}
            </div>
            <SubTitle title="Shadow Scale" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="inv-row2">
              {["sm","md","lg","xl"].map((s) => (
                <div key={s} style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", padding: "20px", boxShadow: `var(--shadow-${s})`, border: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>--shadow-{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TYPOGRAPHY ── */}
        {section === "typography" && (
          <div style={{ animation: "fade-in 0.2s ease-out" }}>
            <SecTitle title="Typography" subtitle="Four-font system: display headlines, sans labels, body copy, mono code" />
            {[
              { font: "var(--font-display)", name: "Barlow Condensed", usage: "H1 page titles, KPI values, data-dense numbers", sizes: ["48", "32", "24", "18"] },
              { font: "var(--font-sans)",    name: "Barlow",            usage: "Section titles, card headings, nav labels", sizes: ["20", "16", "14"] },
              { font: "var(--font-body)",    name: "Inter",             usage: "Body text, form labels, descriptions, buttons", sizes: ["13", "12", "11"] },
              { font: "var(--font-mono)",    name: "JetBrains Mono",   usage: "IDs, codes, timestamps, IP addresses, financial values", sizes: ["13", "11", "10"] },
            ].map((f) => (
              <Card key={f.name} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 8, flexWrap: "wrap" }}>
                  <Chip label={f.name} color="var(--primary)" bg="var(--primary-subtle)" />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{f.usage}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {f.sizes.map((s) => (
                    <div key={s} style={{ fontFamily: f.font, fontSize: `${s}px`, color: "var(--text-primary)", lineHeight: 1.2 }}>
                      ACME CNC Manufacturing — {s}px
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── COMPONENTS ── */}
        {section === "components" && (
          <div style={{ animation: "fade-in 0.2s ease-out" }}>
            <SecTitle title="Components" subtitle="All named components with variant demonstrations" />
            <SubTitle title="Button" />
            <ButtonShowcase />
            <SubTitle title="Input / Form Controls" />
            <InputShowcase />
            <SubTitle title="Badge / Status" />
            <BadgeShowcase />
            <SubTitle title="Card / KPI" />
            <CardShowcase />
            <SubTitle title="Table / Data" />
            <TableShowcase />
            <SubTitle title="Modal / Confirmation" />
            <ModalShowcase />
          </div>
        )}

        {/* ── STATES ── */}
        {section === "states" && (
          <div style={{ animation: "fade-in 0.2s ease-out" }}>
            <SecTitle title="Component States" subtitle="Every interactive component implements these states" />
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-raised)" }}>
                    {["State", "How Triggered", "Visual Signal", "Components"].map((h) => (
                      <th key={h} style={{ padding: "9px 13px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Default",  "Normal render",          "Token colors, defined border/bg",              "All"],
                    ["Hover",    "Mouse enter",             "bg-raised, border-strong, color elevation",    "Buttons, rows, cards, nav items"],
                    ["Active",   "Mouse down / keyboard",   "bg-overlay, slight scale-down",                "Buttons, tabs"],
                    ["Focus",    "Keyboard navigation",     "2px primary outline + 3px glow ring",          "All inputs, buttons, links"],
                    ["Disabled", "disabled prop",           "opacity 0.45, cursor not-allowed, bg-base",    "Inputs, buttons, toggles"],
                    ["Loading",  "Async pending",           "Skeleton shimmer OR spinner + label change",   "Tables, charts, buttons"],
                    ["Empty",    "Zero-length data set",    "Centered icon + headline + CTA",               "Tables, lists, report charts"],
                    ["Error",    "Failed fetch or invalid", "Red border, error-bg panel, retry button",     "Forms, chart cards, tables"],
                    ["Success",  "Confirmed save/action",   "Green panel, checkmark, brief auto-dismiss",   "Forms, modals, notifications"],
                  ].map(([s, t, v, c]) => (
                    <tr key={s} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "10px 13px", fontWeight: 600, fontSize: 12, color: "var(--text-primary)" }}>{s}</td>
                      <td style={{ padding: "10px 13px", fontSize: 11, color: "var(--text-secondary)" }}>{t}</td>
                      <td style={{ padding: "10px 13px", fontSize: 11, color: "var(--text-secondary)" }}>{v}</td>
                      <td style={{ padding: "10px 13px", fontSize: 11, color: "var(--text-muted)" }}>{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <StateShowcase />
          </div>
        )}

        {/* ── PATTERNS ── */}
        {section === "patterns" && (
          <div style={{ animation: "fade-in 0.2s ease-out" }}>
            <SecTitle title="UX Patterns" subtitle="Consistent interaction patterns across all modules" />
            {[
              { title: "Navigation / Sidebar",    desc: "240px wide, collapsible to icon-only at 768px. Role-aware nav groups. Active item: primary-subtle bg + primary left border. Hover: bg-raised. Bottom: role switcher (dev only), user avatar, collapse toggle." },
              { title: "Navigation / TopBar",      desc: "Sticky h-14. Left: hamburger (mobile), logo. Center: breadcrumbs with clickable ancestors. Right: search, notifications badge, user avatar. Theme: bg-surface + border-subtle." },
              { title: "Navigation / MobileNav",   desc: "Bottom tab bar at ≤768px. 5 most-relevant items per role. Active: primary color. Hidden on desktop." },
              { title: "PageHeader",               desc: "3px accent overline → H1 (Barlow Condensed 32px) → description → action buttons. Breadcrumbs above title. Badge inline with title." },
              { title: "Search / Global",          desc: "Cmd+K modal. Instant filter across navigation items. Keyboard arrow navigation. Esc to close." },

              { title: "Tables / Data",            desc: "Sticky header row (bg-raised). Hover: bg-raised row. Monospace for IDs/codes/dates. Status badges. Sortable columns (planned). Paginated at 15/20 rows." },
              { title: "Pagination",               desc: "Prev · numbered pages (7 max) · Next. Record count shown. Jump-to-page for large datasets." },
              { title: "Modals / Confirmation",    desc: "Destructive actions: red border, ⚠ icon, action description, type-to-confirm for high-risk ops (type RESTORE). Backdrop blur. scale-in animation." },
              { title: "Drawers / Detail",         desc: "Right-side panel, 520px max, slide-in-right animation. Backdrop click to close. Used for audit log detail, future record detail." },
              { title: "Forms / Settings",         desc: "Left sidebar nav + main content. Save/Reset bar at bottom. Fields: label above, hint below, error below hint. Inline toggle rows for boolean settings." },
              { title: "Skeleton Loading",         desc: "800px shimmer gradient bg-elevated→bg-raised. Same shape/dimensions as actual content. Used whenever data fetch > 200ms." },
              { title: "Empty State",              desc: "Centered icon (opacity 0.3) + bold headline + muted description + CTA button. Used in all tables and chart cards." },
              { title: "Role Permissions",         desc: "Early return pattern: each role check returns its module component, narrowing TypeScript types. 5 roles: owner/hr/accounts/store/production." },
            ].map((p) => (
              <div key={p.title} style={{ marginBottom: 12, padding: "14px 16px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── PAGES ── */}
        {section === "pages" && (
          <div style={{ animation: "fade-in 0.2s ease-out" }}>
            <SecTitle title="Page Inventory" subtitle="Complete list of all implemented pages with component manifest" />
            {PAGE_INVENTORY.map((p) => (
              <div key={p.page} style={{ marginBottom: 12, background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-raised)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{p.page}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", background: "var(--bg-overlay)", padding: "2px 8px", borderRadius: "var(--radius-xs)" }}>{p.route}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "14px 16px" }} className="inv-row2">
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Components</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {p.components.map((c) => <span key={c} style={{ fontSize: 9, background: "var(--bg-raised)", color: "var(--text-secondary)", padding: "2px 7px", borderRadius: "var(--radius-xs)", fontFamily: "var(--font-mono)" }}>{c}</span>)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Variants</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>{p.variants.join(", ")}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, marginTop: 10 }}>Responsive</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{p.responsive}</div>
                    {p.animation && (<>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4, marginTop: 10 }}>Animation</div>
                      <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{p.animation}</div>
                    </>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ANIMATIONS ── */}
        {section === "animations" && (
          <div style={{ animation: "fade-in 0.2s ease-out" }}>
            <SecTitle title="Animation Inventory" subtitle="All animations are purposeful, reduced-motion safe, and performance-conscious (CSS/SVG only — no JS layout)." />
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-raised)" }}>
                    {["Name", "Keyframes", "Usage", "Duration", "Easing"].map((h) => (
                      <th key={h} style={{ padding: "9px 13px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ANIM_INVENTORY.map((a) => (
                    <tr key={a.name} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "10px 13px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--primary)", fontWeight: 600 }}>{a.name}</td>
                      <td style={{ padding: "10px 13px", fontSize: 11, color: "var(--text-secondary)" }}>{a.keyframes}</td>
                      <td style={{ padding: "10px 13px", fontSize: 11, color: "var(--text-secondary)" }}>{a.usage}</td>
                      <td style={{ padding: "10px 13px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{a.duration}</td>
                      <td style={{ padding: "10px 13px", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>{a.easing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--success-bg)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--success)" }}>
              ✓ All animations respect <code style={{ fontFamily: "var(--font-mono)" }}>prefers-reduced-motion: reduce</code> — duration set to 0.01ms when user has requested reduced motion (defined in index.css).
            </div>
          </div>
        )}

        {/* ── RESPONSIVE ── */}
        {section === "responsive" && (
          <div style={{ animation: "fade-in 0.2s ease-out" }}>
            <SecTitle title="Responsive Behavior" subtitle="5-breakpoint system from 390px mobile to 1440px desktop" />
            {BREAKPOINTS.map((bp) => (
              <div key={bp.label} style={{ marginBottom: 10, padding: "14px 16px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--primary)", flexShrink: 0, minWidth: 130 }}>{bp.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{bp.desc}</div>
              </div>
            ))}

            <div style={{ marginTop: 20, background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>Grid Behavior by Breakpoint</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-raised)" }}>
                    {["Component", "≥1024px", "768–1023px", "≤767px"].map((h) => (
                      <th key={h} style={{ padding: "8px 13px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["KPI Cards",        "4 columns",      "2 columns",           "1 column"],
                    ["Chart Grid",       "2 columns",      "2 columns",           "1 column"],
                    ["Sidebar",          "240px visible",  "Collapsed icon-only", "Hidden (bottom nav)"],
                    ["Reports Sidebar",  "200px visible",  "Hidden",              "Hidden"],
                    ["Tables",           "Full width",     "Full width",          "Horizontal scroll"],
                    ["Settings Sidebar", "210px visible",  "Hidden",              "Hidden"],
                    ["Form Rows",        "2 columns",      "2 columns",           "1 column"],

                    ["Action Buttons",   "Inline",         "Inline",              "Stacked/hidden"],
                  ].map(([c, d, t, m]) => (
                    <tr key={c} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "9px 13px", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{c}</td>
                      <td style={{ padding: "9px 13px", fontSize: 11, color: "var(--text-secondary)" }}>{d}</td>
                      <td style={{ padding: "9px 13px", fontSize: 11, color: "var(--text-secondary)" }}>{t}</td>
                      <td style={{ padding: "9px 13px", fontSize: 11, color: "var(--text-secondary)" }}>{m}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @media(max-width:900px){.inv-aside{display:none!important}}
        @media(max-width:700px){.inv-row2{grid-template-columns:1fr!important}.inv-row3{grid-template-columns:1fr 1fr!important}.inv-swatch{grid-template-columns:repeat(3,1fr)!important}}
        @media(max-width:500px){.inv-row3{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  )
}
