const {
    SlashCommandBuilder,
    EmbedBuilder,

    ButtonStyle,

    ActionRowBuilder,
    ButtonBuilder, StringSelectMenuBuilder
} = require('discord.js');


const reqHandler = require('../../utils/requestHandler.js')


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
                    //{name: 'Nintendo Switch', value: 'switch'},
                )
        )
    ,
    async execute(interaction) {


        await interaction.deferReply();

        const name = interaction.options.getString('name');
        const platform = interaction.options.getString('platform');

        // re-defining platforms, more readable for the user.
        let platformEdit = platform;
        if (platform === 'uplay') platformEdit = 'PC';
        if (platform === 'psn') platformEdit = 'Playstation';
        if (platform === 'xbl') platformEdit = 'Xbox';
        // if(platform == 'switch') platformEdit = 'Nintendo Switch'; //Not working currently

        let stato = await reqHandler.stat(name, platform);

        if (stato === undefined) { // case if the user does not exist
            await interaction.editReply({content: 'This user seems to not have a profile.', ephemeral: true})
            // console.log("no user found with that name")
        } else {
            //console.log("user found, doing stat stuff")

            function getStat(stat) {
                if (stato[stat] !== undefined) {
                    return (stato[stat].value).toString();
                } else {
                    return "0";
                }
            }

            if (getStat('playtimeAbsolute') === '0') { // check if the user has not played any games
                await interaction.editReply({content: 'This user seems to not have a profile.', ephemeral: true})
                //console.log("User has 0 hours")
            } else {


                function addStats(...args) {
                    let total = 0;
                    for (let i = 0; i < args.length; i++) {
                        total += Number(getStat(args[i]));
                    }
                    return total;
                }

                // times
                let times = {
                    totaltime: ((Number(getStat('progressionPlaytimeGamemode.gamemodeid.Exotic')) + Number(getStat('progressionPlaytimeGamemode.gamemodeid.Ranked')) + Number(getStat('progressionPlaytimeGamemode.gamemodeid.QuickMatch'))) / 60 / 60).toFixed(2) + " hrs",
                    reportedtime: (getStat('playtimeAbsolute') / 60 / 60).toFixed(2) + " hrs", // time reported by ubi, somehow capped at ~80 hours for some
                    timeExotic: (Number(getStat('progressionPlaytimeGamemode.gamemodeid.Exotic')) / 60 / 60).toFixed(2) + " hrs",
                    timeRanked: (Number(getStat('progressionPlaytimeGamemode.gamemodeid.Ranked')) / 60 / 60).toFixed(2) + " hrs",
                    timeQuickMatch: (Number(getStat('progressionPlaytimeGamemode.gamemodeid.QuickMatch')) / 60 / 60).toFixed(2).toString() + " hrs"
                }

                // dodges
                let dodges = {
                    dodges: getStat('performanceDodge'),
                    dodgesinexotic: getStat('performanceDodgeGamemode.gamemodeid.Exotic'),
                    dodgesinquickmatch: getStat('performanceDodgeGamemode.gamemodeid.QuickMatch'),
                    dodgesinranked: getStat('performanceDodgeGamemode.gamemodeid.Ranked'),
                    calculatedtotaldodges: (Number(getStat('performanceDodgeGamemode.gamemodeid.Exotic'))) + (Number(getStat('performanceDodgeGamemode.gamemodeid.QuickMatch'))) + (Number(getStat('performanceDodgeGamemode.gamemodeid.Ranked')))
                }

                // emotes
                let emotes = {
                    emotes: getStat('performanceEmote'),
                    emotesinexotic: getStat('performanceEmoteGamemode.gamemodeid.Exotic'),
                    emotesinquickmatch: getStat('performanceEmoteGamemode.gamemodeid.QuickMatch'),
                    emotesinranked: getStat('performanceEmoteGamemode.gamemodeid.Ranked'),
                    calculatedemotes: (Number(getStat('performanceEmoteGamemode.gamemodeid.Exotic'))) + (Number(getStat('performanceEmoteGamemode.gamemodeid.QuickMatch'))) + (Number(getStat('performanceEmoteGamemode.gamemodeid.Ranked')))
                }

                // gates
                let gates = {
                    gates: getStat('progressionGatesGlobal'),
                    gatesinexotic: getStat('performanceGatesGamemode.gamemodeid.Exotic'),
                    gatesinquickmatch: getStat('performanceGatesGamemode.gamemodeid.QuickMatch'),
                    gatesinranked: getStat('performanceGatesGamemode.gamemodeid.Ranked'),
                    calculatedgates: addStats('performanceGatesGamemode.gamemodeid.Exotic', 'performanceGatesGamemode.gamemodeid.QuickMatch', 'performanceGatesGamemode.gamemodeid.Ranked')
                }

                // all goals
                let allGoals = {
                    reportedgoals: getStat('progressionGoalsGlobal')
                }

                // 1pt goals
                let oneptgoals = {
                    global1ptgoals: getStat('progression1ptGoalGlobal'),
                    exotic1ptgoals: getStat('performance1ptGoalGamemode.gamemodeid.Exotic'),
                    quickmatch1ptgoals: getStat('performance1ptGoalGamemode.gamemodeid.QuickMatch'),
                    ranked1ptgoals: getStat('performance1ptGoalGamemode.gamemodeid.Ranked'),
                    calculated1ptgoals: addStats('performance1ptGoalGamemode.gamemodeid.Exotic', 'performance1ptGoalGamemode.gamemodeid.QuickMatch', 'performance1ptGoalGamemode.gamemodeid.Ranked')
                }

                // 3pt goals
                let threeptgoals = {
                    global3ptgoals: getStat('progression3ptGoalGlobal'),
                    exotic3ptgoals: getStat('performance3ptGoalGamemode.gamemodeid.Exotic'),
                    quickmatch3ptgoals: getStat('performance3ptGoalGamemode.gamemodeid.QuickMatch'),
                    ranked3ptgoals: getStat('performance3ptGoalGamemode.gamemodeid.Ranked'),
                    calculated3ptgoals: addStats('performance3ptGoalGamemode.gamemodeid.Exotic', 'performance3ptGoalGamemode.gamemodeid.QuickMatch', 'performance3ptGoalGamemode.gamemodeid.Ranked')
                }

                // 5pt goals
                let fiveptgoals = {
                    global5ptgoals: getStat('progression5ptGoalGlobal'),
                    exotic5ptgoals: getStat('performance5ptGoalGamemode.gamemodeid.Exotic'),
                    quickmatch5ptgoals: getStat('performance5ptGoalGamemode.gamemodeid.QuickMatch'),
                    ranked5ptgoals: getStat('performance5ptGoalGamemode.gamemodeid.Ranked'),
                    calculated5ptgoals: addStats('performance5ptGoalGamemode.gamemodeid.Exotic', 'performance5ptGoalGamemode.gamemodeid.QuickMatch', 'performance5ptGoalGamemode.gamemodeid.Ranked')
                }

                let ptPercentages = {
                    percentage1pt: ((oneptgoals.calculated1ptgoals / allGoals.reportedgoals) * 100).toFixed(2).toString() + "%",
                    percentage3pt: ((threeptgoals.calculated3ptgoals / allGoals.reportedgoals) * 100).toFixed(2).toString() + "%",
                    percentage5pt: ((fiveptgoals.calculated5ptgoals / allGoals.reportedgoals) * 100).toFixed(2).toString() + "%"
                }

                // grabs
                let grabs = {
                    mategrabs: getStat('performanceGrab'),
                    mategrabsinexotic: getStat('performanceGrabGamemode.gamemodeid.Exotic'),
                    mategrabsinquickmatch: getStat('performanceGrabGamemode.gamemodeid.QuickMatch'),
                    mategrabsinranked: getStat('performanceGrabGamemode.gamemodeid.Ranked'),
                    calculatedmategrabs: addStats('performanceGrabGamemode.gamemodeid.Exotic', 'performanceGrabGamemode.gamemodeid.QuickMatch', 'performanceGrabGamemode.gamemodeid.Ranked')
                }

                // passes
                let passes = {
                    globalPasses: getStat('progressionPassGlobal'),
                    quickmatchPasses: getStat('performancePassGamemode.gamemodeid.QuickMatch'),
                    rankedPasses: getStat('performancePassGamemode.gamemodeid.Ranked'),
                    exoticPasses: getStat('performancePassGamemode.gamemodeid.Exotic'),
                    calculatedPasses: addStats('performancePassGamemode.gamemodeid.Exotic', 'performancePassGamemode.gamemodeid.QuickMatch', 'performancePassGamemode.gamemodeid.Ranked')
                }

                // stuns
                let stuns = {
                    globalstuns: getStat('performanceStun'),
                    quickmatchstuns: getStat('performanceStunGamemode.gamemodeid.QuickMatch'),
                    rankedstuns: getStat('performanceStunGamemode.gamemodeid.Ranked'),
                    exoticstuns: getStat('performanceStunGamemode.gamemodeid.Exotic'),
                    calculatedstuns: addStats('performanceStunGamemode.gamemodeid.Exotic', 'performanceStunGamemode.gamemodeid.QuickMatch', 'performanceStunGamemode.gamemodeid.Ranked')
                }

                // tackles
                let tackles = {
                    globaltackles: getStat('progressionTacklesGlobal'),
                    quickmatchtackles: getStat('performanceTacklesGamemode.gamemodeid.QuickMatch'),
                    rankedtackles: getStat('performanceTacklesGamemode.gamemodeid.Ranked'),
                    exotictackles: getStat('performanceTacklesGamemode.gamemodeid.Exotic'),
                    calculatedtackles: addStats('performanceTacklesGamemode.gamemodeid.Exotic', 'performanceTacklesGamemode.gamemodeid.QuickMatch', 'performanceTacklesGamemode.gamemodeid.Ranked')
                }

                // distances
                let distances = {
                    distance: (Number(getStat('progressionDistanceGlobal')) / 1000).toFixed(2) + " km",
                    exoticdistance: Number(getStat('performanceDistanceGamemode.gamemodeid.Exotic') / 1000).toFixed(2) + " km",
                    quickmatchdistance: (Number(getStat('performanceDistanceGamemode.gamemodeid.QuickMatch')) / 1000).toFixed(2) + " km",
                    rankeddistance: (Number(getStat('performanceDistanceGamemode.gamemodeid.Ranked')) / 1000).toFixed(2) + " km", //(rankeddistance == 'NaN' ? "0" : (rankeddistance / 1000).toFixed(2)) + " km",
                    calculateddistance: (addStats('performanceDistanceGamemode.gamemodeid.Exotic', 'performanceDistanceGamemode.gamemodeid.QuickMatch', 'performanceDistanceGamemode.gamemodeid.Ranked') / 1000).toFixed(2) + " km"
                }

                // 1 / 0 stats
                let onezerostats = {
                    onetozeroexotic: getStat('progressionEndOfMatchEnemyScore.gamemodeid.Exotic.selfscore.1.otherscore.0'),
                    onetozeroquickmatch: getStat('progressionEndOfMatchEnemyScore.gamemodeid.QuickMatch.selfscore.1.otherscore.0'),
                    onetozeroranked: getStat('progressionEndOfMatchEnemyScore.gamemodeid.Ranked.selfscore.1.otherscore.0'),
                    totalonetozero: addStats('progressionEndOfMatchEnemyScore.gamemodeid.Exotic.selfscore.1.otherscore.0', 'progressionEndOfMatchEnemyScore.gamemodeid.QuickMatch.selfscore.1.otherscore.0', 'progressionEndOfMatchEnemyScore.gamemodeid.Ranked.selfscore.1.otherscore.0'),
                }

                // map specific data
                let mapstats = {
                    arenaeightPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_8'),
                    acapulcoPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_Acapulco'),
                    acapulcoPlayed2v2Played: getStat('progressionEnvironmentPlayedSpecific.map.Arena_Acapulco_2v2'),
                    acapulcoSkateparkPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_Acapulco_Skatepark'),
                    bangkokPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_Bangkok'),
                    brooklynPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_Brooklyn'),
                    chichenitzaPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_ChichenItza'),
                    chinaplayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_China'),
                    japanPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_Japan'),
                    mexicoPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_Mexico'),
                    statenislandPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_StatenIsland'),
                    venicebeachPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_VeniceBeach'),
                    pinballPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_Pinball'),
                    arcadiaPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_Arcadia'),
                    pixelCityPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_AmusementPark'),
                }

                // minute wins in quickmatch
                let minutewins = {
                    minuteWinQuickmatch: getStat('progressionMatchesWon60s.gamemode.QuickMatch.endreason.Win.timerscore.60')
                }

                // sponsor data
                let sponsorstats = {
                    sponsorStarted: getStat('progressionSponsorContractsActivation'),
                    sponsorCompleted: getStat('progressionSponsorContractsCompletion.stopreason.Completion')
                }

                // fans
                let fans = {
                    totalFans: getStat('progressionTotalFans')
                    // let totalFansExotic = getStat('progressionTotalFansGamemode.gamemodeid.Exotic') // not working
                    // let totalFansQuickmatch = getStat('progressionTotalFansGamemode.gamemodeid.QuickMatch') // not working
                    // let totalFansRanked = getStat('progressionTotalFansGamemode.gamemodeid.Ranked') // not working
                }

                // matches stats
                let matchesStats = {
                    totalmatches: getStat('MatchPlayed'),
                    totalwins: getStat('MatchResult.endreason.Win'),
                    toaldraws: getStat('MatchResult.endreason.Draw'),
                    totalLost: getStat('MatchResult.endreason.Lost'),
                    winpercentage: Number((Number(getStat('MatchResult.endreason.Win')) / Number(getStat('MatchPlayed')) * 100).toFixed(2)) + "%",
                    losspercentage: (Number(getStat('MatchResult.endreason.Lost')) / Number(getStat('MatchPlayed')) * 100).toFixed(2).toString() + "%",
                    drawpercentage: (Number(getStat('MatchResult.endreason.Draw')) / Number(getStat('MatchPlayed')) * 100).toFixed(2).toString() + "%",
                    calculatedlosses: (Number(getStat('MatchPlayed')) - Number(getStat('MatchResult.endreason.Win')) - Number(getStat('MatchResult.endreason.Draw'))).toString()
                }

                // exotic outcomes
                let exoticOutcomes = {
                    exoticDraws: getStat('MatchResultGamemode.gamemode.Exotic.endreason.Draw'),
                    exoticWins: getStat('MatchResultGamemode.gamemode.Exotic.endreason.Win')
                }

                // quickmatch outcomes
                let quickmatchOutcomes = {
                    quickmatchDraws: getStat('MatchResultGamemode.gamemode.QuickMatch.endreason.Draw'),
                    quickmatchWins: getStat('MatchResultGamemode.gamemode.QuickMatch.endreason.Win')
                }

                // ranked outcomes
                let rankedOutcomes = {
                    rankedDraws: getStat('MatchResultGamemode.gamemode.Ranked.endreason.Draw'),
                    rankedWins: getStat('MatchResultGamemode.gamemode.Ranked.endreason.Win')
                }

                // mmr
                let mmr = getStat('tsrmeandef')

                // cosmetics
                let cosmeticAmount = getStat('progressionCollection')


                const page1 = new EmbedBuilder()
                    .setTitle('Important Stats')
                    .addFields({name: "MMR", value: mmr, inline: true},
                        {name: "Total Fans", value: fans.totalFans, inline: true},
                        {name: "Total Matches", value: matchesStats.totalmatches, inline: true},
                        {name: "Total Wins", value: matchesStats.totalwins, inline: true},
                        {
                            name: "Win Percentage (All gamemodes)",
                            value: matchesStats.winpercentage,
                            inline: true
                        },
                        {
                            name: "Total Losses",
                            value: `Global losses: ${matchesStats.totalLost}\n Calculated Losses: ${matchesStats.calculatedlosses}`,
                            inline: true
                        },
                        {
                            name: "Total passes",
                            value: `Calculated passes: ${passes.calculatedPasses} \n Global passes: ${passes.globalPasses}`,
                            inline: true
                        },
                        {
                            name: "Total tackles",
                            value: `Calculated tackles: ${tackles.calculatedtackles} \n Global tackles: ${tackles.globaltackles}`,
                            inline: true
                        },
                        {
                            name: "Total stuns (getting tackled)",
                            value: `Calculated stuns: ${stuns.calculatedstuns} \n Global stuns: ${stuns.globalstuns}`,
                            inline: true
                        },
                        {
                            name: "Total 1pt goals",
                            value: `Calculated 1pt goals: ${oneptgoals.calculated1ptgoals} \n Global 1pt goals: ${oneptgoals.global1ptgoals}`,
                            inline: true
                        },
                        {
                            name: "Total 3pt goals",
                            value: `Calculated 3pt goals: ${threeptgoals.calculated3ptgoals} \n Global 3pt goals: ${threeptgoals.global3ptgoals}`,
                            inline: true
                        },
                        {
                            name: "Total 5pt goals",
                            value: `Calculated 5pt goals: ${fiveptgoals.calculated5ptgoals} \n Global 5pt goals: ${fiveptgoals.global5ptgoals}`,
                            inline: true
                        },
                    )

                const page2 = new EmbedBuilder()
                    .setTitle('Ranked Stats')
                    .addFields(
                        {name: "Ranked Wins", value: rankedOutcomes.rankedWins, inline: true},
                        {name: "Ranked Draws", value: rankedOutcomes.rankedDraws, inline: true},
                        {name: "Ranked passes", value: passes.rankedPasses, inline: true},
                        {name: "Ranked tackles", value: tackles.rankedtackles, inline: true},
                        {name: "Ranked dodges", value: dodges.dodgesinranked, inline: true},
                        {name: "Ranked stuns (getting tackled)", value: stuns.rankedstuns, inline: true},
                        {name: "Ranked 1pt goals", value: oneptgoals.ranked1ptgoals, inline: true},
                        {name: "Ranked 3pt goals", value: threeptgoals.ranked3ptgoals, inline: true},
                        {name: "Ranked 5pt goals", value: fiveptgoals.ranked5ptgoals, inline: true},
                        {name: "One to zero wins", value: onezerostats.onetozeroranked, inline: true},
                        {name: "Time played in ranked", value: times.timeRanked, inline: true},
                        {name: "Mates grabbed in ranked", value: grabs.mategrabsinranked, inline: true},
                        {name: "Gates activated in ranked", value: gates.gatesinranked, inline: true},
                        {
                            name: "Distance travelled in ranked",
                            value: distances.rankeddistance,
                            inline: true
                        },
                        {name: "Emotes used in ranked", value: emotes.emotesinranked, inline: true},
                    )
                const page3 = new EmbedBuilder()
                    .setTitle('Quickmatch Stats')
                    .addFields(
                        {name: "QM Wins", value: quickmatchOutcomes.quickmatchWins, inline: true},
                        {name: "QM draws", value: quickmatchOutcomes.quickmatchDraws, inline: true},
                        {name: "QM passes", value: passes.quickmatchPasses, inline: true},
                        {name: "QM tackles", value: tackles.quickmatchtackles, inline: true},
                        {name: "QM dodges", value: dodges.dodgesinquickmatch, inline: true},
                        {name: "QM stuns (getting tackled)", value: stuns.quickmatchstuns, inline: true},
                        {name: "QM 1pt goals", value: oneptgoals.quickmatch1ptgoals, inline: true},
                        {name: "QM 3pt goals", value: threeptgoals.quickmatch3ptgoals, inline: true},
                        {name: "QM 5pt goals", value: fiveptgoals.quickmatch5ptgoals, inline: true},
                        {name: "One to zero wins", value: onezerostats.onetozeroquickmatch, inline: true},
                        {name: "Time played in QM", value: times.timeQuickMatch, inline: true},
                        {name: "Mates grabbed in QM", value: grabs.mategrabsinquickmatch, inline: true},
                        {name: "Gates activated in QM", value: gates.gatesinquickmatch, inline: true},
                        {
                            name: "Distance travelled in QM",
                            value: distances.quickmatchdistance,
                            inline: true
                        },
                        {name: "Emotes used in QM", value: emotes.emotesinquickmatch, inline: true},
                    )
                const page4 = new EmbedBuilder()
                    .setTitle('Exotic Stats')
                    .addFields(
                        {name: "Exotic Wins", value: exoticOutcomes.exoticWins, inline: true},
                        {name: "Exotic draws", value: exoticOutcomes.exoticDraws, inline: true},
                        {name: "Exotic passes", value: passes.exoticPasses, inline: true},
                        {name: "Exotic tackles", value: tackles.exotictackles, inline: true},
                        {name: "Exotic dodges", value: dodges.dodgesinexotic, inline: true},
                        {
                            name: "Exotic stuns (getting tackled)",
                            value: stuns.exoticstuns,
                            inline: true
                        },
                        {name: "Exotic 1pt goals", value: oneptgoals.exotic1ptgoals, inline: true},
                        {name: "Exotic 3pt goals", value: threeptgoals.exotic3ptgoals, inline: true},
                        {name: "Exotic 5pt goals", value: fiveptgoals.exotic5ptgoals, inline: true},
                        {name: "One to zero wins", value: onezerostats.onetozeroexotic, inline: true},
                        {name: "Time played in Exotic", value: times.timeExotic, inline: true},
                        {
                            name: "Mates grabbed in Exotic",
                            value: grabs.mategrabsinexotic,
                            inline: true
                        },
                        {
                            name: "Gates activated in Exotic",
                            value: gates.gatesinexotic,
                            inline: true
                        },
                        {
                            name: "Distance travelled in Exotic",
                            value: distances.exoticdistance,
                            inline: true
                        },
                        {
                            name: "Emotes used in Exotic",
                            value: emotes.emotesinexotic,
                            inline: true
                        },
                    )


                const page5 = new EmbedBuilder()
                    .setTitle('Times Played')
                    .addFields(
                        {
                            name: "Calculated time",
                            value: times.totaltime,
                            inline: true
                        },
                        {
                            name: "Reported Time (Shown in launcher)",
                            value: times.reportedtime,
                            inline: true
                        },
                        {
                            name: "Time played in ranked",
                            value: times.timeRanked,
                            inline: true
                        },
                        {
                            name: "Time played in QM",
                            value: times.timeQuickMatch,
                            inline: true
                        },
                        {
                            name: "Time played in Exotic",
                            value: times.timeExotic,
                            inline: true
                        },
                    )
                const page6 = new EmbedBuilder()
                    .setTitle('Distances Travelled')
                    .addFields(
                        {
                            name: "Total distance travelled",
                            // value: (distance / 1000).toFixed(2).toString() + " km",
                            value: distances.distance,
                            inline: true
                        },
                        {
                            name: "Calculated distance travelled",
                            value: distances.calculateddistance,
                            inline: true
                        },
                        {
                            name: "Distance travelled in ranked",
                            value: distances.rankeddistance,
                            inline: true
                        },
                        {
                            name: "Distance travelled in QM",
                            value: distances.quickmatchdistance,
                            inline: true
                        },
                        {
                            name: "Distance travelled in Exotic",
                            value: distances.exoticdistance,
                            inline: true
                        },
                    )
                const page7 = new EmbedBuilder()
                    .setTitle('Grabs, Dodges, Tackles, Stuns, Emotes')
                    .addFields(
                        {name: "Total grabs", value: grabs.mategrabs.toString(), inline: true},
                        {
                            name: "Calculated grabs",
                            value: grabs.calculatedmategrabs.toString(),
                            inline: true
                        },
                        {name: "Total dodges", value: dodges.dodges, inline: true},
                        {
                            name: "Calculated dodges",
                            value: dodges.calculatedtotaldodges.toString(),
                            inline: true
                        },
                        {name: "Total tackles", value: tackles.globaltackles.toString(), inline: true},
                        {
                            name: "Calculated tackles",
                            value: tackles.calculatedtackles.toString(),
                            inline: true
                        },
                        {name: "Total stuns", value: stuns.globalstuns.toString(), inline: true},
                        {name: "Calculated stuns", value: stuns.calculatedstuns.toString(), inline: true},
                        {name: "Total emotes", value: emotes.emotes.toString(), inline: true},
                        {name: "Calculated emotes", value: emotes.calculatedemotes.toString(), inline: true},
                    )
                const page8 = new EmbedBuilder()
                    .setTitle('Goals, Gates, Percentages')
                    .addFields(
                        {name: "Total goals", value: allGoals.reportedgoals.toString(), inline: true},
                        {name: "Calculated 1pt goals", value: oneptgoals.calculated1ptgoals.toString(), inline: true},
                        {name: "1pt percentage", value: ptPercentages.percentage1pt.toString(), inline: true},
                        {name: "Calculated 3pt goals", value: threeptgoals.calculated3ptgoals.toString(), inline: true},
                        {name: "3pt percentage", value: ptPercentages.percentage3pt.toString(), inline: true},
                        {name: "Calculated 5pt goals", value: fiveptgoals.calculated5ptgoals.toString(), inline: true},
                        {name: "5pt percentage", value: ptPercentages.percentage5pt.toString(), inline: true},
                        {name: "Total gates", value: gates.gates.toString(), inline: true},
                        {name: "Calculated gates", value: gates.calculatedgates.toString(), inline: true},
                        {name: "Win percentage", value: matchesStats.winpercentage.toString(), inline: true},
                        {name: "Draw percentage", value: matchesStats.drawpercentage.toString(), inline: true},
                        {name: "Loss percentage", value: matchesStats.losspercentage.toString(), inline: true},
                    )
                const page9 = new EmbedBuilder()
                    .setTitle('Misc Stats')
                    .addFields(
                        {name: "Total 1/0 wins", value: onezerostats.totalonetozero.toString(), inline: true},
                        {
                            name: "Total Matches won in 60 seconds",
                            value: minutewins.minuteWinQuickmatch.toString(),
                            inline: true
                        },
                        {
                            name: "Sponsor contracts started",
                            value: sponsorstats.sponsorStarted.toString(),
                            inline: true
                        },
                        {
                            name: "Sponsor contracts completed",
                            value: sponsorstats.sponsorCompleted.toString(),
                            inline: true
                        },
                        {name: "Cosmetics", value: cosmeticAmount.toString(), inline: true},
                    )
                const page10 = new EmbedBuilder()
                    .setTitle('Map stats')
                    .addFields(
                        {name: "Total games played in Arena 8", value: mapstats.arenaeightPlayed, inline: true},
                        {name: "Total games played in Acapulco", value: mapstats.acapulcoPlayed, inline: true},
                        {
                            name: "Total games played in Acapulco 2v2",
                            value: mapstats.acapulcoPlayed2v2Played.toString(),
                            inline: true
                        },
                        {
                            name: "Total games played in Skatepark",
                            value: mapstats.acapulcoSkateparkPlayed,
                            inline: true
                        },
                        {name: "Total games played in Bangkok", value: mapstats.bangkokPlayed, inline: true},
                        {name: "Total games played in Brooklyn", value: mapstats.brooklynPlayed, inline: true},
                        {name: "Total games played in Chichenitza", value: mapstats.chichenitzaPlayed, inline: true},
                        {name: "Total games played in China", value: mapstats.chinaplayed, inline: true},
                        {name: "Total games played in Japan", value: mapstats.japanPlayed, inline: true},
                        {name: "Total games played in Mexico", value: mapstats.mexicoPlayed, inline: true},
                        {name: "Total games played in Staten Island", value: mapstats.statenislandPlayed, inline: true},
                        {name: "Total games played in Venice Beach", value: mapstats.venicebeachPlayed, inline: true},
                        {name: "Total games played in Pinball Stadium", value: mapstats.pinballPlayed, inline: true},
                        {name: "Total games played in Pixel City", value: mapstats.pixelCityPlayed, inline: true},
                        {name: "Total games played in Arcadia", value: mapstats.arcadiaPlayed, inline: true},
                    )

                // Timeout page
                const page11 = new EmbedBuilder()
                    .setTitle('Timed out')
                    .setDescription('The stat command timed out, please use the command again')
                    .setTimestamp()
                    .setColor('FF1653')
                    .setFooter({text: 'Stat command timed out'})


                let pages = [page1, page2, page3, page4, page5, page6, page7, page8, page9, page10]
                let pagedescriptions = [
                    // This array is used to store the descriptions of the pages
                    'The most important stats',
                    'Stats for the ranked mode',
                    'Stats for the quickmatch mode',
                    'Stats for the exotic modes',
                    'Stats about times',
                    'Stats about distances',
                    'Stats about grabs, dodges, tackles, stuns and emotes',
                    'Stats about goals, gates and percentages',
                    'Stats without a clear category',
                    'Stats for the individual maps',
                ]

                // Adding attributes to the pages so I dont have to add them one by one
                pages.forEach(page => {
                    page.setColor('#FF1653')
                    page.setDescription('Here are the stats for ' + "***" + name + "***" + " on " + "***" + platformEdit + "***" + "\n" + "**includes custom matches which may change some values and calculations.*")
                    page.setFooter({text: 'Page ' + (pages.indexOf(page) + 1) + ' of ' + pages.length + " • Get info about the bot with /info"})
                })

                const buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId('first').setStyle(ButtonStyle.Secondary).setEmoji('⏪'),
                        new ButtonBuilder().setCustomId('previous').setStyle(ButtonStyle.Danger).setEmoji('⬅'),
                        new ButtonBuilder().setCustomId('next').setStyle(ButtonStyle.Success).setEmoji('➡'),
                        new ButtonBuilder().setCustomId('last').setStyle(ButtonStyle.Secondary).setEmoji('⏩'),
                    )

                // Array with all page titles
                let pageTitles = []
                pages.forEach(page => {
                    pageTitles.push(page.data.title)
                })


                // Adding the page labels and their index to an object
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


                await interaction.editReply({embeds: [page1], components: [selectmenu, buttons]})

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
                    page11.setTimestamp()
                        await interaction.editReply({embeds: [page11], components: []})
                    }
                )


            }
        }

    },
}