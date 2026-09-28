// events.js: every date the welcome messages care about.
// Same date every year: use "MM-DD".
// Date that moves each year: list each year as "YYYY-MM-DD".
export const events = {
  // Holidays
  newYear: { date: "01-01" },
  valentines: { date: "02-14" },
  stPatricks: { date: "03-17" },
  easter: { dates: ["2026-04-05", "2027-03-28", "2028-04-16", "2029-04-01", "2030-04-21"] },
  halloween: { date: "10-31" },
  bonfireNight: { date: "11-05" },
  remembranceDay: { date: "11-11" },
  christmas: { date: "12-25" },
  boxingDay: { date: "12-26" },
  newYearsEve: { date: "12-31" },

  // Seasons (Northern Hemisphere, start on the 1st)
  springStart: { date: "03-01" },
  summerStart: { date: "06-01" },
  autumnStart: { date: "09-01" },
  winterStart: { date: "12-01" },
};
