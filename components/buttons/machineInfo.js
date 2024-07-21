const { ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { formatBytesMachineInfo } = require("../../libs/functions/allFormatBytes");
const si = require('systeminformation');

module.exports = {

    name: "refresh-machine-info",
    type: ComponentType.Button,

    async run(interaction) {

        const [cpu, mem, os, disk, gpu] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.osInfo(),
            si.diskLayout(),
            si.graphics()
        ]);

        const row = new ButtonBuilder()
            .setCustomId('refresh-machine-info')
            .setEmoji("🔁")
            .setLabel('Refresh')
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder()
            .addComponents(row);

        const embed = new EmbedBuilder()
            .setTitle("Get information de la machine")
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 64 }))
            .setColor("#00A705")
            .setDescription(`
\`\`\`asciidoc
• CPU :: ${cpu.brand} (${cpu.cores} cores, ${cpu.speed} GHz)

• RAM :: Total: ${formatBytesMachineInfo(mem.total)}
         Used: ${formatBytesMachineInfo(mem.used)}
         Free: ${formatBytesMachineInfo(mem.free)}

• System :: Hostname: ${os.hostname} ${os.distro}

• Disk :: Type: ${disk[0].type} ${disk[0].name}

• GPU :: Model: ${gpu.controllers[0].model}

                \`\`\`
                            `)
            .setFooter({ text: `${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
            .setTimestamp();

        await interaction.message.edit(
            {
                embeds: [embed],
                components: [actionRow]
            });
        await interaction.deferUpdate();
    }
};