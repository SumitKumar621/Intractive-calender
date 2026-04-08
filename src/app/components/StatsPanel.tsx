"use client";

import { useMemo } from "react";
import type { Note, CalEvent } from "../types";
import { MONTHS, countWeekdaysInRange, formatRange, formatDisplayDate, parseISO, HOLIDAYS } from "../utils";

interface Props {
  year: number;
  month: number;
  selectedStart: string | null;
  selectedEnd: string | null;
  notes: Note[];
  events: CalEvent[];
  dark: boolean;
  themeMuted: string;
  themeText: string;
  themeBorder: string;
}

export default function StatsPanel({
  year, month, selectedStart, selectedEnd,
  notes, events, dark, themeMuted, themeText, themeBorder,
}: Props) {
  const currentMonthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const stats = useMemo(() => {
    // Days in month
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Weekdays / weekends
    let weekdays = 0, weekends = 0;
    for (let d = 1; d <= totalDays; d++) {
      const dow = new Date(year, month, d).getDay();
      dow === 0 || dow === 6 ? weekends++ : weekdays++;
    }

    // Holidays in month
    const monthHolidays = HOLIDAYS.filter((h) => h.date.startsWith(currentMonthKey));

    // Range stats
    let rangeInfo: { days: number; weekdays: number; weekends: number } | null = null;
    if (selectedStart && selectedEnd) {
      const { weekdays: rWd, weekends: rWe } = countWeekdaysInRange(selectedStart, selectedEnd);
      const totalRange = Math.round((parseISO(selectedEnd).getTime() - parseISO(selectedStart).getTime()) / 86400000) + 1;
      rangeInfo = { days: totalRange, weekdays: rWd, weekends: rWe };
    }

    // Countdown
    let countdown: number | null = null;
    if (selectedEnd) {
      const diffMs = parseISO(selectedEnd).getTime() - Date.now();
      countdown = Math.ceil(diffMs / 86400000);
    }

    // Notes/events
    const monthNoteCount = notes.filter((n) => n.date === null || n.date.startsWith(currentMonthKey)).length;
    const monthEventCount = events.filter((e) => e.date.startsWith(currentMonthKey)).length;

    return { totalDays, weekdays, weekends, monthHolidays, rangeInfo, countdown, monthNoteCount, monthEventCount };
  }, [year, month, selectedStart, selectedEnd, notes, events, currentMonthKey]);

  const card = (label: string, value: string | number, sub?: string, color?: string) => (
    <div className="rounded-xl px-3 py-2.5 flex flex-col gap-0.5"
      style={{ background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${themeBorder}` }}>
      <span className="text-lg font-bold leading-none" style={{ color: color ?? themeText, fontFamily: "var(--font-outfit)" }}>
        {value}
      </span>
      <span className="text-xs font-medium" style={{ color: themeMuted }}>{label}</span>
      {sub && <span className="text-xs" style={{ color: themeMuted, opacity: 0.7 }}>{sub}</span>}
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: themeMuted }}>
        📊 {MONTHS[month]} Stats
      </span>

      {/* Month grid */}
      <div className="grid grid-cols-2 gap-2">
        {card("Total Days", stats.totalDays)}
        {card("Weekdays", stats.weekdays, `${stats.weekends} weekend days`)}
        {card("Holidays", stats.monthHolidays.length, stats.monthHolidays[0]?.name ?? "—")}
        {card("Notes & Events", stats.monthNoteCount + stats.monthEventCount,
          `${stats.monthNoteCount} notes · ${stats.monthEventCount} events`)}
      </div>

      {/* Range stats — only if selection complete */}
      {stats.rangeInfo && selectedStart && selectedEnd && (
        <div className="rounded-xl p-3 flex flex-col gap-2"
          style={{ background: dark ? "rgba(231,111,81,0.08)" : "rgba(231,111,81,0.06)", border: "1px solid rgba(231,111,81,0.18)" }}>
          <p className="text-xs font-semibold" style={{ color: "#e76f51" }}>Selected Range</p>
          <p className="text-xs" style={{ color: themeMuted }}>{formatRange(selectedStart, selectedEnd)}</p>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {card("Days", stats.rangeInfo.days, undefined, "#e76f51")}
            {card("Workdays", stats.rangeInfo.weekdays)}
            {card("Weekends", stats.rangeInfo.weekends)}
          </div>
        </div>
      )}

      {/* Countdown */}
      {stats.countdown !== null && (
        <div className="rounded-xl px-4 py-3 text-center"
          style={{ background: dark ? "rgba(26,115,232,0.1)" : "rgba(26,115,232,0.06)", border: "1px solid rgba(26,115,232,0.15)" }}>
          <p className="text-2xl font-bold" style={{ color: "#1a73e8", fontFamily: "var(--font-outfit)" }}>
            {stats.countdown > 0 ? `${stats.countdown}d` : stats.countdown === 0 ? "Today!" : `${Math.abs(stats.countdown)}d ago`}
          </p>
          <p className="text-xs mt-0.5" style={{ color: themeMuted }}>
            {stats.countdown > 0 ? "until end of selection" : stats.countdown === 0 ? "end date is today" : "past end date"}
          </p>
        </div>
      )}

      {/* Holidays list */}
      {stats.monthHolidays.length > 0 && (
        <div className="rounded-xl p-3"
          style={{ background: dark ? "rgba(244,162,97,0.07)" : "rgba(244,162,97,0.05)", border: "1px solid rgba(244,162,97,0.18)" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "#f4a261" }}>🎉 Holidays</p>
          <div className="flex flex-col gap-1">
            {stats.monthHolidays.map((h) => (
              <div key={h.date} className="flex items-center gap-2 text-xs">
                <span className="font-bold" style={{ color: "#f4a261", minWidth: "20px" }}>
                  {parseInt(h.date.split("-")[2])}
                </span>
                <span style={{ color: dark ? "#d0a070" : "#8a5a2a" }}>{h.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
