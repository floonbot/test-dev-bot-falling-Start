const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const {
  formatBytesMachineInfo,
} = require("../../libs/functions/functionFormatBytesMachineInfo");
const si = require("systeminformation");

module.exports = {
  name: "machine-info",
  description: "Displays machine information.",
  category: "Info",
  dmPermission: false,
  defaultMemberPermissions: null,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName("machine-info")
    .setDescription("Displays machine information.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null)
    .setNSFW(false),

  async run(interactionOrMessage) {
    if (interactionOrMessage.deferReply)
      await interactionOrMessage.deferReply();

    const [cpu, mem, os, disk, gpu] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.osInfo(),
      si.diskLayout(),
      si.graphics(),
    ]);

    const row = new ButtonBuilder()
      .setCustomId("refresh-machine-info")
      .setEmoji("🔁")
      .setLabel("Refresh")
      .setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents(row);

    const embed = new EmbedBuilder()
      .setTitle("<:PC:1266899059717832817>- Machine Information")
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
        `<:cpu:1266900531159236621> <:ram:1266898033321447498> <:PC:1266899059717832817> <:SSD:1266902526733844490> <:gpu:1266902106573373503>
\`\`\`asciidoc
• CPU :: ${cpu.brand} (${cpu.cores} cores, ${cpu.speed} GHz)
• RAM :: Total: ${formatBytesMachineInfo(mem.total)}
         Used: ${formatBytesMachineInfo(mem.used)}
         Free: ${formatBytesMachineInfo(mem.free)}
• System :: Hostname: ${os.hostname} ${os.distro}
• Disk :: Type: ${disk[0].type} ${disk[0].name}
• GPU :: Model: ${gpu.controllers[0].model}
\`\`\`
            `
      )
      .setFooter({
        text: `manchine-info by ${
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

    if (interactionOrMessage.followUp) {
      interactionOrMessage.followUp({
        embeds: [embed],
        components: [actionRow],
      });
    } else {
      interactionOrMessage.channel.send({
        embeds: [embed],
        components: [actionRow],
      });
    }
  },
};
