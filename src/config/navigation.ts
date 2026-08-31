export type Role = "owner" | "hr" | "accounts" | "store" | "production"

export interface NavItem {
  id: string
  label: string
  icon: string
  badge?: number
  badgeVariant?: "error" | "warning" | "success" | "info"
}

export interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

export interface RoleConfig {
  id: Role
  label: string
  color: string
  abbreviation: string
}

/* ── All modules ─────────────────────────────────────────── */
const M: Record<string, NavItem> = {
  dashboard:            { id: "dashboard",            label: "Dashboard",           icon: "Dashboard" },
  employees:            { id: "employees",            label: "Employees",           icon: "Employees" },
  attendance:           { id: "attendance",           label: "Attendance",          icon: "Attendance" },
  leave:                { id: "leave",                label: "Leave",               icon: "Leave" },
  billing:              { id: "billing",              label: "Billing",             icon: "Billing" },
  payments:             { id: "payments",             label: "Payments",            icon: "Payments" },
  expenses:             { id: "expenses",             label: "Expenses",            icon: "Expenses" },
  inventory:            { id: "inventory",            label: "Inventory",           icon: "Inventory" },
  purchase:             { id: "purchase",             label: "Purchase Orders",     icon: "Purchase" },
  suppliers:            { id: "suppliers",            label: "Suppliers",           icon: "Suppliers" },
  materialIssue:        { id: "materialIssue",        label: "Material Issue",      icon: "MaterialIssue" },
  production:           { id: "production",           label: "Production",          icon: "Production" },
  materialConsumption:  { id: "materialConsumption",  label: "Material Consumption",icon: "MaterialConsumption" },
  quality:              { id: "quality",              label: "Quality",             icon: "Quality" },
  scrap:                { id: "scrap",                label: "Scrap",               icon: "Scrap" },
  reports:              { id: "reports",              label: "Reports",             icon: "Reports" },
  notifications:        { id: "notifications",        label: "Notifications",       icon: "Notifications" },
  backup:               { id: "backup",               label: "Backup & Recovery",   icon: "Backup" },
  audit:                { id: "audit",                label: "Audit Logs",          icon: "Audit" },
  settings:             { id: "settings",             label: "Settings",            icon: "Settings" },
  profile:              { id: "profile",              label: "Profile",             icon: "Profile" },
  storeDashboard:       { id: "storeDashboard",       label: "Overview",            icon: "Dashboard" },
  accountsDashboard:    { id: "accountsDashboard",    label: "Overview",            icon: "Dashboard" },
  accountsReports:      { id: "accountsReports",      label: "Financial Reports",   icon: "Reports" },
  productionDashboard:  { id: "productionDashboard",  label: "Overview",            icon: "Dashboard" },
}

/* ── Nav structure per role ──────────────────────────────── */
export const ROLE_NAV: Record<Role, NavGroup[]> = {
  owner: [
    { id: "core",       label: "Core",               items: [M.dashboard] },
    { id: "hr",         label: "HR",                 items: [M.employees, M.attendance, M.leave] },
    { id: "accounts",   label: "Accounts",           items: [M.accountsDashboard, M.billing, M.payments, M.expenses, M.accountsReports] },
    { id: "store",      label: "Store",              items: [M.storeDashboard, M.inventory, M.purchase, M.suppliers, M.materialIssue] },
    { id: "production", label: "Production",         items: [M.productionDashboard, M.production, M.quality, M.scrap] },
    { id: "analytics",  label: "Analytics",          items: [M.reports] },
    { id: "system",     label: "System",             items: [M.backup, M.audit, M.notifications, M.settings] },
    { id: "account",    label: "Account",            items: [M.profile] },
  ],
  hr: [
    { id: "core",       label: "Core",               items: [M.dashboard] },
    { id: "people",     label: "People",             items: [M.employees, M.attendance, M.leave] },
    { id: "analytics",  label: "Analytics",          items: [M.reports, M.notifications] },
    { id: "account",    label: "Account",            items: [M.profile] },
  ],
  accounts: [
    { id: "core",       label: "Core",               items: [M.dashboard] },
    { id: "finance",    label: "Finance",            items: [M.accountsDashboard, M.billing, M.payments, M.expenses, M.accountsReports] },
    { id: "analytics",  label: "Analytics",          items: [M.reports, M.notifications] },
    { id: "account",    label: "Account",            items: [M.profile] },
  ],
  store: [
    { id: "core",       label: "Core",               items: [M.dashboard] },
    { id: "inventory",  label: "Inventory",          items: [M.storeDashboard, M.inventory, M.purchase, M.suppliers, M.materialIssue] },
    { id: "analytics",  label: "Analytics",          items: [M.reports, M.notifications] },
    { id: "account",    label: "Account",            items: [M.profile] },
  ],
  production: [
    { id: "core",       label: "Core",               items: [M.dashboard] },
    { id: "production", label: "Production",         items: [M.productionDashboard, M.production, M.materialConsumption] },
    { id: "quality",    label: "Quality & Scrap",    items: [M.quality, M.scrap] },
    { id: "analytics",  label: "Analytics",          items: [M.reports, M.notifications] },
    { id: "account",    label: "Account",            items: [M.profile] },
  ],
}

/* ── Role metadata ───────────────────────────────────────── */
export const ROLES: RoleConfig[] = [
  { id: "owner",      label: "Owner / Super Admin", color: "#2563eb", abbreviation: "SA" },
  { id: "hr",         label: "HR Manager",          color: "#10b981", abbreviation: "HR" },
  { id: "accounts",   label: "Accounts",            color: "#f59e0b", abbreviation: "AC" },
  { id: "store",      label: "Store Manager",       color: "#06b6d4", abbreviation: "ST" },
  { id: "production", label: "Production",          color: "#a78bfa", abbreviation: "PR" },
]

/* ── Bottom nav for mobile (most important 5) ────────────── */
export const MOBILE_BOTTOM_NAV: Record<Role, string[]> = {
  owner:      ["dashboard", "production", "quality", "reports", "notifications"],
  hr:         ["dashboard", "employees", "attendance", "leave", "notifications"],
  accounts:   ["dashboard", "billing", "payments", "reports", "notifications"],
  store:      ["dashboard", "inventory", "purchase", "reports", "notifications"],
  production: ["dashboard", "production", "quality", "scrap", "notifications"],
}

/* ── Module metadata for page headers ────────────────────── */
export const MODULE_META: Record<string, { title: string; description: string; color: string }> = {
  dashboard:           { title: "Dashboard",            description: "Real-time operational overview",                       color: "#2563eb" },
  employees:           { title: "Employees",            description: "Workforce management and records",                     color: "#10b981" },
  attendance:          { title: "Attendance",           description: "Daily attendance tracking and reports",                color: "#06b6d4" },
  leave:               { title: "Leave Management",     description: "Leave requests, approvals and balances",               color: "#f59e0b" },
  accountsDashboard:   { title: "Accounts Overview",    description: "Financial summary and metrics",                        color: "#2563eb" },
  accountsReports:     { title: "Financial Reports",    description: "Billing, collection and expense analytics",            color: "#a78bfa" },
  billing:             { title: "Billing",              description: "Invoices, quotations and billing records",             color: "#2563eb" },
  payments:            { title: "Payments",             description: "Payment tracking and reconciliation",                  color: "#10b981" },
  expenses:            { title: "Expenses",             description: "Operational expense management",                       color: "#f59e0b" },
  storeDashboard:      { title: "Store Overview",       description: "Real-time inventory and procurement",                  color: "#06b6d4" },
  inventory:           { title: "Inventory",            description: "Stock levels, materials and raw goods",                color: "#06b6d4" },
  purchase:            { title: "Purchase Orders",      description: "Purchase requisitions and order management",           color: "#a78bfa" },
  suppliers:           { title: "Suppliers",            description: "Vendor records and supplier management",               color: "#2563eb" },
  materialIssue:       { title: "Material Issue",       description: "Issue materials to production jobs",                   color: "#f59e0b" },
  productionDashboard: { title: "Production Overview",  description: "Real-time production metrics",                         color: "#2563eb" },
  production:          { title: "Work Orders",          description: "Work orders, job tracking and output",                 color: "#2563eb" },
  materialConsumption: { title: "Material Consumption", description: "Track material usage per work order",                  color: "#10b981" },
  quality:             { title: "Quality Control",      description: "Inspection records, defects and non-conformances",     color: "#10b981" },
  scrap:               { title: "Scrap Management",     description: "Scrap recording, analysis and disposal",               color: "#ef4444" },
  reports:             { title: "Reports",              description: "Analytics, exports and business intelligence",          color: "#a78bfa" },
  notifications:       { title: "Notifications",        description: "System alerts, messages and activity feed",            color: "#06b6d4" },
  backup:              { title: "Backup & Recovery",    description: "Data backup schedules and restore points",             color: "#2563eb" },
  audit:               { title: "Audit Logs",           description: "System activity, changes and compliance trail",        color: "#64748b" },
  settings:            { title: "Settings",             description: "System configuration, users and preferences",          color: "#64748b" },
  profile:             { title: "My Profile",           description: "Account details, password and preferences",            color: "#2563eb" },
}

/* ── Sample user per role ────────────────────────────────── */
export const DEMO_USERS: Record<Role, { name: string; email: string; avatar: string }> = {
  owner:      { name: "Alex Mercer",    email: "alex@acmecnc.com",       avatar: "AM" },
  hr:         { name: "Sarah Okonkwo",  email: "sarah.hr@acmecnc.com",   avatar: "SO" },
  accounts:   { name: "Raj Patel",      email: "raj.ac@acmecnc.com",     avatar: "RP" },
  store:      { name: "Luisa Dupont",   email: "luisa.store@acmecnc.com",avatar: "LD" },
  production: { name: "Kenji Tanaka",   email: "kenji.pr@acmecnc.com",   avatar: "KT" },
}
