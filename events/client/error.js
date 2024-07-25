const { Events } = require("discord.js");
const { createLogger, transports, format } = require('winston');
const { resolve } = require("path");
const fs = require("fs").promises;

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
    ),
    transports: [
        new transports.Console()
    ],
});

module.exports = {
    name: Events.Error,
    async run(client, error) {
        logger.error(`Une erreur Discord.js s'est produite: ${error.stack}`);

        const errorDir = resolve("./libs/errors/api/");
        const errorName = error.name || 'UnknownError';
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
        const errorFileName = `${errorName}_error_${currentDate}.txt`;
        const errorFilePath = resolve(`${errorDir}/${errorFileName}`);

        await fs.mkdir(errorDir, { recursive: true });
        await fs.writeFile(errorFilePath, `Erreur Discord.js : ${error.stack}`, 'utf-8');

        logger.error(`Détails de l'erreur enregistrés dans : ${errorFilePath}`);
    }
};
