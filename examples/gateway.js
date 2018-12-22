const Discord = require('discord.js');
var OwopJS = require('owop-js');
var OJS = new OwopJS.OJS({ws: 'wss://cowop.herokuapp.com', origin: 'https://dimden.tk/'});
const bot = new Discord.Client();

// Variables

const GuildId = "YOUR_GUILD_ID";
const ChannelId = "YOUR_GATEWAY_CHANNEL_ID";
const AdminRole = "ADMIN_ROLE_NAME";
const BotToken = "YOUR_BOT_TOKEN";

bot.on("ready", async () => {
    console.log(`\n\x1b[46m`, `${bot.user.username} is online on ${bot.guilds.size} servers!\x1b[0m`);
    bot.user.setActivity("https://dimden.tk/cowop", {
        type: "PLAYING"
    });
  });

  OJS.on("open", async function () {
    await OJS.world.join('main');
    await OJS.chat.nick('Gateway');
    await OJS.world.move(666666666, 66666666);
    await OJS.interact.controller();
    // < COMMENT THIS CODE IF YOUR OWOP IS NOT ON HEROKU, AND YOU ARE NOT ADMIN
    OJS.chat.adminlogin('lolno');
    setInterval(function () {
       OJS.chat.adminlogin('lolno'); // For not sleepy dinos.
    },10000);
    // > COMMENT THIS CODE IF YOUR OWOP IS NOT ON HEROKU, AND YOU ARE NOT ADMIN
  });
  OJS.on("message", function (data) {
    OJS.chat.recvModifier(data.data)
    OJS.util.messageHandler(data.data);
    if(!Buffer.isBuffer(data.data) && !data.data.startsWith('<') && !data.data.startsWith('Connected!') && !data.data.startsWith('[D]') && !data.data.startsWith('Got') && !data.data.startsWith('Nickname') && !data.data.startsWith('Server')) {
  bot.guilds.get(GuildId).channels.get(ChannelId).send(data.data)
  };
  });
  OJS.on("close", function () {
    console.log('[OWOP.js]: Disconnected.')
  });

bot.on("message", async (message) => {
  if(message.channel.id == ChannelId) {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  OJS.chat.send(`/sayraw [D] ${message.author.username}: ${message.content}`);
} else if(message.content.startsWith('!OJS')) {
if(message.member.roles.find("name", AdminRole)) {
  try {
  eval(message.content.slice(1));
  message.reply('Success!');
} catch(e) {
  message.reply('Error.');
}
} else {message.reply('You are not admin!')};
}
});

bot.login(BotToken);
