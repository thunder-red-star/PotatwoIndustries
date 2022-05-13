// Ready event
const Chalk = require('chalk');

module.exports = async (client) => {
	console.log("=============================================================");
  console.log(`${Chalk.bold.green(client.user.tag)} ${Chalk.green('is ready!')}`);
  console.log(`I am in ${Chalk.bold.green(client.guilds.cache.size)} ${client.guilds.cache.size == 1 ? 'server' : 'servers'}!`);
  client.user.setPresence({
	status: 'online',
	activity: {
		name: 'potatoes',
		type: 'PLAYING'
	}
  });
}