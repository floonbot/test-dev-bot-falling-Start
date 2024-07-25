const { ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { generateRandomNumber } = require('../../libs/functions/functionGenerateRandomNumber');

module.exports = {

    name: "random-number",
    type: ComponentType.Button,

    async run(interaction) {

        const randomNumber = generateRandomNumber();

        const randomNumberButton = new ButtonBuilder()
            .setCustomId('random-number')
            .setEmoji("🎲")
            .setLabel('Reroll')
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


        await interaction.message.edit(
            {
                embeds: [randomEmbed],
                components: [actionRow]
            });
        await interaction.deferUpdate();
    }
};