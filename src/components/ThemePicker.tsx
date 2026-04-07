"use client";

import { useEffect, useState } from "react";

type ThemeName = "cozy" | "ocean" | "forest";
type Mode = "light" | "dark";

const themes: { name: ThemeName; label: string; icon: string; colors: [string, string] }[] = [
  { name: "cozy", label: "Cozy", icon: "🕯️", colors: ["#c48a4a", "#a0714a"] },
  { name: "ocean", label: "Ocean", icon: "🌊", colors: ["#2e94c2", "#1a7aaa"] },
  { name: "forest", label: "Forest", icon: "🌿", colors: ["#569743", "#3f7a31"] },
];

export default function ThemePicker() {
  const [activeTheme, setActiveTheme] = useState<ThemeName>("cozy");
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("color-theme") as ThemeName | null;
    const isDark = document.documentElement.classList.contains("dark");
    if (saved && themes.some((t) => t.name === saved)) {
      setActiveTheme(saved);
    }
    setDark(isDark);
  }, []);

  function applyTheme(name: ThemeName) {
    const el = document.documentElement;
    // Remove old theme classes
    themes.forEach((t) => el.classList.remove(`theme-${t.name}`));
    // Add new one
    el.classList.add(`theme-${name}`);
    setActiveTheme(name);
    localStorage.setItem("color-theme", name);
  }

  function toggleMode() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <div className="relative flex items-center gap-1.5">
      {/* Dark mode toggle */}
      <button
        onClick={toggleMode}
        className="p-2 rounded-full bg-warm-200 dark:bg-warm-700 hover:bg-warm-300 dark:hover:bg-warm-600 transition-colors"
        aria-label="Toggle dark mode"
      >
        {dark ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {/* Theme picker */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full bg-warm-200 dark:bg-warm-700 hover:bg-warm-300 dark:hover:bg-warm-600 transition-colors"
        aria-label="Change theme"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a7 7 0 0 0 0 14 4 4 0 0 1 0 8 10 10 0 0 0 0-20z" fill="currentColor" opacity="0.3" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
          <circle cx="15" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="15" r="1.5" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-warm-800 rounded-2xl shadow-xl border border-warm-200 dark:border-warm-700 p-2 min-w-[160px]">
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  applyTheme(t.name);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTheme === t.name
                    ? "bg-warm-100 dark:bg-warm-700 text-warm-900 dark:text-warm-50"
                    : "text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-warm-700/50"
                }`}
              >
                <span className="text-base">{t.icon}</span>
                <span>{t.label}</span>
                <div className="ml-auto flex gap-0.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: t.colors[0] }}
                  />
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: t.colors[1] }}
                  />
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
