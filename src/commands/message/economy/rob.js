let randomArrayElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "rob",
    aliases: [],
    description: "Allows you to rob someone.",
    detailedDescription: "Allows you to rob someone. You could succeed and take some of their potatoes, or you could fail and get nothing, or even get caught and lose some of your potatoes.",
    cooldown: 60000,
    args: [
        {
            name: "target",
            description: "The person you want to rob.",
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
            // If the user tries to rob themselves, return an error.
            if (message.author.id === args.target.id) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You can't rob yourself!"
                    }]
                });
            }

            // Check if the user is trying to rob a bot
            if (args.target.bot) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You can't rob a bot!"
                    }]
                });
            }

            // Get the target user.
            let target = client.database.users.get(args.target.id);

            // Check if the target user has an account.
            if (!target) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " That user hasn't started an account yet. Use `" + client.config.defaultPrefix + "start` to start one."
                    }]
                });
            } else {
                // Check if the user has enough potatoes to rob the target.
                if (user.count < 250) {
                    return message.reply({
                        embeds: [{
                            color: client.colors.warning,
                            description: client.customEmojis.warning + " You do not have enough potatoes to rob that person."
                        }]
                    });
                } else {
                    // Check if they have passive mode enabled.
                    if (user.passive) {
                        return message.reply({
                            embeds: [{
                                color: client.colors.warning,
                                description: client.customEmojis.warning + " You are in passive mode, and cannot rob anyone."
                            }]
                        });
                    } else {
                        // Check if the target user is in passive mode.
                        if (target.passive) {
                            return message.reply({
                                embeds: [{
                                    color: client.colors.warning,
                                    description: client.customEmojis.warning + " That user is in passive mode, and cannot be robbed."
                                }]
                            });
                        } else {
                            // Randomly decide if the user will succeed or not.
                            let success = Math.random() < 0.4;
                            if (success) {
                                // Success!
                                // Get a random proportion of the target's potatoes.
                                let potatoes = Math.floor((Math.random() * 0.3 + 0.1) * target.count);
                                // Give the user the potatoes.
                                await user.addPotatoes(potatoes);
                                // Remove the potatoes from the target.
                                await target.addPotatoes(-potatoes);
                                // Write to the database.
                                client.database.write();
                                // Send a message to the user.
                                return message.reply({
                                    embeds: [{
                                        color: client.colors.potato,
                                        description: randomArrayElement(client.messages.robSuccess).replace("{amount}", potatoes).replace("{target}", args.target.username).replace("{potato}", client.customEmojis.potato)
                                    }]
                                });
                            } else {
                                let feeChance = Math.random() < 0.5;
                                if (feeChance) {
                                    // The user has to pay a fee.
                                    let fee = 250;
                                    // Remove the fee from the user.
                                    await user.addPotatoes(-fee);
                                    // Add the fee to the target.
                                    await target.addPotatoes(fee);
                                    // Write to the database.
                                    client.database.write();
                                    // Send a message to the user.
                                    return message.reply({
                                        embeds: [{
                                            color: client.colors.warning,
                                            description: randomArrayElement(client.messages.robPayFee).replace("{amount}", fee).replace("{potato}", client.customEmojis.potato).replace("{target}", args.target.username)
                                        }]
                                    });
                                } else {
                                    // The user has to pay nothing.
                                    // Send a message to the user.
                                    return message.reply({
                                        embeds: [{
                                            color: client.colors.warning,
                                            description: randomArrayElement(client.messages.robFail).replace("{target}", args.target.username)
                                        }]
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};