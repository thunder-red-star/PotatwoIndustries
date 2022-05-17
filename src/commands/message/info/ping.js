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
		const msg = await message.channel.send("Ping?");
		const ping = msg.createdTimestamp - message.createdTimestamp;
		const apiPing = this.client.ws.ping;
		msg.edit(`Pong! Latency is ${ping}ms. API Latency is ${apiPing}ms.`);
	}
}
