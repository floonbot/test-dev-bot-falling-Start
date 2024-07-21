const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("ping")
        .setDescription("get the bot latency.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null),

    async run(interaction) {

        const button = new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setCustomId("ping")
            .setEmoji("🔃")
            .setLabel("Refresh")
            .setStyle(ButtonStyle.Secondary));

       interaction.reply({ content: `The bot latency  \`${interaction.client.ws.ping}ms\`.`, components: [button] });
    }
};  