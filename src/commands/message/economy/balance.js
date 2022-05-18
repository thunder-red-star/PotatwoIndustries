// Bot say command.

module.exports = {
  botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
  userPermissions: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  name: "balance",
  aliases: ["bal"],
  description: "Sends your current account balance",
  detailedDescription: "Sends your current account balance in number of potatoes.",
  cooldown: 0,
  args: [
    {
      name: "target",
      description: "Optionally, the user to check the balance of.",
      type: "user",
      required: false
    }
  ],
  run: async function(message, client, args) {
    // Check if the user already has an account.
    let target = args.target || message.author;
    let targetAccount = await client.database.users.get(target.id);
    if (!targetAccount) {
      return message.reply({
        embed: {
          title: "Error",
          description: client.customEmojis.cross + (target.id === message.author.id ? " You don't have an account yet!" : ` ${target.username} doesn't have an account yet!`),
          color: client.colors.error
        }
      });
    } else {
      // Send the balance.
      return message.reply({
        embed: {
          title: target.id === message.author.id ? "Your balance" : `${target.username}'s balance`,
          description: `${client.customEmojis.potato} **${targetAccount.count}** potatoes`,
          color: client.colors.potato
        }
      });
    }
  }
};