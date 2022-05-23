// Bot eval command.
const ms = require("ms");
const Discord = require("discord.js");
const mathEval = require("../../../utils/eval/mathEval");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "math",
    aliases: ["maf"],
    description: "Evaluates an equation.",
    detailedDescription: "Evaluates a math equation."
    cooldown: 2500,
    args: [{
        name: "equation", description: "The equation to evaluate.", type: "string", required: true
    }],
    run: async function (message, client, args) {
        // Get the equation.
        let equation = args.equation;

        // Try to evaluate the equation.
        let result;
        let status;

        try {
            result = mathEval(equation);
            status = "success";
            if (result === undefined) {
                status = "error";
            }
        } catch (error) {
            result = error;
            status = "error";
        }

        // Send the result.
        if (status === "error") {
            return message.channel.send({
                embeds: [{
                    color: client.colors.error,
                    title: "Error",
                    description: `${client.customEmojis.cross} That doesn't seem to be a valid equation.`
                }]
            });
        } else {
            return message.channel.send({
                embeds: [{
                    color: client.colors.success,
                    title: "Result",
                    description: `${client.customEmojis.check} Here's the result!`,
                    fields: [{
                        name: "Equation",
                        value: equation,
                    },
                    {
                        name: "Result",
                        value: result,
                    }]
                }]
            });
        }
}
