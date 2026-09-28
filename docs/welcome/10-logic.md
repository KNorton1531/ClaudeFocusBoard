# Welcome Logic (redesign)

Replaces the old long if/else chain with **3 data files + 1 picker**.
A working prototype (tested) is in `welcome/prototype/`.

## The big idea
Every message is a **rule** with the same shape. The picker finds every rule that matches right now, sorts by priority, and takes the top one for each line. No special cases in the code.

## The files
| File | Holds | Who edits it |
|---|---|---|
| `events.js` | Named dates (Halloween, Christmas, Easter, first day of winter) | Anyone |
| `messages.js` | Every message rule | Anyone |
| `hours.js` | The fallback header line for each hour | Anyone |
| `pickWelcome.js` | The picking logic | Rarely touched |

## 1. Events: dates live in one place
```js
export const events = {
  halloween: { date: "10-31" },                                  // same every year (MM-DD)
  easter: { dates: ["2026-04-05", "2027-03-28", "2028-04-16"] }, // moves, list each year
};
```

## 2. Rules: one shape for every message
```js
{
  name: "Halloween tomorrow",          // just a label for you
  priority: PRIORITY.tomorrow,         // higher wins
  when: {                              // ALL must be true. Leave a field out to ignore it.
    event: "halloween", from: -1, to: -1,   // days from the event (-1 = day before, 0 = the day)
    hours: [17, 23],                   // from 5pm to 11pm (24h clock)
    days: ["Friday"],                  // days of the week
    season: "autumn",                  // spring / summer / autumn / winter
  },
  header: ["{greeting} It's Halloween tomorrow."],   // header lines (optional)
  sub: ["..."],                                      // sub-header lines (optional)
}
```

The stages from the holiday lists become plain windows:
| Stage | `from` / `to` |
|---|---|
| Build-up (a month out) | `from: -30, to: -2` |
| Tomorrow | `from: -1, to: -1` |
| The day | `from: 0, to: 0` |
| After | `from: 1, to: 1` |

**Takeover** needs no special code: a rule with **both** `header` and `sub` fills both lines.

## 3. Priority: named numbers, not the order of the code
```js
export const PRIORITY = {
  specialDay: 100,  // birthday etc.
  holidayDay: 90,   // the day itself
  tomorrow: 80,
  seasonStart: 70,  // first day of a season
  calendar: 60,     // new month, longest day
  weekend: 50,      // Friday afternoon etc.
  weather: 40,      // later
  buildUp: 35,      // "17 days to Halloween"
  seasonMoment: 30, // first / last week of a season
  seasonTime: 20,   // "Crisp one out there" (autumn morning)
  season: 10,       // "Blanket season"
};
```
To make a rule beat another in the same group, add 1 (e.g. `PRIORITY.holidayDay + 1` for the Halloween evening version).

## 4. How the picker works
1. Check every rule against right now. Keep the ones that match.
2. Sort them, highest priority first.
3. **Header** = first match with `header` lines. None? Use `hours.js` for this hour.
4. **Sub-header** = if the header rule also has `sub` lines, use them (takeover). Otherwise, first match with `sub` lines that isn't about the same event.
5. Pick one line from the list. Same line all day (uses the day of the year).
6. Fill placeholders.

## Placeholders
| Placeholder | Becomes |
|---|---|
| `{greeting}` | Short greeting for the hour: "Morning, Kyle." |
| `{name}` | Kyle |
| `{daysUntil}` | Days until the event |

Add `{greeting}` at the start of a header line when you want "Morning, Kyle." before it. Leave it off for standalone lines like "Happy Halloween! 🎃".

## Tested results (from the prototype)
| Date and time | Header | Sub-header |
|---|---|---|
| Wed 14 Oct, 6am | Dawn's breaking, Kyle. | Spooky season. 17 days to Halloween. |
| Fri 30 Oct, 9am | Morning, Kyle. It's Halloween tomorrow. | Crisp one out there. |
| Sat 31 Oct, 10am | Happy Halloween! 🎃 | Hope it's spooky and fun. |
| Sat 31 Oct, 7pm | Happy Halloween, Kyle! 🎃 | Trick or treaters are out. |
| Tue 1 Dec, 8am | Morning, Kyle. It's the first day of Winter. | 24 days until Christmas. |
| Mon 28 Dec, 3pm | Afternoon, Kyle. | 4 days left of the year. |
| Fri 15 May, 2pm | A good time for a short break, Kyle. | It's Friday! The weekend is just around the corner. |
| Tue 2 Feb, 3am | It's the dead of night, Kyle. | Blanket season. |

## Why this is better than the old version
- Adding a message never touches the logic. Add a rule, done.
- Priority is written as numbers, not hidden in the order of if blocks and early `return`s.
- Year wrap works (New Year build-up in December, "after" stages in January).
- Moving dates (Easter) are just a list.
- The picker is about 150 lines of plain JS with full if/else, no libraries.
