const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Get the bot latency and additional information.',
    category: 'Utility',
    dmPermission: true,
    defaultMemberPermissions: null,
    nsfw: false,
    category: 'Info',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the bot latency.')
        .setDMPermission(true)
        .setDefaultMemberPermissions(null)
        .setNSFW(false),
    async run(interactionOrMessage) {
      
        if (interactionOrMessage.isCommand && interactionOrMessage.isCommand()) {
            const button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('ping')
                    .setEmoji('🔃')
                    .setLabel('Refresh')
                    .setStyle(ButtonStyle.Secondary)
            );

            await interactionOrMessage.reply({ 
                content: `The bot latency is \`${interactionOrMessage.client.ws.ping}ms\`.`, 
                components: [button] 
            });
        } else {
            const button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('ping')
                    .setEmoji('🔃')
                    .setLabel('Refresh')
                    .setStyle(ButtonStyle.Secondary)
            );

            interactionOrMessage.channel.send({
                content: `The bot latency is \`${interactionOrMessage.client.ws.ping}ms\`.`,
                components: [button]
            });
        }
    }
};
