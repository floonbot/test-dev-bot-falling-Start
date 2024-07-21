const { Events, ActivityType } = require("discord.js");
const loadDatabase = require("../../connection/loadDatabase");

module.exports = {
    name: Events.ClientReady,
    async run(client) {
        try {
            const db = await loadDatabase();
            client.db = db;

            client.user.setActivity("à Valorant", { type: ActivityType.Playing });
            await client.application.commands.set(client.commands.map(command => command.data));
            
            console.log("");
            console.log(`${global.colors.text_bold_light_green}[Bot] => ${client.user.username} is online`);
        } catch (error) {
            console.error(`${global.colors.text_light_red}[Bot] => Failed to load the database connection.`);
        }
    }
};
