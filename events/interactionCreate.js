const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const {randomError} = require("../langstring");

const getLocale = require('./../langstring.js').randomError;

module.exports = {
    name: 'interactionCreate', once: false, async execute(interaction) {

        console.log(randomError("en"))

        if (interaction.isButton()) {
            let problemtypes = ["Spam", "Mobbing", "Frage"]
            let everyoneRole = interaction.guild.roles.cache.find(r => r.name === '@everyone');

            let ticketCategory = await interaction.guild.channels.cache.find(c => c.name === "Tickets" && c.type === "GUILD_CATEGORY");
            console.log(ticketCategory)
            if (interaction.customId === 'V1') {


                await interaction.reply({content: "Ticket created", ephemeral: true})
                await console.log("DEBUG")
                // create a channel under the category "Tickets"
                const ticketChannel = await interaction.guild.channels.create(`${interaction.user.username}`, {
                    type: "text", parent: ticketCategory.id, permissionOverwrites: [{
                        id: everyoneRole.id, deny: ['VIEW_CHANNEL']
                    }, {
                        id: interaction.user.id, allow: ['VIEW_CHANNEL']

                    }]
                })

                const ticketEmbed = new MessageEmbed()
                    .setTitle('Ticket')
                    .setDescription(`Ticket von: ${interaction.user.username}. Problem: ${problemtypes[0]}`)
                    .setColor('#0099ff')

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('dltTicket')
                            .setLabel('Ticket schließen')
                            .setStyle('DANGER'),
                    )

                await ticketChannel.send({embeds: [ticketEmbed], components: [row]})

                // send the embed to the channel
                await ticketChannel.send({embeds: [ticketEmbed], components: [row]})

            } else if (interaction.customId === 'V2') {


                await interaction.reply({content: "Ticket created", ephemeral: true})
                await console.log("DEBUG")
                // create a channel under the category "Tickets"
                const ticketChannel = await interaction.guild.channels.create(`${interaction.user.username}`, {
                    type: "text", parent: ticketCategory.id, permissionOverwrites: [{
                        id: everyoneRole.id, deny: ['VIEW_CHANNEL']
                    }, {
                        id: interaction.user.id, allow: ['VIEW_CHANNEL']

                    }]
                })

                const ticketEmbed = new MessageEmbed()
                    .setTitle('Ticket')
                    .setDescription(`Ticket von: ${interaction.user.username}. Problem: ${problemtypes[1]}`)
                    .setColor('#0099ff')

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('dltTicket')
                            .setLabel('Ticket schließen')
                            .setStyle('DANGER'),
                    )

                await ticketChannel.send({embeds: [ticketEmbed], components: [row]})


                // send the embed to the channel
                await ticketChannel.send({embeds: [ticketEmbed], components: [row]})
            } else if (interaction.customId === 'V3') {

                await interaction.reply({content: "Ticket created", ephemeral: true})
                await console.log("Ticket created")
                // create a channel under the category "Tickets"
                const ticketChannel = await interaction.guild.channels.create(`${interaction.user.username}`, {
                    type: "text", parent: ticketCategory.id, permissionOverwrites: [{
                        id: everyoneRole.id, deny: ['VIEW_CHANNEL']
                    }, {
                        id: interaction.user.id, allow: ['VIEW_CHANNEL']

                    }]
                })

                const ticketEmbed = new MessageEmbed()
                    .setTitle('Ticket')
                    .setDescription(`Ticket von: ${interaction.user.username}. Problem: ${problemtypes[2]}`)
                    .setColor('#0099ff')

                // add a action row with one button to the embed
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('dltTicket')
                            .setLabel('Ticket schließen')
                            .setStyle('DANGER'),
                    )

                await ticketChannel.send({embeds: [ticketEmbed], components: [row]})
            } else if (interaction.customId === 'dltTicket') {
                await interaction.channel.delete()
            }




        } // end of 'if isButton'

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            return interaction.reply({content: randomError(), ephemeral: true});
        }


    }
}