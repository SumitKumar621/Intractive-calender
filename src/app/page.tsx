"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import type { Note, CalEvent, AppTheme } from "./types";
import {
  DAYS_SHORT, MONTHS, THEMES, HOLIDAYS,
  toISO, parseISO, daysInMonth, startDayOfMonth, isoToday,
  compareDateISO, formatDisplayDate, formatRange, getWeekNumber,
  getSpiralCount, loadNotes, saveNotes, loadEvents, saveEvents,
  loadTheme, saveTheme,
} from "./utils";
import EventsPanel from "./components/EventsPanel";
import NotesPanel from "./components/NotesPanel";
import StatsPanel from "./components/StatsPanel";

/* ─── Theme picker ─────────────────────────────────────────── */
const THEME_LIST: { key: AppTheme; label: string; icon: string }[] = [
  { key: "light",  label: "Light",   icon: "☀️" },
  { key: "dark",   label: "Dark",    icon: "🌙" },
  { key: "ocean",  label: "Ocean",   icon: "🌊" },
  { key: "forest", label: "Forest",  icon: "🌲" },
  { key: "sunset", label: "Sunset",  icon: "🌅" },
];

/* ─── Spiral ───────────────────────────────────────────────── */
function SpiralBinding({ count }: { count: number }) {
  return (
    <div className="flex justify-center items-center gap-3.5 px-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="spiral-ring" />
      ))}
    </div>
  );
}

/* ─── Day cell ─────────────────────────────────────────────── */
type RangeStatus = "start" | "end" | "mid" | "single" | "none";

function DayCell({
  day, iso, isToday, isWeekend, rangeStatus, hasEvent, hasNote, isHoliday,
  onClick, onMouseEnter, t,
}: {
  day: number; iso: string; isToday: boolean; isWeekend: boolean;
  rangeStatus: RangeStatus; hasEvent: boolean; hasNote: boolean; isHoliday: boolean;
  onClick: () => void; onMouseEnter: () => void;
  t: typeof THEMES[AppTheme];
}) {
  const isStart = rangeStatus === "start" || rangeStatus === "single";
  const isEnd   = rangeStatus === "end"   || rangeStatus === "single";
  const isMid   = rangeStatus === "mid";
  const isSelected = isStart || isEnd;

  const cellBg = isSelected
    ? isStart ? "#1a73e8" : "#e76f51"
    : isMid ? "rgba(26,115,232,0.18)" : "transparent";

  const radius = rangeStatus === "single" ? "50%"
    : rangeStatus === "start"  ? "50% 0 0 50%"
    : rangeStatus === "end"    ? "0 50% 50% 0"
    : rangeStatus === "mid"    ? "0"
    : "50%";

  const textColor = isSelected ? "#fff"
    : isToday ? "#1a73e8"
    : isWeekend ? (t.textPrimary === "#1a1a2e" ? "#e53935" : "#ff8a80")
    : t.textPrimary;

  return (
    <div className="relative flex flex-col items-center" onMouseEnter={onMouseEnter}
      style={{ padding: isMid ? "0" : "2px" }}>
      {isMid && (
        <div className="absolute inset-0" style={{ background: cellBg }} />
      )}
      <button
        id={`day-${iso}`}
        onClick={onClick}
        aria-label={`${day}${isHoliday ? " (holiday)" : ""}${isToday ? " (today)" : ""}`}
        className="day-cell relative z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        style={{
          background: isSelected ? cellBg : "transparent",
          color: textColor, borderRadius: radius,
          fontWeight: isToday || isSelected ? "700" : isWeekend ? "600" : "500",
          fontSize: "0.8rem", fontFamily: "var(--font-outfit)",
        }}
      >
        {isToday && !isSelected && (
          <span className="today-pulse absolute inset-0 rounded-full"
            style={{ border: "2px solid #1a73e8", borderRadius: "50%" }} />
        )}
        <span className="relative z-10">{day}</span>
      </button>

      {/* Dots: holiday / event / note */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
        {isHoliday && <div className="w-1 h-1 rounded-full" style={{ background: isSelected ? "rgba(255,255,255,0.7)" : "#f4a261" }} />}
        {hasEvent  && <div className="w-1 h-1 rounded-full" style={{ background: isSelected ? "rgba(255,255,255,0.7)" : "#34a853" }} />}
        {hasNote   && <div className="w-1 h-1 rounded-full" style={{ background: isSelected ? "rgba(255,255,255,0.7)" : "#9c27b0" }} />}
      </div>
    </div>
  );
}

/* ─── Mini Month Picker ────────────────────────────────────── */
function MiniPicker({ year, month, onChange, onClose, t }: {
  year: number; month: number;
  onChange: (y: number, m: number) => void;
  onClose: () => void;
  t: typeof THEMES[AppTheme];
}) {
  const [pickYear, setPickYear] = useState(year);
  return (
    <div className="absolute top-12 left-0 z-50 rounded-2xl p-4 shadow-2xl"
      style={{ background: t.cardBg.includes("gradient") ? "#1a1a2e" : "#fff", border: `1px solid ${t.border}`, minWidth: "220px" }}>
      {/* Year nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setPickYear(y => y - 1)} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer text-lg"
          style={{ background: t.btnBg, color: t.textPrimary }}>‹</button>
        <span className="font-bold text-sm" style={{ color: t.textPrimary, fontFamily: "var(--font-outfit)" }}>{pickYear}</span>
        <button onClick={() => setPickYear(y => y + 1)} className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer text-lg"
          style={{ background: t.btnBg, color: t.textPrimary }}>›</button>
      </div>
      {/* Month grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {MONTHS.map((m, i) => (
          <button key={m} id={`pick-${m}`}
            onClick={() => { onChange(pickYear, i); onClose(); }}
            className="rounded-xl py-1.5 text-xs font-semibold cursor-pointer transition-all"
            style={{
              background: pickYear === year && i === month ? "#1a73e8" : t.btnBg,
              color: pickYear === year && i === month ? "#fff" : t.textMuted,
            }}>
            {m.slice(0, 3)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────────── */
export default function WallCalendar() {
  const today = isoToday();
  const now = new Date();

  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [theme, setTheme] = useState<AppTheme>("light");

  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd,   setSelectedEnd]   = useState<string | null>(null);
  const [hoverDate,     setHoverDate]     = useState<string | null>(null);
  const [selectingEnd,  setSelectingEnd]  = useState(false);

  const [notes,   setNotes]   = useState<Note[]>([]);
  const [events,  setEvents]  = useState<CalEvent[]>([]);
  const [noteText, setNoteText]   = useState("");
  const [noteScope, setNoteScope] = useState<"month" | "range">("month");
  const [noteSearch, setNoteSearch] = useState("");

  const [isFlipping, setIsFlipping] = useState(false);
  const [spiralCount, setSpiralCount] = useState(14);
  const [showPicker, setShowPicker]   = useState(false);
  const [sideTab, setSideTab] = useState<"notes" | "events" | "stats">("notes");
  const [showWeekNums, setShowWeekNums] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const t = THEMES[theme];
  const isDark = theme !== "light";

  const currentMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  /* ── Persist ── */
  useEffect(() => {
    setNotes(loadNotes());
    setEvents(loadEvents());
    setTheme(loadTheme());
  }, []);
  useEffect(() => { saveNotes(notes); }, [notes]);
  useEffect(() => { saveEvents(events); }, [events]);
  useEffect(() => { saveTheme(theme); }, [theme]);

  /* ── Spiral count ── */
  useEffect(() => {
    const update = () => {
      if (containerRef.current) setSpiralCount(getSpiralCount(containerRef.current.offsetWidth));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  /* ── Keyboard nav ── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft")  navigateMonth(-1);
      if (e.key === "ArrowRight") navigateMonth(1);
      if (e.key === "Escape") { clearSelection(); setShowPicker(false); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* ── Grid data ── */
  const { days, startPad } = useMemo(() => ({
    days: daysInMonth(year, month),
    startPad: startDayOfMonth(year, month),
  }), [year, month]);

  const holidayMap = useMemo(() => {
    const m = new Map<string, string>();
    HOLIDAYS.forEach((h) => m.set(h.date, h.name));
    return m;
  }, []);

  const eventDateSet = useMemo(() => {
    const s = new Set<string>();
    events.forEach((ev) => s.add(ev.date));
    return s;
  }, [events]);

  const noteDateSet = useMemo(() => {
    const s = new Set<string>();
    notes.forEach((n) => { if (n.date) s.add(n.date); });
    return s;
  }, [notes]);

  /* ── Navigation ── */
  function navigateMonth(dir: 1 | -1) {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setMonth((m) => {
        const nm = m + dir;
        if (nm > 11) { setYear((y) => y + 1); return 0; }
        if (nm < 0)  { setYear((y) => y - 1); return 11; }
        return nm;
      });
      setIsFlipping(false);
    }, 280);
  }

  function goToToday() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }

  /* ── Range selection ── */
  const handleDayClick = useCallback((iso: string) => {
    if (!selectingEnd || selectedStart === null) {
      setSelectedStart(iso);
      setSelectedEnd(null);
      setSelectingEnd(true);
    } else {
      if (iso === selectedStart) {
        setSelectedStart(null);
        setSelectedEnd(null);
        setSelectingEnd(false);
        return;
      }
      const [a, b] = compareDateISO(iso, selectedStart) < 0 ? [iso, selectedStart] : [selectedStart, iso];
      setSelectedStart(a);
      setSelectedEnd(b);
      setSelectingEnd(false);
    }
    setHoverDate(null);
  }, [selectingEnd, selectedStart]);

  const handleDayHover = useCallback((iso: string) => {
    if (selectingEnd) setHoverDate(iso);
  }, [selectingEnd]);

  function clearSelection() {
    setSelectedStart(null); setSelectedEnd(null);
    setSelectingEnd(false); setHoverDate(null);
  }

  function getRangeStatus(iso: string): RangeStatus {
    const hov = selectingEnd && hoverDate ? hoverDate : null;
    const realStart = hov && selectedStart
      ? compareDateISO(hov, selectedStart) < 0 ? hov : selectedStart
      : selectedStart;
    const realEnd = hov && selectedStart
      ? compareDateISO(hov, selectedStart) < 0 ? selectedStart : hov
      : selectedEnd;

    if (!realStart) return "none";
    if (!realEnd || realStart === realEnd) return iso === realStart ? "single" : "none";
    if (iso === realStart) return "start";
    if (iso === realEnd)   return "end";
    if (compareDateISO(iso, realStart) > 0 && compareDateISO(iso, realEnd) < 0) return "mid";
    return "none";
  }

  /* ── Notes CRUD ── */
  function addNote(text: string, date: string | null) {
    setNotes((p) => [{ id: crypto.randomUUID(), date, text, createdAt: Date.now() }, ...p]);
  }
  function deleteNote(id: string) { setNotes((p) => p.filter((n) => n.id !== id)); }

  /* ── Events CRUD ── */
  function addEvent(ev: Omit<CalEvent, "id">) {
    setEvents((p) => [{ ...ev, id: crypto.randomUUID() }, ...p]);
  }
  function deleteEvent(id: string) { setEvents((p) => p.filter((e) => e.id !== id)); }

  /* ── Copy range ── */
  function copyRange() {
    if (!selectedStart) return;
    const text = selectedEnd
      ? formatRange(selectedStart, selectedEnd)
      : formatDisplayDate(selectedStart);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  /* ── Filtered notes for side panel ── */
  const panelNotes = notes.filter(
    (n) => n.date === null || n.date.startsWith(currentMonthKey)
  );

  /* ── Week numbers for first col ── */
  const weekNumbers = useMemo(() => {
    const nums: number[] = [];
    for (let d = 1; d <= days; d++) {
      const iso = toISO(year, month, d);
      const dayOfWeek = (startPad + d - 1) % 7;
      if (dayOfWeek === 0 || d === 1) nums.push(getWeekNumber(iso));
    }
    return nums;
  }, [year, month, days, startPad]);

  return (
    <div
      id="calendar-root"
      className="min-h-screen flex items-center justify-center p-3 sm:p-8"
      style={{ background: t.pageBg, transition: "background 0.4s ease", fontFamily: "var(--font-inter)" }}
      onClick={(e) => { if (!(e.target as HTMLElement).closest("#month-picker-area")) setShowPicker(false); }}
    >
      <div
        ref={containerRef}
        id="calendar-container"
        className="w-full max-w-5xl"
        style={{
          borderRadius: "28px",
          boxShadow: isDark
            ? "0 40px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5)"
            : "0 40px 80px rgba(0,0,0,0.14), 0 8px 24px rgba(0,0,0,0.07)",
          overflow: "hidden",
          background: t.cardBg,
          transition: "background 0.4s ease",
        }}
      >
        {/* ── Spiral ── */}
        <div className="py-3" style={{ background: t.spiralBar, borderBottom: `1px solid ${t.border}` }}>
          <SpiralBinding count={spiralCount} />
        </div>

        {/* ── Hero ── */}
        <div className="relative overflow-hidden" style={{ height: "220px" }}>
          <Image src="/hero.png" alt={`${MONTHS[month]} hero`} fill priority
            sizes="(max-width:768px) 100vw, 80vw"
            className="object-cover" style={{ objectPosition: "center 40%" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.6) 100%)" }} />

          {/* Month badge */}
          <div className="absolute bottom-0 right-0 px-6 py-5"
            style={{ background: "linear-gradient(135deg,transparent,rgba(0,0,0,0.7) 60%)" }}>
            <p className="text-white/60 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-outfit)" }}>{year}</p>
            <h1 className="text-white text-3xl font-bold leading-none" style={{ fontFamily: "var(--font-outfit)" }}>
              {MONTHS[month].toUpperCase()}
            </h1>
          </div>

          {/* Theme picker overlay */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            {THEME_LIST.map(({ key, label, icon }) => (
              <button key={key} id={`theme-${key}`} onClick={() => setTheme(key)}
                title={label} aria-label={`Switch to ${label} theme`}
                className="w-8 h-8 rounded-full flex items-center justify-center text-base cursor-pointer transition-all"
                style={{
                  background: theme === key ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)",
                  backdropFilter: "blur(6px)",
                  transform: theme === key ? "scale(1.15)" : "scale(1)",
                  outline: theme === key ? "2px solid rgba(255,255,255,0.6)" : "none",
                }}>
                {icon}
              </button>
            ))}
          </div>

          {/* Selection badge on hero */}
          {selectedStart && selectedEnd && (
            <div className="absolute top-3 left-3 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ background: "rgba(231,111,81,0.85)", color: "#fff", backdropFilter: "blur(6px)" }}>
              {formatRange(selectedStart, selectedEnd)}
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col lg:flex-row">

          {/* ── LEFT: Calendar ── */}
          <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col gap-3">

            {/* Nav row */}
            <div className="flex items-center justify-between">
              <div className="relative flex items-center gap-2" id="month-picker-area">
                <button id="prev-month-btn" onClick={() => navigateMonth(-1)} aria-label="Previous month"
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-lg transition-all"
                  style={{ background: t.btnBg, color: t.textPrimary }}>‹</button>
                <button id="month-title-btn" onClick={() => setShowPicker((v) => !v)}
                  className="font-bold text-sm px-2 py-1 rounded-xl cursor-pointer transition-all"
                  style={{ color: t.textPrimary, background: showPicker ? t.btnBg : "transparent", fontFamily: "var(--font-outfit)" }}>
                  {MONTHS[month]} {year} ▾
                </button>
                <button id="next-month-btn" onClick={() => navigateMonth(1)} aria-label="Next month"
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-lg transition-all"
                  style={{ background: t.btnBg, color: t.textPrimary }}>›</button>

                {showPicker && (
                  <MiniPicker year={year} month={month} t={t}
                    onChange={(y, m) => { setYear(y); setMonth(m); }}
                    onClose={() => setShowPicker(false)} />
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {/* Week numbers toggle */}
                <button id="toggle-week-nums" onClick={() => setShowWeekNums((v) => !v)}
                  title="Toggle week numbers"
                  className="text-xs px-2.5 py-1.5 rounded-full cursor-pointer transition-all"
                  style={{ background: showWeekNums ? t.accent + "22" : t.btnBg, color: showWeekNums ? t.accent : t.textMuted, border: `1px solid ${showWeekNums ? t.accent + "44" : t.border}` }}>
                  W#
                </button>

                {/* Copy range */}
                {selectedStart && (
                  <button id="copy-range-btn" onClick={copyRange}
                    className="text-xs px-2.5 py-1.5 rounded-full cursor-pointer transition-all"
                    style={{ background: copied ? "rgba(52,168,83,0.15)" : t.btnBg, color: copied ? "#34a853" : t.textMuted, border: `1px solid ${t.border}` }}>
                    {copied ? "✓ Copied" : "⎘ Copy"}
                  </button>
                )}
                {selectedStart && (
                  <button id="clear-selection-btn" onClick={clearSelection}
                    className="text-xs px-2.5 py-1.5 rounded-full cursor-pointer"
                    style={{ background: "rgba(231,111,81,0.12)", color: "#e76f51", border: "1px solid rgba(231,111,81,0.25)" }}>
                    ✕
                  </button>
                )}
                <button id="today-btn" onClick={goToToday}
                  className="text-xs px-2.5 py-1.5 rounded-full cursor-pointer font-semibold"
                  style={{ background: isDark ? "rgba(26,115,232,0.18)" : "rgba(26,115,232,0.1)", color: "#1a73e8", border: "1px solid rgba(26,115,232,0.25)" }}>
                  Today
                </button>
              </div>
            </div>

            {/* Selection bar */}
            {selectedStart && (
              <div className="rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs"
                style={{
                  background: selectedEnd ? (isDark ? "rgba(231,111,81,0.1)" : "rgba(231,111,81,0.07)") : (isDark ? "rgba(26,115,232,0.1)" : "rgba(26,115,232,0.06)"),
                  border: `1px solid ${selectedEnd ? "rgba(231,111,81,0.2)" : "rgba(26,115,232,0.15)"}`,
                }}>
                <span className="text-base">{selectedEnd ? "📅" : "👆"}</span>
                <span style={{ color: selectedEnd ? "#e76f51" : "#1a73e8", fontWeight: 500 }}>
                  {selectedEnd
                    ? formatRange(selectedStart, selectedEnd)
                    : `${formatDisplayDate(selectedStart)} — pick end date`}
                </span>
              </div>
            )}

            {/* Calendar grid */}
            <div className={`rounded-2xl overflow-hidden ${isFlipping ? "flip-animation" : ""}`}
              style={{ background: t.gridBg }}>

              {/* Day headers */}
              <div className={`grid border-b`}
                style={{
                  gridTemplateColumns: showWeekNums ? "28px repeat(7,1fr)" : "repeat(7,1fr)",
                  borderColor: t.border,
                }}>
                {showWeekNums && <div className="py-2.5 text-center text-xs font-bold" style={{ color: t.textMuted, opacity: 0.5 }}>W</div>}
                {DAYS_SHORT.map((d) => (
                  <div key={d} className="text-center py-2.5 text-xs font-bold tracking-wider"
                    style={{ color: d === "SUN" || d === "SAT" ? (isDark ? "#ff8a80" : "#e53935") : t.dayHead, fontFamily: "var(--font-outfit)" }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid month-enter" style={{
                gridTemplateColumns: showWeekNums ? "28px repeat(7,1fr)" : "repeat(7,1fr)",
                padding: "8px 4px 12px",
              }}>
                {/* First row week-num */}
                {showWeekNums && startPad > 0 && (
                  <div className="flex items-start justify-center pt-2.5"
                    style={{ gridRow: 1, color: t.textMuted, fontSize: "9px", opacity: 0.6 }}>
                    {getWeekNumber(toISO(year, month, 1))}
                  </div>
                )}
                {/* Padding */}
                {Array.from({ length: startPad }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}

                {/* Days */}
                {Array.from({ length: days }).map((_, i) => {
                  const day = i + 1;
                  const iso = toISO(year, month, day);
                  const dw  = (startPad + i) % 7;
                  const isWeekend = dw === 0 || dw === 6;
                  const showWn = showWeekNums && dw === 0 && i > 0;

                  return (
                    <React.Fragment key={iso}>
                      {showWn && (
                        <div className="flex items-start justify-center pt-2.5"
                          style={{ color: t.textMuted, fontSize: "9px", opacity: 0.6 }}>
                          {getWeekNumber(iso)}
                        </div>
                      )}
                      <DayCell
                        day={day} iso={iso} isToday={iso === today}
                        isWeekend={isWeekend}
                        rangeStatus={getRangeStatus(iso)}
                        hasEvent={eventDateSet.has(iso)}
                        hasNote={noteDateSet.has(iso)}
                        isHoliday={holidayMap.has(iso)}
                        onClick={() => handleDayClick(iso)}
                        onMouseEnter={() => handleDayHover(iso)}
                        t={t}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 px-1">
              {[
                { color: "#1a73e8",          label: "Start" },
                { color: "#e76f51",          label: "End" },
                { color: "rgba(26,115,232,0.25)", label: "Range" },
                { color: "#f4a261",          label: "Holiday" },
                { color: "#34a853",          label: "Event" },
                { color: "#9c27b0",          label: "Note" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-xs" style={{ color: t.textMuted }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="hidden lg:block w-px my-5" style={{ background: t.noteBorder }} />
          <div className="lg:hidden h-px mx-5" style={{ background: t.noteBorder }} />

          {/* ── RIGHT: Tabbed Side Panel ── */}
          <div className="lg:w-80 xl:w-96 flex flex-col" style={{ borderLeft: `1px solid ${t.noteBorder}` }}>
            {/* Tab bar */}
            <div className="flex border-b" style={{ borderColor: t.noteBorder }}>
              {(["notes", "events", "stats"] as const).map((tab) => {
                const labels = { notes: "📋 Notes", events: "🎯 Events", stats: "📊 Stats" };
                return (
                  <button key={tab} id={`tab-${tab}`} onClick={() => setSideTab(tab)}
                    className="flex-1 py-3 text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      color: sideTab === tab ? t.accent : t.textMuted,
                      borderBottom: sideTab === tab ? `2px solid ${t.accent}` : "2px solid transparent",
                      background: "transparent",
                    }}>
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="flex-1 p-4 overflow-y-auto" style={{ background: t.notePanel }}>
              {sideTab === "notes" && (
                <NotesPanel
                  notes={panelNotes} onAdd={addNote} onDelete={deleteNote}
                  selectedStart={selectedStart} selectedEnd={selectedEnd}
                  currentMonthKey={currentMonthKey}
                  themeText={t.textPrimary} themeMuted={t.textMuted}
                  themeBorder={t.border} dark={isDark}
                  noteText={noteText} setNoteText={setNoteText}
                  noteScope={noteScope} setNoteScope={setNoteScope}
                  noteSearch={noteSearch} setNoteSearch={setNoteSearch}
                />
              )}
              {sideTab === "events" && (
                <EventsPanel
                  events={events} onAdd={addEvent} onDelete={deleteEvent}
                  selectedDate={selectedStart}
                  currentMonthKey={currentMonthKey}
                  themeText={t.textPrimary} themeMuted={t.textMuted}
                  themeBorder={t.border} dark={isDark}
                />
              )}
              {sideTab === "stats" && (
                <StatsPanel
                  year={year} month={month}
                  selectedStart={selectedStart} selectedEnd={selectedEnd}
                  notes={notes} events={events}
                  dark={isDark}
                  themeMuted={t.textMuted} themeText={t.textPrimary} themeBorder={t.border}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-2.5 flex items-center justify-between text-xs"
          style={{ borderTop: `1px solid ${t.noteBorder}`, background: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)" }}>
          <span style={{ color: t.textMuted }}>
            {selectingEnd ? "👆 Click another day to finish range" : "Click a day to start · ← → keys to navigate"}
          </span>
          <span style={{ color: t.textMuted, opacity: 0.6 }}>📅 Wall Calendar</span>
        </div>
      </div>
    </div>
  );
}
