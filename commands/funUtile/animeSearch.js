const { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { getInfoFromName } = require('mal-scraper');

module.exports = {
    name: 'anime-search',
    description: 'Information about the anime.',
    category: 'Utile',
    dmPermission: false,
    defaultMemberPermissions: null,
    nsfw: false,
    data: new SlashCommandBuilder()
        .setName("anime-search")
        .setDescription("Information about the anime.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false)
        .addStringOption(opt =>
            opt.setName("anime")
                .setDescription("What is the anime?")
                .setRequired(true)
        ),

    async run(interactionOrMessage, args) {
        const animeName = interactionOrMessage.options ? interactionOrMessage.options.getString("anime") : args.join(" ");

        if (!animeName) {
            const response = "You need to provide an anime name. Use `.anime-search <anime name>`.";
            if (interactionOrMessage.reply) {
                return interactionOrMessage.reply(response);
            } else {
                return interactionOrMessage.channel.send(response);
            }
        }

        const animeInfo = await getInfoFromName(animeName);

        if (!animeInfo) {
            const response = "No information found for the specified anime.";
            if (interactionOrMessage.reply) {
                return interactionOrMessage.reply(response);
            } else {
                return interactionOrMessage.channel.send(response);
            }
        }

        const { title, episodes, duration, score, genres, picture, studios, synopsis, status, trailer } = animeInfo;
        const file = new AttachmentBuilder(picture, { name: 'picture.png' });

        const embed = new EmbedBuilder()
            .setTitle(`🎬 Anime: ${title}`)
            .setColor("#00A705")
            .setDescription(`
\`\`\`asciidoc
• Number of episodes :: ${episodes}
• Average episode duration :: ${duration}
• Score :: ${score}
• Studio :: ${studios}
• Genre :: ${genres.join(", ")}
• Status :: ${status}
\`\`\`
• Synopsis :: 
${synopsis}`)
            .setThumbnail(`attachment://picture.png`)
            .setFooter({ text: `Requested by ${interactionOrMessage.user ? interactionOrMessage.user.tag : interactionOrMessage.author.tag}`, iconURL: `${interactionOrMessage.user ? interactionOrMessage.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" }) : interactionOrMessage.author.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        if (interactionOrMessage.reply) {
            interactionOrMessage.reply({ embeds: [embed], files: [file] });
        } else {
            interactionOrMessage.channel.send({ embeds: [embed], files: [file] });
        }

        if (trailer) {
            if (interactionOrMessage.reply) {
                interactionOrMessage.followUp(`Here is the trailer: ${trailer}`);
            } else {
                interactionOrMessage.channel.send(`Here is the trailer: ${trailer}`);
            }
        }
    }
};
