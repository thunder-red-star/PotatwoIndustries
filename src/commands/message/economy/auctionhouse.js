const messagePaginator = require('../../../utils/design/messagePaginator');
const DJSBuilders = require('@discordjs/builders');

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "auctionhouse",
    aliases: ["ah"],
    description: "List items for sale.",
    detailedDescription: "List items for sale in the auction house.",
    cooldown: 10000,
    args: [],
    run: async function(message, client, args) {
        // List the auction house.
        let auctions = client.database.auctions.getAuctions();
        let auctionPages = [];
        // Put 10 auctions per page.
        for (let i = 0; i < auctions.length; i += 10) {
            let page = new DJSBuilders.Embed()
                .setColor(client.colors.potato)
                .setTitle("Auction House - Page " + Math.floor(i / 10) + 1)
                .setDescription("Get an item with " + client.getServerPrefix(message) + "ahbuy <id>!");
            for (let j = i; j < i + 10; j++) {
                if (j >= auctions.length) break;
                let auction = auctions[j];
                page.addField({
                    name: "`" + auction.id + "`",
                    value: "**" + auction.price + "** " + client.customEmojis.potato + " for **" + auction.count + "x " + auction.item.name + "**",
                });
            }
            auctionPages.push(page);
        }
        await messagePaginator(message, auctionPages);
    }
};