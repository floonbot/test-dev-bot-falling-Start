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

        let text = interaction.options.getString("emojify");

        if (!interaction.options.getString("emojify")) return interaction.reply({ content: "Please enter valid text!", ephemeral: true });

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

        let emojifiedText = ''

        for (let i = 0; i < text.length; i++) {

            const letter = text[i].toLowerCase();

            if (/[a-z]/g.test(letter)) {

                emojifiedText += `:regional_indicator_${letter}:`

            } else if (specialCodes[letter]) {

                emojifiedText += specialCodes[letter]

            } else {

                emojifiedText += letter
            }
        };

        interaction.reply(emojifiedText);
    }
};
