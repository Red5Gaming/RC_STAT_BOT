const {SlashCommandBuilder, EmbedBuilder, Embed, ButtonStyle, PermissionFlagsBits} = require('discord.js');

const {QuickDB} = require("quick.db");
const db = new QuickDB();
const configDB = db.table("configDB")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-stat-channel')
        .setDescription('Limits the stat command to specific channels.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to limit the stat command to.').setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    async execute(interaction) {

        let answerembed = new EmbedBuilder()
            .setTitle('Stat channel set.')
            .setDescription('The stat command is now limited to the channel you specified.')
            .setColor(0x00ff00)
            .setTimestamp()

        let server = interaction.guildId + "_config.statChannel"
        let channels = await configDB.get(server)

// check if the server is in the db, if not, set it its property to 'statChannel' which is an array. If it is, get the array and push the channel id to it. If the server already has the channel, tell the user that it is already set.
        if (await configDB.get(server) === undefined) { // case if the server is not in the db
            await configDB.set(server, [interaction.options.getChannel('channel').id])

        } else if (await configDB.get(server) !== undefined && channels.includes(interaction.options.getChannel('channel').id)) { // case if the server is in the db and the channel is already set
            answerembed.setTitle('Stat channel already set.')
            answerembed.setDescription('The stat command is already limited to the channel you specified.')
            answerembed.setColor(0xff0000)
        } else { // case if the server is in the db and the channel is not set
            await configDB.push(server, interaction.options.getChannel('channel').id)
        }
        await interaction.reply({embeds: [answerembed], ephemeral: true})

    },
}