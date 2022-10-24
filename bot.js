// https://discord.com/api/oauth2/authorize?client_id=1032693370348371979&permissions=274878172224&scope=bot%20applications.commands

const fs = require('fs');
const {Client, GatewayIntentBits, Partials, Collection} = require('discord.js');
const {token, guildId} = require('./config.json');


const client = new Client({intents: [GatewayIntentBits.Guilds]});

// command handler with sub-folders
client.commands = new Collection();
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders)
{

    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js')); // Retrieve the cmd files inside subfolders

    for (const file of commandFiles)
    {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command)
        console.log(`${command.data.name} is loaded`)
    }

}
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))

// event handler
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}



client.login(token);