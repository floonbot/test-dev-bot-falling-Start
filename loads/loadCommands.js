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
        const dirsCommands = await readdir("./commands/");

        for (const dir of dirsCommands) {
            const files = (await readdir(`./commands/${dir}/`)).filter((file) => file.endsWith(".js"));

            for (const file of files) {
                const filePath = resolve(`./commands/${dir}/${file}`);

                if (file.endsWith('.js')) {
                    try {
                        const command = require(filePath);
                        client.commands.set(command.data.name, command);
                        count++;
                        logger.info(`${global.colors.text_bright_green}[Command]`,`${global.colors.text_white}=> command/${dir}/${file} loaded`);
                    } catch (error) {
                        const errorDir = resolve("./libs/errors/commands/");
                        const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
                        const testFilePath = resolve(`${errorDir}/${file.split('.')[0]}_error_${currentDate}.txt`);

                        await mkdir(errorDir, { recursive: true });

                        await writeFile(testFilePath, `Error loading command/${dir}/${file} : ${error.stack}`, 'utf-8');
                        logger.error(`${global.colors.text_bright_red}[Command]`,`${global.colors.text_white}=> command/${dir}/${file.split('.')[0]}.js not loaded`);
                        logger.error(`${global.colors.text_bright_red}Error loading command from file ${file} in directory ${dir}. A test file has been created with the error details: ${testFilePath}`);
                        errorCount++;
                    }
                }
            }
        }

        if (errorCount > 0) {
            logger.warn(`${global.colors.text_light_red}[Command] => ${errorCount} command not loaded`);
        }
    } catch (error) {
        const errorDir = resolve("./libs/errors/commands/");
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
        const testFilePath = resolve(`${errorDir}/command_error_${currentDate}.txt`);

        await mkdir(errorDir, { recursive: true });

        await writeFile(testFilePath, `Error loading command: ${error.stack}`, 'utf-8');
        logger.fatal(`[Command] => Error loading command. A test file has been created with the error details: ${testFilePath}`);
    }

    logger.info(`${global.colors.text_light_green}[Command] => ${count} command loaded`);
};
