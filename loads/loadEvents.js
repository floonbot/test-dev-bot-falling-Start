const { readdir, writeFile, mkdir } = require("fs-extra");
const { resolve } = require("path");
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

module.exports = async (client) => {
    let count = 0;
    let errorCount = 0;

    try {
        const dirsEvents = await readdir("./events/");

        for (const dir of dirsEvents) {
            const files = (await readdir(`./events/${dir}/`)).filter((file) => file.endsWith(".js"));

            for (const file of files) {
                const filePath = resolve(`./events/${dir}/${file}`);

                if (file.endsWith('.js')) {
                    try {
                        const event = require(filePath);

                        client.on(event.name, (...args) => event.run(client, ...args));
                        count++;
                        logger.info(`${global.colors.text_light_yellow}[Events]`, `${global.colors.text_white}=> event/${dir}/${file} loaded`);
                    } catch (error) {
                        const errorDir = resolve("./libs/errors/events/");
                        const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
                        const testFilePath = resolve(`${errorDir}/${file.split('.')[0]}_error_${currentDate}.txt`);

                        await mkdir(errorDir, { recursive: true });

                        await writeFile(testFilePath, `Error loading event/${dir}/${file} : ${error.stack}`, 'utf-8');
                        logger.error(`${global.colors.text_bright_red}[Events]`, `${global.colors.text_white}=> event/${dir}/${file.split('.')[0]}.js not loaded`);
                        logger.error(`${global.colors.text_bright_red}Error loading event from file ${file} in directory ${dir}. A test file has been created with the error details: ${testFilePath}`);
                        errorCount++;
                    }
                }
            }
        }

        if (errorCount > 0) {
            logger.warn(`${global.colors.text_light_red}[Events] => ${errorCount} events not loaded`);
        }
    } catch (error) {
        const errorDir = resolve("./libs/errors/events/");
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
        const testFilePath = resolve(`${errorDir}/events_error_${currentDate}.txt`);

        await mkdir(errorDir, { recursive: true });

        await writeFile(testFilePath, `Error loading events: ${error.stack}`, 'utf-8');
        logger.fatal(`[Events] => Error loading events. A test file has been created with the error details: ${testFilePath}`);
    }

    logger.info(`${global.colors.text_light_yellow}[Events] => ${count} events loaded`);
};
