const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("colors")
        .setDescription("Affiche un échantillon de toutes les couleurs disponibles.")
        .setDMPermission(),
        

    async run(interaction) {

        if (interaction.user.id !== process.env.ownerId) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        let colorSample = '';
        for (const [name, code] of Object.entries(global.colors)) {
            colorSample += `${code}This is ${name}${global.colors.reset}\n`;
        }

        console.log(`Voici un échantillon de toutes les couleurs disponibles :\n${colorSample}`)
        await interaction.reply({ content: `Voici un échantillon de toutes les couleurs dans la console tu programmes` });
    }
};
