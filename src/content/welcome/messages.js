// messages.js: every welcome message rule.
//
// when:   ALL of these must be true. Leave a field out to ignore it.
//   event + from/to  days from an event in events.js (-1 = day before, 0 = the day)
//   hours: [17, 23]  from 5pm to 11pm (24 hour clock)
//   days: ["Friday"] days of the week
//   season: "winter" spring / summer / autumn / winter
// header: lines for the big top line (optional)
// sub:    lines for the small line underneath (optional)
// A rule with BOTH header and sub takes over both lines.
//
// Placeholders: {greeting} "Morning, Kyle."  {name} "Kyle"  {daysUntil} "12"

// Higher number wins.
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
  // ---------- Halloween ----------
  {
    name: "Halloween build-up",
    priority: PRIORITY.buildUp,
    when: { event: "halloween", from: -30, to: -7 },
    sub: ["Spooky season. {daysUntil} days to Halloween."],
  },
  {
    name: "Halloween last week",
    priority: PRIORITY.buildUp,
    when: { event: "halloween", from: -6, to: -2 },
    sub: ["It's almost Halloween."],
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
    name: "After Halloween",
    priority: PRIORITY.buildUp,
    when: { event: "halloween", from: 1, to: 1 },
    sub: ["Halloween's done. Bring on the cozy months."],
  },

  // ---------- Bonfire Night ----------
  {
    name: "Bonfire Night build-up",
    priority: PRIORITY.buildUp,
    when: { event: "bonfireNight", from: -3, to: -2 },
    sub: ["A night of fireworks and bonfires is coming."],
  },
  {
    name: "Bonfire Night tomorrow",
    priority: PRIORITY.tomorrow,
    when: { event: "bonfireNight", from: -1, to: -1 },
    header: ["{greeting} Fireworks tomorrow."],
  },
  {
    name: "Bonfire Night evening",
    priority: PRIORITY.holidayDay + 1,
    when: { event: "bonfireNight", from: 0, to: 0, hours: [17, 23] },
    header: ["Fireworks are going off."],
    sub: ["Wrap up warm if you're heading out."],
  },
  {
    name: "Bonfire Night",
    priority: PRIORITY.holidayDay,
    when: { event: "bonfireNight", from: 0, to: 0 },
    header: ["Happy Bonfire Night."],
    sub: ["Remember, remember the fifth of November."],
  },

  // ---------- Remembrance Day ----------
  {
    name: "Remembrance Day 11am",
    priority: PRIORITY.holidayDay + 1,
    when: { event: "remembranceDay", from: 0, to: 0, hours: [10, 11] },
    header: ["Remembrance Day."],
    sub: ["Two minutes' silence at 11."],
  },
  {
    name: "Remembrance Day",
    priority: PRIORITY.holidayDay,
    when: { event: "remembranceDay", from: 0, to: 0 },
    header: ["Remembrance Day."],
    sub: ["Lest we forget."],
  },

  // ---------- Christmas ----------
  {
    name: "Christmas build-up",
    priority: PRIORITY.buildUp,
    when: { event: "christmas", from: -24, to: -6 },
    sub: ["{daysUntil} days until Christmas."],
  },
  {
    name: "Christmas last days",
    priority: PRIORITY.buildUp,
    when: { event: "christmas", from: -5, to: -2 },
    sub: ["Christmas is coming!", "The festive season is almost here."],
  },
  {
    name: "Christmas Eve night",
    priority: PRIORITY.tomorrow + 1,
    when: { event: "christmas", from: -1, to: -1, hours: [20, 23] },
    header: ["Santa's on his way, {name}."],
    sub: ["Best get to sleep."],
  },
  {
    name: "Christmas Eve",
    priority: PRIORITY.tomorrow,
    when: { event: "christmas", from: -1, to: -1 },
    header: ["{greeting} It's Christmas Eve!"],
    sub: ["Nearly time."],
  },
  {
    name: "Christmas evening",
    priority: PRIORITY.holidayDay + 1,
    when: { event: "christmas", from: 0, to: 0, hours: [17, 23] },
    header: ["Merry Christmas, {name}."],
    sub: ["Time for a film and leftovers."],
  },
  {
    name: "Christmas",
    priority: PRIORITY.holidayDay,
    when: { event: "christmas", from: 0, to: 0 },
    header: ["Merry Christmas! 🎄"],
    sub: ["Wishing you a day full of warmth and cheer."],
  },
  {
    name: "Boxing Day",
    priority: PRIORITY.holidayDay,
    when: { event: "boxingDay", from: 0, to: 0 },
    header: ["Happy Boxing Day!"],
    sub: ["Leftovers day. No plans needed."],
  },

  // ---------- New Year ----------
  {
    name: "End of year build-up",
    priority: PRIORITY.buildUp,
    when: { event: "newYearsEve", from: -4, to: -1 },
    sub: ["New Year's Eve is on the horizon."],
  },
  {
    name: "New Year's Eve late",
    priority: PRIORITY.holidayDay + 1,
    when: { event: "newYearsEve", from: 0, to: 0, hours: [22, 23] },
    header: ["Nearly midnight, {name}."],
    sub: ["Almost a new year."],
  },
  {
    name: "New Year's Eve",
    priority: PRIORITY.holidayDay,
    when: { event: "newYearsEve", from: 0, to: 0 },
    header: ["Happy New Year's Eve!"],
    sub: ["Here's to a bright year ahead."],
  },
  {
    name: "New Year early hours",
    priority: PRIORITY.holidayDay + 1,
    when: { event: "newYear", from: 0, to: 0, hours: [0, 3] },
    header: ["Happy New Year, {name}!"],
    sub: ["You made it."],
  },
  {
    name: "New Year's Day",
    priority: PRIORITY.holidayDay,
    when: { event: "newYear", from: 0, to: 0 },
    header: ["Happy New Year! 🎉"],
    sub: ["Wishing you a year full of good things."],
  },

  // ---------- Spring holidays ----------
  {
    name: "Valentine's build-up",
    priority: PRIORITY.buildUp,
    when: { event: "valentines", from: -4, to: -2 },
    sub: ["Valentine's Day is coming up."],
  },
  {
    name: "Valentine's tomorrow",
    priority: PRIORITY.tomorrow,
    when: { event: "valentines", from: -1, to: -1 },
    header: ["{greeting} It's Valentine's Day tomorrow."],
  },
  {
    name: "Valentine's Day",
    priority: PRIORITY.holidayDay,
    when: { event: "valentines", from: 0, to: 0 },
    header: ["Happy Valentine's Day! ❤️"],
    sub: ["Spread some love today."],
  },
  {
    name: "St Patrick's Day",
    priority: PRIORITY.holidayDay,
    when: { event: "stPatricks", from: 0, to: 0 },
    header: ["Happy St Patrick's Day! ☘️"],
    sub: ["May the luck of the Irish be with you."],
  },
  {
    name: "Easter build-up",
    priority: PRIORITY.buildUp,
    when: { event: "easter", from: -7, to: -2 },
    sub: ["Easter's coming up."],
  },
  {
    name: "Easter tomorrow",
    priority: PRIORITY.tomorrow,
    when: { event: "easter", from: -1, to: -1 },
    header: ["{greeting} It's Easter tomorrow."],
  },
  {
    name: "Easter",
    priority: PRIORITY.holidayDay,
    when: { event: "easter", from: 0, to: 0 },
    header: ["Happy Easter! 🐣"],
    sub: ["Chocolate for breakfast is allowed."],
  },

  // ---------- Season starts ----------
  {
    name: "Spring tomorrow",
    priority: PRIORITY.seasonStart,
    when: { event: "springStart", from: -1, to: -1 },
    header: ["{greeting} Spring starts tomorrow."],
  },
  {
    name: "First day of spring",
    priority: PRIORITY.seasonStart,
    when: { event: "springStart", from: 0, to: 0 },
    header: ["{greeting} It's the first day of Spring."],
  },
  {
    name: "Summer tomorrow",
    priority: PRIORITY.seasonStart,
    when: { event: "summerStart", from: -1, to: -1 },
    header: ["{greeting} Summer starts tomorrow."],
  },
  {
    name: "First day of summer",
    priority: PRIORITY.seasonStart,
    when: { event: "summerStart", from: 0, to: 0 },
    header: ["{greeting} It's the first day of Summer."],
  },
  {
    name: "Autumn tomorrow",
    priority: PRIORITY.seasonStart,
    when: { event: "autumnStart", from: -1, to: -1 },
    header: ["{greeting} Autumn starts tomorrow."],
  },
  {
    name: "First day of autumn",
    priority: PRIORITY.seasonStart,
    when: { event: "autumnStart", from: 0, to: 0 },
    header: ["{greeting} It's the first day of Autumn."],
  },
  {
    name: "Winter tomorrow",
    priority: PRIORITY.seasonStart,
    when: { event: "winterStart", from: -1, to: -1 },
    header: ["{greeting} Winter starts tomorrow."],
  },
  {
    name: "First day of winter",
    priority: PRIORITY.seasonStart,
    when: { event: "winterStart", from: 0, to: 0 },
    header: ["{greeting} It's the first day of Winter."],
  },

  // ---------- Weekend windows ----------
  {
    name: "Monday morning",
    priority: PRIORITY.weekend,
    when: { days: ["Monday"], hours: [7, 10] },
    sub: ["Fresh week. Take it one thing at a time."],
  },
  {
    name: "Wednesday",
    priority: PRIORITY.weekend,
    when: { days: ["Wednesday"] },
    sub: ["Halfway through the week."],
  },
  {
    name: "Friday afternoon",
    priority: PRIORITY.weekend,
    when: { days: ["Friday"], hours: [12, 16] },
    sub: ["It's Friday! The weekend is just around the corner."],
  },
  {
    name: "Friday evening",
    priority: PRIORITY.weekend,
    when: { days: ["Friday"], hours: [17, 23] },
    sub: ["The weekend begins now."],
  },
  {
    name: "Saturday morning",
    priority: PRIORITY.weekend,
    when: { days: ["Saturday"], hours: [5, 11] },
    sub: ["No alarms today. Enjoy it."],
  },
  {
    name: "Saturday night",
    priority: PRIORITY.weekend,
    when: { days: ["Saturday"], hours: [17, 23] },
    sub: ["It's Saturday night! Time to relax."],
  },
  {
    name: "Sunday morning",
    priority: PRIORITY.weekend,
    when: { days: ["Sunday"], hours: [5, 11] },
    sub: ["Slow Sunday."],
  },
  {
    name: "Sunday evening",
    priority: PRIORITY.weekend,
    when: { days: ["Sunday"], hours: [17, 20] },
    sub: ["Sadly the weekend is almost over."],
  },
  {
    name: "Sunday night",
    priority: PRIORITY.weekend,
    when: { days: ["Sunday"], hours: [21, 23] },
    sub: ["Back to it tomorrow. Rest up."],
  },

  // ---------- Season + time of day ----------
  { name: "Spring morning", priority: PRIORITY.seasonTime, when: { season: "spring", hours: [5, 11] }, sub: ["Birds are up early again."] },
  { name: "Spring afternoon", priority: PRIORITY.seasonTime, when: { season: "spring", hours: [12, 16] }, sub: ["Things should be warming up."] },
  { name: "Spring evening", priority: PRIORITY.seasonTime, when: { season: "spring", hours: [17, 23] }, sub: ["The evenings are getting longer."] },
  { name: "Summer morning", priority: PRIORITY.seasonTime, when: { season: "summer", hours: [5, 11] }, sub: ["Get the cool air while it lasts."] },
  { name: "Summer afternoon", priority: PRIORITY.seasonTime, when: { season: "summer", hours: [12, 16] }, sub: ["Stay cool and drink some water."] },
  { name: "Summer evening", priority: PRIORITY.seasonTime, when: { season: "summer", hours: [17, 23] }, sub: ["Open window weather."] },
  { name: "Autumn morning", priority: PRIORITY.seasonTime, when: { season: "autumn", hours: [5, 11] }, sub: ["Crisp one out there."] },
  { name: "Autumn afternoon", priority: PRIORITY.seasonTime, when: { season: "autumn", hours: [12, 16] }, sub: ["Perfect hot drink weather."] },
  { name: "Autumn evening", priority: PRIORITY.seasonTime, when: { season: "autumn", hours: [17, 23] }, sub: ["Dark early. Candle time."] },
  { name: "Winter morning", priority: PRIORITY.seasonTime, when: { season: "winter", hours: [5, 11] }, sub: ["Cold one. Take it slow."] },
  { name: "Winter afternoon", priority: PRIORITY.seasonTime, when: { season: "winter", hours: [12, 16] }, sub: ["Sun's already heading down."] },
  { name: "Winter evening", priority: PRIORITY.seasonTime, when: { season: "winter", hours: [17, 23] }, sub: ["Long night. Stay warm."] },

  // ---------- Season (any time) ----------
  { name: "Spring", priority: PRIORITY.season, when: { season: "spring" }, sub: ["Everything's starting to bloom."] },
  { name: "Summer", priority: PRIORITY.season, when: { season: "summer" }, sub: ["Long days, slow pace."] },
  { name: "Autumn", priority: PRIORITY.season, when: { season: "autumn" }, sub: ["Leaves are turning."] },
  { name: "Winter", priority: PRIORITY.season, when: { season: "winter" }, sub: ["Blanket season."] },
];
