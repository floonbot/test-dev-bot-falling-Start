const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const { generateRandomNumber } = require('../../libs/functions/math');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("random-number")
        .setDescription("Chooses a random number.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false),

    async run(interaction) {

        const randomNumber = generateRandomNumber();

        const randomNumberButton = new ButtonBuilder()
            .setCustomId('random-number')
            .setEmoji("🎲")
            .setLabel('randomNumber')
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder()
            .addComponents(randomNumberButton);

        const randomEmbed = new EmbedBuilder()
            .setTitle(`-🎲 The bot is choosing the number`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }))
            .setColor("#00A705")
            .setDescription(`
\`\`\`asciidoc
• Obtained :: ${randomNumber}
\`\`\`
                            `)
            .setFooter({ text: `Command executed by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        interaction.reply(
            { embeds: [randomEmbed], components : [actionRow] }
        );
    }
}
