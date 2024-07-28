const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "test-button",
  description: "Allows you to test the button.",
  category: "Utility",
  dmPermission: false,
  defaultMemberPermissions: null,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName("test-button")
    .setDescription("Allows you to test the button.")
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

    const testButton = new ButtonBuilder()
      .setCustomId("test-button")
      .setEmoji("<:BUTTON:1266890675362992129>")
      .setLabel("Click the button!")
      .setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents(testButton);

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

    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply({
        embeds: [embedTestButton],
        components: [actionRow],
      });
    } else {
      await interactionOrMessage.channel.send({
        embeds: [embedTestButton],
        components: [actionRow],
      });
    }
  },
};
