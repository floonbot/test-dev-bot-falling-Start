
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { calculate } = require("../../libs/functions/math");

module.exports = {

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

    async run(interaction) {

        const nombre = interaction.options.getNumber("number");
        const symbole = interaction.options.getString("symbol");
        const nombre1 = interaction.options.getNumber("number1");

        const result = calculate(nombre, symbole, nombre1);
    
            const EmbedEval = new EmbedBuilder()
                .setTitle(`\ud83e\uddee-  The bot is calculating ${nombre} ${symbole} ${nombre1}`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }))
                .setColor("#00A705")
                .setDescription(`\n\`\`\`asciidoc\n\u2022 Result :: ${result}\n\`\`\`\n                            `)
                .setFooter({ text: `Command used by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
                .setTimestamp();

            interaction.reply({ embeds: [EmbedEval] });
        }
    }

