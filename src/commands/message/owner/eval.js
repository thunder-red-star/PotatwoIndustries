// Bot eval command.
const ms = require("ms");
const Discord = require("discord.js");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: true,
    name: "eval",
    aliases: ["hackerman"],
    description: "Evaluates code.",
    detailedDescription: "Evaluates code. Only the bot owner can use this command.",
    cooldown: 2500,
    args: [{
        name: "code", description: "The code to evaluate.", type: "string", required: true
    }],
    run: async function (message, client, args) {
        // Assume args are all parsed, and provided as an object with keys. Get the code key.
        let code = args.code;

        // Try to evaluate the code.
        let result;
        let status;
        let time1;
        let time2;

        time1 = Date.now();

        try {
            result = eval(code);

            // If the result is a promise, wait for it to resolve.
            if (result instanceof Promise) {
                result = await result;
            }

            status = "success";
        } catch (error) {
            result = error;
            status = "error";
        }

        time2 = Date.now();

        console.log(`${message.author.tag} ran code and got ${result} in ${ms(time2 - time1)}`);

        // If the result is a string, truncate it to 1000 characters, and count the number of characters left.

        let charCountLeft = 0;
        if (typeof result === "string") {
            result = result.substring(0, 1000);
            charCountLeft = result.length - 1000;
        }

        // Send the result.
        if (status === "error") {
            return message.channel.send({
                embeds: [{
                    title: "Error",
                    description: client.customEmojis.cross + " I encountered an error while evaluating your code.",
                    color: client.colors.error,
                    fields: [{
                        name: "Error", value: "```" + result.toString() + "```"
                    }, {
                        name: "Evaluated in", value: ms(time2 - time1, {long: true})
                    }]
                }]
            });
        } else {
            if (charCountLeft > 0) {
                let evalAttachment = new Discord.Attachment(result, "eval.txt").setDescription(`${result}\n\n**${charCountLeft}** more characters.`);
            }
            let messagePayload = {
                embeds: [{
                    title: "Evaluation",
                    description: client.customEmojis.warning + " I successfully evaluated your code" + (time2 - time1 > 10000 ? " but it took longer than 10 seconds." : "."),
                    color: client.colors.warning,
                    fields: [{
                        name: "Result",
                        value: "```" + (result !== undefined ? result.toString().replace(client.token, "*".repeat(client.token.length)) : "No output") + (charCountLeft > 0 ? " ... " + charCountLeft + " characters left" : "") + "```"
                    }, {
                        name: "Evaluated in", value: ms(time2 - time1, {long: true})
                    }]
                }]
            }
            if (charCountLeft > 0) {
                messagePayload.files = [evalAttachment];
            }
            return message.channel.send(messagePayload);
        }
    }
}
