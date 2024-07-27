const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
	name: "reload",
	description: 'Reloads a command.',
    category: 'Utility',
    dmPermission: false,
    defaultMemberPermissions: null,
    nsfw: false,
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),
	async run(interactionOrMessage) {
		
		if (interactionOrMessage.user && interactionOrMessage.user.id !== process.env.OWNER_ID) {
			return interactionOrMessage.reply({ content: "You do not have permission to use this command.", ephemeral: true });
		}

		if (interactionOrMessage.author && interactionOrMessage.author.id !== process.env.OWNER_ID) {
			return interactionOrMessage.channel.send("You do not have permission to use this command.");
		}

		let commandName;
		if (interactionOrMessage.options) {
			commandName = interactionOrMessage.options.getString('command', true).toLowerCase();
		} else {
			const args = interactionOrMessage.content.slice(process.env.PREFIX.length).trim().split(/ +/);
			commandName = args[1] ? args[1].toLowerCase() : null;
		}

		if (!commandName) {
			return interactionOrMessage.reply("Please provide the name of the command to reload.");
		}

		const command = interactionOrMessage.client.commands.get(commandName);

		if (!command) {
			const availableCommands = interactionOrMessage.client.commands.map(cmd => cmd.name).join(', ');
			return interactionOrMessage.reply(`There is no command with the name \`${commandName}\`! Available commands: ${availableCommands}`);
		}

		const commandsPath = path.resolve(__dirname, '../');
		let commandPath = null;

		function findCommand(dir) {
			const files = fs.readdirSync(dir);
			for (const file of files) {
				const filePath = path.join(dir, file);
				const stat = fs.statSync(filePath);
				if (stat.isDirectory()) {
					findCommand(filePath);
				} else if (file === `${command.data.name}.js`) {
					commandPath = filePath;
					return;
				}
			}
		}

		findCommand(commandsPath);

		if (!commandPath) {
			console.log(`Searching for command files in: ${commandsPath}`);
			return interactionOrMessage.reply(`The file for the command \`${commandName}\` was not found!`);
		}

		delete require.cache[require.resolve(commandPath)];

		try {
			const newCommand = require(commandPath);
			interactionOrMessage.client.commands.set(newCommand.data.name, newCommand);
			await interactionOrMessage.reply(`The command \`${newCommand.data.name}\` has been reloaded!`);
		} catch (error) {
			console.error(error);
			await interactionOrMessage.reply(`There was an error reloading the command \`${command.data.name}\`:\n\`${error.message}\``);
		}
	},
};