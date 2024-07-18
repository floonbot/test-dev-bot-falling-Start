const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const response = ["Yes", "No", "Maybe"];

module.exports = {
	
	data: new SlashCommandBuilder()
		.setName("8ball")
		.setDescription("Allows you to ask a question.")
		.setDMPermission(false)
		.setDefaultMemberPermissions(null)
		.setNSFW(false)
		.addStringOption(opt =>
			opt.setName("question")
				.setDescription("What is the question?")
				.setRequired(true)
		),

	async run(interaction) {

		const question = interaction.options.getString("question");
		const result = response[Math.floor(Math.random() * response.length)];

		const Embedball = new EmbedBuilder()
			.setTitle("-✅  The bot answered your question !")
			.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }))
			.setColor("#00A705")
			.setDescription(`
\`\`\`asciidoc
• Question   :: ${question}
• Answer    :: ${result}
\`\`\`
            `)
			.setFooter({ text: `Question asked by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
			.setTimestamp();

		interaction.reply({
			embeds: [Embedball]
		});
	}
};
