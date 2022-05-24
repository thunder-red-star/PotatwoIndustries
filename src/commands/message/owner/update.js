// Update the bot by pulling the latest version from GitHub.

const DJSBuilders = require("@discordjs/builders");
const { exec } = require("child_process");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: true,
    name: "update",
    aliases: [],
    description: "Updates the bot.",
    detailedDescription: "Update the bot by pulling the latest version from GitHub, and restarting it.",
    cooldown: 0,
    args: [],
    run: async function(message, client, args) {
        // Send a message to the channel.
        message.reply({
            embeds: [{
                color: client.colors.success,
                description: client.customEmojis.check + " Updating... (I will restart when done)"
            }]
        });

        // Update the bot.
        exec("git pull", (error, stdout, stderr) => {
            if (error) {
                console.error(error);
                return message.reply({
                    embeds: [{
                        color: client.colors.error,
                        description: client.customEmojis.error + " An error occurred while updating."
                    }]
                });
            }
        });
    }
};