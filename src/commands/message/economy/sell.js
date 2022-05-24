const ItemDatabase = require("../../../structures/ItemDatabase");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "sell",
    aliases: [],
    description: "Sell an item.",
    detailedDescription: "Sell an item from your inventory.",
    cooldown: 10000,
    args: [
        {
            name: "count",
            description: "The amount of items to sell.",
            type: "number",
            required: true
        },
        {
            name: "item",
            description: "The item to sell.",
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
            // Check if the item is sellable.
            if (!itemData.itemData.sellable) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You can't sell that item."
                    }]
                });
            }
            // Sell the item.
            user.inventory.remove(itemData.itemData.name, args.count);
            user.addPotatoes(itemData.itemData.sell * args.count);

            client.database.write();

            // Send the message.
            return message.reply({
                embeds: [{
                    color: client.colors.potato,
                    description: "You sold **" + args.count + "** " + itemData.itemData.name + " for **" + itemData.itemData.sell * args.count + "** " + client.customEmojis.potato + "."
                }]
            });
        }
    }
};