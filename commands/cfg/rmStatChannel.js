const {SlashCommandBuilder, EmbedBuilder, Embed, ButtonStyle, PermissionFlagsBits} = require('discord.js');

const {QuickDB} = require("quick.db");
const db = new QuickDB();
const configDB = db.table("configDB")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('rm-stat-channel')
        .setDescription('Removes a channel from the list.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to remove from the list.').setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    async execute(interaction) {

        let answerembed = new EmbedBuilder()
            .setTitle('Channel removed.')
            .setDescription('The stat command is now not limited to the channel you specified anymore.')
            .setColor(0x00ff00)
            .setTimestamp()

        let server = interaction.guildId + "_config.statChannel"
        let channels = await configDB.get(server)

// check if the channel is in the db, if not, tell the user that it is not set. If it is, get the array and remove the channel id from it.
        if (await configDB.get(server) === undefined) { // case if the server is not in the db
            answerembed.setTitle('Stat channel not set.')
            answerembed.setDescription('The stat command is not limited to any channel.')
            answerembed.setColor(0xff0000)
        } else if (await configDB.get(server) !== undefined && channels.includes(interaction.options.getChannel('channel').id)) { // case if the server is in the db and the channel is set
            await configDB.pull(server, interaction.options.getChannel('channel').id)
        } else { // case if the server is in the db and the channel is not set
            answerembed.setTitle('Stat channel not set.')
            answerembed.setDescription('The stat command is not limited to the channel you specified.')
            answerembed.setColor(0xff0000)
        }

        await interaction.reply({embeds: [answerembed], ephemeral: true})

    },
}