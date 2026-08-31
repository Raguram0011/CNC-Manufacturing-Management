import { useState, useEffect, useRef, type ReactNode } from "react"
import type { NavGroup } from "../config/navigation"
import { NavIcon, SearchIcon, XIcon } from "./Icons"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  navGroups: NavGroup[]
  onNavigate: (id: string) => void
}

const RECENT = [
  { id: "production", label: "Production", type: "page" },
  { id: "quality", label: "Quality Control", type: "page" },
]

const QUICK_ACTIONS = [
  { label: "New Work Order", icon: "Production", shortcut: "⌘N" },
  { label: "Log Attendance", icon: "Attendance", shortcut: "⌘A" },
  { label: "Raise Purchase Request", icon: "Purchase", shortcut: "⌘P" },
  { label: "File Expense Claim", icon: "Expenses", shortcut: "⌘E" },
]

export function SearchModal({ isOpen, onClose, navGroups, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const allItems = navGroups.flatMap((g) =>
    g.items.map((item) => ({ ...item, group: g.label }))
  )

  const filtered = query.length > 0
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.group.toLowerCase().includes(query.toLowerCase())
      )
    : []

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery("")
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (!isOpen) onClose() /* parent toggles */
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSelect = (id: string) => {
    onNavigate(id)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 300,
          backdropFilter: "blur(4px)",
          animation: "fade-in 0.1s ease-out",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "15vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(560px, 90vw)",
          background: "var(--bg-overlay)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-xl), 0 0 40px rgba(37,99,235,0.15)",
          zIndex: 301,
          overflow: "hidden",
          animation: "fade-in 0.15s ease-out",
        }}
      >
        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <SearchIcon size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, modules, actions…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 14,
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              caretColor: "var(--primary)",
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 0 }}
            >
              <XIcon size={14} />
            </button>
          )}
          <kbd
            onClick={onClose}
            style={{
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-xs)",
              padding: "2px 6px",
              background: "var(--bg-raised)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results / defaults */}
        <div style={{ maxHeight: 420, overflowY: "auto", padding: "8px" }}>
          {query.length === 0 ? (
            <>
              {/* Recent pages */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 8px 6px" }}>
                  Recent
                </div>
                {RECENT.map((item) => (
                  <SearchResult
                    key={item.id}
                    icon={<NavIcon name={item.label.replace(/ /g, "")} size={14} />}
                    label={item.label}
                    sub="Recently visited"
                    onClick={() => handleSelect(item.id)}
                  />
                ))}
              </div>

              {/* Quick actions */}
              <div>
                <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 8px 6px" }}>
                  Quick Actions
                </div>
                {QUICK_ACTIONS.map((action) => (
                  <SearchResult
                    key={action.label}
                    icon={<NavIcon name={action.icon} size={14} />}
                    label={action.label}
                    badge={action.shortcut}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </>
          ) : filtered.length > 0 ? (
            <div>
              <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 8px 6px" }}>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
              {filtered.map((item) => (
                <SearchResult
                  key={item.id}
                  icon={<NavIcon name={item.icon} size={14} />}
                  label={item.label}
                  sub={item.group}
                  onClick={() => handleSelect(item.id)}
                />
              ))}
            </div>
          ) : (
            <div style={{ padding: "32px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 8, color: "var(--text-muted)" }}>◈</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>No results for "{query}"</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Try a different module or action name</div>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div
          style={{
            display: "flex",
            gap: 16,
            padding: "8px 16px",
            borderTop: "1px solid var(--border-subtle)",
            background: "var(--bg-surface)",
          }}
        >
          {[["↑↓", "Navigate"], ["↵", "Select"], ["ESC", "Close"]].map(([key, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <kbd style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", padding: "1px 5px", background: "var(--bg-raised)" }}>
                {key}
              </kbd>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function SearchResult({ icon, label, sub, badge, onClick }: {
  icon: ReactNode; label: string; sub?: string; badge?: string; onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        padding: "8px 10px",
        borderRadius: "var(--radius-sm)",
        border: "none",
        cursor: "pointer",
        background: hovered ? "var(--primary-subtle)" : "transparent",
        color: hovered ? "var(--primary)" : "var(--text-secondary)",
        transition: "background 0.1s ease, color 0.1s ease",
        textAlign: "left",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "var(--radius-sm)",
          background: hovered ? "var(--primary-subtle)" : "var(--bg-raised)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: hovered ? "var(--primary)" : "var(--text-muted)",
          transition: "background 0.1s ease",
        }}
      >
        {icon}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: hovered ? "var(--primary)" : "var(--text-primary)" }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{sub}</div>}
      </div>
      {badge && (
        <kbd style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xs)", padding: "1px 5px", background: "var(--bg-raised)", flexShrink: 0 }}>
          {badge}
        </kbd>
      )}
      <ChevronRight hovered={hovered} />
    </button>
  )
}

function ChevronRight({ hovered }: { hovered: boolean }) {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={hovered ? "var(--primary)" : "var(--text-muted)"} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  )
}
