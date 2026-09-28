# Welcome: Display and Behaviour

## Position and look
- Pinned **top left**, always visible, not draggable (it's not an App).
- Header: large, heading font (Quicksand), `--color-text`.
- Sub-header: smaller, body font, `--color-text-soft`.
- Soft text shadow so it reads on any background. No box behind it (optional frosted pill if hard to read).

```
Morning Kyle, it's the first day of Winter.
24 days until Christmas.
```

## Behaviour
- Checks the time **every minute**. Only re-renders when the text actually changes.
- When the text changes, gentle fade (about 600ms).
- Same line all day for the same situation (no random changes on refresh).
- Emoji: only on big days (birthday, Halloween, Christmas). Can be turned off in settings.

## Settings
- Your name
- Show sub-header: on / off
- Show date line under the welcome (e.g. "Tuesday October 28th"): on / off
- Show emoji: on / off
- Hemisphere: North / South (flips seasons)
- Hide welcome completely: on / off

Note: settings can't fake the date or time here. The welcome is always current.
