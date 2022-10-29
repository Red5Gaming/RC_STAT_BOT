const {SlashCommandBuilder, EmbedBuilder, Embed, ButtonStyle, PermissionFlagsBits} = require('discord.js');

const {QuickDB} = require("quick.db");
const db = new QuickDB();
const configDB = db.table("configDB")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('list-stat-channel')
        .setDescription('Removes a channel from the list.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    async execute(interaction) {

        let answerembed = new EmbedBuilder()
            .setTitle('Doing fancy stuff with data.')

        // if the server is in the db, get the array and send it to the user. If it is not or there is no channel set, tell the user that it is not set.
        if (await configDB.get(interaction.guildId + "_config.statChannel") === undefined) { // case if the server is not in the db
            answerembed.setTitle('Stat channel not set.')
            answerembed.setDescription('The stat command is not limited to any channel.')
            answerembed.setColor(0xff0000)
        } else { // case if the server is in the db and the channel is set
            let channels = await configDB.get(interaction.guildId + "_config.statChannel")
            let channelNames = []
            for (let i = 0; i < channels.length; i++) {
                channelNames.push(interaction.guild.channels.cache.get(channels[i]).id)
            }
            answerembed.setTitle('Stat channels set:')
            // add the channels to the description, format each one as <#id> and add a line break after each one
            let channelsDesc = []
            channelNames.forEach(channel => {
                channelsDesc.push(`<#${channel}>`)
            })

               answerembed.setDescription(channelsDesc.join('\n'))





            answerembed.setColor(0x00ff00)


            await interaction.reply({embeds: [answerembed], ephemeral: true})

        }
    }
}