// Bot ping command.
const messagePaginator = require("../../../utils/design/messagePaginator");
const fs = require("fs");
const ms = require("ms");
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
            name: "command",
            description: "The command to get help for.",
            type: "string",
            required: false
        }
    ],
    run: async function(message, client, args) {
        // If no query is provided, send a list of commands.
        let serverPrefix = client.getServerPrefix(message);
        if (!args.command) {
            // Scan directory of messageCommands for commands.
            let paginatorEmbeds = [];
            let modules = fs.readdirSync("./src/commands/message");
            for (let i = 0; i < modules.length; i++) {
                let upperCaseModule = modules[i].charAt(0).toUpperCase() + modules[i].slice(1);
                let commandsInModule = fs.readdirSync(`./src/commands/message/${modules[i]}`).filter(file => file.endsWith(".js"));
                let moduleEmbed = new DJSBuilders.Embed()
                    .setTitle(`${upperCaseModule} Commands`)
                    .setDescription("You can use `" + serverPrefix + "help <command>` to get more information about a command.");
                for (let j = 0; j < commandsInModule.length; j++) {
                    let command = require(`../../../commands/message/${modules[i]}/${commandsInModule[j]}`);
                    moduleEmbed.addField({
                        name: `\`${serverPrefix}${command.name}\``,
                        value: command.description,
                        inline: false
                    });
                }
                paginatorEmbeds.push(moduleEmbed);
            }
            await messagePaginator(message, paginatorEmbeds);
        } else {
            // Find the command.
            let command = client.messageCommands.find(command => command.name === args.query || command.messageCommandAliases.includes(args.query));
            if (!command) {
                return message.reply({
                    embeds: [{
                        color: client.colors.error,
                        description: client.customEmojis.error + " I couldn't find a command with that name."
                    }]
                });
            } else {
                // Send the command's help message.
                let cmdArgString = "";
                for (let i = 0; i < command.args.length; i++) {
                    if (i > 0) cmdArgString += " ";
                    if (command.args[i].required) {
                        cmdArgString += "<" + command.args[i].name + ">";
                    } else {
                        cmdArgString += "[" + command.args[i].name + "]";
                    }
                }
                let helpEmbed = new DJSBuilders.Embed()
                    .setTitle(`${serverPrefix}${command.name}`)
                    .setDescription(command.detailedDescription)
                    .setColor(client.colors.success)
                    .addField({
                        name: "Usage",
                        value: `\`${serverPrefix}${command.name} ${cmdArgString}\``,
                    })
                    .addField({
                        name: "Aliases",
                        value: command.aliases.length > 0 ? command.aliases.map(alias => `\`${serverPrefix}${alias}\``).join(", ") : "None",
                    })
                    .addField({
                        name: "Cooldown",
                        value: `${ms(command.cooldown)}`,
                    })
                    .addField({
                        name: "Permissions Required",
                        value: command.userPermissions.length > 0 ? command.userPermissions.map(perm => `\`${perm}\``).join(", ") : "None",
                    })
                    .addField({
                        name: "Bot Permissions Required",
                        value: command.botPermissions.length > 0 ? command.botPermissions.map(perm => `\`${perm}\``).join(", ") : "None",
                    })
                    .addField({
                        name: "Other command info",
                        value: `Enabled: ${command.enabled ? "Yes" : "No"}\nGuild Only: ${command.guildOnly ? "Yes" : "No"}\nOwner Only: ${command.ownerOnly ? "Yes" : "No"}`
                    });
                message.reply({
                    embeds: [helpEmbed]
                });
            }
        }
    }
}
