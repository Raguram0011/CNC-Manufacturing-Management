import { useState, useEffect } from "react"
import type { Role } from "../config/navigation"
import { ROLES, DEMO_USERS } from "../config/navigation"
import { SearchIcon, NotificationsIcon, MenuIcon, SettingsIcon, ProfileIcon, ChevronRightIcon } from "./Icons"

interface Breadcrumb {
  label: string
  id?: string
}

interface TopBarProps {
  breadcrumbs: Breadcrumb[]
  onNavigate: (id: string) => void
  onSearchOpen: () => void
  onNotificationsOpen: () => void
  notificationCount: number
  role: Role
  user: { name: string; email: string; avatar: string }
  onMobileMenuOpen: () => void
  sidebarCollapsed: boolean
}

export function TopBar({
  breadcrumbs,
  onNavigate,
  onSearchOpen,
  onNotificationsOpen,
  notificationCount,
  role,
  user,
  onMobileMenuOpen,
}: TopBarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [clock, setClock] = useState("")
  const [hovered, setHovered] = useState<string | null>(null)
  const currentRole = ROLES.find((r) => r.id === role)!

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const iconBtn = (id: string, onClick: () => void, children: React.ReactNode, badge?: number) => (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
      style={{
        position: "relative",
        width: 34,
        height: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: hovered === id ? "var(--bg-elevated)" : "transparent",
        border: "1px solid transparent",
        borderColor: hovered === id ? "var(--border-subtle)" : "transparent",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        color: "var(--text-secondary)",
        transition: "all 0.12s ease",
      }}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span
          className="pulse-dot"
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--error)",
            border: "1px solid var(--bg-surface)",
          }}
        />
      )}
    </button>
  )

  return (
    <header
      style={{
        height: 52,
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 16px",
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        zIndex: 90,
        boxShadow: "0 1px 0 var(--border-subtle)",
      }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        className="mobile-only"
        style={{
          display: "none",
          width: 34,
          height: 34,
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "none",
          color: "var(--text-secondary)",
          cursor: "pointer",
          borderRadius: "var(--radius-sm)",
          flexShrink: 0,
        }}
      >
        <MenuIcon size={18} />
      </button>

      {/* Breadcrumbs */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          flex: 1,
          overflow: "hidden",
        }}
        aria-label="Breadcrumb"
      >
        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>
          ACME CNC
        </span>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: i === breadcrumbs.length - 1 ? 0 : 1 }}>
            <ChevronRightIcon size={10} style={{ color: "var(--border-strong)", flexShrink: 0 }} />
            {crumb.id && i < breadcrumbs.length - 1 ? (
              <button
                onClick={() => crumb.id && onNavigate(crumb.id)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 13,
                  color: "var(--primary)",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  padding: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 120,
                }}
              >
                {crumb.label}
              </button>
            ) : (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: i === breadcrumbs.length - 1 ? 500 : 400,
                  color: i === breadcrumbs.length - 1 ? "var(--text-primary)" : "var(--text-secondary)",
                  fontFamily: "var(--font-body)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 160,
                }}
              >
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* Clock */}
      <div
        style={{
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          color: "var(--text-muted)",
          letterSpacing: "0.06em",
          padding: "4px 10px",
          borderRadius: "var(--radius-xs)",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          gap: 6,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <span
          className="pulse-dot"
          style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--success)", display: "inline-block" }}
        />
        {clock}
      </div>

      {/* Search trigger */}
      <button
        onClick={onSearchOpen}
        onMouseEnter={() => setHovered("search")}
        onMouseLeave={() => setHovered(null)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
          height: 32,
          background: hovered === "search" ? "var(--bg-raised)" : "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          color: "var(--text-muted)",
          transition: "all 0.12s ease",
          flexShrink: 0,
        }}
      >
        <SearchIcon size={13} />
        <span style={{ fontSize: 12, fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>Search…</span>
        <kbd
          style={{
            fontSize: 9,
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-xs)",
            padding: "1px 4px",
            background: "var(--bg-raised)",
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Notifications */}
      {iconBtn("notif", onNotificationsOpen, <NotificationsIcon size={16} />, notificationCount)}

      {/* Settings quick link */}
      {iconBtn("settings", () => onNavigate("settings"), <SettingsIcon size={15} />)}

      {/* User avatar / menu */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 8px 4px 4px",
            height: 34,
            background: userMenuOpen ? "var(--bg-elevated)" : "transparent",
            border: `1px solid ${userMenuOpen ? "var(--border-default)" : "transparent"}`,
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            transition: "all 0.12s ease",
          }}
          onMouseEnter={(e) => { if (!userMenuOpen) (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)" }}
          onMouseLeave={(e) => { if (!userMenuOpen) (e.currentTarget as HTMLButtonElement).style.background = "transparent" }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${currentRole.color} 0%, ${currentRole.color}80 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "var(--font-mono)",
              flexShrink: 0,
              border: "1px solid var(--border-default)",
            }}
          >
            {user.avatar}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", fontFamily: "var(--font-body)", lineHeight: 1.2, whiteSpace: "nowrap" }}>
              {user.name.split(" ")[0]}
            </div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", lineHeight: 1 }}>
              {currentRole.abbreviation}
            </div>
          </div>
          <ChevronRightIcon
            size={12}
            style={{
              color: "var(--text-muted)",
              transform: userMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.15s ease",
            }}
          />
        </button>

        {/* User dropdown */}
        {userMenuOpen && (
          <>
            <div
              style={{ position: "fixed", inset: 0, zIndex: 149 }}
              onClick={() => setUserMenuOpen(false)}
            />
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                width: 220,
                background: "var(--bg-overlay)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-md)",
                padding: "6px",
                boxShadow: "var(--shadow-lg)",
                zIndex: 150,
                animation: "fade-in 0.15s ease-out",
              }}
            >
              {/* User info header */}
              <div style={{ padding: "10px 10px 8px", borderBottom: "1px solid var(--border-subtle)", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${currentRole.color} 0%, ${currentRole.color}80 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {user.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{user.email}</div>
                  </div>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "2px 8px",
                    background: `${currentRole.color}18`,
                    border: `1px solid ${currentRole.color}30`,
                    borderRadius: "var(--radius-xs)",
                    fontSize: 10,
                    fontWeight: 600,
                    color: currentRole.color,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {currentRole.label}
                </div>
              </div>

              {[
                { icon: <ProfileIcon size={13} />, label: "My Profile", action: () => { onNavigate("profile"); setUserMenuOpen(false) } },
                { icon: <SettingsIcon size={13} />, label: "Settings",   action: () => { onNavigate("settings"); setUserMenuOpen(false) } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    padding: "7px 10px",
                    borderRadius: "var(--radius-xs)",
                    border: "none",
                    cursor: "pointer",
                    background: "transparent",
                    color: "var(--text-secondary)",
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    transition: "background 0.1s ease",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-raised)" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}

              <div style={{ borderTop: "1px solid var(--border-subtle)", margin: "4px 0" }} />
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: "var(--radius-xs)",
                  border: "none",
                  cursor: "pointer",
                  background: "transparent",
                  color: "var(--error)",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  transition: "background 0.1s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--error-bg)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent" }}
              >
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
