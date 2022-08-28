// Bot binary command.

const binarify = require("../../../utils/eval/binarify");
const Discord = require("discord.js");

module.exports = {
  botPermissions: ["SEND_MESSAGES"],
  userPermissions: [],
  enabled: true,
  guildOnly: false,
  ownerOnly: false,
  name: "binary",
  aliases: ["binarify", "1010"],
  description: "Convert text to binary.",
  detailedDescription: "Convert text to binary.",
  cooldown: 1000,
  args: [
    {
      name: "text",
      description: "The text to convert to binary.",
      type: "string",
      required: true
    }
  ],
  run: async function(message, client, args) {
    let text = args.text;
    let binary = binarify(text);
    if (binary.length > 2000) {
      if (binary.length > 8 * 1024 * 1024) {
        return message.reply({ content: "The text is too long to convert to binary." });
      } else {
        let file = new Discord.AttachmentBuilder(Buffer.from(binary), 'binary.txt', {
          name: "binary.txt",
          description: "The input converted to binary."
        });
        return message.reply({
          files: [file],
        });
      }
    } else {
      return message.reply({
        content: binary
      });
    }
  }
};
