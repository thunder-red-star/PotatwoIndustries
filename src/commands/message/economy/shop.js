// Bot shop command.

const ItemDatabase = require("../../../structures/ItemDatabase")
const DJSBuilders = require("@discordjs/builders")
const messagePaginator = require("../../../utils/design/messagePaginator");


module.exports = {
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  userPermissions: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  name: "shop",
  aliases: ["market", "store"],
  description: "View the shop.",
  detailedDescription: "View the shop, where you can buy items.",
  cooldown: 0,
  args: [],
  run: async function(message, client, args) {
    let shopItems = ItemDatabase.getShopItems();
    let shopPages = [];
    for (let i = 0; i < Object.keys(shopItems).length; i++) {
      let shopCategory = Object.keys(shopItems)[i];
      let shopCategoryItems = shopItems[shopCategory];
      if (shopCategoryItems.length > 10) {
        for (let j = 0; j < shopCategoryItems; j += 10) {
          let shopPage = new DJSBuilders.Embed()
            .setColor(client.colors.potato)
            .setTitle(shopCategory + " Shop, Page " + Math.floor(j / 10 + 1))
            .setDescription("Use `" + client.getServerPrefix(message) + "buy <item>` to buy an item");
          for (let k = j; k < j + 10; k++) {
            let shopItem = shopCategoryItems[Object.keys(shopCategoryItems)[k]];
            shopPage.addField({
              name: shopItem.name,
              value: `${shopItem.cost} ${client.customEmojis.potato}`,
            });
          }
          shopPages.push(shopPage);
        }
      } else {
        console.log(shopCategoryItems);
        let shopPage = new DJSBuilders.Embed()
          .setColor(client.colors.potato)
          .setTitle(shopCategory + " Shop")
          .setDescription("Use `" + client.getServerPrefix(message) + "buy <item>` to buy an item");
        for (let j = 0; j < Object.keys(shopCategoryItems).length; j++) {
            let shopItem = shopCategoryItems[Object.keys(shopCategoryItems)[j]];
          shopPage.addField({
            name: shopItem.name,
            value: `${shopItem.cost} ${client.customEmojis.potato}`,
          });
        }
        shopPages.push(shopPage);
      }
    }
    await messagePaginator(message, shopPages);
  }
};