const { REST, Routes } = require('discord.js');
const { clientId, guildId, token, devClientId, devGuildId, devToken } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

// ...

// for guild-based commands.
// rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1035975368378699786'))
//     .then(() => console.log('Successfully deleted guild command'))
//     .catch(console.error);


// for global commands
rest.delete(Routes.applicationCommand(clientId, '1035968418702164109'))
    .then(() => console.log('Successfully deleted application command'))
    .catch(console.error);