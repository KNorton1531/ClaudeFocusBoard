// pickWelcome.js: works out the header and sub-header for right now.
import { events } from "../../content/welcome/events.js";
import { messages } from "../../content/welcome/messages.js";
import { hourlyLines } from "../../content/welcome/hours.js";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ONE_DAY = 1000 * 60 * 60 * 24;

// Midnight of a date, so day maths ignores the time.
function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Every date an event happens around now (last year, this year, next year).
function getEventDates(event, now) {
  const year = now.getFullYear();
  const dates = [];

  if (event.date) {
    const parts = event.date.split("-");
    const month = Number(parts[0]) - 1;
    const day = Number(parts[1]);
    dates.push(new Date(year - 1, month, day));
    dates.push(new Date(year, month, day));
    dates.push(new Date(year + 1, month, day));
  } else {
    for (const text of event.dates) {
      const parts = text.split("-");
      dates.push(new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
    }
  }

  return dates;
}

// How many days from the event we are, if inside the from/to window.
// e.g. -1 = the day before, 0 = the day, 1 = the day after.
// Returns null if we're not in the window.
function getDaysFromEvent(eventName, from, to, now) {
  const event = events[eventName];
  const today = startOfDay(now);

  for (const eventDate of getEventDates(event, now)) {
    const daysFrom = Math.round((today - eventDate) / ONE_DAY);

    if (daysFrom >= from && daysFrom <= to) {
      return daysFrom;
    }
  }

  return null;
}

function getSeason(now) {
  const month = now.getMonth() + 1;

  if (month >= 3 && month <= 5) {
    return "spring";
  } else if (month >= 6 && month <= 8) {
    return "summer";
  } else if (month >= 9 && month <= 11) {
    return "autumn";
  } else {
    return "winter";
  }
}

function getGreeting(hour) {
  if (hour < 5) {
    return "You're up late, {name}.";
  } else if (hour < 12) {
    return "Morning, {name}.";
  } else if (hour < 17) {
    return "Afternoon, {name}.";
  } else {
    return "Evening, {name}.";
  }
}

// Does this rule match right now? Every field in "when" must pass.
// Returns info about the match, or null if it doesn't match.
function checkRule(rule, now) {
  const when = rule.when;
  const hour = now.getHours();
  let daysFromEvent = null;

  if (when.hours) {
    if (hour < when.hours[0] || hour > when.hours[1]) {
      return null;
    }
  }

  if (when.days) {
    if (!when.days.includes(DAY_NAMES[now.getDay()])) {
      return null;
    }
  }

  if (when.season) {
    if (when.season !== getSeason(now)) {
      return null;
    }
  }

  if (when.event) {
    daysFromEvent = getDaysFromEvent(when.event, when.from, when.to, now);

    if (daysFromEvent === null) {
      return null;
    }
  }

  return { rule: rule, daysFromEvent: daysFromEvent };
}

// Same line all day: use the day of the year to choose.
function pickLine(lines, now) {
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((startOfDay(now) - startOfYear) / ONE_DAY);
  return lines[dayOfYear % lines.length];
}

function fillPlaceholders(text, values) {
  let result = text;

  for (const key in values) {
    result = result.replaceAll("{" + key + "}", values[key]);
  }

  return result;
}

export function pickWelcome(now, name) {
  const hour = now.getHours();

  // 1. Find every rule that matches right now.
  const matches = [];
  for (const rule of messages) {
    const match = checkRule(rule, now);

    if (match !== null) {
      matches.push(match);
    }
  }

  // 2. Highest priority first.
  matches.sort(function (a, b) {
    return b.rule.priority - a.rule.priority;
  });

  // 3. Header: first match that has header lines.
  let headerMatch = null;
  for (const match of matches) {
    if (match.rule.header) {
      headerMatch = match;
      break;
    }
  }

  // 4. Sub-header: if the header rule has its own sub lines, use those (takeover).
  //    Otherwise, first match with sub lines that isn't about the same event.
  let subMatch = null;
  if (headerMatch !== null && headerMatch.rule.sub) {
    subMatch = headerMatch;
  } else {
    for (const match of matches) {
      let sameEvent = false;

      if (headerMatch !== null) {
        if (match.rule.when.event && match.rule.when.event === headerMatch.rule.when.event) {
          sameEvent = true;
        }
      }

      if (match.rule.sub && !sameEvent) {
        subMatch = match;
        break;
      }
    }
  }

  // 5. Turn rules into text.
  let header = "";
  if (headerMatch !== null) {
    header = pickLine(headerMatch.rule.header, now);
  } else {
    header = pickLine(hourlyLines[hour], now);
  }

  let sub = "";
  let daysUntil = "";
  if (subMatch !== null) {
    sub = pickLine(subMatch.rule.sub, now);

    if (subMatch.daysFromEvent !== null) {
      daysUntil = String(Math.abs(subMatch.daysFromEvent));
    }
  }

  // Greeting goes in first, because it has {name} inside it.
  header = header.replaceAll("{greeting}", getGreeting(hour));

  // No name set? Remove ", {name}" so it reads "Good morning." not "Good morning, ."
  if (!name) {
    header = header.replaceAll(", {name}", "").replaceAll(" {name}", "");
    sub = sub.replaceAll(", {name}", "").replaceAll(" {name}", "");
  }

  const values = {
    name: name,
    daysUntil: daysUntil,
  };

  header = fillPlaceholders(header, values);
  sub = fillPlaceholders(sub, values);

  return { header: header, sub: sub };
}
