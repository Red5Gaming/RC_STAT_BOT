const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder} = require('discord.js');

const requestHandler = require('../../utils/requestHandler.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game-stats')
        .setDescription('Displays statistics about the game.')
        .setDMPermission(true)
    ,
    async execute(interaction) {

        await interaction.deferReply()

        let steamCount = await requestHandler.getSteamPlayerbase();
        let latestPatch = await requestHandler.getLatestPatchNotes();
        let latestPatchUrl = await requestHandler.getLatestPatchLink();

        let P0 = new EmbedBuilder()
            .setTitle('Steam playerbase')
            .setColor("FF1653")
            .setDescription(`For a in-depth look at the playerbase, check out the [SteamDB page](https://steamdb.info/app/2211280/graphs/)`)
            .addFields(
                {name: 'Steam playerbase', value: `There are currently ***${steamCount}*** players on Steam.`},
            )
            .setTimestamp()

        let P1 = new EmbedBuilder()
            .setTitle('Latest patch notes')
            .setDescription(`For the full patch notes, visit the [Steam Announcement page](${latestPatchUrl}).`)
            .setColor("FF1653")
            .addFields(
                {name: 'Patch notes', value: latestPatch}
            )

        let timeoutPage = new EmbedBuilder()
            .setTitle('Command timed out')
            .setColor("FF1653")
            .setDescription('The command timed out. Please run the command again.')
            .setTimestamp()


        let pages = [P0, P1]

        pages.forEach(page => {
            page.setColor('#FF1653')
            page.setFooter({text: 'Page ' + (pages.indexOf(page) + 1) + ' of ' + pages.length + " • Get info about the bot with /info"})
        })

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('first').setStyle(ButtonStyle.Secondary).setEmoji('⏪'),
                new ButtonBuilder().setCustomId('previous').setStyle(ButtonStyle.Danger).setEmoji('⬅'),
                new ButtonBuilder().setCustomId('next').setStyle(ButtonStyle.Success).setEmoji('➡'),
                new ButtonBuilder().setCustomId('last').setStyle(ButtonStyle.Secondary).setEmoji('⏩'),
            )

        let pageTitles = []
        pages.forEach(page => {
            pageTitles.push(page.data.title)
        })

        let pagedescriptions = [
            'Get the current amount of players on Steam.',
            'Get the latest patch notes.'
        ]

        let pageoptions = []
        for (let i = 0; i < pages.length; i++) {
            pageoptions.push({label: `${pageTitles[i]}`, value: `${i}`, description: `${pagedescriptions[i]}`})
        }

        const selectmenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('selectmenu')
                    .setPlaceholder('Select a page')
                    .addOptions(pageoptions)
            );

        await interaction.editReply({embeds: [P0], components: [selectmenu, buttons]})

        const filter = (i) => i.customId === 'first' || i.customId === 'previous' || i.customId === 'next' || i.customId === 'last' || i.customId === 'selectmenu' && i.user.id === interaction.user.id
        const collector = interaction.channel.createMessageComponentCollector({filter, time: 300000}) // def. 300000

        let currentPage = 0

        collector.on('collect', async (i) => {
                if (i.user.id !== interaction.user.id) return i.reply({ // case if someone else clicks the button
                    content: 'You cannot use this button',
                    ephemeral: true
                })
                else { // case if the user clicks the button

                    if (i.customId === 'first') { // case if the user clicks the first button
                        currentPage = 0
                        await i.update({embeds: [pages[currentPage]], components: [selectmenu, buttons]})
                    } else if (i.customId === 'previous') { // case if the user clicks the previous button
                        if (currentPage !== 0) {
                            --currentPage
                            await i.update({embeds: [pages[currentPage]], components: [selectmenu, buttons]})
                        } else { // case if the user clicks the previous button on the first page
                            currentPage = pages.length - 1
                            await i.update({embeds: [pages[currentPage]], components: [selectmenu, buttons]})
                        }
                    } else if (i.customId === 'next') { // case if the user clicks the next button
                        if (currentPage < pages.length - 1) {
                            ++currentPage
                            await i.update({embeds: [pages[currentPage]], components: [selectmenu, buttons]})
                        } else { // case if the user clicks the next button on the last page
                            currentPage = 0
                            await i.update({embeds: [pages[currentPage]], components: [selectmenu, buttons]})
                        }
                    } else if (i.customId === 'last') { // case if the user clicks the last button
                        currentPage = pages.length - 1
                        await i.update({embeds: [pages[currentPage]], components: [selectmenu, buttons]})
                    } else if (i.customId === 'selectmenu') { // case if the user clicks the select menu
                        currentPage = i.values[0]
                        await i.update({embeds: [pages[currentPage]], components: [selectmenu, buttons]})
                    }
                }

            }
        )

        collector.on('end', async () => {
                // Re-applyine the timestamp to the page, because it stays the same.
            timeoutPage.setTimestamp()
                await interaction.editReply({embeds: [timeoutPage], components: []})
            }
        )






    }
}