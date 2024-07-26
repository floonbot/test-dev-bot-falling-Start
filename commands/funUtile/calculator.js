const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { calculate } = require("../../libs/functions/functionCalculate");

module.exports = {
    name: 'calculator',
    description: 'Allows you to calculate.',
    category: 'Utile',
    dmPermission: false,
    defaultMemberPermissions: null,
    nsfw: false,
    data: new SlashCommandBuilder()
        .setName("calculator")
        .setDescription("Allows you to calculate.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false)
        .addNumberOption(opt =>
            opt.setName("number")
                .setDescription("What is the number?")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("symbol")
                .setDescription("What is the symbol?")
                .setRequired(true)
                .addChoices(
                    { name: '+', value: '+' },
                    { name: '-', value: '-' },
                    { name: '*', value: '*' },
                    { name: '/', value: '/' }
                )
        )
        .addNumberOption(opt =>
            opt.setName("number1")
                .setDescription("What is the number?")
                .setRequired(true)
        ),

    async run(interactionOrMessage, args) {
        const nombre = interactionOrMessage.options ? interactionOrMessage.options.getNumber("number") : parseFloat(args[0]);
        const symbole = interactionOrMessage.options ? interactionOrMessage.options.getString("symbol") : args[1];
        const nombre1 = interactionOrMessage.options ? interactionOrMessage.options.getNumber("number1") : parseFloat(args[2]);

        if (!nombre || !symbole || !nombre1) {
            const response = "You need to provide a valid calculation. Use `.calculator <number> <symbol> <number>`.";
            if (interactionOrMessage.reply) {
                return interactionOrMessage.reply(response);
            } else {
                return interactionOrMessage.channel.send(response);
            }
        }

        const result = calculate(nombre, symbole, nombre1);

        const EmbedEval = new EmbedBuilder()
            .setTitle(`\ud83e\uddee- The bot is calculating ${nombre} ${symbole} ${nombre1}`)
            .setThumbnail(interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 256, format: "png" }))
            .setColor("#00A705")
            .setDescription(`
\`\`\`asciidoc
• Result :: ${result}
\`\`\`
            `)
            .setFooter({ text: `Command used by ${interactionOrMessage.user ? interactionOrMessage.user.tag : interactionOrMessage.author.tag}`, iconURL: `${interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        if (interactionOrMessage.reply) {
            interactionOrMessage.reply({ embeds: [EmbedEval] });
        } else {
            interactionOrMessage.channel.send({ embeds: [EmbedEval] });
        }
    }
};
