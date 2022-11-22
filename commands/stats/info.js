const {SlashCommandBuilder, EmbedBuilder, Embed, ButtonStyle, PermissionFlagsBits} = require('discord.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Displays info about the bot and its features.')
        .setDMPermission(false)
    ,
    async execute(interaction) {



        const page0 = new EmbedBuilder()
            .setTitle('RC Stat Bot')
            .setURL('https://github.com/Red5Gaming/RC_STAT_BOT')
            .setDescription('This bot allows you to view the stats of any player on any platform, right here in discord.')
            .addFields({
                name: 'How does this work❓',
                value: 'When using the </stats:1035605919138058290> command, you will find two things under the message.\n 1. 4 Buttons, the outer most buttons get you to the first and last page. The inner two one page forward and one page back.\n 2. A dropdown menu that allows you to jump to any page.'
            })
            .addFields({
                name: '❗Disclaimers❗',
                value: 'Some values might be wrong / don\'t add up. I am currently talking with ubisoft employees to get this fixed.\n ' +
                    'As some sort of "substitution" I added a "calculated" value for some stats. These values are not directly provided by ubisoft, but are calculated with the present values from each individual gamemode. ' +
                    'This is not a perfect solution, but it is the best I can do for now.\n ' +
                    'I can\'t guarantee that all values are correct, but I am working on it. \n \n' +
                    'Although it is possible to play Roller Champions on the Nintendo Switch, the API behaves differently for this platform.' +
                    ' This means that (untill further notice) the Nintendo Switch is not supported by this bot. \n' +
                    'If you have any questions, suggestions or feedback, feel free to contact me on discord: RedGaming#2083'
            })
            .addFields({
                name: 'Contex Menu',
                value: 'If you right click a user and go to "Apps", you will find a "check-stats" button. This button will open a menu that allows you to check the stats of that user.'
            })
            .addFields({
                name: 'The project💻',
                value: "This project is open source under the Mozilla 2.0 license. You can find the source code by clicking the title of this message."
            })
            .setColor('#FF1653')

        await interaction.reply({embeds: [page0], ephemeral: false})

    }
}