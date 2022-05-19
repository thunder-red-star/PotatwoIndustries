// Bot ping command.
const messagePaginator = require("../../../utils/design/messagePaginator");
const fs = require("fs");
const DJSBuilders = require("@discordjs/builders");

module.exports = {
    botPermissions: ["SEND_MESSAGES"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "help",
    aliases: ["halp", "h"],
    description: "Get assistance with bot commands",
    detailedDescription: "Sends a message containing bot commands and their descriptions.",
    cooldown: 1000,
    args: [
        {
            name: "query",
            description: "The command or category to get help for.",
            type: "string",
            required: false
        }
    ],
    run: async function(message, client, args) {
        // If no query is provided, send a list of commands.
        if (!args.query) {
            // Scan directory of messageCommands for commands.
            let paginatorEmbeds = [];
            let modules = fs.readdirSync("./src/commands/message");
            for (let i = 0; i < modules.length; i++) {
                let upperCaseModule = modules[i].charAt(0).toUpperCase() + modules[i].slice(1);
                let commandsInModule = fs.readdirSync(`./src/commands/message/${modules[i]}`);
                let moduleEmbed = new DJSBuilders.Embed()
                    .setTitle(`${upperCaseModule} Commands`)
                    .setDescription("");
                for (let j = 0; j < commandsInModule.length; j++) {
                    let command = require(`../../../commands/message/${modules[i]}/${commandsInModule[j]}`);
                    moduleEmbed.addField(`${client.config.default}${command.name}`, command.description);
                }
                paginatorEmbeds.push(moduleEmbed);
            }
            messagePaginator(message, paginatorEmbeds);
        }t
    }
}
