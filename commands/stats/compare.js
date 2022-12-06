const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder
} = require('discord.js');


const req = require('../../utils/requestHandler.js').stat


module.exports = {
    data: new SlashCommandBuilder()
        .setName('compare')
        .setDescription('Compare the Stats of two players.')
        .setDMPermission(true)
        // Player 1
        .addStringOption(option => option.setName('firstname').setDescription('The name of the first player.').setRequired(true))
        .addStringOption(option =>
            option.setName('firstplatform')
                .setDescription('The platform of the first player.')
                .setRequired(true)
                .addChoices(
                    {name: 'PC', value: 'uplay'},
                    {name: 'Playstation', value: 'psn'},
                    {name: 'Xbox', value: 'xbl'},)
        )

    // Player 2
        .addStringOption(option => option.setName('secondname').setDescription('The name of the second player.').setRequired(true))
        .addStringOption(option =>
            option.setName('secondplatform')
                .setDescription('The platform of the secpmd player.')
                .setRequired(true)
                .addChoices(
                    {name: 'PC', value: 'uplay'},
                    {name: 'Playstation', value: 'psn'},
                    {name: 'Xbox', value: 'xbl'},)
        )


    ,
    async execute(interaction) {


        await interaction.deferReply();

        // P1
        const name1 = interaction.options.getString('firstname');
        const platform1 = interaction.options.getString('firstplatform');

        // P2
        const name2 = interaction.options.getString('secondname');
        const platform2 = interaction.options.getString('secondplatform');


        // re-defining platforms, more readable for the user.
        let platformEdit1 = platform1;
        if (platform1 === 'uplay') platformEdit1 = 'PC';
        if (platform1 === 'psn') platformEdit1 = 'Playstation';
        if (platform1 === 'xbl') platformEdit1 = 'Xbox';

        let platformEdit2 = platform2;
        if (platform2 === 'uplay') platformEdit2 = 'PC';
        if (platform2 === 'psn') platformEdit2 = 'Playstation';
        if (platform2 === 'xbl') platformEdit2 = 'Xbox';



        let stato = await req(name1, platform1);
        let stato2 = await req(name2, platform2);



        if (stato === undefined || stato2 === undefined) { // case if the user does not exist
            if (stato === undefined) {
                await interaction.editReply({content: `The user ${name1} on ${platformEdit1} does not exist.`, ephemeral: true})
            } else if (stato2 === undefined) {
                await interaction.editReply({content: `The user ${name2} on ${platformEdit2} does not exist.`, ephemeral: true})
            }

        } else {


            function getStat(stat) {
                let array = [];
                if (stato[stat] !== undefined) {
                    array.push(stato[stat].value)
                } else {
                    array.push("0")
                }
                if (stato2[stat] !== undefined) {
                    array.push(stato2[stat].value)
                } else {
                    array.push("0")
                }
                return array;
            }




            if ( Number(getStat('playtimeAbsolute')[0]) === 0 || Number(getStat('playtimeAbsolute')[1]) === 0) {
                if (Number(getStat('playtimeAbsolute')[0]) === 0) {
                    await interaction.editReply({content: `${name1} on ${platformEdit1} has not played any matches.`, ephemeral: true})
                } else if (Number(getStat('playtimeAbsolute')[1]) === 0) {
                    await interaction.editReply({content: `${name2} on ${platformEdit2} has not played any matches.`, ephemeral: true})
                }

            } else {

                let winrate1 = (getStat('MatchResult.endreason.Win')[0] / getStat('MatchPlayed')[0] * 100).toFixed(2);
                let winrate2 = (getStat('MatchResult.endreason.Win')[1] / getStat('MatchPlayed')[1] * 100).toFixed(2);

                let totaltime1 =  ((Number(getStat('progressionPlaytimeGamemode.gamemodeid.Exotic')[0]) + Number(getStat('progressionPlaytimeGamemode.gamemodeid.Ranked')[0]) + Number(getStat('progressionPlaytimeGamemode.gamemodeid.QuickMatch')[0])) / 60 / 60).toFixed(2) + " hrs"
                let totaltime2 =  ((Number(getStat('progressionPlaytimeGamemode.gamemodeid.Exotic')[1]) + Number(getStat('progressionPlaytimeGamemode.gamemodeid.Ranked')[1]) + Number(getStat('progressionPlaytimeGamemode.gamemodeid.QuickMatch')[1])) / 60 / 60).toFixed(2) + " hrs"




                let embed = new EmbedBuilder()
                    .setTitle('Compare Stats')
                    .setDescription(`Comparing the stats of ${name1} on ${platformEdit1} and ${name2} on ${platformEdit2} \n **includes custom matches which may change some values and calculations.*`)
                    .setTimestamp()
                    .setColor('FF1653')
                    // The fields have to be this messy, cause the max amount per row is three and discord does not allow line breaks.
                    .addFields(
                        {name: `${name1}'s MMR`, value: getStat('tsrmeandef')[0], inline: true},
                        {name: `${name2}'s MMR`, value: getStat('tsrmeandef')[1], inline: true},
                        {name: '\u200B', value: '\u200B'},
                        {name: `Goals`, value: getStat('progressionGoalsGlobal')[0], inline: true},
                        {name: `Goals`, value: getStat('progressionGoalsGlobal')[1], inline: true},
                        {name: '\u200B', value: '\u200B'},
                        {name: `Winrates`, value: `${winrate1}%`, inline: true},
                        {name: `Winrates`, value: `${winrate2}%`, inline: true},
                        {name: '\u200B', value: '\u200B'},
                        {name: `Passes`, value: getStat('progressionPassGlobal')[0], inline: true},
                        {name: `Passes`, value: getStat('progressionPassGlobal')[1], inline: true},
                        {name: '\u200B', value: '\u200B'},
                        {name: `Fans`, value: getStat('progressionTotalFans')[0], inline: true},
                        {name: `Fans`, value: getStat('progressionTotalFans')[1], inline: true},
                        {name: '\u200B', value: '\u200B'},
                        {name: `Playtimes`, value: totaltime1, inline: true},
                        {name: `Playtimes`, value: totaltime2, inline: true},
                        {name: '\u200B', value: '\u200B'},
                        {name: `Tackles`, value: getStat('progressionTacklesGlobal')[0], inline: true},
                        {name: `Tackles`, value: getStat('progressionTacklesGlobal')[1], inline: true},
                        {name: '\u200B', value: '\u200B'},
                        {name: `Matches Played`, value: getStat('MatchPlayed')[0], inline: true},
                        {name: `Matches Played`, value: getStat('MatchPlayed')[1], inline: true},
                    )




await interaction.editReply({embeds: [embed]})




                    }


        }

    },
}