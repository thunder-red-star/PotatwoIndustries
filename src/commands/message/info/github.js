// Bot ping command.

const DJSBuilders = require("@discordjs/builders");

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "github",
    aliases: [],
    description: "Sends the GitHub repo url.",
    detailedDescription: "Sends the GitHub repo url.",
    cooldown: 1000,
    args: [],
    run: async function(message, client, args) {
        const repoEmbed = new DJSBuilders.EmbedBuilder()
            .setTitle("GitHub for " + client.user.username)
            .setDescription("We use GitHub to host our codebase, track issues and feature requests, and accept pull requests.")
            .setColor(client.colors.success)

        const ytButton = new DJSBuilders.ButtonBuilder()
            .setLabel("GitHub")
            .setType(5)
            .setURL(`https://github.com/thunder-red-star/PotatwoIndustries`)

        const buttonRow = new DJSBuilders.ActionRowBuilder()
            .addComponents(ytButton);

        return message.reply({
            embeds: [repoEmbed],
            components: [buttonRow]
        });
    }
}
