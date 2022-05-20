// Bot ping command.

const DJSBuilders = require("@discordjs/builders");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "invite",
    aliases: [],
    description: "Sends the bot's invite link.",
    detailedDescription: "Sends the bot's invite link.",
    cooldown: 1000,
    args: [],
    run: async function(message, client, args) {
        // Create an invite embed.
        const inviteEmbed = new DJSBuilders.Embed()
            .setTitle("Click here invite")
            .setDescription("Pls?")
            .setColor(client.colors.success);
        const inviteButton = new DJSBuilders.ButtonComponent()
            .setLabel("Invite")
            .setURL(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=8`)
            .setStyle(5);
        const inviteButtonRow = new DJSBuilders.ActionRow()
            .addComponents(inviteButton);

        return message.reply({
            embeds: [inviteEmbed],
            components: [inviteButtonRow]
        });
    }
}
