const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("test-button")
    .setDescription("Allows you to test the button.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null)
    .setNSFW(false),

   async run(interaction) {

    
    if (interaction.user.id !== process.env.ownerId) {
        return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
    }

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
