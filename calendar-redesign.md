# Modern Agenda & Interactive Calendar Redesign

## Goal
Transform the sidebar Agenda component into a modern, accessible, and high-utility tool for interventional cardiologists, featuring category filtering, view toggling (Month Grid vs Upcoming Events List), polished event cards with high-contrast indicator dots, and direct calendar export (Google Calendar, Apple Calendar, Outlook .ics).

## Tasks
- [x] Task 1: Refactor `js/modern-calendar.js` data model to support richer metadata (duration, Google Calendar URL generator, .ics download generator, categories, and multiple events per date) → Verify: Verify calendar data structure and export helper functions.
- [x] Task 2: Implement UI controls in `js/modern-calendar.js`: View toggle (`[📅 Mês | 📋 Próximos]`), category chips filter (`Todos`, `Congressos`, `Webinars`, `Cursos`), and "Hoje" indicator → Verify: Check buttons render and trigger active states.
- [x] Task 3: Upgrade Month Grid in `js/modern-calendar.js` with high-contrast day numbers, category indicator dots under dates, and active selection state → Verify: Date numbers are crisp white, dots align underneath.
- [x] Task 4: Implement Upcoming Events List view (`📋 Próximos`) in `js/modern-calendar.js` with countdown badges and quick actions → Verify: Switching to list shows upcoming chronological cards.
- [x] Task 5: Redesign Event Detail Drawer in `js/modern-calendar.js` with integrated header accent, multiple-event carousel/tabs if applicable, and calendar export dropdown (`Google Calendar`, `Apple Agenda`, `Outlook .ics`) → Verify: Clicking "Salvar na Agenda" opens dropdown with functioning links/downloads.
- [x] Task 6: Modernize styles in `css/modern-hub.css` for both light and dark/blue themes (`[data-theme="blue"]`), ensuring accessible contrast, smooth transitions, and seamless card integration without awkward border cuts → Verify: Inspect styling and contrast across themes.
- [x] Task 7: Verify integration in `new/index.html` and `new.html`, test interactive behavior in browser environment, and run validation scripts → Verify: Python lint/audit scripts pass cleanly.

## Done When
- [x] Numbers on dates are crisp and legible across all themes.
- [x] Events are indicated by elegant color dots under numbers instead of hard-to-read rings.
- [x] User can toggle between Month grid and Upcoming Events list.
- [x] User can filter by category (`Todos`, `Congressos`, `Webinars`, `Cursos`).
- [x] User can click "Salvar na Agenda" to add to Google Calendar, Apple Calendar, or Outlook (.ics).
- [x] Detail drawer animates smoothly without clashing border-radius/borders.
