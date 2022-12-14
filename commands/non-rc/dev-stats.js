const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-stats')
        .setDescription('Displays stats about the bot. (Developer only)')
        .setDMPermission(false)
    ,
    async execute(interaction) {

        await interaction.deferReply()

        if(interaction.user.id === "355051285621243905" || interaction.channel.id === "1049411581156544532") {
            let userCount = 0
            interaction.client.guilds.cache.forEach(guild => {
                userCount += guild.memberCount
            })

            let guildCount = 0
            interaction.client.guilds.cache.forEach(guild => {
                guildCount++
            })

            let guildNames = []
            interaction.client.guilds.cache.forEach(guild => {
                guildNames.push(guild.name)
            })

            // format the results with each server name on a new line, with replacing the comma with a new line
            const guildNamesFormatted = guildNames.join('\n')







// construct a embed
            const answerembed = new EmbedBuilder()
                .setTitle('Bot stats')
                .setDescription('Here are some stats about the bot.')
                .setColor(0x00ff00)
                .setTimestamp()
                .addFields(
                    {name: 'Servers', value: guildCount.toString(), inline: true},
                    {name: 'Users', value: userCount.toString(), inline: true},
                    {name: 'Servers', value: guildNamesFormatted, inline: false}
                )

            await interaction.editReply({embeds: [answerembed]})

        } else {
            await interaction.editReply({content: 'You are not allowed to use this command.', ephemeral: true})
        }



    }
}