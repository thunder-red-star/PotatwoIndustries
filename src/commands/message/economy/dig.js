// Bot dig command.

const ItemDatabase = require("../../../structures/ItemDatabase");
let randomArrayElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

let digPossible = [
  {
    "name": "Test Item",
    "threshold": 0.00,
  }
];

module.exports = {
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  userPermissions: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  name: "dig",
  aliases: ["d"],
  description: "Dig for potatoes.",
  detailedDescription: "Dig for potatoes in the ground, which are added to your inventory.",
  cooldown: 10000,
  args: [],
  run: async function(message, client, args) {
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
      // Dig for potatoes.
      let randomThreshold = Math.random();
      // Create the threshold array, based off the digPossible array.
      let thresholdArray = [];
      for (let i = 0; i < digPossible.length; i++) {
        thresholdArray.push(digPossible[i].threshold);
      }
      // Find the index of the threshold that the random number is in between.
      let thresholdIdx;
      for (let i = 1; i < thresholdArray.length + 1; i++) {
        console.log(thresholdArray[i - 1], thresholdArray[i]);
        if (randomThreshold <= (thresholdArray[i] || 1) && randomThreshold > (thresholdArray[i - 1] || 0)) {
          thresholdIdx = i;
        }
      }
      // Get the item that the random number is in between.
      console.log(thresholdIdx);
      let item = digPossible[thresholdIdx - 1];
      // Add the item to the user's inventory.
      user.inventory.add(item.name, 1);
      // Send the user a message.
      message.reply({
        embeds: [{
          color: client.colors.potato,
          description: "You managed to dig up a **" + item.name + "** worth **" + ItemDatabase.getItem(item.name).itemData.worth + "** " + client.customEmojis.potato + "."
        }]
      });
    }
  }
};