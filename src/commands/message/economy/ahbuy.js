const ItemDatabase = require("../../../structures/ItemDatabase");

module.exports = {
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  userPermissions: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  name: "ahbuy",
  aliases: ["ahb"],
  description: "Buy an item from the auction house.",
  detailedDescription: "Buy an item from the auction house.",
  cooldown: 10000,
  args: [
    {
      name: "id",
      description: "The id of the item you want to buy.",
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
            description: client.customEmojis.cross + " The item you want to buy doesn't exist!",
            color: client.colors.error
          }]
        });
      }

      // Check if the user is trying to buy his own item.
      if (auction.user === message.author.id) {
        return message.reply({
          embeds: [{
            title: "Error",
            description: client.customEmojis.cross + " You can't buy your own item!",
            color: client.colors.error
          }]
        });
      }

      // Check if the user has enough potatoes.
      if (user.getPotatoes() < auction.price) {
        return message.reply({
          embeds: [{
            title: "Error",
            description: client.customEmojis.cross + " You don't have enough potatoes to buy this item!",
            color: client.colors.error
          }]
        });
      }

      // Check if the item has expired.
      if (Date.now() - auction.time > 1000 * 24 * 60 * 60) {
        return message.reply({
          embeds: [{
            title: "Error",
            description: client.customEmojis.cross + " The item you want to buy has expired!",
            color: client.colors.error
          }]
        });
      }

      // Buy the item.
      user.inventory.add(auction.item, auction.count);

      // Remove the potatoes.
      user.setPotatoes(user.getPotatoes() - auction.price);

       // Credit the seller.
      let seller = client.database.users.get(auction.user);
      seller.addPotatoes(auction.price);

      // Remove the auction.
      client.database.auctions.removeAuction(auction.id);

      // DM the seller.
      let sellerAcc = await client.users.fetch(auction.user);
      sellerAcc.send({
        embeds: [{
          title: "Successful purchase!",
          description: `${message.author.tag} has bought ${auction.count} ${auction.item.name}(s) for ${auction.price} potatoes from you!`,
          color: client.colors.potato
        }]
      });

      // Send the message.
      return message.reply({
        embeds: [{
          title: "Success",
          description: client.customEmojis.check + " You have bought **" + auction.count + "x " + auction.item.name + "** for **" + auction.price + "** " + client.customEmojis.potato + "!",
        }]
      });
    }
  }
};