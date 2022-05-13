const Discord = require('discord.js');

const client = new Discord.Client({
	intents: new Discord.IntentsBitField(131072),
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})