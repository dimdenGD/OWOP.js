/*
  OWOP.js for NODE.js by DIMDEN
  It has EVERYTHING that you need for your Node OWOP Bot.
  I hope you enjoy!

  GitHub: https://github.com/dimdenGD/OWOP.js
  My discord tag: Eff the cops#1877
*/

const readline = require('readline');
const fs = require('fs');

OJS = {
  RANKS: {
    ADMIN: 3,
    MODERATOR: 2,
    USER: 1,
    NONE: 0
  },
  chat: {
    setNick: function (nick) {
      ws.send(`/nick ${nick}${OJS.options.misc.chatVerification}`)
    },
    tell: function (id, msg) {
      OJS.chat.send(`/tell ${id} ${msg}`)
    },
    send: function(message) {
      ws.send(message+OJS.options.misc.chatVerification)
    },
    recvModifier: function (msg) {
      if(!Buffer.isBuffer(msg)) {
          console.log(`[OWOP.js]: ` + msg)
          OJS.chat.messages.push(msg)
        }
    },
    firstMessage: function () {
      return OJS.chat.messages[0]
    },
    lastMessage: function () {
      return OJS.chat.messages.reverse()[0]
    },
    messages: []
  },
  interact: {
    input: function () {
      var stdin = process.openStdin();
      stdin.on("data", function(d) {
        var msg = d.toString().trim();
          return OJS.chat.send(msg);
        });
    },
    ask: function () {
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('[CHAT_ASK]: ', (msg) => {
        OJS.chat.send(msg)
        rl.close();
      });
    },
    controller: function () {
      var stdin = process.openStdin();
      stdin.on("data", function(d) {
        var msg = d.toString().trim();
        try {
          res = eval(msg);
          return console.log(String(res).slice(0, 100))
        } catch(e) {console.log('[ERROR]: ' + e.name + ":" + e.message + "\n" + e.stack)}
        });
    },
    eval: function () {
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('', (msg) => {
        try {
          res = eval(msg);
          return console.log(String(res).slice(0, 100))
      } catch(e) {console.log('[ERROR]: ' + e.name + ":" + e.message + "\n" + e.stack)}
        rl.close();
      });
    }
  },
  world: {
    join: function (worldName) {
      var world = worldName;
      var ints = [];
      if (world) {
        world = world.toLowerCase();
      } else {
        world = "main";
      }
      for (var i = 0; i < world.length && i < 24; i++) {
        var charCode = world.charCodeAt(i);
        if ((charCode < 123 && charCode > 96) || (charCode < 58 && charCode > 47) || charCode == 95 || charCode == 46) {
          ints.push(charCode);
        }
      }
      var array = new ArrayBuffer(ints.length + 2);
      var dv = new DataView(array);
      for (var i = ints.length; i--;) {
        dv.setUint8(i, ints[i]);
      }
      dv.setUint16(ints.length, 4321, true);
     ws.send(array);

      console.log("[OWOP.js]: Connected! Joining world: " + world);
    },
    leave: function () {
      ws.close()
    },
    move: function (x, y) {
      var array = new ArrayBuffer(12);
      var dv = new DataView(array);
      dv.setInt32(0, x, true);
      dv.setInt32(4, y, true);
      dv.setUint8(8, OJS.player.color[0]);
      dv.setUint8(9, OJS.player.color[1]);
      dv.setUint8(10, OJS.player.color[2]);
      dv.setUint8(11, OJS.player.tool);
      ws.send(array);
      OJS.player.x = x;
      OJS.player.y = y;
    },
    setPixel: async function (x, y, color) {
    var array = new ArrayBuffer(11);
    var dv = new DataView(array);
    await dv.setInt32(0, x, true);
    await dv.setInt32(4, y, true);
    await dv.setUint8(8, color[0]);
    await dv.setUint8(9, color[1]);
    await dv.setUint8(10, color[2]);
    await ws.send(array);
    OJS.player.color = [color[0], color[1], color[2]];
  },
    setChunk: function (x, y, rgb) {
      var array = new ArrayBuffer(13);
      var dv = new DataView(array);
      dv.setInt32(0, x, true);
      dv.setInt32(4, y, true);
      dv.setUint8(8, rgb[0]);
      dv.setUint8(9, rgb[1]);
      dv.setUint8(10, rgb[2]);
      ws.send(array);
    },
    setColor: function (rgb) {
      var array = new ArrayBuffer(12);
      var dv = new DataView(array);
      dv.setInt32(0, OJS.player.x, true);
      dv.setInt32(4, OJS.player.y, true);
      dv.setUint8(8, rgb[0]);
      dv.setUint8(9, rgb[1]);
      dv.setUint8(10, rgb[2]);
      dv.setUint8(11, OJS.player.tool);
      ws.send(array);
      OJS.player.color = [rgb[0], rgb[1], rgb[2]];
    },
    setTool: function (toolId) {
      var array = new ArrayBuffer(12);
      var dv = new DataView(array);
      dv.setInt32(0, OJS.player.x, true);
      dv.setInt32(4, OJS.player.y, true);
      dv.setUint8(8, OJS.player.color[0]);
      dv.setUint8(9, OJS.player.color[1]);
      dv.setUint8(10, OJS.player.color[2]);
      dv.setUint8(11, toolId);
      ws.send(array);
      OJS.player.tool = toolId;
    }
  },
  player: {
    id: 0,
    rank: 1,
    x: 0,
    y: 0,
    color: [0, 0, 0],
    tool: 0,
  },
  players: {
    list: {}
  },
  options: {
    class: null,
    chunkSize: 16,
    netUpdateSpeed: 20,
    clusterChunkAmount: 64,
    maxWorldNameLength: 24,
    worldBorder: 0xFFFFF,
    chatBucket: [4, 6],
    tools: {
      id: {},
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
    },
    misc: {
      worldVerification: 4321,
      chatVerification: String.fromCharCode(10),
      tokenVerification: 'CaptchA'
    },
    opCode: {
      client: {},
      server: {
        setId: 0,
        worldUpdate: 1,
        chunkLoad: 2,
        teleport: 3,
        setRank: 4,
        captcha: 5,
        setPQuota: 6,
        chunkProtected: 7
      }
    }
  },
  util: {
    messageHandler: function (data) {
      if (typeof data != "string") {
        switch(data.readUInt8(0)) {
          case 0: // ID
          OJS.player.id = data.readUInt32LE(1);
          break;
          case 4:
          console.log(`[OWOP.js]: Got rank ${data.readUInt8(1)}`)
          OJS.player.rank = data.readUInt8(1);
        }
      }
    },
    localStorage: {
      create: function () {
        fs.appendFile('OJS_LOCALSTORAGE.json', '{}', function (err) {
          if (err) throw err;
        });
      },
      setItem: function (key, value) {
        if(OJS.util.localStorage.isCreated()) {
        var ls = JSON.parse(fs.readFileSync("OJS_LOCALSTORAGE.json"));
        ls[key] = value;
        console.log(JSON.stringify(ls))
        fs.writeFileSync("OJS_LOCALSTORAGE.json", JSON.stringify(ls))
        } else {console.error("OJS ERROR: LocalStorage is not created!")}
      },
      getItem: function (key) {
        if(OJS.util.localStorage.isCreated()) {
        return JSON.parse(fs.readFileSync("OJS_LOCALSTORAGE.json"))[key]
      } else {console.error("OJS ERROR: LocalStorage is not created!")}
      },
      removeItem: function (key) {
        if(OJS.util.localStorage.isCreated()) {
        var ls = JSON.parse(fs.readFileSync("OJS_LOCALSTORAGE.json"));
        delete ls[key];
        fs.writeFileSync("OJS_LOCALSTORAGE.json", JSON.stringify(ls))
        } else {console.error("OJS ERROR: LocalStorage is not created!")}
      },
      clearStorage: function () {
        fs.writeFileSync("OJS_LOCALSTORAGE.json", '{}')
      },
      isCreated: function () {
        if(fs.existsSync('OJS_LOCALSTORAGE.json') && fs.readFileSync("OJS_LOCALSTORAGE.json") != undefined && fs.readFileSync("OJS_LOCALSTORAGE.json") != "") {return true} else {return false}
      }
    }
  }
};

module.exports = {OJS};
