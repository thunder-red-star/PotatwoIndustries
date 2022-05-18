// Bot say command.

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "start",
    aliases: ["begin", "go"],
    description: "Start your potato journey.",
    detailedDescription: "Creates an economy account for you in this bot. With this you can start to earn and spend your potatoes.",
    cooldown: 0,
    args: [],
    run: async function(message, client, args) {
        // Check if the user already has an account.
        let user = await client.database.users.get(message.author.id);
        if (user) {
            return message.reply({
                embed: {
                    color: client.config.options.embedColour,
                    description: "You've already started!"
                }
            });
        } else {
            // Create the user.
            await client.database.users.addUser(message.author.id);
            let user = await client.database.users.get(message.author.id);
            // Give the user some potatoes.
            await user.addPotatoes(500);
            return message.reply({
                embed: {
                    color: client.config.options.embedColour,
                    description: "You now have an economy account! I've given you **500** " + client.customElements.potato + " as a starting gift."
                }
            });
        }
    }
};