import type { ReactNode } from "react"

interface Breadcrumb {
  label: string
  id?: string
}

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Breadcrumb[]
  onNavigate?: (id: string) => void
  badge?: { label: string; variant: "success" | "warning" | "error" | "info" | "neutral" }
  primaryAction?: { label: string; onClick: () => void; icon?: ReactNode }
  secondaryActions?: Array<{ label: string; onClick: () => void; icon?: ReactNode }>
  children?: ReactNode
  accentColor?: string
}

const BADGE_STYLES = {
  success: { color: "var(--success)", bg: "var(--success-bg)", border: "var(--success-border)" },
  warning: { color: "var(--warning)", bg: "var(--warning-bg)", border: "var(--warning-border)" },
  error:   { color: "var(--error)",   bg: "var(--error-bg)",   border: "var(--error-border)" },
  info:    { color: "var(--info)",    bg: "var(--info-bg)",    border: "var(--info-border)" },
  neutral: { color: "var(--text-secondary)", bg: "var(--bg-raised)", border: "var(--border-default)" },
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  onNavigate,
  badge,
  primaryAction,
  secondaryActions = [],
  children,
  accentColor = "var(--primary)",
}: PageHeaderProps) {
  const badgeStyle = badge ? BADGE_STYLES[badge.variant] : null

  return (
    <div
      style={{
        marginBottom: 28,
        paddingBottom: 20,
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 12,
          }}
        >
          {breadcrumbs.map((crumb, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && (
                <span style={{ color: "var(--border-strong)", fontSize: 10 }}>›</span>
              )}
              {crumb.id && i < breadcrumbs.length - 1 ? (
                <button
                  onClick={() => crumb.id && onNavigate?.(crumb.id)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 12,
                    color: "var(--primary)",
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {crumb.label}
                </button>
              ) : (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: i === breadcrumbs.length - 1 ? 500 : 400,
                    color: i === breadcrumbs.length - 1 ? "var(--text-secondary)" : "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Title row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          {/* Accent overline */}
          <div
            style={{
              width: 24,
              height: 3,
              background: accentColor,
              borderRadius: 2,
              marginBottom: 10,
              boxShadow: `0 0 8px ${accentColor}60`,
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 32,
                lineHeight: 1.1,
                color: "var(--text-primary)",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </h1>
            {badge && badgeStyle && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 9px",
                  borderRadius: "var(--radius-xs)",
                  background: badgeStyle.bg,
                  border: `1px solid ${badgeStyle.border}`,
                  fontSize: 11,
                  fontWeight: 600,
                  color: badgeStyle.color,
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.04em",
                }}
              >
                <span
                  className="pulse-dot"
                  style={{ width: 6, height: 6, borderRadius: "50%", background: badgeStyle.color, display: "inline-block" }}
                />
                {badge.label}
              </span>
            )}
          </div>

          {description && (
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                margin: "8px 0 0",
                lineHeight: 1.5,
                maxWidth: 560,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {(primaryAction || secondaryActions.length > 0) && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
            {secondaryActions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.12s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = "var(--bg-raised)"
                  ;(e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = "var(--bg-elevated)"
                  ;(e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"
                }}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#fff",
                  background: "var(--primary)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  boxShadow: "0 1px 4px rgba(37,99,235,0.4)",
                  transition: "all 0.12s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--primary-hover)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)" }}
              >
                {primaryAction.icon}
                {primaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Extra content slot (tabs, filters) */}
      {children && (
        <div style={{ marginTop: 16 }}>
          {children}
        </div>
      )}
    </div>
  )
}
