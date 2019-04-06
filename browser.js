/*!
 * EventEmitter v5.2.6 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - https://oli.me.uk/
 * @preserve
 */

;(function (exports) {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    function isValidListener (listener) {
        if (typeof listener === 'function' || listener instanceof RegExp) {
            return true
        } else if (listener && typeof listener === 'object') {
            return isValidListener(listener.listener)
        } else {
            return false
        }
    }

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        if (!isValidListener(listener)) {
            throw new TypeError('listener must be a function');
        }

        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the first argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the first argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listenersMap = this.getListenersAsObject(evt);
        var listeners;
        var listener;
        var i;
        var key;
        var response;

        for (key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);

                for (i = 0; i < listeners.length; i++) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}(typeof window !== 'undefined' ? window : this || {}));

/*
  OWOP.js for browser by DIMDEN
  It has EVERYTHING that you need for your Node OWOP Bot.
  I hope you enjoy!

  GitHub: https://github.com/dimdenGD/OWOP.js
  My discord tag: Eff the cops#1877
*/

function Bucket(rate, time) {

    this.lastCheck = Date.now();
    this.allowance = rate;
    this.rate = rate;
    this.time = time;
    this.infinite = false;
}
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
};

var OJS = class extends EventEmitter {
    //  Options: "no_log", "ws", "origin", "agent", "index"
    constructor(options = {}) {
        super();

        let init = {};

        if(!options.ws) options.ws = "wss://ourworldofpixels.com";

        if(options.origin) init.origin = options.origin;
        if(options.agent) init.agent = options.agent;
        if(!options.index) options.index = "";

        const OJS = this;

        this.ws = new WebSocket(options.ws, null, init);
        this.ws.binaryType = 'arraybuffer';
        this.RANKS = {
            ADMIN: 3,
            MOD: 2,
            USER: 1,
            NONE: 0
        };
        this.options = {
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
            captchaState: {
                CA_WAITING: 0,
                CA_VERIFYING: 1,
                CA_VERIFIED: 2,
                CA_OK: 3,
                CA_INVALID: 4
            },
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
                setId: 0,
                worldUpdate: 1,
                chunkLoad: 2,
                teleport: 3,
                setRank: 4,
                captcha: 5,
                setPQuota: 6,
                chunkProtected: 7
            }
        };
        this.chat = {
            recvModifier: msg => msg,
            sendModifier: msg => msg,
            send: msg => OJS.ws.send(OJS.chat.sendModifier(msg) + OJS.options.misc.chatVerification),
            firstdata: () => OJS.chat.history[0],
            lastdata: () => OJS.chat.history[OJS.chat.history.length-1],
            history: []
        };
        this.world = {
            join: (world = "main") => {
                if(OJS.ws.readyState !== 1) OJS.ws = new WebSocket(options.ws, init);
                let ints = [];
                world = world.toLowerCase();

                for (let i = 0; i < world.length && i < 24; i++) {
                    let charCode = world.charCodeAt(i);
                    if ((charCode < 123 && charCode > 96) || (charCode < 58 && charCode > 47) || charCode === 95 || charCode === 46) {
                        ints.push(charCode);
                    }
                }
                let array = new ArrayBuffer(ints.length + 2);
                let dv = new DataView(array);
                for (let i = ints.length; i--;) {
                    dv.setUint8(i, ints[i]);
                }
                dv.setUint16(ints.length, 4321, true);
                OJS.ws.send(array);
                OJS.utils.log("Joining world: " + world);
                OJS.emit(OJS.events.CONNECT);
                OJS.world.name = world;
                return true;
            },
            leave: () => {OJS.ws.close()},
            move: (x, y) => {
                let array = new ArrayBuffer(12);
                let dv = new DataView(array);

                dv.setInt32(0, 16 * x, true);
                dv.setInt32(4, 16 * y, true);
                dv.setUint8(8, OJS.player.color[0]);
                dv.setUint8(9, OJS.player.color[1]);
                dv.setUint8(10, OJS.player.color[2]);
                dv.setUint8(11, OJS.player.tool);
                OJS.ws.send(array);
                OJS.player.x = 16 * x;
                OJS.player.y = 16 * y;
            },
            setPixel: async function (x = OJS.player.x, y = OJS.player.y, color = OJS.player.color) {
                OJS.world.move(x, y);
                if (!OJS.utils.bucket.canSpend(1)) return false;
                let array = new ArrayBuffer(11);
                let dv = new DataView(array);

                dv.setInt32(0, x, true);
                dv.setInt32(4, y, true);
                dv.setUint8(8, color[0]);
                dv.setUint8(9, color[1]);
                dv.setUint8(10, color[2]);
                OJS.player.color = [color[0], color[1], color[2]];

                OJS.ws.send(array);
                return true;
            },
            clearChunk: (x = OJS.player.x, y = OJS.player.y) => {
                if (OJS.player.rank >= OJS.RANKS.MOD) {
                    let array = new ArrayBuffer(9);
                    let dv = new DataView(array);
                    dv.setInt32(0, x, true);
                    dv.setInt32(4, y, true);
                    OJS.ws.send(array);
                    return true;
                } else {
                    console.error("[ERROR]: You are not admin!");
                    return false
                }
            },
            setColor: function (rgb) {
                if (typeof rgb !== "object") return OJS.utils.log(`Please use array.`);
                let array = new ArrayBuffer(12);
                let dv = new DataView(array);
                dv.setInt32(0, OJS.player.x, true);
                dv.setInt32(4, OJS.player.y, true);
                dv.setUint8(8, rgb[0]);
                dv.setUint8(9, rgb[1]);
                dv.setUint8(10, rgb[2]);
                dv.setUint8(11, OJS.player.tool);
                OJS.ws.send(array);
                OJS.player.color = [rgb[0], rgb[1], rgb[2]];
            },
            setTool: function (toolId) {
                let array = new ArrayBuffer(12);
                let dv = new DataView(array);
                dv.setInt32(0, OJS.player.x, true);
                dv.setInt32(4, OJS.player.y, true);
                dv.setUint8(8, OJS.player.color[0]);
                dv.setUint8(9, OJS.player.color[1]);
                dv.setUint8(10, OJS.player.color[2]);
                dv.setUint8(11, toolId);
                OJS.ws.send(array);
                OJS.player.tool = toolId;
            },
            protectChunk: function (x, y, newState) {
                if (OJS.player.rank >= OJS.RANKS.MOD) {
                    let array = new ArrayBuffer(10);
                    let dv = new DataView(array);
                    dv.setInt32(0, x, true);
                    dv.setInt32(4, y, true);
                    dv.setUint8(8, newState);
                    OJS.ws.send(array);
                } else {
                    console.error("[ERROR]: No permission.")
                }
            },
            getPixel: OWOP.world.getPixel,
            name: null
        };
        this.player = {
            id: 0,
            rank: 1,
            x: 0,
            y: 0,
            color: [0, 0, 0],
            tool: 1
        };
        this.players = {};
        this.utils = {
            bucket: new Bucket(32, 4),
            log: msg => {if (options.no_log) console.log(`${options.index ? `[${options.index}] ` : ""}` + `[OWOP.js]: ${msg}`)},
            dataHandler: data => {
                if(typeof data !== "object") return;
                let op = OJS.options.opCode;
                data = new DataView(data);

                switch (data.getUint8(0)) {
                    case op.setId:
                        OJS.player.id = data.getUint32(1);
                        OJS.utils.log(`Joined world ${OJS.world.name}, your ID is: ${data.getUint32(1)}.`);
                        OJS.emit(OJS.events.ID, OJS.player.id);
                        break;
                    case op.worldUpdate:
                        let updated = false;
                        let updates = {};
                        for (let i = data.getUint8(1); i--;) {
                            updated = true;
                            let pid = data.getUint32(2 + i * 16);
                            let pmx = data.getUint32(2 + i * 16 + 4);
                            let pmy = data.getUint32(2 + i * 16 + 8);
                            let pr = data.getUint8(2 + i * 16 + 12);
                            let pg = data.getUint8(2 + i * 16 + 13);
                            let pb = data.getUint8(2 + i * 16 + 14);
                            let ptool = data.getUint8(2 + i * 16 + 15);
                            updates[pid] = {
                                x: pmx,
                                y: pmy,
                                rgb: [pr, pg, pb],
                                tool: OJS.options.tools[ptool]
                            };
                            OJS.players[pid] = {
                                x: updates[pid].x >> 4,
                                y: updates[pid].y >> 4,
                                rgb: updates[pid].rgb,
                                tool: updates[pid].tool
                            };
                        }
                        if (updated) OJS.emit(OJS.events.UPDATE, updates);
                        break;
                    case op.setRank:
                        OJS.utils.log(`Got rank ${data.getUint8(1)}`);
                        OJS.player.rank = data.getUint8(1);
                        OJS.emit(OJS.events.RANK, OJS.player.rank);
                        break;
                    case op.captcha:
                        if(data.getUint8(1)  !== OJS.options.captchaState.CA_WAITING) return;
                        OJS.utils.log(`Got captcha request.`);
                        OJS.emit(OJS.events.CAPTCHA);
                        break;
                    case op.teleport:
                        let x = data.getInt32(1, !0),
                            y = data.getInt32(5, !0);
                        OJS.emit(OJS.events.TELEPORT, x, y);
                        break;
                    case op.setPQuota:
                        let rate = data.getUint16(1, !0),
                            time = data.getUint16(3, !0);
                        OJS.utils.bucket = new Bucket(rate, time);
                        OJS.emit(OJS.events.PQUOTA, rate, time);
                        OJS.utils.log(`Got new PQuota: ${rate}x${time}.`);
                        break;
                }
            }
        };
        this.events = {
            CONNECT: 0,
            data: 1,
            ID: 2,
            RANK: 3,
            DISCONNECT: 4,
            UPDATE: 5,
            TELEPORT: 6,
            CAPTCHA: 7,
            PQUOTA: 8,
            CHUNK: 9
        };

        this.ws.onopen = () => {this.emit("open")};
        this.ws.onmessage = msg => {
            OJS.utils.dataHandler(msg.data);
            if(typeof msg.data !== "string") return;
            if(msg.data.startsWith('<')) return;
            console.log(`[OWOP.js]: `+OJS.chat.recvModifier(msg.data));
            this.emit("data", OJS.chat.recvModifier(msg.data));
        };
        this.ws.onclose = () => {
            console.log(`[OWOP.js]: Disconnected.`);
            this.emit("close")
        };
    };
};