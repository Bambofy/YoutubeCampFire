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

function playSong(uri)
{
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