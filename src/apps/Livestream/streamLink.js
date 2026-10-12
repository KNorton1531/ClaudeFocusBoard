// streamLink: finds the YouTube video id in a pasted link.
// Works with youtube.com/watch?v=ID, youtu.be/ID, youtube.com/live/ID,
// youtube.com/embed/ID and youtube.com/shorts/ID.
// Gives back the video id, or null if the link isn't one of those.

// YouTube video ids are always 11 letters, numbers, - or _.
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/

export function parseStreamLink(text) {
  let link = text.trim()

  if (link === '') {
    return null
  }

  // Let people paste "youtube.com/..." without the https:// part.
  if (!link.startsWith('http')) {
    link = 'https://' + link
  }

  let url = null
  try {
    url = new URL(link)
  } catch {
    return null
  }

  // "www.youtube.com" and "m.youtube.com" both count as "youtube.com".
  let host = url.hostname
  if (host.startsWith('www.')) {
    host = host.slice(4)
  } else if (host.startsWith('m.')) {
    host = host.slice(2)
  }

  // The path split into parts, without empty bits: "/live/abc" -> ['live', 'abc']
  const parts = url.pathname.split('/').filter(function (part) {
    return part !== ''
  })

  let id = null
  if (host === 'youtu.be') {
    id = parts[0]
  } else if (host === 'youtube.com') {
    if (parts[0] === 'watch') {
      id = url.searchParams.get('v')
    } else if (parts[0] === 'live' || parts[0] === 'embed' || parts[0] === 'shorts') {
      id = parts[1]
    }
  }

  if (id && VIDEO_ID.test(id)) {
    return id
  } else {
    return null
  }
}
