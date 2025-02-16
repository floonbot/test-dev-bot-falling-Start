const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "emojify",
  description: "Transforms text into emojis.",
  category: "Fun",
  dmPermission: false,
  defaultMemberPermissions: null,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName("emojify")
    .setDescription("Transforms text into emojis.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null)
    .setNSFW(false)
    .addStringOption((opt) =>
      opt
        .setName("emojify")
        .setDescription("What is the text?")
        .setRequired(true)
    ),

  async run(interactionOrMessage, args) {
    const text = interactionOrMessage.options
      ? interactionOrMessage.options.getString("emojify")
      : args.join(" ");

    if (!text) {
      const response =
        "Please provide text to emojify. Use `.emojify <your text>`.";
      if (interactionOrMessage.reply) {
        return interactionOrMessage.reply(response);
      } else {
        return interactionOrMessage.channel.send(response);
      }
    }

    const specialCodes = {
      0: ":zero:",
      1: ":one:",
      2: ":two:",
      3: ":three:",
      4: ":four:",
      5: ":five:",
      6: ":six:",
      7: ":seven:",
      8: ":eight:",
      9: ":nine:",
      "#": ":hash:",
      "*": ":asterisk:",
      "?": ":grey_question:",
      "!": ":grey_exclamation:",
      " ": "   ",
    };

    const emojifiedText = text
      .split("")
      .map((char) => {
        const lowerChar = char.toLowerCase();
        return /[a-z]/.test(lowerChar)
          ? `:regional_indicator_${lowerChar}:`
          : specialCodes[lowerChar] || char;
      })
      .join("");

    if (interactionOrMessage.reply) {
      interactionOrMessage.reply(emojifiedText);
    } else {
      interactionOrMessage.channel.send(emojifiedText);
    }
  },
};
