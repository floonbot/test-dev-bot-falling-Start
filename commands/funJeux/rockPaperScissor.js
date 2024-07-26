const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { determineResult } = require('../../libs/functions/functionDetermineResultRockPaperScissors');
const { getBotChoiceRockPaperScissors } = require('../../libs/functions/functiongetBotChoiceRockPaperScissors');

module.exports = {
    name: 'rps',
    description: 'Allows you to play Rock-Paper-Scissors',
    category: 'Fun',
    dmPermission: false,
    defaultMemberPermissions: null,
    nsfw: false,
    data: new SlashCommandBuilder()
        .setName("rps")
        .setDescription("Allows you to play Rock-Paper-Scissors")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false)
        .addStringOption(opt =>
            opt.setName('choice')
                .setDescription('Your choice')
                .setRequired(true)
                .addChoices(
                    { name: 'rock', value: 'rock' },
                    { name: 'paper', value: 'paper' },
                    { name: 'scissors', value: 'scissors' }
                )
        ),

    async run(interactionOrMessage, args) {
        const userChoice = interactionOrMessage.options ? interactionOrMessage.options.getString("choice") : (args[0] ? args[0].toLowerCase() : null);

        if (!userChoice || !['rock', 'paper', 'scissors'].includes(userChoice)) {
            const response = "You need to provide a valid choice: `rock`, `paper`, or `scissors`. Use `.rps <rock|paper|scissors>`.";
            if (interactionOrMessage.reply) {
                return interactionOrMessage.reply(response);
            } else {
                return interactionOrMessage.channel.send(response);
            }
        }

        const botChoice = getBotChoiceRockPaperScissors();
        const result = determineResult(userChoice, botChoice);

        const EmbedRPS = new EmbedBuilder()
            .setTitle("🪨 The bot is choosing its move")
            .setColor("#00A705")
            .setThumbnail(interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 256, format: "png" }))
            .setDescription(`
\`\`\`asciidoc
• Player :: ${userChoice}
• Bot    :: ${botChoice}
• Result :: ${result}
\`\`\`
            `)
            .setFooter({ text: `RPS initiated by ${interactionOrMessage.user ? interactionOrMessage.user.tag : interactionOrMessage.author.tag}`, iconURL: `${interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        if (interactionOrMessage.reply) {
            interactionOrMessage.reply({ embeds: [EmbedRPS] });
        } else {
            interactionOrMessage.channel.send({ embeds: [EmbedRPS] });
        }
    }
};
