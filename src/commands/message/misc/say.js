// Bot say command.

module.exports = {
	botPermissions: ["SEND_MESSAGES"],
	userPermissions: [],
	enabled: true,
	guildOnly: false,
	ownerOnly: false,
	name: "say",
	aliases: ["echo"],
	description: "Say something.",
	detailedDescription: "Sends a specified message to the channel from the bot. Removes mentions from the message.",
	cooldown: 2500,
	args: [
		{
			name: "message",
			description: "The message to send.",
			type: "string",
			required: true
		}
	],
	run: async function(message, client, args) {
		// Assume args are all parsed, and provided as an object with keys. Get the message key.
		let messageToSend = args.message;

		// Clear the message content of ping and mention mentions.
		messageToSend = messageToSend.replace(/<@!?\d+>/g, "").replace(/<@&\d+>/g, "");

		// Send the message.
		message.channel.send(messageToSend);
	}
}
