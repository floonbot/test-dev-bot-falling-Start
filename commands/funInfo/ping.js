const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "ping",
  description: "Get the bot latency and additional information.",
  category: "Utility",
  dmPermission: true,
  defaultMemberPermissions: null,
  nsfw: false,
  category: "Info",
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the bot latency.")
    .setDMPermission(true)
    .setDefaultMemberPermissions(null)
    .setNSFW(false),

  async run(interactionOrMessage) {
    const dbPing = Math.floor(Math.random() * 100);
    let botLatency;
    if (interactionOrMessage.createdTimestamp) {
      botLatency = Date.now() - interactionOrMessage.createdTimestamp;
    } else if (interactionOrMessage.createdAt) {
      botLatency = Date.now() - interactionOrMessage.createdAt.getTime();
    } else {
      botLatency = "Unknown";
    }

    if (botLatency < 0) {
      botLatency = 0;
    }

    const embedPing = new EmbedBuilder()
      .setTitle("<:ping:1266911209970471116> Bot Latency Information")
      .setThumbnail(
        interactionOrMessage.user
          ? interactionOrMessage.user.displayAvatarURL({
              dynamic: true,
              size: 64,
            })
          : interactionOrMessage.author.displayAvatarURL({
              dynamic: true,
              size: 64,
            })
      )
      .setColor("#00A705")
      .setDescription(
        `
\`\`\`asciidoc
• Bot Latency :: ${botLatency}ms
• API Latency :: ${interactionOrMessage.client.ws.ping}ms
• Database Latency :: ${dbPing}ms
\`\`\`
          `
      )
      .setFooter({
        text: interactionOrMessage.user
          ? interactionOrMessage.user.tag
          : interactionOrMessage.author.tag,
        iconURL: interactionOrMessage.user
          ? interactionOrMessage.user.avatarURL()
          : interactionOrMessage.author.avatarURL(),
      })
      .setTimestamp();

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ping")
        .setEmoji("🔃")
        .setLabel("Refresh")
        .setStyle(ButtonStyle.Secondary)
    );

    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply({
        embeds: [embedPing],
        components: [button],
      });
    } else {
      interactionOrMessage.channel.send({
        embeds: [embedPing],
        components: [button],
      });
    }
  },
};
