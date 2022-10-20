const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const {Collection} = require("discord.js");


const commands = [] // Discord.Collection();
const commandFolders = fs.readdirSync('./commands'); // Name this as yours Command Folder name

for (const folder of commandFolders) // this loop will retrieve all subfolders
{
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js')); // Retrieve the cmd files inside subfolders

    for (const file of commandFiles) // this loop will retrieve all command files
    {
        const command = require(`./commands/${folder}/${file}`);
        commands.push(command.data.toJSON())
    }
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);