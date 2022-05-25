// Bot binary command.

const binarify = require("../../../utils/eval/binarify");
const Discord = require("discord.js");

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

    }
};
