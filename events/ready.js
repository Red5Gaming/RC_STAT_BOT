module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        let totalMembers = 0;

        client.guilds.cache.forEach((guild) => {

            // console.log(guild.name);
            // log the guilds name, spot in the array  and user count
            console.log(` - ${guild.name} | Member count: ${guild.memberCount}`);

            totalMembers += guild.memberCount;

        });

        console.log("- Total guilds: " + client.guilds.cache.size);
        console.log("- Total members: " + totalMembers);


    }
}