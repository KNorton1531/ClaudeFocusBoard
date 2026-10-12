// thumbnailUrl: the address of a YouTube video's preview picture.
// Sizes: "mqdefault" (small), "hqdefault" (medium), "maxresdefault" (full size,
// but not every video has one).
export function thumbnailUrl(videoId, size) {
  let fileName = 'mqdefault'
  if (size) {
    fileName = size
  }

  return 'https://i.ytimg.com/vi/' + videoId + '/' + fileName + '.jpg'
}
