// https://discord.com/api/oauth2/authorize?client_id=1032693370348371979&permissions=274878172224&scope=bot%20applications.commands

const fs = require('fs');
const {Client, GatewayIntentBits, Partials, Collection} = require('discord.js');
const {token, guildId} = require('./config.json');



const client = new Client({ intents: [GatewayIntentBits.Guilds] });


client.commands = new Collection();
const commandFolders = fs.readdirSync('./commands'); // Name this as yours Command Folder name

for (const folder of commandFolders) // this loop will retrieve all subfolders
{

    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js')); // Retrieve the cmd files inside subfolders

    for (const file of commandFiles) // this loop will retrieve all command files
    {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command) // i use client. idk if you using bot or this.
        // console.log(`${command.data.name} is loaded`)
    }

}


//Event File constante, gibt liste mit allen commands eg. ["ready.js", "interactionCreate.js"]
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))

//geht über die Liste
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        //      ↓   wenn setting once:true führt es nur einmal aus
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        //     ↓   wenn setting once:false führt es dauerhaft (?) aus
        client.on(event.name, (...args) => event.execute(...args))
    }
}



//login mit dem token, obviously, duh
client.login(token);