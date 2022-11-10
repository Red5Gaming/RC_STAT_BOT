const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        // client.user.setPresence({
        //     activities: [{ name: 'the rink.', type: ActivityType.Competing }],
        //     status: 'online',
        // })

        // console log all servers the bot is in
        client.guilds.cache.forEach((guild) => {

            console.log(guild.name);


        });




    }
}