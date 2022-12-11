const fs = require("fs");


module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);



let allusers = 0;
        client.shard
            .broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
            .then(results => {
                return console.log(`- Total member count: ${results.reduce((acc, memberCount) => acc + memberCount, 0)}`);

            })
            .catch(console.error);

        let toalGuilds = 0;
        client.shard
            .broadcastEval(c => c.guilds.cache.size)
            .then(results => {
                 console.log(`- Total guild count: ${results.reduce((acc, guildCount) => acc + guildCount, 0)}`)

            })

// get the names of all servers
        client.shard
            .broadcastEval(c => c.guilds.cache.map(g => g.name))
            .then(results => {
                // format the results with each server name on a new line, with replacing the comma with a new line and a - in front of it
                return console.log(`- ${results.map(r => r.join('\n- '))}`);
            })







    }
}