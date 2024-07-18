const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const flip = require('flip-text');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("flip")
        .setDescription("Flip the provided text.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false)
        .addStringOption(opt =>
            opt.setName("textflip")
                .setDescription("The text to flip?")
                .setRequired(true)
        ),

    async run(interaction) {
        const text = interaction.options.getString("textflip");
        const flippedText = flip(text);

        const EmbedFlip = new EmbedBuilder()
            .setTitle("🔄 Flipped Text")
            .setColor("#00A705")
            .setDescription(`
\`\`\`
${flippedText}
\`\`\`
            `)
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" }) })
            .setTimestamp();

        interaction.reply({ embeds: [EmbedFlip] });
    }
};
