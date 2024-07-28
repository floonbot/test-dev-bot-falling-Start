const figlet = require("figlet");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "art-text",
  description: "Create the text art.",
  category: "Fun",
  dmPermission: false,
  defaultMemberPermissions: null,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName("art-text")
    .setDescription("Create the text art.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null)
    .setNSFW(false)
    .addStringOption((opt) =>
      opt.setName("text").setDescription("What is the text?").setRequired(true)
    ),
  async run(interactionOrMessage, args) {
    const text = interactionOrMessage.options
      ? interactionOrMessage.options.getString("text")
      : args.join(" ");

    if (!text) {
      const response =
        "You need to provide text for this command. Use `.art-text <your text>`.";
      if (interactionOrMessage.reply) {
        return interactionOrMessage.reply(response);
      } else {
        return interactionOrMessage.channel.send(response);
      }
    }

    figlet(text, (err, data) => {
      if (err) {
        console.error("Error generating ASCII art:", err);
        const response = "An error occurred while generating the text art.";
        if (interactionOrMessage.reply) {
          return interactionOrMessage.reply(response);
        } else {
          return interactionOrMessage.channel.send(response);
        }
      }

      const embed = new EmbedBuilder()
        .setTitle("<:DALLE2024072712:1266711743804080158>- Text Art")
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
        .setColor("#00A705")
        .setDescription(`\`\`\`${data}\`\`\``)
        .setFooter({
          text: `art-text used by ${
            interactionOrMessage.user
              ? interactionOrMessage.user.tag
              : interactionOrMessage.author.tag
          }`,
          iconURL: interactionOrMessage.user
            ? interactionOrMessage.user.displayAvatarURL({
                dynamic: true,
                size: 128,
                format: "png",
              })
            : interactionOrMessage.author.displayAvatarURL({
                dynamic: true,
                size: 128,
                format: "png",
              }),
        })
        .setTimestamp();

      if (interactionOrMessage.reply) {
        interactionOrMessage.reply({ embeds: [embed] });
      } else {
        interactionOrMessage.channel.send({ embeds: [embed] });
      }
    });
  },
};
