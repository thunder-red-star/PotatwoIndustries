const ItemDatabase = require("../../../structures/ItemDatabase");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "ahlist",
    aliases: ["ahl"],
    description: "Put an item up for auction.",
    detailedDescription: "Put an item up for auction.",
    cooldown: 10000,
    args: [
        {
            name: "potatoes",
            description: "How many potatoes you want for the item(s).",
            type: "number",
            required: true
        },
        {
            name: "count",
            description: "How many items you want to put up for auction.",
            type: "number",
            required: true
        },
        {
            name: "item",
            description: "The item you want to put up for auction.",
            type: "string",
            required: true
        }
    ],
    run: async function(message, client, args) {
        // Check if the user already has an account.
        let user = await client.database.users.get(message.author.id);
        let targetItem = args.item;
        let targetCount = args.count;
        let targetPotatoes = args.potatoes;
        if (!user) {
            return message.reply({
                embeds: [{
                    title: "Error",
                    description: client.customEmojis.cross + " You don't have an account yet!",
                    color: client.colors.error
                }]
            });
        } else {
            // Check if the user has enough items.
            if (user.inventory.count(targetItem) < args.count) {
                return message.reply({
                    embeds: [{
                        title: "Error",
                        description: client.customEmojis.cross + " You don't have enough items!",
                        color: client.colors.error
                    }]
                });
            }
            // Check if the user is trying to put up negative items.
            if (targetCount < 1) {
                return message.reply({
                    embeds: [{
                        title: "Error",
                        description: client.customEmojis.cross + " You can't put up that many items!",
                        color: client.colors.error
                    }]
                });
            }
            // Check if the user is trying to put up negative potatoes.
            if (targetPotatoes < 50) {
                return message.reply({
                    embeds: [{
                        title: "Error",
                        description: client.customEmojis.cross + " Your auction must be at least 50 potatoes!",
                        color: client.colors.error
                    }]
                });
            }
            // Check if the item is tradable.
            if (!ItemDatabase.getItem(targetItem).itemData.tradeable) {
                return message.reply({
                    embeds: [{
                        title: "Error",
                        description: client.customEmojis.cross + " That item is not tradable!",
                        color: client.colors.error
                    }]
                });
            }
            // Remove the items from the user's inventory.
            user.inventory.remove(targetItem, targetCount);
            // Add the items to the auction house.
            client.database.auctions.addAuction({
                item: targetItem,
                count: targetCount,
                price: targetPotatoes,
                user: message.author.id,
                time: message.createdTimestamp,
                id: message.id
            });
            client.database.write();
            // Send the message.
            return message.reply({
                embeds: [{
                    title: "Success",
                    description: client.customEmojis.check + " You've put up **" + targetCount + " " + targetItem + "** for **" + targetPotatoes + "** " + client.customEmojis.potato + "!",
                }]
            });
        }
    }
};