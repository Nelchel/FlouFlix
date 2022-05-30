import React from "react";
import Youtube from "react-youtube";

function Video({ videoId }) {
  const opts = {
    height: "500",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      modestbranding: 1,
      showinfo: 0,
      rel: 0,
      vq: "hd1080",
    },
  };

  // const onReady = (e) => {
  //   // access to player in all event handlers via event.target
  //   e.target.pauseVideo();
  // };

  return <Youtube videoId={videoId} opts={opts} />;
}
export default Video;
