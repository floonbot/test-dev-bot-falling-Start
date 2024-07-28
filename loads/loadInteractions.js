const { readdir, writeFile, mkdir } = require("fs-extra");
const { resolve } = require("path");
const log4js = require("log4js");

log4js.configure({
  appenders: {
    console: { type: "console" },
  },
  categories: {
    default: { appenders: ["console"], level: "debug" },
  },
});

const logger = log4js.getLogger();

module.exports = async (client) => {
  let count = 0;
  let errorCount = 0;

  try {
    const dirscomponents = await readdir("./components");

    for (const dir of dirscomponents) {
      const files = (await readdir(`./components/${dir}/`)).filter((file) =>
        file.endsWith(".js")
      );

      for (const file of files) {
        const filePath = resolve(`./components/${dir}/${file}`);

        try {
          const interaction = require(filePath);
          client.interactions.set(interaction.name, interaction);
          count++;
          logger.info(
            `${global.colors.text_light_cyan}[Components] => ${global.colors.text_bright_white}components ${interaction.name}/${file} loaded`
          );
        } catch (error) {
          const errorDir = resolve("./libs/errors/components/");
          const currentDate = new Date()
            .toLocaleString("en-US", { timeZone: "UTC" })
            .replace(/[\/:]/g, "-");
          const testFilePath = resolve(
            `${errorDir}/${file.split(".")[0]}_error_${currentDate}.txt`
          );

          await mkdir(errorDir, { recursive: true });

          await writeFile(
            testFilePath,
            `Error loading components from file ${file} in directory ${dir}: ${error.stack}`,
            "utf-8"
          );
          logger.error(
            `${global.colors.text_light_red}[Components] => ${global.colors.text_bright_white}components/${dir}/${file} not loaded`
          );
          logger.error(
            `${global.colors.text_light_red}Error loading components from file ${file} in directory ${dir}. A test file has been created with the error details: ${testFilePath}`
          );
          errorCount++;
        }
      }
    }

    if (errorCount > 0) {
      logger.warn(
        `${global.colors.text_light_red}[Components] => ${errorCount} components not loaded`
      );
    }

    logger.info(
      `${global.colors.text_light_cyan}[Components] => ${count} components loaded`
    );
  } catch (error) {
    const errorDir = resolve("./libs/errors/components/");
    const currentDate = new Date()
      .toLocaleString("en-US", { timeZone: "UTC" })
      .replace(/[\/:]/g, "-");
    const testFilePath = resolve(
      `${errorDir}/components_error_${currentDate}.txt`
    );

    await mkdir(errorDir, { recursive: true });

    await writeFile(
      testFilePath,
      `Error loading components: ${error.stack}`,
      "utf-8"
    );
    logger.fatal(
      `${global.colors.text_light_red}[Components] => ${global.colors.text_bright_white}Error loading components. A test file has been created with the error details: ${testFilePath}`
    );
  }
};
