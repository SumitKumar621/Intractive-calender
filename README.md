<div align="center">

<br/>

# 📅 Wall Calendar

### *A polished, interactive wall calendar built with Next.js 16 & React 19*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br/>

> A frontend engineering challenge submission — translating a physical wall calendar into a  
> highly functional, beautiful, and fully responsive React component.

<br/>

</div>

---

## ✨ Live Preview

<div align="center">

| Desktop | Mobile |
|:---:|:---:|
| Full side-by-side layout with hero + grid + tabbed panel | Gracefully stacked — calendar → tabs → notes |

</div>

---

## 🛠 Core Features

### 📸 Wall Calendar Aesthetic
The UI closely mirrors a **physical wall calendar**:
- Metallic **spiral binding** at the top (responsive ring count)
- Full-bleed **hero photograph** with cinematic gradient overlay
- Bold **month & year badge** overlaid on the photo bottom-right
- Clean paper-white calendar grid below

### 📅 Day Range Selector
Click-to-start, click-to-finish range selection with rich visual states:

| State | Visual |
|---|---|
| **Start date** | Solid blue circle, left-rounded pill |
| **End date** | Solid orange circle, right-rounded pill |
| **Days in between** | Soft blue fill across the row |
| **Single day** | Full blue circle |
| **Today** | Pulsing ring indicator |
| **Hover preview** | Live range highlight while picking the end date |

An info banner appears below the nav showing the full range and total day count.

### 📋 Integrated Notes
Three-mode notes system, all persisted to `localStorage`:
- **Month notes** — general memos for the current month
- **Range notes** — pinned to the selected date/range (shown with 📌)
- **Search** — real-time filter across all notes

### 📱 Fully Responsive Design
| Breakpoint | Layout |
|---|---|
| **Desktop (`lg+`)** | Hero image → side-by-side: calendar left, tabbed panel right |
| **Mobile (< `lg`)** | Hero → full-width calendar → tabs stacked below |

All interactive elements are touch-friendly with large tap targets.

---

## 🎨 Themes

Five hand-crafted color themes, switchable instantly from the hero overlay:

| Icon | Theme | Palette |
|:---:|---|---|
| ☀️ | **Light** | Clean white, crisp blue accents |
| 🌙 | **Dark** | Deep navy, soft blue highlights |
| 🌊 | **Ocean** | Dark teal, cyan accents |
| 🌲 | **Forest** | Deep green, emerald tones |
| 🌅 | **Sunset** | Deep crimson, warm coral |

Theme preference is saved to `localStorage` and restored on next visit.

---

## 🚀 Extra Features

Beyond the baseline requirements:

| Feature | Description |
|---|---|
| 🎯 **Color-coded Events** | Create events per day with 6 colors + 12 emoji choices |
| 📊 **Stats Panel** | Month breakdown: weekdays, weekends, holidays, notes/events count |
| ⏳ **Countdown Timer** | Live "X days until end of selection" display |
| 🗓 **Mini Month Picker** | Click the month title for a quick year/month jump grid |
| 🔢 **Week Numbers** | Toggle ISO week numbers as a left grid column |
| ⌨️ **Keyboard Navigation** | `←` `→` to navigate months, `Escape` to clear selection |
| ⎘ **Copy Range** | One-click copy of selection summary to clipboard |
| 🔴 **Multi-dot Indicators** | Per-day dots for holidays, events, and notes |
| 🎉 **Holiday Markers** | US holidays auto-highlighted with orange dots + list |
| 🔍 **Note Search** | Filter notes by text in real-time |
| 🌀 **Page-flip Animation** | 3D perspective flip when changing months |
| 💾 **Full Persistence** | Notes, events, and theme saved via `localStorage` |

---

## 🗂 Project Structure

```
src/
└── app/
    ├── page.tsx              # Main calendar component + layout
    ├── types.ts              # Shared TypeScript interfaces
    ├── utils.ts              # Pure helpers, constants, theme tokens, storage
    ├── globals.css           # Tailwind v4 + custom animations & spiral CSS
    ├── layout.tsx            # Root layout with Outfit + Inter fonts
    └── components/
        ├── NotesPanel.tsx    # Notes tab: add/delete/search, month & range scope
        ├── EventsPanel.tsx   # Events tab: color-coded events with emoji picker
        └── StatsPanel.tsx    # Stats tab: analytics, countdown, holiday list
```

---

## ⚙️ Tech Choices

| Choice | Rationale |
|---|---|
| **Next.js 16 App Router** | File-system routing, React Server Components foundation |
| **React 19** | Latest concurrent features, `useCallback` / `useMemo` for perf |
| **TypeScript** | Full type safety across all state and props |
| **Tailwind CSS v4** | Utility-first styling, `@theme` tokens for design system |
| **`next/image`** | Automatic optimisation for the hero photo |
| **`localStorage`** | Client-side persistence — no backend required |
| **`ResizeObserver`** | Responsive spiral ring count reacts to actual container width |
| **`crypto.randomUUID()`** | Collision-free IDs for notes and events |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/SumitKumar621/Intractive-calender.git
cd Intractive-calender

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
Open [https://intractivecalender.vercel.app/](https://intractivecalender.vercel.app/) Link


### Build for Production

```bash
npm run build
npm run start
```

---

## 🎮 How to Use

| Action | How |
|---|---|
| **Navigate months** | Click `‹` `›` buttons or press `←` `→` arrow keys |
| **Jump to any month** | Click the "April 2026 ▾" title → mini picker popup |
| **Select a date range** | Click a start day → click an end day |
| **Clear selection** | Click the `✕` button or press `Escape` |
| **Add a note** | Type in the Notes tab → click **Add** or press `Ctrl+Enter` |
| **Add an event** | Select a date → switch to Events tab → pick color & emoji → **Add Event** |
| **Toggle week numbers** | Click the `W#` button in the nav bar |
| **Copy range** | Click `⎘ Copy` after making a selection |
| **Switch theme** | Click any of the 5 emoji theme buttons on the hero image |
| **Go to today** | Click the **Today** button |

---

## 📋 Requirements Coverage

| Requirement | Status |
|---|---|
| Wall Calendar Aesthetic (hero image + grid) | ✅ |
| Day Range Selector (start / end / in-between states) | ✅ |
| Notes — general month memos | ✅ |
| Notes — attached to date range | ✅ |
| Responsive Desktop (side-by-side layout) | ✅ |
| Responsive Mobile (stacked, touch-friendly) | ✅ |
| Creative extras (themes, animations, holidays…) | ✅ |

---

## 🚢 Deploy

The fastest way to deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or deploy to **Netlify**, **Railway**, or any Node.js host — it's a standard Next.js app with no backend.

---

<div align="center">

Built with ❤️ for the Frontend Engineering Challenge

</div>
