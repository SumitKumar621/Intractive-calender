import type { AppTheme } from "./types";

export const DAYS_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const HOLIDAYS = [
  { date: "2025-01-01", name: "New Year's Day" },
  { date: "2025-01-20", name: "MLK Day" },
  { date: "2025-02-17", name: "Presidents' Day" },
  { date: "2025-05-26", name: "Memorial Day" },
  { date: "2025-07-04", name: "Independence Day" },
  { date: "2025-09-01", name: "Labor Day" },
  { date: "2025-11-27", name: "Thanksgiving" },
  { date: "2025-12-25", name: "Christmas" },
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-01-19", name: "MLK Day" },
  { date: "2026-02-16", name: "Presidents' Day" },
  { date: "2026-04-05", name: "Easter" },
  { date: "2026-05-25", name: "Memorial Day" },
  { date: "2026-07-04", name: "Independence Day" },
  { date: "2026-09-07", name: "Labor Day" },
  { date: "2026-11-26", name: "Thanksgiving" },
  { date: "2026-12-25", name: "Christmas" },
];

export const EVENT_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  blue:   { bg: "rgba(26,115,232,0.15)",  text: "#1a73e8", dot: "#1a73e8" },
  green:  { bg: "rgba(52,168,83,0.15)",   text: "#2d9644", dot: "#34a853" },
  purple: { bg: "rgba(103,58,183,0.15)",  text: "#7c4dff", dot: "#673ab7" },
  red:    { bg: "rgba(234,67,53,0.15)",   text: "#e53935", dot: "#ea4335" },
  orange: { bg: "rgba(251,140,0,0.15)",   text: "#e65100", dot: "#fb8c00" },
  teal:   { bg: "rgba(0,150,136,0.15)",   text: "#00796b", dot: "#009688" },
};

export const EVENT_EMOJIS = ["📌","🎯","🎉","🏖","💼","🚀","❤️","⭐","🎵","🍕","🏃","📚"];

// Theme tokens
export const THEMES: Record<AppTheme, {
  pageBg: string; cardBg: string; spiralBar: string;
  gridBg: string; notePanel: string; noteBorder: string;
  dayHead: string; textPrimary: string; textMuted: string;
  border: string; accent: string; btnBg: string;
}> = {
  light: {
    pageBg: "#e8ecf0", cardBg: "linear-gradient(145deg,#fff 0%,#f5f7fa 100%)",
    spiralBar: "#d0d4db", gridBg: "#fdfdff", notePanel: "rgba(0,0,0,0.02)",
    noteBorder: "rgba(0,0,0,0.06)", dayHead: "#9090a8", textPrimary: "#1a1a2e",
    textMuted: "#888", border: "rgba(0,0,0,0.08)", accent: "#1a73e8",
    btnBg: "rgba(0,0,0,0.06)",
  },
  dark: {
    pageBg: "#0f0f1a", cardBg: "linear-gradient(145deg,#1a1a2e 0%,#16213e 100%)",
    spiralBar: "#0d0d1a", gridBg: "rgba(255,255,255,0.02)", notePanel: "rgba(255,255,255,0.03)",
    noteBorder: "rgba(255,255,255,0.06)", dayHead: "#8080a0", textPrimary: "#e8e8f0",
    textMuted: "#9090a0", border: "rgba(255,255,255,0.1)", accent: "#4a9eff",
    btnBg: "rgba(255,255,255,0.08)",
  },
  ocean: {
    pageBg: "#0a1628", cardBg: "linear-gradient(145deg,#0d2137 0%,#0a3050 100%)",
    spiralBar: "#071525", gridBg: "rgba(0,150,255,0.04)", notePanel: "rgba(0,100,200,0.08)",
    noteBorder: "rgba(0,150,255,0.12)", dayHead: "#4a8ab0", textPrimary: "#c0ddf5",
    textMuted: "#5a90b0", border: "rgba(0,150,255,0.15)", accent: "#29b6f6",
    btnBg: "rgba(0,150,255,0.12)",
  },
  forest: {
    pageBg: "#0d1f10", cardBg: "linear-gradient(145deg,#132318 0%,#0f2b14 100%)",
    spiralBar: "#091510", gridBg: "rgba(0,200,80,0.04)", notePanel: "rgba(0,150,50,0.06)",
    noteBorder: "rgba(0,200,80,0.1)", dayHead: "#4a9060", textPrimary: "#b0e8c0",
    textMuted: "#4a8055", border: "rgba(0,200,80,0.12)", accent: "#4caf50",
    btnBg: "rgba(0,200,80,0.1)",
  },
  sunset: {
    pageBg: "#1a0a0f", cardBg: "linear-gradient(145deg,#2d1018 0%,#1f0c14 100%)",
    spiralBar: "#150810", gridBg: "rgba(255,80,50,0.04)", notePanel: "rgba(200,50,30,0.06)",
    noteBorder: "rgba(255,100,50,0.12)", dayHead: "#b06050", textPrimary: "#f0c0b0",
    textMuted: "#a06050", border: "rgba(255,100,50,0.15)", accent: "#ff7043",
    btnBg: "rgba(255,100,50,0.12)",
  },
};

// ── Pure helpers ────────────────────────────────────────────
export function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function startDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function isoToday(): string {
  const t = new Date();
  return toISO(t.getFullYear(), t.getMonth(), t.getDate());
}

export function compareDateISO(a: string, b: string): number {
  return parseISO(a).getTime() - parseISO(b).getTime();
}

export function formatDisplayDate(iso: string): string {
  return parseISO(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export function formatRange(start: string, end: string): string {
  const days = Math.round((parseISO(end).getTime() - parseISO(start).getTime()) / 86400000) + 1;
  return `${formatDisplayDate(start)} → ${formatDisplayDate(end)} (${days} day${days !== 1 ? "s" : ""})`;
}

export function getWeekNumber(iso: string): number {
  const d = parseISO(iso);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
}

export function getSpiralCount(w: number): number {
  return Math.max(8, Math.floor(w / 28));
}

export function countWeekdaysInRange(start: string, end: string): { weekdays: number; weekends: number } {
  let cur = parseISO(start).getTime();
  const endT = parseISO(end).getTime();
  let weekdays = 0, weekends = 0;
  while (cur <= endT) {
    const dow = new Date(cur).getDay();
    dow === 0 || dow === 6 ? weekends++ : weekdays++;
    cur += 86400000;
  }
  return { weekdays, weekends };
}

// Storage helpers
const NOTES_KEY = "wall_calendar_notes_v2";
const EVENTS_KEY = "wall_calendar_events_v1";
const THEME_KEY = "cal_theme";

export function loadNotes() {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
export function saveNotes(n: unknown[]) {
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(n)); } catch {}
}
export function loadEvents() {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
export function saveEvents(e: unknown[]) {
  try { localStorage.setItem(EVENTS_KEY, JSON.stringify(e)); } catch {}
}
export function loadTheme(): AppTheme {
  try {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem(THEME_KEY) as AppTheme) ?? "light";
  } catch { return "light"; }
}
export function saveTheme(t: AppTheme) {
  try { localStorage.setItem(THEME_KEY, t); } catch {}
}
