const { ComponentType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "test-button",
  type: ComponentType.Button,

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

    const embedTestButton = new EmbedBuilder()
      .setTitle("<:BUTTON:1266890675362992129>- Test the button")
      .setColor("#00A705")
      .setThumbnail(
        interactionOrMessage.user
          ? interactionOrMessage.user.displayAvatarURL({
              dynamic: true,
              size: 256,
              format: "png",
            })
          : interactionOrMessage.author.displayAvatarURL({
              dynamic: true,
              size: 256,
              format: "png",
            })
      )
      .setDescription(
        `
\`\`\`asciidoc  
• Button :: click on the button below!
\`\`\`      
    `
      )
      .setFooter({
        text: `testButton by ${
          interactionOrMessage.user
            ? interactionOrMessage.user.tag
            : interactionOrMessage.author.tag
        }`,
        iconURL: `${
          interactionOrMessage.user
            ? interactionOrMessage.user.displayAvatarURL({
                dynamic: true,
                size: 128,
                format: "png",
              })
            : interactionOrMessage.author.displayAvatarURL({
                dynamic: true,
                size: 128,
                format: "png",
              })
        }`,
      })
      .setTimestamp();

    await interactionOrMessage.message.edit({ embeds: [embedTestButton] });
    await interactionOrMessage.deferUpdate();
  },
};
