// Potatwo Industries Interaction Command Loader
const fs = require('fs');
const Chalk = require('chalk');
const { Collection } = require('discord.js');

module.exports = (client) => {
	console.log(Chalk.green('[Interaction Command Loader]'), 'Loading interaction commands...');
	client.interactionCommands = new Collection();
	let commandDirectories = fs.readdirSync('./src/commands/interaction');
	for (let i = 0; i < commandDirectories.length; i++) {
		let commandDirectory = commandDirectories[i];
		let commandFiles = fs.readdirSync(`./src/commands/interaction/${commandDirectory}`);
		for (let j = 0; j < commandFiles.length; j++) {
			let commandFile = commandFiles[j];
			if (!commandFile.endsWith('.js')) {
				continue;
			}
			let command = require(`../../commands/interaction/${commandDirectory}/${commandFile}`);
			client.interactionCommands.set(command.name, command);
			console.log(Chalk.green('[Interaction Command Loader]'), `Loaded interaction command: ${command.name}`);
		}
	}
	return client;
}