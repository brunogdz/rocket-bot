require("dotenv").config();
const { token } = process.env;
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  Collection,
} = require("discord.js");
const fs = require("fs");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const prefix = ">";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// client.on("ready", () => {
//   console.log("Bot is online");

//   client.user.setActivity(`Testing bot`, { type: "WATCHING" });
// });

// client.on("messageCreate", (message) => {
//   if (!message.content.startsWith(prefix) || message.author.bot) return;

//   const args = message.content.slice(prefix.length).split(/ +/);
//   // const argument = message.content.slice(prefix.length).split(/ +/)

//   const command = args.shift().toLowerCase();

//   // message array

//   const messageArray = message.content.split(" ");
//   const argument = messageArray.slice(1);
//   const cmd = messageArray[0];

//   if (command === "test") {
//     message.channel.send("Bot is working");
//   }
// });

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()],
});

client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();

client.login(token);
