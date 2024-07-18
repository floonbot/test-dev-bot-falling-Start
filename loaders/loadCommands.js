const { readdirSync, promises: fsPromises } = require("fs");
const { resolve } = require("path");
require("colors");

module.exports = async (client) => {
    let count = 0;

    try {
        const dirsCommands = readdirSync("./commands/");

        for (const dir of dirsCommands) {
            const files = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));

            for (const file of files) {
                const filePath = resolve(`./commands/${dir}/${file}`);

                if (file.endsWith('.js')) {
                    try {
                        const command = require(filePath);
                        client.commands.set(command.data.name, command);
                        count++;
                        console.log("[commands] =>".green.reset, `Command ${command.data.name} loaded`);
                    } catch (error) {
                        const errorDir = resolve("./errors/");
                        const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
                        const testFilePath = resolve(`${errorDir}/${file.split('.')[0]}_error_${currentDate}.log`);

                        await fsPromises.mkdir(errorDir, { recursive: true });

                        await fsPromises.writeFile(testFilePath, `Error loading command from file ${file} in directory ${dir}: ${error.stack}`, 'utf-8');
                        console.log("[commands] =>".red.reset, `Command ${file.split('.')[0]} not loaded`);
                        console.error("[commands] =>".red.reset, `Error loading command from file ${file} in directory ${dir}. A test file has been created with the error details: ${testFilePath}`);
                    }
                }
            }
        }

        console.log("[commands] =>".green.reset, `${count} commands loaded`);
    } catch (error) {
        const errorDir = resolve("./errors/");
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
        const testFilePath = resolve(`${errorDir}/commands_error_${currentDate}.log`);

        await fsPromises.mkdir(errorDir, { recursive: true });

        await fsPromises.writeFile(testFilePath, `Error loading commands: ${error.stack}`, 'utf-8');
        console.error("[commands] =>".red.reset, `Error loading commands. A test file has been created with the error details: ${testFilePath}`);
    }
};
