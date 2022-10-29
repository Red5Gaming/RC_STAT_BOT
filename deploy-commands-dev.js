const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { devClientId, devGuildId, devToken } = require("./config.json");
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

const rest = new REST({ version: "9" }).setToken(devToken);

// Only guild commands for testing on the dev bot. 
rest.put(Routes.applicationGuildCommands(devClientId, devGuildId), {body: commands})
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
