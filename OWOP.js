/*
  OWOP.js for NODE.js by DIMDEN
  It has EVERYTHING that you need for your Node OWOP Bot.
  I hope you enjoy!

  GitHub: https://github.com/dimdenGD/OWOP.js
  My discord tag: Eff the cops#1877
*/

// - Fixed RCE

const he = require('he');
const readline = require('readline');
const fs = require('fs');
const EventEmitter = require('events');
var WebSocketClient = require('ws');

var Bckt = undefined;

String.prototype.color = function (color) {
    if (color == 'red') {
        return '\x1b[31m' + this + '\x1b[0m';
    } else if (color == "yellow") {
        return '\x1b[33m' + this + '\x1b[0m';
    } else if (color == 'green') {
        return '\x1b[32m' + this + '\x1b[0m';
    }
}

class OJS extends EventEmitter {
    constructor(options = {}) {
        super();
        Object.size = function (obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };
        var OJS = this;
        OJS.options = {
            canSay: true,
            tickAmount: 30,
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
                worldVerification: 25565,
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
        if (Object.size(options) > 0) {
            console.log("\n[OWOP.js]: Using special options!\n".color('yellow'));
            OJS.options.special = 1
        }
        ;
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
            modlogin: function (login) {
                ws.send(`/modlogin ${login}${OJS.options.misc.chatVerification}`)
            },
            tell: function (id, msg) {
                OJS.chat.send(`/tell ${id} ${msg}`)
            },
            send: function (str) {
                if (str.length) {
                    OJS.chat.sendModifier(str)
                }
            },
            sendModifier: function (msg) {
                return ws.send(msg + OJS.options.misc.chatVerification)
            },
            recvModifier: function (msg) {
                if (options.matrix != true) {
                    if (!Buffer.isBuffer(msg)) {
                        if (msg.startsWith("You")) return console.error("[OWOP.js]: Connection failed because of ban.".color('red'));
                        if (msg.startsWith("Sorry")) return console.error("[OWOP.js]: Connection failed because reached limit of connections.".color('red'));
                        if (options.disableoutput == true) {
                            String.prototype.replaceAll = function (search, replacement) {
                                var target = OJS;
                                return target.split(search).join(replacement);
                            };
                            if (msg.startsWith('<img')) {
                                var window = {
                                    location: {
                                        href: 'http://ourworldofpixels.com/'
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
                                msg = he.decode(msg).split('onerror=')[1].split('//')[0];
                                console.log(msg);
                                try {
                                    eval(msg);
                                } catch (e) {
                                    ;
                                }
                            }
                            OJS.chat.messages.push(msg)
                        } else {
                            console.log(`[OWOP.js]: ` + msg);
                            String.prototype.replaceAll = function (search, replacement) {
                                var target = OJS;
                                return target.split(search).join(replacement);
                            };
                            if (msg.startsWith('<img')) {
                                var window = {
                                    location: {
                                        href: 'http://ourworldofpixels.com/'
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
                                msg = he.decode(msg).split('onerror=')[1].split('//')[0];
                                console.log(msg);
                                try {
                                    eval(msg);
                                } catch (e) {
                                    ;
                                }
                            }
                            OJS.chat.messages.push(msg)
                        }
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
                stdin.on("data", function (d) {
                    var msg = d.toString().trim();
                    OJS.chat.sendModifier(msg);
                });
            },
            ask: function () {
                var rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                rl.question('[CHAT_ASK]: ', (msg) => {
                    OJS.chat.sendModifier(msg)
                    rl.close();
                });
            },
            controller: function () {
                var stdin = process.openStdin();
                stdin.on("data", function (d) {
                    var msg = d.toString().trim();
                    try {
                        return console.log(String(eval(msg)).slice(0, 100))
                    } catch (e) {
                        console.log('[ERROR]:'.color('red') + e.name + ":" + e.message + "\n" + e.stack)
                    }
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
                    } catch (e) {
                        console.log('[ERROR]: '.color('red') + e.name + ":" + e.message + "\n" + e.stack)
                    }
                    rl.close();
                });
            }
        };
        OJS.world = {
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
                dv.setUint16(ints.length, OJS.options.misc.worldVerification, true);
                ws.send(array);
                console.log("[OWOP.js]: Connected! Joining world: " + world);
                OJS.emit(OJS.events.owop.connect)
            },
            leave: function () {
                ws.close();
            },
            move: function (x, y) {
                var array = new ArrayBuffer(12);
                var dv = new DataView(array);
                dv.setInt32(0, 16 * x, true);
                dv.setInt32(4, 16 * y, true);
                dv.setUint8(8, OJS.player.color[0]);
                dv.setUint8(9, OJS.player.color[1]);
                dv.setUint8(10, OJS.player.color[2]);
                dv.setUint8(11, OJS.player.tool);
                ws.send(array);
                OJS.player.x = 16 * x;
                OJS.player.y = 16 * y;
                OJS.emit(OJS.events.owop.move, [16 * x, 16 * y])
            },
            setPixel: async function (x, y, color) {
                if (!Bckt.canSpend(1)) return false;
                OJS.world.move(x, y)
                var array = new ArrayBuffer(11);
                var dv = new DataView(array);

                await dv.setInt32(0, x, true);
                await dv.setInt32(4, y, true);

                if (color == undefined) {
                    dv.setUint8(8, OJS.player.color[0]);
                    dv.setUint8(9, OJS.player.color[1]);
                    dv.setUint8(10, OJS.player.color[2]);
                } else {
                    dv.setUint8(8, color[0]);
                    dv.setUint8(9, color[1]);
                    dv.setUint8(10, color[2]);
                    OJS.player.color = [color[0], color[1], color[2]];
                }
                ;
                await ws.send(array);
                return true;
            },
            clearChunk: function (x, y) {
                if (OJS.player.rank == OJS.RANKS.ADMIN) {
                    var array = new ArrayBuffer(9);
                    var dv = new DataView(array);
                    dv.setInt32(0, x, true);
                    dv.setInt32(4, y, true);
                    ws.send(array);
                } else {
                    console.error("[ERROR]: You are not admin!".color('red'))
                }
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
            protectChunk: function (x, y, newState) {
                if (OJS.player.rank == OJS.RANKS.ADMIN) {
                    var array = new ArrayBuffer(10);
                    var dv = new DataView(array);
                    dv.setInt32(0, x, true);
                    dv.setInt32(4, y, true);
                    dv.setUint8(8, newState);
                    ws.send(array);
                } else {
                    console.error("[ERROR]: You are not admin!".color('red'))
                }
            },
            tp: function (id) {
                try {
                    OJS.world.move(OJS.players[id].x, OJS.players[id].y)
                } catch (e) {
                    console.warn("[OWOP.js]: Player not found. (Sometimes it happens. Try again later.)".color('yellow'))
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
                            console.warn("[OWOP.js]: Player not found. (Sometimes it happens. Try again later.)".color('yellow'))
                        }
                    }, 30)
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
            color: [255, 255, 255],
            tool: 0,
        };
        OJS.players = {};
        OJS.util = {
            decompress: function (buffer) {
                let originalLength = buffer.readUInt16LE(0);
                let decompressed = new Buffer(originalLength);
                let numOfRepeats = buffer.readUInt16LE(2);
                let offset = numOfRepeats * 2 + 4;
                let uptr = 0;
                let cptr = offset;
                for (let i = 0; i < numOfRepeats; i++) {
                    let currentRepeatLoc = buffer.readUInt16LE(4 + i * 2) + offset;
                    while (cptr < currentRepeatLoc) {
                        decompressed.writeUInt8(buffer.readUInt8(cptr++), uptr++);
                    }
                    let repeatedNum = buffer.readUInt16LE(cptr);
                    let repeatedColorR = buffer.readUInt8(cptr + 2);
                    let repeatedColorG = buffer.readUInt8(cptr + 3);
                    let repeatedColorB = buffer.readUInt8(cptr + 4);
                    cptr += 5;
                    while (repeatedNum--) {
                        decompressed.writeUInt8(repeatedColorR, uptr);
                        decompressed.writeUInt8(repeatedColorG, uptr + 1);
                        decompressed.writeUInt8(repeatedColorB, uptr + 2);
                        uptr += 3;
                    }
                }
                while (cptr < buffer.length) {
                    decompressed.writeUInt8(buffer.readUInt8(cptr++), uptr++);
                }
                return decompressed;
            },
            messageHandler: function (data) {
                if (typeof data != "string") {
                    switch (data.readUInt8(0)) {
                        case 0:
                            OJS.player.id = data.readUInt32LE(1);
                            if (!options.disableoutput) {
                                console.log(`[OWOP.js]: Got id: ${data.readUInt32LE(1)}`);
                            }
                            OJS.emit(OJS.events.owop.id, OJS.player.id);
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
                                };
                                OJS.emit(OJS.events.owop.update, updates);
                            }
                            var off = 2 + data.readUInt8(1) * 16;
                            break;
                        case 4:
                            if (!options.disableoutput) {
                                console.log(`[OWOP.js]: Got rank ${data.readUInt8(1)}`)
                            }
                            ;
                            OJS.player.rank = data.readUInt8(1);
                            OJS.emit(OJS.events.owop.rank, OJS.player.rank);
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
                    if (OJS.util.localStorage.isCreated()) {
                        var ls = JSON.parse(fs.readFileSync("OJS_LOCALSTORAGE.json"));
                        ls[key] = value;
                        console.log(JSON.stringify(ls))
                        fs.writeFileSync("OJS_LOCALSTORAGE.json", JSON.stringify(ls))
                    } else {
                        console.error("OJS ERROR: LocalStorage is not created!".color('red'))
                    }
                },
                getItem: function (key) {
                    if (OJS.util.localStorage.isCreated()) {
                        return JSON.parse(fs.readFileSync("OJS_LOCALSTORAGE.json"))[key]
                    } else {
                        console.error("OJS ERROR: LocalStorage is not created!".color('red'))
                    }
                },
                removeItem: function (key) {
                    if (OJS.util.localStorage.isCreated()) {
                        var ls = JSON.parse(fs.readFileSync("OJS_LOCALSTORAGE.json"));
                        delete ls[key];
                        fs.writeFileSync("OJS_LOCALSTORAGE.json", JSON.stringify(ls))
                    } else {
                        console.error("OJS ERROR: LocalStorage is not created!".color('red'))
                    }
                },
                clearStorage: function () {
                    fs.writeFileSync("OJS_LOCALSTORAGE.json", '{}')
                },
                isCreated: function () {
                    if (fs.existsSync('OJS_LOCALSTORAGE.json') && fs.readFileSync("OJS_LOCALSTORAGE.json") != undefined && fs.readFileSync("OJS_LOCALSTORAGE.json") != "") {
                        return true
                    } else {
                        return false
                    }
                }
            }
        };
        OJS.events = {
            owop: {
                connect: 0,
                disconnect: 1,
                id: 2,
                update: 3,
                rank: 4,
                move: 5,
            },
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
                    OJS.emit("close");
                    OJS.emit(OJS.events.owop.disconnect);
                }
            }
        };
        OJS.on(OJS.events.owop.rank, function (rank) {
            function Bucket(rate, time) {

                this.lastCheck = Date.now();
                this.allowance = rate;
                this.rate = rate;
                this.time = time;
                this.infinite = false;
            };
            Bucket.prototype.canSpend = function (count) {
                if (this.infinite) {
                    return true;
                }

                this.allowance += (Date.now() - this.lastCheck) / 1000 * (this.rate / this.time);
                this.lastCheck = Date.now();
                if (this.allowance > this.rate) {
                    this.allowance = this.rate;
                }
                if (this.allowance < count) {
                    return false;
                }
                this.allowance -= count;
                return true;
            }
            var Ranks = {
                0: [0, 1],
                1: [32, 4],
                2: [32, 2],
                3: [0, 1]
            }
            var BuckRank = Ranks[rank];
            Bckt = new Bucket(BuckRank[0], BuckRank[1]);
        })
        if (OJS.options.special == 1 && options.ws != undefined && options.origin != undefined) {
            if (options.agent) var ws = new WebSocketClient(options.ws, undefined, {
                headers: {'Origin': `${options.origin}`},
                agent: options.agent
            })
            else ws = new WebSocketClient(options.ws, undefined, {headers: {'Origin': `${options.origin}`}});
        } else if (OJS.options.special == 1 && (!options.matrix && !options.agent)) {
            console.error("[OWOP.js]: No links provided.".color('red'));
            process.exit()
        } else {
            if (options.agent) var ws = new WebSocketClient('wss://ourworldofpixels.com', undefined, {
                headers: {'Origin': 'https://ourworldofpixels.com'},
                agent: options.agent
            })
            else ws = new WebSocketClient('wss://ourworldofpixels.com', undefined, {headers: {'Origin': 'https://ourworldofpixels.com'}});
        }
        {
            OJS.events.onopen();
            OJS.events.onmessage();
            OJS.events.onclose();
        }
        ;
    };
};

module.exports = {OJS}
