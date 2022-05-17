// Bot say command.

module.exports = {
	botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES"],
	userPermissions: ["MANAGE_MESSAGES"],
	enabled: true,
	guildOnly: false,
	ownerOnly: false,
	name: "prefix",
	aliases: ["trigger"],
	description: "Set the bot's server prefix.",
	detailedDescription: "Allows server managers to set the bot's prefix for the server (the ones used for message commands). Not specifying a prefix will reset the server's prefix to the default one.",
	cooldown: 2500,
	args: [
		{
			name: "prefix",
			description: "The prefix to set. Not specifying a prefix will reset the server's prefix.",
			type: "string",
			required: false
		}
	],
	run: async function(message, client, args) {
		let prefix = args.prefix;
		if (!prefix || prefix === null) {
			client.database.servers.get(message.guild.id).setPrefix(client.config.defaultPrefix);
			return message.reply({
				embed: {
					title: "Prefix Reset",
					description: client.customEmojis.check + " The server's prefix has been reset to `" + client.config.defaultPrefix + "`.",
					color: client.colors.success
				}
			});
		} else {
			if (prefix.split(" ").length > 1) {
				return message.reply({
					embed: {
						title: "Prefix Error",
						description: client.customEmojis.warning + " The prefix cannot contain spaces.",
						color: client.colors.warning
					}
				});
			}
			if (prefix.length > 5) {
				return message.reply({
					embed: {
						title: "Prefix Error",
						description: client.customEmojis.warning + " The prefix cannot be longer than 5 characters.",
						color: client.colors.warning
					}
				});
			}
			else {
				client.database.servers.get(message.guild.id).setPrefix(prefix);
				return message.reply({
					embed: {
						title: "Prefix Set",
						description: client.customEmojis.check + " The server's prefix has been set to `" + prefix + "`.",
						color: client.colors.success
					}
				});
			}
		}
		// Write to database.
		client.database.write();
	}
};