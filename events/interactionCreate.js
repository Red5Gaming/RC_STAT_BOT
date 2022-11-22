const { MessageEmbed, MessageActionRow, MessageButton, PermissionsBitField } = require("discord.js");

const {QuickDB} = require("quick.db");
const db = new QuickDB();
const configDB = db.table("configDB")

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    // check if the bot has the permissions to send messages in the channel
    if(!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;


    try {

      let serverStatChannel = await configDB.get(interaction.guildId + "_config.statChannel")
      let channelNames = []
      if(serverStatChannel) {
        for (let i = 0; i < serverStatChannel.length; i++) {
          channelNames.push(`<#${serverStatChannel[i]}>`)
        }
      }
      // check for the name of the command
      let restrictionCommands = ["info", "stats"]

      if(restrictionCommands.includes(interaction.commandName)) {
        if (serverStatChannel !== undefined && !serverStatChannel.includes(interaction.channel.id)) return interaction.reply({
          content: 'Please use this command in one of the following channels: ' + channelNames.join(', '),
          ephemeral: true
        });
      }



      await command.execute(interaction);

    } catch (error) {
      console.error(error);
      // return interaction.reply({content: randomError(), ephemeral: true});
    }
  },
};
