const { InteractionType, Events, PermissionsBitField } = require("discord.js")

module.exports = {

    name: Events.InteractionCreate,
    async run(client, interaction) {

        switch (interaction.type) {

            case InteractionType.ApplicationCommand:
                const command = client.commands.get(interaction.commandName);
                if(command.data.default_member_permissions && !interaction.member.permissions.has(new PermissionsBitField(command.data.default_member_permissions))) return await interaction.reply(`You don't have the permission \`${new PermissionsBitField(command.data.default_member_permissions).toArray()}\` to run`);
                await command.run(interaction)

                break;

            default:

            const name = interaction.customId.split("_")[0];
            const args = interaction.customId.split("_").slice(1);
            const file = client.interactions.find(i => i.name === name && i.type === interaction.componentType);
            if(!file) return

            if(file.permission && !interaction.member.permissions.has(new PermissionsBitField(file.permission))) return await interaction.reply(`You don't have permission \`${new PermissionsBitField(file.permission).toArray()}\` to execute this component`);
            await file.run(interaction, ...args)
            break;
        }
    }
};