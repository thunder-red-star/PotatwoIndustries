// Ready event
const Chalk = require('chalk');

module.exports = async (client) => {
	console.clear();
  console.log(`${Chalk.bold.green(client.user.tag)} ${Chalk.green('is ready!')}`);
  console.log(`I am in ${Chalk.bold.green(client.guilds.size)} servers!`);
  client.user.setPresence({
	status: 'online',
	activity: {
		name: 'potatoes',
		type: 'PLAYING'
	}
  });
}