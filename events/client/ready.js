const { Events, ActivityType } = require("discord.js");
const loadDatabase = require("../../loaders/loadDatabase");
require("colors");

module.exports = {
    name: Events.ClientReady,
    async run(client) {

        const [db] = await Promise.all([
            loadDatabase()
        ]);

        client.db = db;

        client.user.setActivity("à valorant", { type: ActivityType.Playing }),
        client.application.commands.set(client.commands.map(command => command.data));
        console.log("");
        console.log(`[Bot] => ${client.user.username} is online`.green.bold);
    }
};