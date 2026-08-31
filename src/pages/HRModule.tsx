import { useState, useEffect, useRef } from "react"
import { PageHeader } from "../shell/PageHeader"
import { PlusIcon, SearchIcon, XIcon, CheckIcon } from "../shell/Icons"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts"

/* ══════════════════════════════════════════════════════════════
   TYPES & DATA
══════════════════════════════════════════════════════════════ */

type EmpStatus = "active" | "on-leave" | "inactive"

interface Employee {
  id: string; name: string; dept: string; designation: string; shift: string
  status: EmpStatus; joinDate: string; phone: string; email: string
  dob: string; address: string; emergency: string; reportingTo: string
  grade: string; type: string
  attendance: { present: number; absent: number; late: number; ot: number }
  leave: { annual: number; sick: number; casual: number }
  initials: string; color: string
}

type LeaveStatus = "pending" | "approved" | "rejected"
type LeaveType = "Annual" | "Sick" | "Casual" | "Comp-off"

interface LeaveRequest {
  id: string; empId: string; empName: string; dept: string
  type: LeaveType; from: string; to: string; days: number
  reason: string; status: LeaveStatus; applied: string
}

interface AttendanceRecord {
  empId: string; empName: string; dept: string
  date: string; checkIn: string; checkOut: string
  hours: string; late: boolean; ot: string; status: "present" | "absent" | "half-day" | "leave"
}

const DEPT_COLORS: Record<string, string> = {
  Production: "var(--primary)", HR: "var(--success)", Accounts: "var(--warning)",
  Store: "var(--accent)", Quality: "#a78bfa", Maintenance: "#f97316",
}

const EMPLOYEES: Employee[] = [
  { id: "EMP-001", name: "Juan Martinez",    initials: "JM", color: "#2563eb", dept: "Production",  designation: "CNC Operator Sr.",    shift: "Day",     status: "active",   joinDate: "2019-03-15", dob: "1990-06-22", phone: "+91 98765 43210", email: "juan.m@acmecnc.com",     address: "12 MG Road, Pune 411001",     emergency: "Maria Martinez +91 98765 11100", reportingTo: "Kenji Tanaka",   grade: "G-4", type: "Full-time", attendance: { present: 21, absent: 1, late: 2, ot: 8  }, leave: { annual: 12, sick: 6, casual: 2 } },
  { id: "EMP-002", name: "Sarah Okonkwo",    initials: "SO", color: "#10b981", dept: "HR",          designation: "HR Manager",           shift: "Day",     status: "active",   joinDate: "2020-07-01", dob: "1985-02-14", phone: "+91 87654 32109", email: "sarah.o@acmecnc.com",    address: "34 Baner Road, Pune 411045",  emergency: "David Okonkwo +91 87654 11100",  reportingTo: "Alex Mercer",    grade: "G-6", type: "Full-time", attendance: { present: 22, absent: 0, late: 1, ot: 2  }, leave: { annual: 14, sick: 7, casual: 3 } },
  { id: "EMP-003", name: "Kenji Tanaka",     initials: "KT", color: "#a78bfa", dept: "Production",  designation: "Production Manager",   shift: "Day",     status: "active",   joinDate: "2018-01-10", dob: "1982-09-05", phone: "+91 76543 21098", email: "kenji.t@acmecnc.com",    address: "7 FC Road, Pune 411004",      emergency: "Yuki Tanaka +91 76543 11100",    reportingTo: "Alex Mercer",    grade: "G-7", type: "Full-time", attendance: { present: 23, absent: 0, late: 0, ot: 12 }, leave: { annual: 18, sick: 8, casual: 3 } },
  { id: "EMP-004", name: "Luisa Dupont",     initials: "LD", color: "#06b6d4", dept: "Store",       designation: "Store Manager",        shift: "Day",     status: "active",   joinDate: "2021-04-20", dob: "1988-11-30", phone: "+91 65432 10987", email: "luisa.d@acmecnc.com",    address: "89 Viman Nagar, Pune 411014", emergency: "Pierre Dupont +91 65432 11100",  reportingTo: "Alex Mercer",    grade: "G-6", type: "Full-time", attendance: { present: 20, absent: 1, late: 3, ot: 0  }, leave: { annual: 10, sick: 5, casual: 2 } },
  { id: "EMP-005", name: "Raj Patel",        initials: "RP", color: "#f59e0b", dept: "Accounts",    designation: "Accountant",           shift: "Day",     status: "active",   joinDate: "2020-11-15", dob: "1991-04-18", phone: "+91 54321 09876", email: "raj.p@acmecnc.com",      address: "56 Kothrud, Pune 411038",     emergency: "Sunita Patel +91 54321 11100",   reportingTo: "Alex Mercer",    grade: "G-5", type: "Full-time", attendance: { present: 22, absent: 0, late: 1, ot: 3  }, leave: { annual: 11, sick: 6, casual: 2 } },
  { id: "EMP-006", name: "Marcus Schmidt",   initials: "MS", color: "#ef4444", dept: "Production",  designation: "CNC Operator",         shift: "Day",     status: "inactive", joinDate: "2022-02-28", dob: "1995-07-12", phone: "+91 43210 98765", email: "marcus.s@acmecnc.com",   address: "23 Hadapsar, Pune 411028",    emergency: "Anna Schmidt +91 43210 11100",   reportingTo: "Kenji Tanaka",   grade: "G-3", type: "Full-time", attendance: { present: 18, absent: 5, late: 4, ot: 1  }, leave: { annual: 6,  sick: 4, casual: 1 } },
  { id: "EMP-007", name: "Priya Sharma",     initials: "PS", color: "#10b981", dept: "Quality",     designation: "QC Inspector",         shift: "Day",     status: "active",   joinDate: "2021-08-09", dob: "1993-03-25", phone: "+91 32109 87654", email: "priya.s@acmecnc.com",    address: "45 Shivajinagar, Pune 411005", emergency: "Arun Sharma +91 32109 11100",    reportingTo: "Kenji Tanaka",   grade: "G-4", type: "Full-time", attendance: { present: 22, absent: 0, late: 1, ot: 4  }, leave: { annual: 12, sick: 5, casual: 3 } },
  { id: "EMP-008", name: "K. Nair",          initials: "KN", color: "#2563eb", dept: "Production",  designation: "CNC Operator Jr.",     shift: "Night",   status: "active",   joinDate: "2024-01-15", dob: "1999-12-01", phone: "+91 21098 76543", email: "k.nair@acmecnc.com",     address: "67 Wakad, Pune 411057",       emergency: "Lakshmi Nair +91 21098 11100",   reportingTo: "Kenji Tanaka",   grade: "G-2", type: "Full-time", attendance: { present: 20, absent: 2, late: 1, ot: 6  }, leave: { annual: 7,  sick: 3, casual: 1 } },
  { id: "EMP-009", name: "Amir Hassan",      initials: "AH", color: "#f97316", dept: "Maintenance", designation: "Maintenance Technician", shift: "Day",   status: "active",   joinDate: "2019-09-20", dob: "1987-05-10", phone: "+91 10987 65432", email: "amir.h@acmecnc.com",     address: "34 Pimpri, Pune 411018",      emergency: "Fatima Hassan +91 10987 11100",  reportingTo: "Kenji Tanaka",   grade: "G-4", type: "Full-time", attendance: { present: 21, absent: 1, late: 2, ot: 10 }, leave: { annual: 13, sick: 6, casual: 2 } },
  { id: "EMP-010", name: "Divya Krishnan",   initials: "DK", color: "#a78bfa", dept: "Quality",     designation: "Quality Engineer",     shift: "Day",     status: "on-leave", joinDate: "2022-06-01", dob: "1994-08-19", phone: "+91 09876 54321", email: "divya.k@acmecnc.com",    address: "12 Hinjewadi, Pune 411057",   emergency: "Rajan Krishnan +91 09876 11100", reportingTo: "Priya Sharma",   grade: "G-4", type: "Full-time", attendance: { present: 19, absent: 3, late: 1, ot: 2  }, leave: { annual: 9,  sick: 5, casual: 2 } },
  { id: "EMP-011", name: "Tomás Reyes",      initials: "TR", color: "#06b6d4", dept: "Production",  designation: "CNC Programmer",       shift: "Day",     status: "active",   joinDate: "2020-03-10", dob: "1989-01-28", phone: "+91 98654 32107", email: "tomas.r@acmecnc.com",    address: "78 Aundh, Pune 411007",       emergency: "Elena Reyes +91 98654 11200",    reportingTo: "Kenji Tanaka",   grade: "G-5", type: "Full-time", attendance: { present: 22, absent: 1, late: 0, ot: 5  }, leave: { annual: 13, sick: 6, casual: 2 } },
  { id: "EMP-012", name: "Ananya Bose",      initials: "AB", color: "#10b981", dept: "HR",          designation: "HR Executive",         shift: "Day",     status: "active",   joinDate: "2023-02-14", dob: "1997-06-03", phone: "+91 87543 21096", email: "ananya.b@acmecnc.com",   address: "34 Pashan, Pune 411021",      emergency: "Suresh Bose +91 87543 11300",    reportingTo: "Sarah Okonkwo",  grade: "G-3", type: "Full-time", attendance: { present: 21, absent: 2, late: 2, ot: 1  }, leave: { annual: 8,  sick: 4, casual: 2 } },
]

const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: "LR-0041", empId: "EMP-001", empName: "Juan Martinez",  dept: "Production",  type: "Annual",   from: "Aug 20", to: "Aug 22", days: 3, reason: "Family function", status: "pending",  applied: "Aug 17" },
  { id: "LR-0042", empId: "EMP-006", empName: "Marcus Schmidt", dept: "Production",  type: "Sick",     from: "Aug 17", to: "Aug 18", days: 2, reason: "Medical",         status: "pending",  applied: "Aug 16" },
  { id: "LR-0043", empId: "EMP-012", empName: "Ananya Bose",    dept: "HR",          type: "Casual",   from: "Aug 19", to: "Aug 19", days: 1, reason: "Personal work",   status: "pending",  applied: "Aug 15" },
  { id: "LR-0038", empId: "EMP-010", empName: "Divya Krishnan", dept: "Quality",     type: "Annual",   from: "Aug 10", to: "Aug 16", days: 7, reason: "Vacation",        status: "approved", applied: "Aug 05" },
  { id: "LR-0039", empId: "EMP-004", empName: "Luisa Dupont",   dept: "Store",       type: "Casual",   from: "Aug 08", to: "Aug 08", days: 1, reason: "Personal",        status: "approved", applied: "Aug 07" },
  { id: "LR-0040", empId: "EMP-008", empName: "K. Nair",        dept: "Production",  type: "Sick",     from: "Aug 12", to: "Aug 13", days: 2, reason: "Fever",           status: "approved", applied: "Aug 11" },
  { id: "LR-0036", empId: "EMP-003", empName: "Kenji Tanaka",   dept: "Production",  type: "Comp-off", from: "Aug 02", to: "Aug 02", days: 1, reason: "Weekend work",    status: "rejected", applied: "Aug 01" },
  { id: "LR-0037", empId: "EMP-011", empName: "Tomás Reyes",    dept: "Production",  type: "Annual",   from: "Aug 14", to: "Aug 14", days: 1, reason: "Personal errand", status: "rejected", applied: "Aug 13" },
]

const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  { empId: "EMP-001", empName: "Juan Martinez",  dept: "Production",  date: "Aug 17", checkIn: "08:02", checkOut: "17:15", hours: "9h 13m", late: false, ot: "1h 15m", status: "present" },
  { empId: "EMP-002", empName: "Sarah Okonkwo",  dept: "HR",          date: "Aug 17", checkIn: "08:15", checkOut: "17:05", hours: "8h 50m", late: false, ot: "—",      status: "present" },
  { empId: "EMP-003", empName: "Kenji Tanaka",   dept: "Production",  date: "Aug 17", checkIn: "07:58", checkOut: "19:00", hours: "11h 02m", late: false, ot: "3h",    status: "present" },
  { empId: "EMP-004", empName: "Luisa Dupont",   dept: "Store",       date: "Aug 17", checkIn: "08:45", checkOut: "17:30", hours: "8h 45m", late: true,  ot: "—",      status: "present" },
  { empId: "EMP-005", empName: "Raj Patel",      dept: "Accounts",    date: "Aug 17", checkIn: "08:10", checkOut: "17:00", hours: "8h 50m", late: false, ot: "—",      status: "present" },
  { empId: "EMP-006", empName: "Marcus Schmidt", dept: "Production",  date: "Aug 17", checkIn: "—",     checkOut: "—",     hours: "—",      late: false, ot: "—",      status: "absent"  },
  { empId: "EMP-007", empName: "Priya Sharma",   dept: "Quality",     date: "Aug 17", checkIn: "08:01", checkOut: "17:00", hours: "8h 59m", late: false, ot: "—",      status: "present" },
  { empId: "EMP-008", empName: "K. Nair",        dept: "Production",  date: "Aug 17", checkIn: "20:00", checkOut: "—",     hours: "—",      late: false, ot: "—",      status: "present" },
  { empId: "EMP-009", empName: "Amir Hassan",    dept: "Maintenance", date: "Aug 17", checkIn: "08:05", checkOut: "18:30", hours: "10h 25m", late: false, ot: "2h 30m", status: "present" },
  { empId: "EMP-010", empName: "Divya Krishnan", dept: "Quality",     date: "Aug 17", checkIn: "—",     checkOut: "—",     hours: "—",      late: false, ot: "—",      status: "leave"   },
  { empId: "EMP-011", empName: "Tomás Reyes",    dept: "Production",  date: "Aug 17", checkIn: "08:00", checkOut: "17:00", hours: "9h 00m", late: false, ot: "—",      status: "present" },
  { empId: "EMP-012", empName: "Ananya Bose",    dept: "HR",          date: "Aug 17", checkIn: "08:20", checkOut: "17:10", hours: "8h 50m", late: false, ot: "—",      status: "present" },
]

const weekAttData = [
  { day: "Mon", present: 148, absent: 7  },
  { day: "Tue", present: 150, absent: 5  },
  { day: "Wed", present: 145, absent: 10 },
  { day: "Thu", present: 149, absent: 6  },
  { day: "Fri", present: 146, absent: 9  },
  { day: "Sat", present: 82,  absent: 3  },
  { day: "Sun", present: 0,   absent: 0  },
]

const monthAttData = [
  { week: "W1", rate: 95.5 }, { week: "W2", rate: 96.8 }, { week: "W3", rate: 94.2 },
]

/* ══════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════════════════════════ */

function Avatar({ initials, color, size = 32 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${color}22`, border: `1.5px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 700, color, fontFamily: "var(--font-mono)",
      flexShrink: 0, letterSpacing: "0.02em",
    }}>{initials}</div>
  )
}

function StatusBadge({ status }: { status: EmpStatus }) {
  const map: Record<EmpStatus, { label: string; color: string; bg: string }> = {
    active:    { label: "Active",    color: "var(--success)", bg: "var(--success-bg)" },
    "on-leave":{ label: "On Leave",  color: "var(--warning)", bg: "var(--warning-bg)" },
    inactive:  { label: "Inactive",  color: "var(--error)",   bg: "var(--error-bg)"   },
  }
  const s = map[status]
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, color: s.color,
      background: s.bg, border: `1px solid ${s.color}30`,
      borderRadius: "var(--radius-xs)", padding: "2px 7px",
      fontFamily: "var(--font-body)", letterSpacing: "0.04em",
      display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, display: "inline-block" }} />
      {s.label}
    </span>
  )
}

function LeaveBadge({ status }: { status: LeaveStatus }) {
  const map: Record<LeaveStatus, { label: string; color: string; bg: string }> = {
    pending:  { label: "Pending",  color: "var(--warning)", bg: "var(--warning-bg)" },
    approved: { label: "Approved", color: "var(--success)", bg: "var(--success-bg)" },
    rejected: { label: "Rejected", color: "var(--error)",   bg: "var(--error-bg)"   },
  }
  const s = map[status]
  return (
    <span style={{ fontSize: 10, fontWeight: 600, color: s.color, background: s.bg, border: `1px solid ${s.color}30`, borderRadius: "var(--radius-xs)", padding: "2px 7px", fontFamily: "var(--font-body)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  )
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" | "center" }) {
  return (
    <th style={{ padding: "9px 14px", textAlign: align, fontSize: 10, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-body)", borderBottom: "1px solid var(--border-default)", background: "var(--bg-elevated)", whiteSpace: "nowrap" }}>
      {children}
    </th>
  )
}

function Td({ children, mono = false }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--text-secondary)", fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", borderBottom: "1px solid var(--border-subtle)", verticalAlign: "middle" }}>
      {children}
    </td>
  )
}

function KpiStat({ label, value, color, icon, sub }: { label: string; value: string | number; color: string; icon?: React.ReactNode; sub?: string }) {
  return (
    <div style={{
      padding: "16px 18px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)", borderLeft: `3px solid ${color}`, position: "relative", overflow: "hidden",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 1px ${color}30`; (e.currentTarget as HTMLElement).style.borderColor = `${color}60` }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)" }}
    >
      <div style={{ position: "absolute", top: 0, right: 0, width: 64, height: 64, background: `radial-gradient(circle at top right, ${color}18 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 8 }}>{label}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 5 }}>{sub}</div>}
        </div>
        {icon && <div style={{ color, opacity: 0.6, marginTop: 2 }}>{icon}</div>}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "10px 0", borderBottom: "1px solid var(--border-subtle)" }}>
      <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 500, paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: 12, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{value}</span>
    </div>
  )
}

function FilterSelect({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder: string }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ padding: "0 12px", height: 34, background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: value ? "var(--text-primary)" : "var(--text-muted)", fontSize: 12, fontFamily: "var(--font-body)", cursor: "pointer", outline: "none", appearance: "none", paddingRight: 28, minWidth: 120 }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.value} value={o.value} style={{ background: "#141d2e" }}>{o.label}</option>)}
    </select>
  )
}

function DashTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-sm)", padding: "8px 12px", boxShadow: "var(--shadow-md)" }}>
      <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ fontSize: 11, color: p.color, fontFamily: "var(--font-mono)", display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span style={{ color: "var(--text-secondary)" }}>{p.name}</span><span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   ADD EMPLOYEE DRAWER
══════════════════════════════════════════════════════════════ */

function AddEmployeeDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", dept: "", designation: "", shift: "Day", type: "Full-time", phone: "" })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (!form.name || !form.email || !form.dept) return
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => { setSaved(false); onClose() }, 1200) }, 1000)
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "0 12px", height: 38, background: "var(--bg-raised)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" }
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", fontFamily: "var(--font-body)", display: "block", marginBottom: 5, letterSpacing: "0.04em" }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 290, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.2s ease" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(440px, 100vw)", background: "var(--bg-surface)", borderLeft: "1px solid var(--border-subtle)", zIndex: 291, transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-xl)" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>Add Employee</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>Fill in the details to create a new employee record</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", borderRadius: "var(--radius-sm)" }}>
            <XIcon size={14} />
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Full Name *", key: "name", placeholder: "e.g. Rajesh Kumar" },
              { label: "Work Email *", key: "email", placeholder: "name@acmecnc.com" },
              { label: "Phone", key: "phone", placeholder: "+91 98765 43210" },
              { label: "Designation", key: "designation", placeholder: "e.g. CNC Operator" },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input value={(form as Record<string, string>)[f.key]} onChange={set(f.key as keyof typeof form)} placeholder={f.placeholder} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Department *</label>
              <select value={form.dept} onChange={set("dept")} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                <option value="" style={{ background: "#141d2e" }}>Select department</option>
                {Object.keys(DEPT_COLORS).map(d => <option key={d} value={d} style={{ background: "#141d2e" }}>{d}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Shift</label>
                <select value={form.shift} onChange={set("shift")} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                  {["Day", "Evening", "Night"].map(s => <option key={s} value={s} style={{ background: "#141d2e" }}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Employment Type</label>
                <select value={form.type} onChange={set("type")} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                  {["Full-time", "Part-time", "Contract"].map(t => <option key={t} value={t} style={{ background: "#141d2e" }}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 10, flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, height: 38, background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || saved} style={{ flex: 2, height: 38, background: saved ? "var(--success)" : "var(--primary)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "default" : "pointer", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background 0.2s ease" }}>
            {saved ? <><CheckIcon size={14} /> Saved!</> : saving ? "Saving…" : "Add Employee"}
          </button>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   VIEW: EMPLOYEE DASHBOARD
══════════════════════════════════════════════════════════════ */

function EmployeeDashboard({ onNavigate, onViewList, onViewAttendance, onViewLeave }: { onNavigate: (id: string) => void; onViewList: () => void; onViewAttendance: () => void; onViewLeave: () => void }) {
  const total = EMPLOYEES.length
  const present = ATTENDANCE_RECORDS.filter(r => r.status === "present").length
  const absent = ATTENDANCE_RECORDS.filter(r => r.status === "absent").length
  const late = ATTENDANCE_RECORDS.filter(r => r.late).length
  const onLeave = EMPLOYEES.filter(e => e.status === "on-leave").length
  const ot = ATTENDANCE_RECORDS.filter(r => r.ot !== "—").length
  const pending = LEAVE_REQUESTS.filter(r => r.status === "pending").length

  const deptBreakdown = Object.entries(
    EMPLOYEES.reduce<Record<string, number>>((acc, e) => { acc[e.dept] = (acc[e.dept] ?? 0) + 1; return acc }, {})
  ).sort((a, b) => b[1] - a[1])

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader
        title="HR Dashboard"
        description="Workforce overview — Aug 17, 2026 · Day Shift"
        badge={{ label: "Live", variant: "success" }}
        accentColor="var(--success)"
        primaryAction={{ label: "Add Employee", onClick: onViewList, icon: <PlusIcon size={13} /> }}
        secondaryActions={[
          { label: "Attendance", onClick: onViewAttendance },
          { label: "Leave Requests", onClick: onViewLeave },
        ]}
      />

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 20 }} className="hr-kpi-grid">
        <KpiStat label="Total Employees" value={total}   color="var(--primary)" sub="12 departments" />
        <KpiStat label="Present Today"   value={present} color="var(--success)" sub={`${Math.round(present/total*100)}% rate`} />
        <KpiStat label="Absent"          value={absent}  color="var(--error)"   sub="1 unapproved" />
        <KpiStat label="Late Arrivals"   value={late}    color="var(--warning)" sub="After 08:30" />
        <KpiStat label="On Leave"        value={onLeave} color="var(--info)"    sub={`${pending} pending`} />
        <KpiStat label="Overtime"        value={ot}      color="var(--accent)"  sub="Employees today" />
      </div>

      {/* Charts + breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }} className="hr-charts-row">
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>Weekly Attendance</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>Week of Aug 11–17</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--success)" }}>95.2%</div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weekAttData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<DashTooltip />} />
              <Bar dataKey="present" name="Present" fill="var(--primary)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="absent"  name="Absent"  fill="rgba(239,68,68,0.5)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)", marginBottom: 14 }}>By Department</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {deptBreakdown.map(([dept, count]) => (
              <div key={dept}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{dept}</span>
                  <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: DEPT_COLORS[dept] ?? "var(--text-muted)" }}>{count}</span>
                </div>
                <div style={{ height: 4, background: "var(--bg-raised)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${(count / total) * 100}%`, background: DEPT_COLORS[dept] ?? "var(--primary)", borderRadius: 2, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="hr-bottom-row">
        {/* Late today */}
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>Late Today</div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--warning)", fontFamily: "var(--font-mono)" }}>{late} employees</span>
          </div>
          {ATTENDANCE_RECORDS.filter(r => r.late).map((r, i) => {
            const emp = EMPLOYEES.find(e => e.id === r.empId)!
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                <Avatar initials={emp.initials} color={emp.color} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.empName}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{r.dept} · IN {r.checkIn}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: "var(--warning)", fontFamily: "var(--font-mono)" }}>LATE</span>
              </div>
            )
          })}
          {late === 0 && <div style={{ padding: "24px 16px", textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>No late arrivals today</div>}
        </div>

        {/* Pending leave requests */}
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>Pending Leave Requests</div>
            <button onClick={onViewLeave} style={{ fontSize: 11, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>View all →</button>
          </div>
          {LEAVE_REQUESTS.filter(r => r.status === "pending").map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>{r.empName}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{r.type} · {r.from}{r.days > 1 ? ` – ${r.to}` : ""} · {r.days}d</div>
              </div>
              <LeaveBadge status="pending" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .hr-kpi-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .hr-charts-row { grid-template-columns: 1fr !important; }
          .hr-bottom-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .hr-kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   VIEW: EMPLOYEE LIST
══════════════════════════════════════════════════════════════ */

function EmployeeList({ onViewProfile }: { onViewProfile: (emp: Employee) => void }) {
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const PER_PAGE = 8

  const filtered = EMPLOYEES.filter(e => {
    const q = search.toLowerCase()
    const matchSearch = !search || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.designation.toLowerCase().includes(q)
    const matchDept = !deptFilter || e.dept === deptFilter
    const matchStatus = !statusFilter || e.status === statusFilter
    return matchSearch && matchDept && matchStatus
  })

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader
        title="Employees"
        description={`${EMPLOYEES.length} total employees across all departments`}
        badge={{ label: `${EMPLOYEES.filter(e => e.status === "active").length} Active`, variant: "success" }}
        accentColor="var(--success)"
        primaryAction={{ label: "Add Employee", onClick: () => setAddOpen(true), icon: <PlusIcon size={13} /> }}
      />

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", height: 34, background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)" }}>
          <SearchIcon size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name, ID, or designation…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}
          />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 0 }}><XIcon size={12} /></button>}
        </div>
        <FilterSelect value={deptFilter} onChange={v => { setDeptFilter(v); setPage(1) }} placeholder="All Departments" options={Object.keys(DEPT_COLORS).map(d => ({ value: d, label: d }))} />
        <FilterSelect value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1) }} placeholder="All Status" options={[{ value: "active", label: "Active" }, { value: "on-leave", label: "On Leave" }, { value: "inactive", label: "Inactive" }]} />
        {(search || deptFilter || statusFilter) && (
          <button onClick={() => { setSearch(""); setDeptFilter(""); setStatusFilter(""); setPage(1) }} style={{ padding: "0 12px", height: 34, fontSize: 12, color: "var(--text-muted)", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Clear
          </button>
        )}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", gap: 6, flexShrink: 0 }}>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{filtered.length}</span> employees
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Employee ID</Th>
                <Th>Employee</Th>
                <Th>Department</Th>
                <Th>Designation</Th>
                <Th>Shift</Th>
                <Th>Status</Th>
                <Th align="right">Attendance</Th>
                <Th align="center">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 28, color: "var(--text-muted)", marginBottom: 8 }}>◉</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>No employees match your filters</div>
                  </td>
                </tr>
              ) : pageData.map((emp) => {
                const attPct = Math.round((emp.attendance.present / 23) * 100)
                return (
                  <tr key={emp.id} style={{ transition: "background 0.1s ease" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-raised)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent" }}
                  >
                    <Td mono>{emp.id}</Td>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar initials={emp.initials} color={emp.color} size={30} />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{emp.name}</div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{emp.email}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <span style={{ fontSize: 11, fontWeight: 600, color: DEPT_COLORS[emp.dept] ?? "var(--primary)", background: `${DEPT_COLORS[emp.dept] ?? "var(--primary)"}15`, border: `1px solid ${DEPT_COLORS[emp.dept] ?? "var(--primary)"}25`, borderRadius: "var(--radius-xs)", padding: "2px 7px", whiteSpace: "nowrap" }}>
                        {emp.dept}
                      </span>
                    </Td>
                    <Td>{emp.designation}</Td>
                    <Td mono>{emp.shift}</Td>
                    <Td><StatusBadge status={emp.status} /></Td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                        <div style={{ width: 60, height: 4, background: "var(--bg-raised)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${attPct}%`, background: attPct >= 90 ? "var(--success)" : attPct >= 75 ? "var(--warning)" : "var(--error)", borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", minWidth: 32, textAlign: "right" }}>{attPct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button onClick={() => onViewProfile(emp)} style={{ fontSize: 10, color: "var(--primary)", background: "var(--primary-subtle)", border: "1px solid var(--primary)30", borderRadius: "var(--radius-xs)", padding: "3px 9px", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 500, whiteSpace: "nowrap" }}>
                          View
                        </button>
                        <button style={{ fontSize: 10, color: "var(--text-secondary)", background: "var(--bg-raised)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", padding: "3px 9px", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderTop: "1px solid var(--border-subtle)" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 30, height: 30, border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", background: "var(--bg-raised)", color: page === 1 ? "var(--text-muted)" : "var(--text-secondary)", cursor: page === 1 ? "default" : "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ width: 30, height: 30, border: `1px solid ${p === page ? "var(--primary)" : "var(--border-default)"}`, borderRadius: "var(--radius-xs)", background: p === page ? "var(--primary)" : "var(--bg-raised)", color: p === page ? "#fff" : "var(--text-secondary)", cursor: "pointer", fontSize: 12, fontFamily: "var(--font-mono)" }}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{ width: 30, height: 30, border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", background: "var(--bg-raised)", color: page === pages ? "var(--text-muted)" : "var(--text-secondary)", cursor: page === pages ? "default" : "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          </div>
        </div>
      </div>

      <AddEmployeeDrawer open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   VIEW: EMPLOYEE PROFILE
══════════════════════════════════════════════════════════════ */

type ProfileTab = "personal" | "employment" | "attendance" | "leave" | "documents"

function EmployeeProfile({ emp, onBack }: { emp: Employee; onBack: () => void }) {
  const [tab, setTab] = useState<ProfileTab>("personal")
  const attPct = Math.round((emp.attendance.present / 23) * 100)

  const months = ["Jun", "Jul", "Aug"]
  const attHistory = [
    { month: "Jun", present: 22, absent: 1, late: 0 },
    { month: "Jul", present: 21, absent: 2, late: 1 },
    { month: "Aug", present: emp.attendance.present, absent: emp.attendance.absent, late: emp.attendance.late },
  ]

  const DOCS = ["Offer Letter", "Joining Form", "ID Proof", "Address Proof", "PAN Card", "Photo"]

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader
        title={emp.name}
        description={`${emp.designation} · ${emp.dept}`}
        breadcrumbs={[{ label: "Employees", id: "employees-list" }, { label: emp.name }]}
        onNavigate={id => id === "employees-list" && onBack()}
        badge={{ label: emp.status === "active" ? "Active" : emp.status === "on-leave" ? "On Leave" : "Inactive", variant: emp.status === "active" ? "success" : emp.status === "on-leave" ? "warning" : "error" }}
        accentColor={emp.color}
        secondaryActions={[{ label: "Edit Profile", onClick: () => {} }, { label: "← Back", onClick: onBack }]}
      />

      {/* Profile hero card */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, padding: "20px 24px", background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", marginBottom: 20, alignItems: "center" }} className="profile-hero">
        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${emp.color}22`, border: `2px solid ${emp.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: emp.color, fontFamily: "var(--font-mono)" }}>
            {emp.initials}
          </div>
          <div style={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: emp.status === "active" ? "var(--success)" : "var(--warning)", border: "2px solid var(--bg-elevated)", boxShadow: emp.status === "active" ? "0 0 6px var(--success)" : "none" }} />
        </div>

        {/* Info */}
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text-primary)", marginBottom: 4 }}>{emp.name}</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>{emp.designation} · {emp.dept} · <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>{emp.id}</span></div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>📧 {emp.email}</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>📱 {emp.phone}</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>🕐 {emp.shift} Shift</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 20 }} className="profile-stats">
          {[
            { label: "Attendance", value: `${attPct}%`, color: attPct >= 90 ? "var(--success)" : "var(--warning)" },
            { label: "Present", value: `${emp.attendance.present}d`, color: "var(--primary)" },
            { label: "OT Hours", value: `${emp.attendance.ot * 1.5}h`, color: "var(--accent)" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, fontFamily: "var(--font-body)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)", marginBottom: 20, overflowX: "auto", scrollbarWidth: "none" }}>
        {(["personal", "employment", "attendance", "leave", "documents"] as ProfileTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "9px 18px", fontSize: 12, fontWeight: tab === t ? 600 : 400, color: tab === t ? "var(--primary)" : "var(--text-secondary)", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t ? "var(--primary)" : "transparent"}`, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "capitalize", marginBottom: -1, whiteSpace: "nowrap", transition: "color 0.12s ease" }}>
            {t === "personal" ? "Personal Info" : t === "employment" ? "Employment" : t === "attendance" ? "Attendance" : t === "leave" ? "Leave" : "Documents"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "personal" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="profile-tab-grid">
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Personal Information</div>
            <InfoRow label="Full Name" value={emp.name} />
            <InfoRow label="Date of Birth" value={emp.dob} />
            <InfoRow label="Phone" value={emp.phone} />
            <InfoRow label="Email" value={emp.email} />
            <InfoRow label="Address" value={emp.address} />
            <InfoRow label="Emergency Contact" value={emp.emergency} />
          </div>
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Quick Summary</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Monthly Attendance", value: `${attPct}%`, color: "var(--success)" },
                { label: "Days Present", value: `${emp.attendance.present} / 23` , color: "var(--primary)" },
                { label: "Days Absent", value: `${emp.attendance.absent}`, color: "var(--error)" },
                { label: "Late Arrivals", value: `${emp.attendance.late}`, color: "var(--warning)" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{s.label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "employment" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="profile-tab-grid">
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Employment Details</div>
            <InfoRow label="Employee ID" value={emp.id} />
            <InfoRow label="Joining Date" value={emp.joinDate} />
            <InfoRow label="Department" value={emp.dept} />
            <InfoRow label="Designation" value={emp.designation} />
            <InfoRow label="Grade" value={emp.grade} />
            <InfoRow label="Employment Type" value={emp.type} />
            <InfoRow label="Shift" value={`${emp.shift} Shift`} />
            <InfoRow label="Reporting To" value={emp.reportingTo} />
          </div>
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Leave Balances</div>
            {[
              { type: "Annual Leave", used: 15 - emp.leave.annual, total: 15, color: "var(--primary)" },
              { type: "Sick Leave",   used: 10 - emp.leave.sick,   total: 10, color: "var(--error)"   },
              { type: "Casual Leave", used: 5  - emp.leave.casual,  total: 5,  color: "var(--accent)"  },
            ].map(l => (
              <div key={l.type} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{l.type}</span>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: l.color }}>
                    {l.used} used / {l.total - l.used} remaining
                  </span>
                </div>
                <div style={{ height: 6, background: "var(--bg-raised)", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${(l.used / l.total) * 100}%`, background: l.color, borderRadius: 3, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "attendance" && (
        <div>
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>Monthly Attendance Summary</div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={attHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#4b5a72", fontFamily: "JetBrains Mono, monospace" }} axisLine={false} tickLine={false} />
                <Tooltip content={<DashTooltip />} />
                <Bar dataKey="present" name="Present" fill="var(--primary)"                  radius={[2, 2, 0, 0]} />
                <Bar dataKey="absent"  name="Absent"  fill="rgba(239,68,68,0.6)"             radius={[2, 2, 0, 0]} />
                <Bar dataKey="late"    name="Late"    fill="rgba(245,158,11,0.7)"             radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><Th>Month</Th><Th align="right">Present</Th><Th align="right">Absent</Th><Th align="right">Late</Th><Th align="right">OT</Th><Th align="right">Rate</Th></tr></thead>
              <tbody>{attHistory.map((r, i) => (
                <tr key={i}>
                  <Td mono>{r.month} 2026</Td>
                  <Td><span style={{ color: "var(--success)" }}>{r.present}</span></Td>
                  <Td><span style={{ color: "var(--error)" }}>{r.absent}</span></Td>
                  <Td><span style={{ color: "var(--warning)" }}>{r.late}</span></Td>
                  <Td mono>{i === 2 ? emp.attendance.ot : i === 1 ? 6 : 4}</Td>
                  <Td mono>{Math.round(r.present / 23 * 100)}%</Td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "leave" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }} className="leave-bal-grid">
            {[
              { type: "Annual Leave", bal: emp.leave.annual, total: 15, color: "var(--primary)" },
              { type: "Sick Leave",   bal: emp.leave.sick,   total: 10, color: "var(--error)"   },
              { type: "Casual Leave", bal: emp.leave.casual,  total: 5,  color: "var(--accent)"  },
            ].map(l => (
              <div key={l.type} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 16, borderLeft: `3px solid ${l.color}` }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{l.type}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 700, color: l.color }}>{l.bal}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>days remaining of {l.total}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border-subtle)", fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>Leave History</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><Th>Leave ID</Th><Th>Type</Th><Th>From</Th><Th>To</Th><Th align="right">Days</Th><Th>Reason</Th><Th>Status</Th></tr></thead>
              <tbody>
                {LEAVE_REQUESTS.filter(r => r.empId === emp.id).map((r, i) => (
                  <tr key={i}><Td mono>{r.id}</Td><Td>{r.type}</Td><Td mono>{r.from}</Td><Td mono>{r.to}</Td><Td mono>{r.days}</Td><Td>{r.reason}</Td><Td><LeaveBadge status={r.status} /></Td></tr>
                ))}
                {LEAVE_REQUESTS.filter(r => r.empId === emp.id).length === 0 && (
                  <tr><td colSpan={7} style={{ padding: "32px 16px", textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>No leave history for this employee</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "documents" && (
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>Documents</div>
            <button style={{ fontSize: 11, color: "var(--primary)", background: "var(--primary-subtle)", border: "1px solid var(--primary)30", borderRadius: "var(--radius-xs)", padding: "4px 10px", cursor: "pointer", fontFamily: "var(--font-body)" }}>
              + Upload
            </button>
          </div>
          {DOCS.map((doc, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", transition: "background 0.12s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-raised)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
            >
              <div style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)", background: "var(--bg-raised)", border: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                📄
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>{doc}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>PDF · Uploaded Jul 2026</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ fontSize: 10, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>View</button>
                <button style={{ fontSize: 10, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}>Download</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .profile-hero { grid-template-columns: auto 1fr auto !important; }
        .profile-tab-grid { grid-template-columns: 1fr 1fr; }
        .leave-bal-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) {
          .profile-hero { grid-template-columns: auto 1fr !important; }
          .profile-stats { display: none !important; }
          .profile-tab-grid { grid-template-columns: 1fr !important; }
          .leave-bal-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .leave-bal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   VIEW: ATTENDANCE MODULE
══════════════════════════════════════════════════════════════ */

type CheckinState = "out" | "in" | "done"

function AttendanceModule() {
  const [checkinState, setCheckinState] = useState<CheckinState>("out")
  const [checkinTime, setCheckinTime] = useState("")
  const [checkoutTime, setCheckoutTime] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [search, setSearch] = useState("")

  const now = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })

  const handleCheckin = () => {
    setCheckinTime(now())
    setCheckinState("in")
  }

  const handleCheckout = () => {
    setCheckoutTime(now())
    setCheckinState("done")
  }

  const filtered = ATTENDANCE_RECORDS.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = !search || r.empName.toLowerCase().includes(q) || r.empId.toLowerCase().includes(q)
    const matchStatus = !statusFilter || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const presentCount = ATTENDANCE_RECORDS.filter(r => r.status === "present").length
  const absentCount = ATTENDANCE_RECORDS.filter(r => r.status === "absent").length
  const lateCount = ATTENDANCE_RECORDS.filter(r => r.late).length
  const otCount = ATTENDANCE_RECORDS.filter(r => r.ot !== "—").length
  const leaveCount = ATTENDANCE_RECORDS.filter(r => r.status === "leave").length

  const statusLabel: Record<string, { label: string; color: string }> = {
    present: { label: "Present", color: "var(--success)" },
    absent:  { label: "Absent",  color: "var(--error)"   },
    "half-day": { label: "Half Day", color: "var(--warning)" },
    leave:   { label: "On Leave", color: "var(--info)"  },
  }

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader
        title="Attendance"
        description="Daily attendance tracking — Aug 17, 2026"
        badge={{ label: "Live", variant: "success" }}
        accentColor="var(--accent)"
        secondaryActions={[{ label: "Export", onClick: () => {} }, { label: "Reports", onClick: () => {} }]}
      />

      {/* Top row: check-in widget + stats */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, marginBottom: 20 }} className="att-top-row">
        {/* Check-in widget */}
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 20, display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body)", alignSelf: "flex-start" }}>Your Attendance</div>

          {/* Clock */}
          <div style={{ textAlign: "center" }}>
            <AttendanceClock />
          </div>

          {/* Check-in/out button */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            {checkinState === "out" && (
              <>
                <button
                  onClick={handleCheckin}
                  style={{ width: "100%", height: 46, background: "linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 2px 12px rgba(37,99,235,0.35)", transition: "box-shadow 0.15s ease" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(37,99,235,0.5)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 12px rgba(37,99,235,0.35)" }}
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10,17 15,12 10,7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  Check In
                </button>
                <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", textAlign: "center" }}>You haven't checked in yet today</div>
              </>
            )}

            {checkinState === "in" && (
              <>
                <div style={{ padding: "10px 14px", background: "var(--success-bg)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-sm)", width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--success)" }}>Checked In</div>
                    <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>Since {checkinTime}</div>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  style={{ width: "100%", height: 46, background: "var(--bg-raised)", border: "1px solid var(--error)", borderRadius: "var(--radius-sm)", color: "var(--error)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s ease" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--error-bg)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-raised)" }}
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Check Out
                </button>
              </>
            )}

            {checkinState === "done" && (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ padding: "10px 14px", background: "var(--bg-raised)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div><div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Check In</div><div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "var(--success)" }}>{checkinTime}</div></div>
                  <div><div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Check Out</div><div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "var(--error)" }}>{checkoutTime}</div></div>
                </div>
                <div style={{ fontSize: 11, color: "var(--success)", textAlign: "center", fontFamily: "var(--font-body)" }}>✓ Attendance recorded for today</div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }} className="att-stats">
          <KpiStat label="Present"  value={presentCount} color="var(--success)" sub={`${Math.round(presentCount / EMPLOYEES.length * 100)}%`} />
          <KpiStat label="Absent"   value={absentCount}  color="var(--error)"   sub="Today" />
          <KpiStat label="Late"     value={lateCount}    color="var(--warning)" sub="After 08:30" />
          <KpiStat label="On Leave" value={leaveCount}   color="var(--info)"    sub="Approved" />
          <KpiStat label="Overtime" value={otCount}      color="var(--accent)"  sub="Employees" />
        </div>
      </div>

      {/* Attendance Table */}
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", gap: 10, padding: "12px 14px", borderBottom: "1px solid var(--border-subtle)", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", height: 32, background: "var(--bg-raised)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-sm)" }}>
            <SearchIcon size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employee…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: "var(--text-primary)", fontFamily: "var(--font-body)" }} />
          </div>
          <FilterSelect value={statusFilter} onChange={setStatusFilter} placeholder="All Status" options={[{ value: "present", label: "Present" }, { value: "absent", label: "Absent" }, { value: "leave", label: "On Leave" }]} />
          <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center" }}>
            Aug 17, 2026
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Employee</Th>
                <Th>Department</Th>
                <Th>Check In</Th>
                <Th>Check Out</Th>
                <Th align="right">Working Hrs</Th>
                <Th align="center">Late</Th>
                <Th>Overtime</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const emp = EMPLOYEES.find(e => e.id === r.empId)!
                const s = statusLabel[r.status]
                return (
                  <tr key={i} style={{ transition: "background 0.1s ease" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-raised)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent" }}
                  >
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar initials={emp.initials} color={emp.color} size={26} />
                        <div>
                          <div style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>{r.empName}</div>
                          <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{r.empId}</div>
                        </div>
                      </div>
                    </Td>
                    <Td><span style={{ fontSize: 10, color: DEPT_COLORS[r.dept] ?? "var(--text-muted)" }}>{r.dept}</span></Td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-mono)", fontSize: 12, color: r.checkIn === "—" ? "var(--text-muted)" : r.late ? "var(--warning)" : "var(--success)" }}>{r.checkIn}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-mono)", fontSize: 12, color: r.checkOut === "—" ? "var(--text-muted)" : "var(--text-secondary)" }}>{r.checkOut}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-primary)", textAlign: "right", fontWeight: 500 }}>{r.hours}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)", textAlign: "center" }}>
                      {r.late ? <span style={{ fontSize: 9, fontWeight: 700, color: "var(--warning)", background: "var(--warning-bg)", border: "1px solid var(--warning-border)", borderRadius: "var(--radius-xs)", padding: "2px 6px" }}>LATE</span> : <span style={{ fontSize: 10, color: "var(--text-muted)" }}>—</span>}
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-mono)", fontSize: 12, color: r.ot !== "—" ? "var(--accent)" : "var(--text-muted)" }}>{r.ot}</td>
                    <Td>
                      <span style={{ fontSize: 10, fontWeight: 600, color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}30`, borderRadius: "var(--radius-xs)", padding: "2px 7px", fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>{s.label}</span>
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .att-top-row { grid-template-columns: 300px 1fr !important; }
        .att-stats { grid-template-columns: repeat(5, 1fr) !important; }
        @media (max-width: 1100px) {
          .att-top-row { grid-template-columns: 1fr !important; }
          .att-stats { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .att-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}

/* Live clock for check-in widget */
function AttendanceClock() {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }))
      setDate(now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>{time}</div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginTop: 6 }}>{date}</div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   VIEW: LEAVE MANAGEMENT
══════════════════════════════════════════════════════════════ */

function LeaveModule() {
  const [tab, setTab] = useState<"pending" | "history">("pending")
  const [leaveStatuses, setLeaveStatuses] = useState<Record<string, LeaveStatus>>({})
  const [deptFilter, setDeptFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  const getStatus = (req: LeaveRequest): LeaveStatus => leaveStatuses[req.id] ?? req.status

  const approve = (id: string) => setLeaveStatuses(s => ({ ...s, [id]: "approved" }))
  const reject  = (id: string) => setLeaveStatuses(s => ({ ...s, [id]: "rejected" }))

  const pending = LEAVE_REQUESTS.filter(r => getStatus(r) === "pending")
  const history = LEAVE_REQUESTS.filter(r => getStatus(r) !== "pending")
    .filter(r => (!deptFilter || r.dept === deptFilter) && (!typeFilter || r.type === typeFilter))

  const typeColor: Record<LeaveType, string> = {
    Annual: "var(--primary)", Sick: "var(--error)", Casual: "var(--accent)", "Comp-off": "var(--warning)",
  }

  return (
    <div style={{ animation: "fade-in 0.25s ease-out" }}>
      <PageHeader
        title="Leave Management"
        description={`${pending.length} pending approvals`}
        badge={{ label: pending.length > 0 ? `${pending.length} Pending` : "All Clear", variant: pending.length > 0 ? "warning" : "success" }}
        accentColor="var(--warning)"
        secondaryActions={[{ label: "Export", onClick: () => {} }]}
      />

      {/* Leave balance summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }} className="leave-kpi">
        <KpiStat label="Total Requests (Aug)"  value={LEAVE_REQUESTS.length} color="var(--primary)" sub="All types" />
        <KpiStat label="Pending"               value={pending.length}         color="var(--warning)" sub="Needs action" />
        <KpiStat label="Approved"              value={LEAVE_REQUESTS.filter(r => getStatus(r) === "approved").length} color="var(--success)" sub="This month" />
        <KpiStat label="Rejected"              value={LEAVE_REQUESTS.filter(r => getStatus(r) === "rejected").length} color="var(--error)"   sub="This month" />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)", marginBottom: 16 }}>
        {[{ id: "pending" as const, label: `Pending Approvals (${pending.length})` }, { id: "history" as const, label: "Leave History" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 18px", fontSize: 12, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? "var(--warning)" : "var(--text-secondary)", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? "var(--warning)" : "transparent"}`, cursor: "pointer", fontFamily: "var(--font-body)", marginBottom: -1, transition: "color 0.12s ease" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pending" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pending.length === 0 && (
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>All caught up!</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>No pending leave requests require your attention.</div>
            </div>
          )}
          {pending.map((req) => (
            <div key={req.id} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 16, display: "flex", gap: 16, alignItems: "flex-start", transition: "border-color 0.15s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)" }}
            >
              {/* Emp info */}
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${EMPLOYEES.find(e => e.id === req.empId)?.color ?? "var(--primary)"}22`, border: `1.5px solid ${EMPLOYEES.find(e => e.id === req.empId)?.color ?? "var(--primary)"}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: EMPLOYEES.find(e => e.id === req.empId)?.color ?? "var(--primary)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
                {EMPLOYEES.find(e => e.id === req.empId)?.initials}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 5, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{req.empName}</span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{req.empId}</span>
                  <span style={{ fontSize: 10, color: DEPT_COLORS[req.dept] ?? "var(--text-muted)" }}>{req.dept}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: typeColor[req.type], background: `${typeColor[req.type]}18`, border: `1px solid ${typeColor[req.type]}30`, borderRadius: "var(--radius-xs)", padding: "1px 6px", fontFamily: "var(--font-body)" }}>{req.type} Leave</span>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>📅 {req.from}{req.days > 1 ? ` – ${req.to}` : ""}</span>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>🕐 {req.days} {req.days === 1 ? "day" : "days"}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Applied: {req.applied}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic", fontFamily: "var(--font-body)" }}>"{req.reason}"</div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => approve(req.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "var(--success)", background: "var(--success-bg)", border: "1px solid var(--success-border)", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s ease", whiteSpace: "nowrap" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.2)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--success-bg)" }}
                >
                  <CheckIcon size={12} /> Approve
                </button>
                <button onClick={() => reject(req.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "var(--error)", background: "var(--error-bg)", border: "1px solid var(--error-border)", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s ease", whiteSpace: "nowrap" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.2)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--error-bg)" }}
                >
                  <XIcon size={12} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "history" && (
        <div>
          {/* Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <FilterSelect value={deptFilter} onChange={setDeptFilter} placeholder="All Departments" options={Object.keys(DEPT_COLORS).map(d => ({ value: d, label: d }))} />
            <FilterSelect value={typeFilter} onChange={setTypeFilter} placeholder="All Types" options={[{ value: "Annual", label: "Annual" }, { value: "Sick", label: "Sick" }, { value: "Casual", label: "Casual" }, { value: "Comp-off", label: "Comp-off" }]} />
          </div>

          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr><Th>Ref</Th><Th>Employee</Th><Th>Department</Th><Th>Type</Th><Th>From</Th><Th>To</Th><Th align="right">Days</Th><Th>Applied</Th><Th>Status</Th></tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr><td colSpan={9} style={{ padding: "32px 16px", textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>No leave history matching filters</td></tr>
                  ) : history.map((req) => (
                    <tr key={req.id} style={{ transition: "background 0.1s ease" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-raised)" }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent" }}
                    >
                      <Td mono>{req.id}</Td>
                      <Td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Avatar initials={EMPLOYEES.find(e => e.id === req.empId)?.initials ?? "?"} color={EMPLOYEES.find(e => e.id === req.empId)?.color ?? "var(--primary)"} size={24} />
                          <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>{req.empName}</span>
                        </div>
                      </Td>
                      <Td><span style={{ fontSize: 10, color: DEPT_COLORS[req.dept] ?? "var(--text-muted)" }}>{req.dept}</span></Td>
                      <Td>
                        <span style={{ fontSize: 10, fontWeight: 600, color: typeColor[req.type], background: `${typeColor[req.type]}18`, border: `1px solid ${typeColor[req.type]}30`, borderRadius: "var(--radius-xs)", padding: "2px 7px" }}>{req.type}</span>
                      </Td>
                      <Td mono>{req.from}</Td>
                      <Td mono>{req.to}</Td>
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-primary)", fontWeight: 600 }}>{req.days}</td>
                      <Td mono>{req.applied}</Td>
                      <Td><LeaveBadge status={getStatus(req)} /></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .leave-kpi { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1100px) { .leave-kpi { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .leave-kpi { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MODULE ROUTER
══════════════════════════════════════════════════════════════ */

type HRView = "dashboard" | "employees" | "profile" | "attendance" | "leave"

interface HRModuleProps {
  initialView?: HRView
  onNavigate: (id: string) => void
}

export function HRModule({ initialView = "dashboard", onNavigate }: HRModuleProps) {
  const [view, setView] = useState<HRView>(initialView)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  useEffect(() => { setView(initialView) }, [initialView])

  const goProfile = (emp: Employee) => { setSelectedEmployee(emp); setView("profile") }
  const goBack    = ()             => setView("employees")

  return (
    <div>
      {view === "dashboard" && (
        <EmployeeDashboard
          onNavigate={onNavigate}
          onViewList={()       => setView("employees")}
          onViewAttendance={() => setView("attendance")}
          onViewLeave={()      => setView("leave")}
        />
      )}
      {view === "employees" && (
        <EmployeeList onViewProfile={goProfile} />
      )}
      {view === "profile" && selectedEmployee && (
        <EmployeeProfile emp={selectedEmployee} onBack={goBack} />
      )}
      {view === "attendance" && <AttendanceModule />}
      {view === "leave" && <LeaveModule />}
    </div>
  )
}
