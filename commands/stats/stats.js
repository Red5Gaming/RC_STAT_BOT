const {SlashCommandBuilder, EmbedBuilder, Embed, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const Pagination = require('customizable-discordjs-pagination');

const { QuickDB } = require("quick.db");
const db = new QuickDB();
const configDB = db.table("configDB")

const req = require('../../utils/requestHandler.js')

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
        // if(interaction.channel.id != '1004081020062138370' || '1035951943698358322' || '1035605108274253897') return interaction.reply({content: 'Please use this command in <#1004081020062138370>', ephemeral: true});

        let serverStatChannel = await configDB.get(interaction.guildId + "_config.statChannel")
        // check if the message was sent in a channel that is set as a stat channel, if serverStatChannel is undefined, the server is not in the db and the command can be used everywhere. If the command is not used in a stat channel, tell the user that the command can only be used in a stat channel.
        if (serverStatChannel !== undefined && !serverStatChannel.includes(interaction.channel.id)) return interaction.reply({content: 'Please use this command in a stat channel.', ephemeral: true});



        console.log(serverStatChannel)




        await interaction.deferReply();

        const name = interaction.options.getString('name');
        const platform = interaction.options.getString('platform');

        // edit platform, so PC = PC, PSN = Playstation, XBL = Xbox, SWITCH = Nintendo Switch
        let platformEdit = platform;
        if(platform == 'uplay') platformEdit = 'PC';
        if(platform == 'psn') platformEdit = 'Playstation';
        if(platform == 'xbl') platformEdit = 'Xbox';
       // if(platform == 'switch') platformEdit = 'Nintendo Switch';


        console.log(name);
        console.log(platform);
        try {
            let stato = await req(name, platform);

            function getStat(stat) {
                if (stato[stat] !== undefined) {
                    return (stato[stat].value).toString();
                } else {
                    return "0";
                }
            }

            function addStats(...args) {
              // the args are the name of stats, add all their values together and return the total
                let total = 0;
                for (let i = 0; i < args.length; i++) {
                    total += Number(getStat(args[i]));
                }
                return total;
            }

            console.log("Total" + addStats('performanceEmoteGamemode.gamemodeid.Exotic', 'performanceEmoteGamemode.gamemodeid.QuickMatch', 'performanceEmoteGamemode.gamemodeid.Ranked'))


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

            console.log(gates.calculatedgates)

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
                 calculateddistance:  (addStats('performanceDistanceGamemode.gamemodeid.Exotic', 'performanceDistanceGamemode.gamemodeid.QuickMatch', 'performanceDistanceGamemode.gamemodeid.Ranked') / 1000).toFixed(2) + " km"
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
                 venicebeachPlayed: getStat('progressionEnvironmentPlayedSpecific.map.Arena_VeniceBeach')
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



//             console.log(typeof matchesStats.winpercentage)
// console.log(matchesStats.winpercentage)





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

            const page0 = new EmbedBuilder()
                .setTitle('RC Stat Bot')
                .setURL('https://github.com/Red5Gaming/RC_STAT_BOT')
                .setDescription('This bot allows you to view the stats of any player on any platform, right here in discord.')
                .addFields({
                    name: 'How does this work❓',
                    value: 'Under this message you see two things.\n 1. 4 Buttons, the outer most buttons get you to the first and last page. The inner two one page forward and one page back.\n 2. A dropdown menu that allows you to jump to any page.'
                })
                .addFields({
                    name: '❗Disclaimers❗',
                    value: 'Some values might be wrong / don\'t add up. I am currently talking with ubisoft employees to get this fixed.\n ' +
                        'As some sort of "substitution" I added a "calculated" value for some stats. These values are not directly provided by ubisoft, but are calculated with the present values from each individual gamemode. ' +
                        'This is not a perfect solution, but it is the best I can do for now.\n ' +
                        'I can\'t guarantee that all values are correct, but I am working on it. \n \n' +
                        'Although it is possible to play Roller Champions on the Nintendo Switch, the API behaves differently for this platform.' +
                        ' This means that (untill further notice) the Nintendo Switch is not supported by this bot. \n'+
                        'If you have any questions, suggestions or feedback, feel free to contact me on discord: RedGaming#2083'
                })
                .addFields({
                    name: 'The project💻',
                    value: "This project is open source under the Mozilla 2.0 license. You can find the source code by clicking the title of this message."
                })
                .setColor('#FF1653')
            // every page is 3x4 fields
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
                .setColor('#FF1653')
            const page2 = new EmbedBuilder()
                .setTitle('Ranked Stats')
                .addFields(
                    {name: "Ranked Wins", value: rankedOutcomes.rankedDraws, inline: true},
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
                    {name: "Total Matches won in 60 seconds", value: minutewins.minuteWinQuickmatch.toString(), inline: true},
                    {name: "Sponsor contracts started", value: sponsorstats.sponsorStarted.toString(), inline: true},
                    {name: "Sponsor contracts completed", value: sponsorstats.sponsorCompleted.toString(), inline: true},
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
                    {name: "Total games played in Skatepark", value: mapstats.acapulcoSkateparkPlayed, inline: true},
                    {name: "Total games played in Bangkok", value: mapstats.bangkokPlayed, inline: true},
                    {name: "Total games played in Brooklyn", value: mapstats.brooklynPlayed, inline: true},
                    {name: "Total games played in Chichenitza", value: mapstats.chichenitzaPlayed, inline: true},
                    {name: "Total games played in China", value: mapstats.chinaplayed, inline: true},
                    {name: "Total games played in Japan", value: mapstats.japanPlayed, inline: true},
                    {name: "Total games played in Mexico", value: mapstats.mexicoPlayed, inline: true},
                    {name: "Total games played in Staten Island", value: mapstats.statenislandPlayed, inline: true},
                    {name: "Total games played in Venice Beach", value: mapstats.venicebeachPlayed, inline: true},
                )


            let pages = [page0, page1, page2, page3, page4, page5, page6, page7, page8, page9, page10]

            pages.forEach(page => {
                page.setColor('#FF1653')
                page.setDescription('Here are the stats for ' + "***" + name + "***" + " on " + "***" + platformEdit + "***")
            })



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
                content: 'You managed to produce an error, that was not supposed to happen.',
                ephemeral: true
            });
        }
        // end try / catch
    },
}