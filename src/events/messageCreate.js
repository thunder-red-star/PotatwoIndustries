// Message Create event

module.exports = async (message) => {
	// Ignore bots and webhooks
	if (message.author.bot) return;
	if (message.webhookId) return;

	// Find the command name
	const command = message.content.split(' ')[0].replace(/\n/g, '').replace(/\s/g, '');
}
