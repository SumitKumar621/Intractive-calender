"use client";

import type { Note } from "../types";
import { MONTHS, formatDisplayDate, formatRange } from "../utils";

interface Props {
  notes: Note[];
  onAdd: (text: string, date: string | null) => void;
  onDelete: (id: string) => void;
  selectedStart: string | null;
  selectedEnd: string | null;
  currentMonthKey: string;
  themeText: string;
  themeMuted: string;
  themeBorder: string;
  dark: boolean;
  noteText: string;
  setNoteText: (t: string) => void;
  noteScope: "month" | "range";
  setNoteScope: (s: "month" | "range") => void;
  noteSearch: string;
  setNoteSearch: (s: string) => void;
}

export default function NotesPanel({
  notes, onAdd, onDelete,
  selectedStart, selectedEnd, currentMonthKey,
  themeText, themeMuted, themeBorder, dark,
  noteText, setNoteText, noteScope, setNoteScope,
  noteSearch, setNoteSearch,
}: Props) {
  const monthIdx = parseInt(currentMonthKey.split("-")[1]) - 1;
  const hasRange = selectedStart !== null;

  const rangeLabel = selectedStart && selectedEnd
    ? formatRange(selectedStart, selectedEnd)
    : selectedStart ? formatDisplayDate(selectedStart) : null;

  const filtered = notes.filter((n) =>
    n.text.toLowerCase().includes(noteSearch.toLowerCase())
  );
  const rangeNotes = filtered.filter((n) => n.date !== null);
  const monthNotes = filtered.filter((n) => n.date === null);

  function handleAdd() {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    onAdd(trimmed, noteScope === "range" && selectedStart ? selectedStart : null);
    setNoteText("");
  }

  const surface = dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)";
  const scopeActive = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";

  return (
    <div className="flex flex-col gap-3 h-full" style={{ fontFamily: "var(--font-inter)" }}>
      {/* Header + search */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: themeMuted }}>
          📋 Notes
        </span>
        <div className="flex-1">
          <input
            id="note-search"
            type="text"
            value={noteSearch}
            onChange={(e) => setNoteSearch(e.target.value)}
            placeholder="Search notes…"
            className="w-full text-xs px-2 py-1 rounded-lg outline-none"
            style={{
              background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
              color: themeText, border: `1px solid ${themeBorder}`,
            }}
          />
        </div>
      </div>

      {/* Scope toggle */}
      <div className="flex rounded-lg overflow-hidden text-xs" style={{ border: `1px solid ${themeBorder}` }}>
        <button id="note-scope-month" onClick={() => setNoteScope("month")}
          className="flex-1 py-1.5 transition-colors cursor-pointer font-medium"
          style={{ background: noteScope === "month" ? "#1a73e8" : "transparent", color: noteScope === "month" ? "#fff" : themeMuted }}>
          Month
        </button>
        <button id="note-scope-range" onClick={() => hasRange && setNoteScope("range")}
          className="flex-1 py-1.5 transition-colors font-medium"
          style={{
            background: noteScope === "range" ? "#e76f51" : "transparent",
            color: noteScope === "range" ? "#fff" : themeMuted,
            opacity: hasRange ? 1 : 0.45,
            cursor: hasRange ? "pointer" : "not-allowed",
          }}
          disabled={!hasRange}>
          Range
        </button>
      </div>

      {/* Range badge */}
      {noteScope === "range" && rangeLabel && (
        <div className="text-xs rounded-lg px-3 py-2 font-medium"
          style={{ background: "rgba(231,111,81,0.1)", color: "#e76f51", border: "1px solid rgba(231,111,81,0.2)" }}>
          {rangeLabel}
        </div>
      )}

      {/* Textarea */}
      <div className="rounded-xl overflow-hidden" style={{ background: surface, border: `1px solid ${themeBorder}` }}>
        <textarea
          id="note-textarea"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.ctrlKey || e.metaKey) && handleAdd()}
          placeholder={noteScope === "month"
            ? `Note for ${MONTHS[monthIdx]}…`
            : "Note for this date range…"}
          rows={2}
          className="w-full resize-none p-3 outline-none text-sm"
          style={{ background: "transparent", color: themeText, minHeight: "60px" }}
        />
        <div className="flex items-center justify-between px-3 pb-2"
          style={{ borderTop: `1px solid ${themeBorder}` }}>
          <span className="text-xs" style={{ color: themeMuted }}>Ctrl+Enter</span>
          <button id="add-note-btn" onClick={handleAdd} disabled={!noteText.trim()}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: noteScope === "month" ? "#1a73e8" : "#e76f51", color: "#fff" }}>
            Add
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex flex-col gap-1.5 overflow-y-auto flex-1" style={{ maxHeight: "200px" }}>
        {filtered.length === 0 ? (
          <p className="text-xs text-center py-4" style={{ color: themeMuted }}>
            {noteSearch ? "No matching notes" : "No notes yet ✨"}
          </p>
        ) : (
          <>
            {rangeNotes.map((n) => <NoteItem key={n.id} note={n} onDelete={onDelete} dark={dark} type="range" themeMuted={themeMuted} />)}
            {monthNotes.map((n) => <NoteItem key={n.id} note={n} onDelete={onDelete} dark={dark} type="month" themeMuted={themeMuted} />)}
          </>
        )}
      </div>
    </div>
  );
}

function NoteItem({ note, onDelete, dark, type, themeMuted }: {
  note: Note; onDelete: (id: string) => void;
  dark: boolean; type: "month" | "range"; themeMuted: string;
}) {
  const isRange = type === "range";
  return (
    <div className="note-item group flex items-start gap-2 rounded-xl px-3 py-2.5 transition-all"
      style={{
        background: isRange
          ? (dark ? "rgba(231,111,81,0.1)" : "rgba(231,111,81,0.06)")
          : (dark ? "rgba(26,115,232,0.1)" : "rgba(26,115,232,0.06)"),
        border: `1px solid ${isRange ? "rgba(231,111,81,0.18)" : "rgba(26,115,232,0.14)"}`,
      }}>
      <span className="text-base flex-shrink-0 mt-0.5">{isRange ? "📌" : "📝"}</span>
      <div className="flex-1 min-w-0">
        {note.date && (
          <p className="text-xs font-semibold mb-0.5" style={{ color: isRange ? "#e76f51" : "#1a73e8" }}>
            {formatDisplayDate(note.date)}
          </p>
        )}
        <p className="text-xs leading-relaxed break-words" style={{ color: dark ? "#c8c8e0" : "#3a3a5a" }}>
          {note.text}
        </p>
      </div>
      <button onClick={() => onDelete(note.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1 text-xs"
        style={{ color: "#e53935" }}>✕</button>
    </div>
  );
}
