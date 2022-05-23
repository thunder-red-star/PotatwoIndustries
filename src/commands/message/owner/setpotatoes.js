const DJSBuilders = require("@discordjs/builders");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: true,
    name: "setpotatoes",
    aliases: ["sp"],
    description: "Set someones potatoes.",
    detailedDescription: "An owner command that sets someone's potatoes.",
    cooldown: 0,
    args: [
        {
            name: "amount",
            description: "The amount of potatoes you want to set.",
            type: "number",
            required: true
        },
        {
            name: "target",
            description: "The user you want to set the potatoes of.",
            type: "user",
            required: true
        }
    ],
    run: async function(message, client, args) {
        // Check if the user already has an account.
        let amount = args.amount;
        let target = args.target;

        // Check if the user is trying to give potatoes to a bot
        if (target.bot) {
            return message.reply({
                embeds: [{
                    color: client.colors.warning,
                    description: client.customEmojis.warning + " You can't give potatoes to a bot!"
                }]
            });
        } else {
            // Get the target user.
            let user = client.database.users.get(target.id);
            if (!user) {
                // Create the user.
                await client.database.users.addUser(target.id);
                user = await client.database.users.get(target.id);
            }
            // Give the user some potatoes.
            await user.setPotatoes(amount);
            client.database.write();
            return message.reply({
                embeds: [{
                    color: client.colors.success,
                    description: client.customEmojis.check + " " + target.username + " now has " + amount + " " + client.customEmojis.potato + "."
                }]
            });
        }
    }
};