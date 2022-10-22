const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const wait = require('util').promisify(setTimeout);

const https = require('https');


const Pagination = require('customizable-discordjs-pagination');

const superagent = require('superagent');

const config = require('../../config.json');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('pagetest')
        .setDescription('Test for embed pagination.')
        .setDMPermission(true)

    ,
    async execute(interaction) {

     // create a embed called "embed1"
        const embed1 = new EmbedBuilder()
            .setTitle('Embed 1')
            .setDescription('This is the first embed')


        // create a embed called "embed2"
        const embed2 = new EmbedBuilder()
            .setTitle('Embed 2')
            .setDescription('This is the second embed')

        const embed3 = new EmbedBuilder()
            .setTitle('Embed 3')
            .setDescription('This is the third embed')

        const embed4 = new EmbedBuilder()
            .setTitle('Embed 4')
            .setDescription('This is the fourth embed')

        const embed5 = new EmbedBuilder()
            .setTitle('Embed 5')
            .setDescription('This is the fifth embed')




        const pages = [embed1, embed2, embed3, embed4, embed5];

        const buttons = [
            {label: 'first', emoji: '⏪', style: ButtonStyle.Secondary},
            { label: 'Previous', emoji: '⬅', style: ButtonStyle.Danger },
            { label: 'Next', emoji: '➡', style: ButtonStyle.Success },
            { label: 'Last', emoji: '⏩', style: ButtonStyle.Secondary },
        ]

        await new Pagination({secondaryUserText: "Hey! You did not request this!", timeout: 300000})
            .setCommand(interaction)
            .setPages(pages)
            .setButtons(buttons)
            .setSelectMenu({ enable: true })
            .setFooter({ enable: true })
            .send();






        // console.log("DEBUG")


    },
}

