# OWOP.js | OJS

The small library for easy using API of OWOP + Guide.

For many scripters it's really hard to found how to use the API of OWOP. This is free library with documentation. It has all needed for making scripts


# Documentation

### Installation
To install the lib you need just to paste this to your script.
```js
var ojs = document.createElement('script');
ojs.src = "https://raw.githubusercontent.com/dimdenGD/OWOP.js/master/OWOP.js";
document.getElementsByTagName('head')[0].appendChild(ojs);

ojs.onload = function() {
    // Your code ...
};
```

### Use

TO use the library you need to write **OJS** tag.


### Player

Getting id of player:
`OJS.player.id();` - *returns 15683*.

Getting nickname of player:
`OJS.player.name();` - *returns "dimden"*.

Getting player rank:
`OJS.player.rank()` - *returns 1*.

Getting tool that player using right now:
`OJS.player.tool()` - *returns "fill"*.

Getting colour that player using right now:
`OJS.player.color()` - *returns array [13, 54, 63]*.

Getting tool list of player:
`OJS.tool.list()` - *returns object with tools*.
### Ranks



You can create your own ranks.
`OJS.rank.create(rankName, id)`
*Example:*
```js
OJS.rank.create("VIP", 4);
```

To get rank use:
`OJS.rank.get(rankName)`
*Example:*
```js
OJS.rank.get("ADMIN"); // returns 3
```

To set rank use:
`OJS.rank.set(rankName, id)`
*Example:*
```js
OJS.rank.set("NONE", 5) // Now NONE rank have 5 id
```

### Windows

You can get all windows:
`OJS.window.all()` - *returns object with all windows*.
You can delete window:
`OJS.window.delete(windowTitle)`
*Example:*
```js
OJS.window.delete("OWOP Radio"); // OWOP Radio will be deleted
```

Creating window in vanilla OWOP API:
```js
function testWindow() {

OWOP.windowSys.addWindow(new OWOP.windowSys.class.window('Test Window', {}, function(win) {

    win.addObj(document.createTextNode(`This is test text in cool window`));

    win.container.style.height = 'auto';
    win.container.style.width = 'auto';
    win.container.style.overflow = 'hidden';
        }).move(window.innerWidth  - 1200, 32))
      }
      if (typeof OWOP != 'undefined') testWindow();
      window.addEventListener('load', function() {
          setTimeout(testWindow, 1300);
      });
```

### Chat

You can get the last message WITHOUT nickname:

`OJS.chat.lastMessage()` - *returns "Test Message"*.

You can get the last message WITH nickname:

`OJS.chat.lastMessageFull()` - *returns "[12932] dimden: Test Message"*.

You can get first message:

`OJS.chat.firstMessage()` - *returns "[Server] Joined world: "main", your ID is: 12932!"*.

You can send message to chat:

`OJS.chat.sendMessage(Message)`
*Example:*
```js
OJS.chat.sendMessage("Test Msg");
```
You can send LOCAL message:

`OJS.chat.localMessage(Message);`
*Example:*
```js
OJS.chat.localMessage("Test Msg");
```
You can clear chat:

`OJS.chat.clearChat()` - *chat will be cleared*.

You can get the message that will be sended:

`OJS.chat.getSendMessage()`
*Example how to create your own commands:*
```js
OJS.chat.getSendMessage(msg => {
if(msg == "!test") {
    OJS.chat.localMessage("Test was successfull!");
    return msg;
} else {
    return msg;
}
    
})
```

### World
You can set pixel:

`OJS.world.setPixel(x, y, colourFromPallete)`
*Example:*
```js
OJS.world.setPixel(0,0,1);
```
You can get pixel:

`OJS.world.getPixel(x, y)` - *returns array with RGB*.

##### Coordinates
You can get coordinates:

`OJS.world.coordinates.x()`;
`OJS.world.coordinates.y()`;

You can get last coordinates:

`OJS.world.coordinates.last_x()`;
`OJS.world.coordinates.last_y()`;

You can get tile coordinates:

`OJS.world.coordinates.tile_x()`;
`OJS.world.coordinates.tile_y()`;

You can get camera coordinates:

`OJS.world.coordinates.camera_x()`;
`OJS.world.coordinates.camera_y()`;


##### Net
You can disconnect:

`OJS.world.disconnect()` - *Lost connection with server*.

You can reconnect:

`OJS.world.reconnect()`

# Options
##### Set
`OJS.options.set.defaultWorld(WorldName)`;
`OJS.options.set.defaultZoom(Value)`;
`OJS.options.set.sounds(TrueFalse)`;
`OJS.options.set.maxChatMessages(Value)`;
`OJS.options.set.minGrid(Zoom)`;
`OJS.options.set.cameraSpeed(Value)`;
`OJS.options.set.toolsetURL(LinkOrFile)`;
`OJS.options.set.zoomMax(Value)`;
`OJS.options.set.zoomMin(Value)`;
##### Get
`OJS.options.get.defaultWorld()`;
`OJS.options.get.defaultZoom()`;
`OJS.options.get.sounds()`;
`OJS.options.get.maxChatMessages()`;
`OJS.options.get.minGrid()`;
`OJS.options.get.cameraSpeed()`;
`OJS.options.get.toolsetURL()`;
`OJS.options.get.zoomMax()`;
`OJS.options.get.zoomMin()`;

# Tool

You can get toolset of player:

`OJS.tool.list()` - *returns object with tools*.

You can delete tool:

`OJS.tool.remove(tool)`

*Example:*
```js
OJS.tool.remove("cursor") // Cursor will be deleted
```

### Other
You can get local storage of OWOP:
`OJS.localStorage`

# License
I'm not owner of ourworldofpixels.com. This library is free for use.
