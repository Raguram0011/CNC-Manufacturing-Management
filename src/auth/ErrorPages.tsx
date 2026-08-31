interface ErrorPageProps {
  onBack: () => void
  onLogin?: () => void
}

function ErrorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.4 }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480, padding: "0 24px", textAlign: "center", animation: "fade-in 0.3s ease-out" }}>
        {children}
      </div>
    </div>
  )
}

function ErrorCode({ code, color = "var(--text-muted)" }: { code: string; color?: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: 80,
        lineHeight: 1,
        color,
        opacity: 0.12,
        letterSpacing: "-0.04em",
        marginBottom: -12,
        userSelect: "none",
      }}
    >
      {code}
    </div>
  )
}

function IconCircle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: `${color}15`,
        border: `2px solid ${color}35`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
        boxShadow: `0 0 24px ${color}20`,
      }}
    >
      {children}
    </div>
  )
}

function ActionButtons({ primary, secondary }: { primary: { label: string; onClick: () => void }; secondary?: { label: string; onClick: () => void } }) {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
      <button
        onClick={primary.onClick}
        style={{
          padding: "10px 24px",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "var(--font-body)",
          color: "#fff",
          background: "linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          boxShadow: "0 2px 12px rgba(37,99,235,0.35)",
        }}
      >
        {primary.label}
      </button>
      {secondary && (
        <button
          onClick={secondary.onClick}
          style={{
            padding: "10px 24px",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "var(--font-body)",
            color: "var(--text-secondary)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
          }}
        >
          {secondary.label}
        </button>
      )}
    </div>
  )
}

/* ── Session expired ─────────────────────────────────────── */
export function SessionExpiredPage({ onLogin }: { onLogin: () => void }) {
  return (
    <ErrorLayout>
      <ErrorCode code="401" color="var(--warning)" />
      <IconCircle color="var(--warning)">
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      </IconCircle>

      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--text-primary)", margin: "0 0 10px" }}>
        Session Expired
      </h1>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 8px", lineHeight: 1.6 }}>
        Your session has timed out due to inactivity. For security, sessions expire after 8 hours.
      </p>
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 28px", lineHeight: 1.6 }}>
        Any unsaved work may have been lost. Please sign in again to continue.
      </p>
      <ActionButtons primary={{ label: "Sign In Again", onClick: onLogin }} />

      <div style={{ marginTop: 28, padding: "10px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          Sessions auto-expire after 8 hours of inactivity for your security.
        </span>
      </div>
    </ErrorLayout>
  )
}

/* ── Unauthorized (403) ──────────────────────────────────── */
export function UnauthorizedPage({ onBack, onLogin }: ErrorPageProps) {
  return (
    <ErrorLayout>
      <ErrorCode code="403" color="var(--error)" />
      <IconCircle color="var(--error)">
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </IconCircle>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "3px 10px",
          background: "var(--error-bg)",
          border: "1px solid var(--error-border)",
          borderRadius: "var(--radius-xs)",
          marginBottom: 16,
          fontSize: 10,
          fontWeight: 600,
          color: "var(--error)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        ACCESS DENIED
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--text-primary)", margin: "0 0 10px" }}>
        Unauthorized Access
      </h1>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 8px", lineHeight: 1.6 }}>
        You do not have permission to access this module. This area requires elevated privileges not assigned to your role.
      </p>
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 28px", lineHeight: 1.6 }}>
        This access attempt has been logged. If you believe this is an error, contact your system administrator.
      </p>
      <ActionButtons
        primary={{ label: "Go Back", onClick: onBack }}
        secondary={onLogin ? { label: "Sign In as Different User", onClick: onLogin } : undefined}
      />
    </ErrorLayout>
  )
}

/* ── 404 ─────────────────────────────────────────────────── */
export function NotFoundPage({ onBack }: ErrorPageProps) {
  return (
    <ErrorLayout>
      <ErrorCode code="404" color="var(--primary)" />

      {/* Industrial scan target instead of an icon */}
      <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 20px" }}>
        <svg width={64} height={64} viewBox="0 0 64 64" fill="none" style={{ position: "absolute", inset: 0 }}>
          <circle cx="32" cy="32" r="28" stroke="var(--border-default)" strokeWidth={1} strokeDasharray="4 4" />
          <circle cx="32" cy="32" r="18" stroke="var(--primary)" strokeWidth={0.5} opacity={0.4} />
          <circle cx="32" cy="32" r="8" stroke="var(--primary)" strokeWidth={1} opacity={0.7} />
          <line x1="32" y1="4" x2="32" y2="22" stroke="var(--primary)" strokeWidth={0.8} opacity={0.5} />
          <line x1="32" y1="42" x2="32" y2="60" stroke="var(--primary)" strokeWidth={0.8} opacity={0.5} />
          <line x1="4" y1="32" x2="22" y2="32" stroke="var(--primary)" strokeWidth={0.8} opacity={0.5} />
          <line x1="42" y1="32" x2="60" y2="32" stroke="var(--primary)" strokeWidth={0.8} opacity={0.5} />
          <line x1="24" y1="24" x2="40" y2="40" stroke="var(--error)" strokeWidth={1.5} strokeLinecap="round" />
          <line x1="40" y1="24" x2="24" y2="40" stroke="var(--error)" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--text-primary)", margin: "0 0 10px" }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 8px", lineHeight: 1.6 }}>
        The module or page you requested does not exist or has been relocated. Check the URL and try again.
      </p>
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 28px", lineHeight: 1.6 }}>
        Error code: 404 — Resource not found
      </p>
      <ActionButtons
        primary={{ label: "Go to Dashboard", onClick: onBack }}
      />
    </ErrorLayout>
  )
}

/* ── 403 Forbidden (module-level) ────────────────────────── */
export function ForbiddenPage({ onBack }: ErrorPageProps) {
  return (
    <ErrorLayout>
      <ErrorCode code="403" color="var(--warning)" />
      <IconCircle color="var(--warning)">
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </IconCircle>

      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--text-primary)", margin: "0 0 10px" }}>
        Access Forbidden
      </h1>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 8px", lineHeight: 1.6 }}>
        You are authenticated but do not have access to this specific resource. Your current role does not include this module.
      </p>
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 16px", lineHeight: 1.6 }}>
        Contact your manager or system administrator to request access.
      </p>

      <div
        style={{
          padding: "12px 14px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-sm)",
          marginBottom: 24,
          textAlign: "left",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, fontFamily: "var(--font-body)", letterSpacing: "0.04em" }}>
          Required permissions:
        </div>
        {["Module access grant", "Role elevation", "Administrator approval"].map((p) => (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--warning)", flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{p}</span>
          </div>
        ))}
      </div>

      <ActionButtons primary={{ label: "Go Back", onClick: onBack }} />
    </ErrorLayout>
  )
}
