const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const path = require("path");
const fs = require("fs");

module.exports = {
  name: "reload-commands",
  description: "Reloads a command.",
  category: "Utility",
  dmPermission: false,
  defaultMemberPermissions: null,
  nsfw: false,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads a command.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command to reload.")
        .setRequired(true)
    ),
  async run(interactionOrMessage) {
    if (
      interactionOrMessage.user &&
      interactionOrMessage.user.id !== process.env.OWNER_ID
    ) {
      return interactionOrMessage.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    if (
      interactionOrMessage.author &&
      interactionOrMessage.author.id !== process.env.OWNER_ID
    ) {
      return interactionOrMessage.channel.send(
        "You do not have permission to use this command."
      );
    }

    let commandName;
    if (interactionOrMessage.options) {
      commandName = interactionOrMessage.options
        .getString("command", true)
        .toLowerCase();
    } else {
      const args = interactionOrMessage.content
        .slice(process.env.PREFIX.length)
        .trim()
        .split(/ +/);
      commandName = args[1] ? args[1].toLowerCase() : null;
    }

    const command = interactionOrMessage.client.commands.get(commandName);

    if (!command || !commandName) {
      const availableCommands = interactionOrMessage.client.commands
        .map((cmd) => cmd.name)
        .join(", ");
      const embedReloadAvailableCommands = new EmbedBuilder()
        .setTitle("<:RELOAD:1266724399952826459>- Available commands")
        .setColor("#00A705")
        .setThumbnail(
          interactionOrMessage.user
            ? interactionOrMessage.user.displayAvatarURL({
                dynamic: true,
                size: 256,
                format: "png",
              })
            : interactionOrMessage.author.displayAvatarURL({
                dynamic: true,
                size: 256,
                format: "png",
              })
        )
        .setDescription(
          `
\`\`\`asciidoc
• There is no command with the name :: ${commandName}!
• Available commands :: ${availableCommands}
\`\`\`      
        `
        )
        .setFooter({
          text: `available commands by ${
            interactionOrMessage.user
              ? interactionOrMessage.user.tag
              : interactionOrMessage.author.tag
          }`,
          iconURL: `${
            interactionOrMessage.user
              ? interactionOrMessage.user.displayAvatarURL({
                  dynamic: true,
                  size: 128,
                  format: "png",
                })
              : interactionOrMessage.author.displayAvatarURL({
                  dynamic: true,
                  size: 128,
                  format: "png",
                })
          }`,
        })
        .setTimestamp();
      return interactionOrMessage.reply({
        embeds: [embedReloadAvailableCommands],
      });
    }

    const commandsPath = path.resolve(__dirname, "../");
    let commandPath = null;

    function findCommand(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          findCommand(filePath);
        } else if (file === `${command.data.name}.js`) {
          commandPath = filePath;
          return;
        }
      }
    }

    findCommand(commandsPath);

    delete require.cache[require.resolve(commandPath)];

    const newCommand = require(commandPath);
    const embedReloadNewCommand = new EmbedBuilder()
      .setTitle("<:RELOAD:1266724399952826459>- New commands")
      .setColor("#00A705")
      .setThumbnail(
        interactionOrMessage.user
          ? interactionOrMessage.user.displayAvatarURL({
              dynamic: true,
              size: 256,
              format: "png",
            })
          : interactionOrMessage.author.displayAvatarURL({
              dynamic: true,
              size: 256,
              format: "png",
            })
      )
      .setDescription(
        `
\`\`\`asciidoc
• New commands :: ${newCommand.data.name} has been reloaded!
\`\`\`      
    `
      )
      .setFooter({
        text: `new commands by ${
          interactionOrMessage.user
            ? interactionOrMessage.user.tag
            : interactionOrMessage.author.tag
        }`,
        iconURL: `${
          interactionOrMessage.user
            ? interactionOrMessage.user.displayAvatarURL({
                dynamic: true,
                size: 128,
                format: "png",
              })
            : interactionOrMessage.author.displayAvatarURL({
                dynamic: true,
                size: 128,
                format: "png",
              })
        }`,
      })
      .setTimestamp();
    interactionOrMessage.client.commands.set(newCommand.data.name, newCommand);
    await interactionOrMessage.reply({
      embeds: [embedReloadNewCommand]
    });
  },
};
