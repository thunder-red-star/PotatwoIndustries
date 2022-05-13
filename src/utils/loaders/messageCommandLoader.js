// Potatwo Industries Message Command Loader
const fs = require('fs');
const Chalk = require('chalk');
const { Collection } = require('@discordjs/builders');

module.exports = (client) => {
	console.log(Chalk.green('[Message Command Loader]'), 'Loading message commands...');
	client.messageCommands = new Collection();
	let commandDirectories = fs.readdirSync('./src/message');
	for (let i = 0; i < commandDirectories.length; i++) {
		let commandDirectory = commandDirectories[i];
		let commandFiles = fs.readdirSync(`./src/messageCommands/${commandDirectory}`);
		for (let j = 0; j < commandFiles.length; j++) {
			let commandFile = commandFiles[j];
			if (!commandFile.endsWith('.js')) {
				continue;
			}
			let command = require(`./${commandDirectory}/${commandFile}`);
			client.messageCommands.set(command.name, command);
			console.log(Chalk.green('[Message Command Loader]'), `Loaded message command: ${command.name}`);
		}
	}
	return client;
}