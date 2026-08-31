import { useState, useEffect } from "react"
import type { Role } from "./config/navigation"
import { ROLE_NAV, DEMO_USERS, MODULE_META } from "./config/navigation"
import { Sidebar } from "./shell/Sidebar"
import { TopBar } from "./shell/TopBar"
import { MobileNav } from "./shell/MobileNav"
import { SearchModal } from "./shell/SearchModal"
import { NotificationPanel } from "./shell/NotificationPanel"
import type { Notification } from "./shell/NotificationPanel"
import { DashboardPage } from "./pages/DashboardPage"
import { ModulePage } from "./pages/ModulePage"
import { HRModule } from "./pages/HRModule"
import { AccountsModule } from "./pages/AccountsModule"
import { StoreModule } from "./pages/StoreModule"
import { ProductionModule } from "./pages/ProductionModule"
import { ReportsModule } from "./pages/ReportsModule"
import { BackupModule } from "./pages/BackupModule"
import { SettingsModule } from "./pages/SettingsModule"
import { NotificationsModule } from "./pages/NotificationsModule"
import { AuditLogsModule } from "./pages/AuditLogsModule"
import { ProfileModule } from "./pages/ProfileModule"
import { UIInventory } from "./pages/UIInventory"
import { AuthRouter } from "./auth/AuthRouter"
import type { AuthView } from "./auth/AuthRouter"

/* ── Responsive breakpoint ───────────────────────────────── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return isMobile
}

function useIsTablet() {
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1100 && window.innerWidth >= 768)
  useEffect(() => {
    const handler = () => setIsTablet(window.innerWidth < 1100 && window.innerWidth >= 768)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return isTablet
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: "n3", type: "warning", title: "WO-0841 Behind Schedule",                message: "Work order is 12 parts behind the shift target. Review production plan.",          time: "12:15:03", read: false, module: "Production" },
  { id: "n4", type: "success", title: "WO-0838 Completed",                      message: "250 parts completed, first-article inspection passed.",                            time: "11:02:45", read: true,  module: "Production" },
  { id: "n6", type: "warning", title: "Low Stock: AL6061-T6 Plate",             message: "Stock at 12 kg, below reorder point of 50 kg. Raise PO immediately.",             time: "08:30:00", read: true,  module: "Inventory" },
  { id: "n7", type: "info",    title: "Leave Request: J. Martinez",              message: "Annual leave requested for Aug 20–22. Awaiting approval.",                        time: "08:15:00", read: true,  module: "Leave" },
  { id: "n8", type: "success", title: "Invoice INV-2024-0183 Paid",             message: "₹84,200 received from TechMetal Industries.",                                    time: "Yesterday", read: true,  module: "Billing" },
]

/* ── Breadcrumb builder ──────────────────────────────────── */
function getBreadcrumbs(activePage: string) {
  const meta = MODULE_META[activePage]
  if (activePage === "dashboard") return [{ label: "Dashboard" }]
  return [
    { label: "Dashboard", id: "dashboard" },
    { label: meta?.title ?? activePage },
  ]
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authView, setAuthView] = useState<AuthView>("login")
  const [role, setRole] = useState<Role>("owner")
  const [activePage, setActivePage] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS)

  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  /* Auto-collapse sidebar on tablet */
  useEffect(() => {
    if (isTablet) setSidebarCollapsed(true)
    if (!isTablet && !isMobile) setSidebarCollapsed(false)
  }, [isTablet, isMobile])

  /* Keyboard shortcut for search */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const navGroups = ROLE_NAV[role].map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      /* Inject live notification count onto notifications item */
      badge: item.id === "notifications" ? notifications.filter((n) => !n.read).length : item.badge,
    })),
  }))

  const user = DEMO_USERS[role]
  const unreadCount = notifications.filter((n) => !n.read).length
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 56 : 240

  const handleNavigate = (id: string) => {
    setActivePage(id)
    setMobileNavOpen(false)
    /* Scroll content to top */
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole)
    setActivePage("dashboard")
    setMobileNavOpen(false)
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  /* ── Auth gate ───────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <AuthRouter
        view={authView}
        onNavigate={setAuthView}
        onLogin={(loginRole) => {
          setRole(loginRole)
          setActivePage("dashboard")
          setIsAuthenticated(true)
        }}
      />
    )
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-base)",
        fontFamily: "var(--font-body)",
        position: "relative",
      }}
    >
      {/* ── Desktop Sidebar ─────────────────────── */}
      {!isMobile && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
          navGroups={navGroups}
          activePage={activePage}
          onNavigate={handleNavigate}
          role={role}
          onRoleChange={handleRoleChange}
          notificationCount={unreadCount}
          user={user}
        />
      )}

      {/* ── Mobile Nav Drawer + Bottom Bar ──────── */}
      {isMobile && (
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          navGroups={navGroups}
          activePage={activePage}
          onNavigate={handleNavigate}
          role={role}
          user={user}
          notificationCount={unreadCount}
        />
      )}

      {/* ── Main column ─────────────────────────── */}
      <div
        style={{
          flex: 1,
          marginLeft: isMobile ? 0 : sidebarWidth,
          marginBottom: isMobile ? 60 : 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.22s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Top bar */}
        <TopBar
          breadcrumbs={getBreadcrumbs(activePage)}
          onNavigate={handleNavigate}
          onSearchOpen={() => setSearchOpen(true)}
          onNotificationsOpen={() => setNotificationOpen(true)}
          notificationCount={unreadCount}
          role={role}
          user={user}
          onMobileMenuOpen={() => setMobileNavOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page content */}
        <main
          style={{
            flex: 1,
            marginTop: 52,
            padding: isMobile ? "16px 12px" : "28px 32px",
            maxWidth: 1400,
            width: "100%",
          }}
          key={`${activePage}-${role}`}
        >
          {activePage === "dashboard" ? (
            <DashboardPage role={role} onNavigate={handleNavigate} />
          ) : activePage === "employees" ? (
            <HRModule initialView="employees"  onNavigate={handleNavigate} />
          ) : activePage === "attendance" ? (
            <HRModule initialView="attendance" onNavigate={handleNavigate} />
          ) : activePage === "leave" ? (
            <HRModule initialView="leave"      onNavigate={handleNavigate} />
          ) : activePage === "accountsDashboard" ? (
            <AccountsModule initialView="dashboard"  onNavigate={handleNavigate} />
          ) : activePage === "billing" ? (
            <AccountsModule initialView="invoices"   onNavigate={handleNavigate} />
          ) : activePage === "payments" ? (
            <AccountsModule initialView="payments"   onNavigate={handleNavigate} />
          ) : activePage === "expenses" ? (
            <AccountsModule initialView="expenses"   onNavigate={handleNavigate} />
          ) : activePage === "accountsReports" ? (
            <AccountsModule initialView="reports"    onNavigate={handleNavigate} />
          ) : activePage === "storeDashboard" ? (
            <StoreModule initialView="dashboard"      onNavigate={handleNavigate} />
          ) : activePage === "inventory" ? (
            <StoreModule initialView="inventory"      onNavigate={handleNavigate} />
          ) : activePage === "purchase" ? (
            <StoreModule initialView="purchase"       onNavigate={handleNavigate} />
          ) : activePage === "suppliers" ? (
            <StoreModule initialView="suppliers"      onNavigate={handleNavigate} />
          ) : activePage === "materialIssue" ? (
            <StoreModule initialView="material-issue" onNavigate={handleNavigate} />
          ) : activePage === "productionDashboard" ? (
            <ProductionModule initialView="dashboard" onNavigate={handleNavigate} />
          ) : activePage === "production" ? (
            <ProductionModule initialView="orders"    onNavigate={handleNavigate} />
          ) : activePage === "materialConsumption" ? (
            <ProductionModule initialView="material-consumption" onNavigate={handleNavigate} />
          ) : activePage === "quality" ? (
            <ProductionModule initialView="quality"   onNavigate={handleNavigate} />
          ) : activePage === "scrap" ? (
            <ProductionModule initialView="scrap" onNavigate={handleNavigate} />
          ) : activePage === "reports" ? (
            <ReportsModule initialView="overview" onNavigate={handleNavigate} />
          ) : activePage === "backup" ? (
            <BackupModule onNavigate={handleNavigate} />
          ) : activePage === "settings" ? (
            <SettingsModule onNavigate={handleNavigate} />
          ) : activePage === "notifications" ? (
            <NotificationsModule onNavigate={handleNavigate} />
          ) : activePage === "audit" ? (
            <AuditLogsModule onNavigate={handleNavigate} />
          ) : activePage === "profile" ? (
            <ProfileModule onNavigate={handleNavigate} />
          ) : activePage === "materialConsumption" ? (
            <ProductionModule initialView="material-consumption" onNavigate={handleNavigate} />
          ) : activePage === "ui-inventory" ? (
            <UIInventory onNavigate={handleNavigate} />
          ) : (
            <ModulePage moduleId={activePage} onNavigate={handleNavigate} />
          )}
        </main>

        {/* Footer */}
        <footer
          style={{
            padding: "12px 32px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
              ACME CNC MFG SYSTEM
            </span>
            <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
              v2.0.0
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 9,
                fontFamily: "var(--font-mono)",
                color: "var(--success)",
                letterSpacing: "0.06em",
              }}
            >
              <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />
              ALL SYSTEMS NOMINAL
            </span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {["Privacy", "Support", "Docs"].map((link) => (
              <button
                key={link}
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "color 0.12s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)" }}
              >
                {link}
              </button>
            ))}
          </div>
        </footer>
      </div>

      {/* ── Overlays ────────────────────────────── */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        navGroups={navGroups}
        onNavigate={handleNavigate}
      />

      <NotificationPanel
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onDismiss={handleDismiss}
      />

      {/* ── Responsive styles (injected) ─────── */}
      <style>{`
        @media (max-width: 767px) {
          .mobile-only { display: flex !important; }
        }
        @media (min-width: 768px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  )
}
