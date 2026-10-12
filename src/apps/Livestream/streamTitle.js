// streamTitle: looks up a YouTube video's title, so it can be saved as its name.
// Uses YouTube's own "oEmbed" address. Free, no API key.
// Gives back the title, or null if it can't be found. Never throws.

export async function fetchStreamTitle(videoId) {
  try {
    const videoLink = 'https://www.youtube.com/watch?v=' + videoId
    const response = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(videoLink))

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (!data.title) {
      return null
    }

    const title = data.title.trim()

    if (title === '') {
      return null
    } else {
      return title
    }
  } catch {
    // No internet, or YouTube is down.
    return null
  }
}
