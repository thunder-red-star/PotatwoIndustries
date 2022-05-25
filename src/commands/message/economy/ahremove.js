const ItemDatabase = require("../../../structures/ItemDatabase");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "ahremove",
    aliases: ["ahr"],
    description: "Take back an item from the auction house.",
    detailedDescription: "Take back an item from the auction house.",
    cooldown: 10000,
    args: [
        {
            name: "id",
            description: "The id of the item you want to remove.",
            type: "number",
            required: true
        }
    ],
    run: async function(message, client, args) {
        // Check if the user already has an account.
        let user = await client.database.users.get(message.author.id);
        let targetId = args.id;
        if (!user) {
            return message.reply({
                embeds: [{
                    title: "Error",
                    description: client.customEmojis.cross + " You don't have an account yet!",
                    color: client.colors.error
                }]
            });
        } else {
            // Find the auction house item.
            let auction = await client.database.auctions.getAuction(targetId);

            // Check if the item exists.
            if (!auction) {
                return message.reply({
                    embeds: [{
                        title: "Error",
                        description: client.customEmojis.cross + " The item you want to remove doesn't exist!",
                        color: client.colors.error
                    }]
                });
            }

            // Check if the user is trying to remove someone else's item.
            if (auction.user !== message.author.id) {
                return message.reply({
                    embeds: [{
                        title: "Error",
                        description: client.customEmojis.cross + " You can't remove someone else's item!",
                        color: client.colors.error
                    }]
                });
            }

            // Remove the item from the auction house.
            await client.database.auctions.removeAuction(targetId);

            // Add the item to the user's inventory.
            let user = await client.database.users.get(message.author.id);
            user.inventory.add(auction.item.name, auction.count);

            // Send a message to the user.
            return message.reply({
                embeds: [{
                    title: "Success",
                    description: client.customEmojis.check + " You have successfully removed the item from the auction house!",
                    color: client.colors.success
                }]
            });
        }
    }
};