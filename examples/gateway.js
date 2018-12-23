const Discord = require('discord.js');
var OwopJS = require('owop-js');
var OJS = new OwopJS.OJS({ws: 'wss://cowop.herokuapp.com', origin: 'https://dimden.tk/'});
const bot = new Discord.Client();

// Variables

const GuildId = "YOUR_SERVER_ID";
const ChannelId = "GATEWAY_CHANNEL_ID";
const AdminRole = "YOUR_ADMIN_ROLE";
const BotToken = "BOT_TOKEN";
const AdminLogin = "ADMIN_LOGIN" // if you have

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
    await OJS.chat.adminlogin(AdminLogin);
    setInterval(async function () {
       await OJS.chat.adminlogin(AdminLogin); // For not sleepy dinos.
    },8000);
    // > COMMENT THIS CODE IF YOUR OWOP IS NOT ON HEROKU, AND YOU ARE NOT ADMIN
  });
  OJS.on("message", function (data) {
    OJS.chat.recvModifier(data.data)
    OJS.util.messageHandler(data.data);
    if(!Buffer.isBuffer(data.data) && !data.data.startsWith('You are') && !data.data.startsWith('FAIL') && !data.data.startsWith('<') && !data.data.startsWith('Connected!') && !data.data.startsWith('[D]') && !data.data.startsWith('Got') && !data.data.startsWith('DEV') && !data.data.startsWith('Nickname') && !data.data.startsWith('Server')) {
  bot.guilds.get(GuildId).channels.get(ChannelId).send(data.data)
  };
  });
  OJS.on("close", function () {
    console.log('[OWOP.js]: Disconnected.')
  });

setTimeout(function () {
  bot.on("message", async (message) => {
    if(message.channel.id == ChannelId) {
      message.content = message.content.replace(/<@([0-9]+)>/g, "i'm gay");
      if (message.author.bot) return;
      if (message.channel.type === "dm") return;
      if(message.content.includes('<') && message.content.includes('onerror=') message.content.includes('>')) return;

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
},3000)


bot.login(BotToken);
