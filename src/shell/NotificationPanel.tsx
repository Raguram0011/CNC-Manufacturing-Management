import { useState } from "react"
import { XIcon, CheckIcon, AlertTriangleIcon, NotificationsIcon } from "./Icons"

export interface Notification {
  id: string
  type: "error" | "warning" | "success" | "info"
  title: string
  message: string
  time: string
  read: boolean
  module?: string
}

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAllRead: () => void
  onDismiss: (id: string) => void
}

const TYPE_STYLES: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  error:   { color: "var(--error)",   bg: "var(--error-bg)",   border: "var(--error-border)",   icon: <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  warning: { color: "var(--warning)", bg: "var(--warning-bg)", border: "var(--warning-border)", icon: <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  success: { color: "var(--success)", bg: "var(--success-bg)", border: "var(--success-border)", icon: <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg> },
  info:    { color: "var(--info)",    bg: "var(--info-bg)",    border: "var(--info-border)",    icon: <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
}

export function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onDismiss,
}: NotificationPanelProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const unreadCount = notifications.filter((n) => !n.read).length

  const visible = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 280,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.2s ease",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(380px, 100vw)",
          background: "var(--bg-surface)",
          borderLeft: "1px solid var(--border-subtle)",
          zIndex: 281,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: isOpen ? "var(--shadow-xl)" : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <NotificationsIcon size={16} style={{ color: "var(--text-secondary)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, color: "var(--text-primary)", letterSpacing: "0.02em" }}>
              Notifications
            </div>
            {unreadCount > 0 && (
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {unreadCount} unread
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              style={{
                fontSize: 11,
                fontFamily: "var(--font-body)",
                color: "var(--primary)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "var(--radius-xs)",
                whiteSpace: "nowrap",
              }}
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              borderRadius: "var(--radius-xs)",
            }}
          >
            <XIcon size={14} />
          </button>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "0 8px",
            flexShrink: 0,
          }}
        >
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: filter === f ? 600 : 400,
                color: filter === f ? "var(--primary)" : "var(--text-secondary)",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${filter === f ? "var(--primary)" : "transparent"}`,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                textTransform: "capitalize",
                marginBottom: -1,
                transition: "color 0.12s ease",
              }}
            >
              {f === "unread" ? `Unread (${unreadCount})` : "All"}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {visible.length === 0 ? (
            <div style={{ padding: "48px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 10, color: "var(--text-muted)" }}>◉</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                {filter === "unread" ? "All caught up!" : "No notifications"}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                {filter === "unread" ? "No unread notifications at this time." : "System notifications will appear here."}
              </div>
            </div>
          ) : (
            visible.map((notif) => {
              const s = TYPE_STYLES[notif.type]
              return (
                <div
                  key={notif.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "12px 10px",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: 2,
                    background: notif.read ? "transparent" : "var(--bg-elevated)",
                    border: notif.read ? "1px solid transparent" : "1px solid var(--border-subtle)",
                    position: "relative",
                    transition: "background 0.15s ease",
                  }}
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <span
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 4,
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "var(--primary)",
                      }}
                    />
                  )}

                  {/* Type icon */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: s.bg,
                      border: `1px solid ${s.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: s.color,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {s.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)", lineHeight: 1.3 }}>
                        {notif.title}
                      </div>
                      <button
                        onClick={() => onDismiss(notif.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: 0,
                          flexShrink: 0,
                          opacity: 0.5,
                          fontSize: 14,
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 6 }}>
                      {notif.message}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                        {notif.time}
                      </span>
                      {notif.module && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            color: s.color,
                            background: s.bg,
                            border: `1px solid ${s.border}`,
                            borderRadius: "var(--radius-xs)",
                            padding: "1px 5px",
                            fontFamily: "var(--font-mono)",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          {notif.module}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <button
            style={{
              fontSize: 12,
              color: "var(--primary)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            View All Notifications →
          </button>
        </div>
      </div>
    </>
  )
}
