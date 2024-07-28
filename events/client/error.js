const {
  Events,
  DiscordjsError,
  DiscordjsRangeError,
  DiscordjsTypeError,
} = require("discord.js");
const { createLogger, transports, format } = require("winston");
const { resolve } = require("path");
const fs = require("fs").promises;

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [new transports.Console()],
});

module.exports = {
  name: Events.Error,
  async run(client, error) {
    let errorMessage = "Une erreur Discord.js s'est produite";

    if (error instanceof DiscordjsRangeError) {
      errorMessage = "Une DiscordjsRangeError s'est produite";
    } else if (error instanceof DiscordjsTypeError) {
      errorMessage = "Une DiscordjsTypeError s'est produite";
    } else if (error instanceof DiscordjsError) {
      errorMessage = "Une DiscordjsError s'est produite";
    }

    logger.error(`${errorMessage}: ${error.stack}`);

    const errorDir = resolve("./libs/errors/api/");
    const errorName = error.name || "UnknownError";
    const currentDate = new Date()
      .toLocaleString("en-US", { timeZone: "UTC" })
      .replace(/[\/:]/g, "-");
    const errorFileName = `${errorName}_error_${currentDate}.txt`;
    const errorFilePath = resolve(`${errorDir}/${errorFileName}`);

    await fs.mkdir(errorDir, { recursive: true });
    await fs.writeFile(
      errorFilePath,
      `${errorMessage} : ${error.stack}`,
      "utf-8"
    );

    logger.error(`Détails de l'erreur enregistrés dans : ${errorFilePath}`);
  },
};
