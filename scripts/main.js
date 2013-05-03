// CHANGE THIS TO YOUR FIREBASE REFERENCE URL eg. https://mycampfire.firebaseio.com
firebaseRef = "https://spotifycampfire.firebaseio.com";


// when song is parsed on C#, make it message back the name. When the message is recieved on this page we can just print the name out as usual.
currentName = window.localStorage.getItem("username");
messageCount = 0;
headCount = 0;

var wsImpl = window.WebSocket || window.MozWebSocket;

// get the roomID we want to join/create
roomIDs = window.localStorage.getItem("roomID");

// reference to the room, if it doesn't exist we create it
dataRef = new Firebase(firebaseRef + "/rooms/" + roomIDs);

// get the current name of the user //
dataRef.push({name: currentName, uri: "#J#"});



//----------------- Headcounting code ----------------//
// reference to headcount, we have to use a ifference reference or else our child_added callback breaks...
headcountRef = new Firebase("https://spotifycampfire.firebaseio.com/roominfo/"+roomIDs+"/headcount");
headcountRef.transaction(function(current_value) {
    headCount = headCount + 1;
    return current_value + 1;
});
// this is to update our clients headcount
headcountRef.on('value', function(dataSnapshot) {
    $("#headcount").text(dataSnapshot.val());
});
//-----------------------------------------------------//

//----------------- Number of messages counter -------//
// todo
//-----------------------------------------------------//



// make sure we add a message to our spotify whenever we recieve one on firebase
dataRef.limit(1).on('child_added', function(snapshot)
{
    var message = snapshot.val();
    displayChatMessage(message.name, message.uri);
});


window.onbeforeunload = confirmExit;
function confirmExit()
{
    dataRef.push({name: currentName, uri: "#E#"});

    // reference to headcount
    headcountRef.transaction(function(current_value) {
        headCount = headCount - 1;

        if (headCount <= 0)     // last person out is a rotten egg, if it's 1 that means its just me, we check for all below just bc im funny
        {
            dataRef.remove();
            headcountRef.remove();
        }

        return current_value - 1;
    });
}


// update our info
$("#tag").text(roomIDs);



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
    if (isCommand(text))
    {
        // p = pause, r = resume
        flag = text;
    }

    // Flag handling
    if (flag == "t")
    {
        playVideo(text);
        messageCount = messageCount + 1;        // do this whenveer we post a message
        $('#messagesDiv').append("<div><b>" + name + "</b> played a video<br /></div>");
    }
    else if (flag == "m")
    {
        messageCount = messageCount + 1;
        $('#messagesDiv').append("<div><b>" + name + "</b>: <em>" + text + "</em><br /></div>");
    }
    else if (flag == "#E#")
    {
        messageCount = messageCount + 1;
        $('#messagesDiv').append("<div><b>" + name + " has left the room...</b><br /></div>");
    }
    else if (flag == "#J#")
    {
        messageCount = messageCount + 1;
        $('#messagesDiv').append("<div><b>" + name + " has joined the room!</b><br /></div>");
    }
    else if (flag == "#P#")
    {
        pauseVideo();
        messageCount = messageCount + 1;
        $('#messagesDiv').append("<div><b>" + name + "</b> paused the video<br /></div>");
    }
    else if (flag == "#R#")
    {
        resumeVideo();
        messageCount = messageCount + 1;
        $('#messagesDiv').append("<div><b>" + name + "</b> resumed the video<br /></div>");        
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
            dataRef.push({name: currentName, uri: strip(text)});               
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
