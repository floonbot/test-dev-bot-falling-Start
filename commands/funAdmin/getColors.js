const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    name: 'colors',
    description: 'Displays a sample of all available colors.',
    category: 'Utility',
    dmPermission: true,
    defaultMemberPermissions: null,
    nsfw: false,
    data: new SlashCommandBuilder()
        .setName("colors")
        .setDescription("Displays a sample of all available colors.")
        .setDMPermission(true),

    async run(interactionOrMessage) {
        if (interactionOrMessage.user && interactionOrMessage.user.id !== process.env.OWNER_ID) {
            return interactionOrMessage.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }

        if (interactionOrMessage.author && interactionOrMessage.author.id !== process.env.OWNER_ID) {
            return interactionOrMessage.channel.send("You do not have permission to use this command.");
        }

        const colorSample = Object.entries(global.colors)
            .map(([name, code]) => `${code}This is ${name}${global.colors.reset}`)
            .join('\n');

        if (interactionOrMessage.reply) {
            await interactionOrMessage.reply({ content: `Here is a sample of all colors in your program console.` });
            console.log(colorSample);
        } else {
            await interactionOrMessage.channel.send(`Here is a sample of all colors in your program console.`);
            console.log(colorSample);
        }
    }
};
