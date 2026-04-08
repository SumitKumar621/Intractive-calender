export interface Note {
  id: string;
  date: string | null;
  text: string;
  createdAt: number;
}

export interface CalEvent {
  id: string;
  date: string;        // ISO YYYY-MM-DD
  title: string;
  color: EventColor;
  emoji: string;
}

export type EventColor =
  | "blue"
  | "green"
  | "purple"
  | "red"
  | "orange"
  | "teal";

export interface Holiday {
  date: string;
  name: string;
}

export type AppTheme = "light" | "dark" | "ocean" | "forest" | "sunset";
