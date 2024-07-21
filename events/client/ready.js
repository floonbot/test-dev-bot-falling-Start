const { Events, ActivityType } = require("discord.js");
const loadDatabase = require("../../settings/loadDatabase");
require("colors");

module.exports = {
    name: Events.ClientReady,
    async run(client) {
        try {
            const db = await loadDatabase();
            client.db = db;

            client.user.setActivity("à Valorant", { type: ActivityType.Playing });
            await client.application.commands.set(client.commands.map(command => command.data));
            
            console.log("");
            console.log(`[Bot] => ${client.user.username} is online`.green.bold);
        } catch (error) {
            console.error("[Bot] => Failed to load the database connection.".red, error);
        }
    }
};
