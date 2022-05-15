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
}
