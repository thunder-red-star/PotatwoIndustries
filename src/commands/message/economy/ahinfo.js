const ItemDatabase = require("../../../structures/ItemDatabase");
const ms = require("ms");

module.exports = {
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  userPermissions: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  name: "ahinfo",
  aliases: ["ahi"],
  description: "Extra auctionhouse info.",
  detailedDescription: "Learn more about a specific auction by its ID.",
  cooldown: 2500,
  args: [
    {
      name: "id",
      description: "The ID of the auction you want to learn more about.",
      type: "string",
      required: true
    }
  ],
  run: async function(message, client, args) {
    // Get the auction.
    let auction = client.database.auctions.getAuction(args.id);

    // Check if the auction exists.
    if (!auction || auction === null) {
      return message.reply({
        embeds: [{
          title: "Error",
          description: client.customEmojis.cross + " That auction doesn't exist!",
          color: client.colors.error
        }]
      });
    } else {
      // Create the embed.
      let sellerTag = await client.users.fetch(auction.user);
      let embed = new DJSBuilders.Embed()
        .setColor(client.colors.potato)
        .setTitle("Auction House Info - `" + auction.id + "`")
        .setDescription("Get an item with `" + client.getServerPrefix(message) + "ahbuy " + auction.id + "`!")
        .addField({
          name: "Item",
          value: auction.item.name,
          inline: true
        })
        .addField({
          name: "Count",
          value: auction.count,
          inline: true
        })
        .addField({
          name: "Price",
          value: auction.price + " " + client.customEmojis.potato,
          inline: true
        })
        .addField({
          name: "Time until expiration",
          value: ms((auction.time + 1000 * 60 * 60 * 24) - Date.now(), { long: true }),
          inline: true
        })
        .addField({
          name: "Seller",
          value: sellerTag,
          inline: true
        })
        .setFooter("Auction House");
        // Send the embed.
      message.reply({
        embeds: [embed]
      });
    }
  }
};