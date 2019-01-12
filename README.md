![OJSLogo](https://dimden.tk/OJS.png)

# OWOP.js | OJS

The library for using OWOP API in Node.JS!

[![OJS](https://img.shields.io/badge/OJS-1.1.0-blue.svg)](https://www.npmjs.com/package/owop-js)

### Latest changelog

- Added disableoutput option.
- Added chatbuffer.
- Small changes.

# Documentation

Here is a basic example, evaluating the library.

```js
var OwopJS = require('owop-js'); //Include the OWOP.js library
var OJS = new OwopJS.OJS();

OJS.on("open", async function () { //Modify what happens when our app creates a connection to the server
  await OJS.world.join('main'); //Join the world named 'main', the default world.
  await OJS.chat.nick('OJS Bot'); //Set our nickname to 'OJS Bot'
  await OJS.interact.controller(); //Start controller
});
OJS.on("message", function (data) { //Modify what happens upon receiving a message.
  //For these two lines, see below for more info.
  OJS.chat.recvModifier(data.data)
  OJS.util.messageHandler(data.data);
});
OJS.on("close", function () {
  console.log('[OWOP.js]: Disconnected.'); //Let us know that we have been disconnected.
  process.exit(); //Exit Node
});
```

Here we are just importing OJS and adding some events. When a connection is established, we join the world, set a nick, and start the controller (see below for more information about the controller).


# Installation

To install OJS, execute `npm install owop-js`. It will install dependencies too.

# Options

If you don't set anything, OJS will run in default mode, and connect to original OWOP.
When you initiate OJS, you can set some options.

*Example:*

```js
var OJS = new OwopJS.OJS({option: value});
```
**`matrix`**
VALUES: `true`

Just enjoy the messages from OWOP.

```js
var OJS = new OwopJS.OJS({matrix: true});
```

**`ws && origin`**

You can use these options to connect to OWOP clones. Both of those options need to be defined in order to make it work properly.

```js
var OJS = new OwopJS.OJS({ws: "ws://104.237.150.24:1337", origin: "http://augustberchelmann.com/owop/"});
```

**`disableoutput`**
VALUES: `true`

Use this option to disable `console.log`-ing messages.

```js
var OJS = new OwopJS.OJS({disableoutput: true});
```

# Usage

OJS supports a majority of what the normal OWOP client can do.

**`OJS.events.owop`**

You can use some events like in original OWOP.

List of events:
```js
{
OJS.events.owop.connect: 0, // Triggers when you joining the world.
OJS.events.owop.disconnect: 1, // Triggers when you leave the world.
OJS.events.owop.id: 2, // Triggers when you get ID.
OJS.events.owop.update: 3, // Triggers when players moved, changed, etc.
OJS.events.owop.rank: 4, // Triggers when you get rank.
OJS.events.owop.move: 5 // Triggers when you move.
}
```

*Example use of events:*

```js
OJS.on(OJS.events.owop.id, function(id) {
console.log(`Got id: ${id}`);
});
```

## OJS.ranks

Nothing interesting here, just a ranks as in original OWOP.

`ADMIN: 3`;
`MODERATOR: 2`;
`USER: 1`;
`NONE: 0`;

## OJS.chat

OJS has powerful chat features for easy working with it!

### OJS.chat.adminlogin(LOGIN)

Login to admin. If you type wrong pass you will get kicked!

```js
OJS.chat.adminlogin(OJS.util.localStorage.getItem('adminlogin'));
```

### OJS.chat.modlogin(LOGIN)

The same as `OJS.chat.adminlogin()`, but for moderators.

```js
OJS.chat.modlogin(OJS.util.localStorage.getItem('modlogin'));
```

### OJS.chat.nick(NICK)

With this function you can easily set your bot nickname.

```js
OJS.chat.nick('OJS Bot');
```

### OJS.chat.tell(ID, MSG)

Send private messages to other people.

```js
OJS.chat.tell(126, 'TellMessage from OJS!');
```

### OJS.chat.send(MSG)

Just send a message to chat!
Don't forget that you have chatSend delay, and you can't send messages super fast. *(if you are not admin)*

```js
OJS.chat.send('Message from OJS!')
```

### OJS.chat.recvModifier(MSG)

This function is for handling messages. You need to put it inside the `message` event.

Also with this function you can make commands for your bot. It's really same as OWOP API, so I don't think I should show how you can make commands.

```js
ws.onmessage = function (data) {
    msg = data.data;
    OJS.chat.recvModifier(msg);
    OJS.util.messageHandler(msg):
}
```

### OJS.chat.sendModifier(MSG);

This function is for handling sendMessages.

```js
OJS.chat.sendModifier = (msg) => {
  if(msg == "!test") {
    console.log('Test command.')
  } else {
    ws.send(msg + OJS.options.misc.chatVerification)
  }
}
```

```js
> OJS.chat.send('!test')
// -> Test command.
> OJS.chat.send('Hi')
// -> [OWOP.js]: [128] OJS Bot: Hi
```

### OJS.chat.firstMessage()

Returns the first message that was received.

```js
OJS.chat.firstMessage() // <style> ... </style>
```

### OJS.chat.lastMessage()

Returns the last message that was received.

```js
OJS.chat.lastMessage() // [128] dimden: Hi
```

## OJS.interact

OJS has interacting features for communicating with OWOP in console.

### OJS.interact.input()

This function will make forever-chat-input in Console.

```js
ws.onopen = async function () {
  await OJS.world.join('main');
  await OJS.interact.input(); // You will able to chat in console!
}

/* Console:
> hi
[OWOP.js]: [128] OJS Bot: hi
*/
```

### OJS.interact.ask()

This function is like `OJS.INTERACT.INPUT()` but it runs only once.

*Example:*

```js
ws.onopen = async function () {
  await OJS.world.join('main');
  await OJS.interact.ask(); // Console will ask to send message once.
}

/* Console:
> hello
[OWOP.js]: [128] OJS Bot: hello
*/
```

### OJS.interact.controller()

This feature will enable infinite input in the command line that will evaluate inputted code.

*Example:*

```js
ws.onopen = async function () {
  await OJS.world.join('main');
  await OJS.interact.controller(); // Console will let you type code.
}

/* Console:
> OJS.chat.send('hello')
[OWOP.js]: [128] OJS Bot: hello
*/
```

### OJS.interact.eval()

It's like `OJS.interact.controller()` but it will ask you to type code only once.

*Example:*

```js
ws.onopen = async function () {
  await OJS.world.join('main');
  await OJS.interact.eval(); // Console will ask to type code once.
}

/* Console
> OJS.chat.send('F')
[OWOP.js]: [128] OJS Bot: F
*/
```

## OJS.world

Methods for interacting with OWOP's world!

### OJS.world.join(world)

Use this to join worlds.

```js
OJS.world.join('main');
```

### OJS.world.leave()

Use this to leave the current world.

```js
OJS.world.leave()
```

### OJS.world.move(X, Y)

This will move your bot cursor.

```js
OJS.world.move(999, 999);
```

### OJS.world.setPixel(X, Y, COLOR)

Use this to place pixels. *(tileXY)*

```js
OJS.world.setPixel(0, 0, [0,0,0]);
```

If color isn't defined (`OJS.world.setPixel(X, Y)`) then it will take the color from `OJS.player.color`. So, if you need to place many pixels with one color, use:

```js
OJS.world.setColor([r, g, b]);
OJS.world.setPixel(0,0);
```

### OJS.world.clearChunk(X,Y)

You can clear chunks with this function. (Admin/mod rank is required.)

```js
OJS.world.clearChunk(0,0)
```

### OJS.world.protectChunk(X,Y, NEWSTATE)

You can protect chunks with this function. (Admin/mod rank is required.)

```js
OJS.world.protectChunk(0, 0, 1)
```


### OJS.world.setColor(COLOR)

Choose the selected color of bot, as shown above.

```js
OJS.world.setColor([255, 255, 255])
```

### OJS.world.setTool(TOOL_ID)

You can choose the selected tool of the bot.

```js
OJS.world.setTool(4);
```

List of id-tools:
```json
0: 'cursor',
1: 'move',
2: 'pipette',
3: 'eraser',
4: 'zoom',
5: 'fill',
6: 'paste',
7: 'export',
8: 'line',
9: 'protect'
```

### OJS.world.tp(ID)

Teleports to player with the specified ID. Sometimes it might not work.

*Example:*

```js
OJS.world.tp(128);
```

### OJS.world.follow(ID)

Follow player by ID. Sometimes it might not work.

Enabling:
```js
OJS.world.follow.enable(128);
```

Disabling:
```js
OJS.world.follow.disable();
```

## OJS.player

Player values!

### OJS.player.id

Returns the ID of the bot.

### OJS.player.rank

Returns the rank of the bot.

### OJS.player.x

Returns the X coordinate of the bot.

```js
OJS.player.x // 156
```

### OJS.player.y

Returns the Y coordinate of the bot.

```js
OJS.player.y // 24
```

### OJS.player.color

Returns the selected color of the bot.

```js
OJS.player.color // [135, 54, 45]
```

## OJS.players

Returns all players that was found. (Might not be very accurate).

## OJS.options

It has all options that the original OWOP client has.

```json
class: null,
chunkSize: 16,
netUpdateSpeed: 20,
clusterChunkAmount: 64,
maxWorldNameLength: 24,
worldBorder: 0xFFFFF,
chatBucket: [4, 6]
```

### OJS.options.tools

Returns ID of tools

### OJS.options.misc

Every verification-keys here.

### OJS.options.opcode.server

Returns OpCodes.

## OJS.util

Utilities, which make programming MUCH easier. Expect to use them all over your code.

### OJS.util.messageHandler(DATA)

One of most important functions. You need to paste it in `message` event.

*Example:*

```js
ws.onmessage = function(data) {
OJS.chat.recvModifier(data.data)
OJS.util.messageHandler(data.data)
};
```

### OJS.util.localStorage

The localStorage emulation in Node.JS by me. :)
It will be saved even after closing app.

#### Using localStorage

In the beginning of localStorage using you need to create the localStorage database, and only after that use all functions of it.

Usage:
```js
function OJS_LS() {
  OJS.util.localStorage.setItem('b', 'c')
}
if(!OJS.util.localStorage.isCreated()) {
  await OJS.util.localStorage.create()
  setTimeout(function () {
    OJS_LS()
  },200)
} else {
 OJS_LS()
}
```

#### OJS.util.localStorage.setItem(KEY, VALUE)

Default function from browser. Set item to localStorage.

```js
OJS.util.localStorage.setItem('a', 'b');
```

#### OJS.util.localStorage.getItem(KEY)

Get item from localStorage.

```js
OJS.util.localStorage.getItem('a'); // 'b'
```

#### OJS.util.localStorage.removeItem(KEY)

Remove item from localStorage.

```js
OJS.util.localStorage.removeItem('a')
```

### OJS.util.localStorage.clearStorage()

Clear everything from localStorage.

```js
OJS.util.localStorage.clearStorage()
```

### OJS.util.localStorage.isCreated()

Checks if localStorage is created. Returns a boolean value.

```js
OJS.util.localStorage.isCreated() // true
```

# End

That's all! Thank you for reading the documentation. Ask your questions in my Discord: [Eff the cops#1877](https://discord.gg/k4u7ddk)
