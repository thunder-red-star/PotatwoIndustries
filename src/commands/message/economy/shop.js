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
    console.log(shopItems);
    let shopPages = [];
    for (let i = 0; i < Object.keys(shopItems).length; i++) {
      let shopCategory = Object.keys(shopItems)[i];
      if (shopItems[shopCategory].length > 10) {
        for (let j = 0; j < shopItems[shopCategory].length; j += 10) {
          let shopPage = new DJSBuilders.Embed()
            .setColor(client.colors.potato)
            .setTitle(shopCategory + " Shop, Page " + Math.floor(j / 10 + 1))
            .setDescription("Use `" + client.getServerPrefix(message) + "buy <item>` to buy an item");
          for (let k = j; k < j + 10; k++) {
            if (shopItems[shopCategory][k]) {
              shopPage.addField({
                name: shopItems[shopCategory][k].name,
                value: `${shopItems[shopCategory][k].cost} ${client.customEmojis.potato}`,
              });
            }
          }
          shopPages.push(shopPage);
        }
      } else {
        let shopPage = new DJSBuilders.Embed()
          .setColor(client.colors.potato)
          .setTitle(shopCategory + " Shop")
          .setDescription("Use `" + client.getServerPrefix(message) + "buy <item>` to buy an item");
        for (let j = 0; j < shopItems[shopCategory].length; j++) {
          shopPage.addField({
            name: shopItems[shopCategory][j].name,
            value: `${shopItems[shopCategory][j].cost} ${client.customEmojis.potato}`,
          });
        }
        shopPages.push(shopPage);
      }
    }
    await messagePaginator(message, shopPages);
  }
};