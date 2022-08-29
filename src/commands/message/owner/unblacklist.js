const DJSBuilders = require("@discordjs/builders");
const fs = require("fs");

module.exports = {
	botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS"],
	userPermissions: [],
	enabled: true,
	guildOnly: false,
	ownerOnly: true,
	name: "unblacklist",
	aliases: [],
	description: "Unblacklist a user.",
	detailedDescription: "Allows a user to use the bot again.",
	cooldown: 0,
	args: [
		{
			name: "user",
			description: "The user to unblacklist.",
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
		if (!dbUser.blacklisted) {
			return message.reply({
				embeds: [{
					color: client.colors.warning,
					description: client.customEmojis.warning + "That user is already unblacklisted."
				}]
			});
		};
		// Blacklist the user.
		dbUser.setBlacklisted(false);
		client.database.write();
		return message.reply({
			embeds: [{
				color: client.colors.success,
				description: client.customEmojis.check + " " + user.username + " has been unblacklisted."
			}]
		});
	}
};