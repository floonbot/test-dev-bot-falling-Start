const { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { getInfoFromName } = require('mal-scraper');

module.exports = {
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

    async run(interaction) {
       
            const animeName = interaction.options.getString("anime");
            const animeInfo = await getInfoFromName(animeName);

            if (!animeInfo) {
                interaction.reply("No information found for the specified anime.");
                return;
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
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                files: [file]
            });

            if (trailer) {
                interaction.followUp(`Here is the trailer: ${trailer}`);
            }
       
    }
};
