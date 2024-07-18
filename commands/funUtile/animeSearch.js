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

        const nomAnime = interaction.options.getString("anime");

        const { title, episodes, duration, score, genres, picture, studios, synopsis, status, trailer } = await getInfoFromName(nomAnime)
        const files = new AttachmentBuilder(picture, { name: `picture.png` });

        const EmbedAnime = new EmbedBuilder()
            .setTitle(`-🎬 The title of the anime ${title}`)
            .setColor("#00A705")
            .setDescription(`
\`\`\`asciidoc
• Number of episodes :: ${episodes}
• Average episode duration :: ${duration}
• Score :: ${score}
• Studio :: ${studios}
• Genre :: ${genres}

• Synopsis :: 
${synopsis}

• Status :: ${status}
\`\`\`
`)
            .setThumbnail(`attachment:\/\/${files.name}`)
            .setFooter({ text: `Command used by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
            .setTimestamp();

        await interaction.reply({
            embeds: [EmbedAnime],
            files: [files]
        });
        await interaction.followUp(
            `Here is the trailer : ${trailer}`);
    }
}
