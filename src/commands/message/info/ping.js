// Bot ping command.

module.exports = {
	botPermissions: ["SEND_MESSAGES"],
	userPermissions: [],
	enabled: true,
	guildOnly: false,
	ownerOnly: false,
	name: "ping",
	aliases: ["pong"],
	description: "Check the bot's ping.",
	detailedDescription: "Sends a message containing the bot's latency and API ping.",
	cooldown: 1000,
	args: [],
	run: async function(message, client, args) {
		const msg = await message.reply({
			content: "Ping?",
		});
		const ping = msg.createdTimestamp - message.createdTimestamp;
		const apiPing = client.ws.ping;
		msg.edit({
			content: `🏓 Pong! Latency is ${ping}ms. API Latency is ${apiPing}ms.`,
		});
	}
}
