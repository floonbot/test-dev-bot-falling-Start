const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emojify")
        .setDescription("Transforms text into emojis.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false)
        .addStringOption(opt =>
            opt.setName("emojify")
                .setDescription("What is the text?")
                .setRequired(true)
        ),

    async run(interaction) {
        const text = interaction.options.getString("emojify");

        if (!text) {
            return interaction.reply({ content: "Please enter valid text!", ephemeral: true });
        }

        const specialCodes = {
            '0': ':zero:',
            '1': ':one:',
            '2': ':two:',
            '3': ':three:',
            '4': ':four:',
            '5': ':five:',
            '6': ':six:',
            '7': ':seven:',
            '8': ':eight:',
            '9': ':nine:',
            '#': ':hash:',
            '*': ':asterisk:',
            '?': ':grey_question:',
            '!': ':grey_exclamation:',
            ' ': '   '
        };

        const emojifiedText = text.split('').map(char => {
            const lowerChar = char.toLowerCase();
            return /[a-z]/.test(lowerChar) ? `:regional_indicator_${lowerChar}:` : (specialCodes[lowerChar] || char);
        }).join('');

        interaction.reply(emojifiedText);
    }
};