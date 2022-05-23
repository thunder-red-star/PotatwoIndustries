// Bot say command.

let trueStatuses = [
    "yes", "y", "true", "yay", "on"
]

let falseStatuses = [
    "no", "n", "false", "nay", "off"
]

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "passive",
    aliases: [],
    description: "Toggles your passive mode",
    detailedDescription: "Toggles your passive mode. When you are in passive mode, you cannot be attacked by other users, but you cannot attack anyone.",
    cooldown: 180000,
    args: [
        {
            name: "status",
            description: "The status of your passive mode.",
            type: "string",
            required: false
        }
    ],
    run: async function(message, client, args) {
        let status = args.status;

        // Check if the user already has an account.
        let user = client.database.users.get(message.author.id);
        if (!user) {
            return message.reply({
                embeds: [{
                    color: client.colors.warning,
                    description: client.customEmojis.warning + " You haven't started an account yet. Use `" + client.config.defaultPrefix + "start` to start one."
                }]
            });
        } else {
            if (status === null || status === undefined) {
                user.togglePassive();
                client.database.write();
                return message.reply({
                    embeds: [{
                        color: client.colors.success,
                        description: client.customEmojis.check + " You are now " + (user.passive ? "in" : "out of") + " passive mode."
                    }]
                });
            } else {
                if (trueStatuses.includes(status.toLowerCase())) {
                    user.setPassive(true);
                    client.database.write();
                    return message.reply({
                        embeds: [{
                            color: client.colors.success,
                            description: client.customEmojis.check + " You are now in passive mode."
                        }]
                    });
                } else if (falseStatuses.includes(status.toLowerCase())) {
                    user.setPassive(false);
                    client.database.write();
                    return message.reply({
                        embeds: [{
                            color: client.colors.success,
                            description: client.customEmojis.check + " You are now out of passive mode."
                        }]
                    });
                } else {
                    return message.reply({
                        embeds: [{
                            color: client.colors.error,
                            description: client.customEmojis.cross + " You must specify a valid status. Valid statuses are: `" + trueStatuses.join("`, `") + "` and `" + falseStatuses.join("`, `") + "`."
                        }]
                    });
                }
            }
        }
    }
};