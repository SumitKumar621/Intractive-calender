"use client";

import { useState } from "react";
import type { CalEvent, EventColor } from "../types";
import { EVENT_COLORS, EVENT_EMOJIS, formatDisplayDate, MONTHS } from "../utils";

interface Props {
  events: CalEvent[];
  onAdd: (e: Omit<CalEvent, "id">) => void;
  onDelete: (id: string) => void;
  selectedDate: string | null;
  currentMonthKey: string;
  themeText: string;
  themeMuted: string;
  themeBorder: string;
  dark: boolean;
}

export default function EventsPanel({
  events, onAdd, onDelete,
  selectedDate, currentMonthKey,
  themeText, themeMuted, themeBorder, dark,
}: Props) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState<EventColor>("blue");
  const [emoji, setEmoji] = useState("📌");
  const [open, setOpen] = useState(false);

  const monthIdx = parseInt(currentMonthKey.split("-")[1]) - 1;
  const monthEvents = events
    .filter((e) => e.date.startsWith(currentMonthKey))
    .sort((a, b) => a.date.localeCompare(b.date));

  function handleAdd() {
    if (!title.trim() || !selectedDate) return;
    onAdd({ date: selectedDate, title: title.trim(), color, emoji });
    setTitle("");
    setOpen(false);
  }

  const surface = dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)";

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: themeMuted }}>
          🎯 Events
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", color: themeMuted }}>
          {MONTHS[monthIdx]}
        </span>
      </div>

      {/* Add form toggle */}
      {selectedDate ? (
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${themeBorder}`, background: surface }}>
          <div className="px-3 pt-3 pb-1">
            <p className="text-xs font-semibold mb-2" style={{ color: themeMuted }}>
              📅 {formatDisplayDate(selectedDate)}
            </p>
            <input
              id="event-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Event title…"
              className="w-full text-sm outline-none bg-transparent"
              style={{ color: themeText }}
            />
          </div>

          {/* Emoji picker */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {EVENT_EMOJIS.map((em) => (
              <button key={em} id={`emoji-${em}`}
                onClick={() => setEmoji(em)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer"
                style={{ background: em === emoji ? (dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)") : "transparent" }}>
                {em}
              </button>
            ))}
          </div>

          {/* Color picker */}
          <div className="px-3 pb-2 flex gap-1.5 items-center">
            {(Object.keys(EVENT_COLORS) as EventColor[]).map((c) => (
              <button key={c} id={`color-${c}`}
                onClick={() => setColor(c)}
                className="w-5 h-5 rounded-full transition-all cursor-pointer"
                style={{
                  background: EVENT_COLORS[c].dot,
                  outline: c === color ? `2px solid ${EVENT_COLORS[c].dot}` : "none",
                  outlineOffset: "2px",
                  transform: c === color ? "scale(1.2)" : "scale(1)",
                }} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 px-3 pb-3" style={{ borderTop: `1px solid ${themeBorder}`, paddingTop: "8px" }}>
            <button id="add-event-btn"
              onClick={handleAdd}
              disabled={!title.trim()}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40"
              style={{ background: EVENT_COLORS[color].dot, color: "#fff" }}>
              Add Event
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-center py-3" style={{ color: themeMuted }}>
          Select a date on the calendar to add an event
        </p>
      )}

      {/* Events list */}
      <div className="flex flex-col gap-1.5 overflow-y-auto flex-1" style={{ maxHeight: "220px" }}>
        {monthEvents.length === 0 ? (
          <p className="text-xs text-center py-4" style={{ color: themeMuted }}>
            No events this month ✨
          </p>
        ) : (
          monthEvents.map((ev) => (
            <EventItem key={ev.id} event={ev} onDelete={onDelete} dark={dark} themeMuted={themeMuted} />
          ))
        )}
      </div>
    </div>
  );
}

function EventItem({ event, onDelete, dark, themeMuted }: {
  event: CalEvent; onDelete: (id: string) => void;
  dark: boolean; themeMuted: string;
}) {
  const c = EVENT_COLORS[event.color];
  return (
    <div className="group flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
      style={{ background: c.bg, border: `1px solid ${c.dot}22` }}>
      <span className="text-sm flex-shrink-0">{event.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate" style={{ color: c.text }}>{event.title}</p>
        <p className="text-xs" style={{ color: themeMuted }}>{formatDisplayDate(event.date)}</p>
      </div>
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      <button onClick={() => onDelete(event.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs cursor-pointer px-1"
        style={{ color: "#e53935" }}>✕</button>
    </div>
  );
}
