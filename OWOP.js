// OWOP.js LIBRARY
console.log("Using OJS library. More info at https://github.com/dimdenGD/OWOP.js/");
var OJS = {
  /* PLAYER */
player: {
  id: function() {
    return OWOP.player.id;
  },
  name: function() {
    return localStorage.getItem("nick");
  },
  rank: function() {
    return OWOP.player.rank;
  },
  tool: function() {
    return OWOP.player.tool.id;
  },
  color: function() {
    return OWOP.player.selectedColor;
  },
  pallete: function() {
    return OWOP.player.pallete;
  },
},

rank: {
  get: {
  admin: function() {
    return OWOP.RANK.ADMIN;
  },
  mod: function() {
    return OWOP.RANK.MODERATOR;
  },
  user: function() {
    return OWOP.RANK.USER;
  },
  none: function() {
    return OWOP.RANK.NONE;
  }
},
  set: {
  admin: function(rank) {
    return OWOP.RANK.ADMIN = rank;
  },
  mod: function(rank) {
    return OWOP.RANK.MODERATOR = rank;
  },
  user: function(rank) {
    return OWOP.RANK.USER = rank;
  },
  none: function() {
    return OWOP.RANK.NONE = rank;
  }
}
},
window: {
  all: function() {
    return OWOP.windowSys.windows;
  },
  delete: function(window) {
    OWOP.windowSys.windows[`${window}`].close()
  }
},
chat: {
  lastMessageFull: function() {
    return document.getElementById("chat-messages").lastChild.innerText;
  },
  lastMessage: function() {
    return document.getElementById("chat-messages").lastChild.innerText.substring(document.getElementById("chat-messages").lastChild.innerText.indexOf(":") + 1).slice(1);
  },
  firstMessage: function() {
    return document.getElementById("chat-messages").firstChild.innerText;
  },
  sendMessage: function(msg) {
    return OWOP.chat.send(msg);
  },
  localMessage: function(msg) {
    return OWOP.chat.local(msg);
  },
  getSendMessage: function(code) {
    OWOP.chat.sendModifier = code;
  },
  clearChat: function () {
    OWOP.chat.clear();
  }
},
localStorage: localStorage,
world: {
  setPixel: function(x,y,color) {
    return OWOP.world.setPixel(x,y,color,0);
  },
  getPixel: function(x,y) {
  return OWOP.world.getPixel(x,y,0);
  },
  coordinates: {
  x: function () {
    return OWOP.mouse.x;
  },
  y: function () {
    return OWOP.mouse.y;
  },
  last_x: function () {
    return OWOP.mouse.lastX;
  },
  last_y: function () {
    return OWOP.mouse.lastY;
  },
  tile_x: function () {
    return OWOP.mouse.tileX;
  },
  tile_y: function () {
    return OWOP.mouse.tileY;
  },
  camera_x: function () {
    return OWOP.camera.x;
  },
  camera_y: function () {
    return OWOP.camera.y;
  }
}
},
options: {
  set: {
    defaultWorld: function (Name) {
      return OWOP.options.defaultWorld = Name;
    },
    defaultZoom: function (Value) {
      return OWOP.options.defaultZoom = Value;
    },
    sounds: function (TrueFalse) {
      return OWOP.options.enableSounds = TrueFalse;
    },
    maxChatMessages: function (Value) {
      return OWOP.options.maxChatBuffer = Value;
    },
    minGrid: function (Zoom) {
      return OWOP.options.minGridZoom = Zoom;
    },
    cameraSpeed: function (Speed) {
      return OWOP.options.movementSpeed = Speed;
    },
    toolsetURL: function (LinkOrFile) {
      return OWOP.options.toolSetUrl = LinkOrFile;
    },
    unloadDistance: function (Distance) {
      return OWOP.options.unloadDistance = Distance;
    },
    unloadedURL: function (LinkOrFile) {
      return OWOP.options.unloadedPatternUrl = LinkOrFile;
    },
    zoomMax: function (Value) {
      return OWOP.options.zoomLimitMax = Value;
    },
    zoomMin: function (Value) {
      return OWOP.options.zoomLimitMin = Value;
    },
  },
  get: {
    defaultWorld: function () {
      return OWOP.options.defaultWorld;
    },
    defaultZoom: function () {
      return OWOP.options.defaultZoom;
    },
    sounds: function () {
      return OWOP.options.enableSounds;
    },
    maxChatMessages: function () {
      return OWOP.options.maxChatBuffer;
    },
    minGrid: function () {
      return OWOP.options.minGridZoom;
    },
    cameraSpeed: function () {
      return OWOP.options.movementSpeed;
    },
    toolsetURL: function () {
      return OWOP.options.toolSetUrl;
    },
    unloadDistance: function () {
      return OWOP.options.unloadDistance;
    },
    unloadedURL: function () {
      return OWOP.options.unloadedPatternUrl;
    },
    zoomMax: function () {
      return OWOP.options.zoomLimitMax;
    },
    zoomMin: function () {
      return OWOP.options.zoomLimitMin;
    },
  },
}
}
