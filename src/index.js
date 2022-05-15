const Discord = require('discord.js');
const Loaders = require('./utils/loaders/loaders');
const config = require('./config/config.json');
const Database = require('./structures/DatabaseManager');

const client = new Discord.Client({
	intents: new Discord.IntentsBitField(131071),
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

// Load loaders
Loaders.eventLoader(client);

// Load all commands
Loaders.messageCommandLoader(client);
Loaders.interactionCommandLoader(client);

// Load the database
client.database = new Database().load();

client.login(config.token);