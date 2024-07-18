const { ComponentType } = require("discord.js");

module.exports = {

    name: "pong",
    type: ComponentType.Button,

    async run(interaction) {

        await interaction.message.edit({ content: "pong. I have answered correctly!" });
        await interaction.deferUpdate();
    }
};
