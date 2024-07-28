const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  version,
} = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const ms = require("ms");
const os = require("node:os");
const osu = require("node-os-utils");
const {
  formatBytesStatistics,
} = require("../../libs/functions/functionFormatBytesStatistics");

module.exports = {
  name: "statistics",
  description: "Display system statistics.",
  category: "Info",
  dmPermission: false,
  defaultMemberPermissions: null,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName("statistics")
    .setDescription("Display system statistics.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null)
    .setNSFW(false),

  async run(interactionOrMessage) {
    const duration = moment
      .duration(interactionOrMessage.client.uptime)
      .format("**D [D], H [H], m [M], s [S]**");
    const cpuUsage = await osu.cpu.usage();

    const row = new ButtonBuilder()
      .setCustomId("refresh-statistics")
      .setEmoji("🔁")
      .setLabel("Refresh")
      .setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents(row);

    const embed = new EmbedBuilder()
      .setTitle("<:stat:1267060339200102420>_ System Statistics")
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
      .setDescription(
        `<:PC:1266899059717832817> <:ping:1266911209970471116> <:cpu:1266900531159236621>
\`\`\`asciidoc
• Platform - Arch :: ${process.platform} - ${process.arch}
• Bot Uptime :: ${duration}
• Memory Usage :: ${formatBytesStatistics(process.memoryUsage.rss())}
• Process Uptime :: ${ms(Math.round(process.uptime() * 1000), { long: true })}
• System Uptime :: ${ms(os.uptime() ?? 0, { long: true })}
• CPU Usage:: ${cpuUsage}%
• Node.js Version :: ${process.version}
• Discord.js Version :: v${version}
\`\`\`
            `
      )
      .setFooter({
        text: `statistics used by ${
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
      interactionOrMessage.reply({ embeds: [embed], components: [actionRow] });
    } else {
      interactionOrMessage.channel.send({
        embeds: [embed],
        components: [actionRow],
      });
    }
  },
};
