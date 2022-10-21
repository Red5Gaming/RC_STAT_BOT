const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const wait = require('util').promisify(setTimeout);

const https = require('https');


const superagent = require('superagent');

const config = require('../../config.json');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Checks a users stats.')
        .setDMPermission(true)
        .addStringOption(option => option.setName('name').setDescription('The name of the player you want to check.').setRequired(true))
        .addStringOption(option =>
            option.setName('platform')
                .setDescription('The platform of the player you want to check.')
                .setRequired(true)
                .addChoices(
                    {name: 'PC', value: 'uplay'},
                    {name: 'Playstation', value: 'psn'},
                    {name: 'Xbox', value: 'xbl'},
                    {name: 'Nintendo Switch', value: 'switch'},
                )
         )

    ,
    async execute(interaction) {

        const name = interaction.options.getString('name');
        const platform = interaction.options.getString('platform');

        console.log(name);
        console.log(platform);

        try {


            const options1 = {
                hostname: 'https://public-ubiservices.ubi.com/v3/profiles/sessions',

                headers: {
                    'Ubi-AppId': 'f35adcb5-1911-440c-b1c9-48fdc1701c68',
                    'Ubi-RequestedPlatformType': platform,
                    'Content-Type': 'application/json',
                    'Authorization': config.ubiauth
                }
            }

            const response = await superagent
                .post(options1.hostname)
                .set(options1.headers)

            // console.log(response.body)
            let ticketId = response.body.ticket;
            console.log(response.body.spaceId)

            const options2 = {
                hostname: 'https://public-ubiservices.ubi.com/v3/profiles',
                query: {
                    'nameOnPlatform': name,
                    'platformType': platform
                },
                headers: {
                    'Authorization': `ubi_v1 t=${ticketId}`,
                    'Ubi-AppId': 'f35adcb5-1911-440c-b1c9-48fdc1701c68',
                }
            }


            const response2 = await superagent
                .get(options2.hostname)
                .query(options2.query)
                .set(options2.headers)

            // await console.log(response2.body.profiles[0].userId);


            const options3 = {
                hostname: 'https://public-ubiservices.ubi.com/v1/profiles/stats',
                query: {
                    'profileIds': response2.body.profiles[0].userId,
                    'spaceId': '20d5c466-84fe-4f1e-8625-f6a4e2319edf'
                },
                headers: {
                    'Authorization': `ubi_v1 t=${ticketId}`,
                    'Ubi-SessionId': response.body.sessionId,
                    'Ubi-AppId': 'f35adcb5-1911-440c-b1c9-48fdc1701c68',
                }
            }


            const response3 = await superagent
                .get(options3.hostname)
                .query(options3.query)
                .set(options3.headers)

            // await console.log(response3.body.profiles[0].stats);

            let stato = response3.body.profiles[0].stats;


            // console.log(stato['MatchResult.endreason.Win'].value);


            let totalwins = stato['MatchResult.endreason.Win'].value
            let totallosses = stato['MatchResult.endreason.Lost'].value

            let playtime = stato['playtimeAbsolute'].value
            let playtimehours = playtime / 60 / 60

            let global1ptgoal = stato['progression1ptGoalGlobal'].value
            let global3ptgoal = stato['progression3ptGoalGlobal'].value
            let global5ptgoal = stato['progression5ptGoalGlobal'].value

            let globalgates = stato['progressionGatesGlobal'].value
            let globalgoals = stato['progressionGoalsGlobal'].value
            let globalpasses = stato['progressionPassGlobal'].value

            let totalfans = stato['progressionTotalFans'].value

            const asnwerEmbed = new EmbedBuilder()
                .setTitle('Stats')
                .setDescription('Here are the stats for ' + name)
                .addFields({name: 'Total wins', value: totalwins, inline: true})
                .addFields({name: 'Total losses', value: totallosses, inline: true})
                .addFields({name: 'Playtime', value: playtimehours.toFixed(2) + ' hours', inline: true})
                .addFields({name: 'Global 1pt goals', value: global1ptgoal, inline: true})
                .addFields({name: 'Global 3pt goals', value: global3ptgoal, inline: true})
                .addFields({name: 'Global 5pt goals', value: global5ptgoal, inline: true})
                .addFields({name: 'Global gates', value: globalgates, inline: true})
                .addFields({name: 'Global goals', value: globalgoals, inline: true})
                .addFields({name: 'Global passes', value: globalpasses, inline: true})
                .addFields({name: 'Total fans', value: totalfans, inline: true})
                .setColor('#FF1653')



await interaction.reply({embeds: [asnwerEmbed]});


            // await interaction.reply({content: 'Stat placeholder', ephemeral: true});

        } catch (error) {
            // if the status code is 401, then the user does not have a profile on the platform they specified
                console.log(error);
                await interaction.reply({content: 'User does not exist or have a profile on this platform.', ephemeral: true});

        }




        // console.log("DEBUG")


    },
}

