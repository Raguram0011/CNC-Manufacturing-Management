import { useState, useId } from "react"
import { PageHeader } from "../shell/PageHeader"

/* ─── Types ───────────────────────────────────────────────── */
type SettingSection =
  | "company" | "gst" | "invoice" 
  | "shifts" | "leave"
  | "stock" | "backup" 

/* ─── Nav definition ─────────────────────────────────────── */
const SECTIONS: { id: SettingSection; label: string; icon: string; group: string }[] = [
  { id: "company",       label: "Company",          icon: "🏭", group: "Organisation" },
  { id: "gst",           label: "GST",              icon: "📋", group: "Organisation" },
  { id: "invoice",       label: "Invoice",          icon: "🧾", group: "Organisation" },
  { id: "shifts",        label: "Shifts",           icon: "🕐", group: "People" },
  { id: "leave",         label: "Leave",            icon: "📅", group: "People" },
  { id: "stock",         label: "Stock",            icon: "📦", group: "Operations" },
  { id: "backup",        label: "Backup",           icon: "💾", group: "System" },
]

/* ─── Primitive form components ───────────────────────────── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.02em" }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

function Row({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }} className="set-row">
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, mono, type = "text", disabled }: {
  value: string; onChange?: (v: string) => void; placeholder?: string
  mono?: boolean; type?: string; disabled?: boolean
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
        outline: "none", boxSizing: "border-box", cursor: disabled ? "not-allowed" : undefined,
        transition: "border-color 0.15s ease",
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)" }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)" }}
    />
  )
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", padding: "8px 11px",
        background: "var(--bg-surface)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
        fontSize: 13, fontFamily: "var(--font-body)", outline: "none",
        boxSizing: "border-box", cursor: "pointer",
      }}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, cursor: "pointer", padding: "10px 14px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)" }}>
      <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{label}</span>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 40, height: 22, borderRadius: 11, position: "relative", flexShrink: 0,
          background: checked ? "var(--primary)" : "var(--bg-raised)",
          border: `1px solid ${checked ? "var(--primary)" : "var(--border-strong)"}`,
          transition: "all 0.2s ease", cursor: "pointer",
        }}
      >
        <div style={{
          position: "absolute", top: 2, left: checked ? 18 : 2, width: 16, height: 16,
          borderRadius: "50%", background: "#fff", transition: "left 0.2s ease",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </div>
    </label>
  )
}

function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      style={{
        width: "100%", padding: "8px 11px",
        background: "var(--bg-surface)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
        fontSize: 13, fontFamily: "var(--font-body)", outline: "none",
        boxSizing: "border-box", resize: "vertical", lineHeight: 1.5,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)" }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)" }}
    />
  )
}

function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", marginTop: 8 }}>
      <button style={{ padding: "8px 18px", background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)" }}>
        Reset
      </button>
      <button onClick={onSave} style={{ padding: "8px 20px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", minWidth: 100 }}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  )
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ marginBottom: 24, paddingBottom: 14, borderBottom: "1px solid var(--border-subtle)" }}>
      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 17, color: "var(--text-primary)" }}>{title}</div>
      {description && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{description}</div>}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "24px" }}>
      {children}
    </div>
  )
}

/* ─── Editable list (departments / designations) ──────────── */
function EditableList({ items, onUpdate }: {
  items: string[]
  onUpdate: (items: string[]) => void
}) {
  const [draft, setDraft] = useState("")

  const add = () => {
    const trimmed = draft.trim()
    if (trimmed && !items.includes(trimmed)) { onUpdate([...items, trimmed]); setDraft("") }
  }

  const remove = (i: number) => onUpdate(items.filter((_, j) => j !== i))

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12, minHeight: 36 }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: 99, fontSize: 12, color: "var(--text-secondary)" }}>
            {item}
            <button onClick={() => remove(i)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 11, padding: 0, lineHeight: 1, display: "flex", alignItems: "center" }}>✕</button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") add() }}
          placeholder="Add new…"
          style={{ flex: 1, padding: "7px 11px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)" }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-default)" }}
        />
        <button onClick={add} style={{ padding: "7px 14px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>+ Add</button>
      </div>
    </div>
  )
}

/* ─── Shift row ───────────────────────────────────────────── */
interface Shift { id: string; name: string; start: string; end: string; grace: number; active: boolean }

function ShiftRow({ shift, onChange, onDelete }: {
  shift: Shift
  onChange: (s: Shift) => void
  onDelete: () => void
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 80px 1fr auto", gap: 10, alignItems: "center", padding: "10px 14px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", marginBottom: 8 }} className="shift-row">
      <input value={shift.name} onChange={(e) => onChange({ ...shift, name: e.target.value })} placeholder="Shift name" style={{ padding: "6px 10px", background: "var(--bg-base)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", fontSize: 12, color: "var(--text-primary)", fontFamily: "var(--font-body)", outline: "none" }} />
      <input type="time" value={shift.start} onChange={(e) => onChange({ ...shift, start: e.target.value })} style={{ padding: "6px 8px", background: "var(--bg-base)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", fontSize: 12, color: "var(--text-primary)", fontFamily: "var(--font-mono)", outline: "none" }} />
      <input type="time" value={shift.end} onChange={(e) => onChange({ ...shift, end: e.target.value })} style={{ padding: "6px 8px", background: "var(--bg-base)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", fontSize: 12, color: "var(--text-primary)", fontFamily: "var(--font-mono)", outline: "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input type="number" value={shift.grace} onChange={(e) => onChange({ ...shift, grace: +e.target.value })} style={{ width: "100%", padding: "6px 8px", background: "var(--bg-base)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", fontSize: 12, color: "var(--text-primary)", fontFamily: "var(--font-mono)", outline: "none" }} />
        <span style={{ fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap" }}>min</span>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <div onClick={() => onChange({ ...shift, active: !shift.active })} style={{ width: 32, height: 18, borderRadius: 9, background: shift.active ? "var(--primary)" : "var(--bg-raised)", border: `1px solid ${shift.active ? "var(--primary)" : "var(--border-strong)"}`, position: "relative", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}>
          <div style={{ position: "absolute", top: 1, left: shift.active ? 13 : 1, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
        </div>
        <span style={{ fontSize: 11, color: shift.active ? "var(--success)" : "var(--text-muted)" }}>{shift.active ? "Active" : "Inactive"}</span>
      </label>
      <button onClick={onDelete} style={{ width: 28, height: 28, background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", color: "var(--text-muted)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
    </div>
  )
}

/* ─── Leave type row ──────────────────────────────────────── */
interface LeaveType { id: string; name: string; days: number; carry: boolean; paid: boolean }

/* ═══════════════════════════════════════════════════════════
   SECTION PANELS
═══════════════════════════════════════════════════════════ */

function CompanySettings() {
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    name: "ACME CNC Manufacturing Pvt. Ltd.",
    shortName: "ACME CNC",
    cin: "U28100MH2014PTC251234",
    pan: "AABCA1234Z",
    address: "Plot No. 42, MIDC Industrial Area, Turbhe, Navi Mumbai - 400705",
    city: "Navi Mumbai", state: "Maharashtra", pin: "400705",
    phone: "+91 22 2763 4500", email: "info@acmecnc.com",
    website: "www.acmecnc.com", logo: "", currency: "INR", fy: "april",
  })
  const set = (k: keyof typeof data) => (v: string) => setData((d) => ({ ...d, [k]: v }))
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }
  return (
    <div>
      <SectionTitle title="Company Settings" description="Core business entity information shown on invoices and reports." />
      <Card>
        <Row><Field label="Company Name"><Input value={data.name} onChange={set("name")} /></Field><Field label="Short Name / Trade Name"><Input value={data.shortName} onChange={set("shortName")} /></Field></Row>
        <Row><Field label="CIN" hint="Corporate Identity Number"><Input value={data.cin} onChange={set("cin")} mono /></Field><Field label="PAN"><Input value={data.pan} onChange={set("pan")} mono /></Field></Row>
        <Field label="Registered Address"><Textarea value={data.address} onChange={set("address")} rows={2} /></Field>
        <Row cols={3}>
          <Field label="City"><Input value={data.city} onChange={set("city")} /></Field>
          <Field label="State"><Select value={data.state} onChange={set("state")} options={["Maharashtra","Karnataka","Tamil Nadu","Gujarat","Telangana","Delhi"].map((s) => ({ value: s, label: s }))} /></Field>
          <Field label="PIN Code"><Input value={data.pin} onChange={set("pin")} mono /></Field>
        </Row>
        <Row><Field label="Phone"><Input value={data.phone} onChange={set("phone")} /></Field><Field label="Email"><Input value={data.email} onChange={set("email")} type="email" /></Field></Row>
        <Row><Field label="Website"><Input value={data.website} onChange={set("website")} /></Field><Field label="Financial Year Start"><Select value={data.fy} onChange={set("fy")} options={[{ value: "april", label: "April (Indian FY)" }, { value: "january", label: "January (Calendar)" }]} /></Field></Row>
        <SaveBar onSave={save} saving={saving} />
      </Card>
    </div>
  )
}

function GSTSettings() {
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    gstin: "27AABCA1234Z1Z1",
    regType: "regular",
    state: "Maharashtra",
    stateCode: "27",
    lutNo: "AD270424001234F",
    lutDate: "2026-04-01",
    cgstRate: "9", sgstRate: "9", igstRate: "18",
    hsnCode: "8457", sacCode: "",
    eway: true, einvoice: true,
  })
  const set = (k: keyof typeof data) => (v: string | boolean) => setData((d) => ({ ...d, [k]: v }))
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }
  return (
    <div>
      <SectionTitle title="GST Settings" description="Tax registration and rate configuration for invoicing." />
      <Card>
        <Row>
          <Field label="GSTIN" hint="15-digit GST Identification Number"><Input value={data.gstin} onChange={set("gstin") as (v: string) => void} mono /></Field>
          <Field label="Registration Type"><Select value={data.regType} onChange={set("regType") as (v: string) => void} options={[{ value: "regular", label: "Regular" }, { value: "composition", label: "Composition" }, { value: "unregistered", label: "Unregistered" }]} /></Field>
        </Row>
        <Row>
          <Field label="State of Registration"><Select value={data.state} onChange={set("state") as (v: string) => void} options={["Maharashtra","Karnataka","Tamil Nadu","Gujarat","Telangana","Delhi"].map((s) => ({ value: s, label: s }))} /></Field>
          <Field label="State Code"><Input value={data.stateCode} onChange={set("stateCode") as (v: string) => void} mono disabled /></Field>
        </Row>
        <Row>
          <Field label="LUT Number" hint="Letter of Undertaking for exports"><Input value={data.lutNo} onChange={set("lutNo") as (v: string) => void} mono /></Field>
          <Field label="LUT Valid From"><Input value={data.lutDate} onChange={set("lutDate") as (v: string) => void} type="date" /></Field>
        </Row>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>Default Tax Rates</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }} className="set-row">
            <Field label="CGST %"><Input value={data.cgstRate} onChange={set("cgstRate") as (v: string) => void} mono /></Field>
            <Field label="SGST %"><Input value={data.sgstRate} onChange={set("sgstRate") as (v: string) => void} mono /></Field>
            <Field label="IGST %"><Input value={data.igstRate} onChange={set("igstRate") as (v: string) => void} mono /></Field>
          </div>
        </div>
        <Row>
          <Field label="Default HSN Code" hint="Harmonised System of Nomenclature"><Input value={data.hsnCode} onChange={set("hsnCode") as (v: string) => void} mono /></Field>
          <Field label="SAC Code" hint="Services Accounting Code (if applicable)"><Input value={data.sacCode} onChange={set("sacCode") as (v: string) => void} mono /></Field>
        </Row>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          <Toggle checked={data.eway} onChange={(v) => set("eway")(v)} label="Generate E-Way Bill for shipments above ₹50,000" />
          <Toggle checked={data.einvoice} onChange={(v) => set("einvoice")(v)} label="Enable E-Invoice (IRN) generation" />
        </div>
        <SaveBar onSave={save} saving={saving} />
      </Card>
    </div>
  )
}

function InvoiceSettings() {
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    prefix: "INV", separator: "-", yearInNo: true,
    payDays: "30", terms: "Payment due within 30 days of invoice date. Cheques payable to ACME CNC Manufacturing Pvt. Ltd.",
    footer: "Thank you for your business. For queries, contact accounts@acmecnc.com",
    showLogo: true, showSign: true, showBank: true, showTds: false,
    bankName: "HDFC Bank Ltd.", branch: "Vashi Branch", acc: "50100234567890", ifsc: "HDFC0001234",
    template: "professional",
  })
  const set = (k: keyof typeof data) => (v: string | boolean) => setData((d) => ({ ...d, [k]: v }))
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }
  return (
    <div>
      <SectionTitle title="Invoice Settings" description="Configure invoice appearance, terms, and bank details." />
      <Card>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>Invoice Template</div>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ id: "professional", label: "Professional" }, { id: "minimal", label: "Minimal" }, { id: "classic", label: "Classic" }].map((t) => (
              <label key={t.id} style={{ flex: 1, padding: "12px 14px", background: data.template === t.id ? "var(--primary-subtle)" : "var(--bg-surface)", border: `1px solid ${data.template === t.id ? "var(--primary)" : "var(--border-default)"}`, borderRadius: "var(--radius-sm)", cursor: "pointer", textAlign: "center", fontSize: 12, fontWeight: data.template === t.id ? 600 : 400, color: data.template === t.id ? "var(--primary)" : "var(--text-secondary)", transition: "all 0.15s" }}>
                <input type="radio" style={{ display: "none" }} checked={data.template === t.id} onChange={() => set("template")(t.id)} />{t.label}
              </label>
            ))}
          </div>
        </div>
        <Field label="Payment Terms (days)"><Input value={data.payDays} onChange={set("payDays") as (v: string) => void} mono /></Field>
        <Field label="Terms & Conditions"><Textarea value={data.terms} onChange={set("terms") as (v: string) => void} rows={3} /></Field>
        <Field label="Invoice Footer Text"><Textarea value={data.footer} onChange={set("footer") as (v: string) => void} rows={2} /></Field>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          <Toggle checked={data.showLogo} onChange={(v) => set("showLogo")(v)} label="Show company logo on invoices" />
          <Toggle checked={data.showSign} onChange={(v) => set("showSign")(v)} label="Show authorised signatory section" />
          <Toggle checked={data.showBank} onChange={(v) => set("showBank")(v)} label="Show bank details on invoices" />
          <Toggle checked={data.showTds} onChange={(v) => set("showTds")(v)} label="Show TDS deduction section" />
        </div>
        {data.showBank && (
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "16px", marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 12 }}>Bank Details</div>
            <Row><Field label="Bank Name"><Input value={data.bankName} onChange={set("bankName") as (v: string) => void} /></Field><Field label="Branch"><Input value={data.branch} onChange={set("branch") as (v: string) => void} /></Field></Row>
            <Row><Field label="Account Number"><Input value={data.acc} onChange={set("acc") as (v: string) => void} mono /></Field><Field label="IFSC Code"><Input value={data.ifsc} onChange={set("ifsc") as (v: string) => void} mono /></Field></Row>
          </div>
        )}
        <SaveBar onSave={save} saving={saving} />
      </Card>
    </div>
  )
}

function NumberingSettings() {
  const [saving, setSaving] = useState(false)
  const modules = [
    { key: "invoice",   label: "Invoice",         prefix: "INV",  next: 184,  pad: 4 },
    { key: "po",        label: "Purchase Order",  prefix: "PO",   next: 52,   pad: 4 },
    { key: "wo",        label: "Work Order",      prefix: "WO",   next: 843,  pad: 4 },
    { key: "qc",        label: "QC Inspection",   prefix: "QC",   next: 320,  pad: 4 },
    { key: "emp",       label: "Employee ID",     prefix: "EMP",  next: 157,  pad: 3 },
    { key: "scrap",     label: "Scrap Record",    prefix: "SCR",  next: 48,   pad: 3 },
    { key: "expense",   label: "Expense",         prefix: "EXP",  next: 285,  pad: 3 },
  ]
  const [includeYear, setIncludeYear] = useState(true)
  const [includeFy, setIncludeFy] = useState(true)
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }
  return (
    <div>
      <SectionTitle title="Numbering Settings" description="Configure auto-numbering format for each document type." />
      <Card>
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <Toggle checked={includeYear} onChange={setIncludeYear} label="Include calendar year (e.g. INV-2026-0001)" />
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <Toggle checked={includeFy} onChange={setIncludeFy} label="Include financial year (e.g. INV-26-27-0001)" />
        </div>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", overflow: "hidden", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 90px 90px 90px 1fr", gap: 0, padding: "8px 14px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-raised)" }}>
            {["Module", "Prefix", "Next No.", "Padding", "Preview"].map((h) => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {modules.map((m) => {
            const year = includeYear ? "-2026" : ""
            const preview = `${m.prefix}${year}-${String(m.next).padStart(m.pad, "0")}`
            return (
              <div key={m.key} style={{ display: "grid", gridTemplateColumns: "1.5fr 90px 90px 90px 1fr", gap: 0, padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{m.label}</span>
                <input defaultValue={m.prefix} style={{ width: 70, padding: "5px 8px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-primary)", outline: "none" }} />
                <input type="number" defaultValue={m.next} style={{ width: 70, padding: "5px 8px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-primary)", outline: "none" }} />
                <input type="number" defaultValue={m.pad} min={1} max={8} style={{ width: 50, padding: "5px 8px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-primary)", outline: "none" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--primary)" }}>{preview}</span>
              </div>
            )
          })}
        </div>
        <SaveBar onSave={save} saving={saving} />
      </Card>
    </div>
  )
}

function DepartmentsSettings() {
  const [saving, setSaving] = useState(false)
  const [items, setItems] = useState(["Production", "Quality", "Store / Inventory", "Accounts", "HR & Admin", "Design & Engineering", "Sales"])
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }
  return (
    <div>
      <SectionTitle title="Departments" description="Define departments for employee classification and reporting." />
      <Card>
        <div style={{ marginBottom: 12, fontSize: 12, color: "var(--text-muted)" }}>{items.length} departments configured</div>
        <EditableList items={items} onUpdate={setItems} />
        <SaveBar onSave={save} saving={saving} />
      </Card>
    </div>
  )
}

function DesignationsSettings() {
  const [saving, setSaving] = useState(false)
  const [items, setItems] = useState(["CNC Operator", "Sr. CNC Operator", "Lead Operator", "Quality Inspector", "Sr. Quality Inspector", "Supervisor", "Manager", "General Manager", "Director"])
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }
  return (
    <div>
      <SectionTitle title="Designations" description="Define designations used in employee profiles and organograms." />
      <Card>
        <div style={{ marginBottom: 12, fontSize: 12, color: "var(--text-muted)" }}>{items.length} designations configured</div>
        <EditableList items={items} onUpdate={setItems} />
        <SaveBar onSave={save} saving={saving} />
      </Card>
    </div>
  )
}

function ShiftsSettings() {
  const [saving, setSaving] = useState(false)
  const [shifts, setShifts] = useState<Shift[]>([
    { id: "s1", name: "Morning",   start: "06:00", end: "14:00", grace: 10, active: true },
    { id: "s2", name: "General",   start: "08:00", end: "17:00", grace: 15, active: true },
    { id: "s3", name: "Afternoon", start: "14:00", end: "22:00", grace: 10, active: true },
    { id: "s4", name: "Night",     start: "22:00", end: "06:00", grace: 10, active: false },
  ])
  const update = (id: string, s: Shift) => setShifts((prev) => prev.map((x) => x.id === id ? s : x))
  const del = (id: string) => setShifts((prev) => prev.filter((x) => x.id !== id))
  const add = () => setShifts((prev) => [...prev, { id: `s${Date.now()}`, name: "", start: "09:00", end: "18:00", grace: 10, active: true }])
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }
  return (
    <div>
      <SectionTitle title="Shifts" description="Configure work shifts and grace periods for attendance tracking." />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 80px 1fr auto", gap: 10, padding: "0 14px 8px", marginBottom: 4 }} className="shift-row">
          {["Name", "Start", "End", "Grace", "Status", ""].map((h, i) => (
            <div key={i} style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {shifts.map((s) => (
          <ShiftRow key={s.id} shift={s} onChange={(ns) => update(s.id, ns)} onDelete={() => del(s.id)} />
        ))}
        <button onClick={add} style={{ marginTop: 8, padding: "7px 14px", background: "none", border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)", width: "100%" }}>+ Add Shift</button>
        <SaveBar onSave={save} saving={saving} />
      </Card>
      <style>{`@media(max-width:720px){.shift-row{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  )
}

function LeaveSettings() {
  const [saving, setSaving] = useState(false)
  const [types, setTypes] = useState<LeaveType[]>([
    { id: "l1", name: "Annual Leave",    days: 18, carry: true,  paid: true  },
    { id: "l2", name: "Sick Leave",      days: 12, carry: false, paid: true  },
    { id: "l3", name: "Casual Leave",    days: 6,  carry: false, paid: true  },
    { id: "l4", name: "Maternity Leave", days: 180,carry: false, paid: true  },
    { id: "l5", name: "Paternity Leave", days: 15, carry: false, paid: true  },
    { id: "l6", name: "Loss of Pay",     days: 999,carry: false, paid: false },
  ])
  const [maxCarry, setMaxCarry] = useState("15")
  const [halfDay, setHalfDay] = useState(true)
  const [autoApprove, setAutoApprove] = useState(false)
  const updateType = (id: string, t: LeaveType) => setTypes((prev) => prev.map((x) => x.id === id ? t : x))
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }
  return (
    <div>
      <SectionTitle title="Leave Settings" description="Configure leave types, entitlements and policies." />
      <Card>
        <Row>
          <Field label="Max Carry-forward Days"><Input value={maxCarry} onChange={setMaxCarry} mono /></Field>
        </Row>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          <Toggle checked={halfDay} onChange={setHalfDay} label="Allow half-day leave applications" />
          <Toggle checked={autoApprove} onChange={setAutoApprove} label="Auto-approve leave requests under 1 day" />
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>Leave Types</div>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", overflow: "hidden", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 90px 90px", gap: 0, padding: "8px 14px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-raised)" }}>
            {["Leave Type", "Days/Year", "Carry Fwd", "Paid"].map((h) => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {types.map((t) => (
            <div key={t.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 90px 90px", gap: 0, padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)", alignItems: "center" }}>
              <input value={t.name} onChange={(e) => updateType(t.id, { ...t, name: e.target.value })} style={{ background: "none", border: "none", fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)", outline: "none", width: "100%" }} />
              <input type="number" value={t.days === 999 ? "" : t.days} placeholder="Unltd" onChange={(e) => updateType(t.id, { ...t, days: +e.target.value || 999 })} style={{ width: 60, padding: "4px 7px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-primary)", outline: "none" }} />
              <input type="checkbox" checked={t.carry} onChange={(e) => updateType(t.id, { ...t, carry: e.target.checked })} style={{ width: 16, height: 16, accentColor: "var(--primary)", cursor: "pointer" }} />
              <input type="checkbox" checked={t.paid} onChange={(e) => updateType(t.id, { ...t, paid: e.target.checked })} style={{ width: 16, height: 16, accentColor: "var(--primary)", cursor: "pointer" }} />
            </div>
          ))}
        </div>
        <SaveBar onSave={save} saving={saving} />
      </Card>
    </div>
  )
}

function StockSettings() {
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    lowStockAlert: true, negativeStock: false,
    autoReorder: false, reorderMultiplier: "1.5",
    defaultUnit: "pcs", valuation: "fifo",
    minQtyAlert: "10", maxQtyAlert: "10000",
    categories: ["Raw Material", "Consumable", "Tooling", "Finished Goods", "Spare Parts", "Packaging"],
  })
  const set = (k: keyof typeof data) => (v: string | boolean | string[]) => setData((d) => ({ ...d, [k]: v }))
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }
  return (
    <div>
      <SectionTitle title="Stock Settings" description="Configure inventory behaviour, alerts and valuation method." />
      <Card>
        <Row>
          <Field label="Default Unit of Measure"><Select value={data.defaultUnit} onChange={set("defaultUnit") as (v: string) => void} options={["pcs","kg","g","litre","metre","box","set","lot"].map((u) => ({ value: u, label: u }))} /></Field>
          <Field label="Stock Valuation Method"><Select value={data.valuation} onChange={set("valuation") as (v: string) => void} options={[{ value: "fifo", label: "FIFO (First In, First Out)" }, { value: "lifo", label: "LIFO (Last In, First Out)" }, { value: "avg", label: "Weighted Average Cost" }]} /></Field>
        </Row>
        <Row>
          <Field label="Default Min Qty Threshold"><Input value={data.minQtyAlert} onChange={set("minQtyAlert") as (v: string) => void} mono /></Field>
          <Field label="Reorder Quantity Multiplier" hint="Reorder qty = min qty × multiplier"><Input value={data.reorderMultiplier} onChange={set("reorderMultiplier") as (v: string) => void} mono /></Field>
        </Row>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          <Toggle checked={data.lowStockAlert} onChange={(v) => set("lowStockAlert")(v)} label="Alert when stock falls below minimum quantity" />
          <Toggle checked={data.negativeStock} onChange={(v) => set("negativeStock")(v)} label="Allow negative stock (issue before receipt)" />
          <Toggle checked={data.autoReorder} onChange={(v) => set("autoReorder")(v)} label="Auto-generate purchase requests when stock hits reorder point" />
        </div>
        <Field label="Material Categories">
          <EditableList items={data.categories} onUpdate={(v) => set("categories")(v)} />
        </Field>
        <SaveBar onSave={save} saving={saving} />
      </Card>
    </div>
  )
}

function NotificationSettings() {
  const [saving, setSaving] = useState(false)
  const notifs = [
    { key: "lowStock",     label: "Low Stock Alert",       desc: "Alert when stock falls below minimum quantity",  email: true,  sms: false, inApp: true  },
    { key: "woComplete",   label: "Work Order Completed",  desc: "Notify when a work order is completed",          email: false, sms: false, inApp: true  },
    { key: "leavePending", label: "Leave Request Pending", desc: "Notify approvers of new leave requests",        email: true,  sms: false, inApp: true  },
    { key: "invoiceDue",   label: "Invoice Due",           desc: "Alert 3 days before invoice payment due date",  email: true,  sms: true,  inApp: true  },
    { key: "backupDone",   label: "Backup Complete",       desc: "Confirm successful backup completion",          email: false, sms: false, inApp: true  },
    { key: "qcReject",     label: "QC Rejection",          desc: "Alert when inspection result is rejected",      email: true,  sms: false, inApp: true  },
  ]
  const [state, setState] = useState(notifs.reduce((a, n) => ({ ...a, [n.key]: { email: n.email, sms: n.sms, inApp: n.inApp } }), {} as Record<string, { email: boolean; sms: boolean; inApp: boolean }>))
  const tog = (key: string, ch: "email" | "sms" | "inApp") => setState((s) => ({ ...s, [key]: { ...s[key], [ch]: !s[key][ch] } }))
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }
  return (
    <div>
      <SectionTitle title="Notification Settings" description="Configure which events trigger in-app, email, and SMS notifications." />
      <Card>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", overflow: "hidden", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", padding: "9px 14px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-raised)" }}>
            {["Event", "In-App", "Email", "SMS"].map((h) => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: h === "Event" ? "left" : "center" }}>{h}</div>
            ))}
          </div>
          {notifs.map((n) => (
            <div key={n.key} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{n.label}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{n.desc}</div>
              </div>
              {(["inApp", "email", "sms"] as const).map((ch) => (
                <div key={ch} style={{ display: "flex", justifyContent: "center" }}>
                  <input type="checkbox" checked={state[n.key]?.[ch] ?? false} onChange={() => tog(n.key, ch)} style={{ width: 16, height: 16, accentColor: "var(--primary)", cursor: "pointer" }} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <SaveBar onSave={save} saving={saving} />
      </Card>
    </div>
  )
}

function BackupSettings() {
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    auto: true, freq: "daily", time: "02:00", retainDays: "30",
    compress: true, encrypt: true, drive: false,
    driveEmail: "", notify: true,
  })
  const set = (k: keyof typeof data) => (v: string | boolean) => setData((d) => ({ ...d, [k]: v }))
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }
  return (
    <div>
      <SectionTitle title="Backup Settings" description="Automated backup schedule and retention policy." />
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          <Toggle checked={data.auto} onChange={(v) => set("auto")(v)} label="Enable automatic scheduled backups" />
        </div>
        {data.auto && (
          <Row>
            <Field label="Frequency"><Select value={data.freq} onChange={set("freq") as (v: string) => void} options={[{ value: "hourly", label: "Hourly" }, { value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }, { value: "monthly", label: "Monthly" }]} /></Field>
            <Field label="Backup Time"><Input value={data.time} onChange={set("time") as (v: string) => void} type="time" mono /></Field>
          </Row>
        )}
        <Row>
          <Field label="Retain Backups (days)" hint="Backups older than this are auto-deleted"><Input value={data.retainDays} onChange={set("retainDays") as (v: string) => void} mono /></Field>
        </Row>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          <Toggle checked={data.compress} onChange={(v) => set("compress")(v)} label="Compress backup files (ZIP)" />
          <Toggle checked={data.encrypt} onChange={(v) => set("encrypt")(v)} label="Encrypt backups with AES-256" />
          <Toggle checked={data.drive} onChange={(v) => set("drive")(v)} label="Sync to Google Drive after each backup" />
          <Toggle checked={data.notify} onChange={(v) => set("notify")(v)} label="Send notification on backup completion / failure" />
        </div>
        {data.drive && (
          <Field label="Google Drive Account Email"><Input value={data.driveEmail} onChange={set("driveEmail") as (v: string) => void} placeholder="accounts@acmecnc.com" /></Field>
        )}
        <SaveBar onSave={save} saving={saving} />
      </Card>
    </div>
  )
}

function SecuritySettings() {
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    sessionTimeout: "60", mfa: false, strongPass: true, loginAttempts: "5",
    ipWhitelist: false, allowedIPs: "", auditLog: true, auditRetain: "180",
    apiAccess: false, rateLimitLogin: true, forceLogoutOnIP: false,
  })
  const set = (k: keyof typeof data) => (v: string | boolean) => setData((d) => ({ ...d, [k]: v }))
  const save = () => { setSaving(true); setTimeout(() => setSaving(false), 900) }
  return (
    <div>
      <SectionTitle title="Security Settings" description="Access control, session policies and audit configuration." />
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Session & Access</div>
        <Row>
          <Field label="Session Timeout (minutes)" hint="Users are logged out after this period of inactivity"><Input value={data.sessionTimeout} onChange={set("sessionTimeout") as (v: string) => void} mono /></Field>
          <Field label="Max Login Attempts" hint="Account locked after this many failed attempts"><Input value={data.loginAttempts} onChange={set("loginAttempts") as (v: string) => void} mono /></Field>
        </Row>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          <Toggle checked={data.mfa} onChange={(v) => set("mfa")(v)} label="Require multi-factor authentication (MFA) for all users" />
          <Toggle checked={data.strongPass} onChange={(v) => set("strongPass")(v)} label="Enforce strong password policy (min 8 chars, mixed case, special character)" />
          <Toggle checked={data.rateLimitLogin} onChange={(v) => set("rateLimitLogin")(v)} label="Rate-limit login attempts (CAPTCHA after 3 failures)" />
          <Toggle checked={data.forceLogoutOnIP} onChange={(v) => set("forceLogoutOnIP")(v)} label="Force logout when IP address changes mid-session" />
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>IP Restriction</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: data.ipWhitelist ? 12 : 24 }}>
          <Toggle checked={data.ipWhitelist} onChange={(v) => set("ipWhitelist")(v)} label="Enable IP whitelist (only allow listed IPs to log in)" />
        </div>
        {data.ipWhitelist && (
          <Field label="Allowed IP Addresses" hint="One IP or CIDR range per line (e.g. 192.168.1.0/24)">
            <Textarea value={data.allowedIPs} onChange={set("allowedIPs") as (v: string) => void} rows={4} />
          </Field>
        )}

        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Audit Log</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          <Toggle checked={data.auditLog} onChange={(v) => set("auditLog")(v)} label="Enable comprehensive audit logging" />
          <Toggle checked={data.apiAccess} onChange={(v) => set("apiAccess")(v)} label="Enable API access (generate API keys for integrations)" />
        </div>
        {data.auditLog && (
          <Field label="Audit Log Retention (days)" hint="Logs older than this are archived"><Input value={data.auditRetain} onChange={set("auditRetain") as (v: string) => void} mono /></Field>
        )}
        <SaveBar onSave={save} saving={saving} />
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
interface Props { onNavigate?: (id: string) => void }

export function SettingsModule({ onNavigate }: Props) {
  const [active, setActive] = useState<SettingSection>("company")

  const groups = [...new Set(SECTIONS.map((s) => s.group))]

  const sectionContent: Record<SettingSection, React.ReactNode> = {
    company:       <CompanySettings />,
    gst:           <GSTSettings />,
    invoice:       <InvoiceSettings />,
    shifts:        <ShiftsSettings />,
    leave:         <LeaveSettings />,
    stock:         <StockSettings />,
    backup:        <BackupSettings />,
  }

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader title="Settings" description="System configuration, company details and operational defaults" accentColor="#64748b" />
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Sidebar nav */}
        <aside style={{ width: 210, flexShrink: 0, position: "sticky", top: 80 }} className="set-aside">
          {groups.map((group) => (
            <div key={group} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-disabled)", padding: "0 10px 6px" }}>{group}</div>
              {SECTIONS.filter((s) => s.group === group).map((s) => (
                <button key={s.id} onClick={() => setActive(s.id)} style={{
                  display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 10px",
                  background: active === s.id ? "var(--primary-subtle)" : "none",
                  border: active === s.id ? "1px solid var(--primary)20" : "1px solid transparent",
                  borderRadius: "var(--radius-sm)", color: active === s.id ? "var(--primary)" : "var(--text-muted)",
                  fontSize: 12, fontWeight: active === s.id ? 600 : 400, cursor: "pointer",
                  fontFamily: "var(--font-body)", textAlign: "left", transition: "all 0.12s ease",
                }}>
                  <span style={{ fontSize: 14 }}>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, animation: "fade-in 0.2s ease-out" }} key={active}>
          {sectionContent[active]}
        </div>
      </div>

      <style>{`
        @media(max-width:800px){.set-aside{display:none!important}}
        @media(max-width:600px){.set-row{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  )
}
