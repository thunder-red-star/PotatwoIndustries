module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "withdraw",
    aliases: ["with"],
    description: "Allows you to withdraw money from your bank account.",
    detailedDescription: "Allows you to withdraw money from your bank account.",
    cooldown: 180000,
    args: [
        {
            name: "amount",
            description: "The amount of money to withdraw.",
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
                        description: client.customEmojis.warning + " You cannot withdraw a negative amount of money."
                    }]
                });
            } else if (amount > user.bank) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You do not have that much money in your bank account."
                    }]
                });
            } else {
                user.addBank(-Math.floor(amount));
                user.addPotatoes(Math.floor(amount));
                client.database.write();
                return message.reply({
                    embeds: [{
                        color: client.colors.success,
                        description: client.customEmojis.check + " You have withdrawn **" + Math.floor(amount) + "**" + client.customEmojis.potato + " from your bank account."
                    }]
                });
            }
        }
    }
};