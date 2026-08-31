import { useState } from "react"

interface Props {
  onBack: () => void
  onSuccess: () => void
}

type Step = "reset" | "success"

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  show,
  onToggleShow,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  show: boolean
  onToggleShow: () => void
  error?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: error ? "var(--error)" : focused ? "var(--accent)" : "var(--text-secondary)",
          fontFamily: "var(--font-body)",
          transition: "color 0.15s ease",
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "var(--bg-raised)",
          border: `1px solid ${error ? "var(--error)" : focused ? "var(--accent)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-sm)",
          height: 42,
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          boxShadow: focused && !error ? "0 0 0 3px rgba(6,182,212,0.12)" : error ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
        }}
      >
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            padding: "0 14px",
            fontSize: 14,
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            height: "100%",
          }}
        />
        <button
          type="button"
          onClick={onToggleShow}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "0 12px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
          tabIndex={-1}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            {show ? (
              <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
            ) : (
              <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
            )}
          </svg>
        </button>
      </div>
    </div>
  )
}

function StrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const levels = [
    { label: "Weak", color: "var(--error)" },
    { label: "Fair", color: "var(--warning)" },
    { label: "Good", color: "var(--info)" },
    { label: "Strong", color: "var(--success)" },
  ]
  const level = score === 0 ? null : levels[score - 1]

  return password.length > 0 ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", gap: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i <= score ? level?.color : "var(--border-default)",
              transition: "background 0.2s ease",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: level?.color, fontFamily: "var(--font-body)", fontWeight: 500 }}>
          {level?.label}
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {["8+ chars", "Uppercase", "Number", "Symbol"].map((hint, i) => (
            <span
              key={hint}
              style={{
                fontSize: 9,
                color: checks[i] ? "var(--success)" : "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
                transition: "color 0.15s ease",
              }}
            >
              {checks[i] ? "✓" : "○"} {hint}
            </span>
          ))}
        </div>
      </div>
    </div>
  ) : null
}

export function ResetPage({ onBack, onSuccess }: Props) {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<Step>("reset")
  const [error, setError] = useState("")

  const mismatch = confirm.length > 0 && password !== confirm
  const canSubmit = password.length >= 8 && password === confirm

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep("success")
    }, 1200)
  }

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
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(37,99,235,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, padding: "0 24px", animation: "fade-in 0.3s ease-out" }}>
        {step === "reset" ? (
          <>
            <button
              onClick={onBack}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 12, fontFamily: "var(--font-body)", padding: "0 0 24px", transition: "color 0.12s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)" }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6" /></svg>
              Back to Sign In
            </button>

            <div style={{ width: 52, height: 52, borderRadius: "var(--radius-lg)", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "0.01em" }}>
              New Password
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 28px", lineHeight: 1.6 }}>
              Create a strong password for your account. It must be at least 8 characters.
            </p>

            {error && (
              <div style={{ padding: "10px 12px", background: "var(--error-bg)", border: "1px solid var(--error-border)", borderLeft: "3px solid var(--error)", borderRadius: "var(--radius-sm)", marginBottom: 16, fontSize: 12, color: "var(--error)" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <PasswordInput label="New Password" value={password} onChange={setPassword} placeholder="Min. 8 characters" show={showNew} onToggleShow={() => setShowNew(!showNew)} />
                <StrengthBar password={password} />
              </div>
              <PasswordInput label="Confirm Password" value={confirm} onChange={setConfirm} placeholder="Repeat your password" show={showConfirm} onToggleShow={() => setShowConfirm(!showConfirm)} error={mismatch} />
              {mismatch && (
                <div style={{ fontSize: 11, color: "var(--error)", fontFamily: "var(--font-body)", marginTop: -8 }}>
                  Passwords do not match.
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !canSubmit}
                style={{
                  width: "100%",
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  color: "#fff",
                  background: !canSubmit ? "var(--bg-raised)" : "linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)",
                  border: !canSubmit ? "1px solid var(--border-default)" : "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: !canSubmit ? "not-allowed" : "pointer",
                  boxShadow: canSubmit && !loading ? "0 2px 12px rgba(37,99,235,0.35)" : "none",
                  opacity: !canSubmit ? 0.5 : 1,
                  transition: "all 0.15s ease",
                  marginTop: 4,
                }}
              >
                {loading ? (
                  <>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ animation: "gear-spin 0.8s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth={2.5} />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
                    </svg>
                    Updating…
                  </>
                ) : "Set New Password"}
              </button>
            </form>
          </>
        ) : (
          /* Success state */
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--success-bg)", border: "2px solid var(--success-border)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 32px rgba(16,185,129,0.25)" }}>
                <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              </div>
              <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "1px solid var(--success)", opacity: 0.3, animation: "pulse-dot 2s ease-in-out infinite" }} />
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--text-primary)", margin: "0 0 10px" }}>
              Password Updated
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 8px", lineHeight: 1.6 }}>
              Your password has been changed successfully.
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 28px", lineHeight: 1.6 }}>
              All active sessions have been terminated for security. Please sign in with your new password.
            </p>

            <div style={{ padding: "12px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", marginBottom: 24, display: "flex", gap: 8, alignItems: "center" }}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>
                For security, this change has been logged and your IT administrator has been notified.
              </span>
            </div>

            <button
              onClick={onSuccess}
              style={{
                padding: "11px 32px",
                fontSize: 14,
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
              Sign In Now
            </button>
          </div>
        )}

        <div style={{ marginTop: 40, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>ACME CNC v2.0.0</span>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>© 2026 ACME Manufacturing</span>
        </div>
      </div>
    </div>
  )
}
