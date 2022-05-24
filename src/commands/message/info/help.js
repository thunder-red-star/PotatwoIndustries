// Bot ping command.
const messagePaginator = require("../../../utils/design/messagePaginator");
const fs = require("fs");
const ms = require("ms");
const DJSBuilders = require("@discordjs/builders");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
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
                // If there are more than 25 commands in a module, split them into multiple pages.
                if (commandsInModule.length > 10) {
                    for (let j = 0; j < commandsInModule.length; j += 10) {
                        let moduleEmbed = new DJSBuilders.Embed()
                            .setTitle(`${upperCaseModule} Commands, Page ${Math.floor(j / 10) + 1}`)
                            .setDescription("You can use `" + serverPrefix + "help <command>` to get more information about a command.")
                            .setColor(client.colors.success);
                        if (commandsInModule.length > 0) {
                            for (let k = j; k < j + 10; k++) {
                                let command = require(`../../../commands/message/${modules[i]}/${commandsInModule[j]}`);
                                moduleEmbed.addField({
                                    name: `\`${serverPrefix}${command.name}\``,
                                    value: command.description,
                                    inline: false
                                });
                            }
                        } else {
                            moduleEmbed.setDescription("No commands (yet).");
                        }
                        paginatorEmbeds.push(moduleEmbed);
                    }
                } else {
                    let moduleEmbed = new DJSBuilders.Embed()
                        .setTitle(`${upperCaseModule} Commands`)
                        .setDescription("You can use `" + serverPrefix + "help <command>` to get more information about a command.")
                        .setColor(client.colors.success);
                    if (commandsInModule.length > 0) {
                        for (let j = 0; j < commandsInModule.length; j++) {
                            let command = require(`../../../commands/message/${modules[i]}/${commandsInModule[j]}`);
                            moduleEmbed.addField({
                                name: `\`${serverPrefix}${command.name}\``,
                                value: command.description,
                                inline: false
                            });
                        }
                    } else {
                        moduleEmbed.setDescription("No commands (yet).");
                    }
                    paginatorEmbeds.push(moduleEmbed);
                }
            }
            await messagePaginator(message, paginatorEmbeds);
        } else {
            // Find the command.
            let command = client.messageCommands.get(args.command.toLowerCase());
            if (!command) {
                command = client.messageCommands.get(client.messageCommandAliases.get(args.command.toLowerCase()));
            }
            if (!command) {
                return message.reply({
                    embeds: [{
                        color: client.colors.error,
                        description: client.customEmojis.cross + " I couldn't find a command with that name."
                    }]
                });
            } else {
                // Send the command's help message.
                let cmdArgString = "";
                if (command.args.length > 0) {
                    cmdArgString += " ";
                }
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
                        value: `\`${serverPrefix}${command.name}${cmdArgString}\``,
                    })
                    .addField({
                        name: "Aliases",
                        value: command.aliases.length > 0 ? command.aliases.map(alias => `\`${serverPrefix}${alias}\``).join(", ") : "None",
                    })
                    .addField({
                        name: "Cooldown",
                        value: `${ms(command.cooldown, { long: true })}`,
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
