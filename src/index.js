const Discord = require('discord.js');
const Loaders = require('./utils/loaders/loaders');
const config = require('./config/config.json');
const Database = require('./structures/DatabaseManager');
const Messages = require('./assets/messages.json');

const client = new Discord.Client({
	intents: new Discord.IntentsBitField(131071),
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

client.config = config;

// Load loaders
Loaders.eventLoader(client);

// Load all commands
Loaders.messageCommandLoader(client);
Loaders.interactionCommandLoader(client);

// Load the database
client.database = new Database();
client.database.load();
client.messages = Messages;

client.login(config.token);