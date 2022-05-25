const ItemDatabase = require("../../../structures/ItemDatabase");

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
  cooldown: 10000,
  args: [
    {
      name: "id",
      description: "The ID of the auction you want to learn more about.",
      type: "string",
      required: true
  ],
  run: async function(message, client, args) {
    // Get the auction.
    let auction = client.database.auctions.getAuction(args.id);


  }
};