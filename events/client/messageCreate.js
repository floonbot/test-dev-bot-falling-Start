const { Events, PermissionsBitField } = require('discord.js');
const prefix = process.env.PREFIX;

module.exports = {
    name: Events.MessageCreate,
    async run(client, message) {
        try {
            if (!message.content.startsWith(prefix) || message.author.bot) return;

            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.commands.get(commandName);

            if (!command) return;

            if (command.defaultMemberPermissions && !message.member.permissions.has(new PermissionsBitField(command.defaultMemberPermissions))) {
                return message.reply(`You don't have the necessary permissions: \`${new PermissionsBitField(command.defaultMemberPermissions).toArray()}\` to use this command.`);
            }

            if (command.nsfw && !message.channel.nsfw) {
                return message.reply("This command can only be used in NSFW channels.");
            }

            if (!command.dmPermission && message.channel.type === 'DM') {
                return message.reply("This command cannot be used in direct messages.");
            }

            await command.run(message, args);
        } catch (error) {
            console.error(`Error executing command: ${error.stack}`);
            message.reply('An error occurred while executing this command.');
        }
    },
};
