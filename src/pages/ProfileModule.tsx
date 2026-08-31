import { useState } from "react"
import { PageHeader } from "../shell/PageHeader"

/* ─── Primitives ───────────────────────────────────────────── */
function Field({ label, hint, children, error }: { label: string; hint?: string; children: React.ReactNode; error?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: 11, color: "var(--error)", marginTop: 4 }}>⚠ {error}</div>}
      {hint && !error && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = "text", disabled, mono }: {
  value: string; onChange?: (v: string) => void; placeholder?: string
  type?: string; disabled?: boolean; mono?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: "100%", padding: "8px 11px",
        background: disabled ? "var(--bg-base)" : "var(--bg-surface)",
        border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)",
        color: disabled ? "var(--text-muted)" : "var(--text-primary)",
        fontSize: 13, fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
        outline: "none", boxSizing: "border-box",
        cursor: disabled ? "not-allowed" : undefined,
      }}
    />
  )
}

function Row({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }} className="prof-row">
      {children}
    </div>
  )
}

function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", marginTop: 8 }}>
      <button style={{ padding: "8px 18px", background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
      <button onClick={onSave} style={{ padding: "8px 22px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, cursor: "pointer", minWidth: 110 }}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PROFILE PANEL
═══════════════════════════════════════════════════════════ */

function ProfileTab() {
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    firstName: "Alex", lastName: "Mercer",
    email: "alex@acmecnc.com", phone: "+91 98765 43210",
    role: "Owner / Super Admin", department: "Management",
    employee: "EMP-001", joined: "2014-04-01",
    bio: "Founder and Super Admin of ACME CNC Manufacturing. Responsible for overall operations, strategy and system administration.",
    timezone: "Asia/Kolkata", language: "en-IN", dateFormat: "DD/MM/YYYY",
  })
  const set = (k: keyof typeof data) => (v: string) => setData((d) => ({ ...d, [k]: v }))
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }

  return (
    <div>
      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, padding: "20px 24px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", fontFamily: "var(--font-display)", letterSpacing: "0.02em", flexShrink: 0 }}>AM</div>
          <button style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-strong)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✏</button>
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>{data.firstName} {data.lastName}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{data.role} · {data.department}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>{data.email}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 700, background: "rgba(37,99,235,0.15)", color: "var(--primary)", padding: "2px 8px", borderRadius: 99 }}>Super Admin</span>
            <span style={{ fontSize: 9, fontWeight: 700, background: "var(--success-bg)", color: "var(--success)", padding: "2px 8px", borderRadius: 99 }}>Active</span>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button style={{ padding: "7px 14px", background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)", fontSize: 12, cursor: "pointer" }}>Upload Photo</button>
          <button style={{ padding: "7px 14px", background: "none", border: "1px solid var(--error-border)", borderRadius: "var(--radius-sm)", color: "var(--error)", fontSize: 12, cursor: "pointer" }}>Remove</button>
        </div>
      </div>

      {/* Personal info */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "24px", marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid var(--border-subtle)" }}>Personal Information</div>
        <Row><Field label="First Name"><Input value={data.firstName} onChange={set("firstName")} /></Field><Field label="Last Name"><Input value={data.lastName} onChange={set("lastName")} /></Field></Row>
        <Row><Field label="Email Address"><Input value={data.email} onChange={set("email")} type="email" /></Field><Field label="Phone Number"><Input value={data.phone} onChange={set("phone")} /></Field></Row>
        <Row>
          <Field label="Employee ID"><Input value={data.employee} disabled mono /></Field>
          <Field label="Date Joined"><Input value={data.joined} disabled type="date" /></Field>
        </Row>
        <Field label="Bio / About" hint="Shown in employee directory and reports">
          <textarea
            value={data.bio}
            onChange={(e) => set("bio")(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: "8px 11px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 13, resize: "vertical", lineHeight: 1.5, outline: "none", boxSizing: "border-box" }}
          />
        </Field>
        <SaveBar onSave={save} saving={saving} />
      </div>

      {/* Preferences */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "24px" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid var(--border-subtle)" }}>Regional Preferences</div>
        <Row>
          <Field label="Timezone">
            <select value={data.timezone} onChange={(e) => set("timezone")(e.target.value)} style={{ width: "100%", padding: "8px 11px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 13, outline: "none" }}>
              <option value="Asia/Kolkata">IST (Asia/Kolkata, UTC+5:30)</option>
              <option value="UTC">UTC</option>
              <option value="Asia/Dubai">GST (Asia/Dubai, UTC+4)</option>
            </select>
          </Field>
          <Field label="Date Format">
            <select value={data.dateFormat} onChange={(e) => set("dateFormat")(e.target.value)} style={{ width: "100%", padding: "8px 11px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 13, outline: "none" }}>
              <option value="DD/MM/YYYY">DD/MM/YYYY (Indian)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
          </Field>
        </Row>
        <SaveBar onSave={save} saving={saving} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
interface Props { onNavigate?: (id: string) => void }

export function ProfileModule({ onNavigate }: Props) {
  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader title="My Profile" description="Account details and regional preferences" accentColor="#2563eb" />

      {/* Content */}
      <div style={{ animation: "fade-in 0.2s ease-out", marginTop: 24 }}>
        <ProfileTab />
      </div>

      <style>{`@media(max-width:600px){.prof-row{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
