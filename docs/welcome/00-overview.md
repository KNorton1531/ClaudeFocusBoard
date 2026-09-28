# Welcome Message: Overview

## What it is
A two-line greeting pinned to the **top left** of the board. Sleek and friendly.

```
Morning Kyle, it's the first day of Winter.      <- Header (big)
Christmas is 24 days away. Time to get cozy.     <- Sub-header (small, softer color)
```

## Always current
Uses the **real** date and time, even if theme / season is overridden in settings.

## Header vs Sub-header
| | Header | Sub-header |
|---|---|---|
| Size | Large | Small, softer |
| About | Right now: time of day + today's big moment | The wider picture: season, holiday, week |
| Changes | Every time period (5 to 6 times a day) | Mostly once a day |
| Built from | Greeting + optional "today" line | One context line |

## How it's built
```
Header:     {greeting}, {name}. {todayLine}
Sub-header: {widerLine}
```
The greeting always comes from time of day. Which line wins is in **08-priority.md**.

Holidays and special days have **stages** (build-up, tomorrow, the day, after), so they run for set times.

## Picking between several lines
Each slot has 2+ lines. Pick one **per day** (not random every render), so it doesn't flicker on refresh. Simple way: use the day of the year to choose which line.

## Takeover days
On a holiday or special day itself, that day fills both lines (see 03-holidays.md).

## Placeholders
| Placeholder | Becomes |
|---|---|
| `{name}` | Kyle |
| `{season}` | Winter |
| `{holiday}` | Christmas |
| `{daysUntil}` | 24 |
| `{day}` | Friday |

## Files (plan)
| File | Category |
|---|---|
| 01-time-of-day.md | Greetings and time lines (header) |
| 02-seasons.md | Seasons and first day of season |
| 03-holidays.md | Holidays and countdowns |
| 04-special-days.md | Personal days (birthday etc.) |
| 05-calendar-days.md | Day of week, new month, new year |
| 06-weather.md | Weather lines (later) |
| 07-display-style.md | Look and behaviour |
| 08-priority.md | Who wins when messages overlap, with worked examples |
| 10-logic.md | How messages are picked (rules, priority numbers, tested prototype) |
| 09-old-version-notes.md | What we kept and improved from Kyle's old WelcomeBanner |

## Code shape (later)
```
src/content/welcome/
  timeOfDay.js
  seasons.js
  holidays.js
  specialDays.js
  calendarDays.js
  weather.js
src/components/Welcome/
  Welcome.jsx           shows header + sub-header
  pickWelcome.js        the priority rules above
```
Content files are plain lists, so adding a message = adding a line.
