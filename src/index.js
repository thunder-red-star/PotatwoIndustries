const Discord = require('discord.js');
const eventLoader = require('./utils/events/eventLoader');
const config = require('./config/config.json');

const client = new Discord.Client({
	intents: new Discord.IntentsBitField(131072),
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

// Load events
eventLoader(client);

client.login(config.token);