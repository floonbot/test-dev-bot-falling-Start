const { readdirSync, promises: fsPromises } = require("fs");
const { resolve } = require("path");

module.exports = async (client) => {
    let count = 0;

    try {
        const dirsInteractions = readdirSync("./components");

        for (const dir of dirsInteractions) {
            const files = readdirSync(`./components/${dir}/`).filter((file) => file.endsWith(".js"));

            for (const file of files) {
                const filePath = resolve(`./components/${dir}/${file}`);

                try {
                    const interaction = require(filePath);
                    client.interactions.set(interaction.name, interaction);
                    count++;
                    console.log(`${global.colors.text_light_cyan}[Interactions] =>`, `${global.colors.text_bright_white}Interaction ${interaction.name, dir} loaded from file ${file}`);
                } catch (error) {
                    const errorDir = resolve("./libs/errors/");
                    const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
                    const testFilePath = resolve(`${errorDir}/${file.split('.')[0]}_error_${currentDate}.log`);

                    await fsPromises.mkdir(errorDir, { recursive: true });

                    await fsPromises.writeFile(testFilePath, `Error loading interaction from file ${file} in directory ${dir}: ${error.stack}`, 'utf-8');
                    console.log(`${global.colors.text_light_red}[interactions] =>`, `${global.colors.text_bright_white}Interaction ${file.split('.')[0]} not loaded from file ${file}`);
                    console.error(`${global.colors.text_light_red}[interactions] =>`, `${global.colors.text_bright_white}Error loading interaction from file ${file} in directory ${dir}. A test file has been created with the error details: ${testFilePath}`);
                }
            }
        }

        console.log(`${global.colors.text_light_cyan}[interactions] =>`, `${count} interactions loaded`);
    } catch (error) {
        const errorDir = resolve("./libs/errors/");
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
        const testFilePath = resolve(`${errorDir}/interactions_error_${currentDate}.log`);

        await fsPromises.mkdir(errorDir, { recursive: true });

        await fsPromises.writeFile(testFilePath, `Error loading interactions: ${error.stack}`, 'utf-8');
        console.error(`${global.colors.text_light_red}[interactions] =>`, `${global.colors.text_bright_white}Error loading interactions. A test file has been created with the error details: ${testFilePath}`);
    }
};
