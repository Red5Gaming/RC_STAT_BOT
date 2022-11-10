const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    // check if the bot has the permissions to send messages in the channel
    if (!interaction.channel.permissionsFor(interaction.guild.me).has("SEND_MESSAGES")) return;



    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      interaction.client.user.cache.get('355051285621243905').send(error);
      // return interaction.reply({content: randomError(), ephemeral: true});
    }
  },
};
