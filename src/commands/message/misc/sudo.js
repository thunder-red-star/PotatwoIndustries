// Bot sudo command.

module.exports = {
	botPermissions: ["SEND_MESSAGES"],
	userPermissions: [],
	enabled: true,
	guildOnly: false,
	ownerOnly: false,
	name: "sudo",
	aliases: ["pretend", "sayas"],
	description: "Say something as another user.",
	detailedDescription: "Using a Discord webhook, say something as another user.",
	cooldown: 2000,
	args: [
		{
			name: "user",
			description: "The user to say as.",
			type: "user",
			required: true
		},
		{
			name: "message",
			description: "The message to send.",
			type: "string",
			required: true
		}
	],
	run: async function(message, client, args) {
		// Get the user to say as and the message to send.
		let user = args.user;
		let messageToSend = args.message;

		// Attempt to create a webhook.
		let webhook;
		try {
			webhook = await message.channel.createWebhook({
				name: user.username,
				avatar: user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }),
				reason: "Sending as " + user.username
			});
		} catch (e) {
			console.log(e.stack);
			return message.reply({
				embeds: [{
					title: "Error",
					description: client.customEmojis.cross + " I could not create a webhook, there could be too many webhooks in the server.",
					color: client.colors.error
				}]
			});
		}

		// Send the message as the webhook.
		await webhook.send({
			content: messageToSend,
			attachments: message.attachments.array().map(attachment => {
				return new Discord.AttachmentBuilder(attachment.url, attachment.name)
			})
		});
	}
}
