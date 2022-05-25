// Bot binary command.

const binarify = require("../../../utils/eval/binarify");
const Discord = require("discord.js");
const DJSBuilders = require("@discordjs/builders");

module.exports = {
    botPermissions: ["SEND_MESSAGES"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "binaryexperimental",
    aliases: ["be"],
    description: "Convert text to binary.",
    detailedDescription: "Convert text to binary.",
    cooldown: 1000,
    args: [],
    run: async function(message, client, args) {
        // Create a modal that will prompt the user to enter text.
        const modal = new DJSBuilders.ModalBuilder()
            .setTitle("Binary Input")
            .setCustomId("binary-input")
            .addComponents([
                new DJSBuilders.TextInputBuilder()
                    .setRequired(true)
                    .setMinLength(1)
                    .setMaxLength(4000)
                    .setLabel("Text")
                    .setPlaceholder("Your text here")
                    .setCustomId("binary-input-text")
            ])

        // Send the modal to the user.
        let msg = await message.reply({
            components: [modal]
        });

        let filter = (m) => {
            m.author.id === message.author.id;
        }

        // Create a message component event listener that listens for modal submission.
        let componentListener = message.createMessageComponentCollector(filter, {
            filter,
            timeout: 60000
        });

        componentListener.on("collect", async (m) => {
            // Get the text from the modal.
            let text = m.components.get("binary-input-text").value;
            let binary = binarify(text);
            if (binary.length > 8 * 1024 * 1024) {
                return message.reply({ content: "The text is too long to convert to binary." });
            } else if (binary.length > 2000) {
                let file = new Discord.Attachment(Buffer.from(binary), "binary.txt");
                return message.reply({
                    files: [file]
                });
            }
            else {
                return message.reply({
                    content: binary
                });
            }
        });

        componentListener.on("end", (collected, reason) => {
            if (reason === "timeout") {
                return message.reply({ content: "You took too long to respond." });
            }
        });
    }
};
