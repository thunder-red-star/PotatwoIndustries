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
    name: "gamble",
    aliases: [],
    description: "Gamble your potatoes.",
    detailedDescription: "Gambling is a great way to earn potatoes. You can gamble for a chance to win double the amount of potatoes you bet. But you can also lose your potatoes.",
    cooldown: 10000,
    args: [
        {
            name: "amount",
            description: "The amount of potatoes you want to gamble.",
            type: "number",
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
            // Check if the user is trying to gamble negative potatoes.
            if (args.amount < 1) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You can't gamble that many potatoes!"
                    }]
                });
            }
            // Check if the user has enough potatoes
            if (user.count < args.amount) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You don't have enough potatoes to gamble that much!"
                    }]
                });
            }

            let amount = Math.floor(args.amount);

            // Gamble for potatoes.
            // Flip two dice. The sum is the number the bot flips.
            let dice1 = Math.floor(Math.random() * 6) + 1;
            let dice2 = Math.floor(Math.random() * 6) + 1;
            let botSum = dice1 + dice2;

            // Flip two dice. The sum is the number the user flips.
            let userDice1 = Math.floor(Math.random() * 6) + 1;
            let userDice2 = Math.floor(Math.random() * 6) + 1;
            let userSum = userDice1 + userDice2;

            // Check if the user won or lost.
            if (botSum > userSum) {
                // User lost.
                // Remove the potatoes from the user's account.
                user.addPotatoes(amount * -1);
                client.database.write();
                // Send the message.
                return message.reply({
                    embeds: [{
                        color: client.colors.potato,
                        description: "You flipped: **" + userSum + "**\n" + "I flipped: **" + botSum + "**" + "\n\nYou lost " + amount + client.customEmojis.potato + ". You now have " + user.count + client.customEmojis.potato + "."
                    }]
                });
            } else if (botSum < userSum) {
                // User won.
                // Add the potatoes to the user's account.
                user.addPotatoes(amount);
                client.database.write();
                // Send the message.
                return message.reply({
                    embeds: [{
                        color: client.colors.potato,
                        description: "You flipped: **" + userSum + "**\n" + "I flipped: **" + botSum + "**" + "\n\nYou won " + amount + client.customEmojis.potato + ". You now have " + user.count + client.customEmojis.potato + "."
                    }]
                });
            } else {
                // User tied.
                // Send the message.
                return message.reply({
                    embeds: [{
                        color: client.colors.potato,
                        description: "You flipped: **" + userSum + "**\n" + "I flipped: **" + botSum + "**\n" + "\n\nNothing happened."
                    }]
                });
            }
        }
    }
};