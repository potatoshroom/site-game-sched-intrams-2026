# SITE Game Schedule — UdD Intramurals 2026

A static web app for tracking **Team SITE's** game schedule and results during the **Universidad de Dagupan Intramurals 2026** (March 18–27, 2026).

## Features

- **Schedule view** — all matches grouped by day and sport
- **Calendar view** — monthly overview with per-day event indicators
- **Tally view** — win/loss summary across all sports
- **Sport filters** — quickly filter by Basketball, Volleyball, Beach Volleyball, Chess, Scrabble, Table Tennis, Badminton, Mobile Legends, Call of Duty, or Special Events
- **Live results** — scores, win/lose badges, and stage labels (semis, finals, 3rd place)
- **Dynamic stats strip** — game days, sports, opponents, and total matches
- **Light/Dark theme toggle**
- **Today's Events** floating nav — jumps to the current day's matches
- **Announcement overlay** — result announcements for notable outcomes

## Sports Covered

| Sport | Category |
|---|---|
| Basketball | Men 5v5 |
| Volleyball | Men & Women |
| Beach Volleyball | Mixed |
| Chess | — |
| Scrabble | — |
| Table Tennis | — |
| Badminton | — |
| Mobile Legends | Esports |
| Call of Duty Mobile | Esports |

## Project Structure

```
├── index.html       # App shell and layout
├── style.css        # All styles (dark/light theme)
├── script.js        # Rendering logic, filtering, calendar, tally
├── data.js          # Schedule data — edit here to update results
├── public/
│   └── images/
│       └── sportslogos/   # SVG sport icons
└── favicon.ico
```

## Updating Match Results

All schedule data lives in [data.js](data.js). Each match entry looks like:

```js
{
  time: "2:30 PM",
  tbd: null,           // true if time is a slot (e.g. "2nd Game PM")
  opp: "CISTE",        // opponent department code
  stage: null,         // "semis" | "finals" | "3rd" | null
  result: "win",       // "win" | "lose" | null (null = not yet played)
  score: { site: 80, opp: 93 },  // null to hide score
}
```

## Departments

| Code | Department |
|---|---|
| SITE | School of Information Technology Education (our team) |
| CISTE | College of Information Systems and Technology Education |
| SOHE | School of Home Economics |
| SOHS | School of Health Sciences |
| SBA | School of Business Administration |
| SIHM | School of International Hospitality Management |

## Running Locally

No build step required — open `index.html` directly in a browser, or serve with any static file server:

```bash
npx serve .
```

---

Made for **Team SITE** — Universidad de Dagupan Intramurals 2026
By **Marc France P. Cabiles**
