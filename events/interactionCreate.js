const {PermissionsBitField } = require("discord.js");

const {QuickDB} = require("quick.db");
const db = new QuickDB({filePath: 'db/json.sqlite'});
const configDB = db.table("configDB")

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

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

      await interaction.client.users.send('355051285621243905', 'There has been an error: ' + error)

      // check if the interaction has already been replied to, need to do so we know if we should followup or reply
      if(interaction.replied) {
        await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
      } else {
        await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
      }



    }
  },
};
