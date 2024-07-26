const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { generateRandomNumber } = require('../../libs/functions/functionGenerateRandomNumber');

module.exports = {
    name: 'random-number',
    description: 'Chooses a random number.',
    category: 'Aleatoire',
    dmPermission: false,
    defaultMemberPermissions: null,
    nsfw: false,
    data: new SlashCommandBuilder()
        .setName("random-number")
        .setDescription("Chooses a random number.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false),

    async run(interactionOrMessage) {
        const randomNumber = generateRandomNumber();

        const randomNumberButton = new ButtonBuilder()
            .setCustomId('random-number')
            .setEmoji("🎲")
            .setLabel('randomNumber')
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder()
            .addComponents(randomNumberButton);

        const randomEmbed = new EmbedBuilder()
            .setTitle("-🎲 The bot is choosing the number")
            .setThumbnail(interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 256, format: "png" }))
            .setColor("#00A705")
            .setDescription(`
\`\`\`asciidoc
• Obtained :: ${randomNumber}
\`\`\`
            `)
            .setFooter({ text: `Command executed by ${interactionOrMessage.user ? interactionOrMessage.user.tag : interactionOrMessage.author.tag}`, iconURL: `${interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        if (interactionOrMessage.reply) {
            interactionOrMessage.reply({ embeds: [randomEmbed], components: [actionRow] });
        } else {
            interactionOrMessage.channel.send({ embeds: [randomEmbed], components: [actionRow] });
        }
    }
};
