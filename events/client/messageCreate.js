const { Events, PermissionsBitField } = require("discord.js");
const { resolve } = require("path");
const { mkdir, writeFile } = require("fs-extra");
const log4js = require("log4js");
const prefix = process.env.PREFIX;

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
  name: Events.MessageCreate,
  async run(client, message) {
    try {
      if (!message.content.startsWith(prefix) || message.author.bot) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = client.commands.get(commandName);

      if (!command) return;

      if (
        command.defaultMemberPermissions &&
        !message.member.permissions.has(
          new PermissionsBitField(command.defaultMemberPermissions)
        )
      ) {
        return message.reply(
          `You don't have the necessary permissions: \`${new PermissionsBitField(
            command.defaultMemberPermissions
          ).toArray()}\` to use this command.`
        );
      }

      if (command.nsfw && !message.channel.nsfw) {
        return message.reply("This command can only be used in NSFW channels.");
      }

      if (!command.dmPermission && message.channel.type === "DM") {
        return message.reply("This command cannot be used in direct messages.");
      }

      await command.run(message, args);
    } catch (error) {
      console.error(`Error executing command: ${error.stack}`);
      message.reply("An error occurred while executing this command.");

      try {
        const errorDir = resolve("./libs/errors/messageCreate/");
        const currentDate = new Date()
          .toLocaleString("en-US", { timeZone: "UTC" })
          .replace(/[\/:]/g, "-");
        const errorFilePath = resolve(
          `${errorDir}/messageCreat_error_${currentDate}.txt`
        );

        await mkdir(errorDir, { recursive: true });
        await writeFile(
          errorFilePath,
          `Error executing command: ${error.stack}`,
          "utf-8"
        );

        logger.error(
          `Error executing command. A file has been created with the error details: ${errorFilePath}`
        );
      } catch (fileError) {
        logger.fatal(
          `Failed to write error file for command execution: ${fileError.stack}`
        );
      }
    }
  },
};
