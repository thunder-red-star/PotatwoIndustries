const Discord = require('discord.js');
const Loaders = require('./utils/loaders/loaders');
const config = require('./config/config.json');
const colors = require('./assets/colors.json');
const emojis = require('./assets/emojis.json');
const Database = require('./structures/DatabaseManager');
const Messages = require('./assets/messages.json');
const Chalk = require('chalk');

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
console.log(Chalk.green("[Database]") + " Loaded JSON database");

client.messages = Messages;
client.colors = colors;
client.customEmojis = emojis;

client.login(config.token);