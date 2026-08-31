import { useState, type ReactNode } from "react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

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

/* ── Status badge inline ─────────────────────────────────── */
function StatusDot({ color }: { color: string }) {
  return (
    <span
      className="pulse-dot"
      style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }}
    />
  )
}

function Badge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; border: string }> = {
    Running:     { color: "var(--success)", bg: "var(--success-bg)", border: "var(--success-border)" },
    Idle:        { color: "var(--warning)", bg: "var(--warning-bg)", border: "var(--warning-border)" },
    Maintenance: { color: "var(--info)",    bg: "var(--info-bg)",    border: "var(--info-border)" },
    Offline:     { color: "var(--error)",   bg: "var(--error-bg)",   border: "var(--error-border)" },
    Completed:   { color: "var(--success)", bg: "var(--success-bg)", border: "var(--success-border)" },
    "In Progress":{ color: "var(--primary)", bg: "var(--primary-subtle)", border: "var(--primary-subtle)" },
    Queued:      { color: "var(--text-secondary)", bg: "var(--bg-raised)", border: "var(--border-default)" },
  }
  const s = map[status] ?? map["Queued"]
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px",
        borderRadius: "var(--radius-xs)",
        background: s.bg,
        border: `1px solid ${s.border}`,
        fontSize: 11,
        fontWeight: 500,
        color: s.color,
        fontFamily: "var(--font-body)",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      <StatusDot color={s.color} />
      {status}
    </span>
  )
}

/* ── Tables section ──────────────────────────────────────── */
function TablesSection() {
  const [sortField, setSortField] = useState<string>("machine")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const PER_PAGE = 8

  const machines = [
    { id: "CNC-001", machine: "Haas VF-2", operator: "J. Martinez", status: "Running", program: "OP-10-AL6061", parts: 142, uptime: "98.4%", rpm: "4,200" },
    { id: "CNC-002", machine: "Mazak QT-35", operator: "S. Okonkwo", status: "Running", program: "TURN-304SS-V3", parts: 88, uptime: "96.1%", rpm: "3,800" },
    { id: "CNC-003", machine: "DMG NHX 5000", operator: "R. Tanaka", status: "Idle", program: "—", parts: 0, uptime: "0%", rpm: "0" },
    { id: "CNC-004", machine: "Okuma MB-5000H", operator: "L. Patel", status: "Maintenance", program: "SCHEDULED", parts: 0, uptime: "0%", rpm: "0" },
    { id: "CNC-005", machine: "Fanuc Robodrill", operator: "A. Müller", status: "Running", program: "DRILL-TMPLT-04", parts: 316, uptime: "99.2%", rpm: "8,500" },
    { id: "CNC-006", machine: "Haas ST-35", operator: "C. Dupont", status: "Running", program: "LATHE-V2-SHAFT", parts: 57, uptime: "97.8%", rpm: "2,600" },
    { id: "CNC-007", machine: "Makino PS105", operator: "—", status: "Offline", program: "—", parts: 0, uptime: "0%", rpm: "0" },
    { id: "CNC-008", machine: "Brother Speedio", operator: "F. Kim", status: "Running", program: "SMALL-PART-072", parts: 489, uptime: "99.7%", rpm: "12,000" },
    { id: "CNC-009", machine: "Haas VF-4SS", operator: "M. García", status: "In Progress", program: "SETUP-OP30", parts: 12, uptime: "78.4%", rpm: "6,100" },
    { id: "CNC-010", machine: "Matsuura MX-850", operator: "D. Chen", status: "Running", program: "5AX-IMPELLER-V1", parts: 3, uptime: "94.6%", rpm: "15,000" },
  ]

  const sorted = [...machines].sort((a, b) => {
    const av = (a as Record<string, string | number>)[sortField]
    const bv = (b as Record<string, string | number>)[sortField]
    return String(av).localeCompare(String(bv)) * (sortDir === "asc" ? 1 : -1)
  })

  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const paged = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggleSort = (field: string) => {
    if (sortField === field) setDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("asc") }
  }

  function setDir(d: "asc" | "desc") { setSortDir(d) }

  const toggleRow = (id: string) => {
    const s = new Set(selected)
    s.has(id) ? s.delete(id) : s.add(id)
    setSelected(s)
  }

  const allSelected = paged.every((r) => selected.has(r.id))
  const toggleAll = () => {
    if (allSelected) {
      const s = new Set(selected)
      paged.forEach((r) => s.delete(r.id))
      setSelected(s)
    } else {
      const s = new Set(selected)
      paged.forEach((r) => s.add(r.id))
      setSelected(s)
    }
  }

  const SortIcon = ({ field }: { field: string }) => (
    <span style={{ marginLeft: 4, color: sortField === field ? "var(--primary)" : "var(--text-muted)", fontSize: 10 }}>
      {sortField === field ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  )

  return (
    <div>
      <SectionHeading
        overline="Components / Tables"
        title="Data Tables"
        desc="Enterprise-grade tables with sorting, row selection, pagination, and inline status. Designed for high-density manufacturing data at 8 rows per page."
      />

      <Block title="Machine Status Table">
        {/* Table toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderBottom: "none",
            borderRadius: "var(--radius-md) var(--radius-md) 0 0",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>
            Active Machines
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {sorted.length} total
          </div>
          {selected.size > 0 && (
            <span style={{ fontSize: 11, color: "var(--primary)", fontFamily: "var(--font-mono)" }}>
              {selected.size} selected
            </span>
          )}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              style={{
                padding: "5px 12px",
                fontSize: 12,
                background: "var(--bg-raised)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              Export CSV
            </button>
            <button
              style={{
                padding: "5px 12px",
                fontSize: 12,
                background: "var(--primary)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                color: "#fff",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              + Add Machine
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ border: "1px solid var(--border-default)", overflow: "hidden", borderRadius: "0 0 var(--radius-md) var(--radius-md)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-default)" }}>
                <th style={{ width: 40, padding: "10px 16px" }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: "pointer", accentColor: "var(--primary)" }} />
                </th>
                {[
                  { label: "Machine", field: "machine" },
                  { label: "Operator", field: "operator" },
                  { label: "Status", field: "status" },
                  { label: "Program", field: "program" },
                  { label: "Parts / Shift", field: "parts" },
                  { label: "Uptime", field: "uptime" },
                  { label: "Spindle RPM", field: "rpm" },
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    onClick={() => toggleSort(field)}
                    style={{
                      padding: "10px 12px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: sortField === field ? "var(--primary)" : "var(--text-muted)",
                      cursor: "pointer",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {label}<SortIcon field={field} />
                  </th>
                ))}
                <th style={{ padding: "10px 12px", width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {paged.map((row, i) => {
                const isSelected = selected.has(row.id)
                return (
                  <tr
                    key={row.id}
                    onClick={() => toggleRow(row.id)}
                    style={{
                      background: isSelected ? "rgba(37,99,235,0.07)" : i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg-surface)",
                      borderBottom: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      transition: "background 0.12s ease",
                    }}
                    onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-raised)" }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = isSelected ? "rgba(37,99,235,0.07)" : i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg-surface)" }}
                  >
                    <td style={{ padding: "10px 16px" }}>
                      <input type="checkbox" checked={isSelected} onChange={() => {}} style={{ accentColor: "var(--primary)", cursor: "pointer" }} />
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontWeight: 500, color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>{row.machine}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 1 }}>{row.id}</div>
                    </td>
                    <td style={{ padding: "10px 12px", color: row.operator === "—" ? "var(--text-muted)" : "var(--text-secondary)", fontSize: 12 }}>{row.operator}</td>
                    <td style={{ padding: "10px 12px" }}><Badge status={row.status} /></td>
                    <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>{row.program}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>
                      {row.parts > 0 ? row.parts.toLocaleString() : <span style={{ color: "var(--text-muted)" }}>—</span>}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 500, color: row.uptime === "0%" ? "var(--text-muted)" : parseFloat(row.uptime) > 95 ? "var(--success)" : "var(--warning)" }}>
                        {row.uptime}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)" }}>{row.rpm}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 16, padding: 0 }}>⋯</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 16px",
              borderTop: "1px solid var(--border-subtle)",
              background: "var(--bg-surface)",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, sorted.length)} of {sorted.length}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["«", "‹", ...Array.from({ length: totalPages }, (_, i) => String(i + 1)), "›", "»"].map((p, i) => {
                const isNum = !isNaN(Number(p))
                const isCurrent = isNum && Number(p) === page
                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (p === "«") setPage(1)
                      else if (p === "‹") setPage(Math.max(1, page - 1))
                      else if (p === "›") setPage(Math.min(totalPages, page + 1))
                      else if (p === "»") setPage(totalPages)
                      else setPage(Number(p))
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      background: isCurrent ? "var(--primary)" : "transparent",
                      color: isCurrent ? "#fff" : "var(--text-secondary)",
                      border: `1px solid ${isCurrent ? "var(--primary)" : "var(--border-default)"}`,
                      borderRadius: "var(--radius-xs)",
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </Block>

      <Block title="Compact Data Table">
        <div style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-default)" }}>
                {["Work Order", "Part #", "Qty", "Due Date", "Status", "Priority"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { wo: "WO-2024-0841", part: "AL6061-FLG-V3", qty: 250, due: "Aug 15, 2026", status: "In Progress", priority: "Rush" },
                { wo: "WO-2024-0842", part: "SS304-SHAFT-12", qty: 50,  due: "Aug 16, 2026", status: "Queued",      priority: "Standard" },
                { wo: "WO-2024-0843", part: "TI64-BRACKET-A", qty: 10,  due: "Aug 18, 2026", status: "Queued",      priority: "Standard" },
                { wo: "WO-2024-0838", part: "4140-SPINDLE-V2", qty: 5,   due: "Aug 14, 2026", status: "Completed",   priority: "Rush" },
                { wo: "WO-2024-0835", part: "AL7075-HOUSING",  qty: 100, due: "Aug 20, 2026", status: "Queued",      priority: "Standard" },
              ].map((r, i) => (
                <tr key={r.wo} style={{ borderBottom: "1px solid var(--border-subtle)", background: i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg-surface)" }}>
                  <td style={{ padding: "8px 12px", fontFamily: "var(--font-mono)", color: "var(--primary)", fontWeight: 500 }}>{r.wo}</td>
                  <td style={{ padding: "8px 12px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{r.part}</td>
                  <td style={{ padding: "8px 12px", fontFamily: "var(--font-mono)", color: "var(--text-primary)", textAlign: "right" }}>{r.qty}</td>
                  <td style={{ padding: "8px 12px", color: "var(--text-secondary)" }}>{r.due}</td>
                  <td style={{ padding: "8px 12px" }}><Badge status={r.status} /></td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: r.priority === "Rush" ? "var(--warning)" : "var(--text-muted)", letterSpacing: "0.06em" }}>
                      {r.priority === "Rush" ? "⚡ RUSH" : "STANDARD"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>
    </div>
  )
}

/* ── Cards section ───────────────────────────────────────── */
const chartData = [
  { time: "06:00", oee: 94, parts: 42, defects: 1 },
  { time: "07:00", oee: 97, parts: 58, defects: 0 },
  { time: "08:00", oee: 96, parts: 55, defects: 1 },
  { time: "09:00", oee: 92, parts: 48, defects: 2 },
  { time: "10:00", oee: 98, parts: 61, defects: 0 },
  { time: "11:00", oee: 99, parts: 64, defects: 0 },
  { time: "12:00", oee: 87, parts: 38, defects: 3 },
  { time: "13:00", oee: 95, parts: 53, defects: 1 },
  { time: "14:00", oee: 97, parts: 59, defects: 0 },
]

const weekData = [
  { day: "Mon", actual: 420, target: 400 },
  { day: "Tue", actual: 390, target: 400 },
  { day: "Wed", actual: 448, target: 400 },
  { day: "Thu", actual: 412, target: 400 },
  { day: "Fri", actual: 435, target: 400 },
  { day: "Sat", actual: 180, target: 200 },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", padding: "10px 14px", boxShadow: "var(--shadow-md)" }}>
      <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ fontSize: 12, color: p.color, fontFamily: "var(--font-mono)", display: "flex", gap: 8, justifyContent: "space-between" }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function StatCard({ label, value, unit, change, changeLabel, color = "var(--primary)" }: {
  label: string; value: string; unit?: string; change?: number; changeLabel?: string; color?: string
}) {
  const isPos = (change ?? 0) >= 0
  return (
    <div
      style={{
        padding: "20px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
        borderLeft: `3px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 600, color, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{unit}</span>}
      </div>
      {change !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: isPos ? "var(--success)" : "var(--error)" }}>
          <span>{isPos ? "▲" : "▼"}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>{Math.abs(change)}%</span>
          <span style={{ color: "var(--text-muted)" }}>{changeLabel}</span>
        </div>
      )}
    </div>
  )
}

function CardsSection() {
  return (
    <div>
      <SectionHeading
        overline="Components / Cards & Widgets"
        title="Cards & Data Widgets"
        desc="Stat cards, KPI tiles, chart panels, and summary cards. All cards use var(--bg-elevated) as base and a 3px colored left border for semantic color coding."
      />

      <Block title="KPI Stat Cards">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <StatCard label="Overall OEE" value="96.4" unit="%" change={2.1} changeLabel="vs yesterday" color="var(--primary)" />
          <StatCard label="Parts Completed" value="4,218" change={8.3} changeLabel="vs avg" color="var(--success)" />
          <StatCard label="Defect Rate" value="0.42" unit="%" change={-0.18} changeLabel="vs last week" color="var(--warning)" />
          <StatCard label="Machines Running" value="7/10" change={0} changeLabel="machines active" color="var(--accent)" />
        </div>
      </Block>

      <Block title="Chart Panels">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          {/* Area chart */}
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>OEE Trend — Today</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>Aug 13, 2026 — Day Shift</div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600, color: "var(--primary)" }}>96.4%</div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="oeeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="oee" name="OEE %" stroke="#2563eb" strokeWidth={2} fill="url(#oeeGrad)" dot={false} activeDot={{ r: 4, fill: "#2563eb" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart */}
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>Parts Output</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>This week vs target</div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="target" name="Target" fill="rgba(37,99,235,0.15)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="#2563eb" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line chart */}
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 20, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>Hourly Parts & Defects</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>Dual-axis comparison</div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {[{ label: "Parts", color: "#06b6d4" }, { label: "Defects", color: "#ef4444" }].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-secondary)" }}>
                  <div style={{ width: 12, height: 2, background: l.color, borderRadius: 1 }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="parts" name="Parts" stroke="#06b6d4" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="defects" name="Defects" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Block>

      <Block title="Summary Cards">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            {
              title: "Maintenance Due",
              icon: "⚙",
              color: "var(--warning)",
              items: ["CNC-003 — Spindle bearing", "CNC-007 — Coolant pump", "CNC-004 — Tool changer"],
              count: 3,
            },
            {
              title: "Quality Alerts",
              icon: "◈",
              color: "var(--error)",
              items: ["WO-0838: 2 defects flagged", "CNC-009: Dimension out of spec", "Part PN-7729: Hold placed"],
              count: 3,
            },
            {
              title: "Pending Work Orders",
              icon: "◉",
              color: "var(--primary)",
              items: ["WO-0842 — SS304 Shaft ×50", "WO-0843 — Ti64 Bracket ×10", "WO-0845 — Al Flange ×200"],
              count: 7,
            },
          ].map((c) => (
            <div
              key={c.title}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                borderTop: `2px solid ${c.color}`,
                borderRadius: "var(--radius-md)",
                padding: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, color: c.color }}>{c.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>{c.title}</span>
                </div>
                <span style={{ fontSize: 18, fontFamily: "var(--font-mono)", fontWeight: 700, color: c.color }}>{c.count}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {c.items.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      padding: "5px 0",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Progress & Meter Cards">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {[
            { label: "Daily Production Target", value: 87, color: "var(--primary)", suffix: "4,218 / 4,850 pcs" },
            { label: "Shift Utilization", value: 94, color: "var(--success)", suffix: "Excellent" },
            { label: "Defect Rate vs Limit", value: 42, color: "var(--warning)", suffix: "0.42% / 1.00% limit" },
            { label: "Coolant Level", value: 23, color: "var(--error)", suffix: "Low — refill required" },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                padding: "16px 20px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{m.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 600, color: m.color }}>{m.value}%</span>
              </div>
              <div style={{ height: 6, background: "var(--bg-overlay)", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                <div
                  style={{
                    height: "100%",
                    width: `${m.value}%`,
                    background: m.color,
                    borderRadius: 3,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{m.suffix}</div>
            </div>
          ))}
        </div>
      </Block>
    </div>
  )
}

/* ── Export ──────────────────────────────────────────────── */
export function DataSection({ active }: Props) {
  if (active === "tables") return <TablesSection />
  if (active === "cards") return <CardsSection />
  return null
}
