const { Events } = require("discord.js");
const { createLogger, transports } = require('winston');
const { resolve } = require("path");
const fs = require("fs").promises;
const colors = require("colors");

const logger = createLogger({
    transports: [
        new transports.Console(),
    ],
});

module.exports = {
    name: Events.Error,
    async run(client, error) {

        console.error(colors.red('Une erreur Discord.js s\'est produite.'));

            const errorDir = resolve("./libs/errors/");

            const errorName = error.name || 'UnknownError';

            const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");

            const errorFileName = `${errorName}_error_${currentDate}.log`;
            
            const errorFilePath = resolve(`${errorDir}/${errorFileName}`);

            await fs.mkdir(errorDir, { recursive: true });

            await fs.writeFile(errorFilePath, `Erreur Discord.js : ${error.stack}`, 'utf-8');

            console.error(colors.red(`Détails de l'erreur enregistrés dans : ${errorFilePath}`));
    }
};
