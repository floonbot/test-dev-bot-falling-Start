const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "test-select",
  description: "Allows you to choose an option.",
  category: "Utility",
  dmPermission: false,
  defaultMemberPermissions: null,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName("test-select")
    .setDescription("Allows you to choose an option.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null)
    .setNSFW(false),

  async run(interactionOrMessage) {
    if (
      interactionOrMessage.user &&
      interactionOrMessage.user.id !== process.env.OWNER_ID
    ) {
      return interactionOrMessage.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    if (
      interactionOrMessage.author &&
      interactionOrMessage.author.id !== process.env.OWNER_ID
    ) {
      return interactionOrMessage.channel.send(
        "You do not have permission to use this command."
      );
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId("starter")
      .setPlaceholder("Make a choice...")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Option 1")
          .setValue("option1")
          .setEmoji("<:selecMenu:1266894242475671612>"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Option 2")
          .setValue("option2")
          .setEmoji("<:selecMenu:1266894242475671612>"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Option 3")
          .setValue("option3")
          .setEmoji("<:selecMenu:1266894242475671612>")
      );

    const row = new ActionRowBuilder().addComponents(select);

    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply({
        content: "<:selecMenu:1266894242475671612> Choose an option:",
        components: [row],
      });
    } else {
      await interactionOrMessage.channel.send({
        content: "<:selecMenu:1266894242475671612> Choose an option:",
        components: [row],
      });
    }
  },
};
