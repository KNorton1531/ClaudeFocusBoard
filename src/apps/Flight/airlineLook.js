// airlineLook.js: each airline's logo, and its main colour picked out of that logo.
// Logos come from github.com/Jxck-S/airline-logos, named by the airline's ICAO
// code: the first 3 letters of the callsign, like "BAW". FlightAware's logos are
// tried first, then RadarBox's, which has some the other is missing (like BA Shuttle).
// The logos belong to the airlines. They're loaded from GitHub, not copied here.

const LOGO_FOLDERS = [
  'https://raw.githubusercontent.com/Jxck-S/airline-logos/main/flightaware_logos/',
  'https://raw.githubusercontent.com/Jxck-S/airline-logos/main/radarbox_logos/',
]

// Looks already found, by airline code, so each airline is only loaded once.
// null means neither folder has a logo for it.
const foundLooks = {}

export function airlineCode(callsign) {
  return callsign.slice(0, 3)
}

// Turns red, green and blue (0 to 255) into hue (0 to 360), saturation and lightness (0 to 1).
function toHsl(red, green, blue) {
  const r = red / 255
  const g = green / 255
  const b = blue / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2

  if (max === min) {
    return { hue: 0, saturation: 0, lightness: lightness }
  }

  const change = max - min

  let saturation = change / (2 - max - min)
  if (lightness <= 0.5) {
    saturation = change / (max + min)
  }

  let hue = 0
  if (max === r) {
    hue = ((g - b) / change) % 6
  } else if (max === g) {
    hue = (b - r) / change + 2
  } else {
    hue = (r - g) / change + 4
  }

  hue = hue * 60
  if (hue < 0) {
    hue = hue + 360
  }

  return { hue: hue, saturation: saturation, lightness: lightness }
}

function keepBetween(value, lowest, highest) {
  return Math.min(Math.max(value, lowest), highest)
}

// Finds the colour used most in the logo, skipping see-through, white, black and grey.
// Each pixel is sorted into one of 12 hue slices, and the busiest slice wins.
function mainColour(pixels) {
  const slices = {}

  // Each pixel is 4 numbers in a row: red, green, blue, see-through-ness.
  for (let i = 0; i < pixels.length; i = i + 4) {
    const alpha = pixels[i + 3]

    if (alpha > 200) {
      const colour = toHsl(pixels[i], pixels[i + 1], pixels[i + 2])
      const isColourful = colour.saturation > 0.35 && colour.lightness > 0.15 && colour.lightness < 0.85

      if (isColourful) {
        const slice = Math.floor(colour.hue / 30)

        if (!slices[slice]) {
          slices[slice] = { count: 0, hue: 0, saturation: 0, lightness: 0 }
        }

        slices[slice].count = slices[slice].count + 1
        slices[slice].hue = slices[slice].hue + colour.hue
        slices[slice].saturation = slices[slice].saturation + colour.saturation
        slices[slice].lightness = slices[slice].lightness + colour.lightness
      }
    }
  }

  let best = null
  for (const slice of Object.values(slices)) {
    if (best === null || slice.count > best.count) {
      best = slice
    }
  }

  // Too few colourful pixels: a black, white or grey logo.
  if (best === null || best.count < 20) {
    return null
  }

  const hue = Math.round(best.hue / best.count)

  // Calm it down and lift it, so it fits the cozy look and reads on a dark card.
  const saturation = Math.round(keepBetween(best.saturation / best.count, 0.4, 0.8) * 100)
  const lightness = Math.round(keepBetween(best.lightness / best.count, 0.58, 0.72) * 100)

  return 'hsl(' + hue + ' ' + saturation + '% ' + lightness + '%)'
}

// Loads one logo. Gives back the loaded picture, or null if it isn't there.
function loadLogo(url) {
  return new Promise(function (resolve) {
    const image = new Image()

    // Lets us read the logo's pixels to find its colour. GitHub allows this.
    image.crossOrigin = 'anonymous'

    image.onload = function () {
      resolve(image)
    }

    image.onerror = function () {
      resolve(null)
    }

    image.src = url
  })
}

// Reads the logo's pixels and finds its main colour.
function colourOf(image) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height

  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0)

  const pixels = context.getImageData(0, 0, image.width, image.height).data
  return mainColour(pixels)
}

// Finds an airline's logo and its main colour, trying each folder in turn.
// Gives back { logo, colour }, where colour can be null (a black or white logo),
// or null if no folder has a logo for this airline.
export async function findAirlineLook(code) {
  if (code in foundLooks) {
    return foundLooks[code]
  }

  let look = null

  for (const folder of LOGO_FOLDERS) {
    if (look === null) {
      const url = folder + code + '.png'
      const image = await loadLogo(url)

      if (image) {
        look = { logo: url, colour: colourOf(image) }
      }
    }
  }

  foundLooks[code] = look
  return look
}
