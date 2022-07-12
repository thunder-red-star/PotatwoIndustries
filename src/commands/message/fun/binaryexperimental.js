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
        // Create a dummy interaction so we can show the user the modal.
        let button = new DJSBuilders.ButtonBuilder().setCustomId("dummyButton").setLabel("Dummy Button").setStyle("Primary");
        let buttonRow = new DJSBuilders.ActionRowBuilder().addComponents(button);

        let msg = await message.reply({
            content: "Please click this button to open the modal! (this is a Discord API limitation, otherwise the modal would be opened automatically)",
            components: [buttonRow]
        })

        let filter = (m) => {
            m.author.id === message.author.id;
        }

        // Create a message component event listener that listens for modal submission.
        let componentListener = msg.createMessageComponentCollector(filter, {
            filter,
            timeout: 60000
        });

        componentListener.on("collect", async (m) => {
            await msg.edit({
                content: "Please click this button to open the modal! (this is a Discord API limitation, otherwise the modal would be opened automatically)",
                components: [new DJSBuilders.ActionRowBuilder().addComponents(button.setDisabled(true))]
            });

            // Create a modal that will prompt the user to enter text.
            const modal = new DJSBuilders.ModalBuilder()
              .setTitle("Binary Input")
              .setCustomId("binary-input")
              .addComponents([
                  new DJSBuilders.ActionRowBuilder().addComponents(
                    new DJSBuilders.TextInputBuilder()
                      .setRequired(true)
                      .setMinLength(1)
                      .setMaxLength(4000)
                      .setStyle('Paragraph')
                      .setLabel("Text")
                      .setPlaceholder("Your text here")
                      .setCustomId("binary-input-text")
                  ),
              ])

            // Send the modal to the user.
            m.showModal(modal);
            console.log("Waiting for modal submit...");

            let filter = (m) => {
                m.customId === "binary-input";
            }

            // Create a message component event listener that listens for modal submission.
            try {
                let modalSubmit = await m.awaitModalSubmit({filter, time: 60000});
                console.log("Got modal submit!");

                // Get the text from the modal.
                let text = modalSubmit.fields.getTextInputValue("binary-input-text");
                let binary = binarify(text);
                if (binary.length > 8 * 1024 * 1024) {
                    return m.reply({ content: "The text is too long to convert to binary." });
                } else if (binary.length > 2000) {
                    let file = new Discord.Attachment(Buffer.from(binary), "binary.txt");
                    return modalSubmit.reply({
                        files: [file]
                    });
                }
                else {
                    return modalSubmit.reply({
                        content: binary
                    });
                }
            } catch (e) {
                return message.reply({
                    content: "You did not enter any text or you took too long. Please try again."
                });
            }
        });

        componentListener.on("end", async (collected, reason) => {
            // Disable the dummy button.
            await msg.edit({
                content: "Please click this button to open the modal! (this is a Discord API limitation, otherwise the modal would be opened automatically)",
                components: [new DJSBuilders.ActionRowBuilder().addComponents(button.setDisabled(true))]
            });
        });
    }
};
