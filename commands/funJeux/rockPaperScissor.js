const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { getChoiceBot, determineResult } = require('../../libs/functions/pfc')

module.exports = {

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

    async run(interaction) {

        const userChoice = interaction.options.getString("choice");
        const botChoice = getChoiceBot();
        const result = determineResult(userChoice, botChoice);


        const EmbedRPS = new EmbedBuilder()
            .setTitle(`-🪨 The bot is choosing its move`)
            .setColor("#00A705")
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }))
            .setDescription(`
\`\`\`asciidoc
• Player :: ${userChoice}
• Bot    :: ${botChoice}
• Result :: ${result}
\`\`\`
                            `)
            .setFooter({ text: `RPS initiated by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

       await interaction.reply(
            {
                embeds: [EmbedRPS],
            }
        );
    }
}
