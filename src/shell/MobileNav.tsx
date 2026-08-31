import { useEffect } from "react"
import type { NavGroup, Role } from "../config/navigation"
import { MOBILE_BOTTOM_NAV, ROLES } from "../config/navigation"
import { NavIcon, GearIcon, XIcon, NotificationsIcon } from "./Icons"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  navGroups: NavGroup[]
  activePage: string
  onNavigate: (id: string) => void
  role: Role
  user: { name: string; email: string; avatar: string }
  notificationCount: number
}

export function MobileNav({
  isOpen,
  onClose,
  navGroups,
  activePage,
  onNavigate,
  role,
  user,
  notificationCount,
}: MobileNavProps) {
  const currentRole = ROLES.find((r) => r.id === role)!
  const bottomIds = MOBILE_BOTTOM_NAV[role]

  /* Lock body scroll when drawer open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  /* Collect bottom nav items from groups */
  const allItems = navGroups.flatMap((g) => g.items)
  const bottomItems = bottomIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter(Boolean) as typeof allItems

  const navigate = (id: string) => {
    onNavigate(id)
    onClose()
  }

  return (
    <>
      {/* ── Slide-in Drawer ─────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.25s ease",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border-subtle)",
          zIndex: 201,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          boxShadow: isOpen ? "var(--shadow-xl)" : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            borderBottom: "1px solid var(--border-subtle)",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: "var(--primary)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(37,99,235,0.4)",
            }}
          >
            <GearIcon size={15} className="gear-spin" style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-primary)", lineHeight: 1.2 }}>
              ACME CNC
            </div>
            <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              MFG SYSTEM
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* User strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-elevated)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${currentRole.color} 0%, ${currentRole.color}80 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "var(--font-mono)",
              border: "1px solid var(--border-default)",
              flexShrink: 0,
            }}
          >
            {user.avatar}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", fontFamily: "var(--font-body)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.name}
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 9,
                fontWeight: 600,
                color: currentRole.color,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginTop: 1,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: currentRole.color, display: "inline-block" }} />
              {currentRole.label}
            </div>
          </div>
          {notificationCount > 0 && (
            <div style={{ position: "relative" }}>
              <NotificationsIcon size={18} style={{ color: "var(--text-secondary)" }} />
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "var(--error)",
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {notificationCount}
              </span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 8px" }}>
          {navGroups.map((group) => (
            <div key={group.id} style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  padding: "10px 10px 4px",
                }}
              >
                {group.label}
              </div>
              {group.items.map((item) => {
                const isActive = activePage === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      height: 40,
                      padding: "0 10px",
                      borderRadius: "var(--radius-sm)",
                      border: "none",
                      cursor: "pointer",
                      background: isActive ? "var(--primary-subtle)" : "transparent",
                      color: isActive ? "var(--primary)" : "var(--text-secondary)",
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: isActive ? 500 : 400,
                      position: "relative",
                      textAlign: "left",
                      transition: "background 0.12s ease",
                    }}
                  >
                    {isActive && (
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 2,
                          height: 20,
                          background: "var(--primary)",
                          borderRadius: "0 2px 2px 0",
                          boxShadow: "0 0 6px var(--primary)",
                        }}
                      />
                    )}
                    <span style={{ color: isActive ? "var(--primary)" : "var(--text-muted)", flexShrink: 0 }}>
                      <NavIcon name={item.icon} size={15} />
                    </span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          minWidth: 18,
                          height: 16,
                          borderRadius: 8,
                          background: "var(--error)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 4px",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* ── Bottom Tab Bar ───────────────────────── */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          zIndex: 190,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.4)",
        }}
      >
        {bottomItems.map((item) => {
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                height: "100%",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: isActive ? "var(--primary)" : "var(--text-muted)",
                position: "relative",
                transition: "color 0.12s ease",
              }}
            >
              {/* Active indicator dot at top */}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 20,
                    height: 2,
                    borderRadius: 1,
                    background: "var(--primary)",
                    boxShadow: "0 0 6px var(--primary)",
                  }}
                />
              )}
              <span style={{ position: "relative" }}>
                <NavIcon name={item.icon} size={20} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className="pulse-dot"
                    style={{
                      position: "absolute",
                      top: -3,
                      right: -3,
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--error)",
                      border: "1px solid var(--bg-surface)",
                    }}
                  />
                )}
              </span>
              <span style={{ fontSize: 9, fontFamily: "var(--font-body)", fontWeight: isActive ? 600 : 400, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
