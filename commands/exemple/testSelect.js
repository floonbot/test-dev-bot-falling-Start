const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("test-select")
        .setDescription("Allows you to choose an option.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false),

    async run(interaction) {

        const select = new StringSelectMenuBuilder()
            .setCustomId('starter')
            .setPlaceholder('Make a choice...')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Option 1')
                    .setValue('option1'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Option 2')
                    .setValue('option2'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Option 3')
                    .setValue('option3'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        await interaction.reply({
            content: 'Choose an option:',
            components: [row],
        });
    },
};
