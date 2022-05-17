// Message Create event
const ms = require('ms');
const ArgsParser = require('../utils/parsers/argParser');
const {Collection} = require("discord.js");

module.exports = async (message) => {
	let client = message.client;

	// Ignore bots and webhooks
	if (message.author.bot) return;
	if (message.webhookId) return;

	// Check if the message starts with the prefix
	let guild = message.guild;
	let prefix;
	try {
		prefix = client.database.servers.get(guild.id).getPrefix();
	} catch (e) {
		prefix = client.config.prefix;
	}
	console.log(`Prefix: ${prefix}`);
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

	// Check if the command user was blacklisted
	if (client.database.users.get(message.author.id).isBlacklisted()) return;

	// Permission check for bot, if command was used in a guild
	if (cmd.botPermissions && guild) {
		for (let perm of cmd.botPermissions) {
			try {
				if (!guild.members.cache.get(client.user.id).permissions.has(perm)) return message.channel.send({
					content: client.messages.botNoPermission,
				});
			} catch (err) {
				// DM the user if the bot can't send messages to the channel
				return message.author.send({
					content: client.messages.botNoPermissionDM,
				});
			}
		}
	}

	// After this point we can assume the bot has the permissions to send messages in the channel

	// Permission check for member using command, but skip the check if command was not used in a guild
	if (cmd.memberPermissions && guild) {
		let member = guild.members.cache.get(message.author.id);
		if (!member) return;
		for (let perm of cmd.userPermissions) {
			if (!member.permissions.has(perm)) return message.channel.send({
				content: client.messages.userNoPermission,
			})
		}
	}

	// Owner only check
	if (cmd.ownerOnly && message.author.id !== client.config.owner) return message.channel.send({
		content: client.messages.ownerOnly
	})

	// Check if the command is in cooldown. The command cooldown will be found in client.cooldowns in the collection with the command name
	if (client.cooldowns.has(command)) {
		let cooldown = client.cooldowns.get(command);
		if (cooldown.has(message.author.id)) {
			let time = cooldown.get(message.author.id);
			let remaining = time - Date.now();
			return message.channel.send({
				content: client.messages.cooldown.replace("{time}", ms(remaining, { long: true }))
			});
		}
	}

  // The command is not in cooldown, so we can run the command
	try {
		cmd.run(client, message, ArgsParser(message, cmd.args));
		console.log(`[${message.guild.name}] ${message.author.tag} ran the command ${cmd.name}`);
		// Add the command to the cooldown collection
		if (client.cooldowns.has(command)) {
			let cooldown = client.cooldowns.get(command);
			cooldown.set(message.author.id, Date.now() + cmd.cooldown);
		} else {
			client.cooldowns.set(command, new Collection());
			let cooldown = client.cooldowns.get(command);
			cooldown.set(message.author.id, Date.now() + cmd.cooldown);
		}
	} catch (err) {
		console.error(err);
		return message.channel.send({
			content: client.messages.unexpectedError.replace("{error}", err.stack)
		});
	}
}
