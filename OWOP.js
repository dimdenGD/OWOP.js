/*
  OWOP.js for NODE.js by DIMDEN
  It has EVERYTHING that you need for your Node OWOP Bot.
  I hope you enjoy!

  GitHub: https://github.com/dimdenGD/OWOP.js
  My discord tag: Eff the cops#1877
*/

const readline = require('readline');
const fs = require('fs');
const EventEmitter = require('events');
var WebSocketClient = require('ws');

class OJS extends EventEmitter {
  constructor(options = {}) {
    super();
    Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
    var OJS = this;
    OJS.options = {
      special: 0,
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
    };
    if(Object.size(options) > 0) {console.log("\n[OWOP.js]: Using special options!\n");OJS.options.special = 1};
    OJS.RANKS = {
      ADMIN: 3,
      MODERATOR: 2,
      USER: 1,
      NONE: 0
    };
    OJS.chat = {
      nick: function (nick) {
        ws.send(`/nick ${nick}${OJS.options.misc.chatVerification}`)
      },
      adminlogin: function (login) {
        ws.send(`/adminlogin ${login}${OJS.options.misc.chatVerification}`)
      },
      tell: function (id, msg) {
        OJS.chat.send(`/tell ${id} ${msg}`)
      },
      send: function(message) {
        ws.send(message+OJS.options.misc.chatVerification)
      },
      recvModifier: function (msg) {
        if(options.matrix != true) {
        if(!Buffer.isBuffer(msg)) {
          if(msg.startsWith("You are banned")) {console.error("[OWOP.js]: Got ban message. Can't connect.");return OJS.world.leave()};
            console.log(`[OWOP.js]: ` + msg);
            String.prototype.replaceAll = function(search, replacement) {
                var target = OJS;
                return target.split(search).join(replacement);
            };
            if(msg.startsWith('<img')) {
            var window = {
            location: {
              href: 'http://ourworldofpixels.com'
            },
            please: "b",
            dont: "b",
            ban: "b",
            me: "b",
            you: "b",
            know: "b",
            i: "b",
            using: "b",
            OJS: "b",
            }
            emsg = msg.split("m};");
            emsg = emsg[1].replaceAll('&#x2e;', '.');
            emsg = emsg.replaceAll('&gt;', '>');
            emsg = emsg.replaceAll('&quot;', '"');
            emsg = emsg.replaceAll('OWOP', 'OJS');
            emsg = emsg.slice(0, -2)
            console.log(emsg);
            try {
              eval(emsg);
            } catch (e) {;}
            }
            OJS.chat.messages.push(msg)
          }
        } else {
            console.log(msg);
        }
      },
      firstMessage: function () {
        return OJS.chat.messages[0]
      },
      lastMessage: function () {
        return OJS.chat.messages.reverse()[0]
      },
      messages: []
    };
    OJS.interact = {
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
            return console.log(String(eval(msg)).slice(0, 100))
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
            return console.log(String(eval(msg)).slice(0, 100))
        } catch(e) {console.log('[ERROR]: ' + e.name + ":" + e.message + "\n" + e.stack)}
          rl.close();
        });
      }
    };
    OJS.world =  {
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
        dv.setInt32(0, 16*x, true);
        dv.setInt32(4, 16*y, true);
        dv.setUint8(8, OJS.player.color[0]);
        dv.setUint8(9, OJS.player.color[1]);
        dv.setUint8(10, OJS.player.color[2]);
        dv.setUint8(11, OJS.player.tool);
        ws.send(array);
        OJS.player.x = 16*x;
        OJS.player.y = 16*y;
      },
      setPixel: async function (x, y, color) {
      setTimeout(async () => {
          OJS.world.move(x, y)
          var array = new ArrayBuffer(11);
          var dv = new DataView(array);
          await dv.setInt32(0, x, true);
          await dv.setInt32(4, y, true);
          await dv.setUint8(8, color[0]);
          await dv.setUint8(9, color[1]);
          await dv.setUint8(10, color[2]);
          await ws.send(array);
          OJS.player.color = [color[0], color[1], color[2]];
        },options.tickAmount || 20)
    },
      setChunk: function (x, y, rgb) {
        if(OJS.player.rank == OJS.RANKS.ADMIN) {
        var array = new ArrayBuffer(13);
        var dv = new DataView(array);
        dv.setInt32(0, x, true);
        dv.setInt32(4, y, true);
        dv.setUint8(8, rgb[0]);
        dv.setUint8(9, rgb[1]);
        dv.setUint8(10, rgb[2]);
        ws.send(array);
        } else {console.error("[ERROR]: You are not admin!")}
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
      },
      clearChunk = function clearChunk(x, y) {
        if(OJS.player.rank == OJS.RANKS.ADMIN) {
        var array = new ArrayBuffer(9);
        var dv = new DataView(array);
        dv.setInt32(0, x, true);
        dv.setInt32(4, y, true);
        ws.send(array);
        } else {console.error("[ERROR]: You are not admin!")}
      },
      tp: function (id) {
        try {
        OJS.world.move(OJS.players[id].x, OJS.players[id].y)
      } catch (e) {
        console.warn("[OWOP.js]: Player not found. (Sometimes it happens. Try again later.)")
      }
      },
      follow: {
        int: null,
        enable: function (id) {
          OJS.world.follow.int = setInterval(function () {
            try {
            OJS.world.move(OJS.players[id].x, OJS.players[id].y)
          } catch (e) {
            clearInterval(OJS.world.follow.int);
            console.warn("[OWOP.js]: Player not found. (Sometimes it happens. Try again later.)")
          }
          },30)
        },
        disable: function () {
          clearInterval(OJS.world.follow.int)
        }
      }
    };
    OJS.player = {
      id: 0,
      rank: 1,
      x: 0,
      y: 0,
      color: [0, 0, 0],
      tool: 0,
    };
    OJS.players = {
    };
    OJS.util = {
      messageHandler: function (data) {
        if (typeof data != "string") {
          switch(data.readUInt8(0)) {
            case 0:
            OJS.player.id = data.readUInt32LE(1);
            console.log(`[OWOP.js]: Got id: ${data.readUInt32LE(1)}`);
            break;
            case 1:
              // Get all cursors, tile updates, disconnects
              var shouldrender = 0;
              // Cursors
              var updated = false;
              var updates = {};
              for (var i = data.readUInt8(1); i--;) {
                updated = true;
                var pid = data.readUInt32LE(2 + i * 16, true);
                if (pid === OJS.id) {
                  continue;
                }
                var pmx = data.readUInt32LE(2 + i * 16 + 4, true);
                var pmy = data.readUInt32LE(2 + i * 16 + 8, true);
                var pr = data.readUInt8(2 + i * 16 + 12);
                var pg = data.readUInt8(2 + i * 16 + 13);
                var pb = data.readUInt8(2 + i * 16 + 14);
                var ptool = data.readUInt8(2 + i * 16 + 15);
                updates[pid] = {
                  x: pmx,
                  y: pmy,
                  rgb: [pr, pg, pb],
                  tool: OJS.options.tools[ptool]
                };
              }
              if (updated) {
                OJS.players[pid] = {
                x: updates[pid].x >> 4,
                y: updates[pid].y >> 4,
                rgb: updates[pid].rgb,
                tool: updates[pid].tool
              }
              }
              var off = 2 + data.readUInt8(1) * 16;
              break;
            case 4:
            console.log(`[OWOP.js]: Got rank ${data.readUInt8(1)}`)
            OJS.player.rank = data.readUInt8(1);
            break;
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
    };
    OJS.events = {
    onopen: function () {
        ws.onopen = function () {
        OJS.emit("open")
        };
      },
    onmessage: function () {
      ws.onmessage = function (data) {
      OJS.emit("message", data)
      }
    },
    onclose: function () {
      ws.onclose = function () {
      OJS.emit("close")
      }
    }
    }
    if(OJS.options.special == 1 && options.ws != undefined && options.origin != undefined) {
      var ws = new WebSocketClient(options.ws, undefined, {headers:{'Origin': `${options.origin}`}});
    } else if (OJS.options.special == 1) {
      console.error("[OWOP.js]: No links provided.");
      process.exit()
    } else {
      var ws = new WebSocketClient('ws://ourworldofpixels.com:443', undefined, {headers:{'Origin': 'https://ourworldofpixels.com'}});
    }
    {
      OJS.events.onopen();
      OJS.events.onmessage();
      OJS.events.onclose();
    };
  };
};

module.exports = {OJS}
