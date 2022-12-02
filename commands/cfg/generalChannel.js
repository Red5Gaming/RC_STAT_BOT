const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');

const {QuickDB} = require("quick.db");
const db = new QuickDB();
const configDB = db.table("configDB")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('stat-channel')
        .setDescription('Limits the stat command to specific channels.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('Adds a channel to the list.')
            .addChannelOption(option => option.setName('channel').setDescription('The channel to add to the list.').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setDescription('Removes a channel from the list.')
            .addChannelOption(option => option.setName('channel').setDescription('The channel to remove from the list.').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('list')
            .setDescription('Lists all channels.')
        )
    ,
    async execute(interaction) {


        await interaction.deferReply()

        let server = interaction.guildId + "_config.statChannel"
        let channels = await configDB.get(server)

        let answerembed = new EmbedBuilder()
            .setTitle('Stat channel list')
            .setDescription('The stat command is limited to the following channels:')
            .setColor(0x00ff00)
            .setTimestamp()


        // check which subcommand was used
        if (interaction.options.getSubcommand() === 'add') {

            if (await configDB.get(server) === undefined) { // case if the server is not in the db
                await configDB.set(server, [interaction.options.getChannel('channel').id])
                answerembed.setTitle('Stat channel added')
                answerembed.setDescription('The stat command is now limited to the following channel:')
                answerembed.addFields({name: 'Channel', value: `<#${interaction.options.getChannel('channel').id}>`})
            } else if (await configDB.get(server) !== undefined && channels.includes(interaction.options.getChannel('channel').id)) { // case if the server is in the db and the channel is already set
                answerembed.setTitle('Stat channel already set.')
                answerembed.setDescription('The stat command is already limited to the channel you specified.')
                answerembed.setColor(0xff0000)
            } else { // case if the server is in the db and the channel is not set
                await configDB.push(server, interaction.options.getChannel('channel').id)
                answerembed.setTitle('Stat channel added')
                answerembed.setDescription('The stat command is now limited to the following channel:')
                answerembed.addFields({name: 'Channel', value: `<#${interaction.options.getChannel('channel').id}>`})
                answerembed.setColor(0x00ff00)
                answerembed.setTimestamp()
            }


        } else if (interaction.options.getSubcommand() === 'remove') {

            if (await configDB.get(server) === undefined) { // case if the server is not in the db
                answerembed.setTitle('Stat channel not set.')
                answerembed.setDescription('The stat command is not limited to any channel.')
                answerembed.setColor(0xff0000)

            } else if (await configDB.get(server) !== undefined && channels.includes(interaction.options.getChannel('channel').id)) { // case if the server is in the db and the channel is set

                await configDB.pull(server, interaction.options.getChannel('channel').id)
                answerembed.setTitle('Stat channel removed.')
                answerembed.setDescription('The stat command is now not limited to the channel you specified anymore.')
                answerembed.setColor(0x00ff00)

            } else { // case if the server is in the db and the channel is not set
                answerembed.setTitle('Stat channel not set.')
                answerembed.setDescription('The stat command is not limited to the channel you specified.')
                answerembed.setColor(0xff0000)
            }

        } else if (interaction.options.getSubcommand() === 'list') {
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


            }
        }

        await interaction.editReply({embeds: [answerembed], ephemeral: false})


    }


}