const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  generateProgressBarLove,
} = require("../../libs/functions/functionGenerateProgressBarLove");
const {
  getLoveLevelMessage,
} = require("../../libs/functions/functionGetLoveLevelMessage");

module.exports = {
  name: "calculate-love",
  description: "Calculate your love percentage.",
  category: "Fun",
  dmPermission: false,
  defaultMemberPermissions: null,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName("calculate-love")
    .setDescription("Calculate your love percentage.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null)
    .setNSFW(false)
    .addUserOption((opt) =>
      opt
        .setName("user")
        .setDescription("Select a user to calculate love percentage with.")
        .setRequired(true)
    ),

  async run(interactionOrMessage, args) {
    const user = interactionOrMessage.options
      ? interactionOrMessage.options.getUser("user")
      : interactionOrMessage.mentions.users.first();

    if (!user) {
      const response =
        "You need to mention a user to calculate love percentage with. Use `.calculate-love @user`.";
      if (interactionOrMessage.reply) {
        return interactionOrMessage.reply(response);
      } else {
        return interactionOrMessage.channel.send(response);
      }
    }

    const userYou = interactionOrMessage.user || interactionOrMessage.author;
    const db = interactionOrMessage.client.db;

    const [results] = await db.execute(
      "SELECT compatibility_score, user1_name, user2_name FROM love_results WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)",
      [userYou.id, user.id, user.id, userYou.id]
    );

    let compatibility_score, user1Name, user2Name;

    if (results.length > 0) {
      compatibility_score = results[0].compatibility_score;
      user1Name = results[0].user1_name;
      user2Name = results[0].user2_name;
    } else {
      compatibility_score = Math.floor(Math.random() * 100);
      user1Name = userYou.username;
      user2Name = user.username;

      await db.execute(
        "INSERT INTO love_results (user1_id, user2_id, user1_name, user2_name, compatibility_score) VALUES (?, ?, ?, ?, ?)",
        [
          userYou.id,
          user.id,
          userYou.username,
          user.username,
          compatibility_score,
        ]
      );
    }

    const progressBar = generateProgressBarLove(compatibility_score);
    const loveLevelMessage = getLoveLevelMessage(compatibility_score);

    const resultEmbed = new EmbedBuilder()
      .setTitle("<:love:1267160354408894554>- Result Calculated!")
      .setThumbnail(
        userYou.displayAvatarURL({ dynamic: true, size: 256, format: "png" })
      )
      .setColor("#FF69B4")
      .setDescription(
        `
\`\`\`asciidoc
• User 1   :: ${user1Name}
• User 2   :: ${user2Name}
• Result   :: ${compatibility_score}%
${progressBar}
\`\`\`
${loveLevelMessage}
            `
      )
      .setFooter({
        text: `Requested by ${userYou.tag}`,
        iconURL: `${userYou.displayAvatarURL({
          dynamic: true,
          size: 128,
          format: "png",
        })}`,
      })
      .setTimestamp();

    if (interactionOrMessage.reply) {
      interactionOrMessage.reply({ embeds: [resultEmbed] });
    } else {
      interactionOrMessage.channel.send({ embeds: [resultEmbed] });
    }
  },
};
