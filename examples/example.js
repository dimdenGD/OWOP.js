// EXAMPLE FILE

var OwopJS = require('owop-js');
var OJS = new OwopJS.OJS();

OJS.on("open", function () {
  OJS.world.join('main');
  OJS.chat.nick('dimden')
  OJS.interact.controller();
});
OJS.on("message", function (data) {
  OJS.chat.recvModifier(data.data)
  OJS.util.messageHandler(data.data);
});
OJS.on("close", function () {
  console.log('[OWOP.js]: Disconnected.')
  process.exit();
});
