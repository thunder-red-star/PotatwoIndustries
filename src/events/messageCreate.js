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
	let prefix = client.getServerPrefix(message);
	if (!message.content.startsWith(prefix)) return;

	// Get the command and the args
	let command = message.content.split(" ")[0].slice(prefix.length);

	// Check if the command exists
	let cmd = client.messageCommands.get(command);
	if (!cmd) {
		cmd = client.messageCommands.get(client.messageCommandAliases.get(command));
		if (!cmd) return;
	}

	// Check if the command is enabled
	if (!cmd.enabled) return;

	// Check if the command is in the guild
	if (cmd.guildOnly && !guild) return;

	// Check if the command user was blacklisted
	let user = client.database.users.get(message.author.id);
	if (user) {
		if (user.blacklisted) return;
	}

	// Permission check for bot, if command was used in a guild
	let me = await guild.members.fetch(client.user.id);
	if (cmd.botPermissions && guild) {
		for (let perm of cmd.botPermissions) {
			if (!me.permissions.has(perm)) {
				try {
					return message.channel.send({
						content: client.messages.botNoPermission.replace("{permission}", perm),
					});
				} catch (err) {
					// DM the user if the bot can't send messages to the channel
					return message.author.send({
						content: client.messages.botNoPermissionDM.replace("{permission}", perm),
					});
				}
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
		if (cooldown.has(message.author.id) && cooldown.get(message.author.id) > Date.now()) {
			let time = cooldown.get(message.author.id);
			let remaining = time - Date.now();
			return message.channel.send({
				content: client.messages.cooldown.replace("{time}", ms(remaining, { long: true }))
			});
		}
	}

  // The command is not in cooldown, so we can run the command
	try {
		let parsedArgs = await ArgsParser(message, cmd.args);
		// If the parsed args does not contain every required argument, return an error
		for (let arg of cmd.args) {
			if (arg.required && (parsedArgs[arg.name] === undefined || parsedArgs[arg.name] === null)) {
				return message.channel.send({
					content: client.messages.noArgs.replace("{argument}", arg.name).replace("{type}", arg.type)
				});
			}
		}
		cmd.run(message, client, parsedArgs);
		console.log(`[${message.guild.name}] ${message.author.tag} ran the command ${cmd.name}`);
		// Add the command to the cooldown collection
		if (client.cooldowns.has(command)) {
			let cooldown = client.cooldowns.get(command);
			cooldown.set(message.author.id, Date.now() + cmd.cooldown);
		} else {
			client.cooldowns.set(command, new Collection());
			let cooldown = client.cooldowns.get(command);
		}
	} catch (err) {
		console.error(err);
		return message.channel.send({
			content: client.messages.unexpectedError.replace("{error}", err.stack)
		});
	}
}
