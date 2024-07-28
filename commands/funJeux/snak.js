const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const SnakeGame = require("snakecord");

module.exports = {
  name: "snak",
  description: "Displays a sample of all available colors.",
  category: "Utility",
  dmPermission: true,
  defaultMemberPermissions: null,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName("snak")
    .setDescription("Displays a sample of all available colors.")
    .setDMPermission(true),

  async run(message) {
    await message.deferReply();
    await startSnakeGame(message);
  },

  async interactionRun(interaction) {
    await interaction.followUp("**Starting Snake Game**");
    await startSnakeGame(interaction);
  },
};

async function startSnakeGame(data) {
  const snakeGame = new SnakeGame({
    title: "Snake Game",
    color: "BLUE",
    timestamp: true,
    gameOverTitle: "Game Over",
  });

  await snakeGame.newGame(data);
}
