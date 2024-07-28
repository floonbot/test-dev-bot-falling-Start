const mysql = require("mysql2/promise");
const { mkdir, writeFile } = require("fs-extra");
const { resolve } = require("path");
const log4js = require("log4js");
const {
  getTablesWithColumns,
  handleColumnError,
} = require("../libs/functions/databaseFunctions");

log4js.configure({
  appenders: {
    console: { type: "console" },
  },
  categories: {
    default: { appenders: ["console"], level: "debug" },
  },
});

const logger = log4js.getLogger();

const HOST = process.env.HOST;
const USER = process.env.USER;
const MDP = process.env.MDP;
const DATABASE = process.env.DATABASE;
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 3000;

async function connectToDatabase(retries = 0) {
  try {
    const db = await mysql.createConnection({
      host: HOST,
      user: USER,
      password: MDP,
      database: DATABASE,
    });
    if (retries > 0) {
      logger.info(
        `${global.colors.text_light_green}[Database] => Connection established successfully after ${retries} attempts!`
      );
    } else {
      logger.info(
        `${global.colors.text_light_green}[Database] => Initial connection established successfully!`
      );
    }
    return db;
  } catch (err) {
    if (err.code === "ECONNREFUSED" && retries < MAX_RETRIES) {
      logger.warn(
        `[Database] => Connection refused. Retrying (${
          retries + 1
        }/${MAX_RETRIES})...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
      return connectToDatabase(retries + 1);
    } else if (retries >= MAX_RETRIES) {
      logger.error(
        `${global.colors.text_light_red}[Database]`,
        `${global.colors.text_white}=> All ${MAX_RETRIES} attempts to connect to the database have failed.`
      );
      throw new Error("Max connection attempts exceeded");
    } else {
      throw err;
    }
  }
}

module.exports = async () => {
  let db;
  const tablesLoaded = [];

  try {
    db = await connectToDatabase();
    await getTablesWithColumns(db, tablesLoaded);
  } catch (error) {
    if (error.message.includes("SHOW COLUMNS")) {
      await handleColumnError("unknown", error);
    } else {
      const errorDir = resolve("./libs/errors/databases/");
      const currentDate = new Date()
        .toLocaleString("en-US", { timeZone: "UTC" })
        .replace(/[\/:]/g, "-");
      const errorFilePath = resolve(
        `${errorDir}/database_connection_error_${currentDate}.txt`
      );

      await mkdir(errorDir, { recursive: true });

      await writeFile(
        errorFilePath,
        `Error connecting to the database: ${error.stack}`,
        "utf-8"
      );
      logger.error(
        `${global.colors.text_bright_red}[Database] => Error connecting to the database. An error file has been created with the details: ${errorFilePath}`
      );
    }
  }

  return db;
};
