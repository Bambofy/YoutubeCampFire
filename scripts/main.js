// CHANGE THIS TO YOUR FIREBASE REFERENCE URL eg. https://mycampfire.firebaseio.com
firebaseRef = "https://spotifycampfire.firebaseio.com";


// when song is parsed on C#, make it message back the name. When the message is recieved on this page we can just print the name out as usual.
currentName = window.localStorage.getItem("username");
currentSongUri = "";   // used to make sure we don't play the same song twice.
messageCount = 0;
headCount = 0;

var wsImpl = window.WebSocket || window.MozWebSocket;

// get the roomID we want to join/create
roomIDs = window.localStorage.getItem("roomID");

// reference to the room, if it doesn't exist we create it
dataRef = new Firebase(firebaseRef + "/rooms/" + roomIDs);

// get the current name of the user //
dataRef.push({name: currentName, uri: "#J#"});

// make sure we add a message to our spotify whenever we recieve one on firebase
dataRef.limit(1).on('child_added', function(snapshot)
{
    var message = snapshot.val();
    if(message.uri == "#J#")
    {
        headCount = headCount + 1;
        displayChatMessage(message.name, "Has joined the room!");
        $("#footz").text("Created by Richard Bamford - " + headCount + " in this room");
    }
    else if(message.uri == "#E#")
    {
        headCount = headCount - 1;
        displayChatMessage(message.name, "Has left the room...");
        $("#footz").text("Created by Richard Bamford - " + headCount + " in this room");
    }
    else
    {
        displayChatMessage(message.name, message.uri);
    }
});

window.onbeforeunload = confirmExit;
function confirmExit()
{
    // tell firebase we left
    dataRef.push({name: currentName, uri: "#E#"});

    return "You have attempted to leave this page.  Please remember the room name if you wish to re-join.  Are you sure you want to exit this page?";
}

// update our info
$("#tag").text(roomIDs);

// delete room on disconnect
dataRef.onDisconnect().remove(function(e) {});

// this is where we handle all our requests
function displayChatMessage(name, text)
{
    // default is a message, ie always assume messa
    var flag = "m";

    // Flag setting
    if (isTrack(text))
    {
        flag = "t";
    }

    // Flag handling
    if (flag == "t")
    {
        playSong(text);
        currentSongUri = text;
        $('#messagesDiv').append("<div><b>" + name + "</b> played a video<br /></div>");
    }
    else if (flag == "m")
    {
        messageCount = messageCount + 1;
        $('#messagesDiv').append("<div><b>" + name + "</b>: <em>" + text + "</em><br /></div>");
    }

    // removing older messages
    if (flag == "m" || flag == "t")
    {
        if (messageCount > 10)
        {
            // remove the first element inside the div.
            $("#messagesDiv > div").eq(0).remove();
        }
    }
}

function runClick()
{
    var text = $('#messageInput').val();

    if(text.length <= 125)
    {
        if(isTrack(text))    // if it's a track make sure it's not a duplicate
        {
            if(currentSongUri != text)  // make sure it's not the same song
            {
                dataRef.push({name: currentName, uri: strip(text)});
            }
            else
            {
                CAlert("That song is already playing!", "red");
            }
        }
        else                        // else it's just some text
        {
            dataRef.push({name: currentName, uri: strip(text)});
        }
    }
    else
    {
        CAlert("Message must be less than 125 characters!", "red")
    }

    $('#messageInput').val('');           
}

// Parsing messages sent.
$("#messageInput").keypress(function(e)
{
    if (e.keyCode == 13)
    {
        runClick();
    }
});