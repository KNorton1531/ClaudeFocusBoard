// VideoStill: the stream's cover picture, laid over the video background.
// It shows whenever the video isn't playing, to hide YouTube's own big
// play button and loading spinner.
import { useState } from 'react'
import { thumbnailUrl } from './thumbnailUrl.js'

function VideoStill({ videoId, isShown }) {
  // Not every video has a full-size picture. If it's missing, use the smaller one.
  const [isFullSizeMissing, setIsFullSizeMissing] = useState(false)

  let src = thumbnailUrl(videoId, 'maxresdefault')
  let className = 'lofi-video-still'

  if (isFullSizeMissing) {
    // The smaller picture has black bars at the top and bottom, so it's zoomed in to hide them.
    src = thumbnailUrl(videoId, 'hqdefault')
    className = 'lofi-video-still lofi-video-still-small'
  }

  if (isShown) {
    className = className + ' lofi-video-still-shown'
  }

  return (
    <img
      className={className}
      src={src}
      alt=""
      onError={function () {
        setIsFullSizeMissing(true)
      }}
      onLoad={function (event) {
        // When the full-size picture is missing, YouTube still sends a tiny
        // 120px-wide grey placeholder instead of failing, so check the width too.
        if (event.target.naturalWidth <= 120) {
          setIsFullSizeMissing(true)
        }
      }}
    />
  )
}

export default VideoStill
