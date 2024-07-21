const { readdirSync, promises: fsPromises } = require("fs");
const { resolve } = require("path");

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
                    console.log(`${global.colors.text_light_yellow}[events] =>`,`${global.colors.text_bright_white}Client event ${event.name} loaded`);

                    count++;
                } catch (error) {
                    const errorDir = resolve("./libs/errors/");
                    const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
                    const testFilePath = resolve(`${errorDir}/${file.split('.')[0]}_error_${currentDate}.log`);

                    await fsPromises.mkdir(errorDir, { recursive: true });

                    await fsPromises.writeFile(testFilePath, `Error loading event from file ${file} in directory ${dir}: ${error.stack}`, 'utf-8');
                    console.log(`${global.colors.text_light_red}[events] =>`, `${global.colors.text_bright_white}Event ${file.split('.')[0]} not loaded`);
                    console.error(`${global.colors.text_light_red}[events] =>`, `${global.colors.text_bright_white}Error loading event from file ${file} in directory ${dir}. A test file has been created with the error details: ${testFilePath}`);
                }
            }
        }

        console.log(`${global.colors.text_light_yellow}[events] =>`, `${count} events loaded`);
    } catch (error) {
        const errorDir = resolve("./libs/errors/");
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
        const testFilePath = resolve(`${errorDir}/events_error_${currentDate}.log`);

        await fsPromises.mkdir(errorDir, { recursive: true });

        await fsPromises.writeFile(testFilePath, `Error loading events: ${error.stack}`, 'utf-8');
        console.error(`${global.colors.text_light_red}[events] =>`, `${global.colors.text_bright_white}Error loading events. A test file has been created with the error details: ${testFilePath}`);
    }
};
