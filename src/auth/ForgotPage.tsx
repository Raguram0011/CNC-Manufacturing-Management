import { useState } from "react"

interface Props {
  onBack: () => void
}

type Step = "email" | "sent"

export function ForgotPage({ onBack }: Props) {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<Step>("email")
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep("sent")
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
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.4,
        }}
      />
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse, rgba(37,99,235,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
          padding: "0 24px",
          animation: "fade-in 0.3s ease-out",
        }}
      >
        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "var(--font-body)",
            padding: "0 0 24px",
            transition: "color 0.12s ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)" }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6" />
          </svg>
          Back to Sign In
        </button>

        {step === "email" ? (
          <>
            {/* Key icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--radius-lg)",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 28,
                color: "var(--text-primary)",
                margin: "0 0 8px",
                letterSpacing: "0.01em",
              }}
            >
              Reset Password
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 28px", lineHeight: 1.6 }}>
              Enter your Employee ID or work email address. We will send a password reset link to your registered email.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: focused ? "var(--accent)" : "var(--text-secondary)",
                    fontFamily: "var(--font-body)",
                    transition: "color 0.15s ease",
                  }}
                >
                  Employee ID / Work Email
                </label>
                <div
                  style={{
                    background: "var(--bg-raised)",
                    border: `1px solid ${focused ? "var(--accent)" : "var(--border-default)"}`,
                    borderRadius: "var(--radius-sm)",
                    height: 42,
                    display: "flex",
                    alignItems: "center",
                    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                    boxShadow: focused ? "0 0 0 3px rgba(6,182,212,0.12)" : "none",
                  }}
                >
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="EMP-0042 or user@company.com"
                    autoFocus
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
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
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
                  background: !email.trim() ? "var(--bg-raised)" : "linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)",
                  border: !email.trim() ? "1px solid var(--border-default)" : "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: !email.trim() ? "not-allowed" : "pointer",
                  boxShadow: email.trim() && !loading ? "0 2px 12px rgba(37,99,235,0.35)" : "none",
                  opacity: !email.trim() ? 0.5 : 1,
                  transition: "all 0.15s ease",
                }}
              >
                {loading ? (
                  <>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ animation: "gear-spin 0.8s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth={2.5} />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        ) : (
          /* Sent state */
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--success-bg)",
                border: "2px solid var(--success-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "0 0 24px rgba(16,185,129,0.2)",
              }}
            >
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 26,
                color: "var(--text-primary)",
                margin: "0 0 10px",
              }}
            >
              Check Your Email
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 8px", lineHeight: 1.6 }}>
              If an account exists for <strong style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{email}</strong>, a password reset link has been sent.
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 28px", lineHeight: 1.6 }}>
              The link expires in 30 minutes. Check your spam folder if you don't see it.
            </p>
            <button
              onClick={onBack}
              style={{
                padding: "10px 24px",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "var(--font-body)",
                color: "var(--text-primary)",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              Return to Sign In
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
            ACME CNC v2.0.0
          </span>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Need help? Contact IT
          </span>
        </div>
      </div>
    </div>
  )
}
