const { Events, ActivityType } = require("discord.js");
const loadDatabase = require("../../loads/loadDatabase");
const log4js = require("log4js");

log4js.configure({
    appenders: {
        console: { type: 'console' }
    },
    categories: {
        default: { appenders: ['console'], level: 'debug' }
    }
});

const logger = log4js.getLogger();

module.exports = {
    name: Events.ClientReady,
    async run(client) {
        try {
            const db = await loadDatabase();
            client.db = db;

            client.user.setActivity("playing Valorant", { type: ActivityType.Playing });
            await client.application.commands.set(client.commands.map(command => command.data));

            logger.info(`[Bot] => ${client.user.username} is online`);
        } catch (error) {
            logger.error(`[Bot] => Failed to load the database connection: ${error.stack}`);
        }
    }
};
