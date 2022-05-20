// Bot say command.

let randomArrayElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "give",
    aliases: ["pay"],
    description: "Give your potatoes to someone else.",
    detailedDescription: "You can give potatoes to someone else, but you can't get potatoes back unless they give you them back.",
    cooldown: 10000,
    args: [
        {
            name: "amount",
            description: "The amount of potatoes you want to give.",
            type: "number",
            required: true
        },
        {
            name: "target",
            description: "The user you want to give your potatoes to.",
            type: "user",
            required: true
        }
    ],
    run: async function(message, client, args) {
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
            // Get the target user.
            let target = client.database.users.get(args.target.id);
            if (!target) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " I couldn't find that user, or they haven't started an account yet."
                    }]
                });
            } else {
                // Check if the user is trying to give negative potatoes.
                if (args.amount < 1) {
                    return message.reply({
                        embeds: [{
                            color: client.colors.warning,
                            description: client.customEmojis.warning + " You can't give that many potatoes!"
                        }]
                    });
                } else if (user.count < args.amount) {
                    return message.reply({
                        embeds: [{
                            color: client.colors.warning,
                            description: client.customEmojis.warning + " You don't have enough potatoes to give that much!"
                        }]
                    });
                } else {
                    // Give the potatoes to the target user.
                    user.addPotatoes(Math.floor(-args.amount));
                    let newCount = Math.floor(args.amount) * (1 - client.config.taxRate)
                    target.addPotatoes(newCount);
                    client.database.write();

                    // Send the message.
                    message.reply({
                        embeds: [{
                            color: client.colors.success,
                            description: client.customEmojis.check + " You gave **" + newCount + "** " + client.customEmojis.potato + " to **" + args.target.username + "** (with a tax of " + client.config.taxRate * 100 + "%)."
                        }]
                    });
                }
            }
        }
    }
};