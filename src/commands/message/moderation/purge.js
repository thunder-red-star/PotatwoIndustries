// Bot purge command.

let types = [
    "all",
    "bots",
    "users",
    "author",
]

module.exports = {
    botPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES"],
    userPermissions: ["MANAGE_MESSAGES"],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "purge",
    aliases: ["clean", "clear"],
    description: "Purges a bunch of messages.",
    detailedDescription: "Allows the user to bulk delete a specified number of messages from the channel.",
    cooldown: 2500,
    args: [
        {
            name: "count",
            description: "The number of messages to delete.",
            type: "number",
            required: true
        },
        {
            name: "type",
            description: "The type of messages to delete.",
            type: "string",
            required: false
        },
        {
            name: "reason",
            description: "The reason for the purge.",
            type: "string",
            required: false
        }
    ],
    run: async function(message, client, args) {
        // Assume args are all parsed, and provided as an object with keys. Get the message key.
        let count = args.count;
        let type = args.type;
        let reason = args.reason;

        if (!types.includes(type) && ((type !== undefined) && (type !== null))) {
            return message.reply({
                embeds: [{
                    title: "Error",
                    description: client.customEmojis.cross + " That is not a valid type. Valid types are: `" + types.join("`, `") + "`.",
                    color: client.colors.error
                }]
            })
        } else if (type === undefined || type === null) {
            type = "all";
        }
        // Check for isNaN
        if (count === undefined || count === null || count.toString().includes("NaN")) {
            return message.reply({
                embeds: [{
                    title: "Error",
                    description: client.customEmojis.cross + " You must specify a number of messages to delete.",
                    color: client.colors.error
                }]
            })
        }
        if (count > 100) {
            return message.reply({
                embeds: [{
                    title: "Error",
                    description: client.customEmojis.cross + " You can only bulk delete up to 100 messages at a time.",
                    color: client.colors.error
                }]
            })
        } else if (count < 2) {
            return message.reply({
                embeds: [{
                    title: "Error",
                    description: client.customEmojis.cross + " You can only bulk delete at least 2 messages.",
                    color: client.colors.error
                }]
            })
        } else {
            // Fetch the most recent message
            let messages = await message.channel.messages.fetch({
                limit: 1
            });
            // If the message is older than 2 weeks, return an error.
            if (messages.first().createdTimestamp < Date.now() - 12096e5) {
                return message.reply({
                    embeds: [{
                        title: "Error",
                        description: client.customEmojis.cross + " You can only bulk delete messages that are less than two weeks old.",
                        color: client.colors.error
                    }]
                })
            } else {
                // Handle message types
                if (type === "all") {
                    // Fetch and delete all messages
                    await message.channel.bulkDelete(count, true, true);
                    return message.channel.send({
                        embeds: [{
                            title: "Success",
                            description: client.customEmojis.check + " Successfully deleted " + count + " messages.",
                            color: client.colors.success
                        }]
                    });
                } else if (type === "bots") {
                    // Fetch bot messages
                    let messages = await message.channel.messages.fetch({
                        limit: count,
                    }).then(messages => messages.filter(m => m.author.bot));
                    // Delete the messages
                    await message.channel.bulkDelete(messages, true, true);
                    return message.channel.send({
                        embeds: [{
                            title: "Success",
                            description: client.customEmojis.check + " Successfully deleted " + count + " bot messages.",
                            color: client.colors.success
                        }]
                    });
                } else if (type === "users") {
                    // Fetch user messages
                    let messages = await message.channel.messages.fetch({
                        limit: count,
                    }).then(messages => messages.filter(m => !m.author.bot));
                    // Delete the messages
                    await message.channel.bulkDelete(messages, true, true);
                    return message.channel.send({
                        embeds: [{
                            title: "Success",
                            description: client.customEmojis.check + " Successfully deleted " + count + " user messages.",
                            color: client.colors.success
                        }]
                    });
                } else if (type === "author") {
                    // Fetch author messages
                    let messages = await message.channel.messages.fetch({
                        limit: count,
                    }).then(messages => messages.filter(m => m.author.id === message.author.id));
                    // Delete the messages
                    await message.channel.bulkDelete(messages, true, true);
                    return message.channel.send({
                        embeds: [{
                            title: "Success",
                            description: client.customEmojis.check + " Successfully deleted " + count + " messages from you.",
                            color: client.colors.success
                        }]
                    });
                }
            }
        }
    }
}
