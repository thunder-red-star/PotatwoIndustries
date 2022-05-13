// Potatwo Industries Event Loader
const fs = require('fs');
const Chalk = require('chalk');

module.exports = (client) => {
	let events = fs.readdirSync('./src/utils/events/');
	for (let i = 0; i < events.length; i++) {
		if (!events[i].endsWith('.js')) {
			return;
		}
		let event = events[i].split('.')[0];
		let eventFile = require(`../events/${event}`);
		client.on(event, (...args) => eventFile.run(client, ...args));
		console.log(Chalk.green(`Loaded event: ${event}`));
	}
}