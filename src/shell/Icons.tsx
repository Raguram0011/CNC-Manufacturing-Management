interface IconProps {
  size?: number
  className?: string
  style?: React.CSSProperties
}

import type React from "react"

const props = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
})

export const DashboardIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

export const EmployeesIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

export const AttendanceIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

export const LeaveIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
  </svg>
)

export const BillingIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="9" y1="15" x2="15" y2="15" />
    <line x1="9" y1="11" x2="15" y2="11" />
  </svg>
)

export const PaymentsIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

export const ExpensesIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

export const InventoryIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

export const PurchaseIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)

export const SuppliersIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
)

export const MaterialIssueIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,8 16,12 12,16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
)

export const ProductionIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <polygon points="12,2 2,7 12,12 22,7" />
    <polyline points="2,17 12,22 22,17" />
    <polyline points="2,12 12,17 22,12" />
  </svg>
)



export const MaterialConsumptionIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
    <line x1="12" y1="22" x2="12" y2="15.5" />
    <polyline points="22,8.5 12,15.5 2,8.5" />
  </svg>
)

export const QualityIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9,12 11,14 15,10" />
  </svg>
)

export const ScrapIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <polyline points="3,6 5,6 21,6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

export const ReportsIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

export const NotificationsIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

export const BackupIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
)

export const AuditIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="9" y1="15" x2="15" y2="15" />
    <line x1="9" y1="11" x2="12" y2="11" />
  </svg>
)

export const SettingsIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

export const ProfileIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const GearIcon = ({ size = 16, style, className }: IconProps) => (
  <svg {...props(size)} style={style} className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

export const SearchIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

export const ChevronRightIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <polyline points="9,18 15,12 9,6" />
  </svg>
)

export const MenuIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

export const XIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export const ChevronLeftIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <polyline points="15,18 9,12 15,6" />
  </svg>
)

export const PlusIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const ArrowUpIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5,12 12,5 19,12" />
  </svg>
)

export const ArrowDownIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19,12 12,19 5,12" />
  </svg>
)

export const CheckIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

export const AlertTriangleIcon = ({ size = 16, style }: IconProps) => (
  <svg {...props(size)} style={style}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

/* ── Icon resolver ───────────────────────────────────────── */
const ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  Dashboard:           DashboardIcon,
  Employees:           EmployeesIcon,
  Attendance:          AttendanceIcon,
  Leave:               LeaveIcon,
  Billing:             BillingIcon,
  Payments:            PaymentsIcon,
  Expenses:            ExpensesIcon,
  Inventory:           InventoryIcon,
  Purchase:            PurchaseIcon,
  Suppliers:           SuppliersIcon,
  MaterialIssue:       MaterialIssueIcon,
  Production:          ProductionIcon,

  MaterialConsumption: MaterialConsumptionIcon,
  Quality:             QualityIcon,
  Scrap:               ScrapIcon,
  Reports:             ReportsIcon,
  Notifications:       NotificationsIcon,
  Backup:              BackupIcon,
  Audit:               AuditIcon,
  Settings:            SettingsIcon,
  Profile:             ProfileIcon,
}

export function NavIcon({ name, size = 16, style }: { name: string; size?: number; style?: React.CSSProperties }) {
  const Comp = ICON_MAP[name]
  if (!Comp) return null
  return <Comp size={size} style={style} />
}
