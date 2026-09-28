# Notes from Kyle's old WelcomeBanner

## Keep
- Hour-by-hour header lines (now in 01-time-of-day.md).
- Main + sub welcome split.
- Holiday "takeover" on the day itself (both lines).
- "Soon" windows before holidays and seasons.
- Weekend lines at set times (now in 05-calendar-days.md).
- UK holidays: Bonfire Night, Remembrance Day, Boxing Day, St Patrick's.
- Optional name (no name = no ", Kyle").
- Date line under the welcome (optional setting, see 07-display-style.md).

## Improve
- **Messages in data files, not code.** Old version had every message inside a long if/else chain. New version: lists in `content/welcome/*.js`, one small function picks from them. Adding a message = adding a line.
- **One priority list.** Old version relied on the order of if blocks, with early `return`s, to decide who wins. New version writes the order down (08-priority.md).
- **No Moment.js.** It's no longer maintained. Plain JavaScript `Date` is enough.
- **No Firebase.** Name comes from settings (localStorage).
- **Check every minute, not every second.** The text only changes by the hour.
- **Season flags were never used** in the old version. Now wired in.
- **Variety.** 2+ lines per slot, picked once per day, so it doesn't feel repetitive.
