import { useState, useRef, useEffect } from "react"
import type { NavGroup, Role, RoleConfig } from "../config/navigation"
import { ROLES } from "../config/navigation"
import { NavIcon, GearIcon, ChevronRightIcon } from "./Icons"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  navGroups: NavGroup[]
  activePage: string
  onNavigate: (id: string) => void
  role: Role
  onRoleChange: (role: Role) => void
  notificationCount: number
  user: { name: string; email: string; avatar: string }
}

export function Sidebar({
  collapsed,
  onToggle,
  navGroups,
  activePage,
  onNavigate,
  role,
  onRoleChange,
  notificationCount,
  user,
}: SidebarProps) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ top: 0 })
  const roleMenuRef = useRef<HTMLDivElement>(null)
  const currentRole = ROLES.find((r) => r.id === role)!

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const W = collapsed ? 56 : 240

  return (
    <>
      <aside
        style={{
          width: W,
          minHeight: "100vh",
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
          /* Subtle vertical metallic gradient edge */
          boxShadow: "1px 0 0 rgba(255,255,255,0.04), 4px 0 20px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── Logo / Brand ───────────────────────── */}
        <div
          style={{
            height: 52,
            display: "flex",
            alignItems: "center",
            padding: collapsed ? "0 16px" : "0 16px",
            borderBottom: "1px solid var(--border-subtle)",
            gap: 10,
            flexShrink: 0,
            overflow: "hidden",
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
              flexShrink: 0,
              position: "relative",
            }}
          >
            <GearIcon size={16} className="gear-spin" style={{ color: "#fff" }} />
          </div>
          <div
            style={{
              opacity: collapsed ? 0 : 1,
              transform: collapsed ? "translateX(-8px)" : "translateX(0)",
              transition: "opacity 0.18s ease, transform 0.18s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              ACME CNC
            </div>
            <div
              style={{
                fontSize: 9,
                fontFamily: "var(--font-mono)",
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              MFG SYSTEM
            </div>
          </div>
        </div>

        {/* ── Nav scroll area ─────────────────────── */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "8px 0",
          }}
        >
          {navGroups.map((group) => (
            <div key={group.id} style={{ marginBottom: 4 }}>
              {/* Group label */}
              {!collapsed && (
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    padding: "10px 16px 4px",
                    opacity: collapsed ? 0 : 1,
                    transition: "opacity 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {group.label}
                </div>
              )}
              {collapsed && <div style={{ height: 4 }} />}

              {/* Nav items */}
              {group.items.map((item) => {
                const isActive = activePage === item.id
                const isHovered = hoveredItem === item.id

                return (
                  <div key={item.id} style={{ position: "relative", margin: "0 6px" }}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      onMouseEnter={(e) => {
                        setHoveredItem(item.id)
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                        setTooltipPos({ top: rect.top + rect.height / 2 })
                      }}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        height: 34,
                        padding: collapsed ? "0 11px" : "0 10px",
                        gap: 10,
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        cursor: "pointer",
                        background: isActive
                          ? "var(--primary-subtle)"
                          : isHovered
                          ? "var(--bg-elevated)"
                          : "transparent",
                        color: isActive ? "var(--primary)" : "var(--text-secondary)",
                        transition: "background 0.12s ease, color 0.12s ease",
                        position: "relative",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {/* Active left indicator bar */}
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 2,
                          height: isActive ? 20 : 0,
                          background: "var(--primary)",
                          borderRadius: "0 2px 2px 0",
                          transition: "height 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                          boxShadow: isActive ? "0 0 6px var(--primary)" : "none",
                        }}
                      />

                      {/* Icon */}
                      <span
                        style={{
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 18,
                          color: isActive ? "var(--primary)" : "var(--text-muted)",
                          transition: "color 0.12s ease",
                        }}
                      >
                        <NavIcon name={item.icon} size={15} />
                      </span>

                      {/* Label */}
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: isActive ? 500 : 400,
                          flex: 1,
                          textAlign: "left",
                          opacity: collapsed ? 0 : 1,
                          transform: collapsed ? "translateX(-4px)" : "translateX(0)",
                          transition: "opacity 0.15s ease, transform 0.15s ease",
                          fontFamily: "var(--font-body)",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {item.label}
                      </span>

                      {/* Badge */}
                      {item.badge !== undefined && item.badge > 0 && !collapsed && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            fontFamily: "var(--font-mono)",
                            minWidth: 18,
                            height: 16,
                            borderRadius: 8,
                            background: item.id === "notifications" ? "var(--error)" : "var(--primary)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 4px",
                            flexShrink: 0,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      {/* Collapsed badge dot */}
                      {item.badge !== undefined && item.badge > 0 && collapsed && (
                        <span
                          className="pulse-dot"
                          style={{
                            position: "absolute",
                            top: 5,
                            right: 5,
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "var(--error)",
                          }}
                        />
                      )}
                    </button>

                    {/* Tooltip when collapsed */}
                    {collapsed && isHovered && (
                      <div
                        style={{
                          position: "fixed",
                          left: 64,
                          top: tooltipPos.top,
                          transform: "translateY(-50%)",
                          background: "var(--bg-overlay)",
                          border: "1px solid var(--border-strong)",
                          borderRadius: "var(--radius-sm)",
                          padding: "5px 10px",
                          fontSize: 12,
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-body)",
                          whiteSpace: "nowrap",
                          zIndex: 1000,
                          boxShadow: "var(--shadow-md)",
                          pointerEvents: "none",
                          animation: "fade-in 0.1s ease-out",
                        }}
                      >
                        {item.label}
                        {item.badge !== undefined && item.badge > 0 && (
                          <span style={{ marginLeft: 6, fontSize: 10, color: "var(--error)", fontFamily: "var(--font-mono)" }}>
                            ({item.badge})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </nav>

        {/* ── Footer area ─────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            flexShrink: 0,
          }}
        >
          {/* Role switcher (demo only) */}
          <div ref={roleMenuRef} style={{ position: "relative", padding: "8px 6px 4px" }}>
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: collapsed ? "6px 10px" : "6px 10px",
                gap: 8,
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)",
                cursor: "pointer",
                background: roleMenuOpen ? "var(--bg-elevated)" : "transparent",
                transition: "background 0.12s ease",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "var(--radius-xs)",
                  background: currentRole.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.04em",
                  flexShrink: 0,
                }}
              >
                {currentRole.abbreviation}
              </div>
              <div
                style={{
                  opacity: collapsed ? 0 : 1,
                  transition: "opacity 0.15s ease",
                  flex: 1,
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                  {currentRole.label}
                </div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
                  DEMO — SWITCH ROLE
                </div>
              </div>
              {!collapsed && (
                <ChevronRightIcon
                  size={12}
                  style={{
                    color: "var(--text-muted)",
                    transform: roleMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.15s ease",
                    flexShrink: 0,
                  }}
                />
              )}
            </button>

            {/* Role dropdown */}
            {roleMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 4px)",
                  left: 6,
                  right: 6,
                  background: "var(--bg-overlay)",
                  border: "1px solid var(--border-strong)",
                  borderRadius: "var(--radius-md)",
                  padding: "6px",
                  boxShadow: "var(--shadow-lg)",
                  zIndex: 200,
                  animation: "fade-in 0.15s ease-out",
                }}
              >
                <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 8px 8px" }}>
                  Switch Role
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { onRoleChange(r.id); setRoleMenuOpen(false) }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      padding: "7px 8px",
                      borderRadius: "var(--radius-xs)",
                      border: "none",
                      cursor: "pointer",
                      background: r.id === role ? "var(--primary-subtle)" : "transparent",
                      transition: "background 0.1s ease",
                    }}
                    onMouseEnter={(e) => { if (r.id !== role) (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-raised)" }}
                    onMouseLeave={(e) => { if (r.id !== role) (e.currentTarget as HTMLButtonElement).style.background = "transparent" }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "var(--radius-xs)",
                        background: r.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 8,
                        fontWeight: 700,
                        color: "#fff",
                        fontFamily: "var(--font-mono)",
                        flexShrink: 0,
                      }}
                    >
                      {r.abbreviation}
                    </div>
                    <span style={{ fontSize: 12, color: r.id === role ? "var(--primary)" : "var(--text-secondary)", fontFamily: "var(--font-body)", fontWeight: r.id === role ? 500 : 400 }}>
                      {r.label}
                    </span>
                    {r.id === role && (
                      <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--primary)" }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: collapsed ? "8px 10px 10px" : "6px 10px 10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${currentRole.color} 0%, ${currentRole.color}99 100%)`,
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
            <div
              style={{
                opacity: collapsed ? 0 : 1,
                transition: "opacity 0.15s ease",
                flex: 1,
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", fontFamily: "var(--font-body)", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </div>
            </div>
          </div>

          {/* Toggle collapse button */}
          <button
            onClick={onToggle}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 32,
              borderTop: "1px solid var(--border-subtle)",
              border: "none",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
              transition: "background 0.12s ease, color 0.12s ease",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"
              ;(e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = "transparent"
              ;(e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"
            }}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              style={{
                transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <polyline points="15,18 9,12 15,6" />
            </svg>
            {!collapsed && (
              <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.06em", color: "var(--text-muted)", marginLeft: 6 }}>
                COLLAPSE
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
