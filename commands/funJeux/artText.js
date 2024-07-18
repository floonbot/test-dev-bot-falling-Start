const figlet = require("figlet");
const { SlashCommandBuilder } = require("discord.js");


module.exports = {

	data: new SlashCommandBuilder()
		.setName("art-text")
		.setDescription("create the text art.")
		.setDMPermission(false)
		.setDefaultMemberPermissions(null)
		.setNSFW(false)
		.addStringOption(opt =>
			opt.setName("texte")
				.setDescription("What is the text?")
				.setRequired(true)
		),
    

    async run(interaction) {
        try {
            const texte = interaction.options.getString("texte");

            figlet(texte, function (err, data) {
                interaction.reply(`\`\`\`${data}\`\`\``);
            });
        } catch (err) {
            console.error(err);
            interaction.reply("Error!");
        }
    }
}
