"use client";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { resolvedTheme, toggleTheme, theme, setTheme } = useTheme();

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        style={{
          width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center",
          justifyContent: "center", background: "var(--bg-subtle)", border: "1px solid var(--border)",
          cursor: "pointer", color: "var(--ink-2)", transition: "all 0.15s",
        }}
        onMouseEnter={e => { (e.currentTarget.style.background = "var(--bg-muted)"); }}
        onMouseLeave={e => { (e.currentTarget.style.background = "var(--bg-subtle)"); }}
      >
        {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", background: "var(--bg-subtle)", border: "1px solid var(--border)", borderRadius: 10, padding: 3, gap: 2 }}>
      {(["light", "system", "dark"] as const).map(t => {
        const icons = { light: <Sun size={14} />, system: <Monitor size={14} />, dark: <Moon size={14} /> };
        const labels = { light: "Light", system: "System", dark: "Dark" };
        return (
          <button key={t} onClick={() => setTheme(t)}
            title={labels[t]}
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7,
              border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              fontFamily: "var(--font-sans)", transition: "all 0.15s",
              background: theme === t ? "var(--surface)" : "transparent",
              color: theme === t ? "var(--ink-1)" : "var(--ink-4)",
              boxShadow: theme === t ? "var(--shadow-xs)" : "none",
            }}>
            {icons[t]} {labels[t]}
          </button>
        );
      })}
    </div>
  );
}
