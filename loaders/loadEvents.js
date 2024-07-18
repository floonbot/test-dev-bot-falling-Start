const { readdirSync, promises: fsPromises } = require("fs");
const { resolve } = require("path");
require("colors");

module.exports = async (client) => {
    let count = 0;

    try {
        const dirsEvents = readdirSync("./events/");

        for (const dir of dirsEvents) {
            const files = readdirSync(`./events/${dir}/`).filter((file) => file.endsWith(".js"));

            for (const file of files) {
                const filePath = resolve(`./events/${dir}/${file}`);

                try {
                    const event = require(filePath);

                    client.on(event.name, (...args) => event.run(client, ...args));
                    console.log(("[events] =>").yellow.reset, `Client event ${event.name} loaded`);

                    count++;
                } catch (error) {
                    const errorDir = resolve("./errors/");
                    const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
                    const testFilePath = resolve(`${errorDir}/${file.split('.')[0]}_error_${currentDate}.log`);

                    await fsPromises.mkdir(errorDir, { recursive: true });

                    await fsPromises.writeFile(testFilePath, `Error loading event from file ${file} in directory ${dir}: ${error.stack}`, 'utf-8');
                    console.log("[events] =>".red.reset, `Event ${file.split('.')[0]} not loaded`);
                    console.error("[events] =>".red.reset, `Error loading event from file ${file} in directory ${dir}. A test file has been created with the error details: ${testFilePath}`);
                }
            }
        }

        console.log("[events] =>".yellow.reset, `${count} events loaded`);
    } catch (error) {
        const errorDir = resolve("./errors/");
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
        const testFilePath = resolve(`${errorDir}/events_error_${currentDate}.log`);

        await fsPromises.mkdir(errorDir, { recursive: true });

        await fsPromises.writeFile(testFilePath, `Error loading events: ${error.stack}`, 'utf-8');
        console.error("[events] =>".red.reset, `Error loading events. A test file has been created with the error details: ${testFilePath}`);
    }
};
