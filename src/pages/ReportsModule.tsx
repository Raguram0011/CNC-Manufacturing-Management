import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from "recharts"
import { PageHeader } from "../shell/PageHeader"

/* ─── Types ───────────────────────────────────────────────── */
type ReportCategory =
  | "overview" | "billing" | "payments" | "expenses"
  | "stock" | "purchase" | "production" | "attendance"
  | "machines" | "quality" | "scrap"

type DatePreset = "today" | "week" | "month" | "quarter" | "year" | "custom"
type ChartState = "loading" | "ready" | "empty" | "error"

interface Filter {
  datePreset: DatePreset
  dateFrom: string
  dateTo: string
  department: string
  employee: string
  material: string
  supplier: string
  status: string
}

/* ─── Color palette ───────────────────────────────────────── */
const C = {
  blue:   "#2563eb",
  cyan:   "#06b6d4",
  green:  "#10b981",
  yellow: "#f59e0b",
  red:    "#ef4444",
  purple: "#a78bfa",
  pink:   "#f472b6",
  teal:   "#14b8a6",
  orange: "#fb923c",
  slate:  "#64748b",
}
const PALETTE = Object.values(C)

/* ─── Categories config ───────────────────────────────────── */
const CATEGORIES: { id: ReportCategory; label: string; icon: string; color: string; description: string }[] = [
  { id: "overview",    label: "Overview",    icon: "⬡", color: C.blue,   description: "Cross-module executive summary" },
  { id: "billing",     label: "Billing",     icon: "◈", color: C.green,  description: "Revenue, invoices & receivables" },
  { id: "payments",    label: "Payments",    icon: "◇", color: C.cyan,   description: "Payment tracking & aging" },
  { id: "expenses",    label: "Expenses",    icon: "◉", color: C.yellow, description: "Operational cost analysis" },
  { id: "stock",       label: "Stock",       icon: "⬜", color: C.teal,   description: "Inventory levels & valuation" },
  { id: "purchase",    label: "Purchase",    icon: "⬛", color: C.purple, description: "Procurement spend & lead time" },
  { id: "production",  label: "Production",  icon: "⬟", color: C.orange, description: "Output, OEE & efficiency" },
  { id: "attendance",  label: "Attendance",  icon: "⬡", color: C.pink,   description: "Workforce presence & leave" },
  { id: "quality",     label: "Quality",     icon: "◈", color: C.green,  description: "Defects, inspection & yield" },
  { id: "scrap",       label: "Scrap",       icon: "◉", color: C.red,    description: "Scrap quantities & value" },
]

/* ─── Sample data ─────────────────────────────────────────── */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"]
const WEEKS  = ["W28","W29","W30","W31","W32","W33","W34"]

// Billing
const billingMonthly = MONTHS.map((m, i) => ({
  month: m,
  invoiced: 180000 + i * 18000 + Math.sin(i) * 12000,
  collected: 140000 + i * 15000 + Math.cos(i) * 8000,
  outstanding: 40000 + i * 3000,
}))
const billingByClient = [
  { name: "TechMetal Industries",     value: 284500 },
  { name: "Precision Autoparts Ltd",  value: 198200 },
  { name: "Hydraulic Systems Pvt",    value: 152400 },
  { name: "Aero Dynamics Corp",       value: 118000 },
  { name: "Global Forge Works",       value: 86300 },
  { name: "Others",                   value: 64800 },
]
const invoiceAging = [
  { bucket: "Current", amount: 124000 },
  { bucket: "1–30d",   amount: 68400 },
  { bucket: "31–60d",  amount: 34200 },
  { bucket: "61–90d",  amount: 18600 },
  { bucket: ">90d",    amount: 9200 },
]

// Payments
const paymentMonthly = MONTHS.map((m, i) => ({
  month: m,
  received: 135000 + i * 14000 + Math.sin(i + 1) * 9000,
  bank: 70000 + i * 8000,
  upi: 40000 + i * 4000,
  cheque: 25000 + i * 2000,
}))
const paymentMethods = [
  { name: "Bank Transfer", value: 52 },
  { name: "UPI",           value: 28 },
  { name: "Cheque",        value: 12 },
  { name: "NEFT/RTGS",     value: 8 },
]

// Expenses
const expenseMonthly = MONTHS.map((m, i) => ({
  month: m,
  raw_materials: 28000 + i * 1200,
  salaries:      32000 + i * 500,
  utilities:     8000  + Math.sin(i) * 1200,
  maintenance:   6000  + i * 800,
  transport:     4800  + Math.cos(i) * 600,
}))
const expenseByCategory = [
  { name: "Raw Materials", value: 34 },
  { name: "Salaries",      value: 28 },
  { name: "Utilities",     value: 12 },
  { name: "Maintenance",   value: 10 },
  { name: "Transport",     value: 8 },
  { name: "Other",         value: 8 },
]

// Stock
const stockByCategory = [
  { cat: "Raw Material",  value: 620000, items: 48 },
  { cat: "Cutting Tools", value: 180000, items: 120 },
  { cat: "Consumables",   value: 84000,  items: 60 },
  { cat: "Fasteners",     value: 38000,  items: 200 },
  { cat: "Measuring",     value: 64000,  items: 32 },
  { cat: "Safety",        value: 24000,  items: 48 },
]
const stockMovement = WEEKS.map((w, i) => ({
  week: w,
  receipts:  82000 + i * 4000 + Math.sin(i) * 6000,
  issues:    74000 + i * 3200 + Math.cos(i) * 4000,
  returns:   2800  + Math.sin(i + 2) * 800,
}))
const lowStockItems = [
  { code: "RM-001", name: "AL6061-T6 Plate", current: 12, min: 50, unit: "kg", value: 2640 },
  { code: "CT-008", name: "Carbide Insert CNMG", current: 8, min: 20, unit: "pcs", value: 4800 },
  { code: "CN-003", name: "Coolant HC7 20L", current: 2, min: 5, unit: "drums", value: 3200 },
  { code: "RM-007", name: "SS304 Bar 50mm", current: 3, min: 10, unit: "pcs", value: 2100 },
]

// Purchase
const purchaseMonthly = MONTHS.map((m, i) => ({
  month: m,
  ordered: 92000 + i * 5000 + Math.sin(i) * 8000,
  received: 86000 + i * 4500 + Math.cos(i) * 6000,
}))
const purchaseBySupplier = [
  { name: "SteelCraft Metals",   value: 284000 },
  { name: "CarbidePro Tools",    value: 162000 },
  { name: "Fluids India Ltd",    value: 98000 },
  { name: "FastTech Solutions",  value: 64000 },
  { name: "Others",              value: 42000 },
]

// Production
const productionWeekly = WEEKS.map((w, i) => ({
  week: w,
  planned: 2000,
  produced: 1800 + i * 40 + Math.sin(i) * 120,
  rejected: 40   + Math.cos(i) * 10,
  rework:   28   + Math.sin(i + 1) * 8,
}))

// Attendance
const attendanceWeekly = WEEKS.map((w, i) => ({
  week: w,
  present: 142 + Math.floor(Math.sin(i) * 4),
  absent:  8   + Math.floor(Math.cos(i) * 2),
  leave:   5   + Math.floor(Math.sin(i + 1) * 1),
}))
const leaveByType = [
  { name: "Annual Leave",    value: 42 },
  { name: "Sick Leave",      value: 18 },
  { name: "Casual Leave",    value: 14 },
  { name: "Comp-off",        value: 8 },
  { name: "Unpaid",          value: 4 },
]
const deptAttendance = [
  { dept: "Production", rate: 94.2, headcount: 82 },
  { dept: "Quality",    rate: 97.8, headcount: 14 },
  { dept: "Store",      rate: 96.1, headcount: 18 },
  { dept: "Accounts",   rate: 98.2, headcount: 8 },
  { dept: "HR",         rate: 99.0, headcount: 6 },
]



// Quality
const qualityWeekly = WEEKS.map((w, i) => ({
  week: w,
  inspected: 280 + i * 12 + Math.floor(Math.sin(i) * 20),
  accepted:  264 + i * 12 + Math.floor(Math.cos(i) * 15),
  rejected:  8   + Math.floor(Math.sin(i + 1) * 3),
  rework:    8   + Math.floor(Math.cos(i + 2) * 2),
}))
const defectPareto = [
  { reason: "Dimensional",   count: 38, cumulative: 38 },
  { reason: "Surface Finish",count: 22, cumulative: 60 },
  { reason: "Material Defect",count: 18, cumulative: 78 },
  { reason: "Tool Mark",     count: 12, cumulative: 90 },
  { reason: "Other",         count: 10, cumulative: 100 },
]

// Scrap
const scrapMonthly = MONTHS.map((m, i) => ({
  month: m,
  qty: 8  + Math.floor(Math.sin(i) * 3),
  value: 12400 + i * 400 + Math.floor(Math.sin(i) * 2000),
}))
const scrapByReason = [
  { name: "Dimensional Reject", value: 34 },
  { name: "Material Defect",    value: 28 },
  { name: "Tool Crash",         value: 18 },
  { name: "Setup Trial",        value: 12 },
  { name: "Other",              value: 8 },
]

/* ─── Helpers ─────────────────────────────────────────────── */
const INR = (v: number) => "₹" + (v >= 100000 ? (v / 100000).toFixed(2) + "L" : v.toLocaleString("en-IN"))
const PCT = (v: number) => v.toFixed(1) + "%"
function trend(values: number[]): number {
  if (values.length < 2) return 0
  const last = values[values.length - 1], prev = values[values.length - 2]
  return parseFloat((((last - prev) / prev) * 100).toFixed(1))
}

/* ─── Shared chart tooltip ───────────────────────────────── */
function ChartTip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", padding: "10px 14px", boxShadow: "var(--shadow-lg)", backdropFilter: "blur(8px)" }}>
      {label && <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: 6, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 5 }}>{label}</div>}
      {payload.map((p) => (
        <div key={p.name} style={{ fontSize: 12, fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0, display: "inline-block" }} />
          <span style={{ color: "var(--text-secondary)", flex: 1, minWidth: 80 }}>{p.name}</span>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{typeof p.value === "number" && p.value > 1000 ? INR(p.value) : typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Chart wrapper with states ──────────────────────────── */
function ChartCard({
  title, subtitle, state = "ready", height = 200, children, actions,
}: {
  title: string; subtitle?: string; state?: ChartState; height?: number
  children: React.ReactNode; actions?: React.ReactNode
}) {
  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{subtitle}</div>}
        </div>
        {actions && <div style={{ display: "flex", gap: 6 }}>{actions}</div>}
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        {state === "loading" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div className="skeleton" style={{ width: "80%", height: 12, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: "60%", height: 12, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: "70%", height: height - 60, borderRadius: "var(--radius-sm)" }} />
          </div>
        )}
        {state === "empty" && (
          <div style={{ height, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 32, opacity: 0.2 }}>◈</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>No data for this period</div>
            <div style={{ fontSize: 11, color: "var(--text-disabled)" }}>Adjust filters to see results</div>
          </div>
        )}
        {state === "error" && (
          <div style={{ height, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 28, color: "var(--error)", opacity: 0.5 }}>✕</div>
            <div style={{ fontSize: 12, color: "var(--error)" }}>Failed to load chart data</div>
            <button style={{ fontSize: 11, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>Retry</button>
          </div>
        )}
        {state === "ready" && <div style={{ padding: "12px 18px 16px" }}>{children}</div>}
      </div>
    </div>
  )
}

/* ─── KPI Card ───────────────────────────────────────────── */
function KpiCard({ label, value, unit, change, color, sub, prefix, large }: {
  label: string; value: string | number; unit?: string; change?: number
  color: string; sub?: string; prefix?: string; large?: boolean
}) {
  const [displayed, setDisplayed] = useState<string | number>(0)
  useEffect(() => {
    const num = typeof value === "number" ? value : parseFloat(String(value).replace(/[₹,L]/g, ""))
    if (isNaN(num)) { setDisplayed(value); return }
    let cur = 0
    const step = (num / 700) * 16
    const t = setInterval(() => {
      cur += step
      if (cur >= num) { setDisplayed(typeof value === "string" ? value : value.toLocaleString()); clearInterval(t); return }
      setDisplayed(Math.floor(cur).toLocaleString())
    }, 16)
    return () => clearInterval(t)
  }, [value])

  const isPos = (change ?? 0) >= 0
  return (
    <div style={{ padding: large ? "20px 22px" : "16px 18px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", borderTop: `3px solid ${color}`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -12, right: -12, width: 80, height: 80, borderRadius: "50%", background: `${color}10`, pointerEvents: "none" }} />
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
        {prefix && <span style={{ fontFamily: "var(--font-mono)", fontSize: large ? 18 : 14, color: "var(--text-muted)" }}>{prefix}</span>}
        <span className="count-up" style={{ fontFamily: "var(--font-mono)", fontSize: large ? 30 : 24, fontWeight: 700, color, lineHeight: 1, letterSpacing: "-0.02em" }}>{displayed}</span>
        {unit && <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{sub}</div>}
      {change !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: isPos ? "var(--success)" : "var(--error)", marginTop: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700 }}>{isPos ? "▲" : "▼"}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{Math.abs(change)}%</span>
          <span style={{ color: "var(--text-muted)" }}>vs prior period</span>
        </div>
      )}
    </div>
  )
}

/* ─── Trend pill ─────────────────────────────────────────── */
function TrendPill({ value }: { value: number }) {
  const pos = value >= 0
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700, fontFamily: "var(--font-mono)", background: pos ? "var(--success-bg)" : "var(--error-bg)", color: pos ? "var(--success)" : "var(--error)", border: `1px solid ${pos ? "var(--success-border)" : "var(--error-border)"}` }}>
      <span style={{ fontSize: 8 }}>{pos ? "▲" : "▼"}</span>{Math.abs(value)}%
    </span>
  )
}

/* ─── Progress bar ───────────────────────────────────────── */
function Bar2({ value, color, max = 100 }: { value: number; color: string; max?: number }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div style={{ height: 4, background: "var(--bg-raised)", borderRadius: 99, overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, boxShadow: `0 0 6px ${color}50`, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  )
}

/* ─── Filter Bar ─────────────────────────────────────────── */
function FilterBar({ filter, onChange }: { filter: Filter; onChange: (f: Filter) => void }) {
  const [expanded, setExpanded] = useState(false)
  const set = (k: keyof Filter, v: string) => onChange({ ...filter, [k]: v })

  const presets: { id: DatePreset; label: string }[] = [
    { id: "today", label: "Today" }, { id: "week", label: "This Week" },
    { id: "month", label: "This Month" }, { id: "quarter", label: "Quarter" },
    { id: "year", label: "Year" }, { id: "custom", label: "Custom" },
  ]

  const selStyle: React.CSSProperties = { padding: "6px 10px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)", fontSize: 12, fontFamily: "var(--font-body)", outline: "none", cursor: "pointer" }

  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "14px 16px", marginBottom: 24 }}>
      {/* Row 1: Date presets + expand */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginRight: 4 }}>PERIOD</span>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {presets.map((p) => (
            <button key={p.id} onClick={() => set("datePreset", p.id)} style={{ padding: "5px 12px", fontSize: 12, borderRadius: 99, border: `1px solid ${filter.datePreset === p.id ? "var(--primary)" : "var(--border-default)"}`, background: filter.datePreset === p.id ? "var(--primary-subtle)" : "none", color: filter.datePreset === p.id ? "var(--primary)" : "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: filter.datePreset === p.id ? 600 : 400 }}>
              {p.label}
            </button>
          ))}
        </div>
        {filter.datePreset === "custom" && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="date" value={filter.dateFrom} onChange={(e) => set("dateFrom", e.target.value)} style={{ ...selStyle, paddingRight: 4 }} />
            <span style={{ color: "var(--text-muted)", fontSize: 11 }}>to</span>
            <input type="date" value={filter.dateTo} onChange={(e) => set("dateTo", e.target.value)} style={{ ...selStyle, paddingRight: 4 }} />
          </div>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => setExpanded((x) => !x)} style={{ ...selStyle, display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filters {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Row 2: Advanced filters */}
      {expanded && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
          {[
            { label: "Department", key: "department", opts: ["All", "Production", "Quality", "Store", "Accounts", "HR"] },
            { label: "Status", key: "status", opts: ["All", "Active", "Completed", "Pending", "Cancelled"] },
            { label: "Supplier", key: "supplier", opts: ["All", "SteelCraft Metals", "CarbidePro Tools", "Fluids India Ltd", "FastTech Solutions"] },
            { label: "Material", key: "material", opts: ["All", "AL6061-T6", "SS304", "EN-24", "MS-IS2062", "EN-36"] },
            { label: "Employee", key: "employee", opts: ["All", "R. Sharma", "K. Tanaka", "A. Patel", "M. Verma", "Q. Iyer"] },
          ].map(({ label, key, opts }) => (
            <div key={key}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", marginBottom: 5, letterSpacing: "0.06em" }}>{label.toUpperCase()}</div>
              <select value={filter[key as keyof Filter]} onChange={(e) => set(key as keyof Filter, e.target.value)} style={{ ...selStyle, width: "100%" }}>
                {opts.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Export toolbar ─────────────────────────────────────── */
function ExportBar({ reportTitle }: { reportTitle: string }) {
  const [exporting, setExporting] = useState<string | null>(null)

  const handleExport = (type: string) => {
    setExporting(type)
    setTimeout(() => setExporting(null), 1200)
    if (type === "print") window.print()
  }

  const btnStyle = (t: string): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 14px", fontSize: 12, fontWeight: 600,
    borderRadius: "var(--radius-sm)", cursor: "pointer",
    fontFamily: "var(--font-body)",
    background: exporting === t ? "var(--primary)" : "var(--bg-elevated)",
    color: exporting === t ? "#fff" : "var(--text-secondary)",
    border: `1px solid ${exporting === t ? "var(--primary)" : "var(--border-default)"}`,
    transition: "all 0.15s ease",
  })

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, color: "var(--text-muted)", marginRight: 4 }}>Export:</span>
      {[
        { id: "pdf",   label: "PDF",   icon: "⬇" },
        { id: "excel", label: "Excel", icon: "⬇" },
        { id: "print", label: "Print", icon: "⎙" },
      ].map(({ id, label, icon }) => (
        <button key={id} onClick={() => handleExport(id)} style={btnStyle(id)}>
          <span>{icon}</span>
          {exporting === id ? "..." : label}
        </button>
      ))}
      <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>{reportTitle}</span>
    </div>
  )
}

/* ─── Legend ─────────────────────────────────────────────── */
function LegendDot({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", padding: "0 4px 4px" }}>
      {items.map((i) => (
        <div key={i.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: i.color, display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{i.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Table component ────────────────────────────────────── */
function DataTable({ headers, rows }: {
  headers: { label: string; align?: "right" }[]
  rows: (string | React.ReactNode)[][]
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h.label} style={{ padding: "8px 12px", textAlign: h.align === "right" ? "right" : "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" }}>{h.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: "9px 12px", fontSize: 12, color: "var(--text-secondary)", textAlign: headers[ci]?.align === "right" ? "right" : "left" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   OVERVIEW REPORT
═══════════════════════════════════════════════════════════ */
function OverviewReport({ filter }: { filter: Filter }) {
  const revTrend = trend(billingMonthly.map((d) => d.invoiced))
  const prodTrend = trend(productionWeekly.map((d) => d.produced))
  const attendTrend = trend(attendanceWeekly.map((d) => d.present))

  const overviewCombo = MONTHS.map((m, i) => ({
    month: m,
    revenue: Math.round(billingMonthly[i]?.collected ?? 0),
    expenses: Math.round((expenseMonthly[i]?.raw_materials ?? 0) + (expenseMonthly[i]?.salaries ?? 0) + (expenseMonthly[i]?.utilities ?? 0) + (expenseMonthly[i]?.maintenance ?? 0) + (expenseMonthly[i]?.transport ?? 0)),
  }))

  return (
    <div className="fade-in">
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }} className="rpt-kpi4">
        <KpiCard label="Revenue MTD" value="28.4" prefix="₹" unit="L" change={revTrend} color={C.green} sub="Invoiced this month" />
        <KpiCard label="Production Output" value={productionWeekly.reduce((a, d) => a + Math.round(d.produced), 0)} unit=" pcs" change={prodTrend} color={C.blue} sub="This week total" />
        <KpiCard label="Attendance Rate" value="94.2" unit="%" change={attendTrend} color={C.cyan} sub="Present today" />
      </div>

      {/* Revenue vs Expense trend */}
      <ChartCard title="Revenue vs Expenses — Monthly" subtitle="Jan–Aug 2026">
        <LegendDot items={[{ label: "Revenue", color: C.green }, { label: "Expenses", color: C.red }]} />
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={overviewCombo} margin={{ top: 8, right: 0, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="ovRevG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.green} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.green} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ovExpG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.red} stopOpacity={0.2} />
                <stop offset="95%" stopColor={C.red} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<ChartTip />} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke={C.green} strokeWidth={2} fill="url(#ovRevG)" dot={false} activeDot={{ r: 4, fill: C.green }} />
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke={C.red} strokeWidth={2} fill="url(#ovExpG)" dot={false} activeDot={{ r: 4, fill: C.red }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 2-col bottom */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }} className="rpt-3col">

        <ChartCard title="Attendance Rate" subtitle="Weekly %">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={attendanceWeekly} margin={{ top: 4, right: 0, left: -20, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="present" name="Present" fill={C.green} radius={[2,2,0,0]} />
              <Bar dataKey="absent" name="Absent" fill={C.red} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Stock Value by Category">
          <PieChart width={160} height={160} style={{ margin: "0 auto" }}>
            <Pie data={stockByCategory} cx={75} cy={75} innerRadius={40} outerRadius={65} dataKey="value" stroke="none">
              {stockByCategory.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => INR(Number(v))} />
          </PieChart>
          <LegendDot items={stockByCategory.map((d, i) => ({ label: d.cat, color: PALETTE[i % PALETTE.length] }))} />
        </ChartCard>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   BILLING REPORT
═══════════════════════════════════════════════════════════ */
function BillingReport() {
  const totalInvoiced = billingMonthly.reduce((a, d) => a + d.invoiced, 0)
  const totalCollected = billingMonthly.reduce((a, d) => a + d.collected, 0)
  const totalOutstanding = billingMonthly[billingMonthly.length - 1].outstanding

  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }} className="rpt-kpi4">
        <KpiCard label="Total Invoiced" value={Math.round(totalInvoiced / 1000)} unit="K" prefix="₹" change={12.4} color={C.blue} sub="Jan–Aug 2026" />
        <KpiCard label="Collected" value={Math.round(totalCollected / 1000)} unit="K" prefix="₹" change={9.8} color={C.green} sub="Payments received" />
        <KpiCard label="Outstanding" value={Math.round(totalOutstanding / 1000)} unit="K" prefix="₹" change={-4.2} color={C.yellow} sub="To be collected" />
        <KpiCard label="Collection Rate" value={Math.round((totalCollected / totalInvoiced) * 100)} unit="%" change={2.1} color={C.cyan} sub="vs invoiced" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="rpt-2col">
        <ChartCard title="Revenue Trend" subtitle="Invoiced vs Collected — Monthly">
          <LegendDot items={[{ label: "Invoiced", color: C.blue }, { label: "Collected", color: C.green }, { label: "Outstanding", color: C.yellow }]} />
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={billingMonthly} margin={{ top: 8, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="outstanding" name="Outstanding" fill={`${C.yellow}30`} radius={[2,2,0,0]} />
              <Line type="monotone" dataKey="invoiced" name="Invoiced" stroke={C.blue} strokeWidth={2} dot={{ r: 3, fill: C.blue }} />
              <Line type="monotone" dataKey="collected" name="Collected" stroke={C.green} strokeWidth={2} dot={{ r: 3, fill: C.green }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Client">
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={billingByClient} cx="50%" cy="45%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none" paddingAngle={2}>
                {billingByClient.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => INR(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <LegendDot items={billingByClient.map((d, i) => ({ label: d.name.split(" ")[0], color: PALETTE[i % PALETTE.length] }))} />
        </ChartCard>
      </div>

      <ChartCard title="Invoice Aging Analysis" subtitle="Outstanding by days overdue">
        <DataTable
          headers={[{ label: "Bucket" }, { label: "Amount", align: "right" }, { label: "% of Outstanding", align: "right" }, { label: "Risk" }]}
          rows={invoiceAging.map((b) => [
            b.bucket,
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-primary)" }}>{INR(b.amount)}</span>,
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{PCT((b.amount / invoiceAging.reduce((a, x) => a + x.amount, 0)) * 100)}</span>,
            <span style={{ fontSize: 10, fontWeight: 700, color: b.bucket === "Current" ? C.green : b.bucket === "1–30d" ? C.yellow : b.bucket === "31–60d" ? C.orange : C.red, background: `${b.bucket === "Current" ? C.green : C.red}18`, padding: "2px 8px", borderRadius: 99 }}>
              {b.bucket === "Current" ? "LOW" : b.bucket === "1–30d" ? "MODERATE" : "HIGH"}
            </span>,
          ])}
        />
      </ChartCard>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PAYMENTS REPORT
═══════════════════════════════════════════════════════════ */
function PaymentsReport() {
  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }} className="rpt-kpi3">
        <KpiCard label="Received MTD" value="18.4" prefix="₹" unit="L" change={6.2} color={C.green} sub="Total collections" />
        <KpiCard label="Avg Payment Days" value={24} unit=" days" change={-2.1} color={C.cyan} sub="DSO (Days Sales Outstanding)" />
        <KpiCard label="Overdue Amount" value="9.2" prefix="₹" unit="L" color={C.red} sub=">60 days outstanding" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="rpt-2col">
        <ChartCard title="Monthly Payment Collection" subtitle="By payment mode">
          <LegendDot items={[{ label: "Bank", color: C.blue }, { label: "UPI", color: C.cyan }, { label: "Cheque", color: C.purple }]} />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={paymentMonthly} margin={{ top: 8, right: 0, left: -10, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="bank"   name="Bank Transfer" stackId="a" fill={C.blue}   radius={[0,0,0,0]} />
              <Bar dataKey="upi"    name="UPI"           stackId="a" fill={C.cyan}   />
              <Bar dataKey="cheque" name="Cheque"        stackId="a" fill={C.purple} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Payment Methods">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={paymentMethods} cx="50%" cy="45%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none" paddingAngle={3}>
                {paymentMethods.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${Number(v)}%`} />
            </PieChart>
          </ResponsiveContainer>
          <LegendDot items={paymentMethods.map((d, i) => ({ label: d.name, color: PALETTE[i] }))} />
        </ChartCard>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   EXPENSES REPORT
═══════════════════════════════════════════════════════════ */
function ExpensesReport() {
  const totalExpense = expenseMonthly.reduce((a, m) => a + m.raw_materials + m.salaries + m.utilities + m.maintenance + m.transport, 0)
  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }} className="rpt-kpi4">
        <KpiCard label="Total Expenses" value={Math.round(totalExpense / 1000)} unit="K" prefix="₹" change={5.4} color={C.yellow} sub="Jan–Aug 2026" />
        <KpiCard label="Raw Materials" value="34" unit="%" color={C.orange} sub="Largest category" />
        <KpiCard label="Avg Monthly" value={Math.round(totalExpense / 8000)} unit="K" prefix="₹" color={C.blue} sub="Per month avg" />
        <KpiCard label="vs Budget" value="96.2" unit="%" change={-1.4} color={C.green} sub="Within budget" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="rpt-2col">
        <ChartCard title="Expense Trend by Category">
          <LegendDot items={[
            { label: "Raw Materials", color: C.orange }, { label: "Salaries", color: C.blue },
            { label: "Utilities", color: C.cyan }, { label: "Maintenance", color: C.yellow },
          ]} />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={expenseMonthly} margin={{ top: 8, right: 0, left: -10, bottom: 0 }} barGap={1}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="raw_materials" name="Raw Materials" stackId="a" fill={C.orange} />
              <Bar dataKey="salaries"      name="Salaries"      stackId="a" fill={C.blue} />
              <Bar dataKey="utilities"     name="Utilities"     stackId="a" fill={C.cyan} />
              <Bar dataKey="maintenance"   name="Maintenance"   stackId="a" fill={C.yellow} />
              <Bar dataKey="transport"     name="Transport"     stackId="a" fill={C.teal} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Expense Share">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={expenseByCategory} cx="50%" cy="45%" outerRadius={70} dataKey="value" stroke="none" paddingAngle={2}>
                {expenseByCategory.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${Number(v)}%`} />
            </PieChart>
          </ResponsiveContainer>
          <LegendDot items={expenseByCategory.map((d, i) => ({ label: d.name, color: PALETTE[i] }))} />
        </ChartCard>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   STOCK REPORT
═══════════════════════════════════════════════════════════ */
function StockReport() {
  const totalValue = stockByCategory.reduce((a, d) => a + d.value, 0)
  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }} className="rpt-kpi4">
        <KpiCard label="Total Stock Value" value="12.4" prefix="₹" unit="L" change={1.8} color={C.teal} sub="All categories" />
        <KpiCard label="Low Stock Items" value={12} color={C.red} sub="Below reorder point" />
        <KpiCard label="Total Materials" value={460} change={4.2} color={C.blue} sub="SKUs tracked" />
        <KpiCard label="Stock Turnover" value="4.2" unit="x" change={0.8} color={C.green} sub="Times per year" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="rpt-2col">
        <ChartCard title="Stock Movement" subtitle="Weekly receipts vs issues">
          <LegendDot items={[{ label: "Receipts", color: C.green }, { label: "Issues", color: C.blue }, { label: "Returns", color: C.yellow }]} />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stockMovement} margin={{ top: 8, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="sgRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.25} /><stop offset="95%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sgIss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.blue} stopOpacity={0.2} /><stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="receipts" name="Receipts" stroke={C.green} strokeWidth={2} fill="url(#sgRec)" dot={false} />
              <Area type="monotone" dataKey="issues"   name="Issues"   stroke={C.blue}  strokeWidth={2} fill="url(#sgIss)"  dot={false} />
              <Line type="monotone" dataKey="returns"  name="Returns"  stroke={C.yellow} strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Value by Category">
          {stockByCategory.map((d, i) => (
            <div key={d.cat} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTE[i], flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontSize: 11, color: "var(--text-secondary)", flex: 1 }}>{d.cat}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-primary)", fontWeight: 600 }}>{INR(d.value)}</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", width: 32, textAlign: "right" }}>{PCT((d.value / totalValue) * 100)}</span>
            </div>
          ))}
        </ChartCard>
      </div>

      <ChartCard title="Low Stock Alert Items">
        <DataTable
          headers={[{ label: "Code" }, { label: "Material" }, { label: "Current" }, { label: "Min Level" }, { label: "Shortage" }, { label: "Value at Risk", align: "right" }]}
          rows={lowStockItems.map((s) => [
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.cyan }}>{s.code}</span>,
            s.name,
            <span style={{ fontFamily: "var(--font-mono)", color: C.red, fontWeight: 600 }}>{s.current} {s.unit}</span>,
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{s.min} {s.unit}</span>,
            <span style={{ fontFamily: "var(--font-mono)", color: C.yellow }}>{s.min - s.current} {s.unit}</span>,
            <span style={{ fontFamily: "var(--font-mono)", color: C.red }}>₹{s.value.toLocaleString()}</span>,
          ])}
        />
      </ChartCard>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PURCHASE REPORT
═══════════════════════════════════════════════════════════ */
function PurchaseReport() {
  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }} className="rpt-kpi3">
        <KpiCard label="Total Ordered" value="6.5" prefix="₹" unit="L" change={8.2} color={C.purple} sub="Jan–Aug 2026" />
        <KpiCard label="Avg Lead Time" value={12} unit=" days" change={-1.4} color={C.cyan} sub="Supplier lead days" />
        <KpiCard label="PO Fill Rate" value="96.2" unit="%" change={1.8} color={C.green} sub="On-time deliveries" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }} className="rpt-2col">
        <ChartCard title="Purchase Trend" subtitle="Ordered vs Received">
          <LegendDot items={[{ label: "Ordered", color: C.purple }, { label: "Received", color: C.green }]} />
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={purchaseMonthly} margin={{ top: 8, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="ordered"  name="Ordered"  fill={`${C.purple}30`} radius={[2,2,0,0]} />
              <Line type="monotone" dataKey="received" name="Received" stroke={C.green} strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Spend by Supplier">
          {purchaseBySupplier.map((d, i) => {
            const max = purchaseBySupplier[0].value
            return (
              <div key={d.name} style={{ padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{d.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "var(--text-primary)" }}>{INR(d.value)}</span>
                </div>
                <Bar2 value={d.value} max={max} color={PALETTE[i]} />
              </div>
            )
          })}
        </ChartCard>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PRODUCTION REPORT
═══════════════════════════════════════════════════════════ */
function ProductionReport() {
  const totalProduced = productionWeekly.reduce((a, d) => a + Math.round(d.produced), 0)
  const totalRejected = productionWeekly.reduce((a, d) => a + Math.round(d.rejected), 0)
  const yieldRate = Math.round(((totalProduced - totalRejected) / totalProduced) * 100 * 10) / 10

  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }} className="rpt-kpi4">
        <KpiCard label="Total Produced" value={totalProduced} unit=" pcs" change={8.3} color={C.orange} sub="This period" />
        <KpiCard label="Rejected" value={totalRejected} color={C.red} sub={`${PCT(totalRejected / totalProduced * 100)} defect rate`} />
        <KpiCard label="Yield Rate" value={yieldRate} unit="%" color={C.green} sub="Good to planned ratio" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 16 }} className="rpt-2col">
        <ChartCard title="Production vs Plan" subtitle="Weekly">
          <LegendDot items={[{ label: "Planned", color: `${C.blue}50` }, { label: "Produced", color: C.blue }, { label: "Rejected", color: C.red }]} />
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={productionWeekly} margin={{ top: 8, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="planned"  name="Planned"  fill={`${C.blue}20`} radius={[2,2,0,0]} />
              <Bar dataKey="produced" name="Produced" fill={C.blue} radius={[2,2,0,0]} />
              <Bar dataKey="rejected" name="Rejected" fill={C.red}  radius={[2,2,0,0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ATTENDANCE REPORT
═══════════════════════════════════════════════════════════ */
function AttendanceReport() {
  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }} className="rpt-kpi4">
        <KpiCard label="Avg Attendance" value="94.2" unit="%" change={1.8} color={C.green} sub="This week" />
        <KpiCard label="Total Headcount" value={155} color={C.blue} sub="Active employees" />
        <KpiCard label="Leave Days MTD" value={84} change={-8.4} color={C.yellow} sub="Approved leaves" />
        <KpiCard label="Absent Today" value={9} color={C.red} sub="Including late arrivals" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="rpt-2col">
        <ChartCard title="Attendance Trend" subtitle="Present vs Absent — Weekly">
          <LegendDot items={[{ label: "Present", color: C.green }, { label: "Absent", color: C.red }, { label: "Leave", color: C.yellow }]} />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceWeekly} margin={{ top: 8, right: 0, left: -10, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="present" name="Present" fill={C.green}  radius={[2,2,0,0]} />
              <Bar dataKey="absent"  name="Absent"  fill={C.red}    radius={[2,2,0,0]} />
              <Bar dataKey="leave"   name="On Leave" fill={C.yellow} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Leave by Type">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={leaveByType} cx="50%" cy="45%" innerRadius={40} outerRadius={66} dataKey="value" stroke="none" paddingAngle={2}>
                {leaveByType.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${Number(v)} days`} />
            </PieChart>
          </ResponsiveContainer>
          <LegendDot items={leaveByType.map((d, i) => ({ label: d.name, color: PALETTE[i] }))} />
        </ChartCard>
      </div>

      <ChartCard title="Attendance Rate by Department">
        <DataTable
          headers={[{ label: "Department" }, { label: "Headcount", align: "right" }, { label: "Attendance Rate", align: "right" }, { label: "Visual" }]}
          rows={deptAttendance.map((d) => [
            d.dept,
            <span style={{ fontFamily: "var(--font-mono)" }}>{d.headcount}</span>,
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: d.rate >= 96 ? C.green : C.yellow }}>{PCT(d.rate)}</span>,
            <div style={{ width: 120 }}><Bar2 value={d.rate} max={100} color={d.rate >= 96 ? C.green : C.yellow} /></div>,
          ])}
        />
      </ChartCard>
    </div>
  )
}



/* ═══════════════════════════════════════════════════════════
   QUALITY REPORT
═══════════════════════════════════════════════════════════ */
function QualityReport() {
  const totalInspected = qualityWeekly.reduce((a, d) => a + d.inspected, 0)
  const totalRejected  = qualityWeekly.reduce((a, d) => a + d.rejected, 0)
  const totalAccepted  = qualityWeekly.reduce((a, d) => a + d.accepted, 0)
  const yield_ = ((totalAccepted / totalInspected) * 100)

  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }} className="rpt-kpi4">
        <KpiCard label="Total Inspected" value={totalInspected} unit=" pcs" color={C.blue} sub="This period" />
        <KpiCard label="Accepted" value={totalAccepted} change={1.8} color={C.green} sub="First pass good" />
        <KpiCard label="Rejected" value={totalRejected} change={-3.2} color={C.red} sub="Non-conforming" />
        <KpiCard label="Yield Rate" value={Math.round(yield_ * 10) / 10} unit="%" color={C.cyan} sub="First pass yield" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="rpt-2col">
        <ChartCard title="Inspection Results — Weekly">
          <LegendDot items={[{ label: "Inspected", color: C.blue }, { label: "Accepted", color: C.green }, { label: "Rejected", color: C.red }, { label: "Rework", color: C.yellow }]} />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={qualityWeekly} margin={{ top: 8, right: 0, left: -10, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="accepted"  name="Accepted"  fill={C.green}  radius={[2,2,0,0]} />
              <Bar dataKey="rework"    name="Rework"    fill={C.yellow} radius={[2,2,0,0]} />
              <Bar dataKey="rejected"  name="Rejected"  fill={C.red}    radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Defect Pareto">
          {defectPareto.map((d, i) => (
            <div key={d.reason} style={{ padding: "7px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{d.reason}</span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>{PCT(d.cumulative)} cum.</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "var(--text-primary)" }}>{d.count}</span>
                </div>
              </div>
              <Bar2 value={d.count} max={defectPareto[0].count} color={i === 0 ? C.red : i < 3 ? C.orange : C.yellow} />
            </div>
          ))}
        </ChartCard>
      </div>

      <ChartCard title="Acceptance Rate Trend" subtitle="Weekly first-pass yield %">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={qualityWeekly.map((d) => ({ ...d, rate: Math.round((d.accepted / d.inspected) * 1000) / 10 }))} margin={{ top: 8, right: 0, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="yieldG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.green} stopOpacity={0.3} /><stop offset="95%" stopColor={C.green} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
            <YAxis domain={[90, 100]} tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <ReferenceLine y={96} stroke={C.yellow} strokeDasharray="4 3" strokeOpacity={0.4} />
            <Area type="monotone" dataKey="rate" name="Yield %" stroke={C.green} strokeWidth={2} fill="url(#yieldG)" dot={{ r: 4, fill: C.green }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SCRAP REPORT
═══════════════════════════════════════════════════════════ */
function ScrapReport() {
  const totalQty   = scrapMonthly.reduce((a, d) => a + d.qty, 0)
  const totalValue = scrapMonthly.reduce((a, d) => a + d.value, 0)

  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }} className="rpt-kpi3">
        <KpiCard label="Total Scrap" value={totalQty} unit=" pcs" change={-8.4} color={C.red} sub="This period" />
        <KpiCard label="Scrap Value" value={Math.round(totalValue / 1000)} unit="K" prefix="₹" change={-6.2} color={C.yellow} sub="Material loss" />
        <KpiCard label="Scrap Rate" value="0.42" unit="%" change={-0.08} color={C.orange} sub="vs total produced" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="rpt-2col">
        <ChartCard title="Scrap Trend" subtitle="Quantity & Value — Monthly">
          <LegendDot items={[{ label: "Value (₹)", color: C.red }, { label: "Qty (pcs)", color: C.orange }]} />
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={scrapMonthly} margin={{ top: 8, right: 0, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar yAxisId="left" dataKey="value" name="Value (₹)" fill={`${C.red}30`} radius={[2,2,0,0]} />
              <Line yAxisId="right" type="monotone" dataKey="qty" name="Qty (pcs)" stroke={C.orange} strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Scrap by Reason">
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={scrapByReason} cx="50%" cy="45%" innerRadius={42} outerRadius={66} dataKey="value" stroke="none" paddingAngle={3}>
                {scrapByReason.map((_, i) => <Cell key={i} fill={[C.red, C.orange, C.yellow, C.purple, C.slate][i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${Number(v)}%`} />
            </PieChart>
          </ResponsiveContainer>
          <LegendDot items={scrapByReason.map((d, i) => ({ label: d.name, color: [C.red, C.orange, C.yellow, C.purple, C.slate][i] }))} />
        </ChartCard>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════════ */
interface Props {
  initialView?: ReportCategory
  onNavigate?: (id: string) => void
}

const DEFAULT_FILTER: Filter = {
  datePreset: "month", dateFrom: "2026-08-01", dateTo: "2026-08-31",
  department: "All", employee: "All",
  material: "All", supplier: "All", status: "All",
}

export function ReportsModule({ initialView = "overview" }: Props) {
  const [category, setCategory] = useState<ReportCategory>(initialView)
  const [filter, setFilter] = useState<Filter>(DEFAULT_FILTER)
  const [loading, setLoading] = useState(false)

  const handleCategoryChange = useCallback((cat: ReportCategory) => {
    setLoading(true)
    setCategory(cat)
    setTimeout(() => setLoading(false), 480)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    setCategory(initialView)
  }, [initialView])

  const activeCat = CATEGORIES.find((c) => c.id === category)!

  const renderReport = () => {
    if (loading) return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[1,2,3,4].map((i) => (
          <div key={i} className="skeleton" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
        ))}
        <div className="skeleton" style={{ gridColumn: "1/-1", height: 260, borderRadius: "var(--radius-md)", marginTop: 8 }} />
        <div className="skeleton" style={{ gridColumn: "1/3", height: 220, borderRadius: "var(--radius-md)" }} />
        <div className="skeleton" style={{ gridColumn: "3/-1", height: 220, borderRadius: "var(--radius-md)" }} />
      </div>
    )
    switch (category) {
      case "overview":    return <OverviewReport filter={filter} />
      case "billing":     return <BillingReport />
      case "payments":    return <PaymentsReport />
      case "expenses":    return <ExpensesReport />
      case "stock":       return <StockReport />
      case "purchase":    return <PurchaseReport />
      case "production":  return <ProductionReport />
      case "attendance":  return <AttendanceReport />

      case "quality":     return <QualityReport />
      case "scrap":       return <ScrapReport />
    }
  }

  return (
    <div style={{ display: "flex", gap: 0, animation: "fade-in 0.25s ease-out" }}>
      {/* Sidebar nav */}
      <div style={{ width: 200, flexShrink: 0, marginRight: 24 }} className="rpt-sidebar">
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.12em", marginBottom: 10, paddingLeft: 4 }}>REPORT CATEGORIES</div>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", background: category === cat.id ? `${cat.color}15` : "none", border: "none", borderLeft: `2px solid ${category === cat.id ? cat.color : "transparent"}`, borderRadius: `0 var(--radius-sm) var(--radius-sm) 0`, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.12s ease" }}>
              <span style={{ fontSize: 13, color: category === cat.id ? cat.color : "var(--text-muted)", flexShrink: 0 }}>{cat.icon}</span>
              <span style={{ fontSize: 12, fontWeight: category === cat.id ? 600 : 400, color: category === cat.id ? cat.color : "var(--text-secondary)", transition: "color 0.12s ease" }}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <PageHeader
          title={`${activeCat.label} Report`}
          description={activeCat.description}
          accentColor={activeCat.color}
          badge={{ label: filter.datePreset === "month" ? "This Month" : filter.datePreset.charAt(0).toUpperCase() + filter.datePreset.slice(1), variant: "info" }}
          primaryAction={undefined}
          secondaryActions={[]}
        />

        {/* Export bar */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <ExportBar reportTitle={`${activeCat.label} · ${filter.datePreset}`} />
        </div>

        {/* Filters */}
        <FilterBar filter={filter} onChange={setFilter} />

        {/* Report content */}
        <div key={category + filter.datePreset}>
          {renderReport()}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .rpt-sidebar { display: none !important; }
        }
        @media (max-width: 900px) {
          .rpt-kpi4 { grid-template-columns: repeat(2, 1fr) !important; }
          .rpt-kpi3 { grid-template-columns: repeat(2, 1fr) !important; }
          .rpt-2col { grid-template-columns: 1fr !important; }
          .rpt-3col { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .rpt-kpi4 { grid-template-columns: 1fr 1fr !important; }
          .rpt-kpi3 { grid-template-columns: 1fr !important; }
          .rpt-3col { grid-template-columns: 1fr !important; }
        }
        @media print {
          .rpt-sidebar { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  )
}
