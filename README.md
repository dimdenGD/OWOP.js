![OJSLogo](https://dimden.tk/OJS.png)

# OWOP.js | OJS

The library for using OWOP API in Node.JS!

![OJS](https://img.shields.io/badge/OJS-1.0.6-blue.svg)

### Latest changelog

- OJS is now on npm! (npm install owop-js).
- Added OJS.world.tp(id).
- Added OJS.world.follow.enable(id) and OJS.world.follow.disable().
- Added OJS.players.
- Improved code.
- Added options. With it you can connect to OWOP clones and other.
- Fixed RCE. (May be not 100% accurate)
- Fixed bugs.
- And many other features!

# Documentation

Firstly, we need a main file for our bot.

```js
var OwopJS = require('owop-js');
var OJS = new OwopJS.OJS();

OJS.on("open", async function () {
  await OJS.world.join('main');
  await OJS.chat.nick('OJS Bot')
  await OJS.interact.controller();
});
OJS.on("message", function (data) {
  OJS.chat.recvModifier(data.data)
  OJS.util.messageHandler(data.data);
});
OJS.on("close", function () {
  console.log('[OWOP.js]: Disconnected.')
});
```

Let's try to read this code.
Here we just installing OJS and making events. When we opening to world we join to world, setting nick, and starting controller.


# Installation

To install OJS you need to type in console `npm install owop-js`. It will install dependencies and OJS.

# Options

If you don't set anything, OJS will run in default mode, and connect to original OWOP.
When you require OJS you can set some options.

*Example:*

```js
var OJS = new OwopJS.OJS({option: value});
```

## matrix

VALUES: `true`.

Just enjoy the messages from OWOP.

`var OJS = new OwopJS.OJS({matrix: true});`

## ws && origin

You can connect to OWOP clones.
If you set one of this options you need to set other too.

*Example:*

```js
var OJS = new OwopJS.OJS({ws: "ws://owopforfun.heroku.com", origin: "https://owoppa.netlify.com"});
```
# Using

OJS has many features. Let's discover it here!

## OJS.RANKS

Nothing interesting, just a ranks as in original OWOP.
`ADMIN: 3`;
`MODERATOR: 2`;
`USER: 1`;
`NONE: 0`

## OJS.CHAT

OJS has powerful chat features for easy working with it!

### OJS.CHAT.ADMINLOGIN(LOGIN)

Login to admin. If you type wrong pass you will get kicked!

*Example:*

```js
OJS.chat.adminlogin(OJS.util.localStorage.getItem('adminlogin');
```

### OJS.CHAT.NICK(NICK)

With this function you can easily set your bot nickname.

*Example:*

```js
OJS.chat.nick('OJS Bot');
```

### OJS.CHAT.TELL(ID, MSG)

You can tell messages to other people.

*Example:*

```js
OJS.chat.tell(126, 'TellMessage from OJS!');
```

###  OJS.CHAT.SEND(MSG)

Just send a message to chat!

*Example:*

```js
OJS.chat.send('Message from OJS!')
```

### OJS.CHAT.RECVMODIFIER(MSG)

This function made for handling messages. You need to put it to `message` event.

*Example:*

```js
ws.onmessage = function (data) {
    msg = data.data;
    OJS.chat.recvModifier(msg);
    OJS.util.messageHandler(msg):
}
```

### OJS.CHAT.FIRSTMESSAGE()

Returns first message.

*Example:*

```js
OJS.chat.firstMessage() // <style> ... </style>
```

### OJS.CHAT.LASTMESSAGE()

Returns last message.

*Example:*

```js
OJS.chat.lastMessage() // [128] dimden: Hi
```

## OJS.INTERACT

OJS has interacting features for communicating with OWOP in console.

### OJS.INTERACT.INPUT()

This function will make forever-chat-input in Console.

*Example:*

```js
ws.onopen = async function () {
await OJS.world.join('main');
await OJS.interact.input(); // You will able to chat in console!

/*
> hi
[OWOP.js]: [128] OJS Bot: hi
> ...
*/
}
```

### OJS.INTERACT.ASK()

This function is like `OJS.INTERACT.INPUT()` but it runs only 1 time!

*Example:*

```js
ws.onopen = async function () {
await OJS.world.join('main');
await OJS.interact.ask(); // Console will ask to send message once.
}

/*
> hello
[OWOP.js]: [128] OJS Bot: hello
*/
```

### OJS.INTERACT.CONTROLLER()

This feature will make infinity input that will eval all your code.

*Example:*

```js
ws.onopen = async function () {
await OJS.world.join('main');
await OJS.interact.controller(); // Console will ask to type code.
}

/*
> OJS.chat.send('hello')
[OWOP.js]: [128] OJS Bot: hello
> OJS.world.leave()
> ...
*/
```

### OJS.INTERACT.EVAL()

It's like `OJS.INTERACT.CONTROLLER()` but it will ask you to type code only once.

*Example:*

```js
ws.onopen = async function () {
await OJS.world.join('main');
await OJS.interact.eval(); // Console will ask to type code once.
}

/*
> OJS.chat.send('F')
[OWOP.js]: [128] OJS Bot: F
*/
```

## OJS.WORLD

World features!

### OJS.WORLD.JOIN(world)

You can join world.

*Example:*

```js
OJS.world.join('main');
}
```

### OJS.WORLD.LEAVE()

You can leave world.

*Example:*

```js
OJS.world.leave()
```

### OJS.WORLD.MOVE(X, Y)

This will move your bot cursor.

*Example:*

```js
OJS.world.move(999, 999);
```

### OJS.WORLD.SETPIXEL(X, Y, COLOR)

You can place pixels. *(tileXY)*

*Example:*

```js
OJS.world.setPixel(0, 0, [0,0,0]);
```

### OJS.WORLD.SETCHUNK(X,Y,RGB)

You can set chunks. (You need to be admin for that)

*Example:*

```js
OJS.world.setChunk(0,0,[0,0,0])
```

### OJS.WORLD.SETCOLOR(COLOR)

Choose the selected color of bot!

*Example:*

```js
OJS.world.setColor([255, 255, 255])
```

### OJS.WORLD.SETTOOL(TOOL_ID)

You can choose the selected tool of bot!
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


*Example:*

```js
OJS.world.setTool(4);
```

### OJS.WORLD.TP(ID)

Teleports to player. Sometimes it can not work.

*Example:*

```js
OJS.world.tp(128);
```

### OJS.WORLD.FOLLOW

Follow player by ID. Sometimes it can not work.

Enable:

```js
OJS.world.follow.enable(128);
```

Disable:

```js
OJS.world.follow.disable();
``

## OJS.PLAYER

Player values.

### OJS.PLAYER.ID

Returns ID of bot.

### OJS.PLAYER.RANK

Returns Rank of bot.

### OJS.PLAYER.X

Returns X of Bot

*Example:*

```js
OJS.player.x // 156
```

### OJS.PLAYER.Y

Returns Y of Bot

*Example:*

```js
OJS.player.y // 24
```

### OJS.PLAYER.COLOR

Returns selected color of bot.

*Example:*

```js
OJS.player.color // [135, 54, 45]
```

## OJS.PLAYERS

Returns all players that was found. (It can be not very accurate).

## OJS.OPTIONS

It has all options that original OWOP has.

```json
class: null,
chunkSize: 16,
netUpdateSpeed: 20,
clusterChunkAmount: 64,
maxWorldNameLength: 24,
worldBorder: 0xFFFFF,
chatBucket: [4, 6]
```

### OJS.OPTIONS.TOOLS

Returns ID of tools

### OJS.OPTIONS.MISC

Every verification-keys here.

### OJS.OPTIONS.OPCODE.SERVER

Returns OpCodes.

## OJS.UTIL.MESSAGEHANDLER(DATA)

One of most important functions. You need to paste it in `message` event.

*Example:*

```js
ws.onmessage = function(data) {
OJS.chat.recvModifier(data.data)
OJS.util.messageHandler(data.data)
};
```

## OJS.UTIL.LOCALSTORAGE

The localStorage emulation in Node.JS by me. :)
It will be saved even after closing app.

### Using localStorage

In the beginning of localStorage using you need to create the localStorage database, and only after that use all functions of it.
Example of using:
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

### OJS.UTIL.LOCALSTORAGE.SETITEM(KEY, VALUE)

Default function from browser. Set item to localStorage.

*Example:*

```js
OJS.util.localStorage.setItem('a', 'b');
```

### OJS.UTIL.LOCALSTORGE.GETITEM(KEY)

Get item from localStorage.

*Example:*

```js
OJS.util.localStorage.getItem('a'); // 'b'
```

### OJS.UTIL.LOCALSTORAGE.REMOVEITEM(KEY)

Remove item from localStorage.

*Example:*

```js
OJS.util.localStorage.removeItem('a')
```

### OJS.UTIL.LOCALSTORAGE.CLEARSTORAGE()

Clear everything from localStorage.

*Example:*

```js
OJS.util.localStorage.clearStorage()
```

### OJS.UTIL.LOCALSTORAGE.ISCREATED()

Checks is localStorage created. *(true / false)*

*Example:*

```js
OJS.util.localStorage.isCreated() // true
```

# End

It's all! Thank you for reading the documentation. Ask the questions in my discord: [Eff the cops#1877](https://discord.gg/k4u7ddk)
