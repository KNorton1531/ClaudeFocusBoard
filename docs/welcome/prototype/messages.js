// messages.js: every welcome message rule.
// "when" = all of these must be true. Leave a field out to ignore it.
export const PRIORITY = {
  specialDay: 100,
  holidayDay: 90,
  tomorrow: 80,
  seasonStart: 70,
  calendar: 60,
  weekend: 50,
  weather: 40,
  buildUp: 35,
  seasonMoment: 30,
  seasonTime: 20,
  season: 10,
};

export const messages = [
  {
    name: "Halloween build-up",
    priority: PRIORITY.buildUp,
    when: { event: "halloween", from: -30, to: -2 },
    sub: ["Spooky season. {daysUntil} days to Halloween."],
  },
  {
    name: "Halloween tomorrow",
    priority: PRIORITY.tomorrow,
    when: { event: "halloween", from: -1, to: -1 },
    header: ["{greeting} It's Halloween tomorrow."],
  },
  {
    name: "Halloween evening",
    priority: PRIORITY.holidayDay + 1,
    when: { event: "halloween", from: 0, to: 0, hours: [17, 23] },
    header: ["Happy Halloween, {name}! 🎃"],
    sub: ["Trick or treaters are out."],
  },
  {
    name: "Halloween",
    priority: PRIORITY.holidayDay,
    when: { event: "halloween", from: 0, to: 0 },
    header: ["Happy Halloween! 🎃"],
    sub: ["Hope it's spooky and fun."],
  },
  {
    name: "Christmas build-up",
    priority: PRIORITY.buildUp,
    when: { event: "christmas", from: -24, to: -2 },
    sub: ["{daysUntil} days until Christmas."],
  },
  {
    name: "New Year build-up",
    priority: PRIORITY.buildUp,
    when: { event: "newYear", from: -5, to: -2 },
    sub: ["{daysUntil} days left of the year."],
  },
  {
    name: "First day of winter",
    priority: PRIORITY.seasonStart,
    when: { event: "winterStart", from: 0, to: 0 },
    header: ["{greeting} It's the first day of Winter."],
  },
  {
    name: "Friday afternoon",
    priority: PRIORITY.weekend,
    when: { days: ["Friday"], hours: [12, 16] },
    sub: ["It's Friday! The weekend is just around the corner."],
  },
  {
    name: "Autumn morning",
    priority: PRIORITY.seasonTime,
    when: { season: "autumn", hours: [5, 11] },
    sub: ["Crisp one out there."],
  },
  {
    name: "Winter",
    priority: PRIORITY.season,
    when: { season: "winter" },
    sub: ["Blanket season.", "Stay warm."],
  },
];
