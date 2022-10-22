const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");




module.exports = {
    name: 'interactionCreate', once: false, async execute(interaction) {


        if (interaction.isButton()) {
            // if the button has the id "next", replace the embed with embed2
            if (interaction.customId === 'next') {

            }


        }



        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            // return interaction.reply({content: randomError(), ephemeral: true});
        }


    }
}