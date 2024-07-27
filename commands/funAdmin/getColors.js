const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "colors",
  description: "Displays a sample of all available colors.",
  category: "Utility",
  dmPermission: true,
  defaultMemberPermissions: null,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName("colors")
    .setDescription("Displays a sample of all available colors.")
    .setDMPermission(true),

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

    const colorSample = Object.entries(global.colors)
      .map(([name, code]) => `${code}This is ${name}${global.colors.reset}`)
      .join("\n");

    const embedColors = new EmbedBuilder()
      .setTitle(
        "<:DALLE2024072712:1266711743804080158>- Displays a sample of all available colors"
      )
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
        Here is a sample of all colors in your program console.
        `
      )
      .setFooter({
        text: `getColors by ${
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
        embeds: [embedColors],
      });
      console.log(colorSample);
    } else {
      await interactionOrMessage.channel.send({ embeds: [embedColors] });
      console.log(colorSample);
    }
  },
};
