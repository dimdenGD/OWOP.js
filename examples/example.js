// EXAMPLE FILE

var OwopJS = require('owop-js');
var OJS = new OwopJS.OJS();

OJS.on("open", async function () {
  await OJS.world.join('main');
  await OJS.chat.nick('dimden')
  await OJS.interact.controller();
});
OJS.on("message", function (data) {
  OJS.chat.recvModifier(data.data)
  OJS.util.messageHandler(data.data);
});
OJS.on("close", function () {
  console.log('[OWOP.js]: Disconnected.')
  process.exit();
});
