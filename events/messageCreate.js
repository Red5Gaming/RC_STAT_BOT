const {QuickDB} = require("quick.db");
const db = new QuickDB();
const filterList = db.table("configDB");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message) {


        if(message.author.bot) return;



        let allbadwords = await filterList.get(`${message.guild.id}_config.words`);
        let logchannelid = await filterList.get(`${message.guild.id}_config.logchannel`);
        let logchannel = message.client.channels.cache.get(logchannelid);

        let formattedMessageContent = message.content.replace(/\s/g, '').toLowerCase(); // makes messages look like "hellothisisastring"



        let blacklisted = allbadwords
        let foundInText = false;
        for (let i in blacklisted) {
            if (formattedMessageContent.includes(blacklisted[i].toLowerCase())) foundInText = true;
        }
        if (foundInText) {
            message.delete();


            let filterCaughtEmbed = new EmbedBuilder();
            filterCaughtEmbed.setTitle("Der Filter hat eine Nachricht blockiert!");
            filterCaughtEmbed.setDescription(`Die Nachricht: \`${message.content}\` wurde blockiert!`);
            filterCaughtEmbed.addFields({name: `Autor:`, value: `${message.author.tag}`}, {name: `Inhalt:`, value: `${message.content}`});
            filterCaughtEmbed.setColor("#ff0000");
            filterCaughtEmbed.setTimestamp();
            logchannel.send({embeds: [filterCaughtEmbed]});

        }


    }
}