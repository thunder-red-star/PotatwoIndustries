module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "deposit",
    aliases: ["dep"],
    description: "Allows you to deposit money into your bank account.",
    detailedDescription: "Allows you to deposit money into your bank account.",
    cooldown: 2500,
    args: [
        {
            name: "amount",
            description: "The amount of money to deposit.",
            type: "number",
            required: true
        }
    ],
    run: async function(message, client, args) {
        let amount = args.amount;

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
            if (amount <= 0) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You cannot deposit a negative amount of money."
                    }]
                });
            } else if (amount > user.count) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You do not have that much money."
                    }]
                });
            } else {
                user.addBank(Math.floor(amount));
                user.addPotatoes(-Math.floor(amount));
                client.database.write();
                return message.reply({
                    embeds: [{
                        color: client.colors.potato,
                        description: "You have deposited **" + Math.floor(amount) + "**" + client.customEmojis.potato + " into your bank account."
                    }]
                });
            }
        }
    }
};