const Discord = require('discord.js');
const Loaders = require('./utils/loaders/loaders');
const config = require('./config/config.json');

const client = new Discord.Client({
	intents: new Discord.IntentsBitField(131072),
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

// Load loaders
Loaders.eventLoader(client);

// Load all commands
Loaders.messageCommandLoader(client);
Loaders.interactionCommandLoader(client);

client.login(config.token);