// Bot say command.

const messagePaginator = require("../../../utils/design/messagePaginator");
const DJSBuilders = require("@discordjs/builders");

let randomArrayElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

module.exports = {
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  userPermissions: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  name: "inventory",
  aliases: ["inv", "shed"],
  description: "View someone's inventory.",
  detailedDescription: "Lets you view someone's inventory.",
  cooldown: 1000,
  args: [
    {
      name: "target",
      description: "The user you want to view the inventory of.",
      type: "user",
      required: false
    }
  ],
  run: async function(message, client, args) {
    let target = (args.target !== null && args.target !== undefined) ? args.target : message.author;

    if (target.id === message.author.id) {
      // Check if the user already has an account.
      let user = client.database.users.get(message.author.id);
      if (!user) {
        return message.reply({
          embeds: [{
            color: client.colors.warning,
            description: client.customEmojis.warning + " You haven't started an account yet. Use `" + client.config.defaultPrefix + "start` to start one."
          }]
        });
      } else {
        // Get the user's inventory.
        let inventory = client.database.users.get(target.id).inventory;
        if (!inventory) {
          return message.reply({
            embeds: [{
              color: client.colors.warning,
              description: client.customEmojis.warning + " Your inventory is empty."
            }]
          });
        } else {
          // Get the user's inventory.
          let inventory = client.database.users.get(target.id).inventory.getAll();
          let totalItems = 0;
          for (let item in inventory) {
            totalItems += inventory[item].count;
          }
          if (inventory.length > 10) {
            let inventoryPages = [];
            for (let i = 0; i < inventory.length; i += 10) {
              let inventoryPage = new DJSBuilders.Embed()
                .setColor(client.colors.default)
                .setTitle(`${target.username}'s Inventory`)
                .setDescription(`${target.username}'s inventory contains ${totalItems} items.`);
              for (let j = 0; j < 10; j++) {
                if (inventory[i + j]) {
                  inventoryPage.addField({
                    name: `${inventory[i + j].item.name} x${inventory[i + j].count}`,
                    value: inventory[i + j].item.description
                  });
                }
              }
              inventoryPages.push(inventoryPage);
            }
            await messagePaginator(message, inventoryPages);
          }
          else {
            let inventoryPage = new DJSBuilders.Embed()
              .setColor(client.colors.potato)
              .setTitle(`${target.username}'s Inventory`)
              .setDescription(`${target.username}'s inventory contains ${totalItems} items.`);
            for (let x = 0; x < inventory.length; x++) {
              console.log(inventory[x]);
              inventoryPage.addField({
                name: `${inventory[x].item.name} x${inventory[x].count}`,
                value: inventory[x].item.description
              });
            }
            message.channel.send({ embeds: [inventoryPage] });
          }
        }
      }
    } else {
      // Check if the target has an account.
      let targetUser = client.database.users.get(target.id);
      if (!targetUser) {
        return message.reply({
          embeds: [{
            color: client.colors.warning,
            description: client.customEmojis.warning + " That user hasn't started an account yet. Use `" + client.config.defaultPrefix + "start` to start one."
          }]
        });
      } else {
        // Get the target's inventory.
        let inventory = client.database.users.get(target.id).inventory;
        if (!inventory) {
          return message.reply({
            embeds: [{
              color: client.colors.warning,
              description: client.customEmojis.warning + " That user's inventory is empty"
            }]
          });
        } else {
          // Get the target's inventory.
          let inventory = client.database.users.get(target.id).inventory.getAll();
          let totalItems = 0;
          for (let item in inventory) {
            totalItems += inventory[item].count;
          }
          if (inventory.length > 10) {
            // Create the inventory pages.
            let inventoryPages = [];
            for (let i = 0; i < inventory.length; i += 10) {
              // Create the inventory page.
              let inventoryPage = new DJSBuilders.Embed()
                .setColor(client.colors.potato)
                .setTitle(`${target.username}'s Inventory`)
                .setDescription(`${target.username}'s inventory contains ${totalItems} items.`);
              for (let j = 0; j < 10; j++) {
                if (inventory[i + j]) {
                  inventoryPage.addField({
                    name: `${inventory[i + j].item.itemData.name} x${inventory[i + j].count}`,
                    value: inventory[i + j].item.itemData.description
                  });
                }
              }
              inventoryPages.push(inventoryPage);
            }
            await messagePaginator(message, inventoryPages);
          }
          else {
            // Create the inventory page.
            let inventoryPage = new DJSBuilders.Embed()
              .setColor(client.colors.potato)
              .setTitle(`${target.username}'s Inventory`)
              .setDescription(`${target.username}'s inventory contains ${totalItems} items.`);
            for (let x = 0; x < inventory.length; x++) {
              inventoryPage.addField({
                name: `${inventory[x].item.name} x${inventory[x].count}`,
                value: inventory[x].item.description
              });
            }
            message.channel.send({ embeds: [inventoryPage] });
          }
        }
      }
    }
  }
};