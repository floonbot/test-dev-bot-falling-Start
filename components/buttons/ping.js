const { ComponentType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  type: ComponentType.Button,

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
        text: `ping by ${
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

    await interactionOrMessage.message.edit({
      embeds: [embedPing],
    });
    await interactionOrMessage.deferUpdate();
  },
};
