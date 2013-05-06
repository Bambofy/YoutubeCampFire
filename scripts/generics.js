function isTrack(text)
{
    if (text.indexOf("youtube.com") !== -1 )
    {
        return true;
    }
    else
    {
        return false;
    }
}

function isCommand(text)
{
  if (text.charAt(0) == "#" && text.charAt(2) == "#" && text.length == 3)
  {
    return true;
  }
  else
  {
    return false;
  }
}

function playVideo(uri)
{
  // get the uri
  var video_id = uri.split('v=')[1];
  var ampersandPosition = video_id.indexOf('&');
  if(ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }

  ytplayer = document.getElementById("ytPlayer");
  ytplayer.loadVideoById(video_id);
}

function CAlert(text, colour)
{
  $('#messagesDiv').append("<div><b style='color: " + colour + ";'>" + text + "</b></div>");
}

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}

/*


This player is not pretty or useful in itself, it's just there to illustrate the YouTube JavaScript Player API.   >>More about this...
Look at the source code for this page to see how it's done. Some things you can use:

ytplayer.loadVideoById(id, startSeconds);
ytplayer.cueVideoById(id, startSeconds);
ytplayer.playVideo();
ytplayer.pauseVideo();
ytplayer.stopVideo();
ytplayer.getState();
ytplayer.seekTo(seconds, true);
ytplayer.getVideoBytesLoaded();
ytplayer.getVideoBytesTotal();
ytplayer.getCurrentTime();
ytplayer.getDuration();
ytplayer.getVideoStartBytes();
ytplayer.mute();
ytplayer.unMute();
ytplayer.getVideoEmbedCode()
ytplayer.getVideoUrl();
ytplayer.setVolume(newVolume);
ytplayer.getVolume();
ytplayer.clearVideo();


*/