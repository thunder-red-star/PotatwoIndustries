const DJSBuilders = require("@discordjs/builders");
const fs = require("fs");

module.exports = {
	botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
	userPermissions: [],
	enabled: true,
	guildOnly: false,
	ownerOnly: true,
	name: "blacklist",
	aliases: [],
	description: "Blacklist a user.",
	detailedDescription: "Prevents a user from using the bot.",
	cooldown: 0,
	args: [
		{
			name: "user",
			description: "The user to blacklist.",
			type: "user",
			required: true
		}
	],
	run: async function(message, client, args) {
		// Attempt to obtain the user.
		const user = args.user;
		if (!user) {
			return message.reply({
				embeds: [{
					color: client.colors.error,
					description: client.customEmojis.cross + "I couldn't find that user."
				}]
			});
		}
		// Fetch user from database.
		let dbUser = client.database.users.get(user.id);
		if (!dbUser) {
			message.reply({
				embeds: [{
					color: client.colors.warning,
					description: client.customEmojis.warning + "The user doesn't have an account. I'm creating one for them."
				}]
			});
			// Create the user.
			await client.database.users.addUser(user.id);
			dbUser = await client.database.users.get(user.id);
		}
		// Check if the user is already blacklisted.
		if (dbUser.blacklisted) {
			return message.reply({
				embeds: [{
					color: client.colors.warning,
					description: client.customEmojis.warning + "That user is already blacklisted."
				}]
			});
		};
		// Blacklist the user.
		dbUser.setBlacklisted(true);
		client.database.write();
		return message.reply({
			embeds: [{
				color: client.colors.success,
				description: client.customEmojis.check + " " + user.username + " has been blacklisted."
			}]
		});
	}
};