const { ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Retrieve a member's avatar.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false)
        .addUserOption(opt =>
            opt.setName("member")
                .setDescription("Select the member")
                .setRequired(true)
        ),

    async run(interaction) {
        const user = interaction.options.getUser("member");
        const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512, format: "png" });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Avatar")
                .setURL(avatarUrl)
                .setStyle(ButtonStyle.Link)
        );

        const embed = new EmbedBuilder()
            .setColor("#00A705")
            .setImage(avatarUrl)
            .setFooter({ text: `Command used by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        interaction.reply({ embeds: [embed], components: [row] });
    }
};