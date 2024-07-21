const { readdirSync, promises: fsPromises } = require("fs");
const { resolve } = require("path");

module.exports = async (client) => {
    let count = 0;

    try {
        const dirsInteractions = readdirSync("./interactions");

        for (const dir of dirsInteractions) {
            const files = readdirSync(`./interactions/${dir}/`).filter((file) => file.endsWith(".js"));

            for (const file of files) {
                const filePath = resolve(`./interactions/${dir}/${file}`);

                try {
                    const interaction = require(filePath);
                    client.interactions.set(interaction.name, interaction);
                    count++;
                    console.log("[Interactions] =>".cyan.reset, `Interaction ${interaction.name, dir} loaded from file ${file}`);
                } catch (error) {
                    const errorDir = resolve("./libs/errors/");
                    const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
                    const testFilePath = resolve(`${errorDir}/${file.split('.')[0]}_error_${currentDate}.log`);

                    await fsPromises.mkdir(errorDir, { recursive: true });

                    await fsPromises.writeFile(testFilePath, `Error loading interaction from file ${file} in directory ${dir}: ${error.stack}`, 'utf-8');
                    console.log("[interactions] =>".red.reset, `Interaction ${file.split('.')[0]} not loaded from file ${file}`);
                    console.error("[interactions] =>".red.reset, `Error loading interaction from file ${file} in directory ${dir}. A test file has been created with the error details: ${testFilePath}`);
                }
            }
        }

        console.log("[interactions] =>".cyan.reset, `${count} interactions loaded`);
    } catch (error) {
        const errorDir = resolve("./libs/errors/");
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "UTC" }).replace(/[\/:]/g, "-");
        const testFilePath = resolve(`${errorDir}/interactions_error_${currentDate}.log`);

        await fsPromises.mkdir(errorDir, { recursive: true });

        await fsPromises.writeFile(testFilePath, `Error loading interactions: ${error.stack}`, 'utf-8');
        console.error("[interactions] =>".red.reset, `Error loading interactions. A test file has been created with the error details: ${testFilePath}`);
    }
};
