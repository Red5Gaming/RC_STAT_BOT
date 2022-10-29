const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");
const { Collection } = require("discord.js");

const commands = [];
const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "9" }).setToken(token);


// Only global commands, test with deploy-commands-dev.js!
rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() =>
    console.log("Successfully registered global application commands.")
  )
  .catch(console.error);


