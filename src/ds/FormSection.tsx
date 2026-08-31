import { useState, type ReactNode } from "react"

interface Props {
  active: string
}

/* ── Shared ──────────────────────────────────────────────── */
function SectionHeading({ overline, title, desc }: { overline: string; title: string; desc: string }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div
        style={{
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: 8,
        }}
      >
        {overline}
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.1,
          color: "var(--text-primary)",
          margin: "0 0 12px",
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, maxWidth: 560, lineHeight: 1.6 }}>
        {desc}
      </p>
    </div>
  )
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 20,
        letterSpacing: "0.01em",
        color: "var(--text-primary)",
        margin: "0 0 20px",
        textTransform: "uppercase",
      }}
    >
      {children}
    </h2>
  )
}

function Block({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      {title && <SubHeading>{title}</SubHeading>}
      {children}
    </div>
  )
}

function TokenTag({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        fontSize: 10,
        fontFamily: "var(--font-mono)",
        color: "var(--accent)",
        background: "var(--accent-subtle)",
        padding: "2px 6px",
        borderRadius: "var(--radius-xs)",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </code>
  )
}

function ComponentRow({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr 180px",
        alignItems: "center",
        gap: 20,
        padding: "16px 20px",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{label}</div>
        {note && (
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{note}</div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>{children}</div>
      <div />
    </div>
  )
}

/* ── Button component ────────────────────────────────────── */
interface BtnProps {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | "outline"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  loading?: boolean
  children: ReactNode
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

function Btn({ variant = "primary", size = "md", disabled, loading, children, iconLeft, iconRight }: BtnProps) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const sizes = {
    sm: { padding: "5px 12px", fontSize: 12, height: 28, gap: 6 },
    md: { padding: "7px 16px", fontSize: 13, height: 34, gap: 8 },
    lg: { padding: "10px 22px", fontSize: 14, height: 42, gap: 10 },
  }

  const variants: Record<string, { bg: string; color: string; border: string; hoverBg: string; activeBg: string }> = {
    primary: {
      bg: "var(--primary)",
      hoverBg: "var(--primary-hover)",
      activeBg: "var(--primary-active)",
      color: "#fff",
      border: "transparent",
    },
    secondary: {
      bg: "var(--bg-raised)",
      hoverBg: "var(--bg-overlay)",
      activeBg: "var(--bg-overlay)",
      color: "var(--text-primary)",
      border: "var(--border-default)",
    },
    ghost: {
      bg: "transparent",
      hoverBg: "var(--bg-elevated)",
      activeBg: "var(--bg-raised)",
      color: "var(--text-secondary)",
      border: "transparent",
    },
    outline: {
      bg: "transparent",
      hoverBg: "var(--primary-subtle)",
      activeBg: "var(--primary-subtle)",
      color: "var(--primary)",
      border: "var(--primary)",
    },
    danger: {
      bg: "var(--error)",
      hoverBg: "var(--error-hover)",
      activeBg: "var(--error-hover)",
      color: "#fff",
      border: "transparent",
    },
    success: {
      bg: "var(--success)",
      hoverBg: "var(--success-hover)",
      activeBg: "var(--success-hover)",
      color: "#fff",
      border: "transparent",
    },
  }

  const v = variants[variant]
  const s = sizes[size]

  const bg = disabled ? "var(--bg-raised)" : pressed ? v.activeBg : hovered ? v.hoverBg : v.bg
  const color = disabled ? "var(--text-disabled)" : v.color

  return (
    <button
      disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        padding: s.padding,
        height: s.height,
        fontSize: s.fontSize,
        fontFamily: "var(--font-body)",
        fontWeight: 500,
        letterSpacing: "0.02em",
        color,
        background: bg,
        border: `1px solid ${disabled ? "var(--border-subtle)" : v.border === "transparent" ? "transparent" : v.border}`,
        borderRadius: "var(--radius-sm)",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "all 0.15s ease",
        boxShadow: !disabled && variant === "primary" && !pressed ? "0 1px 3px rgba(37,99,235,0.4)" : "none",
        opacity: disabled ? 0.5 : 1,
        outline: "none",
        whiteSpace: "nowrap",
      }}
    >
      {loading ? (
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" style={{ animation: "gear-spin 0.8s linear infinite" }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
        </svg>
      ) : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  )
}

/* ── Input component ─────────────────────────────────────── */
interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  error?: string
  disabled?: boolean
  type?: string
  prefix?: string
  suffix?: string
}

function Input({ label, placeholder, value = "", error, disabled, type = "text", prefix, suffix }: InputProps) {
  const [focused, setFocused] = useState(false)
  const [val, setVal] = useState(value)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
      {label && (
        <label
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: error ? "var(--error)" : "var(--text-secondary)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontFamily: "var(--font-body)",
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: disabled ? "var(--bg-surface)" : "var(--bg-elevated)",
          border: `1px solid ${error ? "var(--error)" : focused ? "var(--border-focus)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-sm)",
          height: 34,
          transition: "border-color 0.15s ease",
          boxShadow: focused && !error ? "0 0 0 2px var(--primary-glow)" : "none",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {prefix && (
          <div
            style={{
              padding: "0 10px",
              borderRight: "1px solid var(--border-default)",
              fontSize: 12,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              height: "100%",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {prefix}
          </div>
        )}
        <input
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            padding: "0 12px",
            fontSize: 13,
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            height: "100%",
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
        {suffix && (
          <div
            style={{
              padding: "0 10px",
              borderLeft: "1px solid var(--border-default)",
              fontSize: 12,
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              height: "100%",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <div style={{ fontSize: 11, color: "var(--error)", display: "flex", alignItems: "center", gap: 4 }}>
          <span>⚠</span> {error}
        </div>
      )}
    </div>
  )
}

/* ── Select component ────────────────────────────────────── */
function Select({ label, options, disabled }: { label?: string; options: string[]; disabled?: boolean }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
      {label && (
        <label
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--text-secondary)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          position: "relative",
          height: 34,
          border: `1px solid ${focused ? "var(--border-focus)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-sm)",
          background: disabled ? "var(--bg-surface)" : "var(--bg-elevated)",
          boxShadow: focused ? "0 0 0 2px var(--primary-glow)" : "none",
          transition: "border-color 0.15s ease",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <select
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            appearance: "none",
            background: "transparent",
            border: "none",
            outline: "none",
            width: "100%",
            height: "100%",
            padding: "0 32px 0 12px",
            fontSize: 13,
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {options.map((o) => (
            <option key={o} value={o} style={{ background: "#141d2e" }}>{o}</option>
          ))}
        </select>
        <div
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            pointerEvents: "none",
            fontSize: 10,
          }}
        >
          ▼
        </div>
      </div>
    </div>
  )
}

/* ── Checkbox ────────────────────────────────────────────── */
function Checkbox({ label, checked: initial = false, disabled }: { label: string; checked?: boolean; disabled?: boolean }) {
  const [checked, setChecked] = useState(initial)
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        userSelect: "none",
      }}
    >
      <div
        onClick={() => !disabled && setChecked(!checked)}
        style={{
          width: 16,
          height: 16,
          borderRadius: "var(--radius-xs)",
          border: `1px solid ${checked ? "var(--primary)" : "var(--border-default)"}`,
          background: checked ? "var(--primary)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.15s ease",
        }}
      >
        {checked && (
          <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span style={{ fontSize: 13, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{label}</span>
    </label>
  )
}

/* ── Toggle ──────────────────────────────────────────────── */
function Toggle({ label, on: initial = false }: { label: string; on?: boolean }) {
  const [on, setOn] = useState(initial)
  return (
    <label
      style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}
      onClick={() => setOn(!on)}
    >
      <div
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: on ? "var(--primary)" : "var(--bg-overlay)",
          border: `1px solid ${on ? "var(--primary)" : "var(--border-default)"}`,
          position: "relative",
          transition: "all 0.2s ease",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2,
            left: on ? 17 : 2,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
          }}
        />
      </div>
      <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{label}</span>
    </label>
  )
}

/* ── Textarea ────────────────────────────────────────────── */
function Textarea({ label, placeholder }: { label?: string; placeholder?: string }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
      {label && (
        <label
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--text-secondary)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={3}
        style={{
          background: "var(--bg-elevated)",
          border: `1px solid ${focused ? "var(--border-focus)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-sm)",
          outline: "none",
          padding: "8px 12px",
          fontSize: 13,
          color: "var(--text-primary)",
          fontFamily: "var(--font-body)",
          resize: "vertical",
          lineHeight: 1.5,
          boxShadow: focused ? "0 0 0 2px var(--primary-glow)" : "none",
          transition: "border-color 0.15s ease",
        }}
      />
    </div>
  )
}

/* ── SearchBar ───────────────────────────────────────────── */
function SearchBar() {
  const [focused, setFocused] = useState(false)
  const [val, setVal] = useState("")
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "var(--bg-elevated)",
        border: `1px solid ${focused ? "var(--border-focus)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-sm)",
        height: 34,
        padding: "0 12px",
        boxShadow: focused ? "0 0 0 2px var(--primary-glow)" : "none",
        transition: "all 0.15s ease",
        flex: 1,
      }}
    >
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        placeholder="Search machines, work orders, parts…"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: 13,
          color: "var(--text-primary)",
          fontFamily: "var(--font-body)",
        }}
      />
      {val && (
        <button
          onClick={() => setVal("")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 0, fontSize: 14 }}
        >
          ×
        </button>
      )}
      <kbd
        style={{
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          color: "var(--text-muted)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-xs)",
          padding: "1px 5px",
          background: "var(--bg-raised)",
        }}
      >
        ⌘K
      </kbd>
    </div>
  )
}

/* ── Buttons section ─────────────────────────────────────── */
function ButtonsSection() {
  const ChevronRight = () => (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  const PlusIcon = () => (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )

  return (
    <div>
      <SectionHeading
        overline="Components / Buttons"
        title="Button System"
        desc="Six variants across three sizes, with all interactive and state variants. Buttons use 500 weight, 0.02em letter-spacing, and 4px radius throughout."
      />

      <Block title="Variants">
        <div
          style={{
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          {[
            { variant: "primary" as const, label: "Primary", note: "Main CTA, submit, confirm" },
            { variant: "secondary" as const, label: "Secondary", note: "Supporting actions" },
            { variant: "outline" as const, label: "Outline", note: "Alternative to secondary" },
            { variant: "ghost" as const, label: "Ghost", note: "Tertiary, low-emphasis" },
            { variant: "danger" as const, label: "Danger", note: "Destructive, delete, remove" },
            { variant: "success" as const, label: "Success", note: "Confirm, approve, complete" },
          ].map(({ variant, label, note }, i) => (
            <ComponentRow key={label} label={label} note={note}>
              <Btn variant={variant} size="sm">{label} SM</Btn>
              <Btn variant={variant} size="md">{label}</Btn>
              <Btn variant={variant} size="lg">{label} LG</Btn>
            </ComponentRow>
          ))}
        </div>
      </Block>

      <Block title="States">
        <div
          style={{
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          <ComponentRow label="Default" note="Normal state">
            <Btn variant="primary">Create Work Order</Btn>
            <Btn variant="secondary">Export CSV</Btn>
          </ComponentRow>
          <ComponentRow label="With Icon" note="Leading or trailing icon">
            <Btn variant="primary" iconLeft={<PlusIcon />}>Add Machine</Btn>
            <Btn variant="secondary" iconRight={<ChevronRight />}>View Report</Btn>
          </ComponentRow>
          <ComponentRow label="Loading" note="Async operation in progress">
            <Btn variant="primary" loading>Saving…</Btn>
            <Btn variant="secondary" loading>Loading</Btn>
          </ComponentRow>
          <ComponentRow label="Disabled" note="Non-interactive state">
            <Btn variant="primary" disabled>Create Work Order</Btn>
            <Btn variant="secondary" disabled>Export CSV</Btn>
            <Btn variant="danger" disabled>Delete</Btn>
          </ComponentRow>
        </div>
      </Block>

      <Block title="Icon Buttons">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["primary", "secondary", "ghost", "outline", "danger"].map((v) => (
            <button
              key={v}
              style={{
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: v === "primary" ? "var(--primary)" : v === "danger" ? "var(--error)" : v === "outline" ? "transparent" : "var(--bg-raised)",
                border: `1px solid ${v === "outline" ? "var(--primary)" : v === "primary" || v === "danger" ? "transparent" : "var(--border-default)"}`,
                borderRadius: "var(--radius-sm)",
                color: v === "primary" || v === "danger" ? "#fff" : v === "outline" ? "var(--primary)" : "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              <PlusIcon />
            </button>
          ))}
        </div>
      </Block>

      <Block title="Button Group">
        <div style={{ display: "flex" }}>
          {["Daily", "Weekly", "Monthly", "Quarterly"].map((label, i) => {
            const active = i === 1
            return (
              <button
                key={label}
                style={{
                  padding: "6px 14px",
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  background: active ? "var(--primary)" : "var(--bg-elevated)",
                  color: active ? "#fff" : "var(--text-secondary)",
                  border: "1px solid var(--border-default)",
                  borderLeft: i > 0 ? "none" : "1px solid var(--border-default)",
                  borderRadius: i === 0 ? "var(--radius-sm) 0 0 var(--radius-sm)" : i === 3 ? "0 var(--radius-sm) var(--radius-sm) 0" : 0,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </Block>

      <Block title="Usage Tokens">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <TokenTag>--primary</TokenTag>
          <TokenTag>--primary-hover</TokenTag>
          <TokenTag>--primary-active</TokenTag>
          <TokenTag>--radius-sm</TokenTag>
          <TokenTag>--font-body</TokenTag>
          <TokenTag>--shadow-sm</TokenTag>
        </div>
      </Block>
    </div>
  )
}

/* ── Inputs section ──────────────────────────────────────── */
function InputsSection() {
  return (
    <div>
      <SectionHeading
        overline="Components / Form Inputs"
        title="Form System"
        desc="Inputs, selects, checkboxes, toggles, and textareas. All elements share consistent height (34px), border treatment, focus ring, and label typography."
      />

      <Block title="Search">
        <SearchBar />
      </Block>

      <Block title="Text Inputs">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Machine ID" placeholder="e.g. CNC-042" />
            <Input label="Operator Name" placeholder="e.g. J. Martinez" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Spindle Speed" placeholder="4200" suffix="RPM" />
            <Input label="Feed Rate" placeholder="0.008" prefix="in/rev" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Error State" placeholder="Part number" error="Part number not found in database" value="PART-99999X" />
            <Input label="Disabled State" placeholder="Read-only field" value="AUTO-GENERATED" disabled />
          </div>
        </div>
      </Block>

      <Block title="Selects">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <Select label="Machine Status" options={["All Machines", "Running", "Idle", "Maintenance", "Offline"]} />
          <Select label="Material Grade" options={["6061-T6 Aluminum", "304 Stainless", "4140 Steel", "Titanium 6-4"]} />
          <Select label="Shift" options={["Day Shift (06:00–14:00)", "Evening (14:00–22:00)", "Night (22:00–06:00)"]} disabled />
        </div>
      </Block>

      <Block title="Textarea">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Textarea label="Work Order Notes" placeholder="Enter setup instructions, special tooling requirements, or QC notes…" />
          <Textarea label="Defect Description" placeholder="Describe the defect, its location, and possible root cause…" />
        </div>
      </Block>

      <Block title="Checkboxes & Toggles">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
              Checkboxes
            </div>
            <Checkbox label="Enable coolant flow monitoring" checked={true} />
            <Checkbox label="Auto-schedule maintenance alerts" />
            <Checkbox label="Require QC inspection on completion" checked={true} />
            <Checkbox label="Readonly field (disabled)" checked={false} disabled />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
              Toggles
            </div>
            <Toggle label="Machine monitoring active" on={true} />
            <Toggle label="Auto-assign work orders" on={false} />
            <Toggle label="Real-time OEE tracking" on={true} />
            <Toggle label="Email notifications" on={false} />
          </div>
        </div>
      </Block>

      <Block title="Complete Form Example">
        <div
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            padding: 24,
            maxWidth: 600,
          }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text-primary)", marginBottom: 20 }}>
            New Work Order
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label="Part Number" placeholder="e.g. PN-2024-0042" />
              <Input label="Quantity" placeholder="100" suffix="pcs" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Select label="Machine" options={["CNC-001 (Haas VF-2)", "CNC-002 (Mazak QT)", "CNC-003 (DMG NHX)"]} />
              <Select label="Priority" options={["Standard", "Rush — 24h", "Emergency"]} />
            </div>
            <Textarea label="Setup Notes" placeholder="Special tooling, fixture requirements, tolerance callouts…" />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <Checkbox label="Require first-article inspection" />
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="secondary">Cancel</Btn>
                <Btn variant="primary">Create Work Order</Btn>
              </div>
            </div>
          </div>
        </div>
      </Block>
    </div>
  )
}

/* ── Export ──────────────────────────────────────────────── */
export function FormSection({ active }: Props) {
  if (active === "buttons") return <ButtonsSection />
  if (active === "inputs") return <InputsSection />
  return null
}
