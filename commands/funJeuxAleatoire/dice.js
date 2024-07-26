const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { rollDice } = require('../../libs/functions/functionRollDice');

module.exports = {
    name: 'dice',
    description: 'Rolls a die between 1 and 6.',
    category: 'Aleatoire',
    dmPermission: false,
    defaultMemberPermissions: null,
    nsfw: false,
    data: new SlashCommandBuilder()
        .setName("dice")
        .setDescription("Rolls a die between 1 and 6.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false),

    async run(interactionOrMessage) {
        const random = rollDice();

        const diceButton = new ButtonBuilder()
            .setCustomId('dice')
            .setEmoji("🎲")
            .setLabel('Reroll')
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder()
            .addComponents(diceButton);

        const DiceEmbed = new EmbedBuilder()
            .setTitle("-🎲 The interaction is rolling the dice")
            .setThumbnail(interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 256, format: "png" }))
            .setColor("#00A705")
            .setDescription(`
\`\`\`asciidoc
• Result :: ${random}
\`\`\`
            `)
            .setFooter({ text: `Dice rolled by ${interactionOrMessage.user ? interactionOrMessage.user.tag : interactionOrMessage.author.tag}`, iconURL: `${interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        if (interactionOrMessage.reply) {
            interactionOrMessage.reply({ embeds: [DiceEmbed], components: [actionRow] });
        } else {
            interactionOrMessage.channel.send({ embeds: [DiceEmbed], components: [actionRow] });
        }
    }
};
