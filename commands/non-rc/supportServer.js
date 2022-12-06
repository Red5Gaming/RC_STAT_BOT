const {SlashCommandBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder} = require('discord.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Sends the link to the official RC Stat bot support server.')
        .setDMPermission(false)
    ,
    async execute(interaction) {

        // await interaction.deferReply()

        const answerembed = new EmbedBuilder()
            .setTitle('Support server')
            .setDescription('You can join the official RC Stat bot support server by clicking the button below.')
            .setColor(0x00ff00)
            .setTimestamp()
            .setColor('FF1653')

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/rmy7Vm4pbC')
                    .setLabel('Join the support server')
            )




         await interaction.reply({embeds: [answerembed], components: [button], ephemeral: true})




    }
}