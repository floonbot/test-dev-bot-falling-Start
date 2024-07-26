const translate = require('@iamtraction/google-translate');
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    name: 'translation',
    description: 'Start translating text',
    category: 'Utile',
    dmPermission: false,
    defaultMemberPermissions: null,
    nsfw: false,
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

    async run(interactionOrMessage, args) {
        const text = interactionOrMessage.options ? interactionOrMessage.options.getString("texttranslation") : args.join(" ");
        const language = interactionOrMessage.options ? interactionOrMessage.options.getString("language") : args[1];

        if (!text || !language) {
            const response = "You need to provide text and a language. Use `.translation <text> <language>`.";
            if (interactionOrMessage.reply) {
                return interactionOrMessage.reply(response);
            } else {
                return interactionOrMessage.channel.send(response);
            }
        }

        const translated = await translate(text, { to: language });

        if (interactionOrMessage.reply) {
            interactionOrMessage.reply(translated.text);
        } else {
            interactionOrMessage.channel.send(translated.text);
        }
    }
};
