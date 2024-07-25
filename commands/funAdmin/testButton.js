const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: 'test-button',
    description: 'Allows you to test the button.',
    category: 'Utility',
    dmPermission: false,
    defaultMemberPermissions: null,
    nsfw: false,
    data: new SlashCommandBuilder()
        .setName("test-button")
        .setDescription("Allows you to test the button.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false),

    async run(interactionOrMessage) {
        if (interactionOrMessage.user && interactionOrMessage.user.id !== process.env.OWNER_ID) {
            return interactionOrMessage.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }

        if (interactionOrMessage.author && interactionOrMessage.author.id !== process.env.OWNER_ID) {
            return interactionOrMessage.channel.send("You do not have permission to use this command.");
        }

        const testButton = new ButtonBuilder()
            .setCustomId('pong')
            .setEmoji("🏓")
            .setLabel('Click for Pong!')
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder().addComponents(testButton);

        if (interactionOrMessage.reply) {
            await interactionOrMessage.reply({
                content: 'Click the button for Pong!',
                components: [actionRow],
            });
        } else {
            await interactionOrMessage.channel.send({
                content: 'Click the button for Pong!',
                components: [actionRow],
            });
        }
    }
};
