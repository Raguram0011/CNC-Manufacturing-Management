import { useState } from "react"
import { PageHeader } from "../shell/PageHeader"

/* ─── Types ───────────────────────────────────────────────── */
type NType = "error" | "warning" | "success" | "info"
type NCategory = "System" | "Attendance" | "Stock" | "Billing" | "Production" | "Maintenance"
type Tab = "all" | "unread" | NCategory

interface Notif {
  id: string
  type: NType
  title: string
  message: string
  timestamp: string
  date: string
  category: NCategory
  read: boolean
  user?: string
  actionLabel?: string
}

/* ─── Data ────────────────────────────────────────────────── */
const NOTIFICATIONS: Notif[] = [
  { id: "n1",  type: "error",   category: "Maintenance", title: "Machine Breakdown — CNC-007",          message: "Spindle drive fault detected. Machine taken offline automatically. Maintenance team has been notified. Estimated downtime: 4–6 hours.", timestamp: "14:32:07", date: "Today", read: false, user: "System", actionLabel: "View Machine" },
  { id: "n2",  type: "warning", category: "Maintenance", title: "Low Coolant — CNC-003",                message: "Coolant level at 23% (below 30% threshold). Manual refill required before next shift start.", timestamp: "13:47:22", date: "Today", read: false, user: "System", actionLabel: "View Machine" },
  { id: "n3",  type: "warning", category: "Production",  title: "WO-0841 Behind Schedule",              message: "Work order WO-0841 (Flange Bearing Housing) is 12 parts behind the shift target of 50 units. Current output: 38. Review production plan.", timestamp: "12:15:03", date: "Today", read: false, user: "System", actionLabel: "View Work Order" },
  { id: "n4",  type: "warning", category: "Stock",       title: "Low Stock — AL6061-T6 Plate",          message: "Current stock: 12 kg. Reorder point: 50 kg. Raise purchase order immediately to avoid production halt.", timestamp: "11:50:00", date: "Today", read: false, user: "System", actionLabel: "View Stock" },
  { id: "n5",  type: "warning", category: "Billing",     title: "Invoice INV-2026-0171 Overdue",         message: "Payment of ₹1,24,500 from TechMetal Industries is 5 days overdue. Follow up required.", timestamp: "10:00:00", date: "Today", read: false, user: "System", actionLabel: "View Invoice" },
  { id: "n6",  type: "success", category: "Production",  title: "WO-0838 Completed Successfully",        message: "Work order WO-0838 completed. 250 parts produced, first-article inspection passed (98.4% yield). Moved to finished goods.", timestamp: "11:02:45", date: "Today", read: true,  user: "System" },
  { id: "n7",  type: "info",    category: "Maintenance", title: "Scheduled Maintenance — CNC-004",       message: "Preventive maintenance scheduled at 16:00 today. Machine CNC-004 will be unavailable for approximately 4 hours.", timestamp: "09:00:00", date: "Today", read: true,  user: "System", actionLabel: "View Schedule" },
  { id: "n8",  type: "info",    category: "Attendance",  title: "Leave Request — J. Martinez",           message: "Employee Juan Martinez has requested Annual Leave from Aug 20 to Aug 22 (3 days). Awaiting manager approval.", timestamp: "08:15:00", date: "Today", read: true,  user: "J. Martinez", actionLabel: "Review Request" },
  { id: "n9",  type: "success", category: "Billing",     title: "Payment Received — ₹2,84,000",          message: "Payment of ₹2,84,000 received from Precision Parts Ltd. against invoice INV-2026-0165. Marked as settled.", timestamp: "16:20:11", date: "Yesterday", read: true, user: "System" },
  { id: "n10", type: "info",    category: "System",      title: "Automatic Backup Completed",            message: "Nightly backup completed successfully at 02:00. 11 files, 14.8 MB, AES-256 encrypted. Verification score: 97/100.", timestamp: "02:00:14", date: "Yesterday", read: true, user: "System" },
  { id: "n11", type: "error",   category: "Stock",       title: "Low Stock — M6 × 20 Hex Bolt",         message: "Only 48 units remaining (reorder point: 200). Without reorder, production will be impacted by 14:00 tomorrow.", timestamp: "14:00:00", date: "Yesterday", read: true, user: "System", actionLabel: "View Stock" },
  { id: "n12", type: "warning", category: "Attendance",  title: "Excess Absent — Production Dept",       message: "8 employees absent today vs. normal average of 2. This may affect shift targets. Consider redistribution.", timestamp: "09:30:00", date: "Yesterday", read: true, user: "System" },
  { id: "n13", type: "success", category: "Maintenance", title: "PM Completed — CNC-001",                message: "Preventive maintenance on CNC-001 (Haas VF-2) completed successfully. All parameters within spec. Next PM: Sep 19.", timestamp: "11:45:00", date: "19 Aug",    read: true, user: "R. Sharma" },
  { id: "n14", type: "info",    category: "System",      title: "User Login — Unusual Location",         message: "Alex Mercer logged in from IP 182.75.43.12 (Mumbai) at 22:14. This differs from the usual access pattern.", timestamp: "22:14:08", date: "18 Aug",    read: true, user: "System", actionLabel: "View Audit Log" },
  { id: "n15", type: "success", category: "Production",  title: "WO-0835 First Article Approved",        message: "First article inspection for WO-0835 (Shaft Coupling) approved by QC. Production cleared to proceed.", timestamp: "10:22:00", date: "18 Aug",    read: true, user: "K. Tanaka" },
  { id: "n16", type: "warning", category: "Billing",     title: "Invoice INV-2026-0168 Due in 3 Days",   message: "₹62,400 from AutoDrive Components Pvt. Ltd. due on Aug 22. Ensure follow-up.", timestamp: "09:00:00", date: "18 Aug",    read: true, user: "System", actionLabel: "View Invoice" },
]

const TABS: { id: Tab; label: string }[] = [
  { id: "all",         label: "All" },
  { id: "unread",      label: "Unread" },
  { id: "System",      label: "System" },
  { id: "Attendance",  label: "Attendance" },
  { id: "Stock",       label: "Stock" },
  { id: "Billing",     label: "Billing" },
  { id: "Production",  label: "Production" },
  { id: "Maintenance", label: "Maintenance" },
]

/* ─── Helpers ─────────────────────────────────────────────── */
const TYPE_META: Record<NType, { color: string; bg: string; border: string; icon: string }> = {
  error:   { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",   icon: "✕" },
  warning: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)",  icon: "⚠" },
  success: { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)",  icon: "✓" },
  info:    { color: "#2563eb", bg: "rgba(37,99,235,0.1)",   border: "rgba(37,99,235,0.25)",   icon: "ℹ" },
}

const CAT_COLORS: Record<NCategory, string> = {
  System:      "#64748b",
  Attendance:  "#06b6d4",
  Stock:       "#14b8a6",
  Billing:     "#f59e0b",
  Production:  "#a78bfa",
  Maintenance: "#fb923c",
}

/* ─── Notification card ───────────────────────────────────── */
function NotifCard({ n, onRead, onDismiss }: { n: Notif; onRead: () => void; onDismiss: () => void }) {
  const m = TYPE_META[n.type]
  return (
    <div
      onClick={onRead}
      style={{
        display: "flex", gap: 14, padding: "16px 18px",
        background: n.read ? "var(--bg-elevated)" : `${m.bg}`,
        borderBottom: "1px solid var(--border-subtle)",
        cursor: "pointer", transition: "background 0.15s ease",
        borderLeft: `3px solid ${n.read ? "transparent" : m.color}`,
        position: "relative",
        animation: "fade-in 0.2s ease-out",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = n.read ? "var(--bg-raised)" : `${m.bg}` }}
      onMouseLeave={(e) => { e.currentTarget.style.background = n.read ? "var(--bg-elevated)" : `${m.bg}` }}
    >
      {/* Icon */}
      <div style={{ width: 34, height: 34, borderRadius: "50%", background: m.bg, border: `1px solid ${m.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: m.color, flexShrink: 0, marginTop: 1 }}>
        {m.icon}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
              {!n.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: m.color, display: "inline-block", flexShrink: 0 }} />}
              <span style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: "var(--text-primary)" }}>{n.title}</span>
              <span style={{ fontSize: 9, fontWeight: 700, background: `${CAT_COLORS[n.category]}20`, color: CAT_COLORS[n.category], padding: "1px 7px", borderRadius: 99, letterSpacing: "0.06em", textTransform: "uppercase" }}>{n.category}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{n.message}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{n.timestamp}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-disabled)", marginTop: 1 }}>{n.date}</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDismiss() }}
              style={{ width: 22, height: 22, borderRadius: "50%", background: "none", border: "1px solid var(--border-default)", color: "var(--text-muted)", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >✕</button>
          </div>
        </div>
        {n.user && (
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 6 }}>
            Source: <span style={{ color: "var(--text-secondary)" }}>{n.user}</span>
            {n.actionLabel && (
              <button onClick={(e) => e.stopPropagation()} style={{ marginLeft: 12, fontSize: 10, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", padding: 0, textDecoration: "underline" }}>
                {n.actionLabel} →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Empty state ─────────────────────────────────────────── */
function Empty({ label }: { label: string }) {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>🔔</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>No {label} notifications</div>
      <div style={{ fontSize: 12, color: "var(--text-disabled)", marginTop: 4 }}>You are all caught up.</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
interface Props { onNavigate?: (id: string) => void }

export function NotificationsModule({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>("all")
  const [items, setItems] = useState(NOTIFICATIONS)
  const [search, setSearch] = useState("")

  const unreadCount = items.filter((n) => !n.read).length

  const markRead = (id: string) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  const dismiss = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id))
  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  const clearAll = () => setItems((prev) => prev.filter((n) => !n.read))

  let visible = items
  if (tab === "unread") visible = items.filter((n) => !n.read)
  else if (tab !== "all") visible = items.filter((n) => n.category === tab)
  if (search) visible = visible.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase()))

  const groupedByDate = visible.reduce((acc, n) => {
    const key = n.date
    if (!acc[key]) acc[key] = []
    acc[key].push(n)
    return acc
  }, {} as Record<string, Notif[]>)

  const dateOrder = ["Today", "Yesterday", "19 Aug", "18 Aug"]
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => dateOrder.indexOf(a) - dateOrder.indexOf(b))

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader
        title="Notifications"
        description="System alerts, activity updates and operational events"
        accentColor="#06b6d4"
        badge={unreadCount > 0 ? { label: `${unreadCount} unread`, variant: "warning" } : undefined}
        secondaryActions={[
          { label: "Mark All Read", onClick: markAllRead },
          { label: "Clear Read", onClick: clearAll },
        ]}
      />

      {/* Search + tabs */}
      <div style={{ marginBottom: 0 }}>
        <div style={{ marginBottom: 14 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications…"
            style={{
              width: "100%", padding: "9px 14px",
              background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
              fontSize: 13, fontFamily: "var(--font-body)", outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)" }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)" }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {TABS.map((t) => {
            const count = t.id === "all" ? items.length
              : t.id === "unread" ? unreadCount
              : items.filter((n) => n.category === t.id).length
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "5px 13px", fontSize: 12, borderRadius: 99,
                  border: `1px solid ${tab === t.id ? "var(--primary)" : "var(--border-default)"}`,
                  background: tab === t.id ? "var(--primary-subtle)" : "none",
                  color: tab === t.id ? "var(--primary)" : "var(--text-muted)",
                  cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.12s",
                }}
              >
                {t.label}
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
                  background: tab === t.id ? "var(--primary)" : "var(--bg-raised)",
                  color: tab === t.id ? "#fff" : "var(--text-muted)",
                  padding: "1px 5px", borderRadius: 99,
                }}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        {visible.length === 0 ? (
          <Empty label={tab === "all" ? "" : tab} />
        ) : (
          sortedDates.map((date) => (
            <div key={date}>
              <div style={{ padding: "9px 18px 7px", background: "var(--bg-raised)", borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>{date}</span>
                <span style={{ marginLeft: 8, fontSize: 10, color: "var(--text-disabled)" }}>· {groupedByDate[date].length} notification{groupedByDate[date].length !== 1 ? "s" : ""}</span>
              </div>
              {groupedByDate[date].map((n) => (
                <NotifCard key={n.id} n={n} onRead={() => markRead(n.id)} onDismiss={() => dismiss(n.id)} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
