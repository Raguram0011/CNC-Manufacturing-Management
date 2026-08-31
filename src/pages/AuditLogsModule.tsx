import { useState, useMemo } from "react"
import { PageHeader } from "../shell/PageHeader"

/* ─── Types ───────────────────────────────────────────────── */
type AuditResult = "success" | "failure" | "warning"
type AuditModule =
  | "Auth" | "HR" | "Attendance" | "Billing" | "Payments" | "Expenses"
  | "Inventory" | "Purchase" | "Production" | "Machines" | "Maintenance"
  | "Quality" | "Scrap" | "Reports" | "Backup" | "Settings" | "Users" | "System"

interface AuditLog {
  id: string
  user: string
  userRole: string
  action: string
  module: AuditModule
  date: string
  time: string
  ip: string
  result: AuditResult
  duration: number
  before?: Record<string, string>
  after?: Record<string, string>
  detail?: string
  userAgent?: string
}

/* ─── Data ────────────────────────────────────────────────── */
const AUDIT_LOGS: AuditLog[] = [
  { id: "al001", user: "Alex Mercer",   userRole: "Owner",       action: "Login",                   module: "Auth",        date: "2026-08-19", time: "09:02:14", ip: "192.168.1.101", result: "success", duration: 210,  detail: "Successful login via credentials." },
  { id: "al002", user: "Alex Mercer",   userRole: "Owner",       action: "Modified Security Settings", module: "Settings", date: "2026-08-19", time: "09:15:42", ip: "192.168.1.101", result: "success", duration: 884,  before: { sessionTimeout: "30 min", mfaRequired: "false" }, after: { sessionTimeout: "60 min", mfaRequired: "false" } },
  { id: "al003", user: "Sarah Okonkwo", userRole: "HR",          action: "Approved Leave — J. Martinez", module: "Attendance", date: "2026-08-19", time: "09:44:08", ip: "192.168.1.102", result: "success", duration: 342, before: { leaveStatus: "Pending" }, after: { leaveStatus: "Approved" }, detail: "Annual leave Aug 20–22 approved." },
  { id: "al004", user: "Raj Patel",     userRole: "Accounts",    action: "Created Invoice",         module: "Billing",     date: "2026-08-19", time: "10:02:33", ip: "192.168.1.103", result: "success", duration: 1240, after: { invoiceNo: "INV-2026-0184", client: "TechMetal Industries", amount: "₹84,200", status: "Draft" } },
  { id: "al005", user: "Luisa Dupont",  userRole: "Store",       action: "Material Issue",          module: "Inventory",   date: "2026-08-19", time: "10:18:57", ip: "192.168.1.104", result: "success", duration: 520,  before: { "AL6061-T6 Plate qty": "28 kg" }, after: { "AL6061-T6 Plate qty": "12 kg" }, detail: "Issued 16 kg to WO-2026-0841." },
  { id: "al006", user: "Kenji Tanaka",  userRole: "Production",  action: "Updated Work Order",      module: "Production",  date: "2026-08-19", time: "10:35:21", ip: "192.168.1.105", result: "success", duration: 412,  before: { produced: "24", status: "Running" }, after: { produced: "38", status: "Running" } },
  { id: "al007", user: "Unknown",       userRole: "—",           action: "Login Attempt (Failed)",  module: "Auth",        date: "2026-08-19", time: "11:04:03", ip: "182.75.43.12",  result: "failure", duration: 0,    detail: "3 consecutive failed login attempts from external IP. Account temporarily locked." },
  { id: "al008", user: "Sarah Okonkwo", userRole: "HR",          action: "Added Employee",          module: "HR",          date: "2026-08-19", time: "11:28:44", ip: "192.168.1.102", result: "success", duration: 1820, after: { empId: "EMP-156", name: "P. Kumar", department: "Production", designation: "CNC Operator" } },
  { id: "al009", user: "Alex Mercer",   userRole: "Owner",       action: "Manual Backup Initiated", module: "Backup",      date: "2026-08-19", time: "12:00:00", ip: "192.168.1.101", result: "success", duration: 4200, detail: "Manual backup completed. 14.8 MB, 11 files. Verification score: 97/100." },
  { id: "al010", user: "Raj Patel",     userRole: "Accounts",    action: "Payment Recorded",        module: "Payments",    date: "2026-08-19", time: "13:15:20", ip: "192.168.1.103", result: "success", duration: 620,  after: { amount: "₹2,84,000", client: "Precision Parts Ltd.", mode: "NEFT", ref: "HDFC20260819001" } },
  { id: "al011", user: "Kenji Tanaka",  userRole: "Production",  action: "Scrap Entry",             module: "Scrap",       date: "2026-08-19", time: "13:42:08", ip: "192.168.1.105", result: "success", duration: 310,  after: { qty: "3 pcs", partName: "Shaft Coupling", reason: "Dimensional Out of Tolerance", value: "₹1,800" } },
  { id: "al012", user: "Alex Mercer",   userRole: "Owner",       action: "Modified GST Settings",   module: "Settings",    date: "2026-08-19", time: "14:08:55", ip: "192.168.1.101", result: "success", duration: 540,  before: { eInvoice: "false" }, after: { eInvoice: "true" }, detail: "E-Invoice (IRN) generation enabled." },
  { id: "al013", user: "Luisa Dupont",  userRole: "Store",       action: "Created Purchase Order",  module: "Purchase",    date: "2026-08-19", time: "14:30:12", ip: "192.168.1.104", result: "success", duration: 1140, after: { poNo: "PO-2026-0053", supplier: "SteelCraft Metals", total: "₹64,200", status: "Pending Approval" } },
  { id: "al014", user: "System",        userRole: "Auto",        action: "Low Stock Alert",         module: "System",      date: "2026-08-19", time: "14:45:00", ip: "127.0.0.1",     result: "warning", duration: 0,    detail: "AL6061-T6 Plate fell below reorder point (12 kg < 50 kg). Alert dispatched." },
  { id: "al015", user: "Sarah Okonkwo", userRole: "HR",          action: "Export Attendance Report", module: "Reports",    date: "2026-08-19", time: "15:22:44", ip: "192.168.1.102", result: "success", duration: 3100, detail: "Attendance report for Aug 2026 exported as Excel (155 employees, 2480 records)." },
  { id: "al016", user: "Raj Patel",     userRole: "Accounts",    action: "Sent Invoice",            module: "Billing",     date: "2026-08-18", time: "16:04:11", ip: "192.168.1.103", result: "success", duration: 880,  before: { status: "Draft" }, after: { status: "Sent" }, detail: "INV-2026-0183 emailed to autodrivecomp@acmecnc.com." },
  { id: "al017", user: "Kenji Tanaka",  userRole: "Production",  action: "Machine Status Update",   module: "Machines",    date: "2026-08-18", time: "14:32:07", ip: "192.168.1.105", result: "warning", duration: 200,  before: { status: "Running" }, after: { status: "Breakdown" }, detail: "CNC-007 spindle fault reported. Maintenance notified." },
  { id: "al018", user: "System",        userRole: "Auto",        action: "Scheduled Backup",        module: "Backup",      date: "2026-08-18", time: "02:00:09", ip: "127.0.0.1",     result: "warning", duration: 6800, detail: "Backup completed with 2 non-critical checksum warnings. Score: 84/100." },
  { id: "al019", user: "Alex Mercer",   userRole: "Owner",       action: "Deleted User Session",    module: "Users",       date: "2026-08-18", time: "11:14:00", ip: "192.168.1.101", result: "success", duration: 180,  detail: "Session for EMP-031 forcibly terminated after IP change detected." },
  { id: "al020", user: "Raj Patel",     userRole: "Accounts",    action: "Modified Expense",        module: "Expenses",    date: "2026-08-18", time: "10:02:44", ip: "192.168.1.103", result: "success", duration: 430,  before: { amount: "₹8,400", category: "Utilities" }, after: { amount: "₹8,400", category: "Maintenance" }, detail: "Expense EXP-0284 recategorised from Utilities to Maintenance." },
]

/* ─── Helpers ─────────────────────────────────────────────── */
const RESULT_META: Record<AuditResult, { color: string; bg: string; label: string; icon: string }> = {
  success: { color: "#10b981", bg: "rgba(16,185,129,0.1)", label: "Success", icon: "✓" },
  failure: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "Failure", icon: "✕" },
  warning: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", label: "Warning", icon: "⚠" },
}

const ALL_MODULES = [...new Set(AUDIT_LOGS.map((l) => l.module))].sort() as AuditModule[]
const ALL_USERS   = [...new Set(AUDIT_LOGS.map((l) => l.user))].sort()

function fmtDuration(ms: number) {
  if (!ms) return "—"
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function isInternalIP(ip: string) {
  return ip.startsWith("192.168") || ip.startsWith("10.") || ip === "127.0.0.1"
}

/* ─── Diff view ───────────────────────────────────────────── */
function DiffTable({ before, after }: { before?: Record<string, string>; after?: Record<string, string> }) {
  if (!before && !after) return null
  const keys = [...new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])]
  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", overflow: "hidden", marginTop: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid var(--border-subtle)" }}>
        {["Field", "Before", "After"].map((h) => (
          <div key={h} style={{ padding: "7px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", borderRight: "1px solid var(--border-subtle)" }}>{h}</div>
        ))}
      </div>
      {keys.map((k) => {
        const bv = before?.[k]
        const av = after?.[k]
        const changed = bv !== av
        return (
          <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ padding: "8px 12px", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", borderRight: "1px solid var(--border-subtle)" }}>{k}</div>
            <div style={{ padding: "8px 12px", fontSize: 11, color: bv ? (changed ? "#ef4444" : "var(--text-secondary)") : "var(--text-disabled)", fontFamily: "var(--font-mono)", background: changed && bv ? "rgba(239,68,68,0.05)" : undefined, borderRight: "1px solid var(--border-subtle)", textDecoration: changed && bv ? "line-through" : undefined }}>
              {bv ?? "—"}
            </div>
            <div style={{ padding: "8px 12px", fontSize: 11, color: av ? (changed ? "#10b981" : "var(--text-secondary)") : "var(--text-disabled)", fontFamily: "var(--font-mono)", background: changed && av ? "rgba(16,185,129,0.05)" : undefined }}>
              {av ?? "—"}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Detail drawer ───────────────────────────────────────── */
function Drawer({ log, onClose }: { log: AuditLog; onClose: () => void }) {
  const rm = RESULT_META[log.result]
  const internal = isInternalIP(log.ip)

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(9,13,21,0.6)", backdropFilter: "blur(2px)", animation: "fade-in 0.15s ease-out" }} />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 501,
        width: "min(520px, 94vw)",
        background: "var(--bg-elevated)",
        borderLeft: "1px solid var(--border-default)",
        display: "flex", flexDirection: "column",
        animation: "slide-in-right 0.22s cubic-bezier(0.25,0.46,0.45,0.94)",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.4)",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 700, background: rm.bg, color: rm.color, padding: "2px 8px", borderRadius: 99, display: "flex", alignItems: "center", gap: 4 }}>
                <span>{rm.icon}</span>{rm.label}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>{log.id}</span>
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginTop: 6 }}>{log.action}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{log.module} · {log.date} at {log.time}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-raised)", border: "1px solid var(--border-default)", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {/* Actor */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Actor</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["User", log.user],
                ["Role", log.userRole],
                ["IP Address", log.ip],
                ["Network", internal ? "Internal (LAN)" : "External"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 2 }}>{k}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: k === "Network" ? (internal ? "#10b981" : "#f59e0b") : "var(--text-secondary)", fontWeight: k === "Network" ? 600 : 400 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timing */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Timing</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["Date", log.date],
                ["Time", log.time],
                ["Duration", fmtDuration(log.duration)],
                ["Module", log.module],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 2 }}>{k}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail note */}
          {log.detail && (
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Detail</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{log.detail}</div>
            </div>
          )}

          {/* Data changes */}
          {(log.before || log.after) && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Data Changes</div>
              <DiffTable before={log.before} after={log.after} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}

/* ─── Filter bar ──────────────────────────────────────────── */
function FilterBar({ search, onSearch, dateFrom, dateTo, onDateFrom, onDateTo, userFilter, onUser, moduleFilter, onModule, resultFilter, onResult, onClear }: {
  search: string; onSearch: (v: string) => void
  dateFrom: string; dateTo: string; onDateFrom: (v: string) => void; onDateTo: (v: string) => void
  userFilter: string; onUser: (v: string) => void
  moduleFilter: string; onModule: (v: string) => void
  resultFilter: string; onResult: (v: string) => void
  onClear: () => void
}) {
  const inputBase: React.CSSProperties = {
    padding: "7px 11px", background: "var(--bg-surface)", border: "1px solid var(--border-default)",
    borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 12,
    fontFamily: "var(--font-body)", outline: "none", height: 34, boxSizing: "border-box",
  }
  const selBase: React.CSSProperties = { ...inputBase, cursor: "pointer" }
  const hasFilter = search || dateFrom || dateTo || userFilter || moduleFilter || resultFilter

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
      <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search action, user, detail…" style={{ ...inputBase, flex: "1 1 200px", minWidth: 200 }} onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)" }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)" }} />
      <input type="date" value={dateFrom} onChange={(e) => onDateFrom(e.target.value)} style={{ ...inputBase, width: 130 }} title="From date" />
      <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>→</span>
      <input type="date" value={dateTo} onChange={(e) => onDateTo(e.target.value)} style={{ ...inputBase, width: 130 }} title="To date" />
      <select value={userFilter} onChange={(e) => onUser(e.target.value)} style={{ ...selBase, minWidth: 140 }}>
        <option value="">All Users</option>
        {ALL_USERS.map((u) => <option key={u} value={u}>{u}</option>)}
      </select>
      <select value={moduleFilter} onChange={(e) => onModule(e.target.value)} style={{ ...selBase, minWidth: 130 }}>
        <option value="">All Modules</option>
        {ALL_MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={resultFilter} onChange={(e) => onResult(e.target.value)} style={{ ...selBase, minWidth: 110 }}>
        <option value="">All Results</option>
        <option value="success">Success</option>
        <option value="failure">Failure</option>
        <option value="warning">Warning</option>
      </select>
      {hasFilter && (
        <button onClick={onClear} style={{ padding: "7px 12px", background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", fontFamily: "var(--font-body)", height: 34 }}>
          Clear ✕
        </button>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
interface Props { onNavigate?: (id: string) => void }

export function AuditLogsModule({ onNavigate }: Props) {
  const [search, setSearch]           = useState("")
  const [dateFrom, setDateFrom]       = useState("")
  const [dateTo, setDateTo]           = useState("")
  const [userFilter, setUserFilter]   = useState("")
  const [moduleFilter, setModuleFilter] = useState("")
  const [resultFilter, setResultFilter] = useState("")
  const [selected, setSelected]       = useState<AuditLog | null>(null)
  const [page, setPage]               = useState(1)
  const PER_PAGE = 15

  const filtered = useMemo(() => {
    return AUDIT_LOGS.filter((l) => {
      if (search && !l.action.toLowerCase().includes(search.toLowerCase()) &&
          !l.user.toLowerCase().includes(search.toLowerCase()) &&
          !(l.detail ?? "").toLowerCase().includes(search.toLowerCase())) return false
      if (dateFrom && l.date < dateFrom) return false
      if (dateTo   && l.date > dateTo)   return false
      if (userFilter   && l.user   !== userFilter)   return false
      if (moduleFilter && l.module !== moduleFilter) return false
      if (resultFilter && l.result !== resultFilter) return false
      return true
    })
  }, [search, dateFrom, dateTo, userFilter, moduleFilter, resultFilter])

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const clear = () => { setSearch(""); setDateFrom(""); setDateTo(""); setUserFilter(""); setModuleFilter(""); setResultFilter(""); setPage(1) }

  const counts = {
    total:   AUDIT_LOGS.length,
    success: AUDIT_LOGS.filter((l) => l.result === "success").length,
    failure: AUDIT_LOGS.filter((l) => l.result === "failure").length,
    warning: AUDIT_LOGS.filter((l) => l.result === "warning").length,
  }

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      {selected && <Drawer log={selected} onClose={() => setSelected(null)} />}

      <PageHeader
        title="Audit Logs"
        description="Complete record of user actions, data changes and system events"
        accentColor="#64748b"
        badge={{ label: "Immutable Record", variant: "neutral" }}
        secondaryActions={[{ label: "Export Logs", onClick: () => {} }]}
      />

      {/* Summary tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }} className="al-stat-grid">
        {[
          { label: "Total Events",  value: counts.total,   color: "#64748b" },
          { label: "Successful",    value: counts.success,  color: "#10b981" },
          { label: "Failures",      value: counts.failure,  color: "#ef4444" },
          { label: "Warnings",      value: counts.warning,  color: "#f59e0b" },
        ].map((k) => (
          <div key={k.label} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "14px 16px", borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 26, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <FilterBar
        search={search} onSearch={(v) => { setSearch(v); setPage(1) }}
        dateFrom={dateFrom} dateTo={dateTo}
        onDateFrom={(v) => { setDateFrom(v); setPage(1) }} onDateTo={(v) => { setDateTo(v); setPage(1) }}
        userFilter={userFilter} onUser={(v) => { setUserFilter(v); setPage(1) }}
        moduleFilter={moduleFilter} onModule={(v) => { setModuleFilter(v); setPage(1) }}
        resultFilter={resultFilter} onResult={(v) => { setResultFilter(v); setPage(1) }}
        onClear={clear}
      />

      {/* Table */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 880 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-raised)" }}>
                {["Result", "User", "Role", "Action", "Module", "Date", "Time", "IP", "Duration"].map((h) => (
                  <th key={h} style={{ padding: "10px 13px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No audit logs match your filters.</td>
                </tr>
              ) : paged.map((l) => {
                const rm = RESULT_META[l.result]
                const internal = isInternalIP(l.ip)
                const hasDiff  = !!(l.before || l.after)
                return (
                  <tr
                    key={l.id}
                    onClick={() => setSelected(l)}
                    style={{ borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", transition: "background 0.1s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-raised)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
                  >
                    {/* Result */}
                    <td style={{ padding: "11px 13px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: rm.color, background: rm.bg, padding: "2px 8px", borderRadius: 99 }}>
                        <span>{rm.icon}</span>{rm.label}
                      </span>
                    </td>
                    {/* User */}
                    <td style={{ padding: "11px 13px" }}>
                      <div style={{ fontWeight: 600, fontSize: 12, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{l.user}</div>
                    </td>
                    {/* Role */}
                    <td style={{ padding: "11px 13px" }}>
                      <span style={{ fontSize: 10, color: "var(--text-muted)", background: "var(--bg-raised)", padding: "1px 7px", borderRadius: 99 }}>{l.userRole}</span>
                    </td>
                    {/* Action */}
                    <td style={{ padding: "11px 13px", maxWidth: 240 }}>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {l.action}
                        {hasDiff && <span style={{ marginLeft: 6, fontSize: 9, color: "#06b6d4", fontWeight: 700 }}>DIFF</span>}
                      </div>
                    </td>
                    {/* Module */}
                    <td style={{ padding: "11px 13px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{l.module}</span>
                    </td>
                    {/* Date */}
                    <td style={{ padding: "11px 13px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{l.date}</td>
                    {/* Time */}
                    <td style={{ padding: "11px 13px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{l.time}</td>
                    {/* IP */}
                    <td style={{ padding: "11px 13px", whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: internal ? "var(--text-muted)" : "#f59e0b", fontWeight: internal ? 400 : 600 }}>{l.ip}</span>
                    </td>
                    {/* Duration */}
                    <td style={{ padding: "11px 13px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{fmtDuration(l.duration)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderTop: "1px solid var(--border-subtle)", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {filtered.length === 0 ? "0 records" : `${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length} records`}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ padding: "5px 11px", background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", color: page <= 1 ? "var(--text-disabled)" : "var(--text-secondary)", fontSize: 12, cursor: page <= 1 ? "not-allowed" : "pointer", fontFamily: "var(--font-body)" }}>← Prev</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={{ padding: "5px 9px", background: page === p ? "var(--primary)" : "none", border: `1px solid ${page === p ? "var(--primary)" : "var(--border-default)"}`, borderRadius: "var(--radius-xs)", color: page === p ? "#fff" : "var(--text-secondary)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-mono)" }}>{p}</button>
            ))}
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} style={{ padding: "5px 11px", background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", color: page >= totalPages ? "var(--text-disabled)" : "var(--text-secondary)", fontSize: 12, cursor: page >= totalPages ? "not-allowed" : "pointer", fontFamily: "var(--font-body)" }}>Next →</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-disabled)", textAlign: "center" }}>
        Audit logs are immutable. Records are retained for 180 days per security policy. Click any row to view full detail and data diff.
      </div>

      <style>{`@media(max-width:900px){.al-stat-grid{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  )
}
