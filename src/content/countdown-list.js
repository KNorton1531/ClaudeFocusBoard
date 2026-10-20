// countdown-list.js: the countdowns built into the Countdown App.
// People pick which ones they want in the App, and can add their own too.
//
// To add one, copy a line and change it. Each countdown has:
//   id         short, no spaces, different from every other id.
//              Don't change it later, or anyone who picked it loses it.
//   name       what the App shows
//   category   one of the category ids below
//   icon       (optional) an emoji. Leave it out to use the category's icon.
//   graceDays  (optional) days it stays up after the day. Leave it out to use graceDays below.
//   time       (optional) "03:00", 24 hour. Leave it out to count down to midnight.
//
// And ONE of these for when it is:
//   date: "12-25"                          the same day every year (month-day)
//   date: "2027-03-14"                     one day only (year-month-day)
//   dates: ["2027-03-28", "2028-04-16"]    a day that moves each year. List each year,
//                                          and add more before the last one passes.
//
// Once a day has passed, it stays up for the grace days saying it's been reached.
// After that, a yearly one counts down to next year, and a one-day one disappears.

// How many days a countdown stays up after its day.
export const graceDays = 3

// The groups in the App's Choose panel, in this order.
// "mine" holds the ones people add themselves. Keep it.
export const countdownCategories = [
  { id: 'mine', name: 'My countdowns', icon: '⭐' },
  { id: 'holidays', name: 'Holidays', icon: '🎉' },
  { id: 'seasons', name: 'Seasons', icon: '🍃' },
  { id: 'personal', name: 'Personal', icon: '📅' },
]

export const countdownList = [
  // Holidays: same day every year
  { id: 'halloween', name: 'Halloween', category: 'holidays', date: '10-31', icon: '🎃' },
  { id: 'bonfire-night', name: 'Bonfire Night', category: 'holidays', date: '11-05', icon: '🎇' },
  { id: 'christmas', name: 'Christmas', category: 'holidays', date: '12-25', icon: '🎄' },
  { id: 'new-years-eve', name: "New Year's Eve", category: 'holidays', date: '12-31', icon: '🥂' },

  // Seasons (Northern Hemisphere, starting on the 1st, like the welcome messages)
  { id: 'spring', name: 'Spring', category: 'seasons', date: '03-01', icon: '🌷' },
  { id: 'summer', name: 'Summer', category: 'seasons', date: '06-01', icon: '☀️' },
  { id: 'autumn', name: 'Autumn', category: 'seasons', date: '09-01', icon: '🍂' },
  { id: 'winter', name: 'Winter', category: 'seasons', date: '12-01', icon: '❄️' },

  // Personal
  { id: 'gta-6', name: 'GTA 6', category: 'personal', date: '2026-11-19', icon: '🎮' },
  { id: 'finland-ruka', name: 'Finland Ruka', category: 'personal', date: '2026-12-06', time: '03:00', icon: '✈️' },
  { id: 'jager-birthday', name: 'Jager\'s Birthday', category: 'personal', date: '03-01', icon: '🎂' },
  { id: 'odin-birthday', name: 'Odin\'s Birthday', category: 'personal', date: '06-23', icon: '🍰' },
]
