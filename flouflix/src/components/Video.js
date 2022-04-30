import React from "react";
import Youtube from "react-youtube";

function Video({ videoId }) {
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  // const onReady = (e) => {
  //   // access to player in all event handlers via event.target
  //   e.target.pauseVideo();
  // };

  return <Youtube videoId={videoId} opts={opts} />;
}
export default Video;
