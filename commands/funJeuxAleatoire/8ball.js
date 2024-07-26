const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const response = ["Yes", "No", "Maybe"];

module.exports = {
    name: '8ball',
    description: 'Allows you to ask a question.',
    category: 'Aleatoire',
    dmPermission: false,
    defaultMemberPermissions: null,
    nsfw: false,
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Allows you to ask a question.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false)
        .addStringOption(opt =>
            opt.setName("question")
                .setDescription("What is the question?")
                .setRequired(true)
        ),

    async run(interactionOrMessage, args) {
        const question = interactionOrMessage.options ? interactionOrMessage.options.getString("question") : args.join(" ");

        if (!question) {
            const response = "You need to provide a question. Use `.8ball <your question>`.";
            if (interactionOrMessage.reply) {
                return interactionOrMessage.reply(response);
            } else {
                return interactionOrMessage.channel.send(response);
            }
        }

        const result = response[Math.floor(Math.random() * response.length)];

        const Embedball = new EmbedBuilder()
            .setTitle("-✅ The bot answered your question!")
            .setThumbnail(interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 256, format: "png" }))
            .setColor("#00A705")
            .setDescription(`
\`\`\`asciidoc
• Question :: ${question}
• Answer   :: ${result}
\`\`\`
            `)
            .setFooter({ text: `Question asked by ${interactionOrMessage.user ? interactionOrMessage.user.tag : interactionOrMessage.author.tag}`, iconURL: `${interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        if (interactionOrMessage.reply) {
            interactionOrMessage.reply({ embeds: [Embedball] });
        } else {
            interactionOrMessage.channel.send({ embeds: [Embedball] });
        }
    }
};
