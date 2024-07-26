const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const flip = require('flip-text');

module.exports = {
    name: 'flip',
    description: 'Flip the provided text.',
    category: 'Fun',
    dmPermission: false,
    defaultMemberPermissions: null,
    nsfw: false,
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

    async run(interactionOrMessage, args) {
        const text = interactionOrMessage.options ? interactionOrMessage.options.getString("textflip") : args.join(" ");

        if (!text) {
            const response = "You need to provide text to flip. Use `.flip <your text>`.";
            if (interactionOrMessage.reply) {
                return interactionOrMessage.reply(response);
            } else {
                return interactionOrMessage.channel.send(response);
            }
        }

        const flippedText = flip(text);

        const EmbedFlip = new EmbedBuilder()
            .setTitle("🔄 Flipped Text")
            .setColor("#00A705")
            .setDescription(`
\`\`\`
${flippedText}
\`\`\`
            `)
            .setFooter({ text: `Requested by ${interactionOrMessage.user ? interactionOrMessage.user.tag : interactionOrMessage.author.tag}`, iconURL: `${interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        if (interactionOrMessage.reply) {
            interactionOrMessage.reply({ embeds: [EmbedFlip] });
        } else {
            interactionOrMessage.channel.send({ embeds: [EmbedFlip] });
        }
    }
};
