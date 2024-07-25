const { InteractionType, Events, PermissionsBitField } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async run(client, interaction) {
        try {
            if (interaction.type === InteractionType.ApplicationCommand) {
                const command = client.commands.get(interaction.commandName);
                if (command.data.default_member_permissions && !interaction.member.permissions.has(new PermissionsBitField(command.data.default_member_permissions))) {
                    return interaction.reply(`You don't have the permission \`${new PermissionsBitField(command.data.default_member_permissions).toArray()}\` to run this command.`);
                }
                await command.run(interaction);
            } else {
                const [name, ...args] = interaction.customId.split("_");
                const file = client.interactions.find(i => i.name === name && i.type === interaction.componentType);
                if (!file) return;

                if (file.permission && !interaction.member.permissions.has(new PermissionsBitField(file.permission))) {
                    return interaction.reply(`You don't have permission \`${new PermissionsBitField(file.permission).toArray()}\` to execute this component.`);
                }
                await file.run(interaction, ...args);
            }
        } catch (error) {
            console.error(`Error handling interaction: ${error.stack}`);
            interaction.reply({ content: 'An error occurred while processing this interaction.', ephemeral: true });
        }
    }
};
