import React, { useState, useEffect, useCallback } from "react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts"
import { PageHeader } from "../shell/PageHeader"

/* ─── Primitives ────────────────────────────────────────────────── */
function KpiCard({ label, value, unit, change, color, sub }: any) {
  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "18px 20px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, color }}>{value}{unit && <span style={{ fontSize: 18, opacity: 0.6 }}>{unit}</span>}</div>
      {(change !== undefined || sub) && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          {change !== undefined && <span style={{ fontSize: 11, fontWeight: 700, color: change >= 0 ? "var(--success)" : "var(--error)", background: change >= 0 ? "var(--success-bg)" : "var(--error-bg)", padding: "2px 6px", borderRadius: 4 }}>{change >= 0 ? "+" : ""}{change}%</span>}
          {sub && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{sub}</span>}
        </div>
      )}
    </div>
  )
}

function Panel({ title, action, onAction, children }: any) {
  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>{title}</div>
        {action && <button onClick={onAction} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{action}</button>}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  )
}

function ProgressBar({ value, color, height = 6 }: { value: number; color?: string; height?: number }) {
  return (
    <div style={{ width: "100%", height, background: "var(--bg-raised)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, value))}%`, background: color || "var(--primary)", borderRadius: 3, transition: "width 0.3s ease" }} />
    </div>
  )
}

function SubNav({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 0 }}>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: "8px 16px", background: "none", border: "none",
            borderBottom: active === t.id ? "2px solid var(--primary)" : "2px solid transparent",
            color: active === t.id ? "var(--primary)" : "var(--text-secondary)",
            fontSize: 13, fontWeight: active === t.id ? 600 : 500, cursor: "pointer",
            marginBottom: -1,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* ─── Types ────────────────────────────────────────────────── */
export type ProductionView =
  | "dashboard" | "orders" | "order-detail" | "entry"
  | "quality" | "scrap"
  | "material-consumption"

type WOStatus = "planned" | "running" | "completed" | "on-hold" | "cancelled"
type InspResult = "accepted" | "rejected" | "rework"
type Priority = "urgent" | "high" | "normal" | "low"

interface WorkOrder {
  id: string; number: string; partName: string; partCode: string; drawing: string
  qty: number; produced: number; rejected: number; rework: number
  machineId: string; machineName: string; operatorId: string; operatorName: string
  startDate: string; endDate: string; status: WOStatus; priority: Priority
  material: string; process: string
}


interface ProductionEntry {
  id: string; woId: string; woNumber: string; date: string; shift: string
  machineId: string; machineName: string; operatorName: string
  produced: number; rejected: number; rework: number; material: number; materialUnit: string
  remarks: string
}

interface Inspection {
  id: string; woId: string; woNumber: string; partName: string
  qty: number; accepted: number; rejected: number; rework: number
  inspector: string; date: string; result: InspResult
  reasons: string[]; remarks: string; instrument: string
}

interface ScrapRecord {
  id: string; date: string; woId: string; woNumber: string; partName: string
  material: string; qty: number; unit: string; reason: string; value: number
  by: string
}

/* ─── Data ─────────────────────────────────────────────────── */
const WORK_ORDERS: WorkOrder[] = [
  { id: "wo1", number: "WO-2026-0841", partName: "Flange Bearing Housing", partCode: "FBH-2241", drawing: "DWG-FBH-2241-A", qty: 50, produced: 38, rejected: 2, rework: 1, machineId: "m1", machineName: "CNC-001 · Haas VF-2", operatorId: "op1", operatorName: "R. Sharma", startDate: "2026-08-13", endDate: "2026-08-15", status: "running", priority: "urgent", material: "AL6061-T6", process: "Milling" },
  { id: "wo2", number: "WO-2026-0842", partName: "Spindle Shaft Ø50", partCode: "SS-0050", drawing: "DWG-SS-0050-B", qty: 20, produced: 20, rejected: 0, rework: 0, machineId: "m2", machineName: "CNC-002 · Mazak QT-35", operatorId: "op2", operatorName: "K. Tanaka", startDate: "2026-08-11", endDate: "2026-08-13", status: "completed", priority: "high", material: "SS304", process: "Turning" },
  { id: "wo3", number: "WO-2026-0843", partName: "Motor Mounting Plate", partCode: "MMP-112", drawing: "DWG-MMP-112-C", qty: 100, produced: 0, rejected: 0, rework: 0, machineId: "m3", machineName: "CNC-003 · DMG NHX 5000", operatorId: "op3", operatorName: "A. Patel", startDate: "2026-08-16", endDate: "2026-08-20", status: "planned", priority: "normal", material: "MS-IS2062", process: "Milling" },
  { id: "wo4", number: "WO-2026-0844", partName: "Coupling Hub Ø80", partCode: "CH-0080", drawing: "DWG-CH-0080-A", qty: 12, produced: 7, rejected: 1, rework: 2, machineId: "m4", machineName: "CNC-004 · Okuma MB-5000", operatorId: "op4", operatorName: "M. Verma", startDate: "2026-08-12", endDate: "2026-08-14", status: "on-hold", priority: "high", material: "EN-24", process: "Turning" },
  { id: "wo5", number: "WO-2026-0845", partName: "Hydraulic Manifold Block", partCode: "HMB-445", drawing: "DWG-HMB-445-D", qty: 8, produced: 0, rejected: 0, rework: 0, machineId: "m5", machineName: "CNC-005 · Fanuc Robodrill", operatorId: "op5", operatorName: "S. Kumar", startDate: "2026-08-14", endDate: "2026-08-18", status: "planned", priority: "low", material: "AL7075", process: "Milling" },
  { id: "wo6", number: "WO-2026-0846", partName: "Connecting Rod Pin", partCode: "CRP-019", drawing: "DWG-CRP-019-A", qty: 60, produced: 58, rejected: 3, rework: 0, machineId: "m2", machineName: "CNC-002 · Mazak QT-35", operatorId: "op2", operatorName: "K. Tanaka", startDate: "2026-08-10", endDate: "2026-08-13", status: "completed", priority: "normal", material: "EN-36", process: "Turning" },
  { id: "wo7", number: "WO-2026-0847", partName: "Valve Body Ø65", partCode: "VB-065", drawing: "DWG-VB-065-B", qty: 15, produced: 4, rejected: 0, rework: 0, machineId: "m1", machineName: "CNC-001 · Haas VF-2", operatorId: "op1", operatorName: "R. Sharma", startDate: "2026-08-14", endDate: "2026-08-17", status: "running", priority: "high", material: "SG-Iron", process: "Milling" },
]


const INSPECTIONS: Inspection[] = [
  { id: "in1", woId: "wo2", woNumber: "WO-2026-0842", partName: "Spindle Shaft Ø50", qty: 20, accepted: 18, rejected: 1, rework: 1, inspector: "Q. Iyer", date: "2026-08-13", result: "rework", reasons: ["Diameter oversize by 0.02mm on 1 piece", "Surface roughness Ra > 1.6 on 1 piece"], remarks: "Rework piece re-inspected and accepted. Reject tagged for scrap.", instrument: "CMM, Roughness Tester" },
  { id: "in2", woId: "wo6", woNumber: "WO-2026-0846", partName: "Connecting Rod Pin", qty: 60, accepted: 57, rejected: 3, rework: 0, inspector: "Q. Iyer", date: "2026-08-13", result: "rejected", reasons: ["Hardness below spec (HRC < 58)", "Surface crack on 2 pieces (MT test)"], remarks: "3 pieces rejected — hardness and crack defects. Material batch suspect.", instrument: "Hardness Tester, MT Kit" },
  { id: "in3", woId: "wo1", woNumber: "WO-2026-0841", partName: "Flange Bearing Housing", qty: 38, accepted: 36, rejected: 1, rework: 1, inspector: "P. Nair", date: "2026-08-13", result: "rework", reasons: ["Bore diameter 0.015mm undersize on 1 piece"], remarks: "Rework approved — finish bore to correct diameter.", instrument: "Bore Gauge, CMM" },
  { id: "in4", woId: "wo7", woNumber: "WO-2026-0847", partName: "Valve Body Ø65", qty: 4, accepted: 4, rejected: 0, rework: 0, inspector: "P. Nair", date: "2026-08-14", result: "accepted", reasons: [], remarks: "First article inspection passed. All dimensions within ±0.01mm.", instrument: "CMM, Thread Gauge" },
  { id: "in5", woId: "wo4", woNumber: "WO-2026-0844", partName: "Coupling Hub Ø80", qty: 7, accepted: 5, rejected: 1, rework: 1, inspector: "Q. Iyer", date: "2026-08-12", result: "rework", reasons: ["Keyway width 0.03mm oversize", "Thread pitch diameter out of tolerance"], remarks: "Job on hold pending tool change and parameter review.", instrument: "Gauge Pins, Thread Gauge" },
]

const SCRAP_RECORDS: ScrapRecord[] = [
  { id: "sc1", date: "2026-08-13", woId: "wo6", woNumber: "WO-2026-0846", partName: "Connecting Rod Pin", material: "EN-36 Bar", qty: 3, unit: "pcs", reason: "Sub-surface cracks — material defect", value: 4200, by: "Q. Iyer" },
  { id: "sc2", date: "2026-08-13", woId: "wo1", woNumber: "WO-2026-0841", partName: "Flange Bearing Housing", material: "AL6061-T6 Plate", qty: 1, unit: "pcs", reason: "Dimensional reject — bore undersize beyond rework limit", value: 1850, by: "P. Nair" },
  { id: "sc3", date: "2026-08-12", woId: "wo4", woNumber: "WO-2026-0844", partName: "Coupling Hub Ø80 blank", material: "EN-24 Bar Ø100", qty: 2, unit: "pcs", reason: "Wrong program — wrong diameter turned", value: 3100, by: "M. Verma" },
  { id: "sc4", date: "2026-08-10", woId: "wo6", woNumber: "WO-2026-0846", partName: "Connecting Rod Pin trial", material: "EN-36 Bar", qty: 1, unit: "pcs", reason: "Setup piece — first trial cut, program correction", value: 820, by: "K. Tanaka" },
  { id: "sc5", date: "2026-08-09", woId: "wo2", woNumber: "WO-2026-0842", partName: "Spindle Shaft Ø50", material: "SS304 Bar", qty: 1, unit: "pcs", reason: "Tool crash — surface damaged, cannot rework", value: 2640, by: "K. Tanaka" },
]

const PROD_ENTRIES: ProductionEntry[] = [
  { id: "pe1", woId: "wo1", woNumber: "WO-2026-0841", date: "2026-08-13", shift: "Day", machineId: "m1", machineName: "CNC-001", operatorName: "R. Sharma", produced: 12, rejected: 1, rework: 1, material: 24.6, materialUnit: "kg", remarks: "Coolant issue in morning — resolved by 09:30" },
  { id: "pe2", woId: "wo1", woNumber: "WO-2026-0841", date: "2026-08-12", shift: "Day", machineId: "m1", machineName: "CNC-001", operatorName: "R. Sharma", produced: 14, rejected: 1, rework: 0, material: 28.7, materialUnit: "kg", remarks: "" },
  { id: "pe3", woId: "wo7", woNumber: "WO-2026-0847", date: "2026-08-14", shift: "Day", machineId: "m1", machineName: "CNC-001", operatorName: "R. Sharma", produced: 4, rejected: 0, rework: 0, material: 18.4, materialUnit: "kg", remarks: "Setup took 45 min — new job first run" },
]

/* ─── Chart data ─────────────────────────────────────────── */
const effData = [
  { date: "Aug 7", planned: 400, completed: 395, rejected: 8 },
  { date: "Aug 8", planned: 400, completed: 420, rejected: 5 },
  { date: "Aug 9", planned: 400, completed: 390, rejected: 12 },
  { date: "Aug 10", planned: 400, completed: 408, rejected: 6 },
  { date: "Aug 11", planned: 400, completed: 435, rejected: 4 },
  { date: "Aug 12", planned: 400, completed: 412, rejected: 9 },
  { date: "Aug 13", planned: 400, completed: 376, rejected: 3 },
]

const defectDist = [
  { name: "Dimensional", value: 38 },
  { name: "Surface Finish", value: 22 },
  { name: "Material Defect", value: 18 },
  { name: "Tool Mark", value: 12 },
  { name: "Other", value: 10 },
]
const PIE_COLORS = ["#2563eb", "#06b6d4", "#f59e0b", "#10b981", "#a78bfa"]

/* ─── Helpers ────────────────────────────────────────────── */
function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let current = 0
    const step = (target / duration) * 16
    const t = setInterval(() => {
      current += step
      if (current >= target) { setVal(target); clearInterval(t) }
      else setVal(Math.floor(current))
    }, 16)
    return () => clearInterval(t)
  }, [target, duration])
  return val
}

const WO_STATUS_META: Record<WOStatus, { label: string; color: string; bg: string }> = {
  planned:   { label: "Planned",   color: "var(--text-secondary)", bg: "rgba(148,163,184,0.1)" },
  running:   { label: "Running",   color: "var(--success)",        bg: "var(--success-bg)" },
  completed: { label: "Completed", color: "var(--primary)",        bg: "var(--primary-subtle)" },
  "on-hold": { label: "On Hold",   color: "var(--warning)",        bg: "var(--warning-bg)" },
  cancelled: { label: "Cancelled", color: "var(--error)",          bg: "var(--error-bg)" },
}


const INSP_META: Record<InspResult, { label: string; color: string; bg: string }> = {
  accepted: { label: "Accepted", color: "var(--success)", bg: "var(--success-bg)" },
  rejected: { label: "Rejected", color: "var(--error)",   bg: "var(--error-bg)" },
  rework:   { label: "Rework",   color: "var(--warning)", bg: "var(--warning-bg)" },
}

const PRIORITY_META: Record<Priority, { color: string }> = {
  urgent: { color: "var(--error)" },
  high:   { color: "var(--warning)" },
  normal: { color: "var(--primary)" },
  low:    { color: "var(--text-muted)" },
}

function fmtDate(d: string) {
  const [y, m, day] = d.split("-")
  const mn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m)-1]
  return `${day} ${mn} ${y}`
}
function progress(produced: number, qty: number) { return Math.min(100, Math.round((produced / qty) * 100)) }

/* ─── Shared chart tooltip ───────────────────────────────── */
function ChartTip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", padding: "10px 14px", boxShadow: "var(--shadow-md)" }}>
      <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: 5 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ fontSize: 12, color: p.color, fontFamily: "var(--font-mono)", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, flexShrink: 0, display: "inline-block" }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name}</span>
          <span style={{ fontWeight: 600, marginLeft: "auto" }}>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════
   PRODUCTION DASHBOARD
═══════════════════════════════════════════════════════════ */
function ProductionDashboard({ onView }: { onView: (v: ProductionView, id?: string) => void }) {
  const totalPlanned = WORK_ORDERS.reduce((a, w) => a + w.qty, 0)
  const totalProduced = WORK_ORDERS.reduce((a, w) => a + w.produced, 0)
  const totalRejected = WORK_ORDERS.reduce((a, w) => a + w.rejected, 0)
  const totalRework = WORK_ORDERS.reduce((a, w) => a + w.rework, 0)
  const efficiency = Math.round((totalProduced / Math.max(1, totalPlanned)) * 100)

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader
        title="Production Dashboard"
        description="Live production overview — Aug 13, 2026 · Day Shift"
        badge={{ label: "Live", variant: "success" }}
        accentColor="#a78bfa"
        primaryAction={{ label: "+ New Work Order", onClick: () => onView("entry") }}
        secondaryActions={[{ label: "All Orders", onClick: () => onView("orders") }]}
      />

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }} className="prod-kpi-grid">
        <KpiCard label="Planned Qty" value={totalPlanned} color="var(--text-secondary)" sub="This week" />
        <KpiCard label="Produced" value={totalProduced} change={8.3} color="var(--success)" sub="Good pieces" />
        <KpiCard label="Rejected" value={totalRejected} change={-3.2} color="var(--error)" sub="Non-conforming" />
        <KpiCard label="Rework" value={totalRework} color="var(--warning)" sub="Rework pieces" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 24 }} className="prod-kpi-grid">
        <KpiCard label="Production Efficiency" value={efficiency} unit="%" color="var(--primary)" sub="vs planned" />
      </div>

      {/* Bottom panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="prod-bottom-row">        {/* Active work orders */}
        <Panel title="Active Work Orders" action="All orders →" onAction={() => onView("orders")}>
          <div>
            {WORK_ORDERS.filter((w) => w.status === "running" || w.status === "on-hold").map((w) => {
              const pct = progress(w.produced, w.qty)
              const st = WO_STATUS_META[w.status]
              const pri = PRIORITY_META[w.priority]
              return (
                <button key={w.id} onClick={() => onView("order-detail", w.id)} style={{ display: "block", padding: "12px 16px", width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-raised)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>{w.number}</span>
                      <span style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text-primary)", marginTop: 1 }}>{w.partName}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: pri.color, display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: st.color, background: st.bg, padding: "2px 7px", borderRadius: 99, letterSpacing: "0.05em" }}>{st.label}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ProgressBar value={pct} color={w.status === "on-hold" ? "var(--warning)" : "var(--primary)"} height={3} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>{w.produced}/{w.qty}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>{w.machineName} · {w.operatorName}</div>
                </button>
              )
            })}
          </div>
        </Panel>
      </div>

      <style>{`
        @media(max-width:900px){.prod-kpi-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:600px){.prod-kpi-grid{grid-template-columns:1fr 1fr!important}.prod-chart-row{grid-template-columns:1fr!important}.prod-bottom-row{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   WORK ORDERS LIST
═══════════════════════════════════════════════════════════ */
function WorkOrdersList({ onView }: { onView: (v: ProductionView, id?: string) => void }) {
  const [filter, setFilter] = useState<WOStatus | "all">("all")
  const [search, setSearch] = useState("")

  const filtered = WORK_ORDERS.filter((w) => {
    if (filter !== "all" && w.status !== filter) return false
    const q = search.toLowerCase()
    return !q || w.number.toLowerCase().includes(q) || w.partName.toLowerCase().includes(q) || w.operatorName.toLowerCase().includes(q)
  })

  const counts = {
    all: WORK_ORDERS.length,
    planned: WORK_ORDERS.filter((w) => w.status === "planned").length,
    running: WORK_ORDERS.filter((w) => w.status === "running").length,
    completed: WORK_ORDERS.filter((w) => w.status === "completed").length,
    "on-hold": WORK_ORDERS.filter((w) => w.status === "on-hold").length,
  }

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader title="Production Orders" description="Work order management and tracking" accentColor="#a78bfa"
        primaryAction={{ label: "+ New Entry", onClick: () => onView("entry") }}
        secondaryActions={[{ label: "Dashboard", onClick: () => onView("dashboard") }]} />

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(["all","planned","running","completed","on-hold"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "6px 14px", fontSize: 12, borderRadius: 99, border: `1px solid ${filter === s ? "var(--primary)" : "var(--border-default)"}`, background: filter === s ? "var(--primary-subtle)" : "none", color: filter === s ? "var(--primary)" : "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 6 }}>
            {s === "all" ? "All" : WO_STATUS_META[s as WOStatus].label}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600 }}>{counts[s as keyof typeof counts] ?? 0}</span>
          </button>
        ))}
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders, parts, operators…" style={{ width: "100%", padding: "7px 12px", paddingLeft: 32, background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontSize: 12, fontFamily: "var(--font-body)", outline: "none" }} />
          <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </div>
        <button onClick={() => onView("entry")} style={{ padding: "7px 16px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>+ Production Entry</button>
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Job No.", "Part", "Material", "Machine", "Operator", "Progress", "Dates", "Status"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No work orders match this filter.</td></tr>
              ) : filtered.map((w) => {
                const st = WO_STATUS_META[w.status]
                const pct = progress(w.produced, w.qty)
                const pri = PRIORITY_META[w.priority]
                return (
                  <tr key={w.id} onClick={() => onView("order-detail", w.id)} style={{ borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", transition: "background 0.12s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-raised)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>{w.number}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: pri.color, display: "inline-block" }} />
                        <span style={{ fontSize: 9, color: pri.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{w.priority}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{w.partName}</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{w.partCode}</div>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{w.material}</td>
                    <td style={{ padding: "12px 14px", fontSize: 11, color: "var(--text-secondary)" }}>{w.machineName}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text-secondary)" }}>{w.operatorName}</td>
                    <td style={{ padding: "12px 14px", minWidth: 140 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <ProgressBar value={pct} height={3} color={w.status === "on-hold" ? "var(--warning)" : w.status === "completed" ? "var(--success)" : "var(--primary)"} />
                        </div>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>{w.produced}/{w.qty}</span>
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>Rej: {w.rejected} · Rework: {w.rework}</div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>{fmtDate(w.startDate)}</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{fmtDate(w.endDate)}</div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: st.color, background: st.bg, padding: "3px 9px", borderRadius: 99, letterSpacing: "0.05em" }}>{st.label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Showing {filtered.length} of {WORK_ORDERS.length} orders</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   WORK ORDER DETAIL
═══════════════════════════════════════════════════════════ */
function WorkOrderDetail({ woId, onView }: { woId: string; onView: (v: ProductionView, id?: string) => void }) {
  const w = WORK_ORDERS.find((x) => x.id === woId) ?? WORK_ORDERS[0]
  const st = WO_STATUS_META[w.status]
  const pct = progress(w.produced, w.qty)
  const entries = PROD_ENTRIES.filter((e) => e.woId === w.id)
  const inspections = INSPECTIONS.filter((i) => i.woId === w.id)

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => onView("orders")} style={{ background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "6px 12px", color: "var(--text-secondary)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)" }}>← Orders</button>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.01em" }}>{w.number}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: st.color, background: st.bg, padding: "3px 10px", borderRadius: 99 }}>{st.label}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{w.partName} · {w.partCode}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }} className="prod-detail-grid">
        {/* Main info */}
        <Panel title="Work Order Details">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {[
              ["Drawing", w.drawing], ["Material", w.material], ["Process", w.process], ["Machine", w.machineName],
              ["Operator", w.operatorName], ["Priority", w.priority.toUpperCase()],
              ["Start Date", fmtDate(w.startDate)], ["End Date", fmtDate(w.endDate)],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 12, color: "var(--text-primary)", fontFamily: k === "Drawing" || k === "Material" ? "var(--font-mono)" : undefined }}>{v}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Progress */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Panel title="Production Progress">
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 700, color: "var(--primary)", lineHeight: 1 }}>{w.produced}</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>of {w.qty} planned</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-secondary)", fontWeight: 600 }}>{pct}%</div>
                </div>
              </div>
              <ProgressBar value={pct} height={6} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                <div style={{ background: "var(--error-bg)", borderRadius: "var(--radius-sm)", padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: "var(--error)", marginBottom: 2 }}>Rejected</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 600, color: "var(--error)" }}>{w.rejected}</div>
                </div>
                <div style={{ background: "var(--warning-bg)", borderRadius: "var(--radius-sm)", padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: "var(--warning)", marginBottom: 2 }}>Rework</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 600, color: "var(--warning)" }}>{w.rework}</div>
                </div>
              </div>
            </div>
          </Panel>

          {w.status === "running" && (
            <button onClick={() => onView("entry")} style={{ padding: "10px 0", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
              + Add Production Entry
            </button>
          )}
        </div>
      </div>

      {/* Production entries */}
      <Panel title="Production Entries" style={{ marginBottom: 16 }}>
        {entries.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No entries recorded yet.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  {["Date", "Shift", "Machine", "Operator", "Produced", "Rejected", "Rework", "Material Used"].map((h) => (
                    <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-secondary)" }}>{fmtDate(e.date)}</td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-muted)" }}>{e.shift}</td>
                    <td style={{ padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{e.machineName}</td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-secondary)" }}>{e.operatorName}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: "var(--success)" }}>{e.produced}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--error)" }}>{e.rejected}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--warning)" }}>{e.rework}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>{e.material} {e.materialUnit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Inspections */}
      {inspections.length > 0 && (
        <Panel title="Inspection Records">
          {inspections.map((ins) => {
            const im = INSP_META[ins.result]
            return (
              <div key={ins.id} style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{ins.inspector} · {fmtDate(ins.date)}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Instrument: {ins.instrument}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: im.color, background: im.bg, padding: "3px 9px", borderRadius: 99 }}>{im.label}</span>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: ins.reasons.length ? 8 : 0 }}>
                  {[["Inspected", ins.qty, "var(--text-secondary)"], ["Accepted", ins.accepted, "var(--success)"], ["Rejected", ins.rejected, "var(--error)"], ["Rework", ins.rework, "var(--warning)"]].map(([l, v, c]) => (
                    <div key={String(l)}>
                      <div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 2 }}>{l}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: String(c) }}>{v}</div>
                    </div>
                  ))}
                </div>
                {ins.reasons.map((r, i) => (
                  <div key={i} style={{ fontSize: 11, color: "var(--error)", display: "flex", gap: 6, alignItems: "flex-start", marginTop: 4 }}>
                    <span style={{ flexShrink: 0 }}>·</span>{r}
                  </div>
                ))}
                {ins.remarks && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, fontStyle: "italic" }}>{ins.remarks}</div>}
              </div>
            )
          })}
        </Panel>
      )}

      <style>{`.prod-detail-grid{@media(max-width:900px){grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PRODUCTION ENTRY FORM
═══════════════════════════════════════════════════════════ */
function ProductionEntryForm({ onView }: { onView: (v: ProductionView) => void }) {
  const [form, setForm] = useState({ woId: "wo1", date: "2026-08-13", shift: "Day", machineId: "m1", operatorName: "R. Sharma", produced: "", rejected: "", rework: "", material: "", remarks: "" })
  const [saved, setSaved] = useState(false)
  const selectedWO = WORK_ORDERS.find((w) => w.id === form.woId)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 10px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none" }
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => onView("orders")} style={{ background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "6px 12px", color: "var(--text-secondary)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)" }}>← Cancel</button>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.01em" }}>Production Entry</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Record produced, rejected and rework quantities</div>
        </div>
      </div>

      {saved && (
        <div style={{ background: "var(--success-bg)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 16, color: "var(--success)", fontSize: 13, fontWeight: 500 }}>
          ✓ Production entry saved successfully.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }} className="prod-entry-grid">
        <div>
          <Panel title="Job Details">
            <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={labelStyle}>Work Order</label>
                <select value={form.woId} onChange={set("woId")} style={{ ...inputStyle }}>
                  {WORK_ORDERS.filter((w) => w.status === "running" || w.status === "planned").map((w) => (
                    <option key={w.id} value={w.id}>{w.number} — {w.partName}</option>
                  ))}
                </select>
              </div>
              {selectedWO && (
                <div style={{ gridColumn: "1/-1", background: "var(--bg-raised)", borderRadius: "var(--radius-sm)", padding: "10px 12px" }}>
                  <div style={{ display: "flex", gap: 24 }}>
                    <div><div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 2 }}>PART</div><div style={{ fontSize: 12, color: "var(--text-primary)" }}>{selectedWO.partName}</div></div>
                    <div><div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 2 }}>MATERIAL</div><div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{selectedWO.material}</div></div>
                    <div><div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 2 }}>PENDING</div><div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--warning)", fontWeight: 600 }}>{selectedWO.qty - selectedWO.produced}</div></div>
                  </div>
                </div>
              )}
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" value={form.date} onChange={set("date")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Shift</label>
                <select value={form.shift} onChange={set("shift")} style={inputStyle}>
                  {["Day", "Evening", "Night"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Machine</label>
                <input value={form.machineId} onChange={set("machineId")} placeholder="Machine used" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Operator</label>
                <input value={form.operatorName} onChange={set("operatorName")} style={inputStyle} />
              </div>
            </div>
          </Panel>

          <Panel title="Remarks" style={{ marginTop: 16 }}>
            <div style={{ padding: 16 }}>
              <textarea value={form.remarks} onChange={set("remarks")} rows={3} placeholder="Downtime reason, quality observations, tool changes…" style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </Panel>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Panel title="Quantity">
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {([["produced","Produced Qty","var(--success)"],["rejected","Rejected Qty","var(--error)"],["rework","Rework Qty","var(--warning)"]] as const).map(([k, l, c]) => (
                <div key={k}>
                  <label style={{ ...labelStyle, color: c }}>{l}</label>
                  <div style={{ position: "relative" }}>
                    <input type="number" min="0" value={form[k]} onChange={set(k)} placeholder="0" style={{ ...inputStyle, paddingLeft: 36, fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 600, color: c }} />
                    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: c, fontWeight: 700 }}>
                      {k === "produced" ? "✓" : k === "rejected" ? "✕" : "↩"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Material Consumed">
            <div style={{ padding: 16 }}>
              <label style={labelStyle}>Quantity Used</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" min="0" step="0.01" value={form.material} onChange={set("material")} placeholder="0.00" style={{ ...inputStyle, fontFamily: "var(--font-mono)" }} />
                <select style={{ ...inputStyle, width: "auto", minWidth: 64 }}>
                  {["kg", "pcs", "m", "litre"].map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </Panel>

          <button onClick={handleSave} style={{ padding: "13px 0", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: "0 0 20px var(--primary-glow)" }}>
            Save Production Entry
          </button>
        </div>
      </div>

      <style>{`@media(max-width:768px){.prod-entry-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}



/* ═══════════════════════════════════════════════════════════
   QUALITY CONTROL
═══════════════════════════════════════════════════════════ */
function QualityView({ onView }: { onView: (v: ProductionView) => void }) {
  const [tab, setTab] = useState<"inspections" | "history" | "trends">("inspections")
  const totalInspected = INSPECTIONS.reduce((a, i) => a + i.qty, 0)
  const totalAccepted = INSPECTIONS.reduce((a, i) => a + i.accepted, 0)
  const totalRejected = INSPECTIONS.reduce((a, i) => a + i.rejected, 0)
  const totalRework = INSPECTIONS.reduce((a, i) => a + i.rework, 0)
  const acceptRate = Math.round((totalAccepted / totalInspected) * 100)

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader title="Quality Control" description="Inspection records, defect analysis and non-conformance" accentColor="#10b981"
        primaryAction={{ label: "Scrap Register", onClick: () => onView("scrap") }} />

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }} className="qc-kpi-grid">
        <KpiCard label="Total Inspected" value={totalInspected} unit=" pcs" color="var(--text-secondary)" sub="This week" />
        <KpiCard label="Accepted" value={totalAccepted} color="var(--success)" sub={`${acceptRate}% acceptance rate`} />
        <KpiCard label="Rejected" value={totalRejected} change={-1.5} color="var(--error)" sub="Non-conforming" />
        <KpiCard label="Rework" value={totalRework} color="var(--warning)" sub="Corrective action" />
      </div>

      <SubNav tabs={[{ id: "inspections", label: "Inspections" }, { id: "history", label: "Inspection History" }, { id: "trends", label: "Defect Analysis" }]} active={tab} onChange={(id) => setTab(id as typeof tab)} />

      {tab === "inspections" && (
        <div>
          {INSPECTIONS.map((ins) => {
            const im = INSP_META[ins.result]
            return (
              <div key={ins.id} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", marginBottom: 12, overflow: "hidden" }}>
                <div style={{ height: 3, background: im.color }} />
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>{ins.woNumber}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: im.color, background: im.bg, padding: "2px 8px", borderRadius: 99 }}>{im.label.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{ins.partName}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Inspector: {ins.inspector} · {fmtDate(ins.date)} · {ins.instrument}</div>
                    </div>
                    <div style={{ display: "flex", gap: 20 }}>
                      {([["Qty", ins.qty, "var(--text-secondary)"], ["Accepted", ins.accepted, "var(--success)"], ["Rejected", ins.rejected, "var(--error)"], ["Rework", ins.rework, "var(--warning)"]] as const).map(([l, v, c]) => (
                        <div key={l} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, color: c, lineHeight: 1 }}>{v}</div>
                          <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {ins.reasons.length > 0 && (
                    <div style={{ background: "var(--error-bg)", border: "1px solid var(--error-border)", borderRadius: "var(--radius-sm)", padding: "8px 12px", marginBottom: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--error)", marginBottom: 4 }}>REJECTION REASONS</div>
                      {ins.reasons.map((r, i) => (
                        <div key={i} style={{ fontSize: 11, color: "var(--error)", display: "flex", gap: 6, alignItems: "flex-start" }}>
                          <span>·</span>{r}
                        </div>
                      ))}
                    </div>
                  )}
                  {ins.remarks && <div style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>{ins.remarks}</div>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === "history" && (
        <Panel title="All Inspections">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  {["WO No.", "Part", "Date", "Qty", "Accepted", "Rejected", "Rework", "Result"].map((h) => (
                    <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INSPECTIONS.map((ins) => {
                  const im = INSP_META[ins.result]
                  return (
                    <tr key={ins.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>{ins.woNumber}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-primary)" }}>{ins.partName}</td>
                      <td style={{ padding: "10px 14px", fontSize: 11, color: "var(--text-muted)" }}>{fmtDate(ins.date)}</td>
                      <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>{ins.qty}</td>
                      <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--success)" }}>{ins.accepted}</td>
                      <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--error)" }}>{ins.rejected}</td>
                      <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--warning)" }}>{ins.rework}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: im.color, background: im.bg, padding: "2px 8px", borderRadius: 99 }}>{im.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {tab === "trends" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="qc-trend-grid">
          <Panel title="Defect Distribution">
            <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 20 }}>
              <PieChart width={160} height={160}>
                <Pie data={defectDist} cx={75} cy={75} innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                  {defectDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<ChartTip />} />
              </PieChart>
              <div style={{ flex: 1 }}>
                {defectDist.map((d, i) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i], flexShrink: 0, display: "inline-block" }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>{d.name}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: PIE_COLORS[i] }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
          <Panel title="Acceptance Rate Trend">
            <div style={{ padding: "16px 20px 8px" }}>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={[
                  { w: "W28", rate: 96.2 }, { w: "W29", rate: 97.1 }, { w: "W30", rate: 95.8 },
                  { w: "W31", rate: 98.2 }, { w: "W32", rate: 97.4 }, { w: "W33", rate: 96.8 },
                ]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="w" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[93, 100]} tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="rate" name="Accept %" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <style>{`@media(max-width:768px){.qc-trend-grid{grid-template-columns:1fr!important}}`}</style>
        </div>
      )}

      <style>{`@media(max-width:900px){.qc-kpi-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SCRAP
═══════════════════════════════════════════════════════════ */
function ScrapView() {
  const totalValue = SCRAP_RECORDS.reduce((a, s) => a + s.value, 0)
  const totalQty = SCRAP_RECORDS.reduce((a, s) => a + s.qty, 0)

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader title="Scrap Register" description="Scrap recording, valuation and analysis" accentColor="#ef4444"
        primaryAction={{ label: "+ Record Scrap", onClick: () => {} }} />

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }} className="scrap-kpi-grid">
        <KpiCard label="Total Scrap Qty" value={totalQty} unit=" pcs" color="var(--error)" sub="This period" />
        <KpiCard label="Scrap Value" value={totalValue} prefix="₹" color="var(--warning)" sub="Material loss" />
        <KpiCard label="Scrap Records" value={SCRAP_RECORDS.length} color="var(--text-secondary)" sub="Entries recorded" />
      </div>

      {/* Scrap cards */}
      {SCRAP_RECORDS.map((s) => (
        <div key={s.id} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderLeft: "3px solid var(--error)", borderRadius: "var(--radius-md)", padding: "16px 18px", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>{s.woNumber}</span>
                <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{fmtDate(s.date)}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>{s.partName}</div>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div><span style={{ fontSize: 10, color: "var(--text-muted)" }}>Material: </span><span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{s.material}</span></div>
                <div><span style={{ fontSize: 10, color: "var(--text-muted)" }}>Qty: </span><span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--error)", fontWeight: 600 }}>{s.qty} {s.unit}</span></div>
                <div><span style={{ fontSize: 10, color: "var(--text-muted)" }}>By: </span><span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{s.by}</span></div>
              </div>
              <div style={{ marginTop: 8, background: "var(--error-bg)", border: "1px solid var(--error-border)", borderRadius: "var(--radius-xs)", padding: "6px 10px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--error)" }}>REASON: </span>
                <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{s.reason}</span>
              </div>
            </div>
            <div style={{ textAlign: "right", marginLeft: 20, flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--error)" }}>₹{s.value.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>scrap value</div>
            </div>
          </div>
        </div>
      ))}

      {/* Total */}
      <div style={{ background: "var(--error-bg)", border: "1px solid var(--error-border)", borderRadius: "var(--radius-md)", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--error)" }}>Total Scrap Value</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--error)" }}>₹{totalValue.toLocaleString()}</div>
      </div>

      <style>{`@media(max-width:600px){.scrap-kpi-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MATERIAL CONSUMPTION VIEW
═══════════════════════════════════════════════════════════ */
interface MatEntry {
  id: string; woNumber: string; partName: string; date: string
  material: string; code: string; uom: string
  planned: number; actual: number; variance: number
  operator: string
}

const MAT_DATA: MatEntry[] = [
  { id:"mc1", woNumber:"WO-2026-0841", partName:"Flange Bearing Housing", date:"2026-08-19", material:"AL6061-T6 Plate",    code:"RM-001", uom:"kg",  planned:4.2,  actual:4.5,  variance:0.3,   operator:"R. Sharma",   },
  { id:"mc2", woNumber:"WO-2026-0841", partName:"Flange Bearing Housing", date:"2026-08-19", material:"Cutting Oil",         code:"CS-012", uom:"L",   planned:0.5,  actual:0.6,  variance:0.1,   operator:"R. Sharma",   },
  { id:"mc3", woNumber:"WO-2026-0840", partName:"Drive Shaft — 42mm",    date:"2026-08-19", material:"EN24 Round Bar",      code:"RM-003", uom:"kg",  planned:12.0, actual:11.8, variance:-0.2,  operator:"S. Kumar",    },
  { id:"mc4", woNumber:"WO-2026-0840", partName:"Drive Shaft — 42mm",    date:"2026-08-19", material:"Cutting Insert CNMG", code:"TO-007", uom:"pcs", planned:2,    actual:3,    variance:1,     operator:"S. Kumar",    },
  { id:"mc5", woNumber:"WO-2026-0839", partName:"Valve Housing",          date:"2026-08-18", material:"SS316L Plate",        code:"RM-006", uom:"kg",  planned:6.5,  actual:6.7,  variance:0.2,   operator:"P. Yadav",    },
  { id:"mc6", woNumber:"WO-2026-0839", partName:"Valve Housing",          date:"2026-08-18", material:"Cutting Oil",         code:"CS-012", uom:"L",   planned:0.8,  actual:0.8,  variance:0,     operator:"P. Yadav",    },
  { id:"mc7", woNumber:"WO-2026-0838", partName:"Shaft Coupling",         date:"2026-08-17", material:"EN8 Round Bar",       code:"RM-002", uom:"kg",  planned:28.0, actual:27.2, variance:-0.8,  operator:"M. Nair",     },
  { id:"mc8", woNumber:"WO-2026-0838", partName:"Shaft Coupling",         date:"2026-08-17", material:"Cutting Insert DCMT", code:"TO-009", uom:"pcs", planned:4,    actual:5,    variance:1,     operator:"M. Nair",     },
]

const BAR_COLORS = { positive: "#ef4444", negative: "#10b981", zero: "#4b5a72" }

function MaterialConsumptionView({ onView }: { onView: (v: ProductionView) => void }) {
  const [search, setSearch] = useState("")
  const [woFilter, setWoFilter] = useState("")

  const filtered = MAT_DATA.filter((m) =>
    (!search || m.material.toLowerCase().includes(search.toLowerCase()) || m.partName.toLowerCase().includes(search.toLowerCase())) &&
    (!woFilter || m.woNumber === woFilter)
  )

  const totalPlanned = filtered.reduce((a, m) => a + m.planned, 0)
  const totalActual  = filtered.reduce((a, m) => a + m.actual, 0)
  const totalVar     = totalActual - totalPlanned
  const overuse      = filtered.filter((m) => m.variance > 0).length

  const woNumbers = [...new Set(MAT_DATA.map((m) => m.woNumber))]

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader
        title="Material Consumption"
        description="Track material usage per work order with variance analysis vs. planned"
        accentColor="#10b981"
        primaryAction={{ label: "+ New Entry", onClick: () => {} }}
        secondaryActions={[{ label: "Export", onClick: () => {} }]}
      />

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }} className="mc-kpi-grid">
        {[
          { label: "Total Planned",    value: `${totalPlanned.toFixed(1)}`, unit: "units", color: "#2563eb" },
          { label: "Total Actual",     value: `${totalActual.toFixed(1)}`,  unit: "units", color: "#10b981" },
          { label: "Total Variance",   value: `${totalVar > 0 ? "+" : ""}${totalVar.toFixed(1)}`, unit: "units", color: totalVar > 0 ? "#ef4444" : "#10b981" },
          { label: "Over-Usage Rows",  value: `${overuse}`,                 unit: "entries", color: overuse > 0 ? "#f59e0b" : "#10b981" },
        ].map((k) => (
          <div key={k.label} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "16px 18px", borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search material or part…" style={{ flex: "1 1 200px", padding: "8px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 12, outline: "none", fontFamily: "var(--font-body)" }} />
        <select value={woFilter} onChange={(e) => setWoFilter(e.target.value)} style={{ padding: "8px 12px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 12, outline: "none", cursor: "pointer" }}>
          <option value="">All Work Orders</option>
          {woNumbers.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 24 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
            <thead>
              <tr style={{ background: "var(--bg-raised)", borderBottom: "1px solid var(--border-subtle)" }}>
                {["Work Order", "Part Name", "Date", "Material", "Code", "UOM", "Planned", "Actual", "Variance", "Operator"].map((h) => (
                  <th key={h} style={{ padding: "9px 13px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11} style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No records match your filters.</td></tr>
              ) : filtered.map((m) => {
                const varColor = m.variance > 0 ? "#ef4444" : m.variance < 0 ? "#10b981" : "var(--text-muted)"
                return (
                  <tr key={m.id} style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.1s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-raised)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}>
                    <td style={{ padding: "10px 13px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--primary)" }}>{m.woNumber}</td>
                    <td style={{ padding: "10px 13px", fontSize: 12, color: "var(--text-secondary)" }}>{m.partName}</td>
                    <td style={{ padding: "10px 13px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{m.date}</td>
                    <td style={{ padding: "10px 13px", fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>{m.material}</td>
                    <td style={{ padding: "10px 13px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{m.code}</td>
                    <td style={{ padding: "10px 13px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{m.uom}</td>
                    <td style={{ padding: "10px 13px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>{m.planned}</td>
                    <td style={{ padding: "10px 13px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-primary)", fontWeight: 600 }}>{m.actual}</td>
                    <td style={{ padding: "10px 13px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: varColor, background: `${varColor}15`, padding: "2px 8px", borderRadius: 99 }}>
                        {m.variance > 0 ? `+${m.variance}` : m.variance}
                      </span>
                    </td>
                    <td style={{ padding: "10px 13px", fontSize: 12, color: "var(--text-secondary)" }}>{m.operator}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "9px 13px", borderTop: "1px solid var(--border-subtle)", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          {filtered.length} entries shown
        </div>
      </div>

      {/* Variance chart */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "20px 20px 12px" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-primary)", marginBottom: 16 }}>Variance by Material</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={filtered.filter((m) => m.variance !== 0)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="material" tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--bg-overlay)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", fontSize: 12 }} formatter={(v) => [`${Number(v) > 0 ? "+" : ""}${Number(v)}`, "Variance"]} />
            <Bar dataKey="variance" radius={[3,3,0,0]}>
              {filtered.filter((m) => m.variance !== 0).map((entry, i) => (
                <Cell key={i} fill={entry.variance > 0 ? "#ef4444" : "#10b981"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <style>{`@media(max-width:900px){.mc-kpi-grid{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════════ */
interface Props {
  initialView?: ProductionView
  onNavigate?: (id: string) => void
}

export function ProductionModule({ initialView = "dashboard", onNavigate: appNavigate }: Props) {
  const [view, setView] = useState<ProductionView>(initialView)
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const handleView = useCallback((v: ProductionView, id?: string) => {
    const topViews = ["dashboard", "orders", "quality", "scrap", "material-consumption"]
    if (topViews.includes(v)) {
      const globalId = v === "dashboard" ? "productionDashboard" : v === "orders" ? "production" : v === "material-consumption" ? "materialConsumption" : v
      appNavigate?.(globalId)
    } else {
      setView(v)
      if (id !== undefined) setSelectedId(id)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [appNavigate])

  // Sync with parent navigation
  useEffect(() => {
    setView(initialView)
  }, [initialView])

  const renderView = () => {
    switch (view) {
      case "dashboard":     return <ProductionDashboard onView={handleView} />
      case "orders":        return <WorkOrdersList onView={handleView} />
      case "order-detail":  return <WorkOrderDetail woId={selectedId ?? "wo1"} onView={handleView} />
      case "entry":         return <ProductionEntryForm onView={handleView} />
      case "quality":               return <QualityView onView={handleView} />
      case "scrap":                 return <ScrapView />
      case "material-consumption":  return <MaterialConsumptionView onView={handleView} />
      default:                      return <ProductionDashboard onView={handleView} />
    }
  }

  return (
    <div>
      {renderView()}
      <style>{`
        @keyframes mac-ping {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes mac-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
