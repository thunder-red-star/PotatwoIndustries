const ItemDatabase = require("../../../structures/ItemDatabase");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "buy",
    aliases: [],
    description: "Buy an item.",
    detailedDescription: "Buy an item from the shop.",
    cooldown: 10000,
    args: [
        {
            name: "count",
            description: "The amount of items to buy.",
            type: "number",
            required: true
        },
        {
            name: "item",
            description: "The item to buy.",
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
            let shopItems = ItemDatabase.getShopItems();
            let count = args.count;
            let item = args.item;

            // Get the item from the database.
            let itemData = ItemDatabase.getItem(item);

            // Check if the user has enough money.
            if (user.getPotatoes() < itemData.itemData.cost * count) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You don't have enough potatoes to buy that many (you need " + (itemData.cost * count) + " " + client.customEmojis.potato + ")."
                    }]
                });
            }
            // Check if the user is trying to buy 0 or less items.
            if (count <= 0) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You have to buy at least 1."
                    }]
                });
            }
            // Check if the item is buyable.
            if (!itemData.itemData.buyable) {
                return message.reply({
                    embeds: [{
                        color: client.colors.warning,
                        description: client.customEmojis.warning + " You can't buy that item from the shop."
                    }]
                });
            }
            // Execute the buy.
            user.addPotatoes(-itemData.itemData.cost * count);
            user.inventory.add(item, count);
            client.database.write();
            return message.reply({
                embeds: [{
                    color: client.colors.potato,
                    description: "You bought **" + count + "** " + item + " for **" + itemData.itemData.cost * count + "** " + client.customEmojis.potato + "."
                }]
            });
        }
    }
};