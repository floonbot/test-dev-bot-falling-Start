const { ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { rollDice } = require('../../fonctions/math');

module.exports = {

    name: "dice",
    type: ComponentType.Button,

    async run(interaction) {

        const random = rollDice();

        const DiceEmbed = new EmbedBuilder()
            .setTitle(`-🎲 The interaction is rolling the dice`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }))
            .setColor("#00A705")
            .setDescription(`
\`\`\`asciidoc
• Result :: ${random}
\`\`\`
                            `)
            .setFooter({ text: `Dice rolled by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        const diceButton = new ButtonBuilder()
            .setCustomId('dice')
            .setEmoji("🎲")
            .setLabel('Reroll')
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder()
            .addComponents(diceButton);

        await interaction.message.edit(
            {
                embeds: [DiceEmbed],
                components: [actionRow]
            });
        await interaction.deferUpdate();
    }
};