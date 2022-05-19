// Bot say command.

let randomArrayElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

module.exports = {
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  userPermissions: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  name: "farm",
  aliases: [],
  description: "Beg for potatoes",
  detailedDescription: "You can beg for potatoes with this command. You can get a lot of potatoes from famous people here.",
  cooldown: 120000,
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
      // Beg for potatoes.
      let numBeggedPotatoes = Math.floor(Math.random() * 500) + 1000;
      // Add the potatoes to the user's account.
      user.addPotatoes(numBeggedPotatoes);
      client.database.write();
      // Send the message.
      return message.reply({
        embeds: [{
          color: client.colors.potato,
          description: randomArrayElement(client.messages.begPotatoes)
            .replace("{amount}", numBeggedPotatoes)
            .replace("{potato}", client.customEmojis.potato)
            .replace("{person}", randomArrayElement(client.messages.people))
            .replace("{amount2}", numBeggedPotatoes * 5)
        }]
      });
    }
  }
};