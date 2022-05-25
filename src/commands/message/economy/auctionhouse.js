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
        if (auctions.length < 1) {
            return message.reply({
                embeds: [{
                    title: "Auction House",
                    description: "There are no auctions right now.",
                    color: client.colors.potato
                }]
            });
        } else {
            let auctionPages = [];
            // Put 10 auctions per page.
            for (let i = 0; i < auctions.length; i += 10) {
                let page = new DJSBuilders.Embed()
                    .setColor(client.colors.potato)
                    .setTitle("Auction House - Page " + Math.floor(i / 10) + 1)
                    .setDescription("Get an item with `" + client.getServerPrefix(message) + "ahbuy <id>`!\nLearn more about an auction with `" + client.getServerPrefix(message) + "ahinfo <id>`!");
                for (let j = i; j < i + 10; j++) {
                    if (j >= auctions.length) break;
                    if (Date.now() - auction.time > 1000 * 24 * 60 * 60) {
                        continue;
                    } else {
                        let auction = auctions[j];
                        page.addField({
                            name: "**" + auction.count + "x " + auction.item.name + "**",
                            value: "Id: `" + auction.id + "`",
                        });
                    }
                }
                auctionPages.push(page);
            }
            await messagePaginator(message, auctionPages);
        }
    }
};