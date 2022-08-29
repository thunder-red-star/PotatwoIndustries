// Bot purge command.

module.exports = {
	botPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES", "KICK_MEMBERS"],
	userPermissions: ["BAN_MEMBERS"],
	enabled: true,
	guildOnly: false,
	ownerOnly: false,
	name: "ban",
	aliases: [],
	description: "Ban a user from the server.",
	detailedDescription: "Ban a user from the server.",
	cooldown: 2500,
	args: [
		{
			name: "user",
			description: "The user to ban.",
			type: "member",
			required: true
		}, {
			name: "reason",
			description: "The reason for the ban.",
			type: "string",
			required: false
		}
	],
	run: async function(message, client, args) {
		// Get the user to ban.
		let user = args.user;

		// Check if the user is in the server.
		if (!message.guild.members.cache.has(user.id)) {
			return message.reply({
				embeds: [{
					title: "Error",
					description: client.customEmojis.cross + " That user is not in the server.",
					color: client.colors.error
				}]
			})
		}

		let member = message.guild.members.cache.get(user.id);

		// Check if the user is the bot.
		if (user.id === client.user.id) {
			return message.reply({
				embeds: [{
					title: "Error",
					description: client.customEmojis.cross + " I cannot ban myself.",
					color: client.colors.error
				}]
			})
		}

		// Check if the user is trying to ban themselves.
		if (user.id === message.author.id) {
			return message.reply({
				embeds: [{
					title: "Error",
					description: client.customEmojis.cross + " You cannot ban yourself.",
					color: client.colors.error
				}]
			})
		}

		// Check if the user is trying to ban a person with a higher or equal role.
		if (member.roles.highest.position >= message.member.roles.highest.position) {
			return message.reply({
				embeds: [{
					title: "Error",
					description: client.customEmojis.cross + " That person has higher or equal roles than you.",
					color: client.colors.error
				}]
			})
		}

		// Check if the user is trying to ban a person with a higher or equal role than the bot.
		if (member.roles.highest.position >= message.guild.me.roles.highest.position) {
			return message.reply({
				embeds: [{
					title: "Error",
					description: client.customEmojis.cross + " That person has higher or equal roles than me.",
					color: client.colors.error
				}]
			})
		}

		// Ban the user.
		await member.ban(`Banned by ${message.author.tag} for ${args.reason ? args.reason : "No reason given."}`);

		// Send a message to the user.
		await user.send({
			embeds: [{
				title: "Banned",
				description: `You have been banned by ${message.author.tag} from ${message.guild.name} for ${args.reason ? args.reason : "No reason given."}`,
				color: client.colors.error
			}]
		});

		// Send a message to the server.
		return message.reply({
			embeds: [{
				title: "Banned",
				description: `${client.customEmojis.check} ${user.tag} has been banned by ${message.author.tag} for ${args.reason ? args.reason : "No reason given."}`,
				color: client.colors.success
			}]
		});
	}
}
