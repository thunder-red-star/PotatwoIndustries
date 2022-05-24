const DJSBuilders = require("@discordjs/builders");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: true,
    name: "shutdown",
    aliases: [],
    description: "Shutdown the bot.",
    detailedDescription: "An owner command that shuts down the bot.",
    cooldown: 0,
    args: [],
    run: async function(message, client, args) {
        // Save the database.
        client.database.write();
        message.channel.send({
            content: "Dumping database...",
        });
        // Log the shutdown.
        message.reply({
            embeds: [{
                color: client.colors.success,
                description: client.customEmojis.check + " Goodbye!"
            }]
        });
        process.exit(18);
    }
};