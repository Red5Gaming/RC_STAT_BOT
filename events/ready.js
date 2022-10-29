const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setPresence({
            activities: [{ name: 'with Slash Commands', type: ActivityType.Playing }],
            status: 'online',
        })
    }
}