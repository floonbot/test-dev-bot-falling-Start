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
            opt.setName("texttanslation")
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
        const availableLanguages = ["fr", "en", "ja"];

        if (!availableLanguages.includes(language)) {
            const errorEmbed = new EmbedBuilder()
                .setTitle(`-👅 The bot does not support this language`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }))
                .setColor("#000000")
                .setDescription(`
\`\`\`asciidoc
• Available languages :: ${availableLanguages.join(", ")}
\`\`\`
                            `)
                .setFooter({ text: `Translation initiated by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
                .setTimestamp();
            return interaction.reply(
                { embeds: [errorEmbed] }
            );
        }

        const translated = await translate(text, { to: language });

        interaction.reply(`
            ${translated.text}`
        );
    }
}
