const DJSBuilders = require("@discordjs/builders");
const fs = require("fs");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: true,
    name: "reload",
    aliases: [],
    description: "Reload a command.",
    detailedDescription: "An owner command that reloads commands.",
    cooldown: 0,
    args: [
        {
            name: "command",
            description: "The command you want to reload.",
            type: "string",
            required: true
        }
    ],
    run: async function(message, client, args) {
        // Load the command.
        let command = args.command;

        // Check if the command exists.
        if (client.messageCommands.has(command)) {
            // Get the command.
            let cmd = client.messageCommands.get(command);
            // Find the command location.
            let location;
            let messageCommandDirs = fs.readdirSync("./src/commands/message/");
            for (let i = 0; i < messageCommandDirs.length; i++) {
                let dir = messageCommandDirs[i];
                if (fs.existsSync("./src/commands/message/" + dir + "/" + command + ".js")) {
                    location = "../" + dir + "/" + command;
                    break;
                }
            }
            // Check if the command exists.
            if (location) {
                // Set the command to the new command.
                client.messageCommands.set(command, require(location));
                return message.reply({
                    embeds: [{
                        color: client.colors.success,
                        description: client.customEmojis.check + " Successfully reloaded the command `" + cmd.name + "`."
                    }]
                });
            } else {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " The command `" + cmd.name + "` doesn't exist."
                    }]
                });
            }
        }
    }
};