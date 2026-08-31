import React, { useState, useEffect, useRef, useCallback, useReducer } from "react"
import { PageHeader } from "../shell/PageHeader"

/* ─── Types ───────────────────────────────────────────────── */
type BackupView = "dashboard" | "restore" | "history"
type RestoreStep = "upload" | "identify" | "validate" | "crosscheck" | "compare" | "review" | "restore"
type FileCategory =
  | "master" | "employees" | "attendance" | "billing" | "stock"
  | "purchase" | "production" | "machines" | "quality" | "expenses"
  | "unknown"
type RecordStatus = "match" | "missing" | "added" | "modified" | "duplicate" | "invalid"
type BackupStatus = "success" | "failed" | "running" | "scheduled"
type VerifyStatus = "verified" | "warnings" | "failed" | "pending"

interface DetectedFile {
  id: string
  name: string
  size: number
  type: "xlsx" | "zip" | "sql" | "csv"
  category: FileCategory
  confidence: number
  rows: number
  columns: string[]
  sampleData: Record<string, string>[]
  status: "pending" | "valid" | "warning" | "error"
  warnings: string[]
  errors: string[]
}

interface ComparisonRecord {
  id: string
  field: string
  dbValue: string
  masterValue: string
  uploadedValue: string
  status: RecordStatus
}

interface BackupEntry {
  id: string
  date: string
  time: string
  user: string
  type: "auto" | "manual" | "pre-restore" | "google-drive"
  size: string
  files: number
  status: BackupStatus
  verifyStatus: VerifyStatus
  restoreStatus: "none" | "restored" | "partial"
  notes: string
}

interface RestoreSelection {
  employees: boolean
  attendance: boolean
  billing: boolean
  stock: boolean
  purchase: boolean
  production: boolean
  machines: boolean
  quality: boolean
  expenses: boolean
}

/* ─── Constants ───────────────────────────────────────────── */
const ACCEPTED_TYPES = [".xlsx", ".zip", ".sql", ".csv"]

const FILE_CATEGORY_META: Record<FileCategory, { label: string; color: string; icon: string; keywords: string[] }> = {
  master:     { label: "Master Data",    color: "#2563eb", icon: "◈", keywords: ["master","config","settings","company"] },
  employees:  { label: "Employees",      color: "#10b981", icon: "◉", keywords: ["emp","employee","staff","worker","hr"] },
  attendance: { label: "Attendance",     color: "#06b6d4", icon: "◇", keywords: ["attend","presence","checkin","clock"] },
  billing:    { label: "Billing",        color: "#f59e0b", icon: "◈", keywords: ["bill","invoice","receipt","tax","gst"] },
  stock:      { label: "Stock/Inventory",color: "#14b8a6", icon: "⬜", keywords: ["stock","inventory","material","store"] },
  purchase:   { label: "Purchase",       color: "#a78bfa", icon: "⬛", keywords: ["purchase","po","order","supplier","vendor"] },
  production: { label: "Production",     color: "#fb923c", icon: "⬟", keywords: ["prod","work","wo","output","machine","job"] },
  machines:   { label: "Machines",       color: "#64748b", icon: "⬢", keywords: ["machine","cnc","equipment","lathe"] },
  quality:    { label: "Quality",        color: "#34d399", icon: "◈", keywords: ["quality","qc","inspect","defect","reject"] },
  expenses:   { label: "Expenses",       color: "#fbbf24", icon: "◉", keywords: ["expense","cost","spend","payment"] },
  unknown:    { label: "Unknown",        color: "#4b5a72", icon: "?", keywords: [] },
}

const RECORD_STATUS_META: Record<RecordStatus, { label: string; color: string; bg: string }> = {
  match:     { label: "Match",     color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  missing:   { label: "Missing",   color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  added:     { label: "Added",     color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
  modified:  { label: "Modified",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  duplicate: { label: "Duplicate", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  invalid:   { label: "Invalid",   color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
}

const STEPS: { id: RestoreStep; label: string; short: string }[] = [
  { id: "upload",     label: "Upload Files",      short: "Upload" },
  { id: "identify",   label: "Identify Files",    short: "Identify" },
  { id: "validate",   label: "Validate Data",     short: "Validate" },
  { id: "crosscheck", label: "Cross-check",       short: "Cross-check" },
  { id: "compare",    label: "Compare Records",   short: "Compare" },
  { id: "review",     label: "Review & Select",   short: "Review" },
  { id: "restore",    label: "Restore",           short: "Restore" },
]

/* ─── Sample backup history ───────────────────────────────── */
const BACKUP_HISTORY: BackupEntry[] = [
  { id: "bk1", date: "2026-08-19", time: "02:00:14", user: "System (Auto)", type: "auto", size: "14.8 MB", files: 11, status: "success", verifyStatus: "verified", restoreStatus: "none", notes: "Scheduled nightly backup" },
  { id: "bk2", date: "2026-08-18", time: "17:42:08", user: "Alex Mercer", type: "manual", size: "14.6 MB", files: 11, status: "success", verifyStatus: "verified", restoreStatus: "none", notes: "Pre-month-end manual backup" },
  { id: "bk3", date: "2026-08-18", time: "02:00:09", user: "System (Auto)", type: "auto", size: "14.5 MB", files: 11, status: "success", verifyStatus: "warnings", restoreStatus: "none", notes: "2 checksum warnings (non-critical)" },
  { id: "bk4", date: "2026-08-17", time: "02:00:22", user: "System (Auto)", type: "auto", size: "14.2 MB", files: 11, status: "success", verifyStatus: "verified", restoreStatus: "none", notes: "" },
  { id: "bk5", date: "2026-08-16", time: "02:00:11", user: "System (Auto)", type: "auto", size: "14.0 MB", files: 11, status: "success", verifyStatus: "verified", restoreStatus: "restored", notes: "Restored employees module after accidental delete" },
  { id: "bk6", date: "2026-08-15", time: "09:14:33", user: "Alex Mercer", type: "google-drive", size: "13.9 MB", files: 11, status: "success", verifyStatus: "verified", restoreStatus: "none", notes: "Synced to Google Drive" },
  { id: "bk7", date: "2026-08-14", time: "02:00:18", user: "System (Auto)", type: "auto", size: "13.7 MB", files: 10, status: "failed", verifyStatus: "failed", restoreStatus: "none", notes: "Disk space error at 2:00 AM — partial backup" },
  { id: "bk8", date: "2026-08-13", time: "02:00:08", user: "System (Auto)", type: "auto", size: "13.5 MB", files: 11, status: "success", verifyStatus: "verified", restoreStatus: "none", notes: "" },
]

/* ─── Mock detected files ─────────────────────────────────── */
const MOCK_DETECTED: DetectedFile[] = [
  { id: "df1", name: "ACME_Master_Data_Aug2026.xlsx", size: 840000, type: "xlsx", category: "master", confidence: 98, rows: 124, columns: ["company_name","gstin","address","financial_year","currency","modules"], sampleData: [{ company_name: "ACME CNC Mfg Pvt. Ltd.", gstin: "29AABCA1234Z1Z1", financial_year: "2026-27" }], status: "valid", warnings: [], errors: [] },
  { id: "df2", name: "Employees_Export_Aug19.xlsx", size: 320000, type: "xlsx", category: "employees", confidence: 97, rows: 155, columns: ["emp_id","name","department","designation","joining_date","salary","status"], sampleData: [{ emp_id: "EMP-001", name: "R. Sharma", department: "Production", status: "Active" }], status: "valid", warnings: ["3 rows have missing emergency contact"], errors: [] },
  { id: "df3", name: "Attendance_Aug2026.xlsx", size: 280000, type: "xlsx", category: "attendance", confidence: 95, rows: 2480, columns: ["emp_id","date","check_in","check_out","status","hours"], sampleData: [{ emp_id: "EMP-001", date: "2026-08-19", check_in: "08:52", check_out: "17:48", hours: "8.93" }], status: "warning", warnings: ["12 records have check-out missing (last shift)"], errors: [] },
  { id: "df4", name: "Billing_Invoices_Aug2026.xlsx", size: 410000, type: "xlsx", category: "billing", confidence: 96, rows: 842, columns: ["invoice_no","date","client","amount","tax","status","payment_mode"], sampleData: [{ invoice_no: "INV-2026-0183", date: "2026-08-13", client: "TechMetal Industries", amount: "84200", status: "Paid" }], status: "valid", warnings: [], errors: [] },
  { id: "df5", name: "Stock_Inventory_Aug2026.xlsx", size: 360000, type: "xlsx", category: "stock", confidence: 94, rows: 460, columns: ["material_code","name","category","qty","unit","min_qty","location","value"], sampleData: [{ material_code: "RM-001", name: "AL6061-T6 Plate", qty: "12", unit: "kg", min_qty: "50" }], status: "warning", warnings: ["4 items below minimum stock — flagged for reorder"], errors: [] },
  { id: "df6", name: "Purchase_Orders_Aug2026.xlsx", size: 220000, type: "xlsx", category: "purchase", confidence: 93, rows: 280, columns: ["po_number","date","supplier","items","total","status","received_date"], sampleData: [{ po_number: "PO-2026-0048", supplier: "SteelCraft Metals", total: "84200", status: "Received" }], status: "valid", warnings: [], errors: [] },
  { id: "df7", name: "Production_WorkOrders_Aug2026.xlsx", size: 300000, type: "xlsx", category: "production", confidence: 96, rows: 184, columns: ["wo_number","part","qty","produced","rejected","machine","operator","status"], sampleData: [{ wo_number: "WO-2026-0841", part: "Flange Bearing Housing", qty: "50", produced: "38", status: "Running" }], status: "valid", warnings: [], errors: [] },
  { id: "df8", name: "Machines_Fleet_Aug2026.xlsx", size: 180000, type: "xlsx", category: "machines", confidence: 91, rows: 7, columns: ["machine_code","name","type","status","oee","last_maintenance","next_maintenance"], sampleData: [{ machine_code: "CNC-001", name: "Haas VF-2", status: "Running", oee: "94" }], status: "valid", warnings: [], errors: [] },
  { id: "df9", name: "Quality_Inspections_Aug2026.xlsx", size: 210000, type: "xlsx", category: "quality", confidence: 94, rows: 320, columns: ["insp_id","wo_number","part","qty","accepted","rejected","inspector","result"], sampleData: [{ insp_id: "QC-0048", wo_number: "WO-2026-0842", result: "Accepted" }], status: "valid", warnings: [], errors: [] },
  { id: "df10", name: "Expenses_Aug2026.xlsx", size: 190000, type: "xlsx", category: "expenses", confidence: 92, rows: 148, columns: ["date","category","description","amount","approved_by","status"], sampleData: [{ date: "2026-08-13", category: "Raw Materials", amount: "28400", status: "Approved" }], status: "valid", warnings: [], errors: [] },
  { id: "df11", name: "backup_data_partial_old.xlsx", size: 950000, type: "xlsx", category: "unknown", confidence: 12, rows: 0, columns: [], sampleData: [], status: "error", warnings: [], errors: ["Cannot determine file category — column headers unrecognized", "File appears to be from an incompatible version"] },
]

const COMPARISON_RECORDS: ComparisonRecord[] = [
  { id: "cr1",  field: "EMP-001 · Salary",        dbValue: "₹42,000", masterValue: "₹42,000", uploadedValue: "₹42,000", status: "match" },
  { id: "cr2",  field: "EMP-008 · Designation",   dbValue: "Sr. Operator", masterValue: "Sr. Operator", uploadedValue: "Lead Operator", status: "modified" },
  { id: "cr3",  field: "EMP-031 · Status",         dbValue: "Active", masterValue: "Active", uploadedValue: "Resigned", status: "modified" },
  { id: "cr4",  field: "EMP-156 · Record",         dbValue: "—", masterValue: "—", uploadedValue: "Present", status: "added" },
  { id: "cr5",  field: "INV-2026-0180 · Amount",   dbValue: "₹64,200", masterValue: "₹64,200", uploadedValue: "₹64,200", status: "match" },
  { id: "cr6",  field: "INV-2026-0172 · Status",   dbValue: "Pending", masterValue: "Paid", uploadedValue: "Paid", status: "modified" },
  { id: "cr7",  field: "INV-2026-0199 · Record",   dbValue: "Present", masterValue: "—", uploadedValue: "—", status: "missing" },
  { id: "cr8",  field: "RM-007 · Current Qty",     dbValue: "3 pcs", masterValue: "3 pcs", uploadedValue: "3 pcs", status: "match" },
  { id: "cr9",  field: "RM-012 · Min Qty",         dbValue: "25 kg", masterValue: "25 kg", uploadedValue: "15 kg", status: "modified" },
  { id: "cr10", field: "ATT-2026-08-19 EMP-042",   dbValue: "08:48–17:52", masterValue: "08:48–17:52", uploadedValue: "08:48–17:52", status: "match" },
  { id: "cr11", field: "ATT-2026-08-19 EMP-038",   dbValue: "—", masterValue: "—", uploadedValue: "09:12–?", status: "added" },
  { id: "cr12", field: "WO-2026-0840 · Produced",  dbValue: "200", masterValue: "200", uploadedValue: "200", status: "match" },
  { id: "cr13", field: "WO-2026-0835 · Duplicate", dbValue: "180", masterValue: "180", uploadedValue: "180 (×2)", status: "duplicate" },
  { id: "cr14", field: "EXP-0284 · Amount",        dbValue: "₹8,400", masterValue: "₹8,400", uploadedValue: "₹84,00", status: "invalid" },
]

/* ─── Utility ─────────────────────────────────────────────── */
function fmtBytes(b: number) {
  if (b > 1024 * 1024) return (b / 1024 / 1024).toFixed(1) + " MB"
  if (b > 1024) return (b / 1024).toFixed(0) + " KB"
  return b + " B"
}
function fmtDate(d: string) {
  const [y, m, day] = d.split("-")
  return `${day} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m-1]} ${y}`
}
function stepIndex(s: RestoreStep) { return STEPS.findIndex((x) => x.id === s) }

/* ─── Shield / Lock SVG animations ───────────────────────────*/
function ShieldIcon({ size = 48, color = "#2563eb", pulse = false }: { size?: number; color?: string; pulse?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ animation: pulse ? "shield-pulse 2.4s ease-in-out infinite" : undefined }}>
      <path d="M24 4 L40 10 L40 24 C40 33 33 40 24 44 C15 40 8 33 8 24 L8 10 Z" fill={`${color}18`} stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M24 4 L40 10 L40 24 C40 33 33 40 24 44 C15 40 8 33 8 24 L8 10 Z" fill="none" stroke={`${color}40`} strokeWidth="0.8" strokeLinejoin="round" strokeDasharray="60 4" style={{ animation: "shield-trace 6s linear infinite" }} />
      <path d="M17 24 L22 29 L31 20" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DataflowLines() {
  return (
    <svg width="320" height="80" viewBox="0 0 320 80" fill="none" style={{ opacity: 0.35, position: "absolute", bottom: 0, right: 0, pointerEvents: "none" }}>
      {[0,1,2,3,4,5,6].map((i) => (
        <line key={i} x1={i * 50} y1={80} x2={i * 50 + 80} y2={0} stroke="#2563eb" strokeWidth="0.8" strokeDasharray="4 6"
          style={{ animation: `dataflow-line 3s ease-in-out ${i * 0.4}s infinite` }} />
      ))}
    </svg>
  )
}

/* ─── Status badges ───────────────────────────────────────── */
function StatusBadge({ status, small }: { status: BackupStatus | VerifyStatus | "none" | "restored" | "partial"; small?: boolean }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    success:   { label: "Success",   color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    failed:    { label: "Failed",    color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
    running:   { label: "Running",   color: "#06b6d4", bg: "rgba(6,182,212,0.12)" },
    scheduled: { label: "Scheduled", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
    verified:  { label: "Verified",  color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    warnings:  { label: "Warnings",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    pending:   { label: "Pending",   color: "#64748b", bg: "rgba(100,116,139,0.12)" },
    none:      { label: "—",         color: "#4b5a72", bg: "transparent" },
    restored:  { label: "Restored",  color: "#2563eb", bg: "rgba(37,99,235,0.12)" },
    partial:   { label: "Partial",   color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  }
  const m = map[status] ?? map.none
  return (
    <span style={{ fontSize: small ? 9 : 10, fontWeight: 700, color: m.color, background: m.bg, padding: small ? "2px 6px" : "3px 9px", borderRadius: 99, letterSpacing: "0.05em", border: `1px solid ${m.color}30` }}>
      {m.label}
    </span>
  )
}

/* ─── Stepper ─────────────────────────────────────────────── */
function Stepper({ current }: { current: RestoreStep }) {
  const ci = stepIndex(current)
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32, overflowX: "auto", paddingBottom: 4 }}>
      {STEPS.map((s, i) => {
        const done = i < ci, active = i === ci
        return (
          <React.Fragment key={s.id}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: done ? "#10b981" : active ? "#2563eb" : "var(--bg-raised)",
                border: `2px solid ${done ? "#10b981" : active ? "#2563eb" : "var(--border-default)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: done || active ? "#fff" : "var(--text-muted)",
                boxShadow: active ? "0 0 0 4px rgba(37,99,235,0.2)" : undefined,
                transition: "all 0.3s ease",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: done ? "#10b981" : active ? "#2563eb" : "var(--text-muted)", textAlign: "center", whiteSpace: "nowrap" }}>
                {s.short}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < ci ? "#10b981" : "var(--border-default)", minWidth: 24, marginBottom: 18, transition: "background 0.3s ease" }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

/* ─── Drag-drop zone ─────────────────────────────────────── */
function DropZone({ files, onFiles }: { files: File[]; onFiles: (f: File[]) => void }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      ACCEPTED_TYPES.some((ext) => f.name.toLowerCase().endsWith(ext))
    )
    if (dropped.length) onFiles([...files, ...dropped])
  }, [files, onFiles])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files ?? [])
    if (chosen.length) onFiles([...files, ...chosen])
  }, [files, onFiles])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? "#2563eb" : "var(--border-strong)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "40px 24px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
        cursor: "pointer",
        background: dragging ? "rgba(37,99,235,0.06)" : "var(--bg-surface)",
        transition: "all 0.2s ease",
        boxShadow: dragging ? "0 0 0 4px rgba(37,99,235,0.15), inset 0 0 40px rgba(37,99,235,0.04)" : undefined,
        position: "relative", overflow: "hidden",
      }}>
      {!dragging && <DataflowLines />}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <ShieldIcon size={40} color={dragging ? "#2563eb" : "#4b5a72"} pulse={dragging} />
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: dragging ? "#2563eb" : "var(--text-secondary)", marginTop: 10 }}>
          {dragging ? "Release to upload securely" : "Drop backup files here"}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
          Accepts <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>.xlsx · .zip · .sql · .csv</span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, padding: "7px 18px", background: "var(--primary-subtle)", border: "1px solid var(--primary)", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, color: "var(--primary)" }}>
          <span>⬆</span> Browse Files
        </div>
      </div>
      <input ref={inputRef} type="file" multiple accept={ACCEPTED_TYPES.join(",")} style={{ display: "none" }} onChange={handleChange} />
    </div>
  )
}

/* ─── File pill ───────────────────────────────────────────── */
function FilePill({ file, detected, onRemove }: { file: File; detected?: DetectedFile; onRemove: () => void }) {
  const catMeta = detected ? FILE_CATEGORY_META[detected.category] : null
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--bg-elevated)", border: `1px solid ${detected?.status === "error" ? "var(--error-border)" : detected?.status === "warning" ? "var(--warning-border)" : "var(--border-default)"}`, borderRadius: "var(--radius-md)", animation: "fade-in 0.2s ease-out" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#fff", background: detected?.status === "error" ? "#ef4444" : detected?.status === "warning" ? "#f59e0b" : "#2563eb", padding: "2px 6px", borderRadius: "var(--radius-xs)" }}>
        {file.name.split(".").pop()?.toUpperCase()}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          {fmtBytes(file.size)}
          {detected && <> · <span style={{ color: catMeta?.color }}>{catMeta?.icon} {catMeta?.label}</span> · {detected.confidence}% match</>}
        </div>
      </div>
      {detected && <StatusBadge status={detected.status as "success"} small />}
      <button onClick={onRemove} style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--bg-raised)", border: "1px solid var(--border-default)", color: "var(--text-muted)", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
    </div>
  )
}

/* ─── Progress bar ───────────────────────────────────────────*/
function PBar({ value, color = "#2563eb" }: { value: number; color?: string }) {
  return (
    <div style={{ height: 3, background: "var(--bg-raised)", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 99, boxShadow: `0 0 8px ${color}60`, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  )
}

/* ─── Verification score ring ─────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const r = 54, circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 85 ? "#10b981" : score >= 65 ? "#f59e0b" : "#ef4444"
  const label = score >= 85 ? "EXCELLENT" : score >= 65 ? "ACCEPTABLE" : "CRITICAL"
  return (
    <div style={{ position: "relative", width: 130, height: 130 }}>
      <svg width={130} height={130} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={65} cy={65} r={r} fill="none" stroke="var(--bg-raised)" strokeWidth={10} />
        <circle cx={65} cy={65} r={r} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 6px ${color}80)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 28, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color, letterSpacing: "0.08em", marginTop: 2 }}>{label}</span>
      </div>
    </div>
  )
}

/* ─── Confirmation dialog ────────────────────────────────── */
function ConfirmDialog({ selection, onConfirm, onCancel }: {
  selection: RestoreSelection
  onConfirm: () => void
  onCancel: () => void
}) {
  const [typed, setTyped] = useState("")
  const selected = (Object.entries(selection) as [string, boolean][]).filter(([, v]) => v).map(([k]) => k)
  const confirmed = typed.trim().toUpperCase() === "RESTORE"

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(9,13,21,0.88)", backdropFilter: "blur(6px)", animation: "fade-in 0.2s ease-out" }}>
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--error-border)", borderRadius: "var(--radius-lg)", padding: "32px", maxWidth: 480, width: "90%", boxShadow: "0 0 0 1px rgba(239,68,68,0.2), 0 24px 64px rgba(0,0,0,0.7)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--error-bg)", border: "2px solid var(--error-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>⚠</div>
          <div>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 16, color: "#ef4444" }}>Confirm Data Restoration</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>This action will overwrite existing records</div>
          </div>
        </div>

        {/* Warning */}
        <div style={{ background: "var(--error-bg)", border: "1px solid var(--error-border)", borderRadius: "var(--radius-md)", padding: "12px 14px", marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: "var(--error)", fontWeight: 600, marginBottom: 6 }}>⚠ This will overwrite the following modules:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {selected.map((k) => (
              <span key={k} style={{ fontSize: 10, fontWeight: 700, background: "rgba(239,68,68,0.15)", color: "#ef4444", padding: "2px 8px", borderRadius: 99, textTransform: "capitalize" }}>{k}</span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "var(--error)", marginTop: 8, opacity: 0.8 }}>A pre-restore backup will be created automatically before proceeding.</div>
        </div>

        {/* Checklist */}
        <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 16 }}>
          {["Existing records in selected modules will be overwritten", "This action cannot be undone without another restore", "A full audit log entry will be created", "System will be in read-only mode during restoration"].map((item) => (
            <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 5 }}>
              <span style={{ color: "#ef4444", flexShrink: 0 }}>·</span>{item}
            </div>
          ))}
        </div>

        {/* Confirm type */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>Type <strong style={{ fontFamily: "var(--font-mono)", color: "var(--error)" }}>RESTORE</strong> to confirm:</div>
          <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type RESTORE…" style={{ width: "100%", padding: "9px 12px", background: "var(--bg-surface)", border: `1px solid ${confirmed ? "var(--error)" : "var(--border-default)"}`, borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-mono)", outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px 0", background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>Cancel</button>
          <button disabled={!confirmed} onClick={onConfirm} style={{ flex: 1, padding: "10px 0", background: confirmed ? "#ef4444" : "var(--bg-raised)", border: `1px solid ${confirmed ? "#ef4444" : "var(--border-default)"}`, borderRadius: "var(--radius-md)", color: confirmed ? "#fff" : "var(--text-muted)", fontSize: 13, fontWeight: 700, cursor: confirmed ? "pointer" : "not-allowed", fontFamily: "var(--font-body)", transition: "all 0.2s ease" }}>
            Restore Now
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Restore result ─────────────────────────────────────── */
function RestoreResult({ selection, onDone }: { selection: RestoreSelection; onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState("Initialising restore engine…")
  const [done, setDone] = useState(false)
  const phases = [
    "Creating pre-restore backup…",
    "Verifying backup integrity…",
    "Restoring Employees module…",
    "Restoring Attendance records…",
    "Restoring Stock data…",
    "Rebuilding indexes…",
    "Running post-restore verification…",
    "Finalising and updating audit log…",
  ]
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setProgress(Math.min(100, Math.round((i / phases.length) * 100)))
      setPhase(phases[Math.min(i - 1, phases.length - 1)])
      if (i >= phases.length) { clearInterval(interval); setTimeout(() => setDone(true), 400) }
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const selected = (Object.entries(selection) as [string, boolean][]).filter(([, v]) => v).map(([k]) => k)

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      {!done ? (
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "40px 32px", textAlign: "center" }}>
          <ShieldIcon size={56} color="#2563eb" pulse />
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginTop: 16, marginBottom: 8 }}>Restoration in Progress</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 24, fontFamily: "var(--font-mono)" }}>{phase}</div>
          <div style={{ maxWidth: 360, margin: "0 auto 8px" }}>
            <PBar value={progress} />
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--primary)" }}>{progress}%</div>
        </div>
      ) : (
        <div>
          {/* Success header */}
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-lg)", padding: "28px 28px 24px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <ShieldIcon size={48} color="#10b981" />
              <div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 700, color: "#10b981" }}>Restoration Completed Successfully</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>Aug 19, 2026 · 14:38:22 · Operator: Alex Mercer</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="restore-result-grid">
              {[
                { label: "Records Restored", value: "4,218", color: "#10b981" },
                { label: "Warnings", value: "3", color: "#f59e0b" },
                { label: "Errors", value: "0", color: "#ef4444" },
                { label: "Verify Score", value: "94", color: "#2563eb" },
              ].map((k) => (
                <div key={k.label} style={{ background: "var(--bg-raised)", borderRadius: "var(--radius-md)", padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Modules restored */}
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", marginBottom: 16, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>Modules Restored</div>
            {selected.map((k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ color: "#10b981", fontSize: 14 }}>✓</span>
                <span style={{ fontSize: 12, color: "var(--text-primary)", textTransform: "capitalize", flex: 1 }}>{k}</span>
                <StatusBadge status="success" small />
              </div>
            ))}
          </div>

          {/* Warnings */}
          <div style={{ background: "var(--warning-bg)", border: "1px solid var(--warning-border)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "var(--warning)", marginBottom: 6 }}>3 Non-Critical Warnings</div>
            {["12 attendance records had missing check-out — defaulted to shift end", "EMP-031 status change flagged — manual review recommended", "RM-012 minimum quantity discrepancy — original database value retained"].map((w, i) => (
              <div key={i} style={{ fontSize: 11, color: "#f59e0b", marginTop: 4, display: "flex", gap: 6 }}><span>·</span>{w}</div>
            ))}
          </div>

          <button onClick={onDone} style={{ padding: "11px 28px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Return to Backup Dashboard →
          </button>
        </div>
      )}
      <style>{`@media(max-width:600px){.restore-result-grid{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   BACKUP DASHBOARD
═══════════════════════════════════════════════════════════ */
function BackupDashboard({ onView }: { onView: (v: BackupView) => void }) {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [driveConnected, setDriveConnected] = useState(false)
  const latest = BACKUP_HISTORY[0]

  const handleBackupNow = () => {
    setRunning(true)
    setProgress(0)
    let p = 0
    const t = setInterval(() => {
      p += 3 + Math.random() * 5
      if (p >= 100) { setProgress(100); clearInterval(t); setTimeout(() => { setRunning(false); setProgress(0) }, 1200) }
      else setProgress(Math.floor(p))
    }, 200)
  }

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader
        title="Backup & Recovery Center"
        description="Data protection, verification and selective restoration"
        accentColor="#2563eb"
        badge={{ label: "Protected", variant: "success" }}
        primaryAction={{ label: running ? `Backing up… ${progress}%` : "Backup Now", onClick: handleBackupNow }}
        secondaryActions={[
          { label: "Restore Data", onClick: () => onView("restore") },
          { label: "History", onClick: () => onView("history") },
        ]}
      />

      {/* Backup progress bar */}
      {running && (
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--primary)", borderRadius: "var(--radius-md)", padding: "14px 18px", marginBottom: 20, animation: "fade-in 0.2s ease-out" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", display: "inline-block" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>Backup in progress</span>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--primary)" }}>{progress}%</span>
          </div>
          <PBar value={progress} />
        </div>
      )}

      {/* Status cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }} className="bk-stat-grid">
        {/* Last backup */}
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "20px 20px", borderTop: "3px solid #10b981", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 12, right: 16 }}>
            <ShieldIcon size={36} color="#10b981" />
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Last Backup</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "#10b981", lineHeight: 1 }}>{fmtDate(latest.date)}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{latest.time}</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <StatusBadge status={latest.status} small />
            <StatusBadge status={latest.verifyStatus} small />
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>by {latest.user}</div>
        </div>

        {/* Backup size */}
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "20px 20px", borderTop: "3px solid #2563eb" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Backup Details</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700, color: "#2563eb", lineHeight: 1 }}>{latest.size}</div>
          <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
            {[["Files", latest.files], ["Modules", 11], ["Format", "AES-256"]].map(([k, v]) => (
              <div key={String(k)}>
                <div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 2 }}>{k}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>Storage used</div>
            <PBar value={62} />
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3, fontFamily: "var(--font-mono)" }}>62% · 14.8 MB of 24 MB</div>
          </div>
        </div>

        {/* Verification */}
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "20px 20px", borderTop: "3px solid #a78bfa" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>Verification Score</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ScoreRing score={97} />
            <div>
              {[["Files detected", "11"], ["Valid files", "10"], ["Warnings", "1"], ["Errors", "0"]].map(([k, v]) => (
                <div key={String(k)} style={{ display: "flex", justifyContent: "space-between", gap: 14, marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{k}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: v === "0" ? "#10b981" : v === "1" ? "#f59e0b" : "var(--text-primary)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }} className="bk-action-grid">
        {[
          { label: "Download Backup", icon: "⬇", color: "#10b981", desc: "Download encrypted .zip", action: () => {} },
          { label: "Verify Backup", icon: "◈", color: "#2563eb", desc: "Run integrity check", action: () => {} },
          { label: "Restore Data", icon: "↩", color: "#f59e0b", desc: "Upload & restore backup", action: () => onView("restore") },
          { label: "Upload to Drive", icon: driveConnected ? "✓" : "☁", color: driveConnected ? "#10b981" : "#4b5a72", desc: driveConnected ? "Connected to Google Drive" : "Connect Google Drive", action: () => setDriveConnected((d) => !d) },
        ].map((a) => (
          <button key={a.label} onClick={a.action} style={{ background: "var(--bg-elevated)", border: `1px solid ${a.color}30`, borderRadius: "var(--radius-md)", padding: "16px", textAlign: "left", cursor: "pointer", transition: "all 0.15s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${a.color}10`; e.currentTarget.style.borderColor = `${a.color}60` }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.borderColor = `${a.color}30` }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: a.color, marginBottom: 3 }}>{a.label}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{a.desc}</div>
          </button>
        ))}
      </div>

      {/* Recent backups preview */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>Recent Backups</div>
          <button onClick={() => onView("history")} style={{ fontSize: 11, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>View all →</button>
        </div>
        {BACKUP_HISTORY.slice(0, 5).map((b) => (
          <div key={b.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 1fr 1fr 1fr 1fr", gap: 8, padding: "11px 16px", borderBottom: "1px solid var(--border-subtle)", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-primary)" }}>{fmtDate(b.date)}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>{b.time}</div>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.user}</div>
            <div><span style={{ fontSize: 9, background: b.type === "auto" ? "rgba(37,99,235,0.15)" : "rgba(6,182,212,0.15)", color: b.type === "auto" ? "#2563eb" : "#06b6d4", padding: "2px 7px", borderRadius: 99, fontWeight: 700 }}>{b.type === "google-drive" ? "DRIVE" : b.type.toUpperCase()}</span></div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{b.size}</div>
            <StatusBadge status={b.status} small />
            <StatusBadge status={b.verifyStatus} small />
          </div>
        ))}
      </div>

      <style>{`
        @media(max-width:900px){.bk-stat-grid{grid-template-columns:1fr 1fr!important}.bk-action-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:600px){.bk-stat-grid{grid-template-columns:1fr!important}.bk-action-grid{grid-template-columns:1fr 1fr!important}}
      `}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   RESTORE WIZARD
═══════════════════════════════════════════════════════════ */
function RestoreWizard({ onView }: { onView: (v: BackupView) => void }) {
  const [step, setStep] = useState<RestoreStep>("upload")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [detecting, setDetecting] = useState(false)
  const [detected, setDetected] = useState<DetectedFile[]>([])
  const [validating, setValidating] = useState(false)
  const [validated, setValidated] = useState(false)
  const [crosschecking, setCrosschecking] = useState(false)
  const [crosschecked, setCrosschecked] = useState(false)
  const [compareFilter, setCompareFilter] = useState<RecordStatus | "all">("all")
  const [viewFile, setViewFile] = useState<DetectedFile | null>(null)
  const [selection, setSelection] = useState<RestoreSelection>({
    employees: true, attendance: true, billing: false,
    stock: true, purchase: false, production: false,
    machines: false, quality: false, expenses: false,
  })
  const [showConfirm, setShowConfirm] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [restored, setRestored] = useState(false)

  const si = stepIndex(step)

  // Simulate file detection
  const handleDetect = () => {
    setDetecting(true)
    setTimeout(() => {
      setDetected(MOCK_DETECTED.slice(0, uploadedFiles.length + 3))
      setDetecting(false)
      setStep("identify")
    }, 1800)
  }

  // Simulate validation
  const handleValidate = () => {
    setValidating(true)
    setTimeout(() => { setValidated(true); setValidating(false); setStep("validate") }, 1600)
  }

  // Simulate cross-check
  const handleCrosscheck = () => {
    setCrosschecking(true)
    setTimeout(() => { setCrosschecked(true); setCrosschecking(false); setStep("crosscheck") }, 2200)
  }

  const validFiles  = detected.filter((f) => f.status === "valid").length
  const warnFiles   = detected.filter((f) => f.status === "warning").length
  const errorFiles  = detected.filter((f) => f.status === "error").length
  const totalRows   = detected.reduce((a, f) => a + f.rows, 0)
  const verifyScore = Math.round(Math.max(0, 100 - (errorFiles * 18) - (warnFiles * 4)))

  const filteredComparison = compareFilter === "all"
    ? COMPARISON_RECORDS
    : COMPARISON_RECORDS.filter((r) => r.status === compareFilter)

  const statusCounts = (Object.keys(RECORD_STATUS_META) as RecordStatus[]).reduce((acc, s) => {
    acc[s] = COMPARISON_RECORDS.filter((r) => r.status === s).length
    return acc
  }, {} as Record<RecordStatus, number>)

  if (restored) {
    return <RestoreResult selection={selection} onDone={() => onView("dashboard")} />
  }

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      {showConfirm && (
        <ConfirmDialog
          selection={selection}
          onConfirm={() => { setShowConfirm(false); setRestoring(true); setRestored(true) }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => onView("dashboard")} style={{ background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "6px 12px", color: "var(--text-secondary)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)" }}>← Dashboard</button>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.01em" }}>Restore Wizard</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Upload, verify and selectively restore backup data</div>
        </div>
      </div>

      <Stepper current={step} />

      {/* ── STEP: Upload ── */}
      {step === "upload" && (
        <div style={{ maxWidth: 700 }}>
          <DropZone files={uploadedFiles} onFiles={setUploadedFiles} />
          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {uploadedFiles.map((f, i) => (
                <FilePill key={i} file={f} onRemove={() => setUploadedFiles((prev) => prev.filter((_, j) => j !== i))} />
              ))}
              <div style={{ marginTop: 8 }}>
                <button onClick={handleDetect} disabled={detecting} style={{ padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 600, cursor: detecting ? "not-allowed" : "pointer", fontFamily: "var(--font-body)", opacity: detecting ? 0.7 : 1 }}>
                  {detecting ? "Identifying files…" : `Identify ${uploadedFiles.length} file${uploadedFiles.length > 1 ? "s" : ""} →`}
                </button>
              </div>
            </div>
          )}
          {uploadedFiles.length === 0 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <button onClick={() => { setUploadedFiles([{ name: "ACME_Backup_Aug19_2026.zip", size: 14800000 } as File]); }} style={{ fontSize: 11, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                Or use demo backup file →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── STEP: Identify ── */}
      {step === "identify" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }} className="bk-ident-grid">
            {[
              { label: "Files Detected", value: detected.length, color: "#2563eb" },
              { label: "Valid", value: validFiles, color: "#10b981" },
              { label: "Warnings", value: warnFiles, color: "#f59e0b" },
              { label: "Errors", value: errorFiles, color: "#ef4444" },
            ].map((k) => (
              <div key={k.label} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "14px 16px", borderTop: `3px solid ${k.color}` }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{k.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 20 }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>Detected Files</div>
            {detected.map((f) => {
              const catMeta = FILE_CATEGORY_META[f.category]
              return (
                <div key={f.id} style={{ display: "grid", alignItems: "center", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{fmtBytes(f.size)} · {f.rows > 0 ? `${f.rows} rows` : "No rows"}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: catMeta.color }}>{catMeta.icon}</span>
                    <span style={{ fontSize: 12, color: catMeta.color, fontWeight: 600 }}>{catMeta.label}</span>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{f.confidence}% match</span>
                    </div>
                    <PBar value={f.confidence} color={catMeta.color} />
                  </div>
                  <StatusBadge status={f.status as "success"} small />
                  <button onClick={() => setViewFile(viewFile?.id === f.id ? null : f)} style={{ fontSize: 11, color: "var(--primary)", background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", padding: "3px 8px", cursor: "pointer", fontFamily: "var(--font-body)", flexShrink: 0 }}>
                    {viewFile?.id === f.id ? "Close" : "Preview"}
                  </button>
                </div>
              )
            })}
          </div>

          {/* File preview */}
          {viewFile && viewFile.sampleData.length > 0 && (
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 20, animation: "fade-in 0.2s ease-out" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>
                Preview — {viewFile.name}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {viewFile.columns.map((c) => (
                        <th key={c} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)", whiteSpace: "nowrap" }}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {viewFile.sampleData.slice(0, 4).map((row, ri) => (
                      <tr key={ri}>
                        {viewFile.columns.map((c) => (
                          <td key={c} style={{ padding: "8px 12px", fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--border-subtle)", whiteSpace: "nowrap" }}>{row[c] ?? "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "8px 12px", fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Showing {Math.min(4, viewFile.sampleData.length)} of {viewFile.rows} rows — read-only view</div>
              </div>
            </div>
          )}

          {/* Warnings/errors summary */}
          {(warnFiles > 0 || errorFiles > 0) && (
            <div style={{ marginBottom: 16 }}>
              {detected.filter((f) => f.warnings.length > 0 || f.errors.length > 0).map((f) => (
                <div key={f.id} style={{ marginBottom: 8 }}>
                  {f.warnings.map((w, i) => (
                    <div key={i} style={{ background: "var(--warning-bg)", border: "1px solid var(--warning-border)", borderRadius: "var(--radius-sm)", padding: "8px 12px", fontSize: 11, color: "#f59e0b", display: "flex", gap: 6 }}>
                      <span>⚠</span> <strong>{f.name}</strong>: {w}
                    </div>
                  ))}
                  {f.errors.map((e, i) => (
                    <div key={i} style={{ background: "var(--error-bg)", border: "1px solid var(--error-border)", borderRadius: "var(--radius-sm)", padding: "8px 12px", fontSize: 11, color: "#ef4444", display: "flex", gap: 6 }}>
                      <span>✕</span> <strong>{f.name}</strong>: {e}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <button onClick={() => { setStep("validate"); handleValidate() }} style={{ padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Validate Data →
          </button>
          <style>{`@media(max-width:800px){.bk-ident-grid{grid-template-columns:1fr 1fr!important}}`}</style>
        </div>
      )}

      {/* ── STEP: Validate ── */}
      {step === "validate" && (
        <div>
          {validating ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <ShieldIcon size={52} color="#2563eb" pulse />
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginTop: 16 }}>Validating data integrity…</div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 24 }}>
                <ScoreRing score={verifyScore} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Validation Complete</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                      { label: "Files Detected",  value: detected.length,  color: "#2563eb" },
                      { label: "Valid Files",      value: validFiles,       color: "#10b981" },
                      { label: "Warnings",         value: warnFiles,        color: "#f59e0b" },
                      { label: "Errors",           value: errorFiles,       color: "#ef4444" },
                      { label: "Total Rows",       value: totalRows.toLocaleString(), color: "#06b6d4" },
                      { label: "Duplicates Found", value: 1,                color: "#a78bfa" },
                      { label: "Missing Records",  value: 1,                color: "#ef4444" },
                      { label: "Mismatches",       value: 3,                color: "#f59e0b" },
                    ].map((k) => (
                      <div key={k.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 10px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)" }}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{k.label}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: k.color }}>{k.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => { handleCrosscheck(); setStep("crosscheck") }} style={{ padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                Cross-check Records →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── STEP: Cross-check ── */}
      {step === "crosscheck" && (
        <div>
          {crosschecking ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <ShieldIcon size={52} color="#06b6d4" pulse />
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginTop: 16 }}>Cross-checking against live database…</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Comparing {totalRows.toLocaleString()} records across {detected.length} modules</div>
            </div>
          ) : (
            <div>
              <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "16px 18px", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  {(Object.entries(statusCounts) as [RecordStatus, number][]).map(([s, count]) => {
                    const sm = RECORD_STATUS_META[s]
                    return (
                      <div key={s} style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: sm.color }}>{count}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{sm.label}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <button onClick={() => setStep("compare")} style={{ padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                View Comparison →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── STEP: Compare ── */}
      {step === "compare" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {(["all", ...Object.keys(RECORD_STATUS_META)] as (RecordStatus | "all")[]).map((s) => {
              const sm = s === "all" ? null : RECORD_STATUS_META[s as RecordStatus]
              const count = s === "all" ? COMPARISON_RECORDS.length : statusCounts[s as RecordStatus]
              return (
                <button key={s} onClick={() => setCompareFilter(s)} style={{ padding: "5px 12px", fontSize: 12, borderRadius: 99, border: `1px solid ${compareFilter === s ? (sm?.color ?? "var(--primary)") : "var(--border-default)"}`, background: compareFilter === s ? `${sm?.color ?? "var(--primary)"}15` : "none", color: compareFilter === s ? (sm?.color ?? "var(--primary)") : "var(--text-muted)", cursor: "pointer", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 6 }}>
                  {s === "all" ? "All" : RECORD_STATUS_META[s as RecordStatus].label}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700 }}>{count}</span>
                </button>
              )
            })}
          </div>

          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 20 }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    {["Field / Record", "Database", "Master Excel", "Uploaded", "Status"].map((h) => (
                      <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredComparison.map((r) => {
                    const sm = RECORD_STATUS_META[r.status]
                    return (
                      <tr key={r.id} style={{ borderBottom: "1px solid var(--border-subtle)", background: r.status !== "match" ? `${sm.color}06` : undefined }}>
                        <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" }}>{r.field}</td>
                        <td style={{ padding: "10px 14px", fontSize: 11, color: r.status === "missing" ? "var(--text-disabled)" : "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{r.dbValue}</td>
                        <td style={{ padding: "10px 14px", fontSize: 11, color: r.status === "missing" ? "var(--text-disabled)" : "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{r.masterValue}</td>
                        <td style={{ padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: r.status !== "match" ? 600 : 400, color: r.status === "match" ? "var(--text-secondary)" : sm.color }}>{r.uploadedValue}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: sm.color, background: sm.bg, padding: "2px 8px", borderRadius: 99, letterSpacing: "0.04em" }}>{sm.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "9px 14px", borderTop: "1px solid var(--border-subtle)", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Showing {filteredComparison.length} of {COMPARISON_RECORDS.length} records
            </div>
          </div>

          <button onClick={() => setStep("review")} style={{ padding: "10px 24px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Proceed to Review →
          </button>
        </div>
      )}

      {/* ── STEP: Review ── */}
      {step === "review" && (
        <div>
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 20 }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>Select Modules to Restore</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Only checked modules will be overwritten. Unchecked modules remain unchanged.</div>
            </div>
            {(Object.entries(selection) as [keyof RestoreSelection, boolean][]).map(([key, checked]) => {
              const fileForModule = detected.find((f) => f.category === key)
              return (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", transition: "background 0.1s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-raised)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <input type="checkbox" checked={checked} onChange={(e) => setSelection((s) => ({ ...s, [key]: e.target.checked }))} style={{ width: 16, height: 16, accentColor: "var(--primary)", cursor: "pointer", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: checked ? "var(--text-primary)" : "var(--text-muted)", textTransform: "capitalize" }}>{key}</div>
                    {fileForModule && (
                      <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                        {fileForModule.name} · {fileForModule.rows.toLocaleString()} rows
                      </div>
                    )}
                  </div>
                  {fileForModule && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <StatusBadge status={fileForModule.status as "success"} small />
                    </div>
                  )}
                  {!fileForModule && (
                    <span style={{ fontSize: 10, color: "var(--text-muted)", fontStyle: "italic" }}>No file uploaded</span>
                  )}
                </label>
              )
            })}
          </div>

          {/* Summary */}
          {Object.values(selection).some(Boolean) && (
            <div style={{ background: "var(--info-bg)", border: "1px solid var(--info-border)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 20, fontSize: 12, color: "var(--info)" }}>
              ℹ {Object.values(selection).filter(Boolean).length} module(s) selected for restoration.
              A pre-restore backup will be created automatically before proceeding.
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep("compare")} style={{ padding: "10px 20px", background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
              ← Back
            </button>
            <button
              disabled={!Object.values(selection).some(Boolean)}
              onClick={() => setShowConfirm(true)}
              style={{ padding: "10px 24px", background: Object.values(selection).some(Boolean) ? "#ef4444" : "var(--bg-raised)", color: Object.values(selection).some(Boolean) ? "#fff" : "var(--text-muted)", border: "none", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 700, cursor: Object.values(selection).some(Boolean) ? "pointer" : "not-allowed", fontFamily: "var(--font-body)" }}>
              Restore Selected Modules →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   BACKUP HISTORY
═══════════════════════════════════════════════════════════ */
function BackupHistory({ onView }: { onView: (v: BackupView) => void }) {
  const [filter, setFilter] = useState<BackupStatus | "all">("all")
  const filtered = filter === "all" ? BACKUP_HISTORY : BACKUP_HISTORY.filter((b) => b.status === filter)

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => onView("dashboard")} style={{ background: "none", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", padding: "6px 12px", color: "var(--text-secondary)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)" }}>← Dashboard</button>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.01em" }}>Backup History</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Full audit trail of all backup and restore operations</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }} className="bk-hist-grid">
        {[
          { label: "Total Backups", value: BACKUP_HISTORY.length, color: "#2563eb" },
          { label: "Successful", value: BACKUP_HISTORY.filter((b) => b.status === "success").length, color: "#10b981" },
          { label: "Failed", value: BACKUP_HISTORY.filter((b) => b.status === "failed").length, color: "#ef4444" },
          { label: "Restores", value: BACKUP_HISTORY.filter((b) => b.restoreStatus !== "none").length, color: "#f59e0b" },
        ].map((k) => (
          <div key={k.label} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "14px 16px", borderTop: `3px solid ${k.color}` }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {(["all","success","failed"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "5px 14px", fontSize: 12, borderRadius: 99, border: `1px solid ${filter === s ? "var(--primary)" : "var(--border-default)"}`, background: filter === s ? "var(--primary-subtle)" : "none", color: filter === s ? "var(--primary)" : "var(--text-muted)", cursor: "pointer", fontFamily: "var(--font-body)" }}>
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Date & Time", "User", "Type", "Size", "Files", "Status", "Verification", "Restore", "Notes"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid var(--border-subtle)", opacity: b.status === "failed" ? 0.8 : 1 }}>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-primary)" }}>{fmtDate(b.date)}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>{b.time}</div>
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 11, color: "var(--text-secondary)" }}>{b.user}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ fontSize: 9, background: b.type === "auto" ? "rgba(37,99,235,0.15)" : b.type === "google-drive" ? "rgba(16,185,129,0.15)" : "rgba(6,182,212,0.15)", color: b.type === "auto" ? "#2563eb" : b.type === "google-drive" ? "#10b981" : "#06b6d4", padding: "2px 7px", borderRadius: 99, fontWeight: 700 }}>
                      {b.type === "google-drive" ? "G·DRIVE" : b.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "11px 14px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{b.size}</td>
                  <td style={{ padding: "11px 14px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{b.files}</td>
                  <td style={{ padding: "11px 14px" }}><StatusBadge status={b.status} small /></td>
                  <td style={{ padding: "11px 14px" }}><StatusBadge status={b.verifyStatus} small /></td>
                  <td style={{ padding: "11px 14px" }}><StatusBadge status={b.restoreStatus} small /></td>
                  <td style={{ padding: "11px 14px", fontSize: 11, color: "var(--text-muted)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "9px 14px", borderTop: "1px solid var(--border-subtle)", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          {filtered.length} records shown
        </div>
      </div>
      <style>{`@media(max-width:900px){.bk-hist-grid{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
interface Props {
  onNavigate?: (id: string) => void
}

export function BackupModule({ onNavigate }: Props) {
  const [view, setView] = useState<BackupView>("dashboard")

  return (
    <div>
      {view === "dashboard" && <BackupDashboard onView={setView} />}
      {view === "restore"   && <RestoreWizard  onView={setView} />}
      {view === "history"   && <BackupHistory  onView={setView} />}

      <style>{`
        @keyframes shield-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.06); opacity: 0.85; }
        }
        @keyframes shield-trace {
          0%   { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -128; }
        }
        @keyframes dataflow-line {
          0%   { opacity: 0; transform: translateX(0); }
          30%  { opacity: 0.6; }
          70%  { opacity: 0.4; }
          100% { opacity: 0; transform: translateX(20px); }
        }
      `}</style>
    </div>
  )
}
