import { useState, useEffect, useRef } from "react"
import { IndustrialSVG } from "./IndustrialSVG"
import type { Role } from "../config/navigation"
import { ROLES } from "../config/navigation"

type LoginState = "idle" | "loading" | "error" | "locked"

interface Props {
  onLogin: (role: Role) => void
  onForgotPassword: () => void
}

/* ── Shared auth input ───────────────────────────────────── */
function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  disabled,
  autoFocus,
  suffix,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: boolean
  disabled?: boolean
  autoFocus?: boolean
  suffix?: React.ReactNode
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
          background: disabled ? "var(--bg-elevated)" : "var(--bg-raised)",
          border: `1px solid ${error ? "var(--error)" : focused ? "var(--accent)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-sm)",
          height: 42,
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          boxShadow: focused && !error ? "0 0 0 3px rgba(6,182,212,0.12)" : error ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete={type === "password" ? "current-password" : "username"}
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
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
        {suffix}
      </div>
    </div>
  )
}

/* ── Gear logo mark ──────────────────────────────────────── */
function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 20px rgba(37,99,235,0.4), 0 2px 8px rgba(0,0,0,0.4)",
        flexShrink: 0,
      }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="gear-spin-slow"
        style={{ transformOrigin: "center" }}
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </div>
  )
}

/* ── Lock countdown ──────────────────────────────────────── */
function LockCountdown({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds)
  useEffect(() => {
    if (remaining <= 0) return
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining])
  const m = Math.floor(remaining / 60)
  const s = remaining % 60
  return <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{m}:{s.toString().padStart(2, "0")}</span>
}

/* ── Main login page ─────────────────────────────────────── */
export function LoginPage({ onLogin, onForgotPassword }: Props) {
  const [employeeId, setEmployeeId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginState, setLoginState] = useState<LoginState>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [shake, setShake] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const STATIC_USERS: Record<string, { password: string; role: Role }> = {
    "alex@acmecnc.com": { password: "password123", role: "owner" },
    "sarah.hr@acmecnc.com": { password: "password123", role: "hr" },
    "raj.ac@acmecnc.com": { password: "password123", role: "accounts" },
    "luisa.store@acmecnc.com": { password: "password123", role: "store" },
    "kenji.pr@acmecnc.com": { password: "password123", role: "production" },
  }

  const isLocked = loginState === "locked"
  const isLoading = loginState === "loading"
  const isError = loginState === "error"
  const inputDisabled = isLocked || isLoading

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!employeeId.trim() || !password.trim()) {
      setLoginState("error")
      setErrorMsg("Please enter your Employee ID and password.")
      triggerShake()
      return
    }

    setLoginState("loading")
    setErrorMsg("")

    /* Simulate auth — demo credentials */
    setTimeout(() => {
      const user = STATIC_USERS[employeeId.trim().toLowerCase()]

      if (password === "locked") {
        setLoginState("locked")
        setErrorMsg("Account locked due to too many failed attempts.")
        triggerShake()
      } else if (!user || user.password !== password) {
        setLoginState("error")
        setErrorMsg("Invalid Employee ID or password. Please try again.")
        triggerShake()
      } else {
        setLoginState("idle")
        onLogin(user.role)
      }
    }, 1400)
  }

  /* Eye icon for password */
  const EyeIcon = ({ open }: { open: boolean }) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  )

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--bg-base)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Left panel: Industrial visual ────── */}
      <div
        style={{
          flex: "0 0 55%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        className="auth-left-panel"
      >
        <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <IndustrialSVG className="" />
        </div>
        {/* Left panel branding overlay */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "32px 40px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Top logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LogoMark size={36} />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                  lineHeight: 1.1,
                }}
              >
                ACME CNC
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Manufacturing
              </div>
            </div>
          </div>

          {/* Bottom tagline */}
          <div style={{ marginTop: "auto" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 32,
                lineHeight: 1.15,
                color: "var(--text-primary)",
                letterSpacing: "0.01em",
                marginBottom: 10,
              }}
            >
              Precision.<br />Reliability.<br />Control.
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
                lineHeight: 1.6,
                maxWidth: 280,
              }}
            >
              Internal manufacturing management system. Authorized personnel only.
            </div>
            {/* System status bar */}
            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 16,
                alignItems: "center",
              }}
            >
              {[
                { label: "Machines Online", value: "7/10", color: "var(--success)" },
                { label: "Active WOs", value: "18", color: "var(--primary)" },
                { label: "Shift", value: "Day", color: "var(--accent)" },
              ].map((stat) => (
                <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: 14, fontFamily: "var(--font-mono)", fontWeight: 600, color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: Form ────────────────── */}
      <div
        style={{
          flex: "0 0 45%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-surface)",
          borderLeft: "1px solid var(--border-subtle)",
          position: "relative",
          overflow: "hidden",
        }}
        className="auth-right-panel"
      >
        {/* Subtle background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.5,
          }}
        />

        <div
          ref={formRef}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 400,
            padding: "0 40px",
            animation: "auth-slide-in 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards",
            ...(shake ? { animation: "auth-shake 0.45s ease-out" } : {}),
          }}
        >
          {/* Logo (mobile / standalone) */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <LogoMark size={32} />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-primary)", lineHeight: 1.1 }}>
                ACME CNC
              </div>
              <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Manufacturing System
              </div>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 28,
                color: "var(--text-primary)",
                margin: "0 0 6px",
                letterSpacing: "0.01em",
                lineHeight: 1.1,
              }}
            >
              Sign In
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Enter your credentials to access the system.
            </p>
          </div>

          {/* Error / locked state banners */}
          {(isError || isLocked) && (
            <div
              style={{
                display: "flex",
                gap: 10,
                padding: "12px 14px",
                background: isLocked ? "var(--warning-bg)" : "var(--error-bg)",
                border: `1px solid ${isLocked ? "var(--warning-border)" : "var(--error-border)"}`,
                borderLeft: `3px solid ${isLocked ? "var(--warning)" : "var(--error)"}`,
                borderRadius: "var(--radius-sm)",
                marginBottom: 20,
                animation: "fade-in 0.2s ease-out",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: isLocked ? "var(--warning)" : "var(--error)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {isLocked ? "🔒" : "✕"}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: isLocked ? "var(--warning)" : "var(--error)", marginBottom: 2 }}>
                  {isLocked ? "Account Temporarily Locked" : "Authentication Failed"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {isLocked ? (
                    <>
                      {errorMsg} Please try again in{" "}
                      <LockCountdown seconds={300} />.
                      Contact IT support if this persists.
                    </>
                  ) : (
                    errorMsg
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <AuthInput
              label="Employee ID / Email"
              value={employeeId}
              onChange={setEmployeeId}
              placeholder="EMP-0042 or user@company.com"
              error={isError}
              disabled={inputDisabled}
              autoFocus
            />
            <AuthInput
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              error={isError}
              disabled={inputDisabled}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "0 12px",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.12s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)" }}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              }
            />

            {/* Remember me + Forgot */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "var(--radius-xs)",
                    border: `1px solid ${rememberMe ? "var(--primary)" : "var(--border-default)"}`,
                    background: rememberMe ? "var(--primary)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s ease",
                  }}
                >
                  {rememberMe && (
                    <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={onForgotPassword}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 12,
                  color: "var(--primary)",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  padding: 0,
                  transition: "color 0.12s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--primary)" }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={inputDisabled}
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
                letterSpacing: "0.02em",
                color: "#fff",
                background: isLocked
                  ? "var(--bg-raised)"
                  : "linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)",
                border: isLocked ? "1px solid var(--border-default)" : "none",
                borderRadius: "var(--radius-sm)",
                cursor: inputDisabled ? "not-allowed" : "pointer",
                boxShadow: inputDisabled ? "none" : "0 2px 12px rgba(37,99,235,0.35)",
                opacity: isLocked ? 0.6 : 1,
                transition: "all 0.15s ease",
                marginTop: 4,
              }}
              onMouseEnter={(e) => {
                if (!inputDisabled)
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(37,99,235,0.5)"
              }}
              onMouseLeave={(e) => {
                if (!inputDisabled)
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 12px rgba(37,99,235,0.35)"
              }}
            >
              {isLoading ? (
                <>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ animation: "gear-spin 0.8s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth={2.5} />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
                  </svg>
                  Authenticating…
                </>
              ) : isLocked ? (
                "Account Locked"
              ) : (
                <>
                  Sign In to System
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10,17 15,12 10,7" /><line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Security message */}
          <div
            style={{
              marginTop: 24,
              padding: "10px 12px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", marginBottom: 2, fontFamily: "var(--font-body)" }}>
                Secure Internal System
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.5, fontFamily: "var(--font-body)" }}>
                This is a restricted internal system. All access is monitored and logged. Unauthorized access is prohibited and may result in disciplinary action.
              </div>
            </div>
          </div>

          {/* Demo hint */}
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              <div style={{ marginBottom: 4 }}><strong>Demo Credentials:</strong></div>
              <div>Owner: alex@acmecnc.com</div>
              <div>HR: sarah.hr@acmecnc.com</div>
              <div>Accounts: raj.ac@acmecnc.com</div>
              <div>Store: luisa.store@acmecnc.com</div>
              <div>Production: kenji.pr@acmecnc.com</div>
              <div style={{ marginTop: 4, letterSpacing: "0.02em" }}>Password for all: <strong>password123</strong></div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
              ACME CNC v2.0.0
            </span>
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              © 2026 ACME Manufacturing
            </span>
          </div>
        </div>
      </div>

      {/* ── Animations ───────────────────────── */}
      <style>{`
        .auth-left-panel { display: flex; }
        .auth-right-panel { display: flex; }

        @keyframes auth-slide-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes auth-shake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-8px); }
          30%       { transform: translateX(8px); }
          45%       { transform: translateX(-6px); }
          60%       { transform: translateX(6px); }
          75%       { transform: translateX(-3px); }
          90%       { transform: translateX(3px); }
        }

        /* Tablet */
        @media (max-width: 1023px) {
          .auth-left-panel { display: none !important; }
          .auth-right-panel {
            flex: 1 !important;
            background: var(--bg-base) !important;
            border-left: none !important;
          }
          .auth-right-panel > div:first-child {
            background: radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 70%);
          }
        }

        /* Mobile */
        @media (max-width: 639px) {
          .auth-right-panel > div[style*="max-width"] {
            padding: 0 24px !important;
          }
        }
      `}</style>
    </div>
  )
}
