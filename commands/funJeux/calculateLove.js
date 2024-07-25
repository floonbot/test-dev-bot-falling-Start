const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { generateProgressBarLove } = require("../../libs/functions/functionGenerateProgressBarLove");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("calculate-love")
        .setDescription("Calculate your love percentage.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .setNSFW(false)
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("Select a user to calculate love percentage with.")
                .setRequired(true)
        ),

    async run(interaction) {
        const user = interaction.options.getUser("user");
        const userYou = interaction.user;
        const db = interaction.client.db;
 
            const [results] = await db.execute(
                'SELECT result, user1_name, user2_name FROM love_results WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)',
                [userYou.id, user.id, user.id, userYou.id]
            );

            let result, user1Name, user2Name;

            if (results.length > 0) {
                result = results[0].result;
                user1Name = results[0].user1_name;
                user2Name = results[0].user2_name;
            } else {
                result = Math.floor(Math.random() * 100);
                user1Name = userYou.username;
                user2Name = user.username;

                await db.execute(
                    'INSERT INTO love_results (user1, user2, user1_name, user2_name, result) VALUES (?, ?, ?, ?, ?)',
                    [userYou.id, user.id, userYou.username, user.username, result]
                );
            }

            const progressBar = generateProgressBarLove(result);
            const resultEmbed = new EmbedBuilder()
                .setTitle("💖 Result Calculated!")
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }))
                .setColor("#FF69B4")
                .setDescription(`
\`\`\`asciidoc
• User 1   :: ${user1Name}
• User 2   :: ${user2Name}
• Result   :: ${result}%
${progressBar}
\`\`\`
                `)
                .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 128, format: "png" })}` })
                .setTimestamp();

            interaction.reply({
                embeds: [resultEmbed]
            });
    }
};
