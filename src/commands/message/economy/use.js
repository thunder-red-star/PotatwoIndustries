const ItemDatabase = require("../../../structures/ItemDatabase");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "use",
    aliases: [],
    description: "Use an item.",
    detailedDescription: "Use an item, or multiple.",
    cooldown: 10000,
    args: [
        {
            name: "count",
            description: "The amount of items to use.",
            type: "number",
            required: true
        },
        {
            name: "item",
            description: "The item to use.",
            type: "string",
            required: true
        }
    ],
    run: async function(message, client, args) {
        // Check if the user has an account.
        let user = await client.database.users.get(message.author.id);
        if (!user) {
            return message.reply({
                embeds: [{
                    color: client.colors.warning,
                    description: client.customEmojis.warning + " You haven't started an account yet. Use `" + client.config.defaultPrefix + "start` to start one."
                }]
            });
        } else {
            // Get the item from the database.
            let itemData = ItemDatabase.getItem(args.item);
            // Check if the user has the item.
            if (!itemData) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " That item doesn't exist."
                    }]
                });
            }
            if (!user.inventory.has(itemData.itemData.name)) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You don't have that item."
                    }]
                });
            }
            // Check if the user has enough of the item.
            if (user.inventory.count(itemData.itemData.name) < args.count) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You don't have that many of that item."
                    }]
                });
            }
            // Check if the item is usable.
            if (!itemData.itemData.usable) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " That item isn't usable."
                    }]
                });
            }
            // Use the item.
            // Subtract the item from the user's inventory.
            user.inventory.add(itemData.itemData.name, -args.count);
            client.database.write();
            for (let i = 0; i < args.count; i++) {
                // Call the item's use function.
                itemData.use(message);
            }
        }
    }
};