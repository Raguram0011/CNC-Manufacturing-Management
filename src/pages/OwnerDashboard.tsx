import { useState, useEffect, useRef } from "react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts"

interface Props {
  onNavigate: (id: string) => void
}

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */


const billingData = [
  { month: "Mar", billing: 2140, collected: 1820 },
  { month: "Apr", billing: 2580, collected: 2100 },
  { month: "May", billing: 2210, collected: 2010 },
  { month: "Jun", billing: 2880, collected: 2640 },
  { month: "Jul", billing: 2520, collected: 2280 },
  { month: "Aug", billing: 2845, collected: 2240 },
]

const purchaseData = [
  { month: "Mar", purchase: 620, budget: 800 },
  { month: "Apr", purchase: 780, budget: 800 },
  { month: "May", purchase: 520, budget: 800 },
  { month: "Jun", purchase: 890, budget: 800 },
  { month: "Jul", purchase: 740, budget: 800 },
  { month: "Aug", purchase: 924, budget: 800 },
]

const productionData = [
  { month: "Mar", parts: 78400, target: 80000 },
  { month: "Apr", parts: 82100, target: 80000 },
  { month: "May", parts: 79200, target: 80000 },
  { month: "Jun", parts: 85400, target: 80000 },
  { month: "Jul", parts: 84100, target: 80000 },
  { month: "Aug", parts: 21840, target: 26400 },
]

const attendanceData = [
  { month: "Mar", present: 148, absent: 7 },
  { month: "Apr", present: 151, absent: 4 },
  { month: "May", present: 143, absent: 12 },
  { month: "Jun", present: 150, absent: 5 },
  { month: "Jul", present: 146, absent: 9 },
  { month: "Aug", present: 142, absent: 13 },
]

const expenseData = [
  { month: "Mar", expense: 420, budget: 650 },
  { month: "Apr", expense: 580, budget: 650 },
  { month: "May", expense: 490, budget: 650 },
  { month: "Jun", expense: 620, budget: 650 },
  { month: "Jul", expense: 540, budget: 650 },
  { month: "Aug", expense: 648, budget: 650 },
]

const rejectionData = [
  { month: "Mar", rejected: 42, rate: 0.54 },
  { month: "Apr", rejected: 38, rate: 0.46 },
  { month: "May", rejected: 51, rate: 0.64 },
  { month: "Jun", rejected: 29, rate: 0.34 },
  { month: "Jul", rejected: 33, rate: 0.39 },
  { month: "Aug", rejected: 9, rate: 0.21 },
]



const LOW_STOCK = [
  { part: "AL6061-T6 Plate 12mm",     unit: "kg",  stock: 12,  min: 50,  reorder: 200 },
  { part: "Carbide Insert CNMG-431",  unit: "pcs", stock: 8,   min: 20,  reorder: 100 },
  { part: "Coolant HC7 Conc. (20L)",  unit: "drum",stock: 2,   min: 5,   reorder: 10  },
  { part: "SS304 Round Bar ⌀50mm",    unit: "pcs", stock: 3,   min: 10,  reorder: 40  },
  { part: "End Mill 10mm Carbide",    unit: "pcs", stock: 4,   min: 15,  reorder: 50  },
  { part: "Hydraulic Oil ISO46 (5L)", unit: "can", stock: 1,   min: 3,   reorder: 12  },
]

const PENDING_WO = [
  { id: "WO-0841", part: "Valve Body AL6061",  qty: 120, done: 84,  due: "Today 18:00",   priority: "high"   },
  { id: "WO-0842", part: "Flange SS304",        qty: 60,  done: 22,  due: "Aug 18 EOD",    priority: "medium" },
  { id: "WO-0843", part: "Bracket AL7075",      qty: 200, done: 0,   due: "Aug 19 EOD",    priority: "medium" },
  { id: "WO-0844", part: "Shaft 42CrMo4",      qty: 30,  done: 18,  due: "Aug 20 EOD",    priority: "low"    },
  { id: "WO-0845", part: "Housing Steel 4140",  qty: 15,  done: 6,   due: "Aug 21 EOD",    priority: "low"    },
]

const PENDING_PAYMENTS = [
  { ref: "INV-2024-0179", party: "TechMetal Industries",   amt: 184200, due: "Aug 14", overdue: true  },
  { ref: "INV-2024-0174", party: "Precision Parts Co.",    amt: 128500, due: "Aug 16", overdue: true  },
  { ref: "INV-2024-0180", party: "Bharat Engineering",     amt: 76000,  due: "Aug 18", overdue: false },
  { ref: "INV-2024-0181", party: "Gamma Machining Ltd.",   amt: 54000,  due: "Aug 20", overdue: false },
  { ref: "INV-2024-0182", party: "Delta Aerospace",        amt: 220000, due: "Aug 22", overdue: false },
]



const ATTENDANCE_TODAY = [
  { name: "Juan Martinez",   dept: "Production", shift: "Day",   time: "08:02",  status: "in"   },
  { name: "Sarah Okonkwo",   dept: "HR",         shift: "Day",   time: "08:15",  status: "in"   },
  { name: "Kenji Tanaka",    dept: "Production", shift: "Day",   time: "07:58",  status: "in"   },
  { name: "Luisa Dupont",    dept: "Store",      shift: "Day",   time: "08:45",  status: "late" },
  { name: "Raj Patel",       dept: "Accounts",   shift: "Day",   time: "08:10",  status: "in"   },
  { name: "Marcus Schmidt",  dept: "Production", shift: "Day",   time: "—",      status: "absent"},
  { name: "Priya Sharma",    dept: "Quality",    shift: "Day",   time: "08:01",  status: "in"   },
]

type ActivityTab = "invoices" | "stock" | "purchase" | "production" | "hr"

const ACTIVITY: Record<ActivityTab, Array<{ icon: string; color: string; title: string; sub: string; time: string; badge?: string; badgeColor?: string }>> = {
  invoices: [
    { icon: "₹", color: "var(--success)",  title: "INV-2024-0183 raised — TechMetal",      sub: "₹84,200 · Net 30",          time: "14:48", badge: "RAISED",   badgeColor: "var(--info)"    },
    { icon: "✓", color: "var(--success)",  title: "INV-2024-0178 payment received",         sub: "Precision Parts Co. · Full", time: "13:22", badge: "PAID",     badgeColor: "var(--success)" },
    { icon: "!", color: "var(--warning)",  title: "INV-2024-0179 overdue — 3 days",         sub: "TechMetal Industries · ₹1.84L",time: "09:00", badge: "OVERDUE",  badgeColor: "var(--warning)" },
    { icon: "₹", color: "var(--primary)",  title: "INV-2024-0182 raised — Delta Aerospace", sub: "₹2,20,000 · Net 30",        time: "Yesterday", badge: "RAISED", badgeColor: "var(--info)"   },
    { icon: "✓", color: "var(--success)",  title: "INV-2024-0177 partially paid",           sub: "Gamma Machining · ₹40,000/₹54,000",time: "Yesterday", badge: "PARTIAL", badgeColor: "var(--warning)" },
  ],
  stock: [
    { icon: "↓", color: "var(--error)",    title: "AL6061-T6 below reorder — 12 kg",        sub: "Reorder point: 50 kg",       time: "13:45", badge: "CRITICAL", badgeColor: "var(--error)"   },
    { icon: "→", color: "var(--accent)",   title: "150 pcs Carbide Insert CNMG issued",     sub: "To WO-0841 Production",      time: "11:20", badge: "ISSUED",   badgeColor: "var(--accent)"  },
    { icon: "↑", color: "var(--success)",  title: "SS304 Bar 50mm received — 40 pcs",       sub: "PO-2024-0339 Bharat Alloys", time: "09:15", badge: "RECEIVED", badgeColor: "var(--success)" },
    { icon: "↓", color: "var(--warning)",  title: "Coolant drums down to 2 — reorder now",  sub: "Reorder point: 5 drums",     time: "08:50", badge: "LOW",      badgeColor: "var(--warning)" },
    { icon: "→", color: "var(--accent)",   title: "Hydraulic oil 5L ×3 issued — CNC-004",   sub: "Maintenance PM",             time: "Yesterday", badge: "ISSUED", badgeColor: "var(--accent)"  },
  ],
  purchase: [
    { icon: "✓", color: "var(--success)",  title: "PO-2024-0341 approved — Bharat Alloys",  sub: "AL6061 Plate 200 kg · ₹48,000",time: "12:30", badge: "APPROVED", badgeColor: "var(--success)" },
    { icon: "+", color: "var(--primary)",  title: "PO-2024-0342 raised — Toolex India",     sub: "Carbide Inserts 100 pcs · ₹12,400",time: "11:05", badge: "PENDING", badgeColor: "var(--warning)" },
    { icon: "↑", color: "var(--accent)",   title: "Delivery received — PO-2024-0338",        sub: "Coolant HC7 × 10 drums",     time: "09:30", badge: "RECEIVED", badgeColor: "var(--success)" },
    { icon: "!", color: "var(--warning)",  title: "PO-2024-0340 overdue delivery",           sub: "SS316 supplier delay 2 days", time: "08:00", badge: "DELAYED",  badgeColor: "var(--error)"   },
    { icon: "+", color: "var(--primary)",  title: "PO-2024-0343 raised — Carbide World",    sub: "End Mill ×50 · ₹22,500",    time: "Yesterday", badge: "PENDING", badgeColor: "var(--warning)" },
  ],
  production: [
    { icon: "✓", color: "var(--success)",  title: "WO-0838 completed — Valve Body 250 pcs", sub: "FAI passed · 0 rejections",  time: "14:20", badge: "DONE",     badgeColor: "var(--success)" },
    { icon: "!", color: "var(--warning)",  title: "WO-0841 behind schedule — 12 pcs",       sub: "84/120 done · Due 18:00",    time: "12:15", badge: "BEHIND",   badgeColor: "var(--warning)" },
    { icon: "✕", color: "var(--error)",    title: "CNC-007 fault — WO-0841 paused",         sub: "Spindle fault · Maint called",time: "10:32", badge: "HALTED",   badgeColor: "var(--error)"   },
    { icon: "+", color: "var(--primary)",  title: "WO-0843 released to production floor",   sub: "Bracket AL7075 · 200 pcs",   time: "09:00", badge: "STARTED",  badgeColor: "var(--primary)" },
    { icon: "↗", color: "var(--accent)",   title: "OEE improved to 96.4% today",            sub: "vs 94.3% yesterday",         time: "08:00", badge: "KPI",      badgeColor: "var(--accent)"  },
  ],
  hr: [
    { icon: "→", color: "var(--warning)",  title: "Luisa Dupont — late arrival 08:45",      sub: "Store Dept · Day shift",     time: "08:45", badge: "LATE",     badgeColor: "var(--warning)" },
    { icon: "✓", color: "var(--success)",  title: "Leave approved — J. Martinez Aug 20-22", sub: "Annual leave · 3 days",      time: "08:30", badge: "APPROVED", badgeColor: "var(--success)" },
    { icon: "!", color: "var(--info)",     title: "Marcus Schmidt absent — unnotified",     sub: "Production · Day shift",     time: "08:15", badge: "ABSENT",   badgeColor: "var(--error)"   },
    { icon: "+", color: "var(--primary)",  title: "New employee onboarded — K. Nair",       sub: "CNC Operator · Production",  time: "Yesterday", badge: "NEW",   badgeColor: "var(--success)" },
    { icon: "!", color: "var(--warning)",  title: "5 pending leave requests",               sub: "Awaiting approval",          time: "Yesterday", badge: "PENDING", badgeColor: "var(--warning)"},
  ],
}

/* ══════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
══════════════════════════════════════════════════════════════ */

type DashState = "data" | "loading" | "error" | "empty"

function useCountUp(target: number, duration = 900, deps: unknown[] = []) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const t = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(t); return }
      setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return val
}

function SkeletonLine({ w = "100%", h = 12, mb = 6 }: { w?: string | number; h?: number; mb?: number }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: 3, marginBottom: mb }} />
}

function PanelCard({
  title, badge, badgeColor, action, actionLabel, children, minH,
}: {
  title: string
  badge?: string | number
  badgeColor?: string
  action?: () => void
  actionLabel?: string
  children: React.ReactNode
  minH?: number
}) {
  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      minHeight: minH,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderBottom: "1px solid var(--border-subtle)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{title}</span>
          {badge !== undefined && (
            <span style={{ fontSize: 9, fontWeight: 700, color: badgeColor ?? "var(--error)", background: `${badgeColor ?? "var(--error)"}18`, border: `1px solid ${badgeColor ?? "var(--error)"}30`, borderRadius: "var(--radius-xs)", padding: "1px 5px", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
              {badge}
            </span>
          )}
        </div>
        {action && (
          <button onClick={action} style={{ fontSize: 11, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>
            {actionLabel ?? "View all →"}
          </button>
        )}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

function ChartCard({
  title, subtitle, value, unit, change, children, colSpan = 1,
}: {
  title: string; subtitle?: string; value?: string; unit?: string; change?: number; children: React.ReactNode; colSpan?: number
}) {
  const isPos = (change ?? 0) >= 0
  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      padding: "16px 20px",
      gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{subtitle}</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          {value && (
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-primary)", lineHeight: 1 }}>{value}{unit}</div>
          )}
          {change !== undefined && (
            <div style={{ fontSize: 10, color: isPos ? "var(--success)" : "var(--error)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
              {isPos ? "▲" : "▼"} {Math.abs(change)}% vs last month
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

function DashTooltip({ active, payload, label, prefix = "", suffix = "" }: {
  active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string; prefix?: string; suffix?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", padding: "10px 14px", boxShadow: "var(--shadow-md)" }}>
      <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ fontSize: 11, color: p.color, fontFamily: "var(--font-mono)", display: "flex", justifyContent: "space-between", gap: 14 }}>
          <span style={{ color: "var(--text-secondary)" }}>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{prefix}{typeof p.value === "number" && p.value > 999 ? p.value.toLocaleString() : p.value}{suffix}</span>
        </div>
      ))}
    </div>
  )
}

function StateEmpty({ message }: { message: string }) {
  return (
    <div style={{ padding: "40px 16px", textAlign: "center" }}>
      <div style={{ width: 40, height: 40, margin: "0 auto 12px", borderRadius: "50%", background: "var(--bg-raised)", border: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{message}</div>
    </div>
  )
}

function StateError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div style={{ padding: "32px 16px", textAlign: "center" }}>
      <div style={{ width: 40, height: 40, margin: "0 auto 12px", borderRadius: "50%", background: "var(--error-bg)", border: "1px solid var(--error-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>Failed to load data</div>
      {onRetry && (
        <button onClick={onRetry} style={{ fontSize: 11, color: "var(--primary)", background: "var(--primary-subtle)", border: "1px solid var(--primary)", borderRadius: "var(--radius-xs)", padding: "4px 12px", cursor: "pointer", fontFamily: "var(--font-body)" }}>
          Retry
        </button>
      )}
    </div>
  )
}

function KpiSkeleton() {
  return (
    <div style={{ padding: "18px 20px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
      <SkeletonLine w="60%" h={10} mb={10} />
      <SkeletonLine w="80%" h={24} mb={8} />
      <SkeletonLine w="50%" h={10} mb={0} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   KPI CARD
══════════════════════════════════════════════════════════════ */

interface KpiDef {
  label: string; rawValue: number; display: string; prefix?: string
  unit?: string; change?: number; color: string; sub?: string; link?: string
}

const KPIS: KpiDef[] = [
  { label: "Today's Billing",      rawValue: 284500, display: "2,84,500", prefix: "₹", change:  +18.4, color: "var(--success)", sub: "3 invoices raised"   },
  { label: "Monthly Billing",      rawValue: 2845,   display: "28.45",    prefix: "₹", unit: "L", change: +12.4, color: "var(--primary)", sub: "₹22.4L collected"  },
  { label: "Purchase (MTD)",       rawValue: 924,    display: "9.24",     prefix: "₹", unit: "L", change:  +4.2, color: "var(--warning)", sub: "7 POs this month"  },
  { label: "Current Stock Value",  rawValue: 12400,  display: "1.24",     prefix: "₹", unit: "Cr", change: -1.8, color: "var(--accent)",  sub: "283 SKUs tracked"  },
  { label: "Production (Today)",   rawValue: 4218,   display: "4,218",    unit: "pcs",              change:  +8.3, color: "var(--success)", sub: "87% of daily target"},
  { label: "Rejection Count",      rawValue: 9,      display: "9",        unit: "pcs",              change:  -3.2, color: "var(--error)",   sub: "0.21% rate — good" },
  { label: "Employees Present",    rawValue: 142,    display: "142",                                change:  -0.7, color: "var(--info)",    sub: "of 155 total"      },
  { label: "Pending Payments",     rawValue: 6625,   display: "66.25",    prefix: "₹", unit: "L",                 color: "var(--warning)", sub: "5 invoices overdue" },
]

function KpiCard({ kpi, state, index }: { kpi: KpiDef; state: DashState; index: number }) {
  useCountUp(kpi.rawValue, 900, [state])
  const displayVal = state === "data"
    ? (kpi.display)
    : "—"

  const isPos = (kpi.change ?? 0) >= 0
  const hovered = useRef(false)
  const [, forceRender] = useState(0)

  if (state === "loading") return <KpiSkeleton />
  if (state === "error") return (
    <div style={{ padding: "18px 20px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 100 }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>—</div>
    </div>
  )

  return (
    <div
      onMouseEnter={() => { hovered.current = true; forceRender(n => n + 1) }}
      onMouseLeave={() => { hovered.current = false; forceRender(n => n + 1) }}
      style={{
        padding: "18px 20px",
        background: hovered.current ? "var(--bg-raised)" : "var(--bg-elevated)",
        border: `1px solid ${hovered.current ? "var(--border-strong)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-md)",
        borderLeft: `3px solid ${kpi.color}`,
        display: "flex",
        flexDirection: "column",
        gap: 5,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.18s ease",
        cursor: "default",
        animation: `fade-in 0.4s ease-out ${index * 0.06}s both`,
      }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${kpi.color}18 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
        {kpi.label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        {kpi.prefix && <span style={{ fontSize: 14, fontFamily: "var(--font-mono)", color: kpi.color, fontWeight: 500 }}>{kpi.prefix}</span>}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700, color: kpi.color, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {state === "data" ? displayVal : "—"}
        </span>
        {kpi.unit && <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{kpi.unit}</span>}
      </div>
      {kpi.sub && <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{kpi.sub}</div>}
      {kpi.change !== undefined && state === "data" && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: isPos ? "var(--success)" : "var(--error)" }}>
          <span>{isPos ? "▲" : "▼"}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{Math.abs(kpi.change)}%</span>
          <span style={{ color: "var(--text-muted)" }}>vs last month</span>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   OPERATIONAL WIDGETS
══════════════════════════════════════════════════════════════ */



function LowStockWidget({ onNavigate, state }: { onNavigate: (id: string) => void; state: DashState }) {
  return (
    <PanelCard title="Low Stock Alerts" badge={`${LOW_STOCK.length} ITEMS`} badgeColor="var(--error)" action={() => onNavigate("inventory")}>
      {state === "loading" && <div style={{ padding: 12 }}>{[...Array(4)].map((_, i) => <SkeletonLine key={i} h={36} mb={4} />)}</div>}
      {state === "empty" && <StateEmpty message="All stock levels are adequate." />}
      {state === "error" && <StateError />}
      {state === "data" && LOW_STOCK.map((item, i) => {
        const pct = Math.round((item.stock / item.min) * 100)
        return (
          <div key={i} style={{ padding: "9px 16px", borderBottom: "1px solid var(--border-subtle)", transition: "background 0.12s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-raised)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: pct <= 30 ? "var(--error)" : "var(--warning)", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.part}</div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  Stock: {item.stock} {item.unit} / Min: {item.min} {item.unit} / Reorder: {item.reorder}
                </div>
              </div>
              <button onClick={() => onNavigate("purchase")} style={{ fontSize: 9, color: "var(--primary)", background: "var(--primary-subtle)", border: "1px solid var(--primary)", borderRadius: "var(--radius-xs)", padding: "2px 7px", cursor: "pointer", flexShrink: 0, fontFamily: "var(--font-body)" }}>
                PO
              </button>
            </div>
            {/* Stock bar */}
            <div style={{ height: 3, background: "var(--bg-raised)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: pct <= 30 ? "var(--error)" : "var(--warning)", borderRadius: 2, transition: "width 0.8s ease" }} />
            </div>
          </div>
        )
      })}
    </PanelCard>
  )
}

function PendingWOWidget({ onNavigate, state }: { onNavigate: (id: string) => void; state: DashState }) {
  return (
    <PanelCard title="Pending Work Orders" badge="5 ACTIVE" badgeColor="var(--primary)" action={() => onNavigate("production")}>
      {state === "loading" && <div style={{ padding: 12 }}>{[...Array(4)].map((_, i) => <SkeletonLine key={i} h={40} mb={4} />)}</div>}
      {state === "empty" && <StateEmpty message="No pending work orders." />}
      {state === "error" && <StateError />}
      {state === "data" && PENDING_WO.map((wo, i) => {
        const pct = Math.round((wo.done / wo.qty) * 100)
        const priorityColor: Record<string, string> = { high: "var(--error)", medium: "var(--warning)", low: "var(--text-muted)" }
        return (
          <div key={i} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)", transition: "background 0.12s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-raised)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", flexShrink: 0 }}>{wo.id}</span>
              <span style={{ flex: 1, fontSize: 11, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{wo.part}</span>
              <span style={{ fontSize: 9, color: priorityColor[wo.priority], fontWeight: 700, flexShrink: 0 }}>{wo.priority.toUpperCase()}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <div style={{ flex: 1, height: 4, background: "var(--bg-raised)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "var(--success)" : pct > 60 ? "var(--primary)" : "var(--warning)", borderRadius: 2, transition: "width 0.8s ease" }} />
              </div>
              <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", flexShrink: 0 }}>{wo.done}/{wo.qty}</span>
            </div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Due: {wo.due}</div>
          </div>
        )
      })}
    </PanelCard>
  )
}

function PendingPaymentsWidget({ onNavigate, state }: { onNavigate: (id: string) => void; state: DashState }) {
  const total = PENDING_PAYMENTS.reduce((a, p) => a + p.amt, 0)
  return (
    <PanelCard title="Pending Receivables" badge={`₹${(total / 100000).toFixed(2)}L`} badgeColor="var(--warning)" action={() => onNavigate("payments")}>
      {state === "loading" && <div style={{ padding: 12 }}>{[...Array(4)].map((_, i) => <SkeletonLine key={i} h={36} mb={4} />)}</div>}
      {state === "empty" && <StateEmpty message="No pending receivables." />}
      {state === "error" && <StateError />}
      {state === "data" && PENDING_PAYMENTS.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderBottom: "1px solid var(--border-subtle)", transition: "background 0.12s ease" }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-raised)" }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent" }}
        >
          {p.overdue && <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--error)", flexShrink: 0 }} />}
          {!p.overdue && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--border-default)", flexShrink: 0 }} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.party}</div>
            <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: p.overdue ? "var(--error)" : "var(--text-muted)" }}>
              {p.ref} · Due {p.due} {p.overdue ? "· OVERDUE" : ""}
            </div>
          </div>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 700, color: p.overdue ? "var(--error)" : "var(--text-primary)", flexShrink: 0 }}>
            ₹{(p.amt / 1000).toFixed(0)}K
          </span>
        </div>
      ))}
    </PanelCard>
  )
}

function AttendanceWidget({ onNavigate, state }: { onNavigate: (id: string) => void; state: DashState }) {
  const statusColor: Record<string, string> = { in: "var(--success)", late: "var(--warning)", absent: "var(--error)" }
  const statusLabel: Record<string, string> = { in: "IN", late: "LATE", absent: "ABS" }
  return (
    <PanelCard title="Today's Attendance" badge="142 / 155" badgeColor="var(--success)" action={() => onNavigate("attendance")}>
      {state === "loading" && <div style={{ padding: 12 }}>{[...Array(5)].map((_, i) => <SkeletonLine key={i} h={28} mb={4} />)}</div>}
      {state === "data" && ATTENDANCE_TODAY.map((emp, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderBottom: "1px solid var(--border-subtle)", transition: "background 0.12s ease" }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-raised)" }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent" }}
        >
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--bg-raised)", border: `1px solid ${statusColor[emp.status]}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: statusColor[emp.status], fontFamily: "var(--font-mono)", flexShrink: 0 }}>
            {emp.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emp.name}</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{emp.dept} · {emp.shift}</div>
          </div>
          {emp.time !== "—" && <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", flexShrink: 0 }}>{emp.time}</span>}
          <span style={{ fontSize: 9, fontWeight: 700, color: statusColor[emp.status], flexShrink: 0, minWidth: 30, textAlign: "right" }}>{statusLabel[emp.status]}</span>
        </div>
      ))}
    </PanelCard>
  )
}



/* ══════════════════════════════════════════════════════════════
   ACTIVITY FEED
══════════════════════════════════════════════════════════════ */

function ActivityFeed({ state }: { state: DashState }) {
  const [tab, setTab] = useState<ActivityTab>("invoices")
  const tabs: { id: ActivityTab; label: string }[] = [
    { id: "invoices",   label: "Invoices"   },
    { id: "stock",      label: "Stock"      },
    { id: "purchase",   label: "Purchase"   },
    { id: "production", label: "Production" },
    { id: "hr",         label: "HR"         },
  ]
  const items = ACTIVITY[tab]

  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>Recent Activity</span>
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Aug 17, 2026</span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)", padding: "0 8px", overflowX: "auto", scrollbarWidth: "none" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "7px 12px",
              fontSize: 11,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? "var(--primary)" : "var(--text-secondary)",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${tab === t.id ? "var(--primary)" : "transparent"}`,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              marginBottom: -1,
              whiteSpace: "nowrap",
              transition: "color 0.12s ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Items */}
      {state === "loading" && (
        <div style={{ padding: "12px 16px" }}>{[...Array(4)].map((_, i) => <SkeletonLine key={i} h={40} mb={8} />)}</div>
      )}
      {state === "data" && (
        <div>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", transition: "background 0.12s ease", animation: `fade-in 0.25s ease-out ${i * 0.04}s both` }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-raised)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent" }}
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${item.color}18`, border: `1px solid ${item.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: item.color, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{item.sub}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                {item.badge && (
                  <span style={{ fontSize: 8, fontWeight: 700, color: item.badgeColor, background: `${item.badgeColor}18`, border: `1px solid ${item.badgeColor}30`, borderRadius: "var(--radius-xs)", padding: "1px 5px", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
                    {item.badge}
                  </span>
                )}
                <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */

export function OwnerDashboard({ onNavigate }: Props) {
  const [dashState, setDashState] = useState<DashState>("loading")
  const [factoryAnimate, setFactoryAnimate] = useState(false)
  const [tick, setTick] = useState(0)

  /* Simulate data load */
  useEffect(() => {
    const t = setTimeout(() => {
      setDashState("data")
      setFactoryAnimate(true)
    }, 900)
    return () => clearTimeout(t)
  }, [])

  /* Live tick for clock / animated updates */
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 5000)
    return () => clearInterval(t)
  }, [])

  /* Date / time */
  const [clock, setClock] = useState("")
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>

      {/* ── HEADER ─────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 24,
        marginBottom: 24,
        padding: "20px 24px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Blue left accent bar */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "var(--primary)", borderRadius: "var(--radius-md) 0 0 var(--radius-md)", boxShadow: "var(--shadow-glow-blue)" }} />

        {/* Left: text */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 3, height: 20, background: "var(--primary)", borderRadius: 2, boxShadow: "0 0 8px rgba(37,99,235,0.4)" }} />
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              OWNER / SUPER ADMIN
            </div>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 32, color: "var(--text-primary)", margin: "0 0 6px", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
            Operations Dashboard
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.5 }}>
            Complete operational overview — Aug 17, 2026 · Day Shift
          </p>

          {/* System status row */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "System", value: "NOMINAL",        color: "var(--success)" },
              { label: "Shift",  value: "Day · Active",   color: "var(--success)" },
              { label: "Clock",  value: clock,            color: "var(--text-muted)" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontSize: 13, fontFamily: "var(--font-mono)", fontWeight: 600, color: s.color, display: "flex", alignItems: "center", gap: 5 }}>
                  {s.label === "System" && <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />}
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Action row */}
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            <button
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 12, fontWeight: 600, color: "#fff", background: "var(--primary)", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: "0 2px 8px rgba(37,99,235,0.4)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--primary-hover)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)" }}
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Report
            </button>

            {/* State demo toggles */}
            <div style={{ display: "flex", gap: 4, background: "var(--bg-raised)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: 2 }}>
              {(["data", "loading", "error", "empty"] as DashState[]).map(s => (
                <button
                  key={s}
                  onClick={() => setDashState(s)}
                  style={{ fontSize: 9, fontFamily: "var(--font-mono)", padding: "3px 8px", borderRadius: "var(--radius-xs)", border: "none", cursor: "pointer", background: dashState === s ? "var(--primary)" : "transparent", color: dashState === s ? "#fff" : "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>


      </div>

      {/* ── KPI GRID ────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }} className="kpi-grid">
        {KPIS.map((kpi, i) => (
          <KpiCard key={kpi.label} kpi={kpi} state={dashState} index={i} />
        ))}
      </div>

      {/* ── CHARTS GRID ─────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 20 }} className="charts-row-1">
        {/* Monthly Billing Trend */}
        <ChartCard title="Monthly Billing Trend" subtitle="Billing vs collections · Mar–Aug 2026" value="₹28.45L" change={12.4}>
          {dashState === "loading" && <div style={{ height: 160 }} className="skeleton" />}
          {dashState === "error" && <StateError />}
          {dashState === "empty" && <StateEmpty message="No billing data available." />}
          {dashState === "data" && (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={billingData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="billingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} unit="K" />
                <Tooltip content={<DashTooltip prefix="₹" suffix="K" />} />
                <Area type="monotone" dataKey="billing"   name="Billing"    stroke="#2563eb" strokeWidth={2} fill="url(#billingGrad)"   dot={false} activeDot={{ r: 4 }} />
                <Area type="monotone" dataKey="collected" name="Collected"  stroke="#10b981" strokeWidth={2} fill="url(#collectedGrad)" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Purchase Trend */}
        <ChartCard title="Purchase Trend" subtitle="vs ₹8L budget" value="₹9.24L" change={4.2}>
          {dashState === "loading" && <div style={{ height: 160 }} className="skeleton" />}
          {dashState === "data" && (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={purchaseData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} unit="K" />
                <Tooltip content={<DashTooltip prefix="₹" suffix="K" />} />
                <ReferenceLine y={800} stroke="rgba(245,158,11,0.4)" strokeDasharray="4 3" />
                <Bar dataKey="budget"   name="Budget"   fill="rgba(245,158,11,0.12)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="purchase" name="Actual"   fill="#f59e0b"              radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }} className="charts-row-2">
        {/* Production Trend */}
        <ChartCard title="Production Trend" subtitle="Parts output vs target" value="21,840" change={8.3}>
          {dashState === "loading" && <div style={{ height: 140 }} className="skeleton" />}
          {dashState === "data" && (
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={productionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<DashTooltip />} />
                <Line type="monotone" dataKey="target" name="Target" stroke="rgba(37,99,235,0.3)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                <Line type="monotone" dataKey="parts"  name="Output" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Rejection Trend */}
        <ChartCard title="Rejection Rate Trend" subtitle="Monthly rejections" value="0.21%" change={-3.2}>
          {dashState === "loading" && <div style={{ height: 140 }} className="skeleton" />}
          {dashState === "data" && (
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={rejectionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rejectGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<DashTooltip suffix="%" />} />
                <Area type="monotone" dataKey="rate" name="Reject %" stroke="#ef4444" strokeWidth={2} fill="url(#rejectGrad)" dot={{ fill: "#ef4444", r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Charts row 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }} className="charts-row-3">
        {/* Attendance Trend */}
        <ChartCard title="Attendance Trend" subtitle="Present vs absent monthly" value="142 / 155" change={-0.7}>
          {dashState === "loading" && <div style={{ height: 130 }} className="skeleton" />}
          {dashState === "data" && (
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={attendanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<DashTooltip />} />
                <Bar dataKey="present" name="Present" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="absent"  name="Absent"  fill="rgba(239,68,68,0.5)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Expense Trend */}
        <ChartCard title="Expense Trend" subtitle="MTD spend vs ₹6.5L budget" value="₹6.48L" change={2.1}>
          {dashState === "loading" && <div style={{ height: 130 }} className="skeleton" />}
          {dashState === "data" && (
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={expenseData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} unit="K" />
                <Tooltip content={<DashTooltip prefix="₹" suffix="K" />} />
                <ReferenceLine y={650} stroke="rgba(167,139,250,0.4)" strokeDasharray="4 3" />
                <Area type="monotone" dataKey="expense" name="Expense" stroke="#a78bfa" strokeWidth={2} fill="url(#expGrad)" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── OPERATIONAL GRID ────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }} className="op-grid-top">
        <LowStockWidget      onNavigate={onNavigate} state={dashState} />
        <PendingWOWidget       onNavigate={onNavigate} state={dashState} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }} className="op-grid-bottom">
        <PendingPaymentsWidget onNavigate={onNavigate} state={dashState} />
        <AttendanceWidget  onNavigate={onNavigate} state={dashState} />
      </div>

      {/* ── ACTIVITY FEED ───────────────────────────── */}
      <ActivityFeed state={dashState} />

      {/* ── Responsive styles ───────────────────────── */}
      <style>{`
        @media (max-width: 1100px) {
          .dash-factory-panel { display: none !important; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .charts-row-1 { grid-template-columns: 1fr !important; }
          .charts-row-2 { grid-template-columns: 1fr !important; }
          .charts-row-3 { grid-template-columns: 1fr !important; }
          .op-grid-top  { grid-template-columns: 1fr !important; }
          .op-grid-bottom { grid-template-columns: 1fr !important; }
          .op-grid-att  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .kpi-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
        }
      `}</style>
    </div>
  )
}
