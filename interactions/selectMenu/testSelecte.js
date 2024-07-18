const { ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {

    name: "starter",
    type: ComponentType.StringSelect,

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

        await interaction.message.edit({ content: `The option has been chosen!`, Component: [row] });
        await interaction.deferUpdate();
    }
};
