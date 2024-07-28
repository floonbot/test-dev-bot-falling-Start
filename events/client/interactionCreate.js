const { InteractionType, Events, PermissionsBitField } = require("discord.js");
const { resolve } = require("path");
const { mkdir, writeFile } = require("fs-extra");
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

module.exports = {
  name: Events.InteractionCreate,
  async run(client, interaction) {
    try {
      if (interaction.type === InteractionType.ApplicationCommand) {
        const command = client.commands.get(interaction.commandName);
        if (
          command.data.default_member_permissions &&
          !interaction.member.permissions.has(
            new PermissionsBitField(command.data.default_member_permissions)
          )
        ) {
          return interaction.reply(
            `You don't have the permission \`${new PermissionsBitField(
              command.data.default_member_permissions
            ).toArray()}\` to run this command.`
          );
        }
        await command.run(interaction);
      } else {
        const [name, ...args] = interaction.customId.split("_");
        const file = client.interactions.find(
          (i) => i.name === name && i.type === interaction.componentType
        );
        if (!file) return;

        if (
          file.permission &&
          !interaction.member.permissions.has(
            new PermissionsBitField(file.permission)
          )
        ) {
          return interaction.reply(
            `You don't have permission \`${new PermissionsBitField(
              file.permission
            ).toArray()}\` to execute this component.`
          );
        }
        await file.run(interaction, ...args);
      }
    } catch (error) {
      console.error(`Error handling interactionCreate: ${error.stack}`);
      interaction.reply({
        content: "An error occurred while processing this interactionCreate.",
        ephemeral: true,
      });

      try {
        const errorDir = resolve("./libs/errors/interactionCreate/");
        const currentDate = new Date()
          .toLocaleString("en-US", { timeZone: "UTC" })
          .replace(/[\/:]/g, "-");
        const errorFilePath = resolve(
          `${errorDir}/interactionCreate_error_${currentDate}.txt`
        );

        await mkdir(errorDir, { recursive: true });
        await writeFile(
          errorFilePath,
          `Error handling interactionCreate: ${error.stack}`,
          "utf-8"
        );

        logger.error(
          `Error handling interactionCreate. A file has been created with the error details: ${errorFilePath}`
        );
      } catch (fileError) {
        logger.fatal(
          `Failed to write error file for interactionCreate: ${fileError.stack}`
        );
      }
    }
  },
};
