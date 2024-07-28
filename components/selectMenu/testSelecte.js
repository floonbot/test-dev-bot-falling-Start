const { ComponentType } = require("discord.js");

module.exports = {
  name: "starter",
  type: ComponentType.StringSelect,

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

    await interactionOrMessage.message.edit({
      content: `<:selecMenu:1266894242475671612>- The option has been chosen!`,
    });
    await interactionOrMessage.deferUpdate();
  },
};
