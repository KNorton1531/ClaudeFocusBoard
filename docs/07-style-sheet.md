# Style Sheet

## Visual style
- **Mood**: cozy, calm, soft. Nothing sharp or loud.
- **App cards**: frosted glass (semi-transparent + blur), rounded corners, soft shadow.
- **Motion**: slow and gentle. Nothing faster than ~300ms for UI.
- **Sound**: off by default, soft fades in/out.

## Design tokens (starting values, "Warm Cafe")
```css
:root {
  --color-bg: #2b211c;
  --color-surface: rgba(255, 244, 230, 0.12);
  --color-text: #f6ead8;
  --color-text-soft: #cdb89f;
  --color-accent: #e8a86b;

  --font-body: "Nunito", sans-serif;
  --font-heading: "Quicksand", sans-serif;

  --radius: 16px;
  --blur: 12px;
  --space-s: 8px;
  --space-m: 16px;
  --space-l: 24px;
  --shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
```

## Code style rules
- One component per file. File name matches component name (`Clock.jsx`).
- Always full `if () {} else {}`. No ternaries, no `&&` shortcuts in JSX logic.
- Clear names over short names (`isTimerRunning`, not `r`).
- Short comment at the top of each App explaining what it does.
- Content (text, lists, links) goes in `content/` data files, not inside components.
- Colors and sizes only come from CSS variables, never hard-coded in a component.

Example:
```jsx
// Greeting: shows a message based on the time of day.
function Greeting() {
  const hour = new Date().getHours();
  let message = "";

  if (hour < 12) {
    message = "Good morning";
  } else if (hour < 18) {
    message = "Good afternoon";
  } else {
    message = "Good evening";
  }

  return <h1 className="greeting">{message}</h1>;
}
```
