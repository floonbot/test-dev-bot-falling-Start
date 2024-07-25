const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { rollDice } = require('../../libs/functions/functionRollDice');

module.exports = {

    data: new SlashCommandBuilder()
        .setName("dice")
        .setDescription("Rolls a die between 1 and 6.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false),

    async run(interaction) {

        const random = rollDice();

        const diceButton = new ButtonBuilder()
            .setCustomId('dice')
            .setEmoji("🎲")
            .setLabel('Reroll')
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder()
            .addComponents(diceButton);

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

        await interaction.reply(
            {
                embeds: [DiceEmbed],
                components: [actionRow]
            }
        );
    }
};
