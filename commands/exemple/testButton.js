const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("test-button")
    .setDescription("Allows you to test the button.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null)
    .setNSFW(false),

   async run(interaction) {

        const testButton = new ButtonBuilder()
            .setCustomId('pong')
            .setEmoji("🏓")
            .setLabel('Click for Pong!')
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder().addComponents(testButton);

        await interaction.reply({
            content: 'Click the button for Pong!',
            components: [actionRow],
        });
    }
};
