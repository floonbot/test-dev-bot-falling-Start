const { ActionRowBuilder, ButtonStyle, ButtonBuilder, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: "Retrieve a member's avatar.",
    category: 'Fun',
    dmPermission: false,
    defaultMemberPermissions: null,
    nsfw: false,
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

    async run(interactionOrMessage, args) {
        const user = interactionOrMessage.options ? interactionOrMessage.options.getUser("member") : interactionOrMessage.mentions.users.first();

        if (!user) {
            const response = "You need to mention a member to retrieve their avatar. Use `.avatar @member`.";
            if (interactionOrMessage.reply) {
                return interactionOrMessage.reply(response);
            } else {
                return interactionOrMessage.channel.send(response);
            }
        }

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
            .setFooter({ text: `Command used by ${interactionOrMessage.user ? interactionOrMessage.user.tag : interactionOrMessage.author.tag}`, iconURL: `${interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        if (interactionOrMessage.reply) {
            interactionOrMessage.reply({ embeds: [embed], components: [row] });
        } else {
            interactionOrMessage.channel.send({ embeds: [embed], components: [row] });
        }
    }
};
