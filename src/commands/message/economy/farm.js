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
    name: "farm",
    aliases: [],
    description: "Farm potatoes",
    detailedDescription: "You can farm potatoes with this command. There is a chance you could lose potatoes.",
    cooldown: 3000,
    args: [],
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
            let positivePotatoCount = Math.random() < 0.7 ? true : false;
            let potatoCount = 0;
            if (positivePotatoCount) {
                potatoCount = Math.floor(Math.random() * (50 - 1) + 1);
            } else {
                potatoCount = Math.floor(Math.random() * (1 - -50) + -50);
            }
            user.addPotatoes(potatoCount);
            client.database.write();
            if (potatoCount > 0) {
                return message.reply({
                    embeds: [{
                        color: client.colors.potato,
                        description: randomArrayElement(client.messages.farmPositivePotatoes).replace("{amount}", potatoCount).replace("{potato}", client.customEmojis.potato)
                    }]
                });
            } else {
                return message.reply({
                    embeds: [{
                        color: client.colors.potato,
                        description: randomArrayElement(client.messages.farmNegativePotatoes).replace("{amount}", potatoCount * -1).replace("{potato}", client.customEmojis.potato)
                    }]
                });
            }
        }
    }
};