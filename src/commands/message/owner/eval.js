// Bot eval command.
const ms = require("ms");

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
    args: [
        {
            name: "code",
            description: "The code to evaluate.",
            type: "string",
            required: true
        }
    ],
    run: async function (message, client, args) {
        // Assume args are all parsed, and provided as an object with keys. Get the code key.
        let code = args.code;

        // Try to evaluate the code.
        let result;
        let status;
        let time1;
        let time2;

        try {
            time1 = Date.now();
            result = eval(code);
            time2 = Date.now();

            // If the result is a promise, wait for it to resolve.
            if (result instanceof Promise) {
                result = await result;
            }

            status = "success";
        } catch (error) {
            result = error;
            status = "error";
        }

        // If the result is a string, truncate it to 2000 characters.
        if (typeof result === "string") {
            result = result.substring(0, 2000);
        } else {
            // If the result is an object, convert it to a string.
            result = JSON.stringify(result, null, 4);
        }

        // Send the result.
        if (status === "error") {
            return message.channel.send({
                embeds: [{
                    title: "Error",
                    description: client.customEmojis.cross + " I encountered an error while evaluating your code.",
                    color: client.colors.error,
                    fields: [{
                        name: "Error",
                        value: "```" + result.replace(client.token, "*".repeat(client.token.length)) + "```"
                    }]
                }]
            });
        } else {
            if (time2 - time1 > 10000) {
                return message.channel.send({
                    embeds: [{
                        title: "Evaluation",
                        description: client.customEmojis.warning + " I successfully evaluated your code, but it took longer than 10 seconds to execute.",
                        color: client.colors.warning,
                        fields: [{
                            name: "Result",
                            value: "```" + result.replace(client.token, "*".repeat(client.token.length)) + "```"
                        },
                            {
                                name: "Evaluated in",
                                value: ms(time2 - time1, {long: true})
                            }]
                    }]
                });
            } else {
                return message.channel.send({
                    embeds: [{
                        title: "Evaluation",
                        description: client.customEmojis.check + " I successfully evaluated your code.",
                        color: client.colors.success,
                        fields: [{
                            name: "Result",
                            value: "```" + result.replace(client.token, "*".repeat(client.token.length)) + "```"
                        },
                        {
                            name: "Evaluated in",
                            value: ms(time2 - time1, {long: true})
                        }]
                    }]
                });
            }
        }
    }
}
