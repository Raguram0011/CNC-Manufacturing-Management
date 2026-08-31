import { PageHeader } from "../shell/PageHeader"
import { MODULE_META } from "../config/navigation"
import { NavIcon, PlusIcon } from "../shell/Icons"

interface Props {
  moduleId: string
  onNavigate: (id: string) => void
}

const WIREFRAMES: Record<string, string> = {
  employees:    "Employee directory table with avatar, name, department, role, shift, status, and action columns.",
  attendance:   "Daily attendance grid showing clock-in/out times, overtime, and absent flags per employee.",
  leave:        "Leave request queue with approval workflow, balance overview, and calendar heatmap.",
  billing:      "Invoice list with client, amount, status (paid/pending/overdue), and aged receivables summary.",
  payments:     "Payment ledger with date, reference, party, amount, mode, and reconciliation status.",
  expenses:     "Expense claim form and list with category breakdown, policy compliance indicators, and approval trail.",
  inventory:    "Real-time stock grid with SKU, material, quantity, location, reorder point, and valuation.",
  purchase:     "Purchase order management with requisition→approval→PO→GRN workflow tracker.",
  suppliers:    "Supplier master list with rating, contact, outstanding POs, payment terms, and performance metrics.",
  materialIssue:"Material issue slip generator linked to work orders, with traceability to inventory lots.",
  production:   "Work order Kanban board across Draft→Setup→In Progress→QC→Complete stages.",
  machines:     "CNC fleet live status dashboard with program, operator, part count, cycle time, and alarms.",
  maintenance:  "PM schedule calendar with open WOs, history log, spare parts consumption, and MTTR metrics.",
  materialConsumption: "Material consumption register per work order with variance analysis vs. BOM.",
  quality:      "Inspection record log with dimensional checks, CPK, non-conformance list, and disposition.",
  scrap:        "Scrap entry form, cause analysis Pareto, daily scrap rate trend, and disposal records.",
  reports:      "Report library with scheduled exports, custom filters, chart builder, and PDF/Excel download.",
  notifications:"Notification feed with filters by type, module, and priority. Mark read / snooze support.",
  backup:       "Backup schedule manager, restore point list, cloud sync status, and integrity verification.",
  audit:        "Immutable audit log viewer with user, action, entity, diff view, and export capability.",
  settings:     "System configuration panels: Users & Roles, Company Info, Shifts, Notifications, Integrations.",
  profile:      "Profile card with personal details editor, password change, notification preferences, and sessions.",
}

export function ModulePage({ moduleId, onNavigate }: Props) {
  const meta = MODULE_META[moduleId] ?? { title: moduleId, description: "", color: "var(--primary)" }
  const wireframe = WIREFRAMES[moduleId] ?? "Module interface coming in the next build phase."

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader
        title={meta.title}
        description={meta.description}
        badge={{ label: "Coming Soon", variant: "info" }}
        accentColor={meta.color}
        primaryAction={{ label: "Create New", onClick: () => {}, icon: <PlusIcon size={13} /> }}
        secondaryActions={[{ label: "Import", onClick: () => {} }, { label: "Export", onClick: () => {} }]}
      />

      {/* Module preview card */}
      <div
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        {/* Header strip */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: `linear-gradient(90deg, ${meta.color}0a 0%, transparent 60%)`,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: `${meta.color}18`,
              border: `1px solid ${meta.color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: meta.color,
            }}
          >
            <NavIcon name={moduleId.charAt(0).toUpperCase() + moduleId.slice(1).replace(/([A-Z])/g, "$1")} size={18} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)" }}>
              {meta.title}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{meta.description}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                color: "var(--info)",
                background: "var(--info-bg)",
                border: "1px solid var(--info-border)",
                borderRadius: "var(--radius-xs)",
                padding: "2px 8px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Module In Development
            </span>
          </div>
        </div>

        {/* Wireframe hint */}
        <div style={{ padding: "28px 24px" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
              Planned Interface
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 600 }}>
              {wireframe}
            </div>
          </div>

          {/* Skeleton wireframe */}
          <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-subtle)", marginTop: 20 }}>
            {/* Toolbar skeleton */}
            <div style={{ padding: "10px 14px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: 8, alignItems: "center" }}>
              <div className="skeleton" style={{ width: 180, height: 26, borderRadius: "var(--radius-sm)" }} />
              <div style={{ flex: 1 }} />
              <div className="skeleton" style={{ width: 80, height: 26, borderRadius: "var(--radius-sm)" }} />
              <div className="skeleton" style={{ width: 100, height: 26, borderRadius: "var(--radius-sm)" }} />
            </div>
            {/* Header row */}
            <div style={{ display: "flex", gap: 0, padding: "9px 14px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border-default)" }}>
              {[120, 100, 80, 80, 60, 50].map((w, i) => (
                <div key={i} className="skeleton" style={{ width: w, height: 9, borderRadius: 2, marginRight: 24 }} />
              ))}
            </div>
            {/* Data rows */}
            {Array.from({ length: 6 }, (_, rowIdx) => (
              <div
                key={rowIdx}
                style={{
                  display: "flex",
                  gap: 0,
                  padding: "12px 14px",
                  background: rowIdx % 2 === 0 ? "var(--bg-elevated)" : "var(--bg-surface)",
                  borderBottom: "1px solid var(--border-subtle)",
                  alignItems: "center",
                }}
              >
                {[90 + rowIdx * 5, 70, 60, 55, 45, 40].map((w, i) => (
                  <div key={i} className="skeleton" style={{ width: w, height: 10, borderRadius: 2, marginRight: 24, opacity: 0.7 }} />
                ))}
                <div className="skeleton" style={{ width: 48, height: 18, borderRadius: "var(--radius-xs)", marginLeft: "auto", opacity: 0.6 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links to related modules */}
      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
          Related Modules
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {getRelated(moduleId).map((id) => {
            const m = MODULE_META[id]
            if (!m) return null
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = "var(--bg-raised)"
                  ;(e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"
                  ;(e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-default)"
                }}
              >
                <NavIcon name={id.charAt(0).toUpperCase() + id.slice(1)} size={13} />
                {m.title}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function getRelated(id: string): string[] {
  const map: Record<string, string[]> = {
    production:    ["machines", "materialConsumption", "quality", "scrap"],
    machines:      ["maintenance", "production", "quality"],
    maintenance:   ["machines", "inventory", "purchase"],
    quality:       ["production", "scrap", "machines"],
    scrap:         ["quality", "production", "inventory"],
    inventory:     ["purchase", "suppliers", "materialIssue"],
    purchase:      ["suppliers", "inventory", "expenses"],
    suppliers:     ["purchase", "inventory", "payments"],
    materialIssue: ["inventory", "production"],
    billing:       ["payments", "expenses", "reports"],
    payments:      ["billing", "expenses", "suppliers"],
    expenses:      ["billing", "payments", "reports"],
    employees:     ["attendance", "leave"],
    attendance:    ["employees", "leave"],
    leave:         ["employees", "attendance"],
    reports:       ["production", "billing", "inventory"],
    audit:         ["settings", "reports"],
    settings:      ["backup", "audit"],
    backup:        ["settings", "audit"],
  }
  return (map[id] ?? ["dashboard", "reports"]).slice(0, 5)
}
