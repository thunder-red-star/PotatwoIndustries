// Message Create event

module.exports = async (message) => {
	let client = message.client;

	// Ignore bots and webhooks
	if (message.author.bot) return;
	if (message.webhookId) return;

	// Check if the message starts with the prefix
	let guild = message.guild;
	let serverPrefix = client.database.servers.get(guild.id).getPrefix();
	let prefix = serverPrefix || client.config.prefix;
	if (!message.content.startsWith(prefix)) return;

	// Get the command and the args
	let command = message.content.split(" ")[0].slice(prefix.length);

	// Check if the command exists
	let cmd = client.messageCommands.get(command);
	if (!cmd) return;

	// Check if the command is enabled
	if (!cmd.enabled) return;

	// Check if the command is in the guild
	if (cmd.guildOnly && !guild) return;

	// Permission check for member using command, but skip the check if command was not used in a guild
	if (cmd.memberPermissions && guild) {
		let member = guild.members.cache.get(message.author.id);
		if (!member) return;
		for (let perm of cmd.userPermissions) {
			if (!member.permissions.has(perm)) return;
		}
	}

	// Permission check for bot, if command was used in a guild
	if (cmd.botPermissions && guild) {
		for (let perm of cmd.botPermissions) {
			if (!guild.members.cache.get(client.user.id).permissions.has(perm)) return;
		}
	}
}
