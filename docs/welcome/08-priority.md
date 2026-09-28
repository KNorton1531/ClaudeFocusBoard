# Priority (who wins when messages overlap)

The logic behind this is in **10-logic.md**: each rule has a priority number, and the highest match wins. The lists below are the same order in plain words.

## Step 1: Takeover days (both lines)
If today is a holiday or special day **itself**, it fills both header and sub-header. Stop.
Order if two land on one day: Special day > Remembrance Day > other holidays.

## Step 2: Header
`{short greeting or hourly line}` + optional today line. First match wins:
1. Special day / holiday: tomorrow - "Morning, Kyle. It's Halloween tomorrow."
2. Season: first day / starts tomorrow - "Morning, Kyle. It's the first day of Winter."
3. Calendar: first/last day of month, year moments
4. Nothing matched: use the full **hourly line** on its own - "Dawn's breaking, Kyle."

## Step 3: Sub-header
First match wins:
1. Special day: build-up / after
2. Holiday: build-up / after
3. Weekend window (set times)
4. Weather [later]
5. Season moment: first week / last week
6. Season + time of day
7. Season (any day)

A line used in the header is never repeated in the sub-header.

## Worked examples
| Date and time | Header | Sub-header |
|---|---|---|
| Wed 14 Oct, 6am | Dawn's breaking, Kyle. | Spooky season. 17 days to Halloween. |
| Fri 30 Oct, 9am | Morning, Kyle. It's Halloween tomorrow. | Crisp one out there. |
| Sat 31 Oct, 7pm | Happy Halloween, Kyle! 🎃 | Trick or treaters are out. |
| Wed 11 Nov, 11am | Remembrance Day. | Two minutes' silence at 11. |
| Tue 1 Dec, 8am | Morning, Kyle. It's the first day of Winter. | 24 days until Christmas. |
| Thu 24 Dec, 11pm | Santa's on his way, Kyle. | Best get to sleep. |
| Fri in May, 2pm | A good time for a short break, Kyle. | It's Friday! The weekend is just around the corner. |
| Sun in Feb, 6pm | Evening, Kyle. How's your day gone? | Sadly the weekend is almost over. |
| Tue in Feb, 3am | It's the dead of night, Kyle. | Blanket season. |
