console.log('Bot.js loaded');

const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  Collection,
  ActivityType,
} = require("discord.js");
const { token, devToken } = require("./config.json");


const client = new Client({
  intents: [GatewayIntentBits.Guilds],

// TODO: Cycle through presences
  presence: {
    activities: [{name: "the rink.", type: ActivityType.Competing}],
    status: "online",
  },

});



// command handler with sub-folders
client.commands = new Collection();
const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
  const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js")); // Retrieve the cmd files inside subfolders

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`${command.data.name} is loaded`);
  }
}
const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));

// event handler
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token)