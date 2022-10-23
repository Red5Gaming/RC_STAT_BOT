const {SlashCommandBuilder, EmbedBuilder, Embed, ButtonStyle} = require('discord.js');
const wait = require('util').promisify(setTimeout);


const Pagination = require('customizable-discordjs-pagination');

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


            // TODO: Only create a new ticket every 3 hours
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
            console.log("Spaceid" + response.body.spaceId)

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


            function getStat(stat) {

                // console.log(stat)

                // check if the stat is defined
                if (stato[stat] !== undefined) {
                    // console.log(stato[stat].value)
                    return stato[stat].value;
                } else {
                    return "N/A";
                }

                // return stato[stat].value;


            }

            // getStat('performanceDodge')

            // console.log(getStat('performanceDodge'))

            // create a function called "getStat" that takes a string as an argument and return the value of the stat

            // console.log(getStat('MatchPlayed'))
            // console.log(stato['MatchPlayed'].value);

            // let totalwins = stato['MatchResult.endreason.Win'].value


            // times
            let totaltime = Number(getStat('progressionPlaytimeGamemode.gamemodeid.Ranked')) + Number(getStat('progressionPlaytimeGamemode.gamemodeid.QuickMatch')) + Number(getStat('progressionPlaytimeGamemode.gamemodeid.Exotic'))
            let reportedtime = Number(getStat('playtimeAbsolute')) // time reported by ubi, somehow capped at ~80 hours
            let timeExotic = getStat('progressionPlaytimeGamemode.gamemodeid.Exotic')
            let timeRanked = getStat('progressionPlaytimeGamemode.gamemodeid.Ranked')
            let timeQuickMatch = getStat('progressionPlaytimeGamemode.gamemodeid.QuickMatch')

            // dodges
            let dodges = getStat('performanceDodge')
            let dodgesinexotic = getStat('performanceDodgeGamemode.gamemodeid.Exotic')
            let dodgesinquickmatch = getStat('performanceDodgeGamemode.gamemodeid.QuickMatch')
            let dodgesinranked = getStat('performanceDodgeGamemode.gamemodeid.Ranked')
            let calculatedtotaldodges = Number(dodgesinexotic) + Number(dodgesinquickmatch) + Number(dodgesinranked)

            // emotes
            let emotes = getStat('performanceEmote')
            let emotesinexotic = getStat('performanceEmoteGamemode.gamemodeid.Exotic')
            let emotesinquickmatch = getStat('performanceEmoteGamemode.gamemodeid.QuickMatch')
            let emotesinranked = getStat('performanceEmoteGamemode.gamemodeid.Ranked')
            let calculatedemotes = Number(emotesinexotic) + Number(emotesinquickmatch) + Number(emotesinranked)

            // gates
            let gates = getStat('progressionGatesGlobal')
            let gatesinexotic = getStat('performanceGatesGamemode.gamemodeid.Exotic')
            let gatesinquickmatch = getStat('performanceGatesGamemode.gamemodeid.QuickMatch')
            let gatesinranked = getStat('performanceGatesGamemode.gamemodeid.Ranked')
            let calculatedgates = Number(gatesinexotic) + Number(gatesinquickmatch) + Number(gatesinranked)

            // all goals
            let reportedgoals = getStat('progressionGoalsGlobal')

            // 1pt goals
            let global1ptgoals = getStat('progression1ptGoalGlobal')
            let exotic1ptgoals = getStat('performance1ptGoalGamemode.gamemodeid.Exotic')
            let quickmatch1ptgoals = getStat('performance1ptGoalGamemode.gamemodeid.QuickMatch')
            let ranked1ptgoals = getStat('performance1ptGoalGamemode.gamemodeid.Ranked')
            let calculated1ptgoals = Number(exotic1ptgoals) + Number(quickmatch1ptgoals) + Number(ranked1ptgoals)

            // 3pt goals
            let global3ptgoals = getStat('progression3ptGoalGlobal')
            let exotic3ptgoals = getStat('performance3ptGoalGamemode.gamemodeid.Exotic')
            let quickmatch3ptgoals = getStat('performance3ptGoalGamemode.gamemodeid.QuickMatch')
            let ranked3ptgoals = getStat('performance3ptGoalGamemode.gamemodeid.Ranked')
            let calculated3ptgoals = Number(exotic3ptgoals) + Number(quickmatch3ptgoals) + Number(ranked3ptgoals)

            // 5pt goals
            let global5ptgoals = getStat('progression5ptGoalGlobal')
            let exotic5ptgoals = getStat('performance5ptGoalGamemode.gamemodeid.Exotic')
            let quickmatch5ptgoals = getStat('performance5ptGoalGamemode.gamemodeid.QuickMatch')
            let ranked5ptgoals = getStat('performance5ptGoalGamemode.gamemodeid.Ranked')
            let calculated5ptgoals = Number(exotic5ptgoals) + Number(quickmatch5ptgoals) + Number(ranked5ptgoals)

            let percentage1pt = (calculated1ptgoals / reportedgoals) * 100
            let percentage3pt = (calculated3ptgoals / reportedgoals) * 100
            let percentage5pt = (calculated5ptgoals / global5ptgoals) * 100


            // grabs
            let mategrabs = getStat('performanceGrab')
            let mategrabsinexotic = getStat('performanceGrabGamemode.gamemodeid.Exotic')
            let mategrabsinquickmatch = getStat('performanceGrabGamemode.gamemodeid.QuickMatch')
            let mategrabsinranked = getStat('performanceGrabGamemode.gamemodeid.Ranked')
            let calculatedmategrabs = Number(mategrabsinexotic) + Number(mategrabsinquickmatch) + Number(mategrabsinranked)

            // passes
            let globalPasses = getStat('progressionPassGlobal')
            let quickmatchPasses = getStat('performancePassGamemode.gamemodeid.QuickMatch')
            let rankedPasses = getStat('performancePassGamemode.gamemodeid.Ranked')
            let exoticPasses = getStat('performancePassGamemode.gamemodeid.Exotic')
            let calculatedPasses = Number(quickmatchPasses) + Number(rankedPasses) + Number(exoticPasses)

            // stuns
            let globalstuns = getStat('performanceStun')
            let quickmatchstuns = getStat('performanceStunGamemode.gamemodeid.QuickMatch')
            let rankedstuns = getStat('performanceStunGamemode.gamemodeid.Ranked')
            let exoticstuns = getStat('performanceStunGamemode.gamemodeid.Exotic')
            let calculatedstuns = Number(quickmatchstuns) + Number(rankedstuns) + Number(exoticstuns)

            // tackles
            let globaltackles = getStat('progressionTacklesGlobal')
            let quickmatchtackles = getStat('performanceTacklesGamemode.gamemodeid.QuickMatch')
            let rankedtackles = getStat('performanceTacklesGamemode.gamemodeid.Ranked')
            let exotictackles = getStat('performanceTacklesGamemode.gamemodeid.Exotic')
            let calculatedtackles = Number(quickmatchtackles) + Number(rankedtackles) + Number(exotictackles)

            // distances
            let distance = getStat('progressionDistanceGlobal')
            let exoticdistance = getStat('performanceDistanceGamemode.gamemodeid.Exotic')
            let quickmatchdistance = getStat('performanceDistanceGamemode.gamemodeid.QuickMatch')
            let rankeddistance = getStat('performanceDistanceGamemode.gamemodeid.Ranked')
            let calculateddistance = Number(exoticdistance) || 0 + Number(quickmatchdistance) || 0 + Number(rankeddistance) || 0

            console.log(distance)
            console.log(exoticdistance)
            console.log(quickmatchdistance)
            console.log(rankeddistance)
            console.log(calculateddistance)






            // 1 / 0 stats
            let onetozeroexotic = getStat('progressionEndOfMatchEnemyScore.gamemodeid.Exotic.selfscore.1.otherscore.0')
            let onetozeroquickmatch = getStat('progressionEndOfMatchEnemyScore.gamemodeid.QuickMatch.selfscore.1.otherscore.0')
            let onetozeroranked = getStat('progressionEndOfMatchEnemyScore.gamemodeid.Ranked.selfscore.1.otherscore.0')
            let totalonetozero = Number(onetozeroexotic) + Number(onetozeroquickmatch) + Number(onetozeroranked)

            // map specific data
            let arenaeightPlayed = getStat('progressionEnvironmentPlayedSpecific.map.Arena_8')
            let acapulcoPlayed = getStat('progressionEnvironmentPlayedSpecific.map.Arena_Acapulco')
            let acapulcoPlayed2v2Played = getStat('progressionEnvironmentPlayedSpecific.map.Arena_Acapulco_2v2')
            let acapulcoSkateparkPlayed = getStat('progressionEnvironmentPlayedSpecific.map.Arena_Acapulco_Skatepark')
            let bangkokPlayed = getStat('progressionEnvironmentPlayedSpecific.map.Arena_Bangkok')
            let brooklynPlayed = getStat('progressionEnvironmentPlayedSpecific.map.Arena_Brooklyn')
            let chichenitzaPlayed = getStat('progressionEnvironmentPlayedSpecific.map.Arena_ChichenItza')
            let chinaplayed = getStat('progressionEnvironmentPlayedSpecific.map.Arena_China')
            let japanPlayed = getStat('progressionEnvironmentPlayedSpecific.map.Arena_Japan')
            let mexicoPlayed = getStat('progressionEnvironmentPlayedSpecific.map.Arena_Mexico')
            let statenislandPlayed = getStat('progressionEnvironmentPlayedSpecific.map.Arena_StatenIsland')
            let venicebeachPlayed = getStat('progressionEnvironmentPlayedSpecific.map.Arena_VeniceBeach')

            // minute wins in quickmatch
            let minuteWinQuickmatch = getStat('progressionMatchesWon60s.gamemode.QuickMatch.endreason.Win.timerscore.60')

            // sponsor data
            let sponsorStarted = getStat('progressionSponsorContractsActivation')
            let sponsorCompleted = getStat('progressionSponsorContractsCompletion.stopreason.Completion')

            // fans
            let totalFans = getStat('progressionTotalFans')
            // let totalFansExotic = getStat('progressionTotalFansGamemode.gamemodeid.Exotic') // not working
            // let totalFansQuickmatch = getStat('progressionTotalFansGamemode.gamemodeid.QuickMatch') // not working
            // let totalFansRanked = getStat('progressionTotalFansGamemode.gamemodeid.Ranked') // not working

            // matches stats
            let totalmatches = getStat('MatchPlayed')
            let totalwins = getStat('MatchResult.endreason.Win')
            let toaldraws = getStat('MatchResult.endreason.Draw')
            let totalLost = getStat('MatchResult.endreason.Lost')
            let winpercentage = Number(totalwins) / Number(totalmatches) * 100
            let losspercentage = Number(totalLost) / Number(totalmatches) * 100
            let drawpercentage = Number(toaldraws) / Number(totalmatches) * 100
            let calculatedlosses = (Number(totalmatches) - Number(totalwins) - Number(toaldraws)).toString()

            // exotic outcomes
            let exoticDraws = getStat('MatchResultGamemode.gamemode.Exotic.endreason.Draw')
            let exoticWins = getStat('MatchResultGamemode.gamemode.Exotic.endreason.Win')

            // quickmatch outcomes
            let quickmatchDraws = getStat('MatchResultGamemode.gamemode.QuickMatch.endreason.Draw')
            let quickmatchWins = getStat('MatchResultGamemode.gamemode.QuickMatch.endreason.Win')

            // ranked outcomes
            let rankedDraws = getStat('MatchResultGamemode.gamemode.Ranked.endreason.Draw')
            let rankedWins = getStat('MatchResultGamemode.gamemode.Ranked.endreason.Win')


            // mmr
            let mmr = getStat('tsrmeandef')

            // cosmetics
            let cosmeticAmount = getStat('progressionCollection')


            const page0 = new EmbedBuilder()
                .setTitle('RC Stat Bot')
                .setURL('https://example.org/')
                .setDescription('This bot allows you to view the stats of any player on any platform, right here in discord.')
                .addFields({
                    name: 'How does this work❓',
                    value: 'Under this message you see two things.\n 1. 4 Buttons, the outer most buttons get you to the first and last page. The inner two one page forward and one page back.\n 2. A dropdown menu that allows you to jump to any page.'
                })
                .addFields({
                    name: '❗Disclaimer❗',
                    value: 'Some values might be wrong / don\'t add up. I am currently talking with ubisoft employees to get this fixed.\n As some sort of "substitution" I added a "calculated" value for some stats. These values are not directly provided by ubisoft, but are calculated with the present values. This is not a perfect solution, but it is the best I can do for now.\n I can\'t guarantee that all values are correct, but I am working on it.'
                })
                .addFields({
                    name: 'The project💻',
                    value: "This project is open source under the Mozilla 2.0 license. You can find the source code by clicking the title of this message."
                })
                .setColor('#FF1653')


            // every page is 3x4 fields
            const page1 = new EmbedBuilder()
                .setTitle('Important Stats')
                .setDescription('Here are the stats for ' + "***" + name + "***" + " on " + platform)
                .addFields({name: "MMR", value: mmr, inline: true},
                    {name: "Total Fans", value: totalFans, inline: true},
                    {name: "Total Matches", value: totalmatches, inline: true},
                    {name: "Total Wins", value: totalwins, inline: true},
                    {name: "Win Percentage (All gamemodes)", value: winpercentage.toFixed(2) + '%', inline: true},
                    {name: "Total Losses", value: calculatedlosses, inline: true},
                    {
                        name: "Total passes",
                        value: `Calculated passes: ${calculatedPasses} \n Global passes: ${globalPasses}`,
                        inline: true
                    },
                    {
                        name: "Total tackles",
                        value: `Calculated tackles: ${calculatedtackles} \n Global tackles: ${globaltackles}`,
                        inline: true
                    },
                    {
                        name: "Total stuns (getting tackled)",
                        value: `Calculated stuns: ${calculatedstuns} \n Global stuns: ${globalstuns}`,
                        inline: true
                    },
                    {
                        name: "Total 1pt goals",
                        value: `Calculated 1pt goals: ${calculated1ptgoals} \n Global 1pt goals: ${global1ptgoals}`,
                        inline: true
                    },
                    {
                        name: "Total 2pt goals",
                        value: `Calculated 2pt goals: ${calculated3ptgoals} \n Global 2pt goals: ${global3ptgoals}`,
                        inline: true
                    },
                    {
                        name: "Total 5pt goals",
                        value: `Calculated 5pt goals: ${calculated5ptgoals} \n Global 5pt goals: ${global5ptgoals}`,
                        inline: true
                    },
                )
                .setColor('#FF1653')


            const page2 = new EmbedBuilder()
                .setTitle('Ranked Stats')
                .setDescription('Here are the stats for ' + "***" + name + "***" + " on " + platform)
                .addFields(
                    {name: "Ranked Wins", value: rankedWins, inline: true},
                    {name: "Ranked Draws", value: rankedDraws, inline: true},
                    {name: "Ranked passes", value: rankedPasses, inline: true},
                    {name: "Ranked tackles", value: rankedtackles, inline: true},
                    {name: "Ranked dodges", value: dodgesinranked, inline: true},
                    {name: "Ranked stuns (getting tackled)", value: rankedstuns, inline: true},
                    {name: "Ranked 1pt goals", value: ranked1ptgoals, inline: true},
                    {name: "Ranked 3pt goals", value: ranked3ptgoals, inline: true},
                    {name: "Ranked 5pt goals", value: ranked5ptgoals, inline: true},
                    {name: "One to zero wins", value: onetozeroranked, inline: true},
                    {name: "Time played in ranked", value: timeRanked, inline: true},
                    {name: "Mates grabbed in ranked", value: mategrabsinranked, inline: true},
                    {name: "Gates activated in ranked", value: gatesinranked, inline: true},
                    {
                        name: "Distance travelled in ranked",
                        value: (rankeddistance / 1000).toFixed(2) + " km",
                        inline: true
                    },
                    {name: "Emotes used in ranked", value: emotesinranked, inline: true},
                )

            const page3 = new EmbedBuilder()
                .setTitle('Quickmatch Stats')
                .setDescription('Here are the stats for ' + "***" + name + "***" + " on " + platform)
                .addFields(
                    {name: "QM Wins", value: quickmatchWins, inline: true},
                    {name: "QM draws", value: quickmatchDraws, inline: true},
                    {name: "QM passes", value: quickmatchPasses, inline: true},
                    {name: "QM tackles", value: quickmatchtackles, inline: true},
                    {name: "QM dodges", value: dodgesinquickmatch, inline: true},
                    {name: "QM stuns (getting tackled)", value: quickmatchstuns, inline: true},
                    {name: "QM 1pt goals", value: quickmatch1ptgoals, inline: true},
                    {name: "QM 3pt goals", value: quickmatch3ptgoals, inline: true},
                    {name: "QM 5pt goals", value: quickmatch5ptgoals, inline: true},
                    {name: "One to zero wins", value: onetozeroquickmatch, inline: true},
                    {name: "Time played in QM", value: timeQuickMatch, inline: true},
                    {name: "Mates grabbed in QM", value: mategrabsinquickmatch, inline: true},
                    {name: "Gates activated in QM", value: gatesinquickmatch, inline: true},
                    {name: "Distance travelled in QM", value: (quickmatchdistance / 1000).toFixed(2) + " km", inline: true},
                    {name: "Emotes used in QM", value: emotesinquickmatch, inline: true},
                )

            const page4 = new EmbedBuilder()
                .setTitle('Exotic Stats')
                .setDescription('Here are the stats for ' + "***" + name + "***" + " on " + platform)
                .addFields(
                    {name: "Exotic Wins", value: exoticWins, inline: true},
                    {name: "Exotic draws", value: exoticDraws, inline: true},
                    {name: "Exotic passes", value: exoticPasses, inline: true},
                    {name: "Exotic tackles", value: exotictackles, inline: true},
                    {name: "Exotic dodges", value: dodgesinexotic, inline: true},
                    {name: "Exotic stuns (getting tackled)", value: exoticstuns, inline: true},
                    {name: "Exotic 1pt goals", value: exotic1ptgoals, inline: true},
                    {name: "Exotic 3pt goals", value: exotic3ptgoals, inline: true},
                    {name: "Exotic 5pt goals", value: exotic5ptgoals, inline: true},
                    {name: "One to zero wins", value: onetozeroexotic, inline: true},
                    {name: "Time played in Exotic", value: timeExotic, inline: true},
                    {name: "Mates grabbed in Exotic", value: mategrabsinexotic, inline: true},
                    {name: "Gates activated in Exotic", value: gatesinexotic, inline: true},
                    {name: "Distance travelled in Exotic", value: exoticdistance / 1000 + " km", inline: true},
                    {name: "Emotes used in Exotic", value: emotesinexotic, inline: true},
                )



            totaltime = totaltime / 60 / 60
            totaltime = totaltime.toFixed(2)

            reportedtime = reportedtime / 60 / 60
            reportedtime = reportedtime.toFixed(2)

            timeRanked = timeRanked / 60 / 60
            timeRanked = timeRanked.toFixed(2)

            timeQuickMatch = timeQuickMatch / 60 / 60
            timeQuickMatch = timeQuickMatch.toFixed(2)

            timeExotic = timeExotic / 60 / 60
            timeExotic = timeExotic.toFixed(2)


            const page5 = new EmbedBuilder()
                .setTitle('Times Played')
                .setDescription('Here are the stats for ' + "***" + name + "***" + " on " + platform)
                .addFields(
                    {name: "Calculated time", value: (totaltime).toString() + "hrs", inline: true},
                    {name: "Reported Time (Shown in launcher)", value: (reportedtime).toString() + "hrs", inline: true},
                    {name: "Time played in ranked", value: (timeRanked).toString() + "hrs", inline: true},
                    {name: "Time played in QM", value: (timeQuickMatch).toString() + "hrs", inline: true},
                    {name: "Time played in Exotic", value: (timeExotic).toString() + "hrs", inline: true},
                )



            const page6 = new EmbedBuilder()
                .setTitle('Distances Travelled')
                .setDescription('Here are the stats for ' + "***" + name + "***" + " on " + platform)
                .addFields(
                    {
                        name: "Total distance travelled",
                        value: (distance / 1000).toFixed(2).toString() + " km",
                        inline: true
                    },

                    {
                        name: "Calculated distance travelled",
                        value: (calculateddistance / 1000).toFixed(2).toString() + " km",
                        inline: true
                    },


                    {
                        name: "Distance travelled in ranked",
                        value: (rankeddistance / 1000).toFixed(2) + " km",
                        inline: true
                    },
                    {
                        name: "Distance travelled in QM",
                        value: (quickmatchdistance / 1000).toFixed(2) + " km",
                        inline: true
                    },
                    {
                        name: "Distance travelled in Exotic",
                        value: (exoticdistance / 1000).toFixed(2) + " km",
                        inline: true
                    },
                )


            const page7 = new EmbedBuilder()
                .setTitle('Grabs, Dodges, Tackles, Stuns, Emotes')
                .setDescription('Here are the stats for ' + "***" + name + "***" + " on " + platform)
                .addFields(
                    {name: "Total grabs", value: mategrabs.toString(), inline: true},
                    {name: "Calculated grabs", value: calculatedmategrabs.toString(), inline: true},
                    {name: "Total dodges", value: dodges.toString(), inline: true},
                    {name: "Calculated dodges", value: calculatedtotaldodges.toString(), inline: true},
                    {name: "Total tackles", value: globaltackles.toString(), inline: true},
                    {name: "Calculated tackles", value: calculatedtackles.toString(), inline: true},
                    {name: "Total stuns", value: globalstuns.toString(), inline: true},
                    {name: "Calculated stuns", value: calculatedstuns.toString(), inline: true},
                    {name: "Total emotes", value: emotes.toString(), inline: true},
                    {name: "Calculated emotes", value: calculatedemotes.toString(), inline: true},
                )


            const page8 = new EmbedBuilder()
                .setTitle('Goals, Gates, Percentages')
                .setDescription('Here are the stats for ' + "***" + name + "***" + " on " + platform)
                .addFields(
                    {name: "Total goals", value: reportedgoals.toString(), inline: true},
                    {name: "Calculated 1pt goals", value: calculated1ptgoals.toString(), inline: true},
                    {name: "1pt percentage", value: percentage1pt.toFixed(2).toString() + "%", inline: true},

                    {name: "Calculated 3pt goals", value: calculated3ptgoals.toString(), inline: true},
                    {name: "3pt percentage", value: percentage3pt.toFixed(2).toString() + "%", inline: true},

                    {name: "Calculated 5pt goals", value: calculated5ptgoals.toString(), inline: true},
                    {name: "5pt percentage", value: percentage5pt.toFixed(2).toString() + "%", inline: true},

                    {name: "Total gates", value: gates.toString(), inline: true},
                    {name: "Calculated gates", value: calculatedgates.toString(), inline: true},

                    {name: "Win percentage", value: winpercentage.toFixed(2).toString() + "%", inline: true},
                    {name: "Draw percentage", value: drawpercentage.toFixed(2).toString() + "%", inline: true},
                    {name: "Loss percentage", value: losspercentage.toFixed(2).toString() + "%", inline: true},
                )


            const page9 = new EmbedBuilder()
                .setTitle('Misc Stats')
                .setDescription('Here are the stats for ' + "***" + name + "***" + " on " + platform)
                .addFields(
                    {name: "Total 1/0 wins", value: totalonetozero.toString(), inline: true},
                    {name: "Total Matches won in 60 seconds", value: minuteWinQuickmatch.toString(), inline: true},
                    {name: "Sponsor contracts started", value: sponsorStarted.toString(), inline: true},
                    {name: "Sponsor contracts completed", value: sponsorCompleted.toString(), inline: true},
                    {name: "Cosmetics", value: cosmeticAmount.toString(), inline: true},
                )

            const page10 = new EmbedBuilder()
                .setTitle('Map stats')
                .setDescription('Here are the stats for ' + "***" + name + "***" + " on " + platform)
                .addFields(
                    {name: "Total games played in Arena 8", value: arenaeightPlayed.toString(), inline: true},
                    {name: "Total games played in Acapulco", value: acapulcoPlayed.toString(), inline: true},
                    {
                        name: "Total games played in Acapulco 2v2",
                        value: acapulcoPlayed2v2Played.toString(),
                        inline: true
                    },
                    {name: "Total games played in Skatepark", value: acapulcoSkateparkPlayed.toString(), inline: true},
                    {name: "Total games played in Bangkok", value: bangkokPlayed.toString(), inline: true},
                    {name: "Total games played in Brooklyn", value: brooklynPlayed.toString(), inline: true},
                    {name: "Total games played in Chichenitza", value: chichenitzaPlayed.toString(), inline: true},
                    {name: "Total games played in China", value: chinaplayed.toString(), inline: true},
                    {name: "Total games played in Japan", value: japanPlayed.toString(), inline: true},
                    {name: "Total games played in Mexico", value: mexicoPlayed.toString(), inline: true},
                    {name: "Total games played in Staten Island", value: statenislandPlayed.toString(), inline: true},
                    {name: "Total games played in Venice Beach", value: venicebeachPlayed.toString(), inline: true},
                )


            let pages = [page0, page1, page2, page3, page4, page5, page6, page7, page8, page9, page10]

            const buttons = [
                {label: 'first', emoji: '⏪', style: ButtonStyle.Secondary},
                {label: 'Previous', emoji: '⬅', style: ButtonStyle.Danger},
                {label: 'Next', emoji: '➡', style: ButtonStyle.Success},
                {label: 'Last', emoji: '⏩', style: ButtonStyle.Secondary},
            ]

            await new Pagination({secondaryUserText: "Hey! You did not request this!", timeout: 300000})
                .setCommand(interaction)
                .setPages(pages)
                .setButtons(buttons)
                .setSelectMenu({enable: true})
                .setFooter({enable: true})
                .send();


        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'User does not exist or have a profile on this platform.',
                ephemeral: true
            });
        }
        // end try / catch

    },
}

