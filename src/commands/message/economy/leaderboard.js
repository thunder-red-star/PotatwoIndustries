// Bot say command.
const messagePaginator = require("../../../utils/design/messagePaginator");
const DJSBuilders = require("@discordjs/builders");
let randomArrayElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

module.exports = {
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
    userPermissions: [],
    enabled: true,
    guildOnly: false,
    ownerOnly: false,
    name: "leaderboard",
    aliases: ["lb"],
    description: "Get the leaderboard.",
    detailedDescription: "Get and display the people with the most potatoes.",
    cooldown: 2000,
    args: [],
    run: async function(message, client, args) {
        // Retrieve the users
        let users = await client.database.users.getUsers();
        // Sort the users by their balance
        users.sort((a, b) => {
            return b.count - a.count;
        });

        // Create the leaderboard
        let leaderboardPaginatorPages = [];
        // Parse up to 100 users, 10 per page.
        for (let i = 0; i < Math.ceil(users.length / 10); i++) {
            let leaderboardPage = new DJSBuilders.EmbedBuilder()
                .setColor(client.colors.potato)
                .setTitle("Leaderboard");
            let description = "";
            // Add up to 10 users to the page, but if there are less than 10 users, add all of them.
            for (let j = 0; j < Math.min(10, users.length - i * 10); j++) {
                let user = users[i * 10 + j];
                description += `**${j + 1}**. ${client.users.cache.get(user.id).tag} - ${user.count} ${client.customEmojis.potato}\n`;
            }
            leaderboardPage.setDescription(description);
            leaderboardPaginatorPages.push(leaderboardPage);
        }
        // Send the leaderboard
        await messagePaginator(message, leaderboardPaginatorPages);
    }
};