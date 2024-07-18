const mysql = require("mysql");
const { promises: fsPromises } = require("fs");
const { resolve } = require("path");
require("colors");
const { getTablesWithColumns, handleColumnError } = require("../fonctions/dbFunctions");
const { magenta } = require("colors");

const HOST = process.env.HOST;
const USER = process.env.USER;
const MDP = process.env.MDP;
const DATABASE = process.env.DATABASE;
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 3000;

async function connectToDatabase(retries = 0) {
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection({
            host: HOST,
            user: USER,
            password: MDP,
            database: DATABASE
        });

        db.connect((err) => {
            if (err) {
                if (err.code === 'ECONNREFUSED' && retries < MAX_RETRIES) {
                    console.log(`[Database] => Connection refused. Retrying (${retries + 1}/${MAX_RETRIES})...`.yellow);
                    setTimeout(() => {
                        resolve(connectToDatabase(retries + 1));
                    }, RETRY_INTERVAL);
                } else if (retries >= MAX_RETRIES) {
                    console.error(`[Database] => All ${MAX_RETRIES} attempts to connect to the database have failed.`.red);
                    reject(new Error("Max connection attempts exceeded"));
                } else {
                    reject(err);
                }
            } else {
                if (retries > 0) {
                    console.log(`[Database] => Connection established successfully after ${retries} attempts!`.magenta);
                } else {
                    console.log("\n[Database] =>".magenta.reset, "Initial connection established successfully!");
                }
                resolve(db);
            }
        });
    });
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
            const errorDir = resolve("./errors/");
            const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
            const errorFilePath = resolve(`${errorDir}/database_connection_error_${currentDate}.log`);

            await fsPromises.mkdir(errorDir, { recursive: true });

            await fsPromises.writeFile(errorFilePath, `Error connecting to the database: ${error.stack}`, 'utf-8');
            console.error("[database] =>".red.reset, `Error connecting to the database. An error file has been created with the details: ${errorFilePath}`);
        }
    }

    return db;
};
