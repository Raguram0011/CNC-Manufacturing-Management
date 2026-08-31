import React, { useState, useEffect, useCallback } from "react"
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { PageHeader } from "../shell/PageHeader"
import { PlusIcon, SearchIcon, XIcon, CheckIcon } from "../shell/Icons"

/* ─── Icons ───────────────────────────────────────────────── */
const BoxIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const TruckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)
const ArrowDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
  </svg>
)
const ArrowUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
)
const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18h20.36z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const LayersIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
)
const ToolIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
)
const ZapIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const BackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const EyeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const PurchaseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const StarIcon = ({ fill }: { fill?: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

/* ─── Types ───────────────────────────────────────────────── */
export type StoreView = "dashboard" | "inventory" | "material-detail" | "purchase" | "purchase-detail" | "purchase-create" | "suppliers" | "supplier-detail" | "material-issue" | "issue-create"

type TxType = "in" | "out" | "return" | "adjustment" | "scrap"
type POStatus = "draft" | "sent" | "partial" | "received" | "cancelled"
type IssueStatus = "pending" | "issued" | "partial_return" | "returned"
type MatCategory = "raw_material" | "cutting_tool" | "consumable" | "fastener" | "measuring" | "safety"

interface Material {
  id: string; code: string; name: string; category: MatCategory
  unit: string; currentQty: number; minQty: number; maxQty: number
  unitPrice: number; location: string; supplierId: string; hsnCode: string; lastUpdated: string
}

interface StockTx {
  id: string; materialId: string; type: TxType; qty: number
  date: string; reference: string; remarks: string; by: string; balance: number
}

interface Supplier {
  id: string; code: string; name: string; contact: string
  email: string; phone: string; address: string; gst: string
  category: string; rating: number; status: "active" | "inactive"
  paymentTerms: string; leadDays: number
}

interface POItem { id: string; materialId: string; materialName: string; unit: string; orderedQty: number; receivedQty: number; rate: number }

interface PurchaseOrder {
  id: string; number: string; supplierId: string; supplierName: string
  date: string; expectedDate: string; items: POItem[]
  status: POStatus; total: number; remarks: string
}

interface MaterialIssue {
  id: string; issueNumber: string; productionOrder: string
  materialId: string; materialName: string; unit: string
  requestedQty: number; issuedQty: number; returnQty: number
  issuedBy: string; date: string; status: IssueStatus; remarks: string
}

/* ─── Data ────────────────────────────────────────────────── */
const SUPPLIERS: Supplier[] = [
  { id: "s1", code: "SUP-001", name: "Hindalco Industries Ltd.",      contact: "Rajan Mehta",    email: "rajan@hindalco.com",       phone: "+91 22 6691 7000", address: "Century Bhavan, Dr Annie Besant Rd, Worli, Mumbai - 400030", gst: "27AAACH3936N1ZS", category: "Raw Material",  rating: 5, status: "active", paymentTerms: "Net 30", leadDays: 7  },
  { id: "s2", code: "SUP-002", name: "Sandvik Coromant India Pvt.",   contact: "Priya Sharma",   email: "priya@sandvik.com",         phone: "+91 80 4116 5200", address: "Bagmane Tech Park, CV Raman Nagar, Bengaluru - 560093",     gst: "29AABCS7821P1ZK", category: "Cutting Tools", rating: 5, status: "active", paymentTerms: "Net 45", leadDays: 5  },
  { id: "s3", code: "SUP-003", name: "Castrol India Ltd.",            contact: "Arvind Rao",     email: "arvind@castrol.com",        phone: "+91 22 6697 2000", address: "Technopolis Knowledge Park, Mahape, Navi Mumbai - 400710", gst: "27AAACC5082Q1ZT", category: "Consumable",   rating: 4, status: "active", paymentTerms: "Net 30", leadDays: 3  },
  { id: "s4", code: "SUP-004", name: "Jindal Stainless Ltd.",         contact: "Suresh Kumar",   email: "suresh@jindalssl.com",      phone: "+91 124 4783 000", address: "O.P. Jindal Marg, Hisar - 125005, Haryana",                gst: "06AAACJ6219H1ZV", category: "Raw Material",  rating: 4, status: "active", paymentTerms: "Net 30", leadDays: 10 },
  { id: "s5", code: "SUP-005", name: "Mitutoyo South Asia Pvt. Ltd.",contact: "Kenji Nakamura", email: "kenji@mitutoyo.in",         phone: "+91 80 2372 9600", address: "3rd Cross, Peenya Industrial Area, Bengaluru - 560058",    gst: "29AABCM4912R1ZH", category: "Measuring",     rating: 5, status: "active", paymentTerms: "Net 60", leadDays: 14 },
]

const MATERIALS: Material[] = [
  { id: "m01", code: "RM-001", name: "AL6061-T6 Round Bar Ø50mm",       category: "raw_material", unit: "kg",  currentQty: 285,  minQty: 100,  maxQty: 500,  unitPrice: 320,  location: "R-A1-S1", supplierId: "s1", hsnCode: "7604", lastUpdated: "2024-08-14" },
  { id: "m02", code: "RM-002", name: "EN36 Alloy Steel Plate 20mm",      category: "raw_material", unit: "kg",  currentQty: 42,   minQty: 100,  maxQty: 400,  unitPrice: 85,   location: "R-A1-S2", supplierId: "s4", hsnCode: "7208", lastUpdated: "2024-08-12" },
  { id: "m03", code: "RM-003", name: "SS304 Round Bar Ø30mm",            category: "raw_material", unit: "kg",  currentQty: 168,  minQty: 80,   maxQty: 300,  unitPrice: 420,  location: "R-A2-S1", supplierId: "s4", hsnCode: "7222", lastUpdated: "2024-08-13" },
  { id: "m04", code: "RM-004", name: "MS Flat Bar 40x10mm L=6m",         category: "raw_material", unit: "pcs", currentQty: 24,   minQty: 20,   maxQty: 80,   unitPrice: 280,  location: "R-A2-S2", supplierId: "s4", hsnCode: "7216", lastUpdated: "2024-08-10" },
  { id: "m05", code: "RM-005", name: "Ti6Al4V Titanium Bar Ø20mm",       category: "raw_material", unit: "kg",  currentQty: 12,   minQty: 10,   maxQty: 50,   unitPrice: 4800, location: "R-A3-S1", supplierId: "s4", hsnCode: "8108", lastUpdated: "2024-08-08" },
  { id: "m06", code: "CT-001", name: "Carbide End Mill Ø10mm 4-Flute",   category: "cutting_tool", unit: "pcs", currentQty: 48,   minQty: 20,   maxQty: 100,  unitPrice: 850,  location: "R-B1-S1", supplierId: "s2", hsnCode: "8207", lastUpdated: "2024-08-15" },
  { id: "m07", code: "CT-002", name: "Carbide Drill Ø6mm TiN Coated",    category: "cutting_tool", unit: "pcs", currentQty: 92,   minQty: 30,   maxQty: 150,  unitPrice: 320,  location: "R-B1-S2", supplierId: "s2", hsnCode: "8207", lastUpdated: "2024-08-15" },
  { id: "m08", code: "CT-003", name: "Insert CNMG120408-MR Grade IC907", category: "cutting_tool", unit: "pcs", currentQty: 8,    minQty: 20,   maxQty: 80,   unitPrice: 680,  location: "R-B2-S1", supplierId: "s2", hsnCode: "8207", lastUpdated: "2024-08-11" },
  { id: "m09", code: "CT-004", name: "SCLCR Boring Bar 16mm Shank",      category: "cutting_tool", unit: "pcs", currentQty: 6,    minQty: 4,    maxQty: 16,   unitPrice: 2800, location: "R-B2-S2", supplierId: "s2", hsnCode: "8207", lastUpdated: "2024-08-09" },
  { id: "m10", code: "CN-001", name: "Castrol Alusol XBB Coolant 20L",   category: "consumable",   unit: "drum",currentQty: 4,    minQty: 5,    maxQty: 20,   unitPrice: 3200, location: "R-C1-S1", supplierId: "s3", hsnCode: "3820", lastUpdated: "2024-08-16" },
  { id: "m11", code: "CN-002", name: "Cutting Oil Servo 220 (5L)",        category: "consumable",   unit: "can", currentQty: 22,   minQty: 10,   maxQty: 40,   unitPrice: 680,  location: "R-C1-S2", supplierId: "s3", hsnCode: "2710", lastUpdated: "2024-08-14" },
  { id: "m12", code: "FA-001", name: "M8 Hex Bolt SS DIN931 L=30mm",     category: "fastener",     unit: "pcs", currentQty: 850,  minQty: 500,  maxQty: 2000, unitPrice: 4.5,  location: "R-D1-S1", supplierId: "s4", hsnCode: "7318", lastUpdated: "2024-08-12" },
  { id: "m13", code: "FA-002", name: "M6 Socket Cap Screw 12.9 L=20mm",  category: "fastener",     unit: "pcs", currentQty: 320,  minQty: 200,  maxQty: 1000, unitPrice: 3.8,  location: "R-D1-S2", supplierId: "s4", hsnCode: "7318", lastUpdated: "2024-08-12" },
  { id: "m14", code: "ME-001", name: "Mitutoyo Micrometer 0-25mm 0.001", category: "measuring",    unit: "pcs", currentQty: 4,    minQty: 2,    maxQty: 8,    unitPrice: 8500, location: "R-E1-S1", supplierId: "s5", hsnCode: "9010", lastUpdated: "2024-07-20" },
  { id: "m15", code: "ME-002", name: "Vernier Caliper 0-150mm 0.02",     category: "measuring",    unit: "pcs", currentQty: 6,    minQty: 3,    maxQty: 12,   unitPrice: 2200, location: "R-E1-S2", supplierId: "s5", hsnCode: "9010", lastUpdated: "2024-07-20" },
]

const STOCK_TXS: StockTx[] = [
  { id: "tx01", materialId: "m01", type: "in",         qty: 200,  date: "2024-08-01", reference: "PO-2024-0041",   remarks: "Received from Hindalco",              by: "Luisa Dupont",  balance: 285 },
  { id: "tx02", materialId: "m01", type: "out",        qty: 45,   date: "2024-08-02", reference: "WO-0839",         remarks: "Issued for WO-0839 Shaft turning",    by: "Luisa Dupont",  balance: 240 },
  { id: "tx03", materialId: "m02", type: "in",         qty: 150,  date: "2024-07-28", reference: "PO-2024-0038",   remarks: "Received from Jindal",                by: "Luisa Dupont",  balance: 192 },
  { id: "tx04", materialId: "m02", type: "out",        qty: 80,   date: "2024-08-05", reference: "WO-0835",         remarks: "Issued for milling job WO-0835",      by: "Luisa Dupont",  balance: 112 },
  { id: "tx05", materialId: "m02", type: "out",        qty: 70,   date: "2024-08-11", reference: "WO-0841",         remarks: "Issued for WO-0841 plate ops",        by: "Luisa Dupont",  balance: 42  },
  { id: "tx06", materialId: "m08", type: "out",        qty: 12,   date: "2024-08-11", reference: "WO-0840",         remarks: "Issued to CNC-003 operator",          by: "Luisa Dupont",  balance: 8   },
  { id: "tx07", materialId: "m10", type: "out",        qty: 1,    date: "2024-08-10", reference: "CNC-001",         remarks: "Coolant refill CNC-001",              by: "Luisa Dupont",  balance: 4   },
  { id: "tx08", materialId: "m06", type: "in",         qty: 30,   date: "2024-08-08", reference: "PO-2024-0039",   remarks: "Received from Sandvik",               by: "Luisa Dupont",  balance: 48  },
  { id: "tx09", materialId: "m03", type: "return",     qty: 8,    date: "2024-08-09", reference: "ISS-2024-0088",  remarks: "Returned unused from WO-0838",        by: "Luisa Dupont",  balance: 168 },
  { id: "tx10", materialId: "m07", type: "scrap",      qty: 5,    date: "2024-08-13", reference: "SCR-2024-014",   remarks: "Broken drills – tool life exceeded",  by: "Luisa Dupont",  balance: 92  },
  { id: "tx11", materialId: "m01", type: "adjustment", qty: -5,   date: "2024-08-14", reference: "ADJ-2024-003",   remarks: "Physical count variance correction",  by: "Luisa Dupont",  balance: 285 },
]

const PO_ITEMS: Record<string, POItem[]> = {
  "po1": [
    { id: "a", materialId: "m01", materialName: "AL6061-T6 Round Bar Ø50mm",     unit: "kg",  orderedQty: 200, receivedQty: 200, rate: 320  },
    { id: "b", materialId: "m03", materialName: "SS304 Round Bar Ø30mm",          unit: "kg",  orderedQty: 100, receivedQty: 100, rate: 420  },
  ],
  "po2": [
    { id: "a", materialId: "m06", materialName: "Carbide End Mill Ø10mm 4-Flute",unit: "pcs", orderedQty: 30,  receivedQty: 30,  rate: 850  },
    { id: "b", materialId: "m07", materialName: "Carbide Drill Ø6mm TiN Coated", unit: "pcs", orderedQty: 50,  receivedQty: 50,  rate: 320  },
    { id: "c", materialId: "m08", materialName: "Insert CNMG120408-MR IC907",     unit: "pcs", orderedQty: 20,  receivedQty: 20,  rate: 680  },
  ],
  "po3": [
    { id: "a", materialId: "m10", materialName: "Castrol Alusol XBB Coolant 20L",unit: "drum",orderedQty: 5,   receivedQty: 5,   rate: 3200 },
    { id: "b", materialId: "m11", materialName: "Cutting Oil Servo 220 (5L)",     unit: "can", orderedQty: 10,  receivedQty: 10,  rate: 680  },
  ],
  "po4": [
    { id: "a", materialId: "m02", materialName: "EN36 Alloy Steel Plate 20mm",    unit: "kg",  orderedQty: 200, receivedQty: 0,   rate: 85   },
    { id: "b", materialId: "m04", materialName: "MS Flat Bar 40x10mm L=6m",       unit: "pcs", orderedQty: 20,  receivedQty: 0,   rate: 280  },
  ],
  "po5": [
    { id: "a", materialId: "m08", materialName: "Insert CNMG120408-MR IC907",     unit: "pcs", orderedQty: 40,  receivedQty: 0,   rate: 680  },
    { id: "b", materialId: "m09", materialName: "SCLCR Boring Bar 16mm Shank",    unit: "pcs", orderedQty: 4,   receivedQty: 0,   rate: 2800 },
  ],
}

function poTotal(items: POItem[]) {
  return items.reduce((s, it) => s + it.orderedQty * it.rate, 0)
}

const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: "po1", number: "PO-2024-0041", supplierId: "s1", supplierName: "Hindalco Industries Ltd.",    date: "2024-07-30", expectedDate: "2024-08-06", items: PO_ITEMS.po1, status: "received",  total: poTotal(PO_ITEMS.po1), remarks: "Regular monthly procurement" },
  { id: "po2", number: "PO-2024-0039", supplierId: "s2", supplierName: "Sandvik Coromant India Pvt.", date: "2024-08-02", expectedDate: "2024-08-07", items: PO_ITEMS.po2, status: "received",  total: poTotal(PO_ITEMS.po2), remarks: "Cutting tool replenishment" },
  { id: "po3", number: "PO-2024-0040", supplierId: "s3", supplierName: "Castrol India Ltd.",          date: "2024-08-05", expectedDate: "2024-08-08", items: PO_ITEMS.po3, status: "received",  total: poTotal(PO_ITEMS.po3), remarks: "Consumables reorder" },
  { id: "po4", number: "PO-2024-0042", supplierId: "s4", supplierName: "Jindal Stainless Ltd.",       date: "2024-08-12", expectedDate: "2024-08-22", items: PO_ITEMS.po4, status: "sent",      total: poTotal(PO_ITEMS.po4), remarks: "EN36 steel urgently required" },
  { id: "po5", number: "PO-2024-0043", supplierId: "s2", supplierName: "Sandvik Coromant India Pvt.", date: "2024-08-14", expectedDate: "2024-08-19", items: PO_ITEMS.po5, status: "draft",     total: poTotal(PO_ITEMS.po5), remarks: "Pending approval" },
]

const MATERIAL_ISSUES: MaterialIssue[] = [
  { id: "mi01", issueNumber: "ISS-2024-0089", productionOrder: "WO-0841", materialId: "m01", materialName: "AL6061-T6 Round Bar Ø50mm",      unit: "kg",  requestedQty: 45,  issuedQty: 45,  returnQty: 0,  issuedBy: "Luisa Dupont", date: "2024-08-12", status: "issued",         remarks: "CNC turning job batch-22" },
  { id: "mi02", issueNumber: "ISS-2024-0088", productionOrder: "WO-0838", materialId: "m03", materialName: "SS304 Round Bar Ø30mm",            unit: "kg",  requestedQty: 30,  issuedQty: 30,  returnQty: 8,  issuedBy: "Luisa Dupont", date: "2024-08-09", status: "returned",       remarks: "Return: excess material" },
  { id: "mi03", issueNumber: "ISS-2024-0090", productionOrder: "WO-0841", materialId: "m06", materialName: "Carbide End Mill Ø10mm 4-Flute",   unit: "pcs", requestedQty: 5,   issuedQty: 5,   returnQty: 0,  issuedBy: "Luisa Dupont", date: "2024-08-12", status: "issued",         remarks: "Finish milling ops" },
  { id: "mi04", issueNumber: "ISS-2024-0091", productionOrder: "WO-0841", materialId: "m08", materialName: "Insert CNMG120408-MR IC907",        unit: "pcs", requestedQty: 15,  issuedQty: 12,  returnQty: 0,  issuedBy: "Luisa Dupont", date: "2024-08-11", status: "partial_return", remarks: "Shortage — awaiting PO" },
  { id: "mi05", issueNumber: "ISS-2024-0086", productionOrder: "WO-0836", materialId: "m02", materialName: "EN36 Alloy Steel Plate 20mm",       unit: "kg",  requestedQty: 80,  issuedQty: 80,  returnQty: 0,  issuedBy: "Luisa Dupont", date: "2024-08-05", status: "issued",         remarks: "" },
  { id: "mi06", issueNumber: "ISS-2024-0092", productionOrder: "WO-0842", materialId: "m01", materialName: "AL6061-T6 Round Bar Ø50mm",         unit: "kg",  requestedQty: 60,  issuedQty: 0,   returnQty: 0,  issuedBy: "",             date: "2024-08-13", status: "pending",        remarks: "Awaiting store approval" },
  { id: "mi07", issueNumber: "ISS-2024-0087", productionOrder: "WO-0839", materialId: "m07", materialName: "Carbide Drill Ø6mm TiN Coated",     unit: "pcs", requestedQty: 20,  issuedQty: 20,  returnQty: 0,  issuedBy: "Luisa Dupont", date: "2024-08-07", status: "issued",         remarks: "" },
  { id: "mi08", issueNumber: "ISS-2024-0093", productionOrder: "WO-0842", materialId: "m12", materialName: "M8 Hex Bolt SS DIN931 L=30mm",      unit: "pcs", requestedQty: 100, issuedQty: 0,   returnQty: 0,  issuedBy: "",             date: "2024-08-13", status: "pending",        remarks: "Assembly dept request" },
]

const PRODUCTION_ORDERS = [
  { id: "WO-0841", description: "Hydraulic Housing - 45 pcs" },
  { id: "WO-0842", description: "Gear Bracket Assembly - 30 pcs" },
  { id: "WO-0843", description: "Shaft Turning Batch-23 - 120 pcs" },
]

/* ─── Trend chart data ─────────────────────────────────────── */
const STOCK_TREND = [
  { month: "Mar", value: 3820000 }, { month: "Apr", value: 4120000 },
  { month: "May", value: 3680000 }, { month: "Jun", value: 4350000 },
  { month: "Jul", value: 3950000 }, { month: "Aug", value: 4180000 },
]
const INOUT_TREND = [
  { month: "Mar", in: 1820000, out: 1540000 },
  { month: "Apr", in: 2100000, out: 1880000 },
  { month: "May", in: 1650000, out: 1920000 },
  { month: "Jun", in: 2280000, out: 2050000 },
  { month: "Jul", in: 1980000, out: 2140000 },
  { month: "Aug", in: 2350000, out: 1780000 },
]

/* ─── Utilities ───────────────────────────────────────────── */
function fCur(n: number, compact = false): string {
  if (compact) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`
    if (n >= 100000)   return `₹${(n / 100000).toFixed(2)}L`
    if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`
    return `₹${n.toLocaleString("en-IN")}`
  }
  return `₹${n.toLocaleString("en-IN")}`
}
function fDate(d: string): string {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}
function fQty(n: number, unit: string) { return `${n.toLocaleString("en-IN")} ${unit}` }

type StockLevel = "critical" | "low" | "adequate" | "ok"

function stockLevel(mat: Material): StockLevel {
  if (mat.currentQty <= mat.minQty * 0.5) return "critical"
  if (mat.currentQty <= mat.minQty)       return "low"
  if (mat.currentQty <= mat.minQty * 1.8) return "adequate"
  return "ok"
}

const LEVEL_CFG: Record<StockLevel, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: "Critical",  color: "#ef4444", bg: "rgba(239,68,68,0.10)",   border: "rgba(239,68,68,0.25)" },
  low:      { label: "Low Stock", color: "#f59e0b", bg: "rgba(245,158,11,0.10)",  border: "rgba(245,158,11,0.25)" },
  adequate: { label: "Adequate",  color: "#3b82f6", bg: "rgba(59,130,246,0.10)",  border: "rgba(59,130,246,0.25)" },
  ok:       { label: "In Stock",  color: "#10b981", bg: "rgba(16,185,129,0.10)",  border: "rgba(16,185,129,0.25)" },
}

const PO_STATUS_CFG: Record<POStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:     { label: "Draft",     color: "#94a3b8", bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.22)" },
  sent:      { label: "Sent",      color: "#3b82f6", bg: "rgba(59,130,246,0.10)",  border: "rgba(59,130,246,0.22)" },
  partial:   { label: "Partial",   color: "#f59e0b", bg: "rgba(245,158,11,0.10)",  border: "rgba(245,158,11,0.22)" },
  received:  { label: "Received",  color: "#10b981", bg: "rgba(16,185,129,0.10)",  border: "rgba(16,185,129,0.22)" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.10)",   border: "rgba(239,68,68,0.22)" },
}

const ISSUE_CFG: Record<IssueStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:        { label: "Pending",        color: "#3b82f6", bg: "rgba(59,130,246,0.10)",  border: "rgba(59,130,246,0.22)" },
  issued:         { label: "Issued",         color: "#10b981", bg: "rgba(16,185,129,0.10)",  border: "rgba(16,185,129,0.22)" },
  partial_return: { label: "Part. Returned", color: "#f59e0b", bg: "rgba(245,158,11,0.10)",  border: "rgba(245,158,11,0.22)" },
  returned:       { label: "Returned",       color: "#94a3b8", bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.22)" },
}

const CAT_LABELS: Record<MatCategory, string> = {
  raw_material: "Raw Material", cutting_tool: "Cutting Tool",
  consumable: "Consumable", fastener: "Fastener",
  measuring: "Measuring", safety: "Safety",
}
const CAT_COLORS: Record<MatCategory, string> = {
  raw_material: "#2563eb", cutting_tool: "#f59e0b",
  consumable: "#10b981", fastener: "#06b6d4",
  measuring: "#a78bfa", safety: "#ef4444",
}
const TX_CFG: Record<TxType, { label: string; color: string; sign: string }> = {
  in:         { label: "Stock IN",    color: "#10b981", sign: "+" },
  out:        { label: "Stock OUT",   color: "#ef4444", sign: "-" },
  return:     { label: "Return",      color: "#3b82f6", sign: "+" },
  adjustment: { label: "Adjustment",  color: "#f59e0b", sign: "±" },
  scrap:      { label: "Scrap",       color: "#94a3b8", sign: "-" },
}

function useCountUp(target: number, dur = 1200) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let cur = 0; const step = Math.ceil(target / (dur / 16))
    const t = setInterval(() => { cur += step; if (cur >= target) { setV(target); clearInterval(t) } else setV(cur) }, 16)
    return () => clearInterval(t)
  }, [target, dur])
  return v
}

/* ─── Shared UI ───────────────────────────────────────────── */
const inputSx: React.CSSProperties = {
  width: "100%", padding: "8px 12px", borderRadius: "var(--radius-sm)",
  background: "var(--bg-raised)", border: "1px solid var(--border-default)",
  color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-body)",
  outline: "none", boxSizing: "border-box",
}
function Inp({ value, onChange, type = "text", placeholder, error, readOnly }: {
  value: string | number; onChange?: (v: string) => void; type?: string
  placeholder?: string; error?: boolean; readOnly?: boolean
}) {
  return <input type={type} value={value} readOnly={readOnly}
    onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
    style={{ ...inputSx, ...(error ? { borderColor: "var(--error)" } : {}), ...(readOnly ? { background: "var(--bg-elevated)", color: "var(--text-muted)" } : {}) }} />
}
function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputSx, cursor: "pointer" }}>{children}</select>
}
function Fld({ label, children, error, required }: { label: string; children: React.ReactNode; error?: string; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
        {label}{required && <span style={{ color: "var(--error)", marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: "var(--error)" }}>{error}</span>}
    </div>
  )
}
function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th style={{ padding: "9px 14px", textAlign: right ? "right" : "left", fontSize: 11,
    fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", fontFamily: "var(--font-body)",
    borderBottom: "1px solid var(--border-subtle)", whiteSpace: "nowrap" }}>{children}</th>
}
function Td({ children, right, mono, nowrap }: { children: React.ReactNode; right?: boolean; mono?: boolean; nowrap?: boolean }) {
  return <td style={{ padding: "10px 14px", textAlign: right ? "right" : "left", fontSize: 13,
    color: "var(--text-secondary)", fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
    borderBottom: "1px solid var(--border-subtle)", verticalAlign: "middle",
    whiteSpace: nowrap ? "nowrap" : undefined }}>{children}</td>
}
function HRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0",
      borderBottom: "1px solid var(--border-subtle)" }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)",
        fontFamily: mono ? "var(--font-mono)" : "var(--font-body)" }}>{value}</span>
    </div>
  )
}

function StockBadge({ level }: { level: StockLevel }) {
  const c = LEVEL_CFG[level]
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px",
      borderRadius: 3, background: c.bg, border: `1px solid ${c.border}`,
      fontSize: 11, fontWeight: 600, color: c.color, fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.color, display: "inline-block" }} />
      {c.label}
    </span>
  )
}

function StatusBadge<T extends string>({ status, cfg }: { status: T; cfg: Record<string, { label: string; color: string; bg: string; border: string }> }) {
  const c = cfg[status] ?? cfg["draft"]
  return (
    <span style={{ padding: "2px 8px", borderRadius: 3, background: c.bg, border: `1px solid ${c.border}`,
      fontSize: 11, fontWeight: 600, color: c.color, fontFamily: "var(--font-body)", whiteSpace: "nowrap" }}>
      {c.label}
    </span>
  )
}

/* Stock level bar */
function StockBar({ mat }: { mat: Material }) {
  const pct = Math.min(100, (mat.currentQty / mat.maxQty) * 100)
  const minPct = (mat.minQty / mat.maxQty) * 100
  const level = stockLevel(mat)
  const color = LEVEL_CFG[level].color
  return (
    <div style={{ position: "relative", height: 6, background: "var(--bg-raised)", borderRadius: 3, minWidth: 80 }}>
      {/* Min threshold marker */}
      <div style={{ position: "absolute", left: `${minPct}%`, top: -2, bottom: -2,
        width: 1, background: "rgba(255,255,255,0.2)", zIndex: 2 }} />
      {/* Fill */}
      <div style={{ height: "100%", borderRadius: 3, background: color,
        width: `${pct}%`, transition: "width 0.6s ease",
        boxShadow: `0 0 6px ${color}50` }} />
    </div>
  )
}

/* 3D depth material card */
function MatCard({ mat, onClick }: { mat: Material; onClick: () => void }) {
  const level = stockLevel(mat)
  const cfg   = LEVEL_CFG[level]
  const value = mat.currentQty * mat.unitPrice
  return (
    <div onClick={onClick}
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)", padding: "16px 18px", cursor: "pointer",
        position: "relative", overflow: "hidden",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = "translateY(-2px)"
        el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = "translateY(0)"
        el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)"
      }}>
      {/* Left accent strip */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3,
        background: cfg.color, boxShadow: `0 0 8px ${cfg.color}60` }} />
      {/* Top shimmer */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "rgba(255,255,255,0.07)" }} />

      <div style={{ paddingLeft: 8 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: CAT_COLORS[mat.category],
              letterSpacing: "0.08em", marginBottom: 3 }}>{mat.code}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)",
              lineHeight: 1.3, marginBottom: 2 }}>{mat.name}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              {CAT_LABELS[mat.category]} · HSN {mat.hsnCode}
            </div>
          </div>
          <StockBadge level={level} />
        </div>

        {/* Quantities */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[
            { label: "Current", value: fQty(mat.currentQty, mat.unit), color: cfg.color },
            { label: "Minimum", value: fQty(mat.minQty, mat.unit),     color: "var(--text-muted)" },
            { label: "Value",   value: fCur(value, true),               color: "var(--text-secondary)" },
          ].map(d => (
            <div key={d.label} style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)",
              padding: "6px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 2,
                fontFamily: "var(--font-body)", letterSpacing: "0.05em" }}>{d.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: d.color, fontFamily: "var(--font-mono)" }}>{d.value}</div>
            </div>
          ))}
        </div>

        {/* Stock bar */}
        <StockBar mat={mat} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{mat.location}</span>
          <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            {Math.round((mat.currentQty / mat.maxQty) * 100)}% of max
          </span>
        </div>
      </div>
    </div>
  )
}

function ChartTip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)", padding: "10px 14px", fontFamily: "var(--font-body)" }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{label}</div>
      {payload.filter(Boolean).map((p, i) => (
        <div key={i} style={{ fontSize: 12, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name ?? ""}:</span>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{fCur(p.value ?? 0, true)}</span>
        </div>
      ))}
    </div>
  )
}

function KpiCard({ label, value, sub, icon, accent, delta }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; accent: string; delta?: { v: string; pos: boolean }
}) {
  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)", padding: "18px 20px", position: "relative", overflow: "hidden",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.35)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accent }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.07em",
          fontFamily: "var(--font-body)", textTransform: "uppercase" }}>{label}</span>
        <span style={{ color: accent, opacity: 0.7 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26,
        color: "var(--text-primary)", lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {sub && <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{sub}</div>}
        {delta && (
          <span style={{ fontSize: 11, color: delta.pos ? "var(--success)" : "var(--error)", fontWeight: 500,
            fontFamily: "var(--font-body)" }}>{delta.pos ? "▲" : "▼"} {delta.v}</span>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   STORE DASHBOARD
══════════════════════════════════════════════════════════ */
function StoreDashboard({ onNavigate }: { onNavigate: (v: StoreView, id?: string) => void }) {
  const totalValue   = MATERIALS.reduce((s, m) => s + m.currentQty * m.unitPrice, 0)
  const lowCount     = MATERIALS.filter(m => stockLevel(m) === "low" || stockLevel(m) === "critical").length
  const critCount    = MATERIALS.filter(m => stockLevel(m) === "critical").length
  const pendingIssues = MATERIAL_ISSUES.filter(i => i.status === "pending").length
  const todayIn      = 2350000
  const todayOut     = 1780000

  const cValue   = useCountUp(Math.round(totalValue / 1000))
  const cLow     = useCountUp(lowCount)
  const cPending = useCountUp(pendingIssues)

  const lowMaterials = MATERIALS.filter(m => ["low", "critical"].includes(stockLevel(m)))

  return (
    <div>
      <PageHeader title="Store Overview" description="Real-time inventory, procurement and material status"
        badge={{ label: "LIVE", variant: "success" }}
        primaryAction={{ label: "New Purchase Order", onClick: () => onNavigate("purchase-create"), icon: <PlusIcon /> }}
        accentColor="#06b6d4" />

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <KpiCard label="Stock Value"        value={`₹${cValue}K`}  sub="Current inventory"        icon={<LayersIcon />} accent="#06b6d4" />
        <KpiCard label="Low / Critical"     value={`${cLow} items`} sub={`${critCount} critical`}  icon={<AlertIcon />}  accent="#ef4444" />
        <KpiCard label="Today Stock IN"     value={fCur(todayIn, true)}  sub="3 PO receipts"       icon={<ArrowDownIcon />} accent="#10b981" delta={{ v: "14%", pos: true }} />
        <KpiCard label="Today Stock OUT"    value={fCur(todayOut, true)} sub="8 issue orders"      icon={<ArrowUpIcon />}   accent="#f59e0b" />
        <KpiCard label="Open POs"           value="2"                sub="₹23.4L pending"          icon={<PurchaseIcon />}  accent="#2563eb" />
        <KpiCard label="Pending Issues"     value={`${cPending}`}   sub="Awaiting approval"        icon={<BoxIcon />}    accent="#a78bfa" />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)", padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)", marginBottom: 2 }}>Stock Value Trend</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14, fontFamily: "var(--font-body)" }}>Monthly closing stock value</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={STOCK_TREND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => fCur(v, true)} tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} width={55} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="value" name="Stock Value" stroke="#06b6d4" fill="url(#gStock)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)", padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)", marginBottom: 2 }}>Stock IN vs OUT</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14, fontFamily: "var(--font-body)" }}>Monthly material inflow and outflow</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={INOUT_TREND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => fCur(v, true)} tick={{ fontSize: 10, fill: "#4b5a72" }} axisLine={false} tickLine={false} width={55} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="in"  name="Stock IN"  fill="#10b981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="out" name="Stock OUT" fill="#ef4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low stock alerts + Recent transactions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Low stock */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
              Low Stock Alerts — {lowMaterials.length} items
            </span>
            <button onClick={() => onNavigate("inventory")}
              style={{ fontSize: 12, color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}>
              View all →
            </button>
          </div>
          <div>
            {lowMaterials.map(mat => (
              <div key={mat.id} onClick={() => onNavigate("material-detail", mat.id)}
                style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-subtle)",
                  cursor: "pointer", transition: "background 0.1s" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "var(--bg-elevated)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ""}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: CAT_COLORS[mat.category] }}>{mat.code} </span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>{mat.name}</span>
                  </div>
                  <StockBadge level={stockLevel(mat)} />
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 5, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                  <span>Current: <span style={{ color: LEVEL_CFG[stockLevel(mat)].color, fontWeight: 600, fontFamily: "var(--font-mono)" }}>{fQty(mat.currentQty, mat.unit)}</span></span>
                  <span>Min: <span style={{ fontFamily: "var(--font-mono)" }}>{fQty(mat.minQty, mat.unit)}</span></span>
                </div>
                <StockBar mat={mat} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>Recent Transactions</span>
            <button onClick={() => onNavigate("inventory")}
              style={{ fontSize: 12, color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}>
              View all →
            </button>
          </div>
          {STOCK_TXS.slice(0, 8).map(tx => {
            const mat = MATERIALS.find(m => m.id === tx.materialId)
            const cfg = TX_CFG[tx.type]
            return (
              <div key={tx.id} style={{ padding: "10px 18px", borderBottom: "1px solid var(--border-subtle)",
                display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "var(--text-primary)", fontFamily: "var(--font-body)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {mat?.name ?? "—"}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    {cfg.label} · {fDate(tx.date)} · {tx.reference}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-mono)",
                    color: cfg.color }}>{cfg.sign}{tx.qty} {mat?.unit}</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    Bal: {tx.balance}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   INVENTORY LIST
══════════════════════════════════════════════════════════ */
function InventoryList({ onNavigate }: { onNavigate: (v: StoreView, id?: string) => void }) {
  const [search, setSearch]      = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [view, setView]          = useState<"grid" | "table">("table")
  const [showTxDrawer, setShowTxDrawer] = useState(false)
  const [txMaterialId, setTxMaterialId] = useState<string>("")
  const [txType, setTxType]      = useState<TxType>("in")
  const [txSuccess, setTxSuccess] = useState("")

  const filtered = MATERIALS.filter(m => {
    const q = search.toLowerCase()
    const mq = m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q)
    const mc = catFilter === "all" || m.category === catFilter
    const ml = levelFilter === "all" || stockLevel(m) === levelFilter
    return mq && mc && ml
  })

  const totalValue = filtered.reduce((s, m) => s + m.currentQty * m.unitPrice, 0)

  function openTx(materialId: string, type: TxType) {
    setTxMaterialId(materialId); setTxType(type); setShowTxDrawer(true)
  }

  return (
    <div>
      <PageHeader title="Inventory" description="Material master, stock levels and transactions"
        primaryAction={{ label: "Stock IN", onClick: () => openTx(MATERIALS[0].id, "in"), icon: <ArrowDownIcon /> }}
        secondaryActions={[{ label: "Stock OUT", onClick: () => openTx(MATERIALS[0].id, "out"), icon: <ArrowUpIcon /> }]}
        accentColor="#06b6d4" />

      {txSuccess && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
          background: "var(--success-bg)", border: "1px solid var(--success-border)",
          borderRadius: "var(--radius-md)", marginBottom: 16, animation: "fade-in 0.3s ease" }}>
          <span style={{ color: "var(--success)" }}><CheckIcon /></span>
          <span style={{ fontSize: 13, color: "var(--success)", fontFamily: "var(--font-body)" }}>{txSuccess}</span>
        </div>
      )}

      {/* Summary bar */}
      <div style={{ display: "flex", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
        {[
          { label: "Total Items", value: `${filtered.length}` },
          { label: "Stock Value", value: fCur(totalValue, true), mono: true },
          { label: "Critical", value: `${filtered.filter(m => stockLevel(m) === "critical").length}`, color: "var(--error)" },
          { label: "Low Stock", value: `${filtered.filter(m => stockLevel(m) === "low").length}`, color: "var(--warning)" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)", padding: "8px 16px" }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: s.color ?? "var(--text-primary)",
              fontFamily: s.mono ? "var(--font-mono)" : "var(--font-display)" }}>{s.value}</div>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }}>
          {(["table", "grid"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: 12,
                background: view === v ? "var(--primary-subtle)" : "var(--bg-elevated)",
                border: `1px solid ${view === v ? "rgba(37,99,235,0.3)" : "var(--border-default)"}`,
                color: view === v ? "var(--primary)" : "var(--text-muted)",
                cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "capitalize" }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
            <SearchIcon />
          </span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search materials..."
            style={{ ...inputSx, paddingLeft: 34, width: 240 }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          style={{ ...inputSx, width: "auto", padding: "8px 12px" }}>
          <option value="all">All Categories</option>
          {Object.entries(CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
          style={{ ...inputSx, width: "auto", padding: "8px 12px" }}>
          <option value="all">All Levels</option>
          <option value="critical">Critical</option>
          <option value="low">Low Stock</option>
          <option value="adequate">Adequate</option>
          <option value="ok">In Stock</option>
        </select>
      </div>

      {view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map(mat => (
            <MatCard key={mat.id} mat={mat} onClick={() => onNavigate("material-detail", mat.id)} />
          ))}
        </div>
      ) : (
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-elevated)" }}>
                  <Th>Code</Th><Th>Material</Th><Th>Category</Th><Th>Location</Th>
                  <Th right>Current</Th><Th right>Min</Th><Th right>Unit Price</Th><Th right>Value</Th>
                  <Th>Stock Level</Th><Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13 }}>
                    No materials found.
                  </td></tr>
                ) : filtered.map(mat => {
                  const level = stockLevel(mat)
                  return (
                    <tr key={mat.id}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                      style={{ transition: "background 0.1s" }}>
                      <Td mono>
                        <button onClick={() => onNavigate("material-detail", mat.id)}
                          style={{ background: "none", border: "none", cursor: "pointer",
                            fontFamily: "var(--font-mono)", fontSize: 12, color: CAT_COLORS[mat.category], padding: 0 }}>
                          {mat.code}
                        </button>
                      </Td>
                      <Td>
                        <div style={{ fontSize: 13, color: "var(--text-primary)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{mat.name}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>HSN {mat.hsnCode}</div>
                      </Td>
                      <Td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: CAT_COLORS[mat.category], display: "inline-block" }} />
                          {CAT_LABELS[mat.category]}
                        </span>
                      </Td>
                      <Td mono><span style={{ fontSize: 11 }}>{mat.location}</span></Td>
                      <Td right mono>
                        <span style={{ color: LEVEL_CFG[level].color, fontWeight: 600 }}>{mat.currentQty} {mat.unit}</span>
                      </Td>
                      <Td right mono>{mat.minQty} {mat.unit}</Td>
                      <Td right mono>{fCur(mat.unitPrice)}</Td>
                      <Td right mono>{fCur(mat.currentQty * mat.unitPrice, true)}</Td>
                      <Td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 80 }}>
                          <StockBadge level={level} />
                          <StockBar mat={mat} />
                        </div>
                      </Td>
                      <Td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => onNavigate("material-detail", mat.id)}
                            title="View" style={{ padding: "4px 6px", borderRadius: 3,
                              background: "var(--bg-raised)", border: "1px solid var(--border-default)",
                              color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <EyeIcon />
                          </button>
                          <button onClick={() => openTx(mat.id, "in")} title="Stock IN"
                            style={{ padding: "4px 6px", borderRadius: 3,
                              background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
                              color: "#10b981", cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <ArrowDownIcon />
                          </button>
                          <button onClick={() => openTx(mat.id, "out")} title="Stock OUT"
                            style={{ padding: "4px 6px", borderRadius: 3,
                              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                              color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <ArrowUpIcon />
                          </button>
                        </div>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showTxDrawer && (
        <StockTxDrawer
          materialId={txMaterialId}
          initialType={txType}
          onClose={() => setShowTxDrawer(false)}
          onSave={(msg) => { setTxSuccess(msg); setShowTxDrawer(false); setTimeout(() => setTxSuccess(""), 4000) }}
        />
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   STOCK TRANSACTION DRAWER
══════════════════════════════════════════════════════════ */
function StockTxDrawer({ materialId, initialType, onClose, onSave }: {
  materialId: string; initialType: TxType; onClose: () => void; onSave: (msg: string) => void
}) {
  const [type, setType]       = useState<TxType>(initialType)
  const [matId, setMatId]     = useState(materialId)
  const [qty, setQty]         = useState("")
  const [date, setDate]       = useState(new Date().toISOString().slice(0, 10))
  const [reference, setRef]   = useState("")
  const [remarks, setRemarks] = useState("")
  const [rate, setRate]       = useState("")
  const [saving, setSaving]   = useState(false)
  const [errors, setErrors]   = useState<Record<string, string>>({})

  const mat = MATERIALS.find(m => m.id === matId) ?? MATERIALS[0]
  const TX_TYPES: TxType[] = ["in", "out", "return", "adjustment", "scrap"]

  const typeLabels: Record<TxType, string> = {
    in: "Stock IN — Receive material", out: "Stock OUT — Issue material",
    return: "Stock Return", adjustment: "Stock Adjustment", scrap: "Record Scrap",
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!qty || parseFloat(qty) <= 0) e.qty = "Enter a valid quantity"
    if (type === "out" && parseFloat(qty) > mat.currentQty) e.qty = `Cannot exceed current stock (${mat.currentQty} ${mat.unit})`
    if (!date) e.date = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    setSaving(true)
    const cfg = TX_CFG[type]
    setTimeout(() => {
      onSave(`${cfg.label}: ${qty} ${mat.unit} of ${mat.name} recorded successfully.`)
    }, 800)
  }

  const accentColor = type === "in" ? "#10b981" : type === "out" ? "#ef4444" : type === "return" ? "#3b82f6" : type === "scrap" ? "#94a3b8" : "#f59e0b"

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 40 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 420, background: "var(--bg-elevated)",
        borderLeft: "1px solid var(--border-default)", zIndex: 50, display: "flex", flexDirection: "column",
        boxShadow: "var(--shadow-xl)", animation: "fade-in 0.2s ease" }}>
        {/* Header */}
        <div style={{ padding: "0", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ height: 3, background: accentColor }} />
          <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>
              Stock Transaction
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><XIcon /></button>
          </div>
          {/* Type selector tabs */}
          <div style={{ display: "flex", gap: 0, overflowX: "auto", padding: "0 24px 14px" }}>
            {TX_TYPES.map(t => (
              <button key={t} onClick={() => setType(t)}
                style={{ padding: "5px 12px", borderRadius: 3, fontSize: 11, fontWeight: 600,
                  background: type === t ? (TX_CFG[t].color + "20") : "transparent",
                  border: `1px solid ${type === t ? TX_CFG[t].color + "40" : "transparent"}`,
                  color: type === t ? TX_CFG[t].color : "var(--text-muted)",
                  cursor: "pointer", fontFamily: "var(--font-body)", whiteSpace: "nowrap", marginRight: 4,
                  transition: "all 0.15s" }}>
                {TX_CFG[t].label}
              </button>
            ))}
          </div>
        </div>

        {/* Form body */}
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)",
            padding: "8px 12px", background: "var(--bg-raised)", borderRadius: "var(--radius-sm)",
            borderLeft: `3px solid ${accentColor}` }}>
            {typeLabels[type]}
          </div>

          <Fld label="Material" required>
            <Sel value={matId} onChange={setMatId}>
              {MATERIALS.map(m => <option key={m.id} value={m.id}>{m.code} — {m.name}</option>)}
            </Sel>
          </Fld>

          {/* Current stock info */}
          <div style={{ background: "var(--bg-raised)", borderRadius: "var(--radius-sm)", padding: "10px 14px",
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 2 }}>CURRENT</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: LEVEL_CFG[stockLevel(mat)].color,
                fontFamily: "var(--font-mono)" }}>{mat.currentQty} {mat.unit}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 2 }}>MINIMUM</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)",
                fontFamily: "var(--font-mono)" }}>{mat.minQty} {mat.unit}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 2 }}>LOCATION</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)",
                fontFamily: "var(--font-mono)" }}>{mat.location}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Fld label={`Quantity (${mat.unit})`} required error={errors.qty}>
              <Inp type="number" value={qty} onChange={setQty} placeholder="0" error={!!errors.qty} />
            </Fld>
            <Fld label="Date" required error={errors.date}>
              <Inp type="date" value={date} onChange={setDate} error={!!errors.date} />
            </Fld>
          </div>

          {type === "in" && (
            <Fld label="Unit Rate (₹)">
              <Inp type="number" value={rate} onChange={setRate} placeholder={mat.unitPrice.toString()} />
            </Fld>
          )}

          <Fld label={type === "in" ? "PO / Invoice Reference" : type === "out" ? "Work Order / Issue Ref" : "Reference"}>
            <Inp value={reference} onChange={setRef} placeholder={
              type === "in" ? "e.g. PO-2024-0041" : type === "out" ? "e.g. WO-0841" : "Reference no."
            } />
          </Fld>

          {type === "adjustment" && (
            <div style={{ padding: "10px 14px", background: "var(--warning-bg)", border: "1px solid var(--warning-border)",
              borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--warning)", fontFamily: "var(--font-body)" }}>
              Enter a positive qty to increase stock, negative to decrease (e.g. -5 for shortage found).
            </div>
          )}

          <Fld label="Remarks">
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2}
              placeholder="Optional notes about this transaction"
              style={{ ...inputSx, resize: "vertical" }} />
          </Fld>

          {/* Projected balance */}
          {qty && parseFloat(qty) > 0 && (
            <div style={{ background: "var(--bg-raised)", borderRadius: "var(--radius-sm)", padding: "10px 14px" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Projected balance after transaction</div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-mono)",
                color: (type === "in" || type === "return") ? "#10b981" : "#f59e0b" }}>
                {(type === "in" || type === "return")
                  ? mat.currentQty + parseFloat(qty)
                  : Math.max(0, mat.currentQty - parseFloat(qty))
                } {mat.unit}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)",
            background: "var(--bg-raised)", border: "1px solid var(--border-default)",
            color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13 }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)",
              background: saving ? "var(--bg-raised)" : accentColor,
              border: "none", color: "#fff", cursor: saving ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600 }}>
            {saving ? "Saving..." : `Record ${TX_CFG[type].label}`}
          </button>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════════════════
   MATERIAL DETAIL
══════════════════════════════════════════════════════════ */
function MaterialDetail({ materialId, onNavigate }: { materialId: string; onNavigate: (v: StoreView, id?: string) => void }) {
  const mat     = MATERIALS.find(m => m.id === materialId) ?? MATERIALS[0]
  const supplier = SUPPLIERS.find(s => s.id === mat.supplierId)
  const txs     = STOCK_TXS.filter(t => t.materialId === mat.id)
  const level   = stockLevel(mat)
  const [showTx, setShowTx] = useState(false)
  const [txType, setTxType] = useState<TxType>("in")
  const [txSuccess, setTxSuccess] = useState("")

  return (
    <div>
      <PageHeader title={mat.name} description={`${mat.code} · ${CAT_LABELS[mat.category]} · HSN ${mat.hsnCode}`}
        breadcrumbs={[{ label: "Inventory", id: "inventory" }, { label: mat.code }]}
        onNavigate={id => { if (id === "inventory") onNavigate("inventory") }}
        badge={{ label: LEVEL_CFG[level].label, variant: level === "ok" ? "success" : level === "adequate" ? "info" : level === "low" ? "warning" : "error" }}
        primaryAction={{ label: "Stock IN",  onClick: () => { setTxType("in"); setShowTx(true) }, icon: <ArrowDownIcon /> }}
        secondaryActions={[{ label: "Stock OUT", onClick: () => { setTxType("out"); setShowTx(true) }, icon: <ArrowUpIcon /> }]}
        accentColor={CAT_COLORS[mat.category]} />

      {txSuccess && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
          background: "var(--success-bg)", border: "1px solid var(--success-border)",
          borderRadius: "var(--radius-md)", marginBottom: 16 }}>
          <span style={{ color: "var(--success)" }}><CheckIcon /></span>
          <span style={{ fontSize: 13, color: "var(--success)", fontFamily: "var(--font-body)" }}>{txSuccess}</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, alignItems: "start" }}>
        {/* Left panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* 3D stock card */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)", padding: "20px",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 24px rgba(0,0,0,0.45)",
            position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: LEVEL_CFG[level].color }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)", marginBottom: 4 }}>CURRENT STOCK</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700,
                color: LEVEL_CFG[level].color, lineHeight: 1 }}>{mat.currentQty}</div>
              <div style={{ fontSize: 16, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{mat.unit}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11, color: "var(--text-muted)" }}>
                <span>0 {mat.unit}</span><span>Min: {mat.minQty}</span><span>{mat.maxQty} {mat.unit}</span>
              </div>
              <div style={{ height: 10, background: "var(--bg-raised)", borderRadius: 5, position: "relative" }}>
                <div style={{ position: "absolute", left: `${(mat.minQty / mat.maxQty) * 100}%`,
                  top: -2, bottom: -2, width: 1, background: "rgba(255,255,255,0.3)", zIndex: 2 }} />
                <div style={{ height: "100%", borderRadius: 5, background: LEVEL_CFG[level].color,
                  width: `${Math.min(100, (mat.currentQty / mat.maxQty) * 100)}%`,
                  transition: "width 0.8s ease",
                  boxShadow: `0 0 8px ${LEVEL_CFG[level].color}60` }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <StockBadge level={level} />
            </div>
          </div>

          {/* Material info */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)", padding: "18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em",
              marginBottom: 12, fontFamily: "var(--font-body)", textTransform: "uppercase" }}>Material Details</div>
            <HRow label="Material Code" value={mat.code} mono />
            <HRow label="Category"      value={CAT_LABELS[mat.category]} />
            <HRow label="Unit"          value={mat.unit} />
            <HRow label="HSN Code"      value={mat.hsnCode} mono />
            <HRow label="Location"      value={mat.location} mono />
            <HRow label="Min. Qty"      value={`${mat.minQty} ${mat.unit}`} mono />
            <HRow label="Max. Qty"      value={`${mat.maxQty} ${mat.unit}`} mono />
            <HRow label="Unit Price"    value={fCur(mat.unitPrice)} mono />
            <HRow label="Stock Value"   value={fCur(mat.currentQty * mat.unitPrice)} mono />
            <HRow label="Last Updated"  value={fDate(mat.lastUpdated)} />
          </div>

          {/* Supplier */}
          {supplier && (
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)", padding: "18px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em",
                marginBottom: 12, fontFamily: "var(--font-body)", textTransform: "uppercase" }}>Primary Supplier</div>
              <HRow label="Name"         value={supplier.name} />
              <HRow label="Code"         value={supplier.code} mono />
              <HRow label="Lead Time"    value={`${supplier.leadDays} days`} />
              <HRow label="Payment"      value={supplier.paymentTerms} />
            </div>
          )}
        </div>

        {/* Right — Transactions */}
        <div>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
                Stock Transaction Ledger
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                {(["in", "out", "return", "adjustment", "scrap"] as TxType[]).map(t => (
                  <button key={t} onClick={() => { setTxType(t); setShowTx(true) }}
                    style={{ padding: "4px 10px", borderRadius: 3, fontSize: 11,
                      background: TX_CFG[t].color + "15", border: `1px solid ${TX_CFG[t].color}30`,
                      color: TX_CFG[t].color, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                    {TX_CFG[t].label}
                  </button>
                ))}
              </div>
            </div>
            {txs.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13 }}>
                No transactions recorded for this material.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-elevated)" }}>
                    <Th>Date</Th><Th>Type</Th><Th>Reference</Th><Th right>Qty</Th><Th right>Balance</Th><Th>Remarks</Th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map(tx => {
                    const cfg = TX_CFG[tx.type]
                    return (
                      <tr key={tx.id}
                        onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                        onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                        style={{ transition: "background 0.1s" }}>
                        <Td>{fDate(tx.date)}</Td>
                        <Td>
                          <span style={{ padding: "2px 8px", borderRadius: 3, fontSize: 11, fontWeight: 600,
                            background: cfg.color + "15", color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                            {cfg.label}
                          </span>
                        </Td>
                        <Td mono><span style={{ fontSize: 11 }}>{tx.reference}</span></Td>
                        <Td right mono>
                          <span style={{ color: cfg.color, fontWeight: 600 }}>{cfg.sign}{tx.qty} {mat.unit}</span>
                        </Td>
                        <Td right mono>{tx.balance} {mat.unit}</Td>
                        <Td><span style={{ fontSize: 12, color: "var(--text-muted)" }}>{tx.remarks}</span></Td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showTx && (
        <StockTxDrawer materialId={mat.id} initialType={txType} onClose={() => setShowTx(false)}
          onSave={msg => { setTxSuccess(msg); setShowTx(false); setTimeout(() => setTxSuccess(""), 4000) }} />
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SUPPLIERS
══════════════════════════════════════════════════════════ */
function SupplierList({ onNavigate }: { onNavigate: (v: StoreView, id?: string) => void }) {
  const [search, setSearch] = useState("")

  const filtered = SUPPLIERS.filter(s => {
    const q = search.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
  })

  function StarRating({ n }: { n: number }) {
    return (
      <span style={{ display: "flex", gap: 2, alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} style={{ color: i <= n ? "#f59e0b" : "var(--border-strong)" }}>
            <StarIcon fill={i <= n} />
          </span>
        ))}
      </span>
    )
  }

  return (
    <div>
      <PageHeader title="Suppliers" description="Vendor master and supplier management"
        primaryAction={{ label: "Add Supplier", onClick: () => undefined, icon: <PlusIcon /> }}
        accentColor="#a78bfa" />

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ position: "relative", width: 280 }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
              <SearchIcon />
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search suppliers..."
              style={{ ...inputSx, paddingLeft: 34 }} />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)" }}>
                <Th>Code</Th><Th>Supplier Name</Th><Th>Category</Th><Th>Contact</Th>
                <Th>Rating</Th><Th right>Lead (days)</Th><Th>Payment Terms</Th><Th>Status</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sup => (
                <tr key={sup.id}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                  style={{ transition: "background 0.1s" }}>
                  <Td mono>
                    <button onClick={() => onNavigate("supplier-detail", sup.id)}
                      style={{ background: "none", border: "none", color: "var(--primary)",
                        cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, padding: 0 }}>
                      {sup.code}
                    </button>
                  </Td>
                  <Td>
                    <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{sup.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{sup.email}</div>
                  </Td>
                  <Td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", display: "inline-block",
                        background: sup.category === "Raw Material" ? "#2563eb" : sup.category === "Cutting Tools" ? "#f59e0b"
                          : sup.category === "Consumable" ? "#10b981" : sup.category === "Measuring" ? "#a78bfa" : "#06b6d4" }} />
                      {sup.category}
                    </span>
                  </Td>
                  <Td>
                    <div style={{ fontSize: 12 }}>{sup.contact}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{sup.phone}</div>
                  </Td>
                  <Td><StarRating n={sup.rating} /></Td>
                  <Td right mono>{sup.leadDays}</Td>
                  <Td>{sup.paymentTerms}</Td>
                  <Td>
                    <span style={{ padding: "2px 8px", borderRadius: 3, fontSize: 11, fontWeight: 600,
                      background: sup.status === "active" ? "var(--success-bg)" : "var(--error-bg)",
                      border: `1px solid ${sup.status === "active" ? "var(--success-border)" : "var(--error-border)"}`,
                      color: sup.status === "active" ? "var(--success)" : "var(--error)" }}>
                      {sup.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </Td>
                  <Td>
                    <button onClick={() => onNavigate("supplier-detail", sup.id)}
                      style={{ padding: "4px 6px", borderRadius: 3, background: "var(--bg-raised)",
                        border: "1px solid var(--border-default)", color: "var(--text-muted)",
                        cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <EyeIcon />
                    </button>
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

function SupplierDetail({ supplierId, onNavigate }: { supplierId: string; onNavigate: (v: StoreView, id?: string) => void }) {
  const sup = SUPPLIERS.find(s => s.id === supplierId) ?? SUPPLIERS[0]
  const supPOs = PURCHASE_ORDERS.filter(po => po.supplierId === sup.id)
  const supMats = MATERIALS.filter(m => m.supplierId === sup.id)

  return (
    <div>
      <PageHeader title={sup.name} description={`${sup.code} · ${sup.category}`}
        breadcrumbs={[{ label: "Suppliers", id: "suppliers" }, { label: sup.code }]}
        onNavigate={id => { if (id === "suppliers") onNavigate("suppliers") }}
        badge={{ label: sup.status === "active" ? "Active" : "Inactive", variant: sup.status === "active" ? "success" : "error" }}
        primaryAction={{ label: "New PO", onClick: () => onNavigate("purchase-create"), icon: <PlusIcon /> }}
        accentColor="#a78bfa" />

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)", padding: "18px",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.35)" }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{ color: i <= sup.rating ? "#f59e0b" : "var(--border-strong)", fontSize: 16 }}>★</span>
              ))}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em",
              marginBottom: 12, textTransform: "uppercase" }}>Contact Information</div>
            <HRow label="Supplier Code"  value={sup.code} mono />
            <HRow label="Contact Person" value={sup.contact} />
            <HRow label="Phone"          value={sup.phone} mono />
            <HRow label="Email"          value={sup.email} />
            <HRow label="GSTIN"          value={sup.gst} mono />
            <HRow label="Payment Terms"  value={sup.paymentTerms} />
            <HRow label="Lead Time"      value={`${sup.leadDays} working days`} />
          </div>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)", padding: "18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em",
              marginBottom: 10, textTransform: "uppercase" }}>Address</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.7 }}>{sup.address}</div>
          </div>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)", padding: "18px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em",
              marginBottom: 10, textTransform: "uppercase" }}>Materials Supplied ({supMats.length})</div>
            {supMats.map(m => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0",
                borderBottom: "1px solid var(--border-subtle)", fontSize: 12 }}>
                <span style={{ color: CAT_COLORS[m.category], fontFamily: "var(--font-mono)" }}>{m.code}</span>
                <span style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap", maxWidth: 160 }}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
              Purchase Order History
            </span>
          </div>
          {supPOs.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 13, fontFamily: "var(--font-body)" }}>
              No purchase orders yet.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-elevated)" }}>
                  <Th>PO Number</Th><Th>Date</Th><Th>Expected</Th><Th right>Value</Th><Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {supPOs.map(po => (
                  <tr key={po.id}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                    style={{ transition: "background 0.1s" }}>
                    <Td mono>
                      <button onClick={() => onNavigate("purchase-detail", po.id)}
                        style={{ background: "none", border: "none", color: "var(--primary)",
                          cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, padding: 0 }}>
                        {po.number}
                      </button>
                    </Td>
                    <Td>{fDate(po.date)}</Td>
                    <Td>{fDate(po.expectedDate)}</Td>
                    <Td right mono>{fCur(po.total)}</Td>
                    <Td><StatusBadge status={po.status} cfg={PO_STATUS_CFG} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   PURCHASE ORDERS
══════════════════════════════════════════════════════════ */
function PurchaseList({ onNavigate }: { onNavigate: (v: StoreView, id?: string) => void }) {
  const [search, setSearch]   = useState("")
  const [statusFilter, setSF] = useState("all")

  const filtered = PURCHASE_ORDERS.filter(po => {
    const q = search.toLowerCase()
    const mq = po.number.toLowerCase().includes(q) || po.supplierName.toLowerCase().includes(q)
    const ms = statusFilter === "all" || po.status === statusFilter
    return mq && ms
  })

  const totals = {
    all:      PURCHASE_ORDERS.reduce((s, p) => s + p.total, 0),
    received: PURCHASE_ORDERS.filter(p => p.status === "received").reduce((s, p) => s + p.total, 0),
    open:     PURCHASE_ORDERS.filter(p => ["sent","draft","partial"].includes(p.status)).reduce((s, p) => s + p.total, 0),
  }

  return (
    <div>
      <PageHeader title="Purchase Orders" description="Procurement, goods receipt and purchase history"
        primaryAction={{ label: "Create PO", onClick: () => onNavigate("purchase-create"), icon: <PlusIcon /> }}
        accentColor="#2563eb" />

      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Total PO Value",  value: fCur(totals.all, true),      color: "var(--text-primary)" },
          { label: "Received",        value: fCur(totals.received, true), color: "var(--success)" },
          { label: "Open / Pending",  value: fCur(totals.open, true),     color: "var(--warning)" },
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
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}><SearchIcon /></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search PO or supplier..."
              style={{ ...inputSx, paddingLeft: 34, width: 260 }} />
          </div>
          <select value={statusFilter} onChange={e => setSF(e.target.value)}
            style={{ ...inputSx, width: "auto", padding: "8px 12px" }}>
            <option value="all">All Status</option>
            {Object.entries(PO_STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)" }}>
                <Th>PO Number</Th><Th>Supplier</Th><Th>Date</Th><Th>Expected</Th>
                <Th right>Items</Th><Th right>Value</Th><Th>Status</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(po => (
                <tr key={po.id}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                  style={{ transition: "background 0.1s" }}>
                  <Td mono>
                    <button onClick={() => onNavigate("purchase-detail", po.id)}
                      style={{ background: "none", border: "none", color: "var(--primary)",
                        cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, padding: 0 }}>
                      {po.number}
                    </button>
                  </Td>
                  <Td>
                    <div style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: 13 }}>
                      {po.supplierName.split(" ").slice(0, 3).join(" ")}
                    </div>
                  </Td>
                  <Td>{fDate(po.date)}</Td>
                  <Td>
                    <span style={{ color: new Date(po.expectedDate) < new Date() && po.status !== "received" ? "var(--error)" : "var(--text-secondary)" }}>
                      {fDate(po.expectedDate)}
                    </span>
                  </Td>
                  <Td right mono>{po.items.length}</Td>
                  <Td right mono>{fCur(po.total)}</Td>
                  <Td><StatusBadge status={po.status} cfg={PO_STATUS_CFG} /></Td>
                  <Td>
                    <button onClick={() => onNavigate("purchase-detail", po.id)}
                      style={{ padding: "4px 6px", borderRadius: 3, background: "var(--bg-raised)",
                        border: "1px solid var(--border-default)", color: "var(--text-muted)",
                        cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <EyeIcon />
                    </button>
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

function PurchaseDetail({ poId, onNavigate }: { poId: string; onNavigate: (v: StoreView, id?: string) => void }) {
  const po  = PURCHASE_ORDERS.find(p => p.id === poId) ?? PURCHASE_ORDERS[0]
  const sup = SUPPLIERS.find(s => s.id === po.supplierId)
  const [receiveQtys, setRcvQ] = useState<Record<string, string>>({})
  const [receiving, setReceiving] = useState(false)
  const [received, setReceived]   = useState(false)

  function handleReceive() {
    setReceiving(true)
    setTimeout(() => { setReceiving(false); setReceived(true) }, 1000)
  }

  const canReceive = po.status === "sent" || po.status === "partial"

  return (
    <div>
      <PageHeader title={po.number} description={`Purchase Order · ${po.supplierName}`}
        breadcrumbs={[{ label: "Purchase Orders", id: "purchase" }, { label: po.number }]}
        onNavigate={id => { if (id === "purchase") onNavigate("purchase") }}
        badge={{ label: PO_STATUS_CFG[po.status].label, variant: po.status === "received" ? "success" : po.status === "cancelled" ? "error" : po.status === "partial" ? "warning" : "info" }}
        primaryAction={canReceive ? { label: "Receive Goods", onClick: handleReceive, icon: <CheckIcon /> } : undefined}
        accentColor="#2563eb" />

      {received && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
          background: "var(--success-bg)", border: "1px solid var(--success-border)",
          borderRadius: "var(--radius-md)", marginBottom: 16 }}>
          <span style={{ color: "var(--success)" }}><CheckIcon /></span>
          <span style={{ fontSize: 13, color: "var(--success)", fontFamily: "var(--font-body)" }}>
            Goods received and stock updated for {po.number}.
          </span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>
        {/* PO Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)", padding: "18px",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.35)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em",
              marginBottom: 12, textTransform: "uppercase" }}>Order Info</div>
            <HRow label="PO Number"   value={po.number} mono />
            <HRow label="Order Date"  value={fDate(po.date)} />
            <HRow label="Expected"    value={fDate(po.expectedDate)} />
            <HRow label="Total Value" value={fCur(po.total)} mono />
            <HRow label="Status"      value={PO_STATUS_CFG[po.status].label} />
          </div>
          {sup && (
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)", padding: "18px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.07em",
                marginBottom: 12, textTransform: "uppercase" }}>Supplier</div>
              <HRow label="Name"    value={sup.name} />
              <HRow label="Contact" value={sup.contact} />
              <HRow label="Phone"   value={sup.phone} mono />
              <HRow label="GSTIN"   value={sup.gst} mono />
            </div>
          )}
          {po.remarks && (
            <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)", padding: "14px 18px" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>REMARKS</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{po.remarks}</div>
            </div>
          )}
        </div>

        {/* Items */}
        <div>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
                Order Items — {po.items.length} lines
              </span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-elevated)" }}>
                  <Th>#</Th><Th>Material</Th><Th right>Ordered</Th><Th right>Received</Th>
                  <Th right>Pending</Th><Th right>Unit Rate</Th><Th right>Line Total</Th>
                  {canReceive && <Th>Receive Qty</Th>}
                </tr>
              </thead>
              <tbody>
                {po.items.map((item, idx) => {
                  const pending = item.orderedQty - item.receivedQty
                  return (
                    <tr key={item.id}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}>
                      <Td mono><span style={{ fontSize: 11 }}>{idx + 1}</span></Td>
                      <Td>
                        <div style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: 13 }}>{item.materialName}</div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{item.unit}</div>
                      </Td>
                      <Td right mono>{item.orderedQty} {item.unit}</Td>
                      <Td right mono>
                        <span style={{ color: item.receivedQty > 0 ? "var(--success)" : "var(--text-muted)" }}>
                          {item.receivedQty} {item.unit}
                        </span>
                      </Td>
                      <Td right mono>
                        <span style={{ color: pending > 0 ? "var(--warning)" : "var(--text-muted)" }}>
                          {pending} {item.unit}
                        </span>
                      </Td>
                      <Td right mono>{fCur(item.rate)}</Td>
                      <Td right mono>{fCur(item.orderedQty * item.rate)}</Td>
                      {canReceive && (
                        <Td>
                          <Inp type="number" value={receiveQtys[item.id] ?? ""} placeholder={`Max ${pending}`}
                            onChange={v => setRcvQ(prev => ({ ...prev, [item.id]: v }))} />
                        </Td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: "var(--bg-elevated)" }}>
                  <td colSpan={canReceive ? 6 : 5} style={{ padding: "10px 14px", textAlign: "right",
                    fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                    Grand Total
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "right",
                    fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                    {fCur(po.total)}
                  </td>
                  {canReceive && <td />}
                </tr>
              </tfoot>
            </table>
          </div>

          {canReceive && !received && (
            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => onNavigate("purchase")}
                style={{ padding: "9px 18px", borderRadius: "var(--radius-sm)",
                  background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
                  color: "var(--text-secondary)", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)" }}>
                <BackIcon /> Back
              </button>
              <button onClick={handleReceive} disabled={receiving}
                style={{ padding: "9px 24px", borderRadius: "var(--radius-sm)",
                  background: receiving ? "var(--bg-raised)" : "var(--success)",
                  border: "none", color: "#fff", cursor: receiving ? "not-allowed" : "pointer",
                  fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)",
                  display: "flex", alignItems: "center", gap: 6 }}>
                <CheckIcon /> {receiving ? "Receiving..." : "Confirm Receipt & Update Stock"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* Create PO */
function CreatePurchaseOrder({ onNavigate }: { onNavigate: (v: StoreView, id?: string) => void }) {
  const [supplierId, setSupplierId] = useState(SUPPLIERS[0].id)
  const [date, setDate]     = useState(new Date().toISOString().slice(0, 10))
  const [expDate, setExpDate] = useState("")
  const [remarks, setRemarks] = useState("")
  const [poItems, setPoItems] = useState([{ id: "1", materialId: MATERIALS[0].id, qty: "", rate: "" }])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors]   = useState<Record<string, string>>({})

  function addItem() { setPoItems(p => [...p, { id: Date.now().toString(), materialId: MATERIALS[0].id, qty: "", rate: "" }]) }
  function removeItem(id: string) { setPoItems(p => p.filter(it => it.id !== id)) }
  function updateItem(id: string, field: "materialId" | "qty" | "rate", val: string) {
    setPoItems(p => p.map(it => it.id === id ? { ...it, [field]: val } : it))
  }

  const grandTotal = poItems.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0), 0)

  function validate() {
    const e: Record<string, string> = {}
    if (!date) e.date = "Required"
    if (!expDate) e.expDate = "Required"
    if (poItems.every(it => !it.qty || !it.rate)) e.items = "Add at least one valid item"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => { setSaving(false); setSuccess(true) }, 1200)
  }

  if (success) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 20 }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--success-bg)",
        border: "2px solid var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CheckIcon />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
          Purchase Order Created
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          PO-2024-0044 · Total: {fCur(grandTotal)} · Status: Draft
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => onNavigate("purchase")}
          style={{ padding: "8px 18px", borderRadius: "var(--radius-sm)", background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)", color: "var(--text-secondary)", cursor: "pointer",
            fontFamily: "var(--font-body)", fontSize: 13 }}>
          View All POs
        </button>
        <button onClick={() => { setSuccess(false); setSaving(false); setPoItems([{ id: "1", materialId: MATERIALS[0].id, qty: "", rate: "" }]) }}
          style={{ padding: "8px 18px", borderRadius: "var(--radius-sm)", background: "var(--primary)",
            border: "none", color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600 }}>
          Create Another
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader title="Create Purchase Order" description="Raise a new PO for material procurement"
        breadcrumbs={[{ label: "Purchase Orders", id: "purchase" }, { label: "Create PO" }]}
        onNavigate={id => { if (id === "purchase") onNavigate("purchase") }}
        accentColor="#2563eb" />

      <div style={{ maxWidth: 780 }}>
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em",
              marginBottom: 14, textTransform: "uppercase" }}>Order Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Fld label="PO Number"><Inp value="PO-2024-0044" readOnly /></Fld>
              <Fld label="Order Date" required error={errors.date}><Inp type="date" value={date} onChange={setDate} error={!!errors.date} /></Fld>
              <Fld label="Expected Date" required error={errors.expDate}><Inp type="date" value={expDate} onChange={setExpDate} error={!!errors.expDate} /></Fld>
            </div>
          </div>

          <div>
            <Fld label="Supplier" required>
              <Sel value={supplierId} onChange={setSupplierId}>
                {SUPPLIERS.filter(s => s.status === "active").map(s => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
              </Sel>
            </Fld>
          </div>

          {/* Line items */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Order Items
              </div>
              <button onClick={addItem}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
                  borderRadius: "var(--radius-sm)", background: "var(--primary-subtle)",
                  border: "1px solid rgba(37,99,235,0.25)", color: "var(--primary)",
                  fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                <PlusIcon /> Add Item
              </button>
            </div>
            {errors.items && <div style={{ fontSize: 11, color: "var(--error)", marginBottom: 8 }}>{errors.items}</div>}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
              <thead>
                <tr style={{ background: "var(--bg-elevated)" }}>
                  <Th>#</Th><Th>Material</Th><Th right>Qty</Th><Th right>Rate (₹)</Th><Th right>Amount</Th><Th>{""}</Th>
                </tr>
              </thead>
              <tbody>
                {poItems.map((item, idx) => {
                  const mat = MATERIALS.find(m => m.id === item.materialId) ?? MATERIALS[0]
                  const amount = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)
                  return (
                    <tr key={item.id}>
                      <Td mono><span style={{ fontSize: 11 }}>{idx + 1}</span></Td>
                      <Td>
                        <Sel value={item.materialId} onChange={v => updateItem(item.id, "materialId", v)}>
                          {MATERIALS.map(m => <option key={m.id} value={m.id}>{m.code} — {m.name}</option>)}
                        </Sel>
                      </Td>
                      <Td right>
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
                          <Inp type="number" value={item.qty} onChange={v => updateItem(item.id, "qty", v)} placeholder="0" />
                          <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{mat.unit}</span>
                        </div>
                      </Td>
                      <Td right><Inp type="number" value={item.rate} onChange={v => updateItem(item.id, "rate", v)} placeholder={mat.unitPrice.toString()} /></Td>
                      <Td right mono>{amount > 0 ? fCur(amount) : "—"}</Td>
                      <Td>
                        {poItems.length > 1 && (
                          <button onClick={() => removeItem(item.id)}
                            style={{ background: "none", border: "none", color: "var(--error)", cursor: "pointer", padding: 4 }}>
                            <XIcon />
                          </button>
                        )}
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
              {grandTotal > 0 && (
                <tfoot>
                  <tr style={{ background: "var(--bg-elevated)" }}>
                    <td colSpan={4} style={{ padding: "10px 14px", textAlign: "right", fontSize: 12,
                      fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>Grand Total</td>
                    <td style={{ padding: "10px 14px", textAlign: "right",
                      fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                      {fCur(grandTotal)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          <Fld label="Remarks / Instructions">
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2}
              style={{ ...inputSx, resize: "vertical" }} placeholder="Delivery instructions, quality requirements, etc." />
          </Fld>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onNavigate("purchase")}
              style={{ padding: "9px 18px", borderRadius: "var(--radius-sm)", background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)", color: "var(--text-secondary)", cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: 13 }}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving}
              style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)",
                background: saving ? "var(--bg-raised)" : "var(--primary)",
                border: "none", color: "#fff", cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600 }}>
              {saving ? "Creating PO..." : "Create Purchase Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MATERIAL ISSUE
══════════════════════════════════════════════════════════ */
function MaterialIssueList({ onNavigate }: { onNavigate: (v: StoreView, id?: string) => void }) {
  const [issues, setIssues] = useState<MaterialIssue[]>(MATERIAL_ISSUES)
  const [tab, setTab]       = useState<"pending" | "issued" | "all">("all")
  const [search, setSearch] = useState("")
  const [issuing, setIssuing] = useState<string | null>(null)
  const [returning, setReturning] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState("")

  const filtered = issues.filter(iss => {
    const q  = search.toLowerCase()
    const mq = iss.issueNumber.toLowerCase().includes(q) || iss.productionOrder.toLowerCase().includes(q) || iss.materialName.toLowerCase().includes(q)
    const mt = tab === "all" || (tab === "pending" && iss.status === "pending") || (tab === "issued" && ["issued", "partial_return"].includes(iss.status))
    return mq && mt
  })

  const pending = issues.filter(i => i.status === "pending").length

  function handleIssue(id: string) {
    setIssuing(id)
    setTimeout(() => {
      setIssues(prev => prev.map(iss => iss.id === id
        ? { ...iss, status: "issued", issuedBy: "Luisa Dupont", issuedQty: iss.requestedQty }
        : iss))
      setIssuing(null)
      setSuccessMsg("Material issued successfully and stock updated.")
      setTimeout(() => setSuccessMsg(""), 4000)
    }, 900)
  }

  function handleReturn(id: string) {
    setReturning(id)
    setTimeout(() => {
      setIssues(prev => prev.map(iss => iss.id === id
        ? { ...iss, status: "returned", returnQty: iss.issuedQty }
        : iss))
      setReturning(null)
      setSuccessMsg("Return recorded and stock updated.")
      setTimeout(() => setSuccessMsg(""), 4000)
    }, 900)
  }

  return (
    <div>
      <PageHeader title="Material Issue" description="Issue materials to production work orders, track returns"
        primaryAction={{ label: "New Issue Request", onClick: () => onNavigate("issue-create"), icon: <PlusIcon /> }}
        badge={pending > 0 ? { label: `${pending} Pending`, variant: "warning" } : undefined}
        accentColor="#f59e0b" />

      {successMsg && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
          background: "var(--success-bg)", border: "1px solid var(--success-border)",
          borderRadius: "var(--radius-md)", marginBottom: 16 }}>
          <span style={{ color: "var(--success)" }}><CheckIcon /></span>
          <span style={{ fontSize: 13, color: "var(--success)", fontFamily: "var(--font-body)" }}>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid var(--border-subtle)" }}>
        {(["all", "pending", "issued"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "8px 18px", background: "none", border: "none",
              borderBottom: tab === t ? "2px solid var(--primary)" : "2px solid transparent",
              color: tab === t ? "var(--primary)" : "var(--text-muted)",
              cursor: "pointer", fontSize: 13, fontWeight: tab === t ? 600 : 400,
              fontFamily: "var(--font-body)", textTransform: "capitalize", marginBottom: -1 }}>
            {t === "all" ? "All Issues" : t === "pending" ? `Pending (${issues.filter(i => i.status === "pending").length})` : "Issued / Returned"}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ position: "relative", width: 280 }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}><SearchIcon /></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search issue no., WO or material..."
              style={{ ...inputSx, paddingLeft: 34 }} />
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)" }}>
                <Th>Issue No.</Th><Th>Work Order</Th><Th>Material</Th><Th>Date</Th>
                <Th right>Requested</Th><Th right>Issued</Th><Th right>Returned</Th>
                <Th>Issued By</Th><Th>Status</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: 13 }}>
                  No issues found.
                </td></tr>
              ) : filtered.map(iss => (
                <tr key={iss.id}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-elevated)"}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "transparent"}
                  style={{ transition: "background 0.1s" }}>
                  <Td mono><span style={{ fontSize: 11 }}>{iss.issueNumber}</span></Td>
                  <Td mono>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)" }}>{iss.productionOrder}</span>
                  </Td>
                  <Td>
                    <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{iss.materialName}</div>
                  </Td>
                  <Td nowrap>{fDate(iss.date)}</Td>
                  <Td right mono>{iss.requestedQty} {iss.unit}</Td>
                  <Td right mono>
                    <span style={{ color: iss.issuedQty > 0 ? "var(--success)" : "var(--text-muted)" }}>
                      {iss.issuedQty} {iss.unit}
                    </span>
                  </Td>
                  <Td right mono>
                    <span style={{ color: iss.returnQty > 0 ? "var(--info)" : "var(--text-muted)" }}>
                      {iss.returnQty} {iss.unit}
                    </span>
                  </Td>
                  <Td><span style={{ fontSize: 12, color: "var(--text-muted)" }}>{iss.issuedBy || "—"}</span></Td>
                  <Td><StatusBadge status={iss.status} cfg={ISSUE_CFG} /></Td>
                  <Td>
                    <div style={{ display: "flex", gap: 5 }}>
                      {iss.status === "pending" && (
                        <button onClick={() => handleIssue(iss.id)} disabled={issuing === iss.id}
                          style={{ padding: "4px 10px", borderRadius: 3, fontSize: 11,
                            background: "var(--success-bg)", border: "1px solid var(--success-border)",
                            color: "var(--success)", cursor: "pointer", fontFamily: "var(--font-body)",
                            display: "flex", alignItems: "center", gap: 4 }}>
                          <CheckIcon /> {issuing === iss.id ? "Issuing..." : "Issue"}
                        </button>
                      )}
                      {iss.status === "issued" && (
                        <button onClick={() => handleReturn(iss.id)} disabled={returning === iss.id}
                          style={{ padding: "4px 10px", borderRadius: 3, fontSize: 11,
                            background: "var(--info-bg)", border: "1px solid var(--info-border)",
                            color: "var(--info)", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                          {returning === iss.id ? "..." : "Return"}
                        </button>
                      )}
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

function CreateIssue({ onNavigate }: { onNavigate: (v: StoreView) => void }) {
  const [productionOrder, setPO]  = useState(PRODUCTION_ORDERS[0].id)
  const [materialId, setMat]      = useState(MATERIALS[0].id)
  const [qty, setQty]             = useState("")
  const [date, setDate]           = useState(new Date().toISOString().slice(0, 10))
  const [remarks, setRemarks]     = useState("")
  const [saving, setSaving]       = useState(false)
  const [success, setSuccess]     = useState(false)
  const [errors, setErrors]       = useState<Record<string, string>>({})

  const mat = MATERIALS.find(m => m.id === materialId) ?? MATERIALS[0]

  function validate() {
    const e: Record<string, string> = {}
    if (!qty || parseFloat(qty) <= 0) e.qty = "Enter a valid quantity"
    if (parseFloat(qty) > mat.currentQty) e.qty = `Insufficient stock. Available: ${mat.currentQty} ${mat.unit}`
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    setSaving(true)
    setTimeout(() => { setSaving(false); setSuccess(true) }, 900)
  }

  if (success) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 20 }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--success-bg)",
        border: "2px solid var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CheckIcon />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
          Issue Request Created
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          {qty} {mat.unit} of {mat.name} requested for {productionOrder}. Awaiting store approval.
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => onNavigate("material-issue")}
          style={{ padding: "8px 18px", borderRadius: "var(--radius-sm)", background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)", color: "var(--text-secondary)", cursor: "pointer",
            fontFamily: "var(--font-body)", fontSize: 13 }}>View All Issues</button>
        <button onClick={() => { setSuccess(false); setQty(""); setRemarks("") }}
          style={{ padding: "8px 18px", borderRadius: "var(--radius-sm)", background: "var(--primary)",
            border: "none", color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600 }}>
          New Request
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader title="New Material Issue Request" description="Request materials for a production work order"
        breadcrumbs={[{ label: "Material Issue", id: "material-issue" }, { label: "New Request" }]}
        onNavigate={id => { if (id === "material-issue") onNavigate("material-issue") }}
        accentColor="#f59e0b" />

      <div style={{ maxWidth: 560 }}>
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>

          <Fld label="Production / Work Order" required>
            <Sel value={productionOrder} onChange={setPO}>
              {PRODUCTION_ORDERS.map(o => <option key={o.id} value={o.id}>{o.id} — {o.description}</option>)}
            </Sel>
          </Fld>

          <Fld label="Material" required>
            <Sel value={materialId} onChange={setMat}>
              {MATERIALS.map(m => <option key={m.id} value={m.id}>{m.code} — {m.name} (Stock: {m.currentQty} {m.unit})</option>)}
            </Sel>
          </Fld>

          {/* Stock info card */}
          <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", padding: "12px 16px",
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
            borderLeft: `3px solid ${LEVEL_CFG[stockLevel(mat)].color}` }}>
            {[
              { label: "Current Stock", value: `${mat.currentQty} ${mat.unit}`, color: LEVEL_CFG[stockLevel(mat)].color },
              { label: "Min. Qty",      value: `${mat.minQty} ${mat.unit}`,     color: "var(--text-secondary)" },
              { label: "Location",      value: mat.location,                     color: "var(--text-secondary)" },
            ].map(d => (
              <div key={d.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 2 }}>{d.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: d.color, fontFamily: "var(--font-mono)" }}>{d.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Fld label={`Quantity (${mat.unit})`} required error={errors.qty}>
              <Inp type="number" value={qty} onChange={setQty} placeholder="0" error={!!errors.qty} />
            </Fld>
            <Fld label="Date Required"><Inp type="date" value={date} onChange={setDate} /></Fld>
          </div>

          <Fld label="Remarks / Purpose">
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2}
              style={{ ...inputSx, resize: "vertical" }} placeholder="Purpose, batch, job description..." />
          </Fld>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onNavigate("material-issue")}
              style={{ padding: "9px 16px", borderRadius: "var(--radius-sm)", background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)", color: "var(--text-secondary)", cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: 13 }}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving}
              style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)",
                background: saving ? "var(--bg-raised)" : "var(--warning)",
                border: "none", color: "#fff", cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600 }}>
              {saving ? "Submitting..." : "Submit Issue Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   STORE MODULE — router
══════════════════════════════════════════════════════════ */
export function StoreModule({ initialView = "dashboard", onNavigate: appNavigate }: {
  initialView?: StoreView
  onNavigate?: (id: string) => void
}) {
  const [view, setView]   = useState<StoreView>(initialView)
  const [detailId, setId] = useState<string | undefined>()

  useEffect(() => { setView(initialView) }, [initialView])

  const navigate = useCallback((v: StoreView, id?: string) => {
    const topViews = ["dashboard", "inventory", "purchase", "suppliers", "material-issue"]
    if (topViews.includes(v)) {
      const globalId = v === "dashboard" ? "storeDashboard" : v === "material-issue" ? "materialIssue" : v
      appNavigate?.(globalId)
    } else {
      setView(v)
      if (id !== undefined) setId(id)
    }
  }, [appNavigate])

  return (
    <div>

      {view === "dashboard"       && <StoreDashboard onNavigate={navigate} />}
      {view === "inventory"       && <InventoryList onNavigate={navigate} />}
      {view === "material-detail" && <MaterialDetail materialId={detailId ?? MATERIALS[0].id} onNavigate={navigate} />}
      {view === "purchase"        && <PurchaseList onNavigate={navigate} />}
      {view === "purchase-detail" && <PurchaseDetail poId={detailId ?? PURCHASE_ORDERS[0].id} onNavigate={navigate} />}
      {view === "purchase-create" && <CreatePurchaseOrder onNavigate={navigate} />}
      {view === "suppliers"       && <SupplierList onNavigate={navigate} />}
      {view === "supplier-detail" && <SupplierDetail supplierId={detailId ?? SUPPLIERS[0].id} onNavigate={navigate} />}
      {view === "material-issue"  && <MaterialIssueList onNavigate={navigate} />}
      {view === "issue-create"    && <CreateIssue onNavigate={navigate} />}

      <style>{`
        @media (max-width: 900px) {
          .store-detail-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .store-mat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
