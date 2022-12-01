const {SlashCommandBuilder, EmbedBuilder, Embed, ButtonStyle, PermissionFlagsBits} = require('discord.js');

const req = require('../../utils/requestHandler.js').profId
const usercheck = require('../../utils/requestHandler.js').checkIfUserExists


module.exports = {
    data: new SlashCommandBuilder()
        .setName('outfit')
        .setDescription('Sends a players latest outfit.')
        .setDMPermission(false)
        .addStringOption(option => option.setName('name').setDescription('The name of the player you want to check.').setRequired(true))
        .addStringOption(option =>
            option.setName('platform')
                .setDescription('The platform of the player you want to check.')
                .setRequired(true)
                .addChoices(
                    {name: 'PC', value: 'uplay'},
                    {name: 'Playstation', value: 'psn'},
                    {name: 'Xbox', value: 'xbl'},
                    //{name: 'Nintendo Switch', value: 'switch'},
                )
        )
    ,
    async execute(interaction) {

        if(await usercheck(interaction.options.getString('name'), interaction.options.getString('platform')) === false) {
            await interaction.reply({content: 'This user seems to not have a profile.', ephemeral: true})
        } else {

            let profileId = await req(interaction.options.getString('name'), interaction.options.getString('platform'))
            console.log(profileId)

            let fitScreenUrl = `https://roller-prod-screenshot.s3.amazonaws.com/20d5c466-84fe-4f1e-8625-f6a4e2319edf/${profileId}.jpg`
            let botpfp = 'https://cdn.discordapp.com/attachments/543872678331940876/1044642387626037369/unknown.png'

            const fitEmbed = new EmbedBuilder()
                .setTitle(`${interaction.options.getString('name')}'s latest outfit`)
                .setDescription('If the image is not loading, click the title.')
                .setURL(fitScreenUrl)
                .setImage(fitScreenUrl)
                .setColor('FF1653')
                .setTimestamp()
                .setFooter({text: 'Requested by ' + interaction.user.username, iconURL: botpfp})

            await interaction.reply({embeds: [fitEmbed], ephemeral: true})


        }

    }
}