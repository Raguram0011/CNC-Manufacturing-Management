import React, { useState, useEffect, useCallback } from "react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { PageHeader } from "../shell/PageHeader"
import { PlusIcon, SearchIcon, XIcon, CheckIcon } from "../shell/Icons"

/* ─── Icons ──────────────────────────────────────────────── */
const PrintIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
)
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)
const TrendUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)
const TrendDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
    <polyline points="17 18 23 18 23 12"/>
  </svg>
)
const ReceiptIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/>
    <line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/>
    <line x1="8" y1="15" x2="12" y2="15"/>
  </svg>
)
const WalletIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
    <circle cx="17" cy="12" r="1"/>
  </svg>
)

/* ─── Types ───────────────────────────────────────────────── */
export type AccountsView = "dashboard" | "invoices" | "create" | "detail" | "payments" | "expenses" | "reports"
type PayStatus = "paid" | "partial" | "pending" | "outstanding" | "draft"
type ExpCategory = "raw_materials" | "utilities" | "salaries" | "maintenance" | "transport" | "office" | "it" | "other"
type PayMethod = "bank_transfer" | "upi" | "cheque" | "cash" | "neft" | "rtgs"

interface InvoiceItem {
  id: string
  description: string
  hsnCode: string
  qty: number
  unit: string
  rate: number
  discountPct: number
}

interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  clientName: string
  clientAddress: string
  clientGST: string
  poNumber: string
  placeOfSupply: string
  taxType: "igst" | "cgst_sgst"
  items: InvoiceItem[]
  notes: string
  paymentTerms: string
  subtotal: number
  taxAmount: number
  total: number
  paid: number
  balance: number
  status: PayStatus
}

interface Payment {
  id: string
  invoiceId: string
  invoiceNumber: string
  clientName: string
  amount: number
  date: string
  method: PayMethod
  reference: string
  notes: string
}

interface Expense {
  id: string
  category: ExpCategory
  amount: number
  date: string
  description: string
  paymentMethod: PayMethod
  vendor: string
  status: "approved" | "pending" | "rejected"
}

/* ─── Sample data ─────────────────────────────────────────── */
const CLIENTS = [
  { name: "TechMetal Industries Pvt. Ltd.", address: "Plot 14, MIDC Industrial Area, Pune - 411019, Maharashtra", gst: "27AABCT1332L1Z5" },
  { name: "Precision Auto Parts Ltd.", address: "NH-8, Industrial Zone, Gurugram - 122001, Haryana", gst: "06AABCP2241M1Z9" },
  { name: "Aerospace Components Co.", address: "Aerospace SEZ, Bengaluru - 560017, Karnataka", gst: "29AABCA3312N1Z7" },
  { name: "Hydraulics & Pneumatics Pvt. Ltd.", address: "GIDC Estate, Ahmedabad - 380025, Gujarat", gst: "24AABHP1221K1Z3" },
  { name: "Industrial Tools Corp.", address: "Sector 58, Faridabad - 121004, Haryana", gst: "06AABCI4412L1Z1" },
  { name: "Micro Industries Pvt. Ltd.", address: "Phase II, Peenya Industrial Area, Bengaluru - 560058, Karnataka", gst: "29AABCM5512P1Z2" },
]

const INV_SETS: InvoiceItem[][] = [
  [
    { id: "a", description: "CNC Turned Shaft - SS316 Ø50mm", hsnCode: "8466", qty: 120, unit: "pcs", rate: 185, discountPct: 0 },
    { id: "b", description: "Precision Milled Housing - Al6061-T6", hsnCode: "8466", qty: 60, unit: "pcs", rate: 420, discountPct: 5 },
  ],
  [
    { id: "a", description: "Carbide End Mill Ø10mm - 4 Flute Coated", hsnCode: "8207", qty: 200, unit: "pcs", rate: 850, discountPct: 0 },
    { id: "b", description: "Carbide Drill Ø6mm TiN Coated", hsnCode: "8207", qty: 300, unit: "pcs", rate: 320, discountPct: 0 },
    { id: "c", description: "Boring Bar Insert CNMG120408-MR", hsnCode: "8207", qty: 150, unit: "pcs", rate: 680, discountPct: 10 },
  ],
  [
    { id: "a", description: "Hydraulic Valve Body CNC Machined EN8", hsnCode: "8481", qty: 45, unit: "pcs", rate: 2200, discountPct: 0 },
    { id: "b", description: "Cylinder End Cap Ø80mm - SS304", hsnCode: "8412", qty: 90, unit: "pcs", rate: 780, discountPct: 0 },
  ],
  [
    { id: "a", description: "Aerospace Bracket - Ti6Al4V Grade 5", hsnCode: "8803", qty: 25, unit: "pcs", rate: 4800, discountPct: 0 },
    { id: "b", description: "Titanium Fastener Assembly M8x30", hsnCode: "7318", qty: 500, unit: "pcs", rate: 285, discountPct: 5 },
  ],
  [
    { id: "a", description: "Gear Blank EN36 Steel Ø200mm", hsnCode: "8483", qty: 30, unit: "pcs", rate: 1650, discountPct: 0 },
    { id: "b", description: "Spline Shaft 4140 Steel L=600mm", hsnCode: "8483", qty: 20, unit: "pcs", rate: 2800, discountPct: 0 },
  ],
  [
    { id: "a", description: "CNC Milled Bracket - MS Powder Coat", hsnCode: "8302", qty: 200, unit: "pcs", rate: 145, discountPct: 0 },
    { id: "b", description: "Precision Bush - Bronze SAE660", hsnCode: "8484", qty: 400, unit: "pcs", rate: 65, discountPct: 0 },
  ],
]

function calcTotals(items: InvoiceItem[]) {
  const subtotal = Math.round(items.reduce((s, it) => s + it.qty * it.rate * (1 - it.discountPct / 100), 0))
  const taxAmount = Math.round(subtotal * 0.18)
  return { subtotal, taxAmount, total: subtotal + taxAmount }
}

const RAW: Array<{ id: string; number: string; date: string; due: string; ci: number; taxType: "igst" | "cgst_sgst"; po: string; paid: number; status: PayStatus }> = [
  { id: "inv1", number: "INV-2024-0183", date: "2024-08-01", due: "2024-08-31", ci: 0, taxType: "cgst_sgst", po: "PO-TM-2024-441", paid: 84200,  status: "paid" },
  { id: "inv2", number: "INV-2024-0184", date: "2024-08-05", due: "2024-09-04", ci: 1, taxType: "igst",       po: "PO-PA-2024-188", paid: 0,      status: "outstanding" },
  { id: "inv3", number: "INV-2024-0185", date: "2024-08-08", due: "2024-09-07", ci: 2, taxType: "cgst_sgst", po: "PO-AC-2024-092", paid: 85000,  status: "partial" },
  { id: "inv4", number: "INV-2024-0186", date: "2024-08-10", due: "2024-09-09", ci: 3, taxType: "igst",       po: "PO-HP-2024-310", paid: 0,      status: "pending" },
  { id: "inv5", number: "INV-2024-0187", date: "2024-08-12", due: "2024-09-11", ci: 4, taxType: "cgst_sgst", po: "PO-IT-2024-055", paid: 0,      status: "pending" },
  { id: "inv6", number: "INV-2024-0180", date: "2024-07-20", due: "2024-08-19", ci: 0, taxType: "cgst_sgst", po: "PO-TM-2024-398", paid: 118530, status: "paid" },
  { id: "inv7", number: "INV-2024-0179", date: "2024-07-15", due: "2024-08-14", ci: 5, taxType: "igst",       po: "PO-MI-2024-221", paid: 42130,  status: "partial" },
]

const INVOICES: Invoice[] = RAW.map((r, i) => {
  const items = INV_SETS[i % INV_SETS.length]
  const { subtotal, taxAmount, total } = calcTotals(items)
  const client = CLIENTS[r.ci] ?? CLIENTS[0]
  return {
    id: r.id, number: r.number, date: r.date, dueDate: r.due,
    clientName: client.name,
    clientAddress: client.address,
    clientGST: client.gst,
    poNumber: r.po,
    placeOfSupply: r.taxType === "igst" ? "Inter-State" : "Maharashtra",
    taxType: r.taxType, items,
    notes: "Payment within 30 days. Overdue payments attract 2% interest per month.",
    paymentTerms: "Net 30",
    subtotal, taxAmount, total,
    paid: r.paid, balance: total - r.paid,
    status: r.status,
  }
})

const PAYMENTS: Payment[] = [
  { id: "p1", invoiceId: "inv1", invoiceNumber: "INV-2024-0183", clientName: "TechMetal Industries Pvt. Ltd.", amount: 84200,  date: "2024-08-28", method: "neft",         reference: "NEFT240828001234", notes: "Full payment received" },
  { id: "p2", invoiceId: "inv3", invoiceNumber: "INV-2024-0185", clientName: "Aerospace Components Co.",        amount: 85000,  date: "2024-08-15", method: "bank_transfer", reference: "IMPS240815009876", notes: "Partial advance payment" },
  { id: "p3", invoiceId: "inv6", invoiceNumber: "INV-2024-0180", clientName: "TechMetal Industries Pvt. Ltd.", amount: 118530, date: "2024-08-18", method: "rtgs",          reference: "RTGS240818445521", notes: "Full settlement" },
  { id: "p4", invoiceId: "inv7", invoiceNumber: "INV-2024-0179", clientName: "Industrial Tools Corp.",          amount: 42130,  date: "2024-08-10", method: "cheque",        reference: "CHQ-448821",        notes: "Cheque No. 448821 - SBI" },
]

const EXPENSES: Expense[] = [
  { id: "e1",  category: "raw_materials", amount: 185000, date: "2024-08-01", description: "AL6061-T6 Aluminium Plates 200kg",            paymentMethod: "bank_transfer", vendor: "Hindalco Industries",      status: "approved" },
  { id: "e2",  category: "utilities",     amount: 42500,  date: "2024-08-03", description: "Electricity bill - August 2024",              paymentMethod: "neft",          vendor: "MSEDCL",                   status: "approved" },
  { id: "e3",  category: "maintenance",   amount: 28000,  date: "2024-08-05", description: "CNC-003 Spindle bearing replacement",         paymentMethod: "cash",          vendor: "SKF Bearings India",       status: "approved" },
  { id: "e4",  category: "transport",     amount: 12800,  date: "2024-08-07", description: "Material freight - Pune to Nashik",           paymentMethod: "upi",           vendor: "VRL Logistics",            status: "approved" },
  { id: "e5",  category: "it",            amount: 18500,  date: "2024-08-10", description: "CAD/CAM software annual license renewal",     paymentMethod: "bank_transfer", vendor: "Mastercam India",          status: "pending" },
  { id: "e6",  category: "office",        amount: 6200,   date: "2024-08-12", description: "Stationery, printing and office supplies",    paymentMethod: "cash",          vendor: "National Book Depot",      status: "approved" },
  { id: "e7",  category: "raw_materials", amount: 220000, date: "2024-08-14", description: "EN36 Alloy Steel Round Bars 500kg",           paymentMethod: "rtgs",          vendor: "Jindal Steels & Power",    status: "approved" },
  { id: "e8",  category: "maintenance",   amount: 15000,  date: "2024-08-16", description: "Coolant system flush and refill CNC-001/002", paymentMethod: "cash",          vendor: "Castrol India",            status: "approved" },
  { id: "e9",  category: "transport",     amount: 9400,   date: "2024-08-18", description: "Customer delivery - Gurugram consignment",    paymentMethod: "upi",           vendor: "Blue Dart Logistics",      status: "pending" },
  { id: "e10", category: "utilities",     amount: 8800,   date: "2024-08-20", description: "Compressed air system maintenance",           paymentMethod: "cheque",        vendor: "Atlas Copco India",        status: "approved" },
]

const BILLING_TREND = [
  { month: "Sep", billed: 520000, collected: 480000 },
  { month: "Oct", billed: 680000, collected: 620000 },
  { month: "Nov", billed: 590000, collected: 545000 },
  { month: "Dec", billed: 720000, collected: 680000 },
  { month: "Jan", billed: 650000, collected: 590000 },
  { month: "Feb", billed: 780000, collected: 720000 },
  { month: "Mar", billed: 920000, collected: 870000 },
  { month: "Apr", billed: 840000, collected: 800000 },
  { month: "May", billed: 760000, collected: 695000 },
  { month: "Jun", billed: 880000, collected: 820000 },
  { month: "Jul", billed: 950000, collected: 890000 },
  { month: "Aug", billed: 1040000, collected: 710000 },
]

const EXPENSE_TREND = [
  { month: "Sep", expenses: 320000 },
  { month: "Oct", expenses: 380000 },
  { month: "Nov", expenses: 295000 },
  { month: "Dec", expenses: 410000 },
  { month: "Jan", expenses: 350000 },
  { month: "Feb", expenses: 425000 },
  { month: "Mar", expenses: 490000 },
  { month: "Apr", expenses: 415000 },
  { month: "May", expenses: 360000 },
  { month: "Jun", expenses: 445000 },
  { month: "Jul", expenses: 510000 },
  { month: "Aug", expenses: 546200 },
]

const EXP_BY_CAT = [
  { name: "Raw Materials", amount: 405000, color: "#2563eb" },
  { name: "Utilities",     amount: 51300,  color: "#06b6d4" },
  { name: "Maintenance",   amount: 43000,  color: "#f59e0b" },
  { name: "Transport",     amount: 22200,  color: "#a78bfa" },
  { name: "IT / Software", amount: 18500,  color: "#10b981" },
  { name: "Office",        amount: 6200,   color: "#64748b" },
]

/* ─── Utility ─────────────────────────────────────────────── */
function fCur(n: number, compact = false): string {
  if (compact) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`
    if (n >= 100000)   return `₹${(n / 100000).toFixed(2)}L`
    if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`
    return `₹${n}`
  }
  return `₹${n.toLocaleString("en-IN")}`
}

function fDate(d: string): string {
  const dt = new Date(d)
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

function amountInWords(n: number): string {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"]
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
  function convert(x: number): string {
    if (x === 0) return ""
    if (x < 20) return ones[x] + " "
    if (x < 100) return tens[Math.floor(x / 10)] + " " + convert(x % 10)
    return ones[Math.floor(x / 100)] + " Hundred " + convert(x % 100)
  }
  function inWords(x: number): string {
    if (x === 0) return "Zero"
    let res = ""
    if (x >= 10000000) { res += convert(Math.floor(x / 10000000)) + "Crore "; x %= 10000000 }
    if (x >= 100000)   { res += convert(Math.floor(x / 100000)) + "Lakh "; x %= 100000 }
    if (x >= 1000)     { res += convert(Math.floor(x / 1000)) + "Thousand "; x %= 1000 }
    return (res + convert(x)).trim()
  }
  const rupees = Math.floor(n)
  const paise  = Math.round((n - rupees) * 100)
  let out = "Rupees " + inWords(rupees)
  if (paise > 0) out += " and " + inWords(paise) + " Paise"
  return out + " Only"
}

const STATUS_CFG: Record<PayStatus, { label: string; color: string; bg: string; border: string }> = {
  paid:        { label: "Paid",        color: "#10b981", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.25)" },
  partial:     { label: "Partial",     color: "#f59e0b", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.25)" },
  pending:     { label: "Pending",     color: "#3b82f6", bg: "rgba(59,130,246,0.10)", border: "rgba(59,130,246,0.25)" },
  outstanding: { label: "Outstanding", color: "#ef4444", bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.25)" },
  draft:       { label: "Draft",       color: "#94a3b8", bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.25)" },
}

const CAT_LABELS: Record<ExpCategory, string> = {
  raw_materials: "Raw Materials", utilities: "Utilities", salaries: "Salaries",
  maintenance: "Maintenance", transport: "Transport", office: "Office Supplies",
  it: "IT / Software", other: "Other",
}
const PAY_METHOD_LABELS: Record<PayMethod, string> = {
  bank_transfer: "Bank Transfer", upi: "UPI", cheque: "Cheque",
  cash: "Cash", neft: "NEFT", rtgs: "RTGS",
}

/* ─── Hooks ───────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1200, deps: unknown[] = []) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) }
      else setVal(start)
    }, 16)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, ...deps])
  return val
}

/* ─── Shared mini-components ──────────────────────────────── */
function PayBadge({ status }: { status: PayStatus }) {
  const c = STATUS_CFG[status]
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px",
      borderRadius: 3, background: c.bg, border: `1px solid ${c.border}`,
      fontSize: 11, fontWeight: 600, color: c.color, fontFamily: "var(--font-body)",
      letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.color, display: "inline-block" }} />
      {c.label}
    </span>
  )
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th style={{ padding: "10px 14px", textAlign: right ? "right" : "left", fontSize: 11,
      fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em",
      fontFamily: "var(--font-body)", borderBottom: "1px solid var(--border-subtle)",
      whiteSpace: "nowrap" }}>
      {children}
    </th>
  )
}

function Td({ children, right, mono }: { children: React.ReactNode; right?: boolean; mono?: boolean }) {
  return (
    <td style={{ padding: "11px 14px", textAlign: right ? "right" : "left", fontSize: 13,
      color: "var(--text-secondary)", fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
      borderBottom: "1px solid var(--border-subtle)", verticalAlign: "middle" }}>
      {children}
    </td>
  )
}

function Field({ label, children, error, required }: { label: string; children: React.ReactNode; error?: string; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
        {label}{required && <span style={{ color: "var(--error)", marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: "var(--error)", fontFamily: "var(--font-body)" }}>{error}</span>}
    </div>
  )
}

const inputSx: React.CSSProperties = {
  width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)",
  background: "var(--bg-raised)", border: "1px solid var(--border-default)",
  color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-body)",
  outline: "none", boxSizing: "border-box",
}

function Input({ value, onChange, type = "text", placeholder, readOnly, error }: {
  value: string | number; onChange?: (v: string) => void; type?: string;
  placeholder?: string; readOnly?: boolean; error?: boolean
}) {
  return (
    <input type={type} value={value} readOnly={readOnly}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      style={{ ...inputSx, ...(readOnly ? { background: "var(--bg-elevated)", color: "var(--text-muted)" } : {}),
        ...(error ? { borderColor: "var(--error)" } : {}) }} />
  )
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inputSx, cursor: "pointer" }}>
      {children}
    </select>
  )
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
        <SearchIcon />
      </span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? "Search..."}
        style={{ ...inputSx, paddingLeft: 34, width: 260 }} />
    </div>
  )
}

function ActionBtn({ children, onClick, variant = "ghost", color }: { children: React.ReactNode; onClick?: () => void; variant?: "ghost" | "primary" | "danger"; color?: string }) {
  const styles: Record<string, React.CSSProperties> = {
    ghost:   { background: "var(--bg-elevated)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" },
    primary: { background: "var(--primary)", border: "none", color: "#fff", boxShadow: "0 1px 4px rgba(37,99,235,0.35)" },
    danger:  { background: "var(--error-bg)", border: "1px solid var(--error-border)", color: "var(--error)" },
  }
  return (
    <button onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px",
        borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 500,
        fontFamily: "var(--font-body)", cursor: "pointer", whiteSpace: "nowrap",
        transition: "all 0.12s ease", ...(color ? { background: "none", border: `1px solid ${color}20`, color } : styles[variant]) }}>
      {children}
    </button>
  )
}

/* ─── KPI Card ────────────────────────────────────────────── */
function KpiCard({ label, value, sub, trend, trendPositive, icon, accent }:
  { label: string; value: string; sub?: string; trend?: string; trendPositive?: boolean; icon: React.ReactNode; accent: string }) {
  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)", padding: "20px 22px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accent }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.07em",
          fontFamily: "var(--font-body)", textTransform: "uppercase" }}>{label}</span>
        <span style={{ color: accent, opacity: 0.7 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28,
        color: "var(--text-primary)", lineHeight: 1, marginBottom: 8 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{sub}</div>}
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8,
          fontSize: 11, color: trendPositive ? "var(--success)" : "var(--error)", fontWeight: 500 }}>
          {trendPositive ? <TrendUpIcon /> : <TrendDownIcon />}
          {trend} vs last month
        </div>
      )}
    </div>
  )
}

/* ─── Tooltip ─────────────────────────────────────────────── */
function ChartTip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)", padding: "10px 14px", fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{label}</div>
      {payload.filter(Boolean).map((p, i) => (
        <div key={i} style={{ fontSize: 12, color: p.color, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name ?? ""}:</span>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{fCur(p.value ?? 0, true)}</span>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   ACCOUNTS DASHBOARD
══════════════════════════════════════════════════════════ */
function AccountsDashboard({ onNavigate }: { onNavigate: (v: AccountsView, id?: string) => void }) {
  const totalBilled   = INVOICES.reduce((s, i) => s + i.total, 0)
  const totalPaid     = INVOICES.reduce((s, i) => s + i.paid, 0)
  const totalPending  = INVOICES.filter(i => i.status === "pending").reduce((s, i) => s + i.balance, 0)
  const totalOut      = INVOICES.filter(i => i.status === "outstanding").reduce((s, i) => s + i.balance, 0)
  const totalExpenses = EXPENSES.reduce((s, e) => s + e.amount, 0)
  const monthBilled   = INVOICES.filter(i => i.date.startsWith("2024-08")).reduce((s, i) => s + i.total, 0)
  const todayBilled   = INVOICES.filter(i => i.date === "2024-08-12").reduce((s, i) => s + i.total, 0)

  const cBilled   = useCountUp(monthBilled)
  const cToday    = useCountUp(todayBilled)
  const cPaid     = useCountUp(totalPaid)
  const cPending  = useCountUp(totalPending)
  const cOut      = useCountUp(totalOut)
  const cExpenses = useCountUp(totalExpenses)
  const cBilledY  = useCountUp(totalBilled)

  const recentInvoices = [...INVOICES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  return (
    <div>
      <PageHeader title="Accounts Overview" description="Financial summary, billing and payment status"
        badge={{ label: "LIVE", variant: "success" }}
        primaryAction={{ label: "New Invoice", onClick: () => onNavigate("create"), icon: <PlusIcon /> }}
        accentColor="#f59e0b" />

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        <KpiCard label="Today's Billing"  value={fCur(cToday)}   sub="2 invoices today"       trend="+12.4%"  trendPositive icon={<ReceiptIcon />} accent="#2563eb" />
        <KpiCard label="Monthly Billing"  value={fCur(cBilled)}  sub="August 2024"            trend="+9.5%"   trendPositive icon={<ReceiptIcon />} accent="#06b6d4" />
        <KpiCard label="Total Collected"  value={fCur(cPaid)}    sub="Across all invoices"    trend="+7.2%"   trendPositive icon={<WalletIcon />}  accent="#10b981" />
        <KpiCard label="Pending"          value={fCur(cPending)} sub="3 invoices awaiting"    trend="-3.1%"   trendPositive={false} icon={<ReceiptIcon />} accent="#3b82f6" />
        <KpiCard label="Outstanding"      value={fCur(cOut)}     sub="1 overdue invoice"      trend="+28%"    trendPositive={false} icon={<ReceiptIcon />} accent="#ef4444" />
        <KpiCard label="Monthly Expenses" value={fCur(cExpenses)} sub="August 2024"           trend="+6.8%"   trendPositive={false} icon={<WalletIcon />}  accent="#f59e0b" />
        <KpiCard label="Total Invoiced"   value={fCur(cBilledY)} sub="All time"               icon={<ReceiptIcon />} accent="#a78bfa" />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Billing trend */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)", padding: "20px 22px" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)", marginBottom: 2 }}>
              Billing vs Collections — 12 Months
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Monthly billed and collected amounts</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={BILLING_TREND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gBilled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => fCur(v, true)} tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} width={55} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="billed"    name="Billed"    stroke="#2563eb" fill="url(#gBilled)"    strokeWidth={1.5} />
              <Area type="monotone" dataKey="collected" name="Collected" stroke="#10b981" fill="url(#gCollected)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense by category */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)", padding: "20px 22px" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)", marginBottom: 2 }}>
              Expenses by Category — August
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Monthly breakdown by type</div>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              {EXP_BY_CAT.map(cat => (
                <div key={cat.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{cat.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{fCur(cat.amount, true)}</span>
                  </div>
                  <div style={{ height: 4, background: "var(--bg-raised)", borderRadius: 2 }}>
                    <div style={{ height: "100%", borderRadius: 2, background: cat.color,
                      width: `${(cat.amount / 405000) * 100}%`,
                      transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)", padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
            Recent Invoices
          </div>
          <button onClick={() => onNavigate("invoices")}
            style={{ fontSize: 12, color: "var(--primary)", background: "none", border: "none",
              cursor: "pointer", fontFamily: "var(--font-body)" }}>
            View all →
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Invoice</Th><Th>Client</Th><Th>Date</Th>
                <Th right>Amount</Th><Th right>Paid</Th><Th right>Balance</Th><Th>Status</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map(inv => (
                <tr key={inv.id} style={{ transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}>
                  <Td mono>
                    <button onClick={() => onNavigate("detail", inv.id)}
                      style={{ background: "none", border: "none", color: "var(--primary)",
                        cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, padding: 0 }}>
                      {inv.number}
                    </button>
                  </Td>
                  <Td>{inv.clientName.split(" ").slice(0, 2).join(" ")}</Td>
                  <Td>{fDate(inv.date)}</Td>
                  <Td right mono>{fCur(inv.total)}</Td>
                  <Td right mono><span style={{ color: "var(--success)" }}>{fCur(inv.paid)}</span></Td>
                  <Td right mono><span style={{ color: inv.balance > 0 ? "var(--warning)" : "var(--text-muted)" }}>{fCur(inv.balance)}</span></Td>
                  <Td><PayBadge status={inv.status} /></Td>
                  <Td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => onNavigate("detail", inv.id)}
                        style={{ padding: "4px 8px", borderRadius: 3, background: "var(--bg-raised)", border: "1px solid var(--border-default)",
                          color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                        <EyeIcon /> View
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   INVOICE LIST
══════════════════════════════════════════════════════════ */
function InvoiceList({ onNavigate }: { onNavigate: (v: AccountsView, id?: string) => void }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const PER_PAGE = 8

  const filtered = INVOICES.filter(inv => {
    const q = search.toLowerCase()
    const matchQ = inv.number.toLowerCase().includes(q) || inv.clientName.toLowerCase().includes(q)
    const matchS = statusFilter === "all" || inv.status === statusFilter
    return matchQ && matchS
  })

  const pageCount = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const summaryTotal  = filtered.reduce((s, i) => s + i.total, 0)
  const summaryPaid   = filtered.reduce((s, i) => s + i.paid, 0)
  const summaryBal    = filtered.reduce((s, i) => s + i.balance, 0)

  return (
    <div>
      <PageHeader title="Invoices" description="All tax invoices and billing records"
        primaryAction={{ label: "Create Invoice", onClick: () => onNavigate("create"), icon: <PlusIcon /> }}
        accentColor="#2563eb" />

      {/* Summary bar */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Total Invoiced", value: fCur(summaryTotal), color: "var(--text-primary)" },
          { label: "Collected",      value: fCur(summaryPaid),  color: "var(--success)" },
          { label: "Balance Due",    value: fCur(summaryBal),   color: summaryBal > 0 ? "var(--warning)" : "var(--text-muted)" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)", padding: "10px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 15, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)", flexWrap: "wrap" }}>
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Search invoice or client..." />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            style={{ ...inputSx, width: "auto", padding: "8px 12px" }}>
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
            <option value="outstanding">Outstanding</option>
            <option value="draft">Draft</option>
          </select>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)" }}>
                <Th>Invoice No.</Th><Th>Date</Th><Th>Due Date</Th><Th>Client</Th>
                <Th right>Amount</Th><Th right>Paid</Th><Th right>Balance</Th>
                <Th>Status</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: 48, textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13 }}>
                  No invoices found matching your filters.
                </td></tr>
              ) : paged.map(inv => (
                <tr key={inv.id}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                  style={{ transition: "background 0.1s" }}>
                  <Td mono>
                    <button onClick={() => onNavigate("detail", inv.id)}
                      style={{ background: "none", border: "none", color: "var(--primary)",
                        cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, padding: 0 }}>
                      {inv.number}
                    </button>
                  </Td>
                  <Td>{fDate(inv.date)}</Td>
                  <Td>
                    <span style={{ color: new Date(inv.dueDate) < new Date() && inv.status !== "paid" ? "var(--error)" : "var(--text-secondary)" }}>
                      {fDate(inv.dueDate)}
                    </span>
                  </Td>
                  <Td>
                    <div style={{ fontSize: 13, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
                      {inv.clientName.split(" ").slice(0, 3).join(" ")}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{inv.poNumber}</div>
                  </Td>
                  <Td right mono>{fCur(inv.total)}</Td>
                  <Td right mono><span style={{ color: "var(--success)" }}>{fCur(inv.paid)}</span></Td>
                  <Td right mono>
                    <span style={{ color: inv.balance > 0 ? (inv.status === "outstanding" ? "var(--error)" : "var(--warning)") : "var(--text-muted)" }}>
                      {fCur(inv.balance)}
                    </span>
                  </Td>
                  <Td><PayBadge status={inv.status} /></Td>
                  <Td>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => onNavigate("detail", inv.id)}
                        title="View Invoice"
                        style={{ padding: "5px 7px", borderRadius: 3, background: "var(--bg-raised)",
                          border: "1px solid var(--border-default)", color: "var(--text-muted)",
                          cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <EyeIcon />
                      </button>
                      <button title="Edit Invoice"
                        style={{ padding: "5px 7px", borderRadius: 3, background: "var(--bg-raised)",
                          border: "1px solid var(--border-default)", color: "var(--text-muted)",
                          cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <EditIcon />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border-subtle)",
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: pageCount }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  style={{ width: 30, height: 30, borderRadius: 3, border: "1px solid",
                    borderColor: page === i + 1 ? "var(--primary)" : "var(--border-default)",
                    background: page === i + 1 ? "var(--primary-subtle)" : "var(--bg-elevated)",
                    color: page === i + 1 ? "var(--primary)" : "var(--text-secondary)",
                    cursor: "pointer", fontSize: 12, fontFamily: "var(--font-body)" }}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   CREATE INVOICE — form + live preview
══════════════════════════════════════════════════════════ */
interface FormItem { id: string; description: string; hsnCode: string; qty: string; unit: string; rate: string; discountPct: string }
interface FormErrors { clientName?: string; clientAddress?: string; invoiceDate?: string; dueDate?: string; items?: string; general?: string }

function newItem(): FormItem {
  return { id: Math.random().toString(36).slice(2), description: "", hsnCode: "", qty: "1", unit: "pcs", rate: "", discountPct: "0" }
}

function parseItems(items: FormItem[]): InvoiceItem[] {
  return items.map(it => ({
    id: it.id, description: it.description, hsnCode: it.hsnCode,
    qty: parseFloat(it.qty) || 0, unit: it.unit,
    rate: parseFloat(it.rate) || 0, discountPct: parseFloat(it.discountPct) || 0,
  }))
}

/* Live invoice preview (paper style) */
function InvoicePreview({ form, items }: {
  form: { clientName: string; clientAddress: string; clientGST: string; invoiceNumber: string; invoiceDate: string; dueDate: string; poNumber: string; taxType: "igst" | "cgst_sgst"; paidAmount: string; notes: string; paymentTerms: string }
  items: FormItem[]
}) {
  const parsed  = parseItems(items)
  const { subtotal, taxAmount, total } = calcTotals(parsed)
  const paid    = parseFloat(form.paidAmount) || 0
  const balance = Math.max(0, total - paid)
  const status: PayStatus = paid >= total ? "paid" : paid > 0 ? "partial" : "pending"

  const cgst = form.taxType === "cgst_sgst" ? taxAmount / 2 : 0
  const sgst = form.taxType === "cgst_sgst" ? taxAmount / 2 : 0
  const igst = form.taxType === "igst"       ? taxAmount     : 0

  return (
    <div style={{ background: "#fff", color: "#1a1a2e", borderRadius: 6,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", padding: "32px 36px", fontFamily: "Arial, sans-serif",
      fontSize: 12, lineHeight: 1.5, minHeight: 600, maxHeight: "80vh", overflowY: "auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, paddingBottom: 16, borderBottom: "2px solid #1e3a8a" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1e3a8a", letterSpacing: "-0.5px", marginBottom: 2 }}>
            ACME CNC MANUFACTURING
          </div>
          <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.6 }}>
            Plot 7, MIDC Industrial Estate, Pune – 411019, Maharashtra<br />
            GSTIN: 27AABCA1234B1Z5 &nbsp;|&nbsp; CIN: U28990MH2018PTC123456<br />
            Tel: +91 20 2765 4321 &nbsp;|&nbsp; Email: accounts@acmecnc.com
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1e3a8a", letterSpacing: "0.05em" }}>TAX INVOICE</div>
          <div style={{ fontSize: 11, color: "#374151", marginTop: 6 }}>
            <span style={{ fontWeight: 600 }}>Invoice No.: </span>{form.invoiceNumber || "—"}<br />
            <span style={{ fontWeight: 600 }}>Date: </span>{form.invoiceDate ? fDate(form.invoiceDate) : "—"}<br />
            <span style={{ fontWeight: 600 }}>Due Date: </span>{form.dueDate ? fDate(form.dueDate) : "—"}
          </div>
          {form.poNumber && (
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>
              <span style={{ fontWeight: 600 }}>PO Ref.: </span>{form.poNumber}
            </div>
          )}
        </div>
      </div>

      {/* Bill To */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>Bill To</div>
          <div style={{ fontWeight: 700, color: "#111827", marginBottom: 2 }}>{form.clientName || "Client Name"}</div>
          <div style={{ color: "#6b7280", fontSize: 11, whiteSpace: "pre-line" }}>{form.clientAddress || "Client Address"}</div>
          {form.clientGST && <div style={{ fontSize: 10, color: "#374151", marginTop: 4 }}><span style={{ fontWeight: 600 }}>GSTIN: </span>{form.clientGST}</div>}
        </div>
        <div style={{ paddingLeft: 20, borderLeft: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase" }}>Supplier</div>
          <div style={{ fontWeight: 700, color: "#111827", marginBottom: 2 }}>ACME CNC Manufacturing Pvt. Ltd.</div>
          <div style={{ color: "#6b7280", fontSize: 11 }}>Plot 7, MIDC Industrial Estate<br />Pune – 411019, Maharashtra</div>
          <div style={{ fontSize: 10, color: "#374151", marginTop: 4 }}><span style={{ fontWeight: 600 }}>GSTIN: </span>27AABCA1234B1Z5</div>
          <div style={{ fontSize: 10, color: "#374151" }}><span style={{ fontWeight: 600 }}>Place of Supply: </span>
            {form.taxType === "cgst_sgst" ? "Maharashtra (27)" : "Inter-State"}</div>
        </div>
      </div>

      {/* Items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16, fontSize: 11 }}>
        <thead>
          <tr style={{ background: "#1e3a8a", color: "#fff" }}>
            {["#", "Description / HSN", "Qty", "Unit", "Rate (₹)", "Disc%", "Taxable (₹)"].map((h, i) => (
              <th key={h} style={{ padding: "7px 8px", textAlign: i >= 2 ? "right" : "left",
                fontWeight: 600, letterSpacing: "0.03em", whiteSpace: "nowrap", fontSize: 10 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parsed.filter(it => it.description).map((it, idx) => {
            const taxable = Math.round(it.qty * it.rate * (1 - it.discountPct / 100))
            return (
              <tr key={it.id} style={{ background: idx % 2 === 0 ? "#f9fafb" : "#fff", borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "6px 8px", color: "#6b7280" }}>{idx + 1}</td>
                <td style={{ padding: "6px 8px" }}>
                  <div style={{ fontWeight: 500, color: "#111827" }}>{it.description}</div>
                  {it.hsnCode && <div style={{ fontSize: 9, color: "#9ca3af" }}>HSN: {it.hsnCode}</div>}
                </td>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>{it.qty}</td>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>{it.unit}</td>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>{fCur(it.rate)}</td>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>{it.discountPct}%</td>
                <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 600 }}>{fCur(taxable)}</td>
              </tr>
            )
          })}
          {parsed.filter(it => it.description).length === 0 && (
            <tr><td colSpan={7} style={{ padding: "20px 8px", textAlign: "center", color: "#9ca3af" }}>Add line items to the invoice</td></tr>
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div style={{ width: 280 }}>
          {[
            { label: "Subtotal (Taxable Value)", value: subtotal },
            ...(form.taxType === "cgst_sgst" ? [
              { label: "CGST @ 9%", value: cgst },
              { label: "SGST @ 9%", value: sgst },
            ] : [
              { label: "IGST @ 18%", value: igst },
            ]),
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between",
              padding: "4px 8px", borderBottom: "1px solid #e5e7eb", fontSize: 11 }}>
              <span style={{ color: "#6b7280" }}>{row.label}</span>
              <span style={{ fontFamily: "monospace" }}>{fCur(row.value)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 8px",
            background: "#1e3a8a", color: "#fff", fontWeight: 700, fontSize: 13, marginTop: 4 }}>
            <span>Grand Total</span>
            <span>{fCur(total)}</span>
          </div>
          {paid > 0 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", fontSize: 11 }}>
                <span style={{ color: "#6b7280" }}>Amount Received</span>
                <span style={{ color: "#10b981", fontFamily: "monospace", fontWeight: 600 }}>{fCur(paid)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px",
                fontSize: 11, borderTop: "1px solid #e5e7eb" }}>
                <span style={{ color: "#6b7280" }}>Balance Due</span>
                <span style={{ color: balance > 0 ? "#ef4444" : "#10b981", fontFamily: "monospace", fontWeight: 600 }}>{fCur(balance)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Amount in words */}
      <div style={{ background: "#f0f4ff", border: "1px solid #bfdbfe", borderRadius: 4, padding: "8px 12px", marginBottom: 16, fontSize: 11 }}>
        <span style={{ fontWeight: 700, color: "#1e3a8a" }}>Amount in Words: </span>
        <span style={{ color: "#374151" }}>{total > 0 ? amountInWords(total) : "—"}</span>
      </div>

      {/* Status pill */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
          padding: "3px 10px", borderRadius: 3,
          background: STATUS_CFG[status].bg, color: STATUS_CFG[status].color, border: `1px solid ${STATUS_CFG[status].border}` }}>
          {STATUS_CFG[status].label.toUpperCase()}
        </span>
        <span style={{ fontSize: 10, color: "#9ca3af" }}>{form.paymentTerms || "Net 30"}</span>
      </div>

      {/* Bank details & terms */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 10, color: "#6b7280", borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
        <div>
          <div style={{ fontWeight: 700, color: "#374151", marginBottom: 4 }}>Bank Details</div>
          <div>Bank: HDFC Bank Ltd., Pune Main Branch</div>
          <div>A/C No.: 50200012345678</div>
          <div>IFSC: HDFC0000123</div>
          <div>Account Name: ACME CNC Manufacturing Pvt. Ltd.</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#374151", marginBottom: 4 }}>Terms & Conditions</div>
          <div>{form.notes || "Payment within 30 days. Overdue amounts attract 2% interest per month."}</div>
          <div style={{ marginTop: 8, fontStyle: "italic" }}>This is a computer-generated invoice. No signature required.</div>
        </div>
      </div>

      {/* Signature */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <div style={{ textAlign: "center", width: 160 }}>
          <div style={{ height: 40, borderBottom: "1px solid #374151", marginBottom: 6 }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: "#374151" }}>ACME CNC Manufacturing Pvt. Ltd.</div>
          <div style={{ fontSize: 9, color: "#9ca3af" }}>Authorized Signatory</div>
        </div>
      </div>
    </div>
  )
}

function CreateInvoice({ onNavigate }: { onNavigate: (v: AccountsView, id?: string) => void }) {
  const [clientName, setClientName]     = useState("")
  const [clientAddress, setClientAddress] = useState("")
  const [clientGST, setClientGST]       = useState("")
  const [invoiceNumber] = useState("INV-2024-0188")
  const [invoiceDate, setInvoiceDate]   = useState(new Date().toISOString().slice(0, 10))
  const [dueDate, setDueDate]           = useState("")
  const [poNumber, setPoNumber]         = useState("")
  const [taxType, setTaxType]           = useState<"igst" | "cgst_sgst">("cgst_sgst")
  const [paymentTerms, setPaymentTerms] = useState("Net 30")
  const [paidAmount, setPaidAmount]     = useState("")
  const [notes, setNotes]               = useState("Payment within 30 days. Overdue payments attract 2% interest per month.")
  const [items, setItems]               = useState<FormItem[]>([newItem()])
  const [errors, setErrors]             = useState<FormErrors>({})
  const [status, setStatus]             = useState<"idle" | "saving" | "success">("idle")
  const [selectedClient, setSelectedClient] = useState("")

  const handleClientSelect = useCallback((idx: string) => {
    setSelectedClient(idx)
    if (idx === "") { setClientName(""); setClientAddress(""); setClientGST(""); return }
    const c = CLIENTS[parseInt(idx)]
    if (c) { setClientName(c.name); setClientAddress(c.address); setClientGST(c.gst) }
  }, [])

  const addItem = () => setItems(prev => [...prev, newItem()])
  const removeItem = (id: string) => setItems(prev => prev.filter(it => it.id !== id))
  const updateItem = (id: string, field: keyof FormItem, val: string) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: val } : it))

  const parsed = parseItems(items)
  const { subtotal, taxAmount, total } = calcTotals(parsed)
  const paid = parseFloat(paidAmount) || 0
  const balance = Math.max(0, total - paid)

  function validate(): boolean {
    const e: FormErrors = {}
    if (!clientName.trim()) e.clientName = "Client name is required"
    if (!clientAddress.trim()) e.clientAddress = "Client address is required"
    if (!invoiceDate) e.invoiceDate = "Invoice date is required"
    if (!dueDate) e.dueDate = "Due date is required"
    if (dueDate && invoiceDate && dueDate < invoiceDate) e.dueDate = "Due date must be after invoice date"
    const validItems = parsed.filter(it => it.description && it.qty > 0 && it.rate > 0)
    if (validItems.length === 0) e.items = "At least one complete line item is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    setStatus("saving")
    setTimeout(() => setStatus("success"), 1500)
  }

  if (status === "success") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: 500, gap: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--success-bg)",
          border: "2px solid var(--success)", display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fade-in 0.4s ease" }}>
          <CheckIcon />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--text-primary)", marginBottom: 8 }}>
            Invoice Created Successfully
          </div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
            {invoiceNumber}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Invoice for {fCur(total)} has been created. Grand Total: {fCur(total)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <ActionBtn onClick={() => onNavigate("invoices")} variant="ghost"><ChevronLeftIcon /> Back to Invoices</ActionBtn>
          <ActionBtn onClick={() => onNavigate("create")} variant="primary"><PlusIcon /> Create Another</ActionBtn>
        </div>
      </div>
    )
  }

  const form = { clientName, clientAddress, clientGST, invoiceNumber, invoiceDate, dueDate, poNumber, taxType, paidAmount, notes, paymentTerms }

  return (
    <div>
      <PageHeader title="Create Invoice" description="Generate a new tax invoice"
        breadcrumbs={[{ label: "Invoices", id: "invoices" }, { label: "Create Invoice" }]}
        onNavigate={(id) => { if (id === "invoices") onNavigate("invoices") }}
        secondaryActions={[{ label: "Cancel", onClick: () => onNavigate("invoices") }]}
        accentColor="#2563eb" />

      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 24, alignItems: "start" }}>

        {/* ── Form ── */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Client section */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em",
              marginBottom: 14, textTransform: "uppercase", fontFamily: "var(--font-body)" }}>Client Details</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Quick Select Client">
                <Select value={selectedClient} onChange={handleClientSelect}>
                  <option value="">— Select existing client —</option>
                  {CLIENTS.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label="Client / Company Name" required error={errors.clientName}>
                <Input value={clientName} onChange={setClientName} placeholder="e.g. TechMetal Industries Pvt. Ltd." error={!!errors.clientName} />
              </Field>
              <Field label="Billing Address" required error={errors.clientAddress}>
                <textarea value={clientAddress} onChange={e => setClientAddress(e.target.value)} rows={2}
                  placeholder="Full address including PIN code and state"
                  style={{ ...inputSx, resize: "vertical", minHeight: 60, ...(errors.clientAddress ? { borderColor: "var(--error)" } : {}) }} />
              </Field>
              <Field label="GSTIN (optional)">
                <Input value={clientGST} onChange={setClientGST} placeholder="e.g. 27AABCT1332L1Z5" />
              </Field>
            </div>
          </div>

          {/* Invoice details */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em",
              marginBottom: 14, textTransform: "uppercase", fontFamily: "var(--font-body)" }}>Invoice Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Invoice Number">
                <Input value={invoiceNumber} readOnly />
              </Field>
              <Field label="Invoice Date" required error={errors.invoiceDate}>
                <Input type="date" value={invoiceDate} onChange={setInvoiceDate} error={!!errors.invoiceDate} />
              </Field>
              <Field label="Due Date" required error={errors.dueDate}>
                <Input type="date" value={dueDate} onChange={setDueDate} error={!!errors.dueDate} />
              </Field>
              <Field label="Payment Terms">
                <Select value={paymentTerms} onChange={setPaymentTerms}>
                  <option>Immediate</option>
                  <option>Net 15</option>
                  <option>Net 30</option>
                  <option>Net 45</option>
                  <option>Net 60</option>
                </Select>
              </Field>
              <Field label="PO Reference">
                <Input value={poNumber} onChange={setPoNumber} placeholder="e.g. PO-2024-001" />
              </Field>
              <Field label="Tax Type">
                <Select value={taxType} onChange={v => setTaxType(v as "igst" | "cgst_sgst")}>
                  <option value="cgst_sgst">CGST + SGST (Intra-state)</option>
                  <option value="igst">IGST (Inter-state)</option>
                </Select>
              </Field>
            </div>
          </div>

          {/* Line items */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em",
                textTransform: "uppercase", fontFamily: "var(--font-body)" }}>Line Items</div>
              <button onClick={addItem}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px",
                  borderRadius: "var(--radius-sm)", background: "var(--primary-subtle)",
                  border: "1px solid rgba(37,99,235,0.25)", color: "var(--primary)",
                  fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                <PlusIcon /> Add Item
              </button>
            </div>
            {errors.items && <div style={{ fontSize: 11, color: "var(--error)", marginBottom: 8 }}>{errors.items}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item, idx) => (
                <div key={item.id} style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)", padding: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                      Item {idx + 1}
                    </span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)}
                        style={{ background: "none", border: "none", color: "var(--error)", cursor: "pointer",
                          display: "flex", alignItems: "center", padding: 2 }}>
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <Input value={item.description} onChange={v => updateItem(item.id, "description", v)}
                      placeholder="Description of goods / service" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <Input value={item.hsnCode} onChange={v => updateItem(item.id, "hsnCode", v)} placeholder="HSN/SAC Code" />
                      <Select value={item.unit} onChange={v => updateItem(item.id, "unit", v)}>
                        {["pcs", "kg", "m", "lot", "hr", "set", "nos"].map(u => <option key={u}>{u}</option>)}
                      </Select>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>Qty</div>
                        <Input type="number" value={item.qty} onChange={v => updateItem(item.id, "qty", v)} />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>Rate (₹)</div>
                        <Input type="number" value={item.rate} onChange={v => updateItem(item.id, "rate", v)} />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 3 }}>Disc %</div>
                        <Input type="number" value={item.discountPct} onChange={v => updateItem(item.id, "discountPct", v)} />
                      </div>
                    </div>
                    {parseFloat(item.qty) > 0 && parseFloat(item.rate) > 0 && (
                      <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textAlign: "right" }}>
                        Taxable: <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                          {fCur(Math.round(parseFloat(item.qty) * parseFloat(item.rate) * (1 - (parseFloat(item.discountPct) || 0) / 100)))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals summary */}
          {total > 0 && (
            <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)", padding: "14px 16px" }}>
              {[
                { label: "Subtotal", value: subtotal },
                ...(taxType === "cgst_sgst"
                  ? [{ label: "CGST (9%)", value: taxAmount / 2 }, { label: "SGST (9%)", value: taxAmount / 2 }]
                  : [{ label: "IGST (18%)", value: taxAmount }]),
                { label: "Grand Total", value: total },
              ].map((r, i) => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between",
                  padding: "4px 0", borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: 12, color: i === (taxType === "cgst_sgst" ? 3 : 2) ? "var(--text-primary)" : "var(--text-muted)",
                    fontWeight: i === (taxType === "cgst_sgst" ? 3 : 2) ? 700 : 400, fontFamily: "var(--font-body)" }}>{r.label}</span>
                  <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600,
                    color: i === (taxType === "cgst_sgst" ? 3 : 2) ? "var(--text-primary)" : "var(--text-secondary)" }}>
                    {fCur(r.value)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Payment received */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Amount Received (₹)">
              <Input type="number" value={paidAmount} onChange={setPaidAmount} placeholder="0" />
            </Field>
            {(parseFloat(paidAmount) || 0) > 0 && total > 0 && (
              <div style={{ display: "flex", gap: 12, fontSize: 12, fontFamily: "var(--font-body)" }}>
                <span style={{ color: "var(--text-muted)" }}>Balance Due:</span>
                <span style={{ fontWeight: 600, color: balance > 0 ? "var(--warning)" : "var(--success)", fontFamily: "var(--font-mono)" }}>
                  {fCur(balance)}
                </span>
                <PayBadge status={paid >= total ? "paid" : paid > 0 ? "partial" : "pending"} />
              </div>
            )}
            <Field label="Notes / Terms">
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                style={{ ...inputSx, resize: "vertical", minHeight: 60 }} />
            </Field>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button onClick={handleSubmit} disabled={status === "saving"}
              style={{ flex: 1, padding: "10px 20px", borderRadius: "var(--radius-sm)",
                background: status === "saving" ? "var(--bg-raised)" : "var(--primary)",
                border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
                fontFamily: "var(--font-body)", cursor: status === "saving" ? "not-allowed" : "pointer",
                transition: "all 0.15s ease" }}>
              {status === "saving" ? "Creating Invoice..." : "Create Invoice"}
            </button>
          </div>
        </div>

        {/* ── Live Preview ── */}
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em",
            fontFamily: "var(--font-body)", textTransform: "uppercase", marginBottom: 10 }}>
            Live Preview
          </div>
          <InvoicePreview form={form} items={items} />
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .acc-create-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   INVOICE DETAIL — printable
══════════════════════════════════════════════════════════ */
function InvoiceDetail({ invoiceId, onNavigate }: { invoiceId: string; onNavigate: (v: AccountsView, id?: string) => void }) {
  const inv = INVOICES.find(i => i.id === invoiceId) ?? INVOICES[0]
  const { subtotal, taxAmount, total } = calcTotals(inv.items)
  const cgst = inv.taxType === "cgst_sgst" ? taxAmount / 2 : 0
  const sgst = inv.taxType === "cgst_sgst" ? taxAmount / 2 : 0
  const igst = inv.taxType === "igst"       ? taxAmount     : 0

  return (
    <div>
      <PageHeader title="Invoice Detail" description={inv.number}
        breadcrumbs={[{ label: "Invoices", id: "invoices" }, { label: inv.number }]}
        onNavigate={(id) => { if (id === "invoices") onNavigate("invoices") }}
        primaryAction={{ label: "Print / Download", onClick: () => window.print(), icon: <PrintIcon /> }}
        secondaryActions={[{ label: "Record Payment", onClick: () => onNavigate("payments") }]}
        badge={{ label: STATUS_CFG[inv.status].label, variant: inv.status === "paid" ? "success" : inv.status === "outstanding" ? "error" : inv.status === "partial" ? "warning" : "info" }}
        accentColor="#2563eb" />

      {/* Printable invoice */}
      <div id="printable-invoice" style={{ background: "#fff", color: "#1a1a2e", borderRadius: 6,
        boxShadow: "0 8px 40px rgba(0,0,0,0.55)", padding: "40px 48px", fontFamily: "Arial, sans-serif",
        fontSize: 12, lineHeight: 1.6, maxWidth: 860 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          paddingBottom: 20, borderBottom: "3px solid #1e3a8a", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#1e3a8a", letterSpacing: "-0.5px" }}>
              ACME CNC MANUFACTURING
            </div>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4, lineHeight: 1.7 }}>
              Plot 7, MIDC Industrial Estate, Pune – 411019, Maharashtra, India<br />
              GSTIN: 27AABCA1234B1Z5 &nbsp;|&nbsp; CIN: U28990MH2018PTC123456<br />
              Tel: +91 20 2765 4321 &nbsp;|&nbsp; Email: accounts@acmecnc.com &nbsp;|&nbsp; Web: www.acmecnc.com
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1e3a8a", letterSpacing: "0.08em" }}>TAX INVOICE</div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#374151", lineHeight: 1.8 }}>
              <span style={{ fontWeight: 700 }}>Invoice No.: </span>{inv.number}<br />
              <span style={{ fontWeight: 700 }}>Invoice Date: </span>{fDate(inv.date)}<br />
              <span style={{ fontWeight: 700 }}>Due Date: </span>{fDate(inv.dueDate)}<br />
              <span style={{ fontWeight: 700 }}>PO Reference: </span>{inv.poNumber}
            </div>
          </div>
        </div>

        {/* Bill To / Ship To */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28,
          padding: "16px 20px", background: "#f8faff", borderRadius: 6, border: "1px solid #dbeafe" }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#6b7280", letterSpacing: "0.12em",
              textTransform: "uppercase", marginBottom: 8 }}>Bill To</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 4 }}>{inv.clientName}</div>
            <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.7 }}>{inv.clientAddress}</div>
            <div style={{ fontSize: 11, color: "#374151", marginTop: 6 }}><span style={{ fontWeight: 700 }}>GSTIN: </span>{inv.clientGST}</div>
          </div>
          <div style={{ paddingLeft: 24, borderLeft: "1px solid #bfdbfe" }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#6b7280", letterSpacing: "0.12em",
              textTransform: "uppercase", marginBottom: 8 }}>Supplier (Ship From)</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 4 }}>ACME CNC Manufacturing Pvt. Ltd.</div>
            <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.7 }}>Plot 7, MIDC Industrial Estate<br />Pune – 411019, Maharashtra, India</div>
            <div style={{ fontSize: 11, color: "#374151", marginTop: 6 }}>
              <span style={{ fontWeight: 700 }}>GSTIN: </span>27AABCA1234B1Z5<br />
              <span style={{ fontWeight: 700 }}>Place of Supply: </span>{inv.placeOfSupply}
            </div>
          </div>
        </div>

        {/* Items table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <thead>
            <tr style={{ background: "#1e3a8a" }}>
              {["#", "Description of Goods", "HSN/SAC", "Qty", "Unit", "Rate (₹)", "Disc %", "Taxable Value (₹)"].map((h, i) => (
                <th key={h} style={{ padding: "9px 10px", color: "#fff", textAlign: i >= 3 ? "right" : "left",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inv.items.map((item, idx) => {
              const taxable = Math.round(item.qty * item.rate * (1 - item.discountPct / 100))
              return (
                <tr key={item.id} style={{ background: idx % 2 === 0 ? "#f9fafb" : "#fff", borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "8px 10px", color: "#9ca3af", fontSize: 11 }}>{idx + 1}</td>
                  <td style={{ padding: "8px 10px", fontSize: 12, fontWeight: 500, color: "#111827" }}>{item.description}</td>
                  <td style={{ padding: "8px 10px", fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>{item.hsnCode}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", fontSize: 12 }}>{item.qty}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", fontSize: 11, color: "#6b7280" }}>{item.unit}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", fontSize: 12 }}>{fCur(item.rate)}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", fontSize: 12 }}>{item.discountPct > 0 ? `${item.discountPct}%` : "—"}</td>
                  <td style={{ padding: "8px 10px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "#111827" }}>{fCur(taxable)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Totals + tax */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
          <div style={{ width: 320, border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden" }}>
            {[
              { label: "Taxable Value (Subtotal)", value: subtotal, bold: false },
              ...(inv.taxType === "cgst_sgst" ? [
                { label: "CGST @ 9%", value: cgst, bold: false },
                { label: "SGST @ 9%", value: sgst, bold: false },
              ] : [
                { label: "IGST @ 18%", value: igst, bold: false },
              ]),
              { label: "Grand Total", value: total, bold: true },
              { label: "Amount Received", value: inv.paid, bold: false },
              { label: "Balance Due", value: inv.balance, bold: true },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between",
                padding: "7px 14px",
                background: i === arr.length - 1 && inv.balance > 0 ? "#fef2f2" : row.label === "Grand Total" ? "#1e3a8a" : i % 2 === 0 ? "#f9fafb" : "#fff",
                borderBottom: i < arr.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                <span style={{ fontSize: 11, fontWeight: row.bold ? 700 : 400,
                  color: row.label === "Grand Total" ? "#fff" : i === arr.length - 1 && inv.balance > 0 ? "#ef4444" : "#374151" }}>
                  {row.label}
                </span>
                <span style={{ fontSize: 12, fontFamily: "monospace", fontWeight: row.bold ? 700 : 500,
                  color: row.label === "Grand Total" ? "#fff"
                    : row.label === "Amount Received" ? "#10b981"
                    : i === arr.length - 1 && inv.balance > 0 ? "#ef4444" : "#111827" }}>
                  {fCur(row.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Amount in words */}
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 4,
          padding: "10px 14px", marginBottom: 24, fontSize: 11 }}>
          <span style={{ fontWeight: 700, color: "#1e3a8a" }}>Amount in Words: </span>
          <span style={{ color: "#374151", fontStyle: "italic" }}>{amountInWords(total)}</span>
        </div>

        {/* Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ padding: "4px 12px", borderRadius: 3, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
            background: STATUS_CFG[inv.status].bg, color: STATUS_CFG[inv.status].color,
            border: `1px solid ${STATUS_CFG[inv.status].border}` }}>
            {STATUS_CFG[inv.status].label.toUpperCase()}
          </span>
          <span style={{ fontSize: 10, color: "#9ca3af" }}>Payment Terms: {inv.paymentTerms}</span>
        </div>

        {/* Bank details & terms */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
          borderTop: "2px solid #1e3a8a", paddingTop: 16, marginTop: 8, fontSize: 10 }}>
          <div>
            <div style={{ fontWeight: 800, color: "#1e3a8a", fontSize: 11, marginBottom: 8, letterSpacing: "0.06em" }}>
              BANK DETAILS FOR PAYMENT
            </div>
            <div style={{ color: "#374151", lineHeight: 1.9 }}>
              <div><span style={{ fontWeight: 700 }}>Bank: </span>HDFC Bank Ltd., Pune Main Branch</div>
              <div><span style={{ fontWeight: 700 }}>Account Name: </span>ACME CNC Manufacturing Pvt. Ltd.</div>
              <div><span style={{ fontWeight: 700 }}>Account No.: </span>50200012345678</div>
              <div><span style={{ fontWeight: 700 }}>IFSC Code: </span>HDFC0000123</div>
              <div><span style={{ fontWeight: 700 }}>Account Type: </span>Current</div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: "#1e3a8a", fontSize: 11, marginBottom: 8, letterSpacing: "0.06em" }}>
              TERMS & CONDITIONS
            </div>
            <div style={{ color: "#6b7280", lineHeight: 1.9 }}>
              <div>1. {inv.notes}</div>
              <div>2. Goods once sold will not be taken back.</div>
              <div>3. Subject to Pune jurisdiction.</div>
              <div style={{ marginTop: 6, fontStyle: "italic", color: "#9ca3af" }}>
                This is a computer-generated invoice. No signature required.
              </div>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 40 }}>
          <div style={{ textAlign: "center", width: 200 }}>
            <div style={{ height: 50, borderBottom: "1px solid #374151", marginBottom: 8 }} />
            <div style={{ fontWeight: 700, fontSize: 11, color: "#374151" }}>For ACME CNC Manufacturing Pvt. Ltd.</div>
            <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>Authorized Signatory</div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body > * { display: none !important; }
          #printable-invoice { display: block !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   PAYMENT MANAGEMENT
══════════════════════════════════════════════════════════ */
function AddPaymentDrawer({ onClose, onSave }: { onClose: () => void; onSave: (p: Payment) => void }) {
  const [invoiceId, setInvoiceId] = useState(INVOICES[0].id)
  const [amount, setAmount]       = useState("")
  const [date, setDate]           = useState(new Date().toISOString().slice(0, 10))
  const [method, setMethod]       = useState<PayMethod>("neft")
  const [reference, setReference] = useState("")
  const [notes, setNotes]         = useState("")
  const [saving, setSaving]       = useState(false)
  const [errors, setErrors]       = useState<Record<string, string>>({})

  const selectedInv = INVOICES.find(i => i.id === invoiceId) ?? INVOICES[0]

  function validate() {
    const e: Record<string, string> = {}
    if (!amount || parseFloat(amount) <= 0) e.amount = "Enter a valid amount"
    if (parseFloat(amount) > selectedInv.balance) e.amount = "Exceeds invoice balance"
    if (!date) e.date = "Date is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      onSave({
        id: Math.random().toString(36).slice(2),
        invoiceId, invoiceNumber: selectedInv.number,
        clientName: selectedInv.clientName, amount: parseFloat(amount),
        date, method, reference, notes,
      })
      setSaving(false)
      onClose()
    }, 900)
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 400, background: "var(--bg-elevated)",
        borderLeft: "1px solid var(--border-default)", zIndex: 50, display: "flex", flexDirection: "column",
        boxShadow: "var(--shadow-xl)", animation: "fade-in 0.2s ease" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>
            Record Payment
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <XIcon />
          </button>
        </div>
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Invoice" required>
            <Select value={invoiceId} onChange={setInvoiceId}>
              {INVOICES.filter(i => i.status !== "paid").map(i => (
                <option key={i.id} value={i.id}>{i.number} — {i.clientName.split(" ")[0]} — Balance: {fCur(i.balance)}</option>
              ))}
            </Select>
          </Field>
          <div style={{ background: "var(--bg-raised)", borderRadius: "var(--radius-md)", padding: "10px 14px", fontSize: 12 }}>
            <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>{selectedInv.clientName}</div>
            <div style={{ display: "flex", gap: 16 }}>
              <span style={{ color: "var(--text-secondary)" }}>Total: <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{fCur(selectedInv.total)}</span></span>
              <span style={{ color: "var(--text-secondary)" }}>Balance: <span style={{ fontFamily: "var(--font-mono)", color: "var(--warning)" }}>{fCur(selectedInv.balance)}</span></span>
            </div>
          </div>
          <Field label="Amount (₹)" required error={errors.amount}>
            <Input type="number" value={amount} onChange={setAmount} placeholder="Enter amount received" error={!!errors.amount} />
          </Field>
          <Field label="Payment Date" required error={errors.date}>
            <Input type="date" value={date} onChange={setDate} error={!!errors.date} />
          </Field>
          <Field label="Payment Method" required>
            <Select value={method} onChange={v => setMethod(v as PayMethod)}>
              {Object.entries(PAY_METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Reference / Transaction ID">
            <Input value={reference} onChange={setReference} placeholder="UTR, Cheque No., etc." />
          </Field>
          <Field label="Notes">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              style={{ ...inputSx, resize: "vertical" }} />
          </Field>
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)",
            background: "var(--bg-raised)", border: "1px solid var(--border-default)",
            color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13 }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)",
              background: saving ? "var(--bg-raised)" : "var(--success)",
              border: "none", color: "#fff", cursor: saving ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600 }}>
            {saving ? "Saving..." : "Save Payment"}
          </button>
        </div>
      </div>
    </>
  )
}

function PaymentManagement({ onNavigate }: { onNavigate: (v: AccountsView, id?: string) => void }) {
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS)
  const [search, setSearch]     = useState("")
  const [methodFilter, setMethodFilter] = useState("all")
  const [showDrawer, setShowDrawer] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const filtered = payments.filter(p => {
    const q = search.toLowerCase()
    const matchQ = p.invoiceNumber.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q)
    const matchM = methodFilter === "all" || p.method === methodFilter
    return matchQ && matchM
  })

  const totalCollected = payments.reduce((s, p) => s + p.amount, 0)

  function handleSave(p: Payment) {
    setPayments(prev => [p, ...prev])
    setSuccessMsg(`Payment of ${fCur(p.amount)} recorded for ${p.invoiceNumber}`)
    setTimeout(() => setSuccessMsg(""), 4000)
  }

  return (
    <div>
      <PageHeader title="Payments" description="Payment records and collection tracking"
        primaryAction={{ label: "Record Payment", onClick: () => setShowDrawer(true), icon: <PlusIcon /> }}
        accentColor="#10b981" />

      {successMsg && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
          background: "var(--success-bg)", border: "1px solid var(--success-border)",
          borderRadius: "var(--radius-md)", marginBottom: 16, animation: "fade-in 0.3s ease" }}>
          <span style={{ color: "var(--success)" }}><CheckIcon /></span>
          <span style={{ fontSize: 13, color: "var(--success)", fontFamily: "var(--font-body)" }}>{successMsg}</span>
        </div>
      )}

      {/* Summary */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Total Collected", value: fCur(totalCollected), color: "var(--success)" },
          { label: "Total Records",   value: payments.length.toString(), color: "var(--text-primary)" },
          { label: "Pending Balance", value: fCur(INVOICES.reduce((s,i) => s + i.balance, 0)), color: "var(--warning)" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)", padding: "10px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 15, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: 12, flexWrap: "wrap" }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search invoice, client, reference..." />
          <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}
            style={{ ...inputSx, width: "auto", padding: "8px 12px" }}>
            <option value="all">All Methods</option>
            {Object.entries(PAY_METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)" }}>
                <Th>Invoice</Th><Th>Client</Th><Th>Date</Th>
                <Th right>Amount</Th><Th>Method</Th><Th>Reference</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13 }}>
                  No payments found.
                </td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                  style={{ transition: "background 0.1s" }}>
                  <Td mono>
                    <button onClick={() => onNavigate("detail", p.invoiceId)}
                      style={{ background: "none", border: "none", color: "var(--primary)",
                        cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, padding: 0 }}>
                      {p.invoiceNumber}
                    </button>
                  </Td>
                  <Td>{p.clientName.split(" ").slice(0, 2).join(" ")}</Td>
                  <Td>{fDate(p.date)}</Td>
                  <Td right mono><span style={{ color: "var(--success)", fontWeight: 600 }}>{fCur(p.amount)}</span></Td>
                  <Td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px",
                      borderRadius: 3, background: "var(--bg-raised)", border: "1px solid var(--border-default)",
                      fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                      {PAY_METHOD_LABELS[p.method]}
                    </span>
                  </Td>
                  <Td mono>
                    <span style={{ fontSize: 11 }}>{p.reference || "—"}</span>
                  </Td>
                  <Td>
                    <button onClick={() => onNavigate("detail", p.invoiceId)}
                      style={{ padding: "5px 7px", borderRadius: 3, background: "var(--bg-raised)",
                        border: "1px solid var(--border-default)", color: "var(--text-muted)", cursor: "pointer",
                        display: "flex", alignItems: "center" }}>
                      <EyeIcon />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showDrawer && <AddPaymentDrawer onClose={() => setShowDrawer(false)} onSave={handleSave} />}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   EXPENSE MANAGEMENT
══════════════════════════════════════════════════════════ */
type ExpStatus = "approved" | "pending" | "rejected"

const EXP_STATUS_CFG: Record<ExpStatus, { label: string; color: string; bg: string; border: string }> = {
  approved: { label: "Approved", color: "#10b981", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.25)" },
  pending:  { label: "Pending",  color: "#f59e0b", bg: "rgba(245,158,11,0.10)",  border: "rgba(245,158,11,0.25)" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.10)",   border: "rgba(239,68,68,0.25)" },
}

function ExpBadge({ status }: { status: ExpStatus }) {
  const c = EXP_STATUS_CFG[status]
  return (
    <span style={{ padding: "2px 8px", borderRadius: 3, background: c.bg, border: `1px solid ${c.border}`,
      fontSize: 11, fontWeight: 600, color: c.color, fontFamily: "var(--font-body)" }}>{c.label}</span>
  )
}

const CAT_COLORS: Record<ExpCategory, string> = {
  raw_materials: "#2563eb", utilities: "#06b6d4", salaries: "#10b981",
  maintenance: "#f59e0b", transport: "#a78bfa", office: "#64748b", it: "#10b981", other: "#94a3b8",
}

function AddExpenseDrawer({ onClose, onSave }: { onClose: () => void; onSave: (e: Expense) => void }) {
  const [category, setCategory]         = useState<ExpCategory>("raw_materials")
  const [amount, setAmount]             = useState("")
  const [date, setDate]                 = useState(new Date().toISOString().slice(0, 10))
  const [description, setDescription]   = useState("")
  const [paymentMethod, setPayMethod]   = useState<PayMethod>("bank_transfer")
  const [vendor, setVendor]             = useState("")
  const [saving, setSaving]             = useState(false)
  const [errors, setErrors]             = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!description.trim()) e.description = "Description is required"
    if (!amount || parseFloat(amount) <= 0) e.amount = "Enter a valid amount"
    if (!date) e.date = "Date is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => {
      onSave({
        id: Math.random().toString(36).slice(2),
        category, amount: parseFloat(amount), date, description,
        paymentMethod, vendor, status: "pending",
      })
      setSaving(false)
      onClose()
    }, 900)
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 400, background: "var(--bg-elevated)",
        borderLeft: "1px solid var(--border-default)", zIndex: 50, display: "flex", flexDirection: "column",
        boxShadow: "var(--shadow-xl)", animation: "fade-in 0.2s ease" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>
            Add Expense
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <XIcon />
          </button>
        </div>
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Category" required>
            <Select value={category} onChange={v => setCategory(v as ExpCategory)}>
              {Object.entries(CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Description" required error={errors.description}>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              placeholder="Brief description of the expense"
              style={{ ...inputSx, resize: "vertical", ...(errors.description ? { borderColor: "var(--error)" } : {}) }} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Amount (₹)" required error={errors.amount}>
              <Input type="number" value={amount} onChange={setAmount} placeholder="0" error={!!errors.amount} />
            </Field>
            <Field label="Date" required error={errors.date}>
              <Input type="date" value={date} onChange={setDate} error={!!errors.date} />
            </Field>
          </div>
          <Field label="Payment Method">
            <Select value={paymentMethod} onChange={v => setPayMethod(v as PayMethod)}>
              {Object.entries(PAY_METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Vendor / Payee">
            <Input value={vendor} onChange={setVendor} placeholder="Vendor or supplier name" />
          </Field>
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)",
            background: "var(--bg-raised)", border: "1px solid var(--border-default)",
            color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13 }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)",
              background: saving ? "var(--bg-raised)" : "var(--warning)",
              border: "none", color: "#fff", cursor: saving ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600 }}>
            {saving ? "Saving..." : "Add Expense"}
          </button>
        </div>
      </div>
    </>
  )
}

function ExpenseManagement() {
  const [expenses, setExpenses] = useState<Expense[]>(EXPENSES)
  const [search, setSearch]     = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDrawer, setShowDrawer] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const filtered = expenses.filter(e => {
    const q = search.toLowerCase()
    const matchQ = e.description.toLowerCase().includes(q) || e.vendor.toLowerCase().includes(q)
    const matchC  = catFilter === "all" || e.category === catFilter
    const matchS  = statusFilter === "all" || e.status === statusFilter
    return matchQ && matchC && matchS
  })

  const totalAmount = filtered.reduce((s, e) => s + e.amount, 0)
  const approvedAmt = expenses.filter(e => e.status === "approved").reduce((s, e) => s + e.amount, 0)
  const pendingAmt  = expenses.filter(e => e.status === "pending").reduce((s, e) => s + e.amount, 0)

  function handleSave(e: Expense) {
    setExpenses(prev => [e, ...prev])
    setSuccessMsg(`Expense of ${fCur(e.amount)} added (pending approval)`)
    setTimeout(() => setSuccessMsg(""), 4000)
  }

  function approveExpense(id: string) {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: "approved" as const } : e))
  }

  function rejectExpense(id: string) {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: "rejected" as const } : e))
  }

  return (
    <div>
      <PageHeader title="Expenses" description="Operational expense management and approval"
        primaryAction={{ label: "Add Expense", onClick: () => setShowDrawer(true), icon: <PlusIcon /> }}
        accentColor="#f59e0b" />

      {successMsg && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
          background: "var(--warning-bg)", border: "1px solid var(--warning-border)",
          borderRadius: "var(--radius-md)", marginBottom: 16, animation: "fade-in 0.3s ease" }}>
          <span style={{ color: "var(--warning)" }}><CheckIcon /></span>
          <span style={{ fontSize: 13, color: "var(--warning)", fontFamily: "var(--font-body)" }}>{successMsg}</span>
        </div>
      )}

      {/* Summary */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Total Expenses",  value: fCur(expenses.reduce((s,e) => s+e.amount, 0)), color: "var(--text-primary)" },
          { label: "Approved",        value: fCur(approvedAmt), color: "var(--success)" },
          { label: "Pending Approval",value: fCur(pendingAmt),  color: "var(--warning)" },
          { label: "This Month",      value: expenses.filter(e => e.date.startsWith("2024-08")).length + " entries", color: "var(--accent)" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)", padding: "10px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 15, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: 12, flexWrap: "wrap" }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search description or vendor..." />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            style={{ ...inputSx, width: "auto", padding: "8px 12px" }}>
            <option value="all">All Categories</option>
            {Object.entries(CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ ...inputSx, width: "auto", padding: "8px 12px" }}>
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, fontFamily: "var(--font-body)", color: "var(--text-muted)" }}>
              Total: <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 600 }}>{fCur(totalAmount)}</span>
            </span>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)" }}>
                <Th>Date</Th><Th>Category</Th><Th>Description</Th><Th>Vendor</Th>
                <Th>Method</Th><Th right>Amount</Th><Th>Status</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13 }}>
                  No expenses found.
                </td></tr>
              ) : filtered.map(exp => (
                <tr key={exp.id}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                  style={{ transition: "background 0.1s" }}>
                  <Td>{fDate(exp.date)}</Td>
                  <Td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%",
                        background: CAT_COLORS[exp.category], display: "inline-block", flexShrink: 0 }} />
                      {CAT_LABELS[exp.category]}
                    </span>
                  </Td>
                  <Td>
                    <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{exp.description}</span>
                  </Td>
                  <Td>{exp.vendor || "—"}</Td>
                  <Td>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{PAY_METHOD_LABELS[exp.paymentMethod]}</span>
                  </Td>
                  <Td right mono><span style={{ fontWeight: 600 }}>{fCur(exp.amount)}</span></Td>
                  <Td><ExpBadge status={exp.status} /></Td>
                  <Td>
                    {exp.status === "pending" ? (
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => approveExpense(exp.id)}
                          style={{ padding: "4px 8px", borderRadius: 3, background: "var(--success-bg)",
                            border: "1px solid var(--success-border)", color: "var(--success)",
                            cursor: "pointer", fontSize: 11, fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 4 }}>
                          <CheckIcon /> Approve
                        </button>
                        <button onClick={() => rejectExpense(exp.id)}
                          style={{ padding: "4px 8px", borderRadius: 3, background: "var(--error-bg)",
                            border: "1px solid var(--error-border)", color: "var(--error)",
                            cursor: "pointer", fontSize: 11, fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 4 }}>
                          <XIcon /> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>—</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showDrawer && <AddExpenseDrawer onClose={() => setShowDrawer(false)} onSave={handleSave} />}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   REPORTS
══════════════════════════════════════════════════════════ */
function ReportsView() {
  const [period, setPeriod] = useState("monthly")

  const totalBilled    = BILLING_TREND.reduce((s, m) => s + m.billed, 0)
  const totalCollected = BILLING_TREND.reduce((s, m) => s + m.collected, 0)
  const totalExpenses  = EXPENSE_TREND.reduce((s, m) => s + m.expenses, 0)
  const grossProfit    = totalCollected - totalExpenses

  return (
    <div>
      <PageHeader title="Reports" description="Billing, collection and expense analytics"
        secondaryActions={[{ label: "Export CSV", onClick: () => undefined, icon: <DownloadIcon /> }]}
        accentColor="#a78bfa" />

      {/* Period selector */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "var(--bg-elevated)",
        borderRadius: "var(--radius-md)", padding: 4, width: "fit-content",
        border: "1px solid var(--border-subtle)" }}>
        {["monthly", "quarterly", "yearly"].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            style={{ padding: "6px 16px", borderRadius: "var(--radius-sm)",
              background: period === p ? "var(--primary)" : "transparent",
              color: period === p ? "#fff" : "var(--text-muted)",
              border: "none", cursor: "pointer", fontSize: 12, fontWeight: period === p ? 600 : 400,
              fontFamily: "var(--font-body)", textTransform: "capitalize", transition: "all 0.15s" }}>
            {p}
          </button>
        ))}
      </div>

      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Invoiced",    value: fCur(totalBilled, true),    sub: "12-month period",   color: "#2563eb" },
          { label: "Total Collected",   value: fCur(totalCollected, true), sub: "Collection rate: " + Math.round(totalCollected/totalBilled*100) + "%", color: "#10b981" },
          { label: "Total Expenses",    value: fCur(totalExpenses, true),  sub: "All categories",    color: "#f59e0b" },
          { label: "Net Profit",        value: fCur(grossProfit, true),    sub: "After expenses",    color: grossProfit > 0 ? "#10b981" : "#ef4444" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)", padding: "18px 20px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em",
              marginBottom: 10, fontFamily: "var(--font-body)", textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)", padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4, fontFamily: "var(--font-body)" }}>
            Monthly Billing vs Collections
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14, fontFamily: "var(--font-body)" }}>Sep 2023 – Aug 2024</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={BILLING_TREND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => fCur(v, true)} tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} width={55} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="billed"    name="Billed"    fill="#2563eb" radius={[2, 2, 0, 0]} />
              <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)", padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4, fontFamily: "var(--font-body)" }}>
            Monthly Expense Trend
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14, fontFamily: "var(--font-body)" }}>Sep 2023 – Aug 2024</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={EXPENSE_TREND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => fCur(v, true)} tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} width={55} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" fill="url(#gExp)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown table */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)", padding: "20px 22px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)", marginBottom: 16 }}>
          Expense Category Breakdown — August 2024
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr><Th>Category</Th><Th right>Amount</Th><Th right>% of Total</Th><Th>Distribution</Th></tr>
          </thead>
          <tbody>
            {EXP_BY_CAT.map(cat => (
              <tr key={cat.name}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                style={{ transition: "background 0.1s" }}>
                <Td>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: cat.color, display: "inline-block" }} />
                    {cat.name}
                  </span>
                </Td>
                <Td right mono>{fCur(cat.amount)}</Td>
                <Td right><span style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{((cat.amount / 546200) * 100).toFixed(1)}%</span></Td>
                <Td>
                  <div style={{ width: "100%", height: 6, background: "var(--bg-raised)", borderRadius: 3 }}>
                    <div style={{ height: "100%", borderRadius: 3, background: cat.color,
                      width: `${(cat.amount / 405000) * 100}%`,
                      transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   ACCOUNTS MODULE — router
══════════════════════════════════════════════════════════ */
export function AccountsModule({ initialView = "dashboard", onNavigate: appNavigate }: {
  initialView?: AccountsView
  onNavigate?: (id: string) => void
}) {
  const [view, setView]          = useState<AccountsView>(initialView)
  const [detailId, setDetailId]  = useState<string | undefined>(undefined)

  useEffect(() => { setView(initialView) }, [initialView])

  const navigate = useCallback((v: AccountsView, id?: string) => {
    const topViews = ["dashboard", "invoices", "payments", "expenses", "reports"]
    if (topViews.includes(v)) {
      const globalId = v === "dashboard" ? "accountsDashboard" : v === "invoices" ? "billing" : v === "reports" ? "accountsReports" : v
      appNavigate?.(globalId)
    } else {
      setView(v)
      if (id) setDetailId(id)
    }
  }, [appNavigate])

  const topViews: AccountsView[] = ["dashboard", "invoices", "payments", "expenses", "reports"]
  const activeTab = topViews.includes(view) ? view : view === "create" ? "invoices" : view === "detail" ? "invoices" : "dashboard"

  return (
    <div>

      {view === "dashboard" && <AccountsDashboard onNavigate={navigate} />}
      {view === "invoices"  && <InvoiceList onNavigate={navigate} />}
      {view === "create"    && <CreateInvoice onNavigate={navigate} />}
      {view === "detail"    && <InvoiceDetail invoiceId={detailId ?? INVOICES[0].id} onNavigate={navigate} />}
      {view === "payments"  && <PaymentManagement onNavigate={navigate} />}
      {view === "expenses"  && <ExpenseManagement />}
      {view === "reports"   && <ReportsView />}

      <style>{`
        @media (max-width: 1100px) {
          .acc-create-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .acc-report-kpi { grid-template-columns: 1fr 1fr !important; }
          .acc-chart-row  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
