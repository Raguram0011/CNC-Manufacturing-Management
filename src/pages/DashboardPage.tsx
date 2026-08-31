import { useState, useEffect } from "react"
import { PageHeader } from "../shell/PageHeader"
import type { Role } from "../config/navigation"
import { ROLES } from "../config/navigation"
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts"
import { OwnerDashboard } from "./OwnerDashboard"
import { HRModule } from "./HRModule"
import { AccountsModule } from "./AccountsModule"
import { StoreModule } from "./StoreModule"
import { ProductionModule } from "./ProductionModule"

interface Props {
  role: Role
  onNavigate: (id: string) => void
}



const partsData = [
  { day: "Mon", actual: 420, target: 400 },
  { day: "Tue", actual: 390, target: 400 },
  { day: "Wed", actual: 448, target: 400 },
  { day: "Thu", actual: 412, target: 400 },
  { day: "Fri", actual: 435, target: 400 },
  { day: "Sat", actual: 180, target: 200 },
]

function Tooltip2({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", padding: "10px 14px", boxShadow: "var(--shadow-md)" }}>
      <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: 5 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ fontSize: 12, color: p.color, fontFamily: "var(--font-mono)", display: "flex", gap: 8 }}>
          <span>{p.name}</span><span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function KpiCard({ label, value, unit, change, color, sub }: {
  label: string; value: string; unit?: string; change?: number; color: string; sub?: string
}) {
  const [displayed, setDisplayed] = useState("0")
  useEffect(() => {
    const num = parseFloat(value.replace(/,/g, ""))
    if (isNaN(num)) { setDisplayed(value); return }
    let start = 0
    const end = num
    const duration = 800
    const step = (end / duration) * 16
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setDisplayed(value); clearInterval(timer); return }
      setDisplayed(num > 100 ? Math.floor(start).toLocaleString() : start.toFixed(1))
    }, 16)
    return () => clearInterval(timer)
  }, [value])

  const isPos = (change ?? 0) >= 0
  return (
    <div
      style={{
        padding: "18px 20px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
        borderLeft: `3px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${color}15 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span className="count-up" style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 600, color, lineHeight: 1, letterSpacing: "-0.02em" }}>
          {displayed}
        </span>
        {unit && <span style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{sub}</div>}
      {change !== undefined && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: isPos ? "var(--success)" : "var(--error)" }}>
          <span>{isPos ? "▲" : "▼"}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{Math.abs(change)}%</span>
          <span style={{ color: "var(--text-muted)" }}>vs yesterday</span>
        </div>
      )}
    </div>
  )
}

function StatusRow({ id, label, status, color }: { id: string; label: string; status: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderBottom: "1px solid var(--border-subtle)" }}>
      <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", flexShrink: 0, width: 60 }}>{id}</span>
      <span style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ fontSize: 10, fontWeight: 600, color, letterSpacing: "0.04em", flexShrink: 0 }}>{status}</span>
    </div>
  )
}

function AlertRow({ type, title, time }: { type: "error" | "warning" | "info"; title: string; time: string }) {
  const colors: Record<string, string> = { error: "var(--error)", warning: "var(--warning)", info: "var(--info)" }
  const icons: Record<string, string> = { error: "✕", warning: "⚠", info: "ℹ" }
  const bgs: Record<string, string> = { error: "var(--error-bg)", warning: "var(--warning-bg)", info: "var(--info-bg)" }
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: bgs[type], border: `1px solid ${colors[type]}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: colors[type], flexShrink: 0 }}>
        {icons[type]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{title}</div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{time}</div>
      </div>
    </div>
  )
}

/* ── Role-specific KPIs ──────────────────────────────────── */
const ROLE_KPIS: Record<Role, Array<{ label: string; value: string; unit?: string; change?: number; color: string; sub?: string }>> = {
  owner: [
    { label: "Parts Today", value: "4218", change: 8.3, color: "var(--success)", sub: "87% of target" },
    { label: "Defect Rate", value: "0.42", unit: "%", change: -0.18, color: "var(--warning)", sub: "Within limit" },
    { label: "Revenue MTD", value: "284500", change: 12.4, color: "var(--accent)", sub: "₹28.45L" },
  ],
  hr: [
    { label: "Present Today", value: "142", change: 3.6, color: "var(--success)", sub: "of 155 total" },
    { label: "On Leave", value: "8", color: "var(--warning)", sub: "Approved leaves" },
    { label: "Pending Requests", value: "5", color: "var(--error)", sub: "Leave & attendance" },
    { label: "New Joiners", value: "3", color: "var(--accent)", sub: "This month" },
  ],
  accounts: [
    { label: "Receivable", value: "184200", change: -4.2, color: "var(--warning)", sub: "₹18.42L overdue" },
    { label: "Payable", value: "92400", color: "var(--error)", sub: "₹9.24L pending" },
    { label: "MTD Revenue", value: "284500", change: 12.4, color: "var(--success)", sub: "₹28.45L" },
    { label: "Expenses MTD", value: "64800", change: 2.1, color: "var(--primary)", sub: "₹6.48L" },
  ],
  store: [
    { label: "Low Stock Items", value: "12", color: "var(--error)", sub: "Reorder needed" },
    { label: "Pending POs", value: "7", color: "var(--warning)", sub: "Awaiting approval" },
    { label: "Material Issues", value: "24", change: 5.2, color: "var(--success)", sub: "Today" },
    { label: "Stock Value", value: "1240000", change: 1.8, color: "var(--primary)", sub: "₹1.24Cr" },
  ],
  production: [
    { label: "Active Work Orders", value: "18", change: 2.0, color: "var(--primary)", sub: "4 behind schedule" },
    { label: "Parts Output", value: "4218", change: 8.3, color: "var(--success)", sub: "Today's count" },
    { label: "Defects", value: "9", change: -3.2, color: "var(--warning)", sub: "0.21% rate" },
  ],
}

const DATE = "Aug 13, 2026"

export function DashboardPage({ role, onNavigate }: Props) {
  const roleConfig = ROLES.find((r) => r.id === role)!
  const kpis = ROLE_KPIS[role]

  /* Owner gets the full dedicated dashboard */
  if (role === "owner") {
    return <OwnerDashboard onNavigate={onNavigate} />
  }

  /* HR gets the HR module dashboard */
  if (role === "hr") {
    return <HRModule initialView="dashboard" onNavigate={onNavigate} />
  }

  /* Accounts gets the Accounts module dashboard */
  if (role === "accounts") {
    return <AccountsModule initialView="dashboard" onNavigate={onNavigate} />
  }

  /* Store gets the Store module dashboard */
  if (role === "store") {
    return <StoreModule initialView="dashboard" onNavigate={onNavigate} />
  }

  /* Production gets the Production module dashboard */
  if (role === "production") {
    return <ProductionModule initialView="dashboard" onNavigate={onNavigate} />
  }

  /* Only show production charts for relevant roles */
  const showProductionCharts = role === "production"

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader
        title="Dashboard"
        description={`${roleConfig.label} view — ${DATE}`}
        badge={{ label: "Live", variant: "success" }}
        accentColor={roleConfig.color}
        primaryAction={{ label: "Export Report", onClick: () => {} }}
        secondaryActions={[{ label: "Refresh", onClick: () => {} }]}
      />

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* Charts — production roles */}
      {showProductionCharts && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>Weekly Parts Output</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>vs target</div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={partsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tooltip2 />} />
                <Bar dataKey="target" name="Target" fill="rgba(37,99,235,0.15)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill="#2563eb" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Bottom panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>

        {/* Alerts */}
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>Recent Alerts</div>
            <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--error)" }}>3 unread</span>
          </div>
          <div style={{ padding: "0 16px" }}>
            <AlertRow type="warning" title="WO-0841 behind schedule by 12 parts." time="12:15:03" />
            <AlertRow type="info" title="Material shortage for WO-0845." time="11:00:00" />
          </div>
          <div style={{ padding: "8px 16px 12px" }}>
            <button onClick={() => onNavigate("notifications")} style={{ fontSize: 11, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>
              View all notifications →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
