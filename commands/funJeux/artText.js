const figlet = require("figlet");
const { SlashCommandBuilder } = require("discord.js");


module.exports = {
    name: 'art-text',
    description: 'Create the text art.',
    category: 'Fun',
    dmPermission: false,
    defaultMemberPermissions: null,
    nsfw: false,
    data: new SlashCommandBuilder()
        .setName("art-text")
        .setDescription("Create the text art.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false)
        .addStringOption(opt =>
            opt.setName("text")
                .setDescription("What is the text?")
                .setRequired(true)
        ),
    async run(interactionOrMessage, args) {
		
        const text = interactionOrMessage.options ? interactionOrMessage.options.getString("text") : args.join(" ");

        if (!text) {
            const response = "You need to provide text for this command. Use `.art-text <your text>`.";
            if (interactionOrMessage.reply) {
                return interactionOrMessage.reply(response);
            } else {
                return interactionOrMessage.channel.send(response);
            }
        }

        figlet(text, (err, data) => {
            if (err) {
                console.error('Error generating ASCII art:', err);
                const response = "An error occurred while generating the text art.";
                if (interactionOrMessage.reply) {
                    return interactionOrMessage.reply(response);
                } else {
                    return interactionOrMessage.channel.send(response);
                }
            }

            const response = `\`\`\`${data}\`\`\``;
            if (interactionOrMessage.reply) {
                interactionOrMessage.reply(response);
            } else {
                interactionOrMessage.channel.send(response);
            }
        });
    }
};
