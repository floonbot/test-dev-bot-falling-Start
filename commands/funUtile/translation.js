const translate = require('@iamtraction/google-translate');
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("translation")
        .setDescription("Start translating text")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false)
        .addStringOption(opt =>
            opt.setName("texttranslation")
                .setDescription("What is the text?")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("language")
                .setDescription("What is the language?")
                .setRequired(true)
                .addChoices(
                    { name: "French", value: "fr" },
                    { name: "English", value: "en" },
                    { name: "Japanese", value: "ja" }
                )
        ),

    async run(interaction) {
        const text = interaction.options.getString("texttranslation");
        const language = interaction.options.getString("language");

        const translated = await translate(text, { to: language });
        interaction.reply(translated.text);

    }
};
