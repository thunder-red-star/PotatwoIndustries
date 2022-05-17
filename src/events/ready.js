// Ready event
const Chalk = require('chalk');
const { Collection } = require('discord.js');

module.exports = async (client) => {
	// Prepare cooldown collection
	client.cooldowns = new Collection();

	// For each command, create a cooldown collection and add it to the original cooldown collection
	client.messageCommands.forEach(command => {
		client.cooldowns.set(command.name, new Collection());
	});

	client.interactionCommands.forEach(command => {
		if (client.cooldowns.get(command.name)) return;
		client.cooldowns.set(command.name, new Collection());
	});

  console.log(`${Chalk.bold.green(client.user.tag)} ${Chalk.green('is ready!')}`);
  console.log(`I am in ${Chalk.bold.green(client.guilds.cache.size)} ${client.guilds.cache.size === 1 ? 'server' : 'servers'}!`);
  client.user.setPresence({
	status: 'online',
	activity: {
		name: 'potatoes',
		type: 'PLAYING'
	}
  });
}