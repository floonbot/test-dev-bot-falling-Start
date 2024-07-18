const { ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {

   
    data: new SlashCommandBuilder()
		.setName("avatar")
		.setDescription("Vous permet de récupérer l'avatar d'un membre")
		.setDMPermission(false)
		.setDefaultMemberPermissions(null)
		.setNSFW(false)
		.addUserOption(opt =>
			opt.setName("membre")
				.setDescription("Quelle est le membre")
				.setRequired(true)
		),

    async run(interaction) {

        const utilisateur = interaction.options.getUser(`membre`);
        const avatarUtilisateur = utilisateur.displayAvatarURL({ dynamic: true, size: 512, format: "png" })

        const ligne = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Avatar")
                    .setURL(avatarUtilisateur)
                    .setStyle(ButtonStyle.Link)
            );

        const embedAvatar = new EmbedBuilder()
            .setColor("#00A705")
            .setImage(avatarUtilisateur)
            .setFooter({ text: `Commande utilisée par ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        interaction.reply({ embeds: [embedAvatar], components: [ligne] });
    }
}
